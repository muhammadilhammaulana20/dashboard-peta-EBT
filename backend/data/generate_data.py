import json
import random
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(BASE))  # untuk import scoring

# 30 desa sampel dari berbagai provinsi — representatif 3T
SAMPEL_DESA = [
    # NTT (desa 3T klasik)
    {"desa": "Onggaya", "kecamatan": "Wolowaru", "kabupaten": "Ende", "provinsi": "NTT",
     "kk_total": 420, "pct_belum": 0.68, "pct_diesel": 0.55, "pot_surya": 5.8, "pot_angin": 3.2, "pot_mikro": 1.5, "pot_biom": 0.8,
     "bpp": 4200, "jarak_pln": 85, "idm_status": "Tertinggal", "ipm": 58.2, "kemiskinan": 28.5},
    {"desa": "Watunggene", "kecamatan": "Kota Komba", "kabupaten": "Manggarai Timur", "provinsi": "NTT",
     "kk_total": 310, "pct_belum": 0.72, "pct_diesel": 0.60, "pot_surya": 5.6, "pot_angin": 2.8, "pot_mikro": 3.2, "pot_biom": 1.2,
     "bpp": 4400, "jarak_pln": 92, "idm_status": "Tertinggal", "ipm": 56.0, "kemiskinan": 31.2},
    {"desa": "Haruru", "kecamatan": "Wae Rii", "kabupaten": "Manggarai", "provinsi": "NTT",
     "kk_total": 275, "pct_belum": 0.75, "pct_diesel": 0.58, "pot_surya": 5.4, "pot_angin": 2.5, "pot_mikro": 4.0, "pot_biom": 1.0,
     "bpp": 4300, "jarak_pln": 78, "idm_status": "Tertinggal", "ipm": 55.8, "kemiskinan": 32.0},
    # Papua
    {"desa": "Wamena Kota", "kecamatan": "Wamena", "kabupaten": "Jayawijaya", "provinsi": "Papua Pegunungan",
     "kk_total": 680, "pct_belum": 0.82, "pct_diesel": 0.70, "pot_surya": 5.2, "pot_angin": 1.8, "pot_mikro": 2.5, "pot_biom": 1.5,
     "bpp": 4800, "jarak_pln": 150, "idm_status": "Sangat Tertinggal", "ipm": 42.0, "kemiskinan": 42.5},
    {"desa": "Timika Jaya", "kecamatan": "Mimika Baru", "kabupaten": "Mimika", "provinsi": "Papua Tengah",
     "kk_total": 520, "pct_belum": 0.65, "pct_diesel": 0.55, "pot_surya": 5.0, "pot_angin": 2.0, "pot_mikro": 3.0, "pot_biom": 1.8,
     "bpp": 4600, "jarak_pln": 120, "idm_status": "Tertinggal", "ipm": 45.3, "kemiskinan": 38.7},
    {"desa": "Merauke Kota", "kecamatan": "Merauke", "kabupaten": "Merauke", "provinsi": "Papua Selatan",
     "kk_total": 450, "pct_belum": 0.58, "pct_diesel": 0.45, "pot_surya": 5.5, "pot_angin": 2.2, "pot_mikro": 1.0, "pot_biom": 0.5,
     "bpp": 4400, "jarak_pln": 95, "idm_status": "Berkembang", "ipm": 48.5, "kemiskinan": 35.0},
    # Maluku
    {"desa": "Passo", "kecamatan": "Teluk Ambon", "kabupaten": "Maluku Tengah", "provinsi": "Maluku",
     "kk_total": 380, "pct_belum": 0.55, "pct_diesel": 0.48, "pot_surya": 5.3, "pot_angin": 3.8, "pot_mikro": 0.5, "pot_biom": 2.0,
     "bpp": 4100, "jarak_pln": 65, "idm_status": "Berkembang", "ipm": 52.0, "kemiskinan": 30.2},
    {"desa": "Bula", "kecamatan": "Bula", "kabupaten": "Seram Bagian Timur", "provinsi": "Maluku",
     "kk_total": 290, "pct_belum": 0.62, "pct_diesel": 0.52, "pot_surya": 5.1, "pot_angin": 3.5, "pot_mikro": 1.8, "pot_biom": 1.0,
     "bpp": 4200, "jarak_pln": 88, "idm_status": "Tertinggal", "ipm": 50.5, "kemiskinan": 33.5},
    {"desa": "Wokam", "kecamatan": "Pulau-Pulau Aru", "kabupaten": "Kepulauan Aru", "provinsi": "Maluku",
     "kk_total": 180, "pct_belum": 0.78, "pct_diesel": 0.65, "pot_surya": 5.7, "pot_angin": 4.2, "pot_mikro": 0, "pot_biom": 0.3,
     "bpp": 4500, "jarak_pln": 130, "idm_status": "Sangat Tertinggal", "ipm": 47.0, "kemiskinan": 36.0},
    # Aceh
    {"desa": "Lhoknga", "kecamatan": "Lhoknga", "kabupaten": "Aceh Besar", "provinsi": "Aceh",
     "kk_total": 350, "pct_belum": 0.25, "pct_diesel": 0.30, "pot_surya": 5.0, "pot_angin": 2.5, "pot_mikro": 1.0, "pot_biom": 0.5,
     "bpp": 3200, "jarak_pln": 15, "idm_status": "Maju", "ipm": 65.0, "kemiskinan": 18.5},
    {"desa": "Pante", "kecamatan": "Pante Bidari", "kabupaten": "Aceh Timur", "provinsi": "Aceh",
     "kk_total": 280, "pct_belum": 0.35, "pct_diesel": 0.40, "pot_surya": 4.8, "pot_angin": 2.0, "pot_mikro": 2.5, "pot_biom": 1.0,
     "bpp": 3400, "jarak_pln": 28, "idm_status": "Berkembang", "ipm": 62.0, "kemiskinan": 20.0},
    {"desa": "Krueng Sabee", "kecamatan": "Krueng Sabee", "kabupaten": "Aceh Jaya", "provinsi": "Aceh",
     "kk_total": 230, "pct_belum": 0.40, "pct_diesel": 0.35, "pot_surya": 4.9, "pot_angin": 2.8, "pot_mikro": 3.0, "pot_biom": 0.8,
     "bpp": 3500, "jarak_pln": 35, "idm_status": "Berkembang", "ipm": 60.5, "kemiskinan": 22.0},
    # Sumatera Utara
    {"desa": "Sidorejo", "kecamatan": "Bandar Pasir Mandoge", "kabupaten": "Asahan", "provinsi": "Sumatera Utara",
     "kk_total": 310, "pct_belum": 0.20, "pct_diesel": 0.25, "pot_surya": 4.5, "pot_angin": 1.5, "pot_mikro": 2.0, "pot_biom": 1.5,
     "bpp": 2800, "jarak_pln": 18, "idm_status": "Maju", "ipm": 68.0, "kemiskinan": 15.0},
    {"desa": "Sialang", "kecamatan": "Siais", "kabupaten": "Tapanuli Selatan", "provinsi": "Sumatera Utara",
     "kk_total": 260, "pct_belum": 0.30, "pct_diesel": 0.35, "pot_surya": 4.3, "pot_angin": 1.2, "pot_mikro": 3.5, "pot_biom": 2.0,
     "bpp": 3000, "jarak_pln": 22, "idm_status": "Berkembang", "ipm": 65.5, "kemiskinan": 17.5},
    # Kalimantan Barat
    {"desa": "Sintang", "kecamatan": "Sintang", "kabupaten": "Sintang", "provinsi": "Kalimantan Barat",
     "kk_total": 340, "pct_belum": 0.32, "pct_diesel": 0.38, "pot_surya": 4.6, "pot_angin": 1.0, "pot_mikro": 4.5, "pot_biom": 3.0,
     "bpp": 3300, "jarak_pln": 45, "idm_status": "Berkembang", "ipm": 61.0, "kemiskinan": 21.0},
    {"desa": "Sambas", "kecamatan": "Sambas", "kabupaten": "Sambas", "provinsi": "Kalimantan Barat",
     "kk_total": 300, "pct_belum": 0.22, "pct_diesel": 0.28, "pot_surya": 4.4, "pot_angin": 0.8, "pot_mikro": 2.0, "pot_biom": 2.5,
     "bpp": 2900, "jarak_pln": 20, "idm_status": "Maju", "ipm": 64.0, "kemiskinan": 18.0},
    # Sulawesi Tenggara
    {"desa": "Wakatobi", "kecamatan": "Wangi-Wangi", "kabupaten": "Wakatobi", "provinsi": "Sulawesi Tenggara",
     "kk_total": 250, "pct_belum": 0.45, "pct_diesel": 0.42, "pot_surya": 5.9, "pot_angin": 4.0, "pot_mikro": 0, "pot_biom": 0.5,
     "bpp": 3800, "jarak_pln": 55, "idm_status": "Berkembang", "ipm": 58.0, "kemiskinan": 25.5},
    {"desa": "Konawe", "kecamatan": "Konawe", "kabupaten": "Konawe", "provinsi": "Sulawesi Tenggara",
     "kk_total": 320, "pct_belum": 0.28, "pct_diesel": 0.32, "pot_surya": 5.2, "pot_angin": 2.0, "pot_mikro": 2.8, "pot_biom": 1.5,
     "bpp": 3100, "jarak_pln": 25, "idm_status": "Berkembang", "ipm": 62.5, "kemiskinan": 19.0},
    # NTB
    {"desa": "Sumbawa", "kecamatan": "Sumbawa", "kabupaten": "Sumbawa", "provinsi": "NTB",
     "kk_total": 360, "pct_belum": 0.30, "pct_diesel": 0.33, "pot_surya": 6.2, "pot_angin": 3.0, "pot_mikro": 1.0, "pot_biom": 0.8,
     "bpp": 3500, "jarak_pln": 30, "idm_status": "Berkembang", "ipm": 60.0, "kemiskinan": 23.5},
    {"desa": "Lombok Utara", "kecamatan": "Bayan", "kabupaten": "Lombok Utara", "provinsi": "NTB",
     "kk_total": 290, "pct_belum": 0.35, "pct_diesel": 0.38, "pot_surya": 6.0, "pot_angin": 2.5, "pot_mikro": 2.0, "pot_biom": 1.2,
     "bpp": 3400, "jarak_pln": 32, "idm_status": "Berkembang", "ipm": 59.0, "kemiskinan": 24.5},
    # Kalimantan Utara
    {"desa": "Malinau", "kecamatan": "Malinau Kota", "kabupaten": "Malinau", "provinsi": "Kalimantan Utara",
     "kk_total": 200, "pct_belum": 0.38, "pct_diesel": 0.40, "pot_surya": 4.7, "pot_angin": 1.5, "pot_mikro": 5.0, "pot_biom": 2.5,
     "bpp": 3600, "jarak_pln": 48, "idm_status": "Berkembang", "ipm": 61.5, "kemiskinan": 20.0},
    {"desa": "Nunukan", "kecamatan": "Nunukan", "kabupaten": "Nunukan", "provinsi": "Kalimantan Utara",
     "kk_total": 180, "pct_belum": 0.42, "pct_diesel": 0.45, "pot_surya": 4.5, "pot_angin": 1.8, "pot_mikro": 4.0, "pot_biom": 2.0,
     "bpp": 3700, "jarak_pln": 52, "idm_status": "Tertinggal", "ipm": 59.5, "kemiskinan": 22.5},
    # Sulawesi Barat
    {"desa": "Majene", "kecamatan": "Majene", "kabupaten": "Majene", "provinsi": "Sulawesi Barat",
     "kk_total": 270, "pct_belum": 0.25, "pct_diesel": 0.30, "pot_surya": 5.1, "pot_angin": 2.2, "pot_mikro": 2.5, "pot_biom": 1.0,
     "bpp": 3000, "jarak_pln": 18, "idm_status": "Maju", "ipm": 64.5, "kemiskinan": 17.0},
    {"desa": "Mamasa", "kecamatan": "Mamasa", "kabupaten": "Mamasa", "provinsi": "Sulawesi Barat",
     "kk_total": 230, "pct_belum": 0.33, "pct_diesel": 0.36, "pot_surya": 4.9, "pot_angin": 1.8, "pot_mikro": 3.5, "pot_biom": 1.8,
     "bpp": 3200, "jarak_pln": 35, "idm_status": "Berkembang", "ipm": 61.0, "kemiskinan": 20.5},
    # Gorontalo
    {"desa": "Pohuwato", "kecamatan": "Pohuwato", "kabupaten": "Pohuwato", "provinsi": "Gorontalo",
     "kk_total": 240, "pct_belum": 0.35, "pct_diesel": 0.38, "pot_surya": 5.5, "pot_angin": 2.0, "pot_mikro": 2.0, "pot_biom": 1.0,
     "bpp": 3400, "jarak_pln": 28, "idm_status": "Berkembang", "ipm": 60.0, "kemiskinan": 22.0},
    # Papua Barat
    {"desa": "Manokwari", "kecamatan": "Manokwari Barat", "kabupaten": "Manokwari", "provinsi": "Papua Barat",
     "kk_total": 380, "pct_belum": 0.55, "pct_diesel": 0.50, "pot_surya": 5.3, "pot_angin": 2.5, "pot_mikro": 2.0, "pot_biom": 1.5,
     "bpp": 4300, "jarak_pln": 60, "idm_status": "Tertinggal", "ipm": 49.0, "kemiskinan": 34.0},
    {"desa": "Sorong", "kecamatan": "Sorong Timur", "kabupaten": "Sorong", "provinsi": "Papua Barat Daya",
     "kk_total": 340, "pct_belum": 0.50, "pct_diesel": 0.45, "pot_surya": 5.4, "pot_angin": 2.8, "pot_mikro": 1.5, "pot_biom": 1.0,
     "bpp": 4200, "jarak_pln": 55, "idm_status": "Tertinggal", "ipm": 50.5, "kemiskinan": 32.0},
    # Bengkulu
    {"desa": "Mukomuko", "kecamatan": "Mukomuko", "kabupaten": "Mukomuko", "provinsi": "Bengkulu",
     "kk_total": 260, "pct_belum": 0.28, "pct_diesel": 0.32, "pot_surya": 4.6, "pot_angin": 1.5, "pot_mikro": 3.0, "pot_biom": 1.8,
     "bpp": 3000, "jarak_pln": 20, "idm_status": "Maju", "ipm": 63.0, "kemiskinan": 19.5},
    # Maluku Utara
    {"desa": "Ternate", "kecamatan": "Ternate Selatan", "kabupaten": "Ternate", "provinsi": "Maluku Utara",
     "kk_total": 350, "pct_belum": 0.30, "pct_diesel": 0.35, "pot_surya": 5.2, "pot_angin": 3.0, "pot_mikro": 0.5, "pot_biom": 0.5,
     "bpp": 3600, "jarak_pln": 25, "idm_status": "Berkembang", "ipm": 62.0, "kemiskinan": 21.0},
]

TEKNOLOGI_LIST = ["PLTS + Battery", "PLTMH (Mikrohidro)", "PLTB (Angin)", "PLTBm (Biomassa)", "PLTS Hybrid"]


def _determine_idm_status(ipm, kemiskinan):
    skor = (ipm + (100 - kemiskinan)) / 2
    if skor >= 75:
        return "Mandiri"
    elif skor >= 65:
        return "Maju"
    elif skor >= 55:
        return "Berkembang"
    elif skor >= 45:
        return "Tertinggal"
    else:
        return "Sangat Tertinggal"


def _rekomendasi_teknologi(pot_surya, pot_angin, pot_mikro, pot_biom):
    vals = [
        (pot_surya, "PLTS + Battery"),
        (pot_mikro, "PLTMH (Mikrohidro)"),
        (pot_angin, "PLTB (Angin)"),
        (pot_biom, "PLTBm (Biomassa)"),
    ]
    max_val = max(v[0] for v in vals)
    candidates = [v[1] for v in vals if v[0] == max_val]
    return candidates[0]


def generate():
    random.seed(42)
    villages = []

    for i, s in enumerate(SAMPEL_DESA):
        kk_belum = int(s["kk_total"] * s["pct_belum"])
        kk_diesel = int(s["kk_total"] * s["pct_diesel"])
        idm_status = _determine_idm_status(s["ipm"], s["kemiskinan"])
        rekom = _rekomendasi_teknologi(s["pot_surya"], s["pot_angin"], s["pot_mikro"], s["pot_biom"])

        biaya_per_kk = random.randint(8, 25) * 100000
        penghematan = round(s["bpp"] * kk_diesel * 365 * random.uniform(0.3, 0.6) * 5 / 1000) * 1000
        estimasi_biaya = kk_belum * biaya_per_kk
        potensi_total = round(s["pot_surya"] + s["pot_angin"] + s["pot_mikro"] + s["pot_biom"], 2)

        if s["jarak_pln"] > 60:
            akses = "Sulit"
        elif s["jarak_pln"] > 25:
            akses = "Sedang"
        else:
            akses = "Mudah"

        # Cari potensi dominan untuk ditampilkan
        pot_maks = max(s["pot_surya"], s["pot_mikro"], s["pot_angin"], s["pot_biom"])
        if pot_maks == s["pot_surya"]:
            pot_dominan = "PLTS + Battery"
        elif pot_maks == s["pot_mikro"]:
            pot_dominan = "PLTMH (Mikrohidro)"
        elif pot_maks == s["pot_angin"]:
            pot_dominan = "PLTB (Angin)"
        else:
            pot_dominan = "PLTBm (Biomassa)"

        villages.append({
            "id": i + 1,
            "desa": s["desa"],
            "kecamatan": s["kecamatan"],
            "kabupaten": s["kabupaten"],
            "provinsi": s["provinsi"],
            "kk_total": s["kk_total"],
            "kk_belum_listrik": kk_belum,
            "kk_diesel": kk_diesel,
            "kk_terdampak": kk_belum + kk_diesel,
            "ipm": s["ipm"],
            "kemiskinan": s["kemiskinan"],
            "potensi_ebt": potensi_total,
            "pot_surya": s["pot_surya"],
            "pot_mikrohidro": s["pot_mikro"],
            "pot_angin": s["pot_angin"],
            "pot_biomassa": s["pot_biom"],
            "potensi_dominan": pot_dominan,
            "bpp_diesel": s["bpp"],
            "jarak_pln": s["jarak_pln"],
            "biaya_per_kk": biaya_per_kk,
            "aksesibilitas": akses,
            "idm_status": idm_status,
            "rekomendasi_teknologi": rekom,
            "estimasi_penghematan_tahunan": penghematan,
            "estimasi_biaya_proyek": estimasi_biaya,
        })

    # Hitung AHP score
    from scoring.ahp import AHP
    ahp = AHP()
    villages = ahp.score(villages)

    # Hapus field sementara yg dipakai internal
    for v in villages:
        v.pop("nilai_normalisasi", None)

    out_path = os.path.join(BASE, "villages.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(villages, f, ensure_ascii=False, indent=2)
    print(f"Generated {len(villages)} villages with AHP scores. Saved to {out_path}")


if __name__ == "__main__":
    generate()
