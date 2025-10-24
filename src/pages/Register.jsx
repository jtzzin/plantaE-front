import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'

// Página de registro simples, comentários em português.
export default function Register(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    const res = await register(username, password)
    if(res && res.msg === 'criado'){
      setMsg('Usuário criado com sucesso. Faça login.')
      setTimeout(()=>navigate('/login'), 1200)
    } else {
      setMsg(res.msg || 'Erro ao criar usuário')
    }
  }

  return (
    <div>
      <h2>Registrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Usuário</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Senha</label>
          <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {msg && <div>{msg}</div>}
        <div style={{display:'flex', gap:8}}>
          <button className="button" type="submit">Criar conta</button>
        </div>
      </form>
    </div>
  )
}
