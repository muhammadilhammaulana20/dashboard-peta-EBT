export default function SummaryCards({ summary }) {
  if (!summary) return null

  const cards = [
    { icon: 'M3 4h3v16H3V4zm6 4h3v12H9V8zm6-2h3v14h-3V6z', label: 'Total Desa', value: summary.total_desa, color: 'from-gold-500/20 to-gold-600/10', iconBg: 'bg-gold-500/15', iconColor: 'text-gold-400' },
    { icon: 'M3 4h3v16H3V4zm6 4h3v12H9V8zm6-2h3v14h-3V6z', label: 'Provinsi', value: summary.total_provinsi, color: 'from-navy-500/20 to-navy-600/10', iconBg: 'bg-navy-500/15', iconColor: 'text-navy-300' },
    { icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', label: 'KK Belum Listrik', value: summary.total_kk_belum_listrik?.toLocaleString('id-ID'), color: 'from-green-500/20 to-green-600/10', iconBg: 'bg-green-500/15', iconColor: 'text-green-400' },
    { icon: 'M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706l.798.207a.75.75 0 00.646-.119A8.25 8.25 0 0012 .75zM3.669 12.884a5.873 5.873 0 008.753 0A5.873 5.873 0 003.67 12.884z', label: 'Rata-rata IPM', value: summary.rata_ipm, color: 'from-blue-500/20 to-blue-600/10', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
  ]

  return (
    <section className="relative -mt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(c => (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} backdrop-blur rounded-xl p-5 border border-navy-700/30`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
                  <svg className={`w-6 h-6 ${c.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon}/></svg>
                </div>
                <div>
                  <div className="text-xs text-navy-400 font-medium uppercase tracking-wider">{c.label}</div>
                  <div className="text-2xl font-extrabold text-white">{c.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
