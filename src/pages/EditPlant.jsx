import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlant, updatePlant } from '../api'
import PlantForm from './PlantForm'

// pagina que edita a planta

export default function EditPlant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getPlant(id).then(setPlant)
  }, [id])

  async function handleSave(data) {
    const res = await updatePlant(id, data)
    if (res.modified) {
      setMsg('✅ Planta atualizada!')
      setTimeout(() => navigate('/dashboard'), 1200)
    } else {
      setMsg('⚠️ Erro ao atualizar')
    }
  }

  if (!plant) return <div>Carregando planta para edição...</div>
  return (
    <div>
      <PlantForm initial={plant} onSubmit={handleSave} />
      {msg && <div style={{ color: 'green', marginTop: 16 }}>{msg}</div>}
    </div>
  )
}
