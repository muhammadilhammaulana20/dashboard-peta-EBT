import { useState, useEffect } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('beranda')

  useEffect(() => {
    const onScroll = () => {
      const sections = [
        { id: 'beranda', top: 0 },
        { id: 'metodologi', el: document.getElementById('metodologi') },
      ]
      const scrollY = window.scrollY + 120
      let current = 'beranda'
      for (const s of sections) {
        if (s.el) {
          const top = s.el.getBoundingClientRect().top + window.scrollY
          if (scrollY >= top - 100) current = s.id
        }
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setOpen(false)
    if (id === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10, 15, 26, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-full px-6 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 max-w-screen-2xl mx-auto">
          <button onClick={() => scrollTo('beranda')} className="flex items-center gap-3 cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-bold text-navy-900 text-sm">P</div>
            <div>
              <span className="font-bold text-white text-base">PETA<span className="text-gold-400">-EBT</span></span>
              <span className="hidden sm:inline text-xs text-navy-400 ml-2 font-medium">Dashboard Prioritas Elektrifikasi</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => scrollTo('beranda')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${active === 'beranda' ? 'bg-gold-500/10 text-gold-400' : 'text-navy-300 hover:text-white hover:bg-white/5'}`}>
              Beranda
            </button>
            <button onClick={() => scrollTo('metodologi')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${active === 'metodologi' ? 'bg-gold-500/10 text-gold-400' : 'text-navy-300 hover:text-white hover:bg-white/5'}`}>
              Metodologi AHP
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-navy-300 p-2 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 px-6 py-3 space-y-2">
          <button onClick={() => scrollTo('beranda')} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-navy-200 hover:bg-white/5 cursor-pointer">Beranda</button>
          <button onClick={() => scrollTo('metodologi')} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-navy-200 hover:bg-white/5 cursor-pointer">Metodologi AHP</button>
        </div>
      )}
    </nav>
  )
}
