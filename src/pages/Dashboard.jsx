import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();

  // Busca plantas do backend
  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/plants', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setPlants(data);
  };

  // Função para regar planta
  const handleWater = async (plantId) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/plants/${plantId}/water`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPlants(); // Atualiza lista
  };

  // Função para deletar planta
  const handleDelete = async (plantId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta planta?')) return;
    
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/plants/${plantId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPlants(); // Atualiza lista
  };

  // Função para sair
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* HEADER COM CLASSES CSS */}
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

      {/* CARD PRINCIPAL */}
      <div className="card">
        <h2>Minhas Plantas</h2>

        {/* GRID DE PLANTAS - COM CLASSES CSS */}
        {plants.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhuma planta cadastrada</h3>
            <p>Adicione sua primeira planta para começar!</p>
          </div>
        ) : (
          <div className="plants-grid">
            {plants.map(plant => {
              // Calcula dias até próxima rega
              const getDaysUntilWater = () => {
                if (!plant.last_watered) return plant.water_interval_days;
                const lastWatered = new Date(plant.last_watered);
                const now = new Date();
                const diffDays = Math.ceil((now - lastWatered) / (1000 * 60 * 60 * 24));
                return Math.max(0, plant.water_interval_days - diffDays);
              };

              const daysUntil = getDaysUntilWater();
              const needsWater = daysUntil === 0;

              return (
                <div key={plant._id} className="plant-card">
                  {/* IMAGEM OU PLACEHOLDER */}
                  {plant.photo ? (
                    <img 
                      src={`http://localhost:5000/api/plants/photo/${plant.photo}`}
                      alt={plant.name}
                      className="plant-image"
                    />
                  ) : (
                    <div className="plant-image-placeholder">
                      🌱
                    </div>
                  )}

                  {/* CONTEÚDO DO CARD */}
                  <div className="plant-content">
                    <h3 className="plant-name">{plant.name}</h3>

                    {/* BADGE DE STATUS */}
                    {needsWater ? (
                      <span className="badge badge-danger">
                        💧 Regar hoje!
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        ✅ Regar em {daysUntil} dias
                      </span>
                    )}

                    {/* INFO */}
                    <p className="plant-info">
                      ⏰ Intervalo: {plant.water_interval_days} dias
                    </p>
                    {plant.notes && (
                      <p className="plant-info">
                        📝 {plant.notes}
                      </p>
                    )}

                    {/* BOTÕES DE AÇÃO */}
                    <div className="plant-actions">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleWater(plant._id)}
                      >
                        💧 Regar
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(plant._id)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
