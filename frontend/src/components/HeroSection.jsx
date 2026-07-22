export default function HeroSection({ villages }) {
  const totalDesa = villages.length
  const totalProv = new Set(villages.map(v => v.provinsi)).size
  const totalKK = villages.reduce((s, v) => s + (v.kk_terdampak || 0), 0)
  const rataSkor = totalDesa ? (villages.reduce((s, v) => s + v.skor_ahp, 0) / totalDesa).toFixed(1) : '0'

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1421 0%, #1a2742 50%, #0d1421 100%)' }}>
      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gold-500/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-navy-400/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.466-.298l-1.5 7.5a.75.75 0 00.733.891h4.5a.75.75 0 00.738-.875l-.75-5.25a.75.75 0 00-1.48.134l-.275 1.924-1.5-4.026zM6.75 8.25a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75z"/></svg>
              Analytic Hierarchy Process — AHP
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Prioritas Elektrifikasi<br/>
              <span className="text-gold-400">Berbasis Data & Kelayakan</span>
            </h1>
            <p className="text-navy-200 text-lg sm:text-xl leading-relaxed max-w-xl mb-8">
              Dashboard sistem pendukung keputusan untuk menentukan desa prioritas dedieselisasi 
              menggunakan metode <strong className="text-white">Analytic Hierarchy Process (AHP)</strong> 
              — lima kriteria terukur: kebutuhan sosial, potensi lokal, dan kelayakan infrastruktur.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#ranking" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gold-500 text-navy-900 hover:bg-gold-400 transition-all cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h3v16H3V4zm6 4h3v12H9V8zm6-2h3v14h-3V6z"/></svg>
                Lihat Ranking Prioritas
              </a>
              <button onClick={() => document.getElementById('metodologi-section')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-navy-800 text-navy-200 border border-navy-600 hover:bg-navy-700 transition-all cursor-pointer">
                Pelajari Metodologi
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-navy-800/50 backdrop-blur rounded-2xl p-8 border border-navy-700/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-navy-200">Status Data</span>
                <span className="text-xs text-navy-400 ml-auto">Data Prototype</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Desa Terdata', value: totalDesa, color: 'text-gold-400' },
                  { label: 'Provinsi', value: totalProv, color: 'text-white' },
                  { label: 'KK Terdampak', value: totalKK.toLocaleString('id-ID'), color: 'text-white' },
                  { label: 'Rata-rata Skor AHP', value: rataSkor, color: 'text-gold-400' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">{s.label}</div>
                    <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
