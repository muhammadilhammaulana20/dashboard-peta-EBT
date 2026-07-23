export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 lg:px-12 xl:px-16" style={{ background: '#080c15', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center font-bold text-navy-900 text-xs">P</div>
          <span className="font-bold text-white text-sm">PETA<span className="text-teal-400">-EBT</span></span>
        </div>
        <p className="text-xs text-navy-500 text-center">
          © 2026 — Dashboard Prioritas Dedieselisasi Desa 3T<br />
          Metode AHP — Analytic Hierarchy Process
        </p>
        <div className="text-xs text-navy-500">Data: Kemendesa, BPS, ESDM</div>
      </div>
    </footer>
  )
}
