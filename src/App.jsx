// frontend/src/App.jsx
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PlantDetails from './pages/PlantDetails'
import NewPlant from './pages/NewPlant'
import History from './pages/History'
import EditPlant from './pages/EditPlant'
import Cronograma from './pages/Cronograma'
import './index.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function GlobalBackground({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const onStorage = () => setTheme(localStorage.getItem('theme') || 'light')
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', theme)
  }, [theme])

  const background = theme === 'dark'
    ? 'var(--color-charcoal-700)'
    : 'linear-gradient(180deg, #212529 0, #343a40 100%)'

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', background, transition: 'background 0.3s' }}>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <GlobalBackground>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/plant/new" element={<ProtectedRoute><NewPlant /></ProtectedRoute>} />
          <Route path="/plant/:id" element={<ProtectedRoute><PlantDetails /></ProtectedRoute>} />
          <Route path="/plant/edit/:id" element={<ProtectedRoute><EditPlant /></ProtectedRoute>} />
          <Route path="/cronograma" element={<ProtectedRoute><Cronograma /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalBackground>
  )
}
