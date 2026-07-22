import { useState } from 'react'

export default function Navbar({ page, onPageChange }) {
  const [open, setOpen] = useState(false)

  const handleNav = (id) => {
    setOpen(false)
    if (id === 'beranda' && page === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    onPageChange(id)
    if (id === 'beranda') {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10, 15, 26, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="w-full px-6 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16 max-w-screen-2xl mx-auto">
          <button onClick={() => handleNav('beranda')} className="flex items-center gap-3 cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-bold text-navy-900 text-sm">P</div>
            <div>
              <span className="font-bold text-white text-base">PETA<span className="text-gold-400">-EBT</span></span>
              <span className="hidden sm:inline text-xs text-navy-400 ml-2 font-medium">Dashboard Prioritas Elektrifikasi</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => handleNav('beranda')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${page === 'beranda' ? 'bg-gold-500/10 text-gold-400' : 'text-navy-300 hover:text-white hover:bg-white/5'}`}>
              Beranda
            </button>
            <button onClick={() => {
              if (page !== 'beranda') onPageChange('beranda')
              setTimeout(() => {
                const el = document.getElementById('metodologi')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${page === 'metodologi' ? 'bg-gold-500/10 text-gold-400' : 'text-navy-300 hover:text-white hover:bg-white/5'}`}>
              Metodologi
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
          <button onClick={() => handleNav('beranda')} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-navy-200 hover:bg-white/5 cursor-pointer">Beranda</button>
          <button onClick={() => { setOpen(false); onPageChange('metodologi') }} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-navy-200 hover:bg-white/5 cursor-pointer">Metodologi</button>
        </div>
      )}
    </nav>
  )
}
