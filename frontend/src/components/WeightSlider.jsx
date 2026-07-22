import { useState, useEffect, useMemo } from 'react'
import { calculateScore } from '../api'

const COLORS = ['#f5c02c', '#6366f1', '#34d399', '#f97316', '#ec4899']

export default function WeightSlider({ initialWeights, kriteriaNama }) {
  const [weights, setWeights] = useState(initialWeights || [0.25, 0.25, 0.20, 0.15, 0.15])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const total = useMemo(() => weights.reduce((a, b) => a + b, 0), [weights])

  useEffect(() => {
    if (total > 0) {
      setLoading(true)
      calculateScore(weights)
        .then(r => setResults(r.data?.slice(0, 10) || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [weights, total])

  const updateWeight = (idx, val) => {
    const w = [...weights]
    w[idx] = Math.max(0, Math.min(1, val))
    // Normalisasi supaya total = 1
    const sum = w.reduce((a, b) => a + b, 0)
    if (sum > 0) {
      setWeights(w.map(v => v / sum))
    }
  }

  if (!kriteriaNama) return null

  return (
    <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
      <h2 className="text-lg font-bold text-white mb-2">Simulasi Bobot Interaktif</h2>
      <p className="text-sm text-navy-400 mb-6">
        Geser slider untuk mengubah bobot tiap kriteria. Ranking akan ter-update otomatis. 
        Total bobot: <span className="text-gold-400 font-bold">{(total * 100).toFixed(0)}%</span>
      </p>

      <div className="space-y-5 mb-8">
        {weights.map((w, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-navy-200 font-medium">{kriteriaNama[i]}</span>
              <span className="font-bold" style={{ color: COLORS[i] }}>{(w * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="100" value={Math.round(w * 100)}
              onChange={e => updateWeight(i, parseInt(e.target.value) / 100)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-navy-700 accent-gold-500"
              style={{ accentColor: COLORS[i] }}
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {results && !loading && (
        <div>
          <h3 className="font-semibold text-white mb-3">10 Desa Prioritas — Berdasarkan Bobot Baru</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700/50">
                  <th className="p-2 text-left text-xs font-semibold text-navy-400 uppercase">#</th>
                  <th className="p-2 text-left text-xs font-semibold text-navy-400 uppercase">Desa</th>
                  <th className="p-2 text-left text-xs font-semibold text-navy-400 uppercase">Provinsi</th>
                  <th className="p-2 text-left text-xs font-semibold text-navy-400 uppercase">Skor</th>
                </tr>
              </thead>
              <tbody>
                {results.map((v, i) => (
                  <tr key={v.id} className={i < 3 ? 'bg-gold-500/5' : ''}>
                    <td className={`p-2 font-mono text-xs ${i < 3 ? 'text-gold-400' : 'text-navy-400'}`}>{i + 1}</td>
                    <td className="p-2 text-navy-200 font-medium whitespace-nowrap">{v.desa}</td>
                    <td className="p-2 text-navy-400">{v.provinsi}</td>
                    <td className="p-2 font-bold text-gold-400">{v.skor_ahp?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-navy-500 mt-3">* Hasil bersifat sementara. Klik "Kembali" untuk reset ke bobot default.</p>
        </div>
      )}
    </div>
  )
}
