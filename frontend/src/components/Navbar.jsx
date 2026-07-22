import { useState } from 'react'

const LINKS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'metodologi', label: 'Metodologi' },
]

export default function Navbar({ page, onPageChange }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onPageChange('beranda')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-bold text-navy-900 text-sm">P</div>
            <div>
              <span className="font-bold text-white text-base">PETA<span className="text-gold-400">-EBT</span></span>
              <span className="hidden sm:inline text-xs text-navy-300 ml-2 font-medium">Dashboard Prioritas Elektrifikasi</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(l => (
              <button
                key={l.id}
                onClick={() => onPageChange(l.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  page === l.id ? 'bg-gold-500/10 text-gold-400' : 'text-navy-200 hover:text-white hover:bg-navy-800'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-navy-200 p-2 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700 px-4 py-3 space-y-2">
          {LINKS.map(l => (
            <button
              key={l.id}
              onClick={() => { onPageChange(l.id); setOpen(false) }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                page === l.id ? 'bg-gold-500/10 text-gold-400' : 'text-navy-200 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
