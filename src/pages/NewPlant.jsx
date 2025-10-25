import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewPlant() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [interval, setInterval] = useState(7)
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      console.log('=== DEBUG: Criando planta ===')
      console.log('Token:', token ? 'Existe' : 'NÃO EXISTE')
      console.log('Nome:', name)
      console.log('Intervalo:', interval)
      console.log('Notas:', notes)
      
      const plantData = new FormData()
      plantData.append('name', name)
      plantData.append('water_interval_days', interval)
      plantData.append('notes', notes)

      console.log('Fazendo POST para:', 'http://localhost:5000/api/plants/')

      const createResponse = await fetch('http://localhost:5000/api/plants/', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: plantData
      })

      console.log('Status da resposta:', createResponse.status)
      console.log('Resposta OK?', createResponse.ok)

      if (!createResponse.ok) {
        const errorText = await createResponse.text()
        console.log('Erro do backend:', errorText)
        throw new Error(`Erro ${createResponse.status}: ${errorText}`)
      }

      const plantResult = await createResponse.json()
      console.log('Planta criada:', plantResult)

      navigate('/dashboard')
      
    } catch (err) {
      console.error('ERRO COMPLETO:', err)
      setError(`Erro: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>🌱 Nova Planta</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
        >
          ← Voltar
        </button>
      </header>

      <div className="card">
        <h2>📝 Informações da Planta</h2>
        
        {error && (
          <div className="auth-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🌿 Nome da planta</label>
            <input 
              className="form-control" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              placeholder="Ex: Samambaia"
              required 
            />
          </div>

          <div className="form-group">
            <label>💧 Intervalo de rega (dias)</label>
            <select 
              className="form-control" 
              value={interval} 
              onChange={e=>setInterval(e.target.value)}
            >
              <option value="1">1 dia</option>
              <option value="2">2 dias</option>
              <option value="3">3 dias</option>
              <option value="5">5 dias</option>
              <option value="7">7 dias</option>
              <option value="10">10 dias</option>
              <option value="14">14 dias</option>
              <option value="21">21 dias</option>
              <option value="30">30 dias</option>
            </select>
          </div>

          <div className="form-group">
            <label>📝 Observações</label>
            <textarea 
              className="form-control" 
              value={notes} 
              onChange={e=>setNotes(e.target.value)}
              placeholder="Dicas de cuidado, localização, etc..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>📸 Foto (opcional)</label>
            <input 
              type="file" 
              onChange={e=>setPhoto(e.target.files[0])} 
              accept="image/*"
              id="plant-photo"
            />
            <label htmlFor="plant-photo" className="file-input-label">
              📁 {photo ? photo.name : 'Escolher arquivo'}
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button 
              className="btn btn-primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? '⏳ Salvando...' : '✅ Salvar Planta'}
            </button>
            <button 
              className="btn btn-secondary" 
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
