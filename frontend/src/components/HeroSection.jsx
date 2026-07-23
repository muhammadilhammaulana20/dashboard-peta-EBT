import { useEffect, useRef } from 'react'

export default function HeroSection({ summary }) {
  const canvasRef = useRef(null)
  const totalDesa = summary?.total_desa || 0
  const totalProv = summary?.total_provinsi || 0
  const totalKK = summary?.total_kk_terdampak || 0
  const rataIpm = summary?.rata_ipm || '—'
  const rataMiskin = summary?.rata_kemiskinan || '—'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const dots = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      o: Math.random() * 0.3 + 0.05,
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        d.x += d.dx
        d.y += d.dy
        if (d.x < 0 || d.x > canvas.width) d.dx *= -1
        if (d.y < 0 || d.y > canvas.height) d.dy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 192, 44, ${d.o})`
        ctx.fill()
        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j]
          const dx = d.x - d2.x
          const dy = d.y - d2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(d.x, d.y)
            ctx.lineTo(d2.x, d2.y)
            ctx.strokeStyle = `rgba(245, 192, 44, ${0.04 * (1 - dist / 100)})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden" style={{ background: '#0a0f1a' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(245,192,44,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(245,192,44,.12) 1px, transparent 1px)', backgroundSize: '70px 70px' }} />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="relative w-full px-6 lg:px-12 xl:px-16 py-20">
        <div className="grid lg:grid-cols-5 gap-10 items-center max-w-screen-2xl mx-auto">
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-semibold mb-6 text-gold-400" style={{ background: 'rgba(245,192,44,0.06)', border: '1px solid rgba(245,192,44,0.25)' }}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.907a.75.75 0 00-1.466-.298l-1.5 7.5a.75.75 0 00.733.891h4.5a.75.75 0 00.738-.875l-.75-5.25a.75.75 0 00-1.48.134l-.275 1.924-1.5-4.026zM6.75 8.25a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75z"/></svg>
              SISTEM PENDUKUNG KEPUTUSAN — AHP
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
              Prioritas Elektrifikasi<br/>
              <span className="text-gold-400">Desa 3T Berbasis Data</span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed max-w-xl mb-8" style={{ color: '#94a3b8' }}>
              Sistem Pendukung Keputusan untuk menentukan desa prioritas dedieselisasi
              menggunakan <strong className="text-white">Analytic Hierarchy Process</strong>,
              menggabungkan data <strong className="text-white">Kemendesa, BPS, dan ESDM</strong>
              dalam satu dashboard terpadu.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => { const el = document.getElementById('ranking'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-7 py-3.5 font-bold text-sm" style={{ background: '#f5c02c', color: '#0a0f1a', borderRadius: '6px' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h3v16H3V4zm6 4h3v12H9V8zm6-2h3v14h-3V6z"/></svg>
                Lihat Ranking Prioritas
              </button>
              <button onClick={() => { const el = document.getElementById('metodologi'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', borderRadius: '6px' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Pelajari Metodologi
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Desa', value: totalDesa.toLocaleString('id-ID'), sub: `${totalProv} provinsi`, accent: '#f5c02c' },
                { label: 'KK Belum Listrik', value: totalKK.toLocaleString('id-ID'), sub: 'kepala keluarga', accent: '#ef4444' },
                { label: 'Rata-rata IPM', value: rataIpm, sub: 'Indeks Pembangunan Manusia', accent: '#3b82f6' },
                { label: 'Rata-rata Kemiskinan', value: `${rataMiskin}%`, sub: 'penduduk miskin', accent: '#34d399' },
              ].map(s => (
                <div key={s.label} className="p-4" style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                }}>
                  <div className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-1">{s.label}</div>
                  <div className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: s.accent }}>{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.7)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d1421] to-transparent pointer-events-none" />
    </section>
  )
}
