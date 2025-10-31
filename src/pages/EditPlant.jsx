// frontend/src/pages/EditPlant.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPlant, updatePlant } from '../api'

const rangeDays = Array.from({ length: 31 }, (_, i) => i + 1)

export default function EditPlant() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [name, setName] = useState('')
  const [interval, setInterval] = useState(7)
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const p = await getPlant(id)
        if (!active) return
        setName(p?.name || '')
        setInterval(p?.water_interval_days ?? p?.waterintervaldays ?? 7)
        setNotes(p?.notes || '')
      } catch (e) {
        if (active) setError('Falha ao carregar planta')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        name,
        water_interval_days: Number(interval),
        notes
      }
      if (photo) payload.photo = photo
      await updatePlant(id, payload)
      navigate('/dashboard')
    } catch (err) {
      setError(`Erro: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="app-container">
        <header>
          <h1>✏️ Editar Planta</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ Voltar</button>
        </header>
        <div className="card"><p>Carregando...</p></div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header>
        <h1>✏️ Editar Planta</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ Voltar</button>
      </header>

      <div className="card">
        <h2>Informações da Planta</h2>

        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🌿 Nome da planta</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Samambaia" required />
          </div>

          <div className="form-group">
            <label>⏱️ Intervalo de rega (dias)</label>
            <select className="form-control" value={interval} onChange={(e) => setInterval(e.target.value)}>
              {rangeDays.map((d) => (
                <option key={d} value={d}>{d} {d === 1 ? 'dia' : 'dias'}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>📝 Observações</label>
            <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dicas de cuidado, localização, etc..." rows={4} />
          </div>

          <div className="form-group">
            <label>📷 Nova foto (opcional)</label>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" id="plant-photo" />
            <label htmlFor="plant-photo" className="file-input-label">{photo ? photo.name : 'Escolher arquivo'}</label>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar alterações'}</button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
