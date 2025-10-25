import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PlantForm({onSubmit, initial}) {
  const navigate = useNavigate()
  const [name, setName] = useState(initial?.name || '')
  const [interval, setInterval] = useState(initial?.water_interval_days || 7)
  const [notes, setNotes] = useState(initial?.notes || '')
  const [photo, setPhoto] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    const payload = { name, water_interval_days: interval, notes }
    if(photo) payload['photo'] = photo
    await onSubmit(payload)
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header>
        <h1>🌱 {initial ? 'Editar' : 'Nova'} Planta</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>
      </header>

      {/* FORMULÁRIO */}
      <div className="card">
        <h2>📝 Informações da Planta</h2>
        
        <form onSubmit={handleSubmit}>
          {/* NOME */}
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

          {/* INTERVALO */}
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

          {/* OBSERVAÇÕES */}
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

          {/* FOTO */}
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

          {/* BOTÕES */}
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
            <button className="btn btn-primary" type="submit">
              ✅ Salvar Planta
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
