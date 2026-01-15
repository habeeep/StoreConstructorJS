import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authVerify, authResend } from '../api/client'
import { setVerified } from '../slices/authSlice'

export default function VerifyPage() {
  const email = useSelector(s => s.auth.email)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleVerify = async () => {
    if (!email) return navigate('/auth')
    setLoading(true)
    try {
      await authVerify(email, Number(code))
      dispatch(setVerified(true))
      navigate('/customize')
    } catch (err) {
      console.error('verify failed', err)
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    try {
      await authResend(email)
      alert('Код отправлен повторно')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="page center">
      <h1>Подтвердите код</h1>
      <p>На {email} отправлен код</p>
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="код" />
      <div className="button-group">
        <button onClick={handleVerify} disabled={loading}>{loading ? 'Проверка...' : 'Проверить'}</button>
        <button onClick={handleResend}>Отправить код снова</button>
      </div>
    </div>
  )
}
