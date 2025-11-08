// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

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

export default function Dashboard() {
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchPlants() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://plantae-backend-g2kc.onrender.com/api/plants/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setPlants(data)
      }
    } catch (err) {
      console.error('Erro ao buscar plantas', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(plantId, plantName, e) {
    e.stopPropagation()
    if (!window.confirm(`Tem certeza que deseja excluir ${plantName}?`)) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://plantae-backend-g2kc.onrender.com/api/plants/${plantId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        setPlants((prev) => prev.filter((p) => (p._id || p.id) !== plantId))
      } else {
        alert('Erro ao excluir planta')
      }
    } catch (err) {
      console.error('Erro ao excluir', err)
      alert('Erro ao excluir planta')
    }
  }

  useEffect(() => { fetchPlants() }, [])

  return (
    <div className="app-container">
      <header>
        <h1>PlantaE 🌱</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <ThemeToggle />
          <button className="btn btn-secondary" onClick={() => navigate('/cronograma')}>📅 Cronograma</button>
          <button className="btn btn-secondary" onClick={() => navigate('/history')}>🗒️ Histórico</button>
          <button className="btn btn-primary" onClick={() => navigate('/plant/new')}>➕ Adicionar Planta</button>
          <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>🚪 Sair</button>
        </div>
      </header>

      <div className="card">
        <h2>Minhas Plantas</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>Carregando plantas...</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌿</div>
            <h3>Nenhuma planta cadastrada</h3>
            <p>Adicione sua primeira planta para começar!</p>
            <button className="btn btn-primary" onClick={() => navigate('/plant/new')}>➕ Adicionar Primeira Planta</button>
          </div>
        ) : (
          <div className="plants-grid">
            {plants.map((plant) => {
              const id = plant._id || plant.id
              const interval = plant.water_interval_days ?? plant.waterintervaldays
              const last = plant.last_watered ?? plant.lastwatered
              return (
                <div key={id} className="plant-card">
                  <div className="plant-card-header">
                    <h3>{plant.name}</h3>
                    <span className="plant-badge">💧 {interval}d</span>
                  </div>
                  {plant.notes && <p className="plant-notes">{plant.notes}</p>}
                  <div className="plant-info">
                    <small>Última rega: {formatDateTime(last)}</small>
                  </div>
                  <div className="plant-actions">
                    <button className="btn-action btn-action-view" onClick={() => navigate(`/plant/${id}`)} title="Ver detalhes">👀 Ver</button>
                    <button className="btn-action btn-action-edit" onClick={(e) => { e.stopPropagation(); navigate(`/plant/edit/${id}`) }} title="Editar">✏️ Editar</button>
                    <button className="btn-action btn-action-delete" onClick={(e) => handleDelete(id, plant.name, e)} title="Excluir">🗑️ Excluir</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
