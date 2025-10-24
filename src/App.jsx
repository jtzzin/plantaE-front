import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PlantDetails from './pages/PlantDetails'
import './index.css'

// Aplicação principal com rotas. Todas as labels em português.

function Navbar(){ 
  // Simples navbar com botão de logout
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('token'); navigate('/login') }
  return (
    <div className="header">
      <h1 style={{color:'#1b5e20'}}>PlantaE</h1>
      <div>
        <Link to="/" className="link" style={{marginRight:12}}>Minhas Plantas</Link>
        <button className="button secondary" onClick={logout}>Sair</button>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <div className="container">
        <div className="card" style={{padding:18}}>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/" element={<><Navbar/><Dashboard/></>} />
            <Route path="/plant/:id" element={<><Navbar/><PlantDetails/></>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
