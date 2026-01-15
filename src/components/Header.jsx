import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setEmail, setVerified } from '../slices/authSlice'
import '../styles/header.css'

export default function Header() {
  const location = useLocation()
  const dispatch = useDispatch()
  const email = useSelector(s => s.auth.email)
  const verified = useSelector(s => s.auth.verified)

  const handleLogout = () => {
    localStorage.removeItem('auth')
    dispatch(setEmail(null))
    dispatch(setVerified(false))
  }

  if (!verified || !email) return null

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-nav">
          <Link 
            to="/customize" 
            className={`nav-link ${location.pathname === '/customize' ? 'active' : ''}`}
          >
            Оформление
          </Link>
          <Link 
            to="/stats" 
            className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
          >
            Статистика
          </Link>
        </div>
        <div className="header-user">
          <span className="user-email">{email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Выход
          </button>
        </div>
      </div>
    </header>
  )
}
