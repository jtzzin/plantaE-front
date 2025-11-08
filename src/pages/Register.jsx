import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

// Esquema de validação Zod para o registro
const schema = z.object({
  username: z.string().min(3, 'Usuário muito curto').max(30, 'Usuário muito longo'),
  password: z.string().min(5, 'Senha muito curta').max(32, 'Senha muito longa'),
})

export default function Register() {
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

    // Validação Zod antes de chamar backend
    const validate = schema.safeParse({ username, password })
    if (!validate.success) {
      setError(validate.error.issues[0].message)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('https://plantae-backend-g2kc.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ Conta criada com sucesso! Faça login.')
        navigate('/login')
      } else {
        setError(data.msg || 'Erro ao criar conta')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-decoration auth-decoration-1">🌿</div>
      <div className="auth-decoration auth-decoration-2">🌱</div>
      <div className="auth-decoration auth-decoration-3">🍀</div>
      <div className="auth-decoration auth-decoration-4">🌳</div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🌿</div>
          <h1 className="auth-title">PlantaE</h1>
          <p className="auth-subtitle">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>👤 Usuário</label>
            <input
              type="text"
              className="form-control"
              placeholder="Escolha um usuário"
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
                placeholder="Escolha uma senha"
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
            {loading ? '⏳ Criando conta...' : '📝 Criar conta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Já tem uma conta?</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
          >
            🚀 Entrar
          </button>
        </div>
      </div>
    </div>
  )
}
