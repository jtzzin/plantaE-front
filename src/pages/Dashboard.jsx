import React, { useEffect, useState } from 'react'
import { listPlants, createPlant, deletePlant, waterPlant } from '../api'
import PlantForm from './PlantForm'
import { Link } from 'react-router-dom'

// Dashboard: lista plantas, permite criar nova e ações rápidas.
// Tudo em português e com comentários.

export default function Dashboard(){
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState(null)

  async function fetchPlants(){
    setLoading(true)
    const res = await listPlants()
    if(Array.isArray(res)) setPlants(res)
    setLoading(false)
  }

  useEffect(()=>{ fetchPlants() }, [])

  async function handleCreate(data){
    await createPlant(data)
    setShowForm(false)
    setMsg('Planta criada')
    fetchPlants()
  }

  async function handleDelete(id){
    await deletePlant(id)
    setMsg('Planta removida')
    fetchPlants()
  }

  async function handleWater(id){
    await waterPlant(id)
    setMsg('Regada com sucesso')
    fetchPlants()
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Minhas Plantas</h2>
        <div>
          <button className="button" onClick={() => setShowForm(s => !s)}>{showForm ? 'Fechar' : 'Adicionar Planta'}</button>
        </div>
      </div>

      {showForm && <PlantForm onSubmit={handleCreate} />}

      {msg && <div style={{marginTop:8}}>{msg}</div>}
      {loading ? <div>Carregando...</div> : (
        <div className="plant-list">
          {plants.map(p => {
            // Calcula próxima rega estimada
            const last = p.last_watered ? new Date(p.last_watered) : null
            const next = last ? new Date(last.getTime() + (p.water_interval_days||7)*24*60*60*1000) : null
            return (
              <div key={p._id} className="plant-item card">
                {p.photo && <img src={`http://localhost:5000/api/plants/photo/${p.photo}`} alt="" className="photo-thumb" />}
                <h3>{p.name}</h3>
                <div>Intervalo: {p.water_interval_days} dias</div>
                <div>Última rega: {p.last_watered ? new Date(p.last_watered).toLocaleString() : '—'}</div>
                <div>Próxima rega: {next ? next.toLocaleString() : '—'}</div>
                <div style={{display:'flex', gap:8, marginTop:8}}>
                  <button className="button" onClick={()=>handleWater(p._id)}>Regar agora</button>
                  <Link to={`/plant/${p._id}`} className="button secondary">Detalhes</Link>
                  <button className="button secondary" onClick={()=>handleDelete(p._1d)}>Excluir</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
