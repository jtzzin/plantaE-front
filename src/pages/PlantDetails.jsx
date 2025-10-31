import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPlant, waterPlant, uploadPhoto, deletePlant } from '../api'

function formatDateTime(iso) {
  if (!iso) return 'nunca'
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper: para o cronograma
function calcularProximasRegas(base, intervalo, count = 5) {
  const datas = []
  if (!base || !intervalo) return datas
  let atual = new Date(base)
  for (let i = 0; i < count; i++) {
    datas.push(new Date(atual))
    atual = new Date(atual.getTime() + intervalo * 24 * 60 * 60 * 1000)
  }
  return datas
}
function datasIguais(d1, d2) {
  const a = new Date(d1), b = new Date(d2)
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export default function PlantDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [feitoRegas, setFeitoRegas] = useState([])

  async function load() {
    try {
      const p = await getPlant(id)
      setPlant(p)
    } catch (e) {
      setError('Falha ao carregar planta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function handleWater() {
    try {
      await waterPlant(id)
      await load()
      // Lógica do cronograma: marca feito localmente
      if (plant) {
        const intervalo = plant.water_interval_days ?? plant.waterintervaldays ?? 7
        const history = (plant.water_history || [])
          .map((r) => ({ ...r, d: new Date(r.at) }))
          .sort((a, b) => b.d - a.d)
        const ultimaReal = history[0] ? history[0].at : (plant.last_watered ?? plant.lastwatered)
        const base = ultimaReal || (plant.water_history && plant.water_history[0]?.at)
        const proximas = calcularProximasRegas(base, intervalo, 5)
        for (let idx = 0; idx < proximas.length; idx++) {
          if (!feitoRegas[idx]) {
            // Marcar "feito" neste
            setFeitoRegas([...feitoRegas, {
              feito: new Date().toISOString(),
              previsto: proximas[idx].toISOString(),
            }])
            break
          }
        }
      }
    } catch {
      alert('Falha ao marcar rega')
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadPhoto(id, file)
      await load()
    } catch {
      alert('Falha ao enviar foto')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja excluir esta planta?')) return
    try {
      await deletePlant(id)
      navigate('/dashboard')
    } catch {
      alert('Falha ao excluir planta')
    }
  }

  if (loading) {
    return (
      <div className="app-container">
        <header>
          <h1>🌿 Planta</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ Voltar</button>
        </header>
        <div className="card"><p>Carregando...</p></div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="app-container">
        <header>
          <h1>🌿 Planta</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ Voltar</button>
        </header>
        <div className="card"><p>Planta não encontrada.</p></div>
      </div>
    )
  }

  // Cronograma local
  const intervalo = plant.water_interval_days ?? plant.waterintervaldays ?? 7
  const history = (plant.water_history || [])
    .map((r) => ({ ...r, d: new Date(r.at) }))
    .sort((a, b) => b.d - a.d)
  const ultimaReal = history[0] ? history[0].at : (plant.last_watered ?? plant.lastwatered)
  const base = ultimaReal || (plant.water_history && plant.water_history[0]?.at)
  const proximas = calcularProximasRegas(base, intervalo, 5)
  function getFeito(idx) {
    return feitoRegas[idx] || null
  }

  return (
    <div className="app-container">
      <header>
        <h1>🌿 {plant.name}</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>⬅️ Voltar</button>
          <button className="btn btn-secondary" onClick={() => navigate(`/plant/edit/${id}`)}>✏️ Editar</button>
          <button className="btn btn-secondary" onClick={handleDelete}>🗑️ Excluir</button>
        </div>
      </header>

      <div className="card">
        {error && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div><strong>🪴 Intervalo:</strong> {intervalo} dias</div>
          <div><strong>🕒 Última rega:</strong> {formatDateTime(plant.last_watered ?? plant.lastwatered)}</div>
          {plant.notes && <div><strong>📝 Observações:</strong> {plant.notes}</div>}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleWater}>💧 Marcar rega agora</button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            {uploading ? '⏳ Enviando...' : '📷 Enviar foto'}
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {plant.photo && (
          <div style={{ marginTop: 20 }}>
            <img
              alt="Foto da planta"
              src={`http://localhost:5000/api/plants/photo/${plant.photo}`}
              style={{ maxWidth: '100%', borderRadius: 8 }}
            />
          </div>
        )}

        <hr style={{ margin: '32px 0 16px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />

        <div>
          <h3 style={{ marginBottom: 8 }}>🗓️ Cronograma previsto</h3>
          <ul>
            {proximas.map((dt, idx) => {
              const previstoISO = dt.toISOString()
              const feitoObj = getFeito(idx)
              const real = history.find((r) => datasIguais(r.at, previstoISO))
              let isFeito = !!feitoObj
              let isAdiantado = false
              let diaReal = null
              if (!feitoObj && real) {
                isFeito = true
                if (!datasIguais(real.at, previstoISO)) {
                  isAdiantado = true
                  diaReal = formatDateTime(real.at)
                }
              }
              return (
                <li key={idx}>
                  {formatDateTime(previstoISO)}{" "}
                  {isFeito || isAdiantado ? (
                    isAdiantado || (feitoObj && !datasIguais(feitoObj.feito, previstoISO)) ? (
                      <>✅ <span style={{ fontSize: 13 }}>({diaReal || formatDateTime(feitoObj.feito)})</span></>
                    ) : (
                      <span>✅</span>
                    )
                  ) : <></>}
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h3 style={{ margin: '24px 0 8px 0' }}>🗓️ Histórico de regas</h3>
          {plant.water_history && plant.water_history.length > 0 ? (
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {plant.water_history.slice().reverse().map((r, i) => (
                <li key={i} style={{ marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                  💧 {formatDateTime(r.at)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma rega registrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}
