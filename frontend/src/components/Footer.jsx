export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-700/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-bold text-navy-900 text-xs">P</div>
            <span className="font-bold text-white text-sm">PETA<span className="text-gold-400">-EBT</span></span>
          </div>
          <p className="text-xs text-navy-500 text-center">
            © 2026 — Dashboard Prioritas Dedieselisasi Desa 3T<br/>
            Metode AHP — Analytic Hierarchy Process
          </p>
          <div className="text-xs text-navy-500">
            Data: Kemendesa, BPS, ESDM
          </div>
        </div>
      </div>
    </footer>
  )
}
