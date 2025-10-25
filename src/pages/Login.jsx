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
      
      // ===== VERIFICAÇÃO SE O TOKEN EXISTE =====
      if (!data.access_token) {
        throw new Error(data.msg || 'Erro ao fazer login')
      }
      
      localStorage.setItem('token', data.access_token)
      console.log('✅ Token salvo:', data.access_token) // DEBUG
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
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🌿</div>
          <h1 className="auth-title">PlantaE</h1>
          <p className="auth-subtitle">Gerencie suas plantas com carinho</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

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

      <div className="auth-decoration auth-decoration-1">🌱</div>
      <div className="auth-decoration auth-decoration-2">🍃</div>
      <div className="auth-decoration auth-decoration-3">🌿</div>
      <div className="auth-decoration auth-decoration-4">🪴</div>
    </div>
  )
}
