const API_BASE = window.location.origin + "/api";

async function apiGet(endpoint) {
  const resp = await fetch(`${API_BASE}${endpoint}`);
  if (!resp.ok) throw new Error(`API Error: ${resp.status}`);
  return resp.json();
}

async function fetchVillages(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const query = qs.toString();
  return apiGet(`/villages${query ? "?" + query : ""}`);
}

async function fetchSummary() {
  return apiGet("/summary");
}

async function fetchProvinceStats() {
  return apiGet("/stats/provinces");
}

async function fetchTechnologyStats() {
  return apiGet("/stats/technology");
}

async function fetchScoreDistribution() {
  return apiGet("/stats/score-distribution");
}

async function fetchIdmStatus() {
  return apiGet("/stats/idm-status");
}

async function fetchScoringExplain() {
  return apiGet("/scoring/explain");
}

async function fetchDataSources() {
  return apiGet("/data/sources");
}
