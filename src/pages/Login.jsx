import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await login(username, password)
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError('❌ Usuário ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* CARD DE LOGIN */}
      <div className="auth-card">
        {/* LOGO/HEADER */}
        <div className="auth-header">
          <div className="auth-logo">🌿</div>
          <h1 className="auth-title">PlantaE</h1>
          <p className="auth-subtitle">Gerencie suas plantas com carinho</p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* USUÁRIO */}
          <div className="form-group">
            <label>👤 Usuário</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
              autoFocus
            />
          </div>

          {/* SENHA */}
          <div className="form-group">
            <label>🔒 Senha</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {/* MENSAGEM DE ERRO */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* BOTÃO ENTRAR */}
          <button
            type="submit"
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? '⏳ Entrando...' : '🚀 Entrar'}
          </button>
        </form>

        {/* LINK PARA REGISTRO */}
        <div className="auth-footer">
          <p>Não tem uma conta?</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/register')}
          >
            📝 Criar conta
          </button>
        </div>
      </div>

      {/* DECORAÇÃO DE FUNDO */}
      <div className="auth-decoration auth-decoration-1">🌱</div>
      <div className="auth-decoration auth-decoration-2">🍃</div>
      <div className="auth-decoration auth-decoration-3">🌿</div>
      <div className="auth-decoration auth-decoration-4">🪴</div>
    </div>
  )
}
