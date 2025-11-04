import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listActivities, listPlants, restorePlant } from '../api'

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
  if (action === 'restore') return '♻️'
  if (action === 'create') return '➕'
  if (action === 'delete') return '🗑️'
  if (action === 'water')  return '💧'
  if (action === 'update') return '✏️'
  return '🗒️'
}
function describe(action) {
  if (action === 'restore') return 'Planta restaurada'
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
  const [allActivities, setAllActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [plantId, setPlantId] = useState('')
  const [day, setDay] = useState('')
  const [restoringId, setRestoringId] = useState(null)

  // Captura todas as atividades (sem filtro) apenas para montar as opções de filtro
  useEffect(() => {
    async function fetchAll() {
      const acts = await listActivities() || []
      setAllActivities(Array.isArray(acts) ? acts : [])
    }
    fetchAll()
  }, [])

  // Carrega só as atividades realmente filtradas para a exibição
  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true)
      try {
        // lista de plantas só para complemento de nomes
        const ps = await listPlants() || []
        if (active) setPlants(ps)
      } catch {}
      try {
        const acts = await listActivities({ plantId: plantId || undefined, day: day || undefined }) || []
        if (active) setActivities(Array.isArray(acts) ? acts : [])
      } catch {}
      if (active) setLoading(false)
    }
    run()
    return () => { active = false }
  }, [plantId, day, restoringId])

  // Todas as opções de plantas para o filtro (ativas OU com qualquer atividade registrada)
  const plantOptions = useMemo(() => {
    const ids = new Set()
    const items = []
    // Opções de todas as atividades, mesmo de plantas deletadas/restauradas
    allActivities.forEach(a => {
      if (!ids.has(a.plant_id) && a.plant_id) {
        ids.add(a.plant_id)
        items.push({ id: a.plant_id, name: a.plant_name || "Planta" })
      }
    })
    // Também inclui plantas ativas (sem repeti-las)
    plants.forEach(p => {
      const pid = p._id || p.id
      if (!ids.has(pid)) {
        ids.add(pid)
        items.push({ id: pid, name: p.name })
      }
    })
    return items
  }, [allActivities, plants])

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
            <select
              className="form-control"
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
            >
              <option value="">Todas</option>
              {plantOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
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
          <div style={{ textAlign: 'center', padding: 40 }}><p>Carregando histórico...</p></div>
        ) : (activities?.length ?? 0) === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗒️</div>
            <h3>Nenhuma movimentação</h3>
            <p>Aqui aparecerão inclusões, edições, exclusões, regas e restaurações realizadas.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {activities.map((a) => {
              const dateToShow = a.action === 'create' && a.extra?.first_watered ? a.extra.first_watered : a.at
              return (
                <li key={a._id} style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 4px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ marginRight: 8 }}>{iconFor(a.action)}</span>
                    <strong>{describe(a.action)}</strong>
                    {" — "}
                    {a.plant_name || "Planta"}
                    {a.action === 'update' && renderChanges(a.extra)}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', marginRight: 14 }}>
                    {formatDateTime(dateToShow)}
                  </div>
                  {a.action === "delete" && (
                    <button
                      className="btn btn-secondary"
                      style={{ marginLeft: 8, fontSize: 14 }}
                      disabled={restoringId === a.plant_id}
                      onClick={async () => {
                        setRestoringId(a.plant_id)
                        await restorePlant(a.plant_id)
                        setRestoringId(null)
                      }}
                    >
                      ♻️ Restaurar
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
