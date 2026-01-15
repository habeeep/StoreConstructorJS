import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import VerifyPage from './pages/VerifyPage'
import CreateStore from './pages/CreateStore'
import Stats from './pages/Stats'
import Header from './components/Header'
import { useSelector, useDispatch } from 'react-redux'
import { restoreAuth, setLoading } from './slices/authSlice'

export default function App() {
  const dispatch = useDispatch()
  const verified = useSelector(state => state.auth.verified)
  const isLoading = useSelector(state => state.auth.isLoading)

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth')
    if (savedAuth) {
      try {
        const authState = JSON.parse(savedAuth)
        dispatch(restoreAuth(authState))
      } catch (error) {
        console.error('Failed to restore auth state:', error)
        dispatch(setLoading(false))
      }
    } else {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  if (isLoading) {
    return <div className="page center"><p>Загрузка...</p></div>
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to={verified ? '/customize' : '/auth'} replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route
          path="/customize"
          element={verified ? <CreateStore /> : <Navigate to="/auth" replace />}
        />
        <Route path="/stats" element={verified ? <Stats /> : <Navigate to="/auth" replace />} />
      </Routes>
    </>
  )
}
