import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPlant, waterPlant, uploadPhoto } from '../api'

// Página de detalhes da planta: histórico de regas, upload de foto e informações.

export default function PlantDetails(){
  const { id } = useParams()
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
    setMsg('Regada com sucesso')
    fetchData()
  }

  async function handleUpload(e){
    e.preventDefault()
    if(!file) { setMsg('Selecione um arquivo'); return }
    await uploadPhoto(id, file)
    setMsg('Foto enviada')
    setFile(null)
    fetchData()
  }

  if(!plant) return <div>Carregando...</div>

  return (
    <div>
      <h2>{plant.name}</h2>
      {plant.photo && <img src={`http://localhost:5000/api/plants/photo/${plant.photo}`} alt="" className="photo-thumb" />}
      <div>Intervalo: {plant.water_interval_days} dias</div>
      <div>Observações: {plant.notes}</div>

      <div style={{marginTop:12}}>
        <h3>Histórico de regas</h3>
        <ul>
          { (plant.water_history || []).map((w, i) => (
            <li key={i}>{ new Date(w.at).toLocaleString() }</li>
          )) }
        </ul>
        <button className="button" onClick={handleWater}>Regar agora</button>
      </div>

      <div style={{marginTop:12}}>
        <h3>Enviar foto</h3>
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
          <div style={{marginTop:8}}>
            <button className="button" type="submit">Enviar</button>
          </div>
        </form>
      </div>

      {msg && <div style={{marginTop:8}}>{msg}</div>}
    </div>
  )
}
