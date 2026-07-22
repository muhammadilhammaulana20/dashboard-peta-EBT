class ScoringModel:
    def __init__(self):
        self.weights = {
            "potensi_ebt": 0.30,
            "kk_terdampak": 0.25,
            "bpp_diesel": 0.20,
            "jarak_pln": 0.15,
            "aksesibilitas": 0.10,
        }

    def explain(self):
        return {
            "metode": "Multi-Criteria Decision Analysis (MCDA) - Weighted Sum Model",
            "versi": "1.0.0",
            "variabel": [
                {"nama": "Potensi EBT Lokal", "bobot": self.weights["potensi_ebt"], "skala": "0–8 MW", "justifikasi": "Semakin besar potensi EBT lokal, semakin layak investasi"},
                {"nama": "KK Terdampak", "bobot": self.weights["kk_terdampak"], "skala": "0–2000+ KK", "justifikasi": "Prioritas pada jumlah penerima manfaat terbanyak"},
                {"nama": "Biaya Diesel (BPP)", "bobot": self.weights["bpp_diesel"], "skala": "Rp2.200–5.000/kWh", "justifikasi": "BPP tinggi = penghematan lebih besar jika konversi ke EBT"},
                {"nama": "Jarak ke Jaringan PLN", "bobot": self.weights["jarak_pln"], "skala": "3–150 km", "justifikasi": "Semakin jauh = semakin mahal sambungan, EBT off-grid lebih ekonomis"},
                {"nama": "Aksesibilitas Geografis", "bobot": self.weights["aksesibilitas"], "skala": "Mudah/Sedang/Sulit", "justifikasi": "Medan sulit meningkatkan biaya konstruksi"},
            ],
            "rumus": "Skor = Σ(wi × vi_normalized) × 100",
        }

    def normalize(self, value, min_val, max_val, higher_is_better=True):
        if max_val == min_val:
            return 0.5
        normalized = (value - min_val) / (max_val - min_val)
        return normalized if higher_is_better else (1 - normalized)

    def calculate_score(self, village):
        potensi = min(village.get("potensi_ebt_mw", 0) / 8, 1)
        kk = min(village.get("kk_terdampak", 0) / 2000, 1)
        bpp = min(village.get("bpp_diesel", 2200) / 5000, 1)
        jarak = min(village.get("jarak_pln_km", 0) / 150, 1)
        akses_map = {"Sulit": 1.0, "Sedang": 0.6, "Mudah": 0.2}
        akses = akses_map.get(village.get("aksesibilitas", "Mudah"), 0.2)

        return round(
            potensi * self.weights["potensi_ebt"] * 100 +
            kk * self.weights["kk_terdampak"] * 100 +
            bpp * self.weights["bpp_diesel"] * 100 +
            jarak * self.weights["jarak_pln"] * 100 +
            akses * self.weights["aksesibilitas"] * 100
        , 1)
