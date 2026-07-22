import { useState, useMemo } from 'react'
import { fetchVillage } from '../api'
import VillageModal from './VillageModal'

const KRITERIA_WARNA = {
  'KK Belum Listrik': '#f5c02c',
  'IPM / Kemiskinan': '#6366f1',
  'Potensi EBT Lokal': '#34d399',
  'Jarak ke Jaringan PLN': '#f97316',
  'Biaya per KK': '#ec4899',
}

export default function RankingTable({ villages, provStats }) {
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    let r = villages.filter(v => v.skor_ahp != null)
    if (filter) r = r.filter(v => v.provinsi === filter)
    if (search) {
      const s = search.toLowerCase()
      r = r.filter(v => v.desa.toLowerCase().includes(s) || v.kabupaten.toLowerCase().includes(s) || v.provinsi.toLowerCase().includes(s))
    }
    return r
  }, [villages, filter, search])

  const handleRowClick = async (v) => {
    try {
      const detail = await fetchVillage(v.id)
      setSelected(detail)
    } catch {
      setSelected(v)
    }
  }

  const skorWarna = (s) => {
    if (s >= 60) return 'text-green-400'
    if (s >= 40) return 'text-gold-400'
    return 'text-navy-300'
  }

  const barWarna = (s) => {
    if (s >= 60) return 'bg-green-500'
    if (s >= 40) return 'bg-gold-500'
    return 'bg-navy-500'
  }

  return (
    <section id="ranking" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-500 border border-gold-500/20 mb-4 w-fit">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h3v16H3V4zm6 4h3v12H9V8zm6-2h3v14h-3V6z"/></svg>
          RANKING PRIORITAS — AHP
        </div>

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-extrabold text-white">Peringkat Prioritas Desa</h2>
          <button onClick={() => {
            const csv = [
              ['Ranking','Desa','Provinsi','KK Belum Listrik','IPM','Kemiskinan','Potensi EBT','Skor AHP','Rekomendasi'].join(','),
              ...villages.map(v => [v.ranking_ahp, v.desa, v.provinsi, v.kk_belum_listrik, v.ipm, `${v.kemiskinan}%`, v.potensi_ebt, v.skor_ahp, v.rekomendasi_teknologi].join(',')),
            ].join('\n')
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = 'PETA-EBT_ranking.csv'
            a.click()
          }} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-navy-800 text-navy-200 border border-navy-600 hover:bg-navy-700 transition-all cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
          </button>
        </div>
        <p className="text-navy-400 text-sm mb-6">Hasil skoring Analytic Hierarchy Process (AHP) — 5 kriteria. Klik baris untuk detail.</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${!filter ? 'bg-gold-500 text-navy-900 border-gold-500' : 'bg-navy-800 text-navy-300 border-navy-600 hover:border-gold-500/50'}`}>Semua</button>
          {provStats.map(p => (
            <button key={p.provinsi} onClick={() => setFilter(p.provinsi)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${filter === p.provinsi ? 'bg-gold-500 text-navy-900 border-gold-500' : 'bg-navy-800 text-navy-300 border-navy-600 hover:border-gold-500/50'}`}>{p.provinsi}</button>
          ))}
        </div>

        <div className="relative max-w-md mb-4">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Cari desa, kabupaten, provinsi..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800 border border-navy-600 text-navy-100 text-sm placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition" />
        </div>

        <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700/50">
                  {['#','Desa','Provinsi','KK Belum','IPM','Kemis','Potensi EBT','Skor AHP','Rekomendasi',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-navy-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const isTop3 = i < 3
                  const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                  return (
                    <tr key={v.id}
                      onClick={() => handleRowClick(v)}
                      className={`border-b border-navy-700/30 hover:bg-navy-700/30 transition cursor-pointer ${isTop3 ? 'bg-gradient-to-r from-gold-500/5 to-transparent' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={isTop3 ? '' : 'text-navy-400 font-mono text-xs'}>{medal || v.ranking_ahp}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{v.desa}</td>
                      <td className="px-4 py-3 text-navy-300 whitespace-nowrap">{v.provinsi}</td>
                      <td className="px-4 py-3 font-mono text-navy-200 whitespace-nowrap">{v.kk_belum_listrik?.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 font-mono text-navy-200 whitespace-nowrap">{v.ipm}</td>
                      <td className="px-4 py-3 font-mono text-navy-200 whitespace-nowrap">{v.kemiskinan}%</td>
                      <td className="px-4 py-3 font-mono text-navy-200 whitespace-nowrap">{v.potensi_ebt?.toFixed(1)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${skorWarna(v.skor_ahp)}`}>{v.skor_ahp?.toFixed(1)}</span>
                          <div className="w-12 h-1.5 rounded-full bg-navy-700 overflow-hidden">
                            <div className={`h-full rounded-full ${barWarna(v.skor_ahp)}`} style={{ width: `${Math.min(v.skor_ahp, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20">{v.rekomendasi_teknologi}</span>
                      </td>
                      <td className="px-4 py-3 text-navy-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="text-center py-12 text-navy-400 text-sm">Tidak ada desa ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-navy-700/30 text-xs text-navy-500 flex justify-between">
            <span>{filtered.length} desa</span>
            <span>Klik baris untuk detail skor</span>
          </div>
        </div>
      </div>

      {selected && <VillageModal village={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
