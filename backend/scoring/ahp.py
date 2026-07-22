import json
import math
import os


class AHP:
    KRITERIA = [
        "KK Belum Listrik",
        "IPM / Kemiskinan",
        "Potensi EBT Lokal",
        "Jarak ke Jaringan PLN",
        "Biaya per KK",
    ]

    # Pairwise comparison matrix (Saaty scale 1-9)
    # Urutan: KK, IPM, EBT, Jarak, Biaya
    # a_ij = seberapa lebih penting kriteria i dibanding kriteria j
    # Hasil eigenvector: [25.6%, 25.6%, 19.4%, 14.7%, 14.7%] ~ sesuai PRD
    # Consistency Ratio = 0.017 (< 0.1 → konsisten)
    PAIRWISE_MATRIX = [
        [1,   1,   1,   2,   2],  # KK Belum Listrik
        [1,   1,   1,   2,   2],  # IPM / Kemiskinan
        [1,   1,   1,   1,   1],  # Potensi EBT
        [1/2, 1/2, 1,   1,   1],  # Jarak PLN
        [1/2, 1/2, 1,   1,   1],  # Biaya per KK
    ]

    RI = {1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49}

    def __init__(self):
        self.n = len(self.KRITERIA)
        self.matrix = self.PAIRWISE_MATRIX
        self.weights = self._compute_weights()
        self.ci, self.cr = self._compute_consistency()

    def _compute_weights(self):
        # Geometric mean method (more accurate than row average)
        n = self.n
        geom_means = []
        for i in range(n):
            prod = 1.0
            for j in range(n):
                prod *= self.matrix[i][j]
            geom_means.append(prod ** (1 / n))
        total = sum(geom_means)
        return [round(g / total, 4) for g in geom_means]

    def _compute_consistency(self):
        n = self.n
        # Lambda max
        weighted_sum = []
        for i in range(n):
            ws = 0.0
            for j in range(n):
                ws += self.matrix[i][j] * self.weights[j]
            weighted_sum.append(ws / self.weights[i])
        lambda_max = sum(weighted_sum) / n

        ci = (lambda_max - n) / (n - 1)
        ri = self.RI.get(n, 1.12)
        cr = ci / ri if ri > 0 else 0
        return round(ci, 4), round(cr, 4)

    def get_pairwise_matrix_display(self):
        headers = self.KRITERIA
        rows = []
        for i in range(self.n):
            row = []
            for j in range(self.n):
                val = self.matrix[i][j]
                if val == 1.0:
                    row.append(1)
                elif val == int(val):
                    row.append(int(val))
                else:
                    row.append(round(val, 1))
            rows.append({"kriteria": headers[i], "nilai": row})
        return {"headers": headers, "rows": rows}

    def explain(self):
        return {
            "metode": "Analytic Hierarchy Process (AHP) — Metode Perbandingan Berpasangan Saaty",
            "versi": "2.0.0",
            "n_kriteria": self.n,
            "kriteria": [
                {
                    "nama": self.KRITERIA[i],
                    "bobot": self.weights[i],
                    "persen": f"{round(self.weights[i] * 100)}%",
                }
                for i in range(self.n)
            ],
            "konsistensi": {
                "lambda_max": round(sum(
                    sum(self.matrix[i][j] * self.weights[j] for j in range(self.n))
                    / self.weights[i] for i in range(self.n)
                ) / self.n, 4),
                "ci": self.ci,
                "cr": self.cr,
                "konsisten": self.cr < 0.1,
                "interpretasi": "Konsisten (CR < 0.1)"
                if self.cr < 0.1
                else f"Tidak konsisten (CR = {self.cr} >= 0.1), periksa penilaian"
                if self.cr >= 0.1
                else "Sangat konsisten (CR = 0)",
            },
            "matrix": self.get_pairwise_matrix_display(),
        }

    def score(self, villages):
        # villages: list of dict with keys:
        # kk_belum_listrik, ipm, kemiskinan, potensi_ebt, jarak_pln, biaya_per_kk

        if not villages:
            return []

        # Tentukan min/max untuk normalisasi
        vals = {k: [] for k in ["kk_belum_listrik", "ipm", "kemiskinan", "potensi_ebt", "jarak_pln", "biaya_per_kk"]}
        for v in villages:
            for key in vals:
                vals[key].append(v.get(key, 0))

        # Hitung skor untuk setiap desa
        scored = []
        for v in villages:
            # Normalisasi 0-1
            kk_norm = self._minmax(v.get("kk_belum_listrik", 0), vals["kk_belum_listrik"], higher_is_better=True)
            ipm_norm = self._minmax(v.get("ipm", 0), vals["ipm"], higher_is_better=False)  # IPM rendah = prioritas tinggi
            kemiskinan_norm = self._minmax(v.get("kemiskinan", 0), vals["kemiskinan"], higher_is_better=True)
            ebt_norm = self._minmax(v.get("potensi_ebt", 0), vals["potensi_ebt"], higher_is_better=True)
            jarak_norm = self._minmax(v.get("jarak_pln", 0), vals["jarak_pln"], higher_is_better=True)  # semakin jauh semakin prioritas (lebih mahal sambung)
            biaya_norm = self._minmax(v.get("biaya_per_kk", 0), vals["biaya_per_kk"], higher_is_better=False)  # semakin murah semakin prioritas (efisiensi)

            # Gabung IPM + kemiskinan jadi satu kriteria "IPM / Kemiskinan"
            sosial_norm = (ipm_norm + kemiskinan_norm) / 2

            raw = [
                kk_norm * self.weights[0],
                sosial_norm * self.weights[1],
                ebt_norm * self.weights[2],
                jarak_norm * self.weights[3],
                biaya_norm * self.weights[4],
            ]
            skor_total = sum(raw) * 100

            scored.append({
                **v,
                "skor_ahp": round(skor_total, 1),
                "skor_breakdown": {
                    self.KRITERIA[0]: round(raw[0] * 100, 1),
                    self.KRITERIA[1]: round(raw[1] * 100, 1),
                    self.KRITERIA[2]: round(raw[2] * 100, 1),
                    self.KRITERIA[3]: round(raw[3] * 100, 1),
                    self.KRITERIA[4]: round(raw[4] * 100, 1),
                },
                "nilai_normalisasi": {
                    "kk_belum_listrik": round(kk_norm, 3),
                    "sosial": round(sosial_norm, 3),
                    "potensi_ebt": round(ebt_norm, 3),
                    "jarak_pln": round(jarak_norm, 3),
                    "biaya_per_kk": round(biaya_norm, 3),
                },
            })

        scored.sort(key=lambda x: x["skor_ahp"], reverse=True)
        for i, v in enumerate(scored):
            v["ranking_ahp"] = i + 1

        return scored

    def _minmax(self, val, all_vals, higher_is_better=True):
        mn = min(all_vals)
        mx = max(all_vals)
        if mx == mn:
            return 0.5
        if higher_is_better:
            return (val - mn) / (mx - mn)
        else:
            return (mx - val) / (mx - mn)
