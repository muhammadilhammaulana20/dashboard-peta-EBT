import { useState } from 'react'
import WeightSlider from './WeightSlider'

export default function MethodologySection({ explain, onBack }) {
  const [tab, setTab] = useState('ahp')

  if (!explain) return null

  return (
    <section id="metodologi-section" className="pt-24 pb-16 min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1421 0%, #1a2742 50%, #0d1421 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-navy-300 hover:text-gold-400 transition mb-6 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Kembali ke Dashboard
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-4 w-fit">
          METODOLOGI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Metode Analytic Hierarchy Process (AHP)</h1>
        <p className="text-navy-300 mb-8 max-w-2xl">
          AHP adalah metode pengambilan keputusan multikriteria yang dikembangkan oleh Thomas L. Saaty (1980). 
          Metode ini menguraikan masalah kompleks menjadi struktur hierarki dan membandingkan kriteria secara berpasangan.
        </p>

        {/* Tab nav */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl bg-navy-900/50 w-fit border border-navy-700/50">
          {[
            { id: 'ahp', label: 'Matriks Perbandingan' },
            { id: 'kriteria', label: 'Kriteria & Bobot' },
            { id: 'slider', label: 'Simulasi Bobot' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${tab === t.id ? 'bg-gold-500 text-navy-900' : 'text-navy-300 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: AHP Matrix */}
        {tab === 'ahp' && (
          <div className="space-y-6">
            <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Matriks Perbandingan Berpasangan</h2>
              <p className="text-sm text-navy-400 mb-4">
                Skala Saaty 1–9. Nilai 1 = sama penting, 9 = jauh lebih penting. Angka di bawah 1 berarti baris 
                kurang penting dibanding kolom.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-navy-400 font-medium"></th>
                      {explain.matrix.headers.map(h => (
                        <th key={h} className="p-2 text-center text-navy-300 font-medium text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {explain.matrix.rows.map((row, i) => (
                      <tr key={i} className="border-t border-navy-700/30">
                        <td className="p-2 text-xs font-medium text-navy-200 whitespace-nowrap">{row.kriteria}</td>
                        {row.nilai.map((v, j) => (
                          <td key={j} className={`p-2 text-center font-mono text-xs ${i === j ? 'text-gold-400 font-bold' : 'text-navy-300'}`}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Uji Konsistensi</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Consistency Index (CI)', value: explain.konsistensi.ci },
                  { label: 'Consistency Ratio (CR)', value: explain.konsistensi.cr },
                  { label: 'Status', value: explain.konsistensi.konsisten ? 'Konsisten ✓' : 'Tidak Konsisten ✗', color: explain.konsistensi.konsisten ? 'text-green-400' : 'text-red-400' },
                ].map(d => (
                  <div key={d.label} className="p-4 rounded-xl bg-navy-900/50 border border-navy-700/30">
                    <div className="text-xs text-navy-400 mb-1">{d.label}</div>
                    <div className={`text-2xl font-bold ${d.color || 'text-white'}`}>{d.value}</div>
                    {d.label === 'Consistency Ratio (CR)' && (
                      <div className="text-xs text-navy-400 mt-1">
                        Syarat: CR &lt; 0.1. {explain.konsistensi.cr < 0.1 ? 'Terpenuhi ✓' : 'Tidak terpenuhi ✗'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Kriteria & Bobot */}
        {tab === 'kriteria' && (
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl border border-navy-700/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Kriteria & Bobot Final</h2>
            <div className="space-y-4">
              {explain.kriteria.map((k, i) => {
                const colors = ['#f5c02c', '#6366f1', '#34d399', '#f97316', '#ec4899']
                return (
                  <div key={k.nama}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-navy-200 font-medium">{k.nama}</span>
                      <span className="font-bold" style={{ color: colors[i] }}>{k.persen}</span>
                    </div>
                    <div className="h-3 rounded-full bg-navy-700 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: k.persen, background: colors[i] }} />
                    </div>
                    <div className="text-xs text-navy-400 mt-1">
                      Bobot: {k.bobot}
                      {k.nama === 'KK Belum Listrik' && ' — Semakin banyak KK belum listrik, semakin prioritas'}
                      {k.nama === 'IPM / Kemiskinan' && ' — Daerah dengan IPM rendah & kemiskinan tinggi didahulukan'}
                      {k.nama === 'Potensi EBT Lokal' && ' — Potensi EBT besar = investasi lebih layak'}
                      {k.nama === 'Jarak ke Jaringan PLN' && ' — Semakin jauh dari PLN, semakin ekonomis EBT off-grid'}
                      {k.nama === 'Biaya per KK' && ' — Efisiensi anggaran: dahulukan yang cost-effective'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab: Slider Interaktif */}
        {tab === 'slider' && (
          <WeightSlider initialWeights={explain.kriteria.map(k => k.bobot)} kriteriaNama={explain.kriteria.map(k => k.nama)} />
        )}
      </div>
    </section>
  )
}
