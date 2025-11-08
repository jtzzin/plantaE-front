const API = process.env.REACT_APP_API_URL || 'https://plantae-backend-g2kc.onrender.com/api'

export async function login(username, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  return res.json()
}

export async function register(username, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  return res.json()
}

function authHeader() {
  const t = localStorage.getItem('token')
  return { Authorization: `Bearer ${t}` }
}

export async function listPlants() {
  const res = await fetch(`${API}/plants/`, { headers: { ...authHeader() } })
  return res.json()
}

export async function getPlant(id) {
  const res = await fetch(`${API}/plants/${id}`, { headers: { ...authHeader() } })
  return res.json()
}

export async function createPlant(form) {
  const fd = new FormData()
  Object.keys(form).forEach((k) => fd.append(k, form[k]))
  const res = await fetch(`${API}/plants/`, {
    method: 'POST',
    headers: { ...authHeader() },
    body: fd
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    const msg = (isJson && (data?.msg || data?.error || data?.detail)) || (typeof data === 'string' && data) || `Erro ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function updatePlant(id, form) {
  const fd = new FormData()
  Object.keys(form).forEach((k) => { if (form[k] !== undefined && form[k] !== null) fd.append(k, form[k]) })
  const res = await fetch(`${API}/plants/${id}`, {
    method: 'PUT',
    headers: { ...authHeader() },
    body: fd
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    const msg = (isJson && (data?.msg || data?.error || data?.detail)) || (typeof data === 'string' && data) || `Erro ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function deletePlant(id) {
  const res = await fetch(`${API}/plants/${id}`, { method: 'DELETE', headers: { ...authHeader() } })
  return res.json()
}

export async function restorePlant(id) {
  const res = await fetch(
    `${API}/plants/${id}/restore`,
    { method: "POST", headers: { ...authHeader() } }
  );
  return res.json();
}

export async function waterPlant(id) {
  const res = await fetch(`${API}/plants/${id}/water`, { method: 'POST', headers: { ...authHeader() } })
  return res.json()
}

export async function uploadPhoto(id, file) {
  const fd = new FormData()
  fd.append('photo', file)
  const res = await fetch(`${API}/plants/${id}/upload`, {
    method: 'POST',
    headers: { ...authHeader() },
    body: fd
  })
  return res.json()
}

export async function listActivities({ plantId, day } = {}) {
  const qs = new URLSearchParams()
  if (plantId) qs.set('plant_id', plantId)
  if (day) qs.set('day', day)
  const url = `${API}/activities/${qs.toString() ? `?${qs.toString()}` : ''}`
  const res = await fetch(url, { headers: { ...authHeader() } })
  return res.json()
}
