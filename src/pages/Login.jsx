import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!data.access_token) {
        throw new Error(data.msg || 'Erro ao fazer login')
      }

      localStorage.setItem('token', data.access_token)
      console.log('✅ Token salvo:', data.access_token)
      navigate('/dashboard')

    } catch (err) {
      console.error('❌ Erro no login:', err)
      setError('❌ Usuário ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Decorações de fundo */}
      <div className="auth-decoration auth-decoration-1">🌿</div>
      <div className="auth-decoration auth-decoration-2">🌱</div>
      <div className="auth-decoration auth-decoration-3">🍀</div>
      <div className="auth-decoration auth-decoration-4">🌳</div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🌿</div>
          <h1 className="auth-title">PlantaE</h1>
          <p className="auth-subtitle">Gerencie suas plantas com carinho</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>👤 Usuário</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>🔒 Senha</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? '⏳ Entrando...' : '🚀 Entrar'}
          </button>
        </form>

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
    </div>
  )
}