// importações necessarias
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PlantDetails from './pages/PlantDetails'
import NewPlant from './pages/NewPlant' 
import EditPlant from './pages/EditPlant'
import './index.css'

// ProtectedRoute impede acesso sem login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Componente responsável pelo fundo global
function GlobalBackground({ children }) {
  // Tema armazenado no localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  });

  // Se mudar o tema no toggle, atualiza aqui também:
  useEffect(() => {
    const onStorage = () => setTheme(localStorage.getItem('theme') || 'light');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Fundo escuro ou cinza muito escuro para ambos os temas
  const background = theme === 'dark'
    ? '#181A1B'
    : 'linear-gradient(180deg, #212529 0%, #343a40 100%)'; // degrade cinza/preto para clarear menos

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background,
        transition: "background 0.3s"
      }}
    >
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
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/plant/:id" 
            element={
              <ProtectedRoute>
                <PlantDetails />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/plant/:id/edit"
            element={
              <ProtectedRoute>
               <EditPlant />
            </ProtectedRoute>
            }
          />



          <Route 
            path="/plant/new" 
            element={
              <ProtectedRoute>
                <NewPlant />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalBackground>
  )
}
