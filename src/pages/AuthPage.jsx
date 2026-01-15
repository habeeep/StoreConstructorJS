import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setEmail } from '../slices/authSlice'
import { authLogin, authRegister } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGetCode = async () => {
    if (!emailInput) return
    setLoading(true)
    try {
      await authLogin(emailInput)
    } catch (err) {
      try {
        await authRegister(emailInput)
      } catch (err2) {
        console.error('register/login failed', err2)
        setLoading(false)
        return
      }
    }
    dispatch(setEmail(emailInput))
    setLoading(false)
    navigate('/verify')
  }

  return (
    <div className="page center">
      <h1>Вход / Регистрация</h1>
      <p>Введите почту, чтобы получить код</p>
      <input value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="email@example.com" />
      <button onClick={handleGetCode} disabled={loading}>{loading ? 'Отправка...' : 'Получить код'}</button>
    </div>
  )
}
