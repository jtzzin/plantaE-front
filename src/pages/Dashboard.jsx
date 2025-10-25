import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

export default function Dashboard() {
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)

  // Buscar plantas
  async function fetchPlants() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/plants/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Plantas recebidas:', data)
        setPlants(data)
      }
    } catch (err) {
      console.error('❌ Erro ao buscar plantas:', err)
    } finally {
      setLoading(false)
    }
  }

  // Deletar planta
  async function handleDelete(plantId, plantName, e) {
    e.stopPropagation()
    
    if (!window.confirm(`Tem certeza que deseja excluir "${plantName}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/plants/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setPlants(plants.filter(p => p._id !== plantId))
        console.log('✅ Planta excluída!')
      } else {
        alert('❌ Erro ao excluir planta')
      }
    } catch (err) {
      console.error('❌ Erro ao excluir:', err)
      alert('❌ Erro ao excluir planta')
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="app-container">
      <header>
        <h1>🌿 PlantaE</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ThemeToggle />
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/plant/new')}
          >
            + Adicionar Planta
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      <div className="card">
        <h2>🪴 Minhas Plantas</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>⏳ Carregando plantas...</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <h3>Nenhuma planta cadastrada</h3>
            <p>Adicione sua primeira planta para começar!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/plant/new')}
            >
              🌿 Adicionar Primeira Planta
            </button>
          </div>
        ) : (
          <div className="plants-grid">
            {plants.map(plant => (
              <div 
                key={plant._id} 
                className="plant-card"
              >
                <div className="plant-card-header">
                  <h3>{plant.name}</h3>
                  <span className="plant-badge">💧 {plant.water_interval_days}d</span>
                </div>
                
                {plant.notes && (
                  <p className="plant-notes">{plant.notes}</p>
                )}

                {plant.last_watered && (
                  <div className="plant-info">
                    <small>Última rega: {new Date(plant.last_watered).toLocaleDateString()}</small>
                  </div>
                )}

                <div className="plant-actions">
                  <button 
                    className="btn-action btn-action-view"
                    onClick={() => navigate(`/plant/${plant._id}`)}
                    title="Ver detalhes"
                  >
                    👁️ Ver
                  </button>
                  <button 
                    className="btn-action btn-action-edit"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/plant/edit/${plant._id}`)
                    }}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-action btn-action-delete"
                    onClick={(e) => handleDelete(plant._id, plant.name, e)}
                    title="Excluir"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}