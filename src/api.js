// frontend/src/api.js
// Funções que comunicam com o backend.
// Lembre: defina REACT_APP_API_URL no seu .env do frontend se necessário.

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Faz login: recebe username e password, retorna JSON (token em access_token)
export async function login(username, password){
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  })
  return res.json()
}

// Faz registro de novo usuário
export async function register(username, password){
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  })
  return res.json()
}

function authHeaders(){
  const t = localStorage.getItem('token')
  return { 'Authorization': `Bearer ${t}` }
}

// Lista plantas do usuário autenticado
export async function listPlants(){
  const res = await fetch(`${API}/plants/`, {headers: {...authHeaders()}})
  return res.json()
}

// Cria nova planta, aceita FormData (para foto) ou JSON
export async function createPlant(form){
  const token = localStorage.getItem('token')
  const fd = new FormData()
  Object.keys(form).forEach(k => fd.append(k, form[k]))
  const res = await fetch(`${API}/plants/`, {method:'POST', headers: {'Authorization': `Bearer ${token}`}, body: fd})
  return res.json()
}

// Regar planta (histórico)
export async function waterPlant(id){
  const token = localStorage.getItem('token')
  const res = await fetch(`${API}/plants/${id}/water`, {method:'POST', headers: {'Authorization': `Bearer ${token}`}})
  return res.json()
}

// Upload de foto
export async function uploadPhoto(id, file){
  const token = localStorage.getItem('token')
  const fd = new FormData(); fd.append('photo', file)
  const res = await fetch(`${API}/plants/${id}/upload`, {method:'POST', headers: {'Authorization': `Bearer ${token}`}, body: fd})
  return res.json()
}

// Deleta planta
export async function deletePlant(id){
  const token = localStorage.getItem('token')
  const res = await fetch(`${API}/plants/${id}`, {method:'DELETE', headers: {'Authorization': `Bearer ${token}`}})
  return res.json()
}

// Busca uma planta específica
export async function getPlant(id){
  const token = localStorage.getItem('token')
  const res = await fetch(`${API}/plants/${id}`, {headers: {'Authorization': `Bearer ${token}`}})
  return res.json()
}
