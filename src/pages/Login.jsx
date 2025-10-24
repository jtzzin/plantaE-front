import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'

// Página de login em português com comentários explicativos.
export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    const res = await login(username, password)
    if(res && res.access_token){
      // Armazena token no localStorage para uso nas chamadas
      localStorage.setItem('token', res.access_token)
      navigate('/')
    } else {
      setError(res.msg || 'Erro ao autenticar')
    }
  }

  return (
    <div>
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Usuário</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Senha</label>
          <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <div style={{display:'flex', gap:8}}>
          <button className="button" type="submit">Entrar</button>
          <Link to="/register" className="button secondary">Registrar</Link>
        </div>
      </form>
    </div>
  )
}
