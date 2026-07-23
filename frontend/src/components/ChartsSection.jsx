import { useMemo, useState, useEffect } from 'react'

export default function ChartsSection({ provStats, techStats, scoreDist, idmStatus, scoringExplain, dataSources }) {
  const [top10, setTop10] = useState([])
  useEffect(() => {
    fetch('/api/villages?per_page=10').then(r => r.json()).then(res => setTop10(res.data || [])).catch(() => {})
  }, [])
  const topProv = useMemo(() => [...(provStats || [])].sort((a, b) => (b.rata_skor_ahp || 0) - (a.rata_skor_ahp || 0)).slice(0, 10), [provStats])
  const maxTop = Math.max(...top10.map(v => v.skor_ahp || 0), 1)
  const maxProv = Math.max(...topProv.map(p => p.rata_skor_ahp || 0), 1)
  const maxDist = Math.max(...(scoreDist || []).map(d => d.jumlah || 0), 1)
  const maxIdm = Math.max(...(idmStatus || []).map(d => d.jumlah || 0), 1)
  const colors = ['#2a8a7f', '#6366f1', '#34d399', '#f97316', '#ec4899', '#06b6d4', '#a78bfa', '#f472b6']
  const idmColors = { Mandiri: '#34d399', Maju: '#6366f1', Berkembang: '#2a8a7f', Tertinggal: '#8b7e6e', 'Tidak Diketahui': '#64748b' }
  const distColors = ['#334155', '#475569', '#2a8a7f', '#fbbf24', '#34d399']
  const techTotal = techStats?.reduce((s, d) => s + d.jumlah, 0) || 1

  return (
    <section className="w-full py-16 px-6 lg:px-12 xl:px-16" style={{ background: '#0f1828' }}>
      <div className="max-w-screen-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3">
          ANALISIS & VISUALISASI
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">Analisis Multi-Dimensi</h2>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top 10 */}
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-bold text-white mb-1">10 Desa Prioritas Tertinggi</h3>
            <p className="text-xs text-navy-400 mb-4">Berdasarkan skor AHP</p>
            <div className="space-y-2">
              {top10.map((v, i) => (
                <div key={v.id}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200 truncate flex items-center gap-1.5">
                      <span className="text-xs">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                      {v.desa}
                    </span>
                    <span className="text-white font-semibold ml-2">{v.skor_ahp?.toFixed(1)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(v.skor_ahp / maxTop) * 100}%`, background: i < 3 ? '#2a8a7f' : '#475569' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech distribution */}
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-bold text-white mb-1">Rekomendasi Teknologi EBT</h3>
            <p className="text-xs text-navy-400 mb-4">Distribusi per desa</p>
            <div className="space-y-3">
              {(techStats || []).map((d, i) => (
                <div key={d.teknologi}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200">{d.teknologi}</span>
                    <span className="text-navy-100 font-medium">{d.jumlah} ({Math.round(d.jumlah / techTotal * 100)}%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.jumlah / techTotal) * 100}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              ))}
              {(!techStats || techStats.length === 0) && <p className="text-navy-500 text-sm">Tidak ada data</p>}
            </div>
          </div>

          {/* Province scores */}
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-bold text-white mb-1">Rata-rata Skor per Provinsi</h3>
            <p className="text-xs text-navy-400 mb-4">10 provinsi prioritas</p>
            <div className="space-y-2">
              {topProv.map(p => (
                <div key={p.provinsi}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200 truncate">{p.provinsi}</span>
                    <span className="text-navy-100 font-medium">{p.rata_skor_ahp?.toFixed(1)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(p.rata_skor_ahp / maxProv) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score distribution */}
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-bold text-white mb-1">Distribusi Skor AHP</h3>
            <p className="text-xs text-navy-400 mb-4">Sebaran nilai prioritas</p>
            <div className="space-y-2">
              {(scoreDist || []).map((d, i) => (
                <div key={d.range}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200">Skor {d.range}</span>
                    <span className="text-navy-100 font-medium">{d.jumlah} desa</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.jumlah / maxDist) * 100}%`, background: distColors[i % distColors.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IDM Status */}
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-bold text-white mb-1">Status IDM</h3>
            <p className="text-xs text-navy-400 mb-4">Indeks Desa Membangun</p>
            <div className="space-y-2">
              {(idmStatus || []).map(d => (
                <div key={d.status}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200">{d.status}</span>
                    <span className="text-navy-100 font-medium">{d.jumlah} desa</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.jumlah / maxIdm) * 100}%`, background: idmColors[d.status] || '#64748b' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h3 className="font-bold text-white mb-1">Bobot Kriteria AHP</h3>
            <p className="text-xs text-navy-400 mb-4">5 kriteria skoring</p>
            <div className="space-y-2">
              {scoringExplain?.kriteria?.map((k, i) => (
                <div key={k.nama}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200">{k.nama}</span>
                    <span className="font-medium" style={{ color: colors[i] }}>{k.persen}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: k.persen, background: colors[i] }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-navy-500 flex items-center gap-2">
              <span>CR: <span className="text-green-400">{scoringExplain?.konsistensi?.cr}</span></span>
              <span>— {scoringExplain?.konsistensi?.konsisten ? 'Konsisten ✓' : '✗'}</span>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-8 rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <h3 className="font-bold text-white mb-4">Sumber Data & Referensi</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(dataSources || []).map(s => (
              <div key={s.nama} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.real ? 'bg-green-500/10' : 'bg-teal-500/10'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${s.real ? 'bg-green-500' : 'bg-teal-500'}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-navy-100">{s.nama}</div>
                  <div className="text-xs text-navy-400 mt-0.5 line-clamp-2">{s.deskripsi}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-navy-500">
                    <span>{s.sumber}</span>
                    <span>{s.tahun}</span>
                    {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Kunjungi →</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}