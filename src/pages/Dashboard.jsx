import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)

  // ===== BUSCAR PLANTAS =====
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
        console.log('✅ Plantas recebidas:', data) // DEBUG
        setPlants(data)
      }
    } catch (err) {
      console.error('❌ Erro ao buscar plantas:', err)
    } finally {
      setLoading(false)
    }
  }

  // ===== CARREGAR PLANTAS AO ENTRAR =====
  useEffect(() => {
    fetchPlants()
  }, [])

  // ===== SAIR =====
  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header>
        <h1>🌿 PlantaE</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
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

      {/* CONTEÚDO */}
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
                onClick={() => navigate(`/plant/${plant._id}`)}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
