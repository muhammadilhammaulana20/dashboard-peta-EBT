import { useState, useMemo } from 'react'
import { fetchVillage } from '../api'
import VillageModal from './VillageModal'

export default function RankingTable({ villages, provStats }) {
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    let r = villages.filter(v => v.skor_ahp != null)
    if (filter) r = r.filter(v => v.provinsi === filter)
    if (search) {
      const s = search.toLowerCase()
      r = r.filter(v => v.desa?.toLowerCase().includes(s) || v.kabupaten?.toLowerCase().includes(s) || v.provinsi?.toLowerCase().includes(s))
    }
    return r
  }, [villages, filter, search])

  const handleRowClick = async (v) => {
    try {
      const detail = await fetchVillage(v.id)
      setSelected(detail)
    } catch { setSelected(v) }
  }

  return (
    <section id="ranking" className="w-full py-16 px-6 lg:px-12 xl:px-16" style={{ background: '#0d1421' }}>
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-3">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h3v16H3V4zm6 4h3v12H9V8zm6-2h3v14h-3V6z"/></svg>
              RANKING PRIORITAS — AHP
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Peringkat Prioritas Desa</h2>
            <p className="text-navy-400 text-sm mt-1">Hasil skoring 5 kriteria AHP. Klik baris untuk detail.</p>
          </div>
          <button onClick={() => {
            const csv = [['Ranking','Desa','Kecamatan','Kabupaten','Provinsi','KK Belum','IPM','Kemiskinan','Potensi EBT','Skor AHP','Rekomendasi'].join(','),
              ...villages.map(v => [v.ranking_ahp, v.desa, v.kecamatan, v.kabupaten, v.provinsi, v.kk_belum_listrik, v.ipm, `${v.kemiskinan}%`, v.potensi_ebt, v.skor_ahp, v.rekomendasi_teknologi].join(','))
            ].join('\n')
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'PETA-EBT_ranking.csv'
            a.click()
          }} className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-navy-200 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setFilter('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
              !filter ? 'bg-gold-500 text-navy-900 border-gold-500 font-semibold' : 'bg-white/5 text-navy-300 border-white/10 hover:border-gold-500/40 hover:text-gold-400'
            }`}>Semua</button>
          {provStats?.map(p => (
            <button key={p.provinsi} onClick={() => setFilter(p.provinsi)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer whitespace-nowrap ${
                filter === p.provinsi ? 'bg-gold-500 text-navy-900 border-gold-500 font-semibold' : 'bg-white/5 text-navy-300 border-white/10 hover:border-gold-500/40 hover:text-gold-400'
              }`}>{p.provinsi}</button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Cari desa, kabupaten, provinsi..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-navy-100 text-sm placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition" />
        </div>

        {/* Table */}
        <div className="w-full rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['#', 'Desa', 'Kecamatan', 'Kabupaten', 'Provinsi', 'KK Belum', 'IPM', 'Kemis', 'Potensi', 'Skor AHP', 'Rekomendasi'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-navy-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const isTop3 = i < 3
                  return (
                    <tr key={v.id} onClick={() => handleRowClick(v)}
                      className={`border-t border-white/5 hover:bg-white/5 transition cursor-pointer ${isTop3 ? 'bg-gold-500/5' : ''}`}>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={isTop3 ? 'text-lg' : 'text-xs text-navy-500 font-mono'}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : v.ranking_ahp}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">{v.desa}</td>
                      <td className="px-5 py-3.5 text-navy-300 whitespace-nowrap">{v.kecamatan}</td>
                      <td className="px-5 py-3.5 text-navy-300 whitespace-nowrap">{v.kabupaten}</td>
                      <td className="px-5 py-3.5 text-navy-300 whitespace-nowrap">{v.provinsi}</td>
                      <td className="px-5 py-3.5 font-mono text-navy-200 whitespace-nowrap">{v.kk_belum_listrik?.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5 font-mono text-navy-200 whitespace-nowrap">{v.ipm}</td>
                      <td className="px-5 py-3.5 font-mono text-navy-200 whitespace-nowrap">{v.kemiskinan}%</td>
                      <td className="px-5 py-3.5 font-mono text-navy-200 whitespace-nowrap">{v.potensi_ebt?.toFixed(1)}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-base ${v.skor_ahp >= 60 ? 'text-green-400' : v.skor_ahp >= 40 ? 'text-gold-400' : 'text-navy-400'}`}>
                            {v.skor_ahp?.toFixed(1)}
                          </span>
                          <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className={`h-full rounded-full ${v.skor_ahp >= 60 ? 'bg-green-500' : v.skor_ahp >= 40 ? 'bg-gold-500' : 'bg-white/20'}`}
                              style={{ width: `${Math.min(v.skor_ahp || 0, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20">
                          {v.rekomendasi_teknologi}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={11} className="text-center py-16 text-navy-500 text-sm">Tidak ada desa ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/5 text-xs text-navy-500 flex justify-between">
            <span>{filtered.length} desa</span>
            <span>Klik baris untuk detail skor per kriteria</span>
          </div>
        </div>
      </div>

      {selected && <VillageModal village={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
