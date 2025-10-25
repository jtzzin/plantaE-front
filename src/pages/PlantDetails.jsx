import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlant, waterPlant, uploadPhoto } from '../api'

export default function PlantDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [msg, setMsg] = useState(null)
  const [file, setFile] = useState(null)

  async function fetchData(){
    const res = await getPlant(id)
    setPlant(res)
  }

  useEffect(()=>{ fetchData() }, [id])

  async function handleWater(){
    await waterPlant(id)
    setMsg('✅ Regada com sucesso!')
    setTimeout(() => setMsg(null), 3000)
    fetchData()
  }

  async function handleUpload(e){
    e.preventDefault()
    if(!file) { setMsg('⚠️ Selecione um arquivo'); return }
    await uploadPhoto(id, file)
    setMsg('✅ Foto enviada com sucesso!')
    setTimeout(() => setMsg(null), 3000)
    setFile(null)
    fetchData()
  }

  if(!plant) return (
    <div className="app-container">
      <div className="card">
        <div className="loading">🌱 Carregando...</div>
      </div>
    </div>
  )

  return (
    <div className="app-container">
      {/* HEADER */}
      <header>
        <h1>🌿 {plant.name}</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Voltar
        </button>
      </header>

      {/* CARD PRINCIPAL */}
      <div className="card">
        {/* IMAGEM DA PLANTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-xl)' }}>
          {plant.photo ? (
            <img 
              src={`http://localhost:5000/api/plants/photo/${plant.photo}`} 
              alt={plant.name}
              className="plant-detail-image"
            />
          ) : (
            <div className="plant-detail-placeholder">
              🌱
            </div>
          )}
        </div>

        {/* INFORMAÇÕES */}
        <div className="plant-details-section">
          <h3>📋 Informações</h3>
          <div className="plant-details-info">
            <p><strong>Intervalo de rega:</strong> {plant.water_interval_days} dias</p>
          </div>
          {plant.notes && (
            <div className="plant-details-info">
              <p><strong>Observações:</strong> {plant.notes}</p>
            </div>
          )}
        </div>

        {/* HISTÓRICO DE REGAS */}
        <div className="watering-history">
          <h3>💧 Histórico de regas</h3>
          
          {(plant.water_history || []).length === 0 ? (
            <div className="empty-history">
              <p>Nenhuma rega registrada ainda</p>
            </div>
          ) : (
            <div>
              {(plant.water_history || []).map((w, i) => (
                <div key={i} className="watering-history-item">
                  <span className="watering-history-icon">💧</span>
                  <span className="watering-history-date">
                    {new Date(w.at).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary" onClick={handleWater} style={{ marginTop: 'var(--spacing-md)' }}>
            💧 Regar agora
          </button>
        </div>

        {/* UPLOAD DE FOTO */}
        <div className="photo-upload-section">
          <h3>📸 Enviar foto</h3>
          <form onSubmit={handleUpload}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e=>setFile(e.target.files[0])}
              id="photo-input"
            />
            <label htmlFor="photo-input" className="file-input-label">
              📁 {file ? file.name : 'Escolher arquivo'}
            </label>
            
            <button className="btn btn-success" type="submit" style={{ marginLeft: 'var(--spacing-md)' }}>
              📤 Enviar
            </button>
          </form>
        </div>

        {/* MENSAGEM DE FEEDBACK */}
        {msg && (
          <div className="badge badge-success" style={{ fontSize: '15px', padding: '12px 20px' }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}
