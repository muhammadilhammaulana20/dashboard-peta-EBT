import { useState } from 'react'
import WeightSlider from './WeightSlider'

export default function MethodologySection({ explain, embedded, onBack }) {
  const [tab, setTab] = useState('ahp')
  if (!explain) return null

  const content = (
    <>
      {/* Tab nav */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 w-fit border border-white/10">
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

      <div className="mt-8">
        {/* Tab: AHP Matrix */}
        {tab === 'ahp' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h2 className="text-lg font-bold text-white mb-4">Matriks Perbandingan Berpasangan</h2>
              <p className="text-sm text-navy-400 mb-4">
                Skala Saaty 1–9. Nilai 1 = sama penting. Baris <strong className="text-gold-400">(i)</strong> dibanding kolom <strong className="text-gold-400">(j)</strong>.
                Angka &lt; 1 = baris kurang penting dari kolom.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2.5 text-left text-navy-400 font-medium"></th>
                      {explain.matrix.headers.map(h => (
                        <th key={h} className="p-2.5 text-center text-navy-300 font-medium text-xs whitespace-nowrap">{h.length > 15 ? h.slice(0, 15) + '...' : h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {explain.matrix.rows.map((row, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="p-2.5 text-xs font-medium text-navy-200 whitespace-nowrap">{row.kriteria}</td>
                        {row.nilai.map((v, j) => (
                          <td key={j}
                            className={`p-2.5 text-center font-mono text-xs ${i === j ? 'text-gold-400 font-bold' : 'text-navy-300'}`}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <h2 className="text-lg font-bold text-white mb-4">Uji Konsistensi</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs text-navy-400 mb-1">Consistency Index (CI)</div>
                  <div className="text-2xl font-bold text-white">{explain.konsistensi.ci}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs text-navy-400 mb-1">Consistency Ratio (CR)</div>
                  <div className="text-2xl font-bold text-white">{explain.konsistensi.cr}</div>
                  <div className="text-xs text-navy-500 mt-1">Syarat: CR &lt; 0.1</div>
                </div>
                <div className={`p-4 rounded-xl border ${explain.konsistensi.konsisten ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <div className="text-xs text-navy-400 mb-1">Status</div>
                  <div className={`text-lg font-bold ${explain.konsistensi.konsisten ? 'text-green-400' : 'text-red-400'}`}>
                    {explain.konsistensi.konsisten ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat'}
                  </div>
                  <div className={`text-xs mt-1 ${explain.konsistensi.konsisten ? 'text-green-500/70' : 'text-red-500/70'}`}>
                    {explain.konsistensi.konsisten
                      ? 'Matriks perbandingan dinyatakan konsisten dan bobot dapat digunakan untuk skoring.'
                      : 'Periksa kembali penilaian perbandingan berpasangan.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Kriteria & Bobot */}
        {tab === 'kriteria' && (
          <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <h2 className="text-lg font-bold text-white mb-4">Kriteria & Bobot Final AHP</h2>
            <div className="space-y-5">
              {explain.kriteria.map((k, i) => {
                const colors = ['#f5c02c', '#6366f1', '#34d399', '#f97316', '#ec4899']
                const details = [
                  'Semakin banyak KK belum listrik, semakin mendesak',
                  'Daerah dengan IPM rendah & kemiskinan tinggi didahulukan',
                  'Potensi EBT besar = investasi lebih layak secara teknis',
                  'Semakin jauh dari PLN, semakin ekonomis EBT off-grid',
                  'Efisiensi anggaran: dahulukan yang lebih murah per KK',
                ]
                return (
                  <div key={k.nama}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-navy-100 font-medium">{k.nama}</span>
                      <span className="font-bold text-lg" style={{ color: colors[i] }}>{k.persen}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: k.persen, background: colors[i] }} />
                    </div>
                    <div className="text-xs text-navy-500 mt-1">{details[i]}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab: Slider */}
        {tab === 'slider' && (
          <WeightSlider initialWeights={explain.kriteria.map(k => k.bobot)} kriteriaNama={explain.kriteria.map(k => k.nama)} />
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-5" style={{ background: 'rgba(245,192,44,0.04)', border: '1px solid rgba(245,192,44,0.15)', borderRadius: '6px' }}>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <div className="text-sm font-semibold text-gold-400 mb-1">Catatan Akademis</div>
              <div className="text-xs leading-relaxed text-navy-300 space-y-1">
                <p>Data IDM bersumber real dari Kemendesa RI (indeks-desa-membangun-idm-tahun-2023.xlsx).</p>
                <p>Data IPM dan kemiskinan per-desa merupakan estimasi berdasarkan rata-rata kabupaten dari BPS yang didistribusikan secara proporsional.</p>
                <p>Data potensi EBT dan biaya per-KK merupakan skor proxy berdasarkan data IDM dan literatur teknis, bukan hasil survei lapangan.</p>
                <p>Sistem ini adalah prototype Decision Support System dan bukan merupakan penetapan kebijakan final.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  if (embedded) {
    return (
      <section className="w-full py-16 px-6 lg:px-12 xl:px-16" style={{ background: '#0d1421' }}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            METODOLOGI AHP
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Metode Analytic Hierarchy Process</h2>
          <p className="text-navy-400 mb-6 max-w-3xl">
            AHP oleh Thomas L. Saaty (1980) — menguraikan keputusan kompleks menjadi perbandingan berpasangan 
            antar kriteria, menghasilkan bobot objektif yang teruji konsistensinya.
          </p>
          {content}
        </div>
      </section>
    )
  }

  // Full page mode
  return (
    <section className="w-full min-h-screen pt-24 pb-16 px-6 lg:px-12 xl:px-16" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1d35 30%, #162a4a 60%, #0f1d35 100%)' }}>
      <div className="max-w-screen-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-navy-400 hover:text-gold-400 transition mb-6 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Kembali ke Dashboard
        </button>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-3">
          METODOLOGI AHP
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Metode Analytic Hierarchy Process (AHP)</h1>
        <p className="text-navy-400 mb-8 max-w-3xl">
          AHP oleh Thomas L. Saaty (1980) — menguraikan keputusan kompleks menjadi perbandingan berpasangan.
        </p>
        {content}
      </div>
    </section>
  )
}
