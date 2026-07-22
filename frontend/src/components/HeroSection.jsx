import { useEffect, useRef } from 'react'

export default function HeroSection({ villages }) {
  const canvasRef = useRef(null)

  const totalDesa = villages.length
  const totalProv = new Set(villages.map(v => v.provinsi)).size
  const totalKK = villages.reduce((s, v) => s + (v.kk_terdampak || 0), 0)
  const rataSkor = totalDesa ? (villages.reduce((s, v) => s + v.skor_ahp, 0) / totalDesa).toFixed(1) : '0'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.5 + 0.1,
    }))

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach((d, i) => {
        d.x += d.dx
        d.y += d.dy
        if (d.x < 0 || d.x > canvas.width) d.dx *= -1
        if (d.y < 0 || d.y > canvas.height) d.dy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 192, 44, ${d.o})`
        ctx.fill()
        // connect nearby dots
        dots.forEach((d2, j) => {
          if (i >= j) return
          const dx = d.x - d2.x, dy = d.y - d2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(d.x, d.y)
            ctx.lineTo(d2.x, d2.y)
            ctx.strokeStyle = `rgba(245, 192, 44, ${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const scrollToRanking = () => {
    const el = document.getElementById('ranking')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0f1d35 30%, #162a4a 60%, #0f1d35 100%)' }}>
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative w-full px-6 lg:px-12 xl:px-16 py-20">
        <div className="grid lg:grid-cols-5 gap-10 items-center max-w-screen-2xl mx-auto">
          {/* Left - Text */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 bg-gold-500/10 text-gold-400 border border-gold-500/20 backdrop-blur-sm">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.907a.75.75 0 00-1.466-.298l-1.5 7.5a.75.75 0 00.733.891h4.5a.75.75 0 00.738-.875l-.75-5.25a.75.75 0 00-1.48.134l-.275 1.924-1.5-4.026zM6.75 8.25a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75z"/></svg>
              Analytic Hierarchy Process — AHP
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
              Prioritas Elektrifikasi<br/>
              <span className="text-gold-400">Desa 3T Berbasis Data</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-200 leading-relaxed max-w-xl mb-8">
              Sistem Pendukung Keputusan untuk menentukan desa prioritas dedieselisasi
              menggunakan <strong className="text-white">Analytic Hierarchy Process</strong> —
              menggabungkan data <strong className="text-white">Kemendesa, BPS, dan ESDM</strong>
              dalam satu dashboard terpadu.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={scrollToRanking} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gold-500 text-navy-900 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/25 transition-all cursor-pointer shadow-lg shadow-gold-500/10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h3v16H3V4zm6 4h3v12H9V8zm6-2h3v14h-3V6z"/></svg>
                Lihat Ranking Prioritas
              </button>
              <button onClick={() => {
                const el = document.getElementById('metodologi')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-white/5 text-navy-200 border border-white/10 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Pelajari Metodologi
              </button>
            </div>
          </div>

          {/* Right - Stats Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Desa', value: totalDesa, sub: `${totalProv} provinsi`, color: 'from-gold-500/20 to-gold-600/5', border: 'border-gold-500/30', accent: 'text-gold-400' },
                { label: 'KK Belum Listrik', value: totalKK.toLocaleString('id-ID'), sub: 'kepala keluarga', color: 'from-red-500/20 to-red-600/5', border: 'border-red-500/30', accent: 'text-red-400' },
                { label: 'Rata-rata IPM', value: villages.length ? (villages.reduce((s, v) => s + v.ipm, 0) / villages.length).toFixed(1) : '—', sub: 'Indeks Pembangunan Manusia', color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', accent: 'text-blue-400' },
                { label: 'Rata-rata Kemiskinan', value: villages.length ? `${(villages.reduce((s, v) => s + v.kemiskinan, 0) / villages.length).toFixed(1)}%` : '—', sub: 'penduduk miskin', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', accent: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} backdrop-blur rounded-2xl p-5 border ${s.border} hover:scale-[1.02] transition-transform`}>
                  <div className="text-xs font-medium text-navy-300 uppercase tracking-wider mb-1">{s.label}</div>
                  <div className={`text-3xl sm:text-4xl font-extrabold ${s.accent} leading-tight`}>{s.value}</div>
                  <div className="text-xs text-navy-400 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d1421] to-transparent pointer-events-none" />
    </section>
  )
}
