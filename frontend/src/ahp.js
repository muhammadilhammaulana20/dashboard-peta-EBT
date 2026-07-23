function minmax(val, allVals, higherIsBetter) {
  let mn = Infinity, mx = -Infinity
  for (const v of allVals) {
    if (v < mn) mn = v
    if (v > mx) mx = v
  }
  if (mx === mn) return 0.5
  return higherIsBetter ? (val - mn) / (mx - mn) : (mx - val) / (mx - mn)
}

function precomputeNormParams(villages) {
  const keys = ['kk_belum_listrik', 'ipm', 'kemiskinan', 'potensi_ebt', 'jarak_pln', 'biaya_per_kk']
  const params = {}
  for (const key of keys) {
    let mn = Infinity, mx = -Infinity
    for (const v of villages) {
      const val = v[key] ?? 0
      if (val < mn) mn = val
      if (val > mx) mx = val
    }
    params[key] = { mn, mx }
  }
  return params
}

export function scoreAll(villages, weights, normParams) {
  const out = []
  for (const v of villages) {
    const kk = v.kk_belum_listrik ?? 0
    const ipm = v.ipm ?? 0
    const kemiskinan = v.kemiskinan ?? 0
    const ebt = v.potensi_ebt ?? 0
    const jarak = v.jarak_pln ?? 0
    const biaya = v.biaya_per_kk ?? 0

    const kkNorm = (normParams.kk_belum_listrik.mx !== normParams.kk_belum_listrik.mn)
      ? (kk - normParams.kk_belum_listrik.mn) / (normParams.kk_belum_listrik.mx - normParams.kk_belum_listrik.mn) : 0.5
    const ipmNorm = (normParams.ipm.mx !== normParams.ipm.mn)
      ? (normParams.ipm.mx - ipm) / (normParams.ipm.mx - normParams.ipm.mn) : 0.5
    const kemiskinanNorm = (normParams.kemiskinan.mx !== normParams.kemiskinan.mn)
      ? (kemiskinan - normParams.kemiskinan.mn) / (normParams.kemiskinan.mx - normParams.kemiskinan.mn) : 0.5
    const ebtNorm = (normParams.ebt.mx !== normParams.ebt.mn)
      ? (ebt - normParams.ebt.mn) / (normParams.ebt.mx - normParams.ebt.mn) : 0.5
    const jarakNorm = (normParams.jarak_pln.mx !== normParams.jarak_pln.mn)
      ? (jarak - normParams.jarak_pln.mn) / (normParams.jarak_pln.mx - normParams.jarak_pln.mn) : 0.5
    const biayaNorm = (normParams.biaya_per_kk.mx !== normParams.biaya_per_kk.mn)
      ? (normParams.biaya_per_kk.mx - biaya) / (normParams.biaya_per_kk.mx - normParams.biaya_per_kk.mn) : 0.5

    const sosialNorm = (ipmNorm + kemiskinanNorm) / 2

    const raw = [
      kkNorm * weights[0],
      sosialNorm * weights[1],
      ebtNorm * weights[2],
      jarakNorm * weights[3],
      biayaNorm * weights[4],
    ]
    const skorTotal = (raw[0] + raw[1] + raw[2] + raw[3] + raw[4]) * 100

    out.push({
      ...v,
      skor_ahp: Math.round(skorTotal * 10) / 10,
      skor_breakdown: {
        'KK Belum Listrik': Math.round(raw[0] * 100 * 10) / 10,
        'IPM / Kemiskinan': Math.round(raw[1] * 100 * 10) / 10,
        'Potensi EBT Lokal': Math.round(raw[2] * 100 * 10) / 10,
        'Jarak ke Jaringan PLN': Math.round(raw[3] * 100 * 10) / 10,
        'Biaya per KK': Math.round(raw[4] * 100 * 10) / 10,
      },
    })
  }

  out.sort((a, b) => b.skor_ahp - a.skor_ahp)
  for (let i = 0; i < out.length; i++) out[i].ranking_ahp = i + 1
  return out
}

export { precomputeNormParams }
