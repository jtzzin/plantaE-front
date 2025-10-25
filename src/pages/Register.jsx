import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validação de senhas
    if (password !== confirmPassword) {
      setError('❌ As senhas não coincidem')
      return
    }

    if (password.length < 4) {
      setError('❌ A senha deve ter pelo menos 4 caracteres')
      return
    }

    setLoading(true)

    try {
      await register(username, password)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('❌ Erro ao criar conta. Usuário já existe?')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🎉</div>
            <h1 className="auth-title">Conta Criada!</h1>
            <p className="auth-subtitle">Redirecionando para o login...</p>
          </div>
          <div className="badge badge-success" style={{ fontSize: '16px', padding: '16px' }}>
            ✅ Cadastro realizado com sucesso!
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      {/* CARD DE REGISTRO */}
      <div className="auth-card">
        {/* LOGO/HEADER */}
        <div className="auth-header">
          <div className="auth-logo">🌱</div>
          <h1 className="auth-title">Criar Conta</h1>
          <p className="auth-subtitle">Junte-se à comunidade PlantaE</p>
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
              placeholder="Escolha um nome de usuário"
              required
              autoFocus
              minLength="3"
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
              placeholder="Escolha uma senha segura"
              required
              minLength="4"
            />
          </div>

          {/* CONFIRMAR SENHA */}
          <div className="form-group">
            <label>🔒 Confirmar Senha</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
              required
              minLength="4"
            />
          </div>

          {/* MENSAGEM DE ERRO */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* BOTÃO CRIAR CONTA */}
          <button
            type="submit"
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? '⏳ Criando conta...' : '🚀 Criar Conta'}
          </button>
        </form>

        {/* LINK PARA LOGIN */}
        <div className="auth-footer">
          <p>Já tem uma conta?</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
          >
            🔑 Fazer Login
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
