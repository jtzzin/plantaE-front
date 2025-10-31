import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listActivities, listPlants } from '../api'

function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function iconFor(action) {
  if (action === 'create') return '➕'
  if (action === 'delete') return '🗑️'
  if (action === 'water')  return '💧'
  if (action === 'update') return '✏️'
  return '🗒️'
}

function describe(action) {
  if (action === 'create') return 'Planta cadastrada'
  if (action === 'delete') return 'Planta excluída'
  if (action === 'water')  return 'Planta regada'
  if (action === 'update') return 'Planta atualizada'
  return action
}

function renderChanges(extra) {
  const changes = extra?.changes
  const photoChanged = extra?.photo_changed
  if ((!changes || changes.length === 0) && !photoChanged) return null

  const labels = {
    name: 'Nome',
    water_interval_days: 'Intervalo de rega (dias)',
    notes: 'Observações'
  }
  return (
    <ul style={{ marginTop: 6, paddingLeft: 18 }}>
      {changes?.map((c, idx) => (
        <li key={idx} style={{ color: 'var(--color-text-secondary)' }}>
          {labels[c.field] || c.field}: “{c.from ?? '—'}” → “{c.to ?? '—'}”
        </li>
      ))}
      {photoChanged && (
        <li style={{ color: 'var(--color-text-secondary)' }}>
          Foto atualizada
        </li>
      )}
    </ul>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [plantId, setPlantId] = useState('')
  const [day, setDay] = useState('')
  const [loadedPlants, setLoadedPlants] = useState(false)

  const plantMap = useMemo(() => {
    const m = new Map()
    plants && plants.forEach && plants.forEach(p => m.set(p._id || p.id, p.name))
    return m
  }, [plants])

  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true)
      let ps = plants && plants.forEach ? plants : []
      if (!loadedPlants) {
        try {
          ps = await listPlants() || []
          if (active) {
            setPlants(ps)
            setLoadedPlants(true)
          }
        } catch {}
      }
      try {
        const acts = await listActivities({ plantId: plantId || undefined, day: day || undefined }) || []
        if (active) setActivities(Array.isArray(acts) ? acts : [])
      } catch {}
      if (active) setLoading(false)
    }
    run()
    return () => { active = false }
  }, [plantId, day, loadedPlants])

  return (
    <div className="app-container">
      <header>
        <h1>🗒️ Histórico</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ Voltar</button>
        </div>
      </header>
      <div className="card">
        <h2>Movimentações</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div className="form-group" style={{ minWidth: 220 }}>
            <label>Filtrar por planta</label>
            <select className="form-control" value={plantId} onChange={(e) => setPlantId(e.target.value)}>
              <option value="">Todas</option>
              {(plants || []).map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: 200 }}>
            <label>Dia</label>
            <input className="form-control" type="date" value={day} onChange={(e) => setDay(e.target.value)} />
          </div>
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => { setPlantId(''); setDay('') }}>🧹 Limpar filtros</button>
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>Carregando histórico...</p>
          </div>
        ) : (activities?.length ?? 0) === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗒️</div>
            <h3>Nenhuma movimentação</h3>
            <p>Aqui aparecerão inclusões, edições, exclusões e regas realizadas.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {activities.map((a) => {
              // Para 'create', mostra o horário real da primeira rega salvo no extra
              const dateToShow = a.action === 'create' && a.extra?.first_watered ? a.extra.first_watered : a.at
              return (
                <li key={a._id} style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ marginRight: 8 }}>{iconFor(a.action)}</span>
                      <strong>{describe(a.action)}</strong> — {a.plant_name || plantMap.get(a.plant_id) || 'Planta'}
                      {a.action === 'update' && renderChanges(a.extra)}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                      {formatDateTime(dateToShow)}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
