import React, { useState } from 'react'

// Formulário para criar/editar planta.
// Recebe onSubmit(obj) onde obj tem name, water_interval_days, notes, photo (File optional)

export default function PlantForm({onSubmit, initial}) {
  const [name, setName] = useState(initial?.name || '')
  const [interval, setInterval] = useState(initial?.water_interval_days || 7)
  const [notes, setNotes] = useState(initial?.notes || '')
  const [photo, setPhoto] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    const payload = { name, water_interval_days: interval, notes }
    if(photo) payload['photo'] = photo
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{marginTop:12}}>
      <div className="form-row">
        <label>Nome da planta</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Intervalo de rega (dias)</label>
        <input type="number" className="input" value={interval} onChange={e=>setInterval(e.target.value)} min="1" />
      </div>
      <div className="form-row">
        <label>Observações</label>
        <textarea className="input" value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Foto (opcional)</label>
        <input type="file" onChange={e=>setPhoto(e.target.files[0])} accept="image/*" />
      </div>
      <div style={{display:'flex', gap:8}}>
        <button className="button" type="submit">Salvar</button>
      </div>
    </form>
  )
}
