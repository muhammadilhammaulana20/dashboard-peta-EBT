import { useState, useEffect, useMemo } from 'react'

const COLORS = ['#f5c02c', '#6366f1', '#34d399', '#f97316', '#ec4899']

export default function WeightSlider({ initialWeights, kriteriaNama }) {
  const [weights, setWeights] = useState(initialWeights || [0.25, 0.25, 0.20, 0.15, 0.15])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/scoring/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights }),
    })
      .then(r => r.json())
      .then(res => setResults((res.data || []).slice(0, 10)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [weights])

  const total = useMemo(() => weights.reduce((a, b) => a + b, 0), [weights])

  const updateWeight = (idx, val) => {
    const w = [...weights]
    w[idx] = Math.max(0, Math.min(1, val))
    const sum = w.reduce((a, b) => a + b, 0)
    if (sum > 0) setWeights(w.map(v => v / sum))
  }

  if (!kriteriaNama) return null

  return (
    <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <h2 className="text-lg font-bold text-white mb-2">Simulasi Bobot Interaktif</h2>
      <p className="text-sm text-navy-400 mb-6">
        Geser slider untuk mengubah prioritas tiap kriteria. Ranking berubah otomatis.
        Total bobot: <span className="text-gold-400 font-bold">{(total * 100).toFixed(0)}%</span>
      </p>

      <div className="space-y-5 mb-8">
        {weights.map((w, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-navy-100 font-medium">{kriteriaNama[i]}</span>
              <span className="font-bold text-lg" style={{ color: COLORS[i] }}>{(w * 100).toFixed(0)}%</span>
            </div>
            <div className="relative">
              <input type="range" min="0" max="100" value={Math.round(w * 100)}
                onChange={e => updateWeight(i, parseInt(e.target.value) / 100)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-gold-500"
                style={{ accentColor: COLORS[i] }}
              />
              <div className="h-2 rounded-full bg-white/10 absolute top-0 left-0 w-full pointer-events-none -z-10" />
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-1" />
          <p className="text-xs text-navy-400">Menghitung ulang ranking...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <h3 className="font-semibold text-white mb-3">10 Desa Prioritas — Berdasarkan Bobot Baru</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-2.5 text-left text-xs font-semibold text-navy-400 uppercase">#</th>
                  <th className="p-2.5 text-left text-xs font-semibold text-navy-400 uppercase">Desa</th>
                  <th className="p-2.5 text-left text-xs font-semibold text-navy-400 uppercase">Provinsi</th>
                  <th className="p-2.5 text-left text-xs font-semibold text-navy-400 uppercase">Skor</th>
                </tr>
              </thead>
              <tbody>
                {results.map((v, i) => (
                  <tr key={v.id} className={`border-b border-white/5 ${i < 3 ? 'bg-gold-500/5' : ''}`}>
                    <td className={`p-2.5 font-mono text-xs ${i < 3 ? 'text-gold-400' : 'text-navy-400'}`}>{i + 1}</td>
                    <td className="p-2.5 text-navy-100 font-medium whitespace-nowrap">{v.desa}</td>
                    <td className="p-2.5 text-navy-400">{v.provinsi}</td>
                    <td className="p-2.5 font-bold text-gold-400">{v.skor_ahp?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-navy-500 mt-3">* Hasil bersifat sementara. Reset halaman untuk bobot default.</p>
        </div>
      )}
    </div>
  )
}
