import { useEffect, useRef } from 'react'

function BarChart({ data, labelKey, valueKey, label, color = '#f5c02c', horizontal }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1)
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-navy-200 truncate">{d[labelKey]}</span>
            <span className="text-navy-100 font-medium">{d[valueKey]}</span>
          </div>
          <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(d[valueKey] / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DoughnutChart({ data, labelKey, valueKey }) {
  const total = data.reduce((s, d) => s + d[valueKey], 0)
  const colors = ['#f5c02c', '#6366f1', '#34d399', '#f97316', '#ec4899', '#06b6d4', '#a78bfa', '#f472b6']
  let cum = 0
  const segments = data.map((d, i) => {
    const pct = d[valueKey] / total
    const start = cum
    cum += pct
    return { ...d, pct, start, end: cum, color: colors[i % colors.length] }
  })

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90">
        {segments.map((s, i) => {
          const r = 40
          const cx = 50, cy = 50
          const a1 = s.start * 360, a2 = s.end * 360
          const x1 = cx + r * Math.cos((a1 * Math.PI) / 180)
          const y1 = cy + r * Math.sin((a1 * Math.PI) / 180)
          const x2 = cx + r * Math.cos((a2 * Math.PI) / 180)
          const y2 = cy + r * Math.sin((a2 * Math.PI) / 180)
          const large = s.pct > 0.5 ? 1 : 0
          return <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={s.color} />
        })}
        <circle cx="50" cy="50" r="28" fill="#1a2742" />
      </svg>
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-navy-200">{s[labelKey]}</span>
            <span className="text-navy-400">({Math.round(s.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChartsSection({ villages, provStats, techStats, scoreDist, idmStatus, scoringExplain, dataSources }) {
  if (!villages?.length) return null

  const top10 = [...villages].sort((a, b) => b.skor_ahp - a.skor_ahp).slice(0, 10)
  const topProv = [...(provStats || [])].sort((a, b) => b.rata_skor_ahp - a.rata_skor_ahp).slice(0, 10)

  return (
    <section className="py-12" style={{ background: '#0d1421' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-4 w-fit">
          ANALISIS
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-8">Analisis Multi-Dimensi</h2>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top 10 Desa */}
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h3 className="font-bold text-white mb-1">10 Desa Prioritas Tertinggi</h3>
            <p className="text-xs text-navy-400 mb-4">Berdasarkan skor AHP</p>
            <BarChart data={top10} labelKey="desa" valueKey="skor_ahp" color="#f5c02c" />
          </div>

          {/* Rekomendasi Teknologi */}
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h3 className="font-bold text-white mb-1">Rekomendasi Teknologi EBT</h3>
            <p className="text-xs text-navy-400 mb-4">Distribusi per desa</p>
            {techStats?.length > 0 && <DoughnutChart data={techStats} labelKey="teknologi" valueKey="jumlah" />}
          </div>

          {/* Skor per Provinsi */}
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h3 className="font-bold text-white mb-1">Rata-rata Skor per Provinsi</h3>
            <p className="text-xs text-navy-400 mb-4">10 provinsi prioritas tertinggi</p>
            <BarChart data={topProv} labelKey="provinsi" valueKey="rata_skor_ahp" color="#6366f1" />
          </div>

          {/* Distribusi Skor */}
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h3 className="font-bold text-white mb-1">Distribusi Skor Prioritas</h3>
            <p className="text-xs text-navy-400 mb-4">Sebaran nilai AHP</p>
            {(scoreDist || []).map(d => {
              const max = Math.max(...(scoreDist || []).map(x => x.jumlah), 1)
              return (
                <div key={d.range} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200">{d.range}</span>
                    <span className="text-navy-100">{d.jumlah} desa</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gold-500" style={{ width: `${(d.jumlah / max) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* IDM Status */}
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h3 className="font-bold text-white mb-1">Status IDM</h3>
            <p className="text-xs text-navy-400 mb-4">Indeks Desa Membangun</p>
            {(idmStatus || []).map(d => {
              const max = Math.max(...(idmStatus || []).map(x => x.jumlah), 1)
              const colors = { 'Mandiri': '#34d399', 'Maju': '#6366f1', 'Berkembang': '#f5c02c', 'Tertinggal': '#f97316', 'Sangat Tertinggal': '#ef4444' }
              return (
                <div key={d.status} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200">{d.status}</span>
                    <span className="text-navy-100">{d.jumlah} desa</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.jumlah / max) * 100}%`, background: colors[d.status] || '#6366f1' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Metodologi */}
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h3 className="font-bold text-white mb-1">Metodologi Skoring AHP</h3>
            <p className="text-xs text-navy-400 mb-4">5 kriteria dengan bobot terverifikasi</p>
            {scoringExplain?.kriteria?.map((k, i) => {
              const colors = ['#f5c02c', '#6366f1', '#34d399', '#f97316', '#ec4899']
              return (
                <div key={k.nama} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-navy-200">{k.nama}</span>
                    <span className="font-medium" style={{ color: colors[i] }}>{k.persen}</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: k.persen, background: colors[i] }} />
                  </div>
                </div>
              )
            })}
            <div className="mt-3 text-xs text-navy-400">
              Consistency Ratio: <span className="text-green-400">{scoringExplain?.konsistensi?.cr}</span> 
              {' '}({scoringExplain?.konsistensi?.konsisten ? 'Konsisten ✓' : '✗'})
            </div>
          </div>
        </div>

        {/* Sumber Data */}
        <div className="mt-8">
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h3 className="font-bold text-white mb-4">Sumber Data</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(dataSources || []).map(s => (
                <div key={s.nama} className="flex items-start gap-3 p-3 rounded-xl bg-navy-900/50 border border-navy-700/30">
                  <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center shrink-0">
                    <div className={`w-2 h-2 rounded-full ${s.real ? 'bg-green-500' : 'bg-gold-500'}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-navy-200">{s.nama}</div>
                    <div className="text-xs text-navy-400 mt-0.5">{s.deskripsi}</div>
                    <div className="flex gap-3 mt-1 text-xs text-navy-500">
                      <span>{s.sumber}</span>
                      <span>{s.tahun}</span>
                      {s.url && <a href={s.url} target="_blank" className="text-gold-400 hover:underline">Kunjungi</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
