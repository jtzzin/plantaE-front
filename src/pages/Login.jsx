import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

// Esquema de validação Zod
const schema = z.object({
  username: z.string().min(3, 'Usuário muito curto').max(30, 'Usuário muito longo'),
  password: z.string().min(5, 'Senha muito curta').max(32, 'Senha muito longa'),
})

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

    // Validação Zod antes de chamar o backend
    const validate = schema.safeParse({ username, password })
    if (!validate.success) {
      setError(validate.error.issues[0].message)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('https://plantae-backend-g2kc.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()
      if (!data.access_token) {
        throw new Error(data.msg || 'Erro ao fazer login')
      }
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')

    } catch (err) {
      setError('Usuário ou senha incorretos')
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
            {loading ? ' Entrando...' : ' Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Não tem uma conta?</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/register')}
          >
             Criar conta
          </button>
        </div>
      </div>
    </div>
  )
}
