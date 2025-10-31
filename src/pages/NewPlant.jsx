// frontend/src/pages/NewPlant.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPlant } from '../api'

const rangeDays = Array.from({ length: 31 }, (_, i) => i + 1)

// Retorna o horário local atual no formato aceito por <input type="datetime-local">
const nowLocalForInput = () => {
  const d = new Date()
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 16)
}

export default function NewPlant() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [interval, setInterval] = useState(7)
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState(null)

  // Campo opcional; aceita passado ou "agora"; bloqueia futuro via max
  const [firstWaterAt, setFirstWaterAt] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const now = new Date()
      let when = now

      if (firstWaterAt) {
        const parsed = new Date(firstWaterAt)
        // Se o usuário selecionar algo válido e <= agora, usa o valor; senão, força "agora"
        if (!Number.isNaN(parsed.getTime()) && parsed.getTime() <= now.getTime()) {
          when = parsed
        }
      }

      const payload = {
        name,
        water_interval_days: Number(interval),
        notes,
        firstwateringat: when.toISOString(), // sempre envia ISO UTC
      }
      if (photo) payload.photo = photo

      const res = await createPlant(payload)
      if (!res || !res._id) throw new Error('Resposta inesperada da API')
      navigate('/dashboard')
    } catch (err) {
      setError(`Erro: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>🌿 Nova Planta</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ Voltar</button>
      </header>

      <div className="card">
        <h2>Informações da Planta</h2>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🌿 Nome da planta</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Samambaia"
              required
            />
          </div>

          <div className="form-group">
            <label>⏱️ Intervalo de rega (dias)</label>
            <select
              className="form-control"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            >
              {rangeDays.map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? 'dia' : 'dias'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>🕒 Primeira rega (somente passado ou agora)</label>
            <input
              type="datetime-local"
              className="form-control"
              value={firstWaterAt}
              onChange={(e) => setFirstWaterAt(e.target.value)}
              max={nowLocalForInput()}   // bloqueia datas futuras no seletor
            />
            <small style={{ color: 'var(--color-text-secondary)' }}>
              Você pode escolher um horário no passado ou deixar vazio para usar o horário atual (agora).
            </small>
          </div>

          <div className="form-group">
            <label>📝 Observações</label>
            <textarea
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dicas de cuidado, localização, etc..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>📷 Foto (opcional)</label>
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*"
              id="plant-photo"
            />
            <label htmlFor="plant-photo" className="file-input-label">
              {photo ? photo.name : 'Escolher arquivo'}
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Salvando...' : '💾 Salvar Planta'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
