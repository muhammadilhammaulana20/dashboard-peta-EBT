const KRITERIA_WARNA = [
  { key: 'KK Belum Listrik', color: '#2a8a7f', label: 'KK Belum Listrik', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' },
  { key: 'IPM / Kemiskinan', color: '#6366f1', label: 'IPM / Kemiskinan', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'Potensi EBT Lokal', color: '#34d399', label: 'Potensi EBT', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636' },
  { key: 'Jarak ke Jaringan PLN', color: '#f97316', label: 'Jarak PLN', icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z' },
  { key: 'Biaya per KK', color: '#ec4899', label: 'Biaya per KK', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export default function VillageModal({ village, onClose }) {
  if (!village) return null

  const breakdown = village.skor_breakdown || {}
  const items = KRITERIA_WARNA.map(k => ({
    ...k,
    skor: breakdown[k.key] || 0,
  }))

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-navy-800 rounded-2xl border border-navy-700 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-navy-800 border-b border-navy-700 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-white">{village.desa}</h3>
            <p className="text-sm text-navy-400">{village.kecamatan}, {village.kabupaten}, {village.provinsi}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center text-navy-300 hover:text-white hover:bg-navy-600 transition cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Skor utama */}
          <div className="text-center p-6 rounded-xl bg-navy-900/50 border border-navy-700/50">
            <div className="text-5xl font-extrabold text-teal-400">{village.skor_ahp?.toFixed(1)}</div>
            <div className="text-sm text-navy-400 mt-1">Skor Prioritas AHP</div>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-navy-700 text-navy-200">
              Ranking #{village.ranking_ahp}
            </div>
          </div>

          {/* Detail info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'KK Total', value: village.kk_total?.toLocaleString('id-ID') },
              { label: 'KK Belum Listrik', value: village.kk_belum_listrik?.toLocaleString('id-ID') },
              { label: 'IPM', value: village.ipm },
              { label: 'Kemiskinan', value: `${village.kemiskinan}%` },
              { label: 'Potensi EBT', value: `${village.potensi_ebt?.toFixed(1)} MW` },
              { label: 'BPP Diesel', value: `Rp${village.bpp_diesel?.toLocaleString('id-ID')}/kWh` },
              { label: 'Jarak PLN', value: `${village.jarak_pln} km` },
              { label: 'Akses', value: village.aksesibilitas },
            ].map(d => (
              <div key={d.label} className="p-3 rounded-xl bg-navy-900/30 border border-navy-700/30">
                <div className="text-xs text-navy-400 mb-0.5">{d.label}</div>
                <div className="font-semibold text-navy-100">{d.value}</div>
              </div>
            ))}
          </div>

          {/* Breakdown skor per kriteria */}
          <div>
            <h4 className="font-semibold text-white mb-3">Breakdown Skor per Kriteria</h4>
            <div className="space-y-3">
              {items.map(k => (
                <div key={k.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-navy-200">{k.label}</span>
                    <span className="font-semibold" style={{ color: k.color }}>{k.skor.toFixed(1)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(k.skor * 4, 100)}%`, background: k.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rekomendasi */}
          <div className="p-4 rounded-xl bg-navy-900/50 border border-navy-700/50">
            <div className="text-sm text-navy-400 mb-1">Rekomendasi Teknologi</div>
            <div className="text-lg font-bold text-teal-400">{village.rekomendasi_teknologi}</div>
            <div className="text-xs text-navy-400 mt-2">
              Estimasi biaya: Rp{(village.estimasi_biaya_proyek / 1e9).toFixed(1)} M | 
              Penghematan/thn: Rp{(village.estimasi_penghematan_tahunan / 1e6).toFixed(0)} Jt
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
