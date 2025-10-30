import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlant, updatePlant } from '../api'
import PlantForm from './PlantForm'

export default function EditPlant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlant(id).then(res => {
      console.log('[EDIT DEBUG] Resposta API getPlant:', res)
      if (!res || !res._id) {
        if (res?.msg === 'not_found')
          setMsg('Planta não encontrada!')
        else if (res?.msg === 'id_invalido')
          setMsg('ID inválido!')
        else
          setMsg('Erro desconhecido ao buscar planta.')
      } else {
        setPlant(res)
      }
      setLoading(false)
    }).catch(() => {
      setMsg('Erro de conexão ao buscar planta.')
      setLoading(false)
    })
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

  if (loading) return <div>Carregando planta para edição...</div>
  if (msg) return <div style={{color:'red', textAlign:'center'}}>{msg}</div>
  if (!plant) return null

  return (
    <div>
      <PlantForm initial={plant} onSubmit={handleSave} />
      {msg && <div style={{ color: 'green', marginTop: 16 }}>{msg}</div>}
    </div>
  )
}
