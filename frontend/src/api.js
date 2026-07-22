const API = '/api'

async function get(path) {
  const r = await fetch(`${API}${path}`)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

export function fetchSummary() { return get('/summary') }
export function fetchVillages(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') qs.set(k, v) })
  return get(`/villages?${qs}`)
}
export function fetchProvinceStats() { return get('/stats/provinces') }
export function fetchTechnologyStats() { return get('/stats/technology') }
export function fetchScoreDistribution() { return get('/stats/score-distribution') }
export function fetchIdmStatus() { return get('/stats/idm-status') }
export function fetchScoringExplain() { return get('/scoring/explain') }
export function fetchDataSources() { return get('/data/sources') }
export function fetchVillage(id) { return get(`/villages/${id}`) }

export async function calculateScore(weights) {
  const r = await fetch(`${API}/scoring/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weights }),
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}
