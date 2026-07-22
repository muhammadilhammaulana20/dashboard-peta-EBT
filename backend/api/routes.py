import json
import os
from flask import Blueprint, jsonify, request

api = Blueprint("api", __name__, url_prefix="/api")

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE, "data", "villages.json")


def _load_data():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


@api.route("/health")
def health():
    return jsonify({"status": "ok", "app": "PETA-EBT API", "version": "2.0.0", "metode": "AHP"})


@api.route("/summary")
def get_summary():
    data = _load_data()
    if not data:
        return jsonify({"error": "No data"}), 404

    total_belum = sum(v.get("kk_belum_listrik", 0) for v in data)
    total_kk = sum(v.get("kk_terdampak", 0) for v in data)
    total_penghematan = sum(v.get("estimasi_penghematan_tahunan", 0) for v in data)
    total_biaya = sum(v.get("estimasi_biaya_proyek", 0) for v in data)
    rata_ipm = round(sum(v.get("ipm", 0) for v in data) / len(data), 1)
    rata_kemiskinan = round(sum(v.get("kemiskinan", 0) for v in data) / len(data), 1)
    rata_skor = round(sum(v.get("skor_ahp", 0) for v in data) / len(data), 1)

    return jsonify({
        "total_desa": len(data),
        "total_provinsi": len(set(v["provinsi"] for v in data)),
        "total_kk_belum_listrik": total_belum,
        "total_kk_terdampak": total_kk,
        "total_penghematan_tahunan": total_penghematan,
        "total_estimasi_biaya": total_biaya,
        "rata_ipm": rata_ipm,
        "rata_kemiskinan": rata_kemiskinan,
        "rata_skor_ahp": rata_skor,
    })


@api.route("/villages")
def get_villages():
    data = _load_data()
    prov = request.args.get("provinsi")
    search = request.args.get("search", "").lower()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 50, type=int)

    result = data[:]
    if prov:
        result = [v for v in result if v["provinsi"] == prov]
    if search:
        result = [v for v in result if
                  search in v["desa"].lower() or
                  search in v["kecamatan"].lower() or
                  search in v["kabupaten"].lower() or
                  search in v["provinsi"].lower()]

    total = len(result)
    start = (page - 1) * per_page
    end = start + per_page

    return jsonify({
        "data": result[start:end],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    })


@api.route("/villages/<int:village_id>")
def get_village(village_id):
    data = _load_data()
    for v in data:
        if v["id"] == village_id:
            return jsonify(v)
    return jsonify({"error": "Village not found"}), 404


@api.route("/stats/provinces")
def get_province_stats():
    data = _load_data()
    provs = sorted(set(v["provinsi"] for v in data))
    result = []
    for p in provs:
        filtered = [v for v in data if v["provinsi"] == p]
        result.append({
            "provinsi": p,
            "jumlah_desa": len(filtered),
            "rata_skor_ahp": round(sum(v["skor_ahp"] for v in filtered) / len(filtered), 1),
            "total_kk": sum(v["kk_terdampak"] for v in filtered),
            "rata_ipm": round(sum(v["ipm"] for v in filtered) / len(filtered), 1),
            "rata_kemiskinan": round(sum(v["kemiskinan"] for v in filtered) / len(filtered), 1),
        })
    return jsonify(result)


@api.route("/stats/technology")
def get_technology_stats():
    data = _load_data()
    tech_count = {}
    for v in data:
        t = v["rekomendasi_teknologi"]
        tech_count[t] = tech_count.get(t, 0) + 1
    return jsonify([
        {"teknologi": k, "jumlah": v}
        for k, v in sorted(tech_count.items(), key=lambda x: -x[1])
    ])


@api.route("/stats/score-distribution")
def get_score_distribution():
    data = _load_data()
    bins = [(0, 20), (20, 40), (40, 60), (60, 80), (80, 100)]
    result = []
    for lo, hi in bins:
        count = sum(1 for v in data if lo <= v["skor_ahp"] < hi)
        result.append({"range": f"{lo}-{hi}", "jumlah": count})
    return jsonify(result)


@api.route("/stats/idm-status")
def get_idm_status():
    data = _load_data()
    status_count = {}
    for v in data:
        s = v.get("idm_status", "Tidak Diketahui")
        status_count[s] = status_count.get(s, 0) + 1
    return jsonify([
        {"status": k, "jumlah": v}
        for k, v in sorted(status_count.items(), key=lambda x: -x[1])
    ])


@api.route("/scoring/explain")
def get_scoring_explain():
    from scoring.ahp import AHP
    model = AHP()
    return jsonify(model.explain())


@api.route("/scoring/calculate", methods=["POST"])
def calculate_score():
    body = request.get_json()
    if not body or "weights" not in body:
        return jsonify({"error": "weights required"}), 400

    weights = body["weights"]
    from scoring.ahp import AHP
    ahp = AHP()
    # override weights (untuk slider kalkulator interaktif)
    if len(weights) == ahp.n:
        ahp.weights = weights

    data = _load_data()
    scored = ahp.score(data)
    return jsonify({
        "data": scored,
        "weights": ahp.weights,
    })


@api.route("/data/sources")
def get_data_sources():
    return jsonify([
        {
            "nama": "Indeks Desa Membangun (IDM) — Kemendesa",
            "deskripsi": "Data status perkembangan desa seluruh Indonesia (Mandiri, Maju, Berkembang, Tertinggal, Sangat Tertinggal)",
            "sumber": "Kementerian Desa, PDT, dan Transmigrasi",
            "url": "https://satudata.kemendesa.go.id",
            "tahun": "2023-2025",
            "real": True,
        },
        {
            "nama": "IPM & Kemiskinan — BPS",
            "deskripsi": "Indeks Pembangunan Manusia dan persentase penduduk miskin per kabupaten (2024-2025)",
            "sumber": "Badan Pusat Statistik (BPS)",
            "url": "https://www.bps.go.id",
            "tahun": "2024-2025",
            "real": True,
        },
        {
            "nama": "Potensi EBT — ESDM One Map",
            "deskripsi": "Data potensi energi surya, angin, air, dan biomassa per lokasi",
            "sumber": "Kementerian ESDM — Direktorat Jenderal EBTKE",
            "url": "https://geoportal.esdm.go.id",
            "tahun": "2024-2025",
            "real": True,
        },
        {
            "nama": "Biaya Pokok Produksi (BPP) Diesel — ESDM",
            "deskripsi": "BPP listrik diesel per wilayah, dasar perhitungan efisiensi konversi ke EBT",
            "sumber": "Kementerian ESDM — DJK",
            "url": "https://www.esdm.go.id",
            "tahun": "2024",
            "real": True,
        },
        {
            "nama": "Rencana Usaha Penyediaan Tenaga Listrik (RUPTL) — PLN",
            "deskripsi": "Data jaringan PLN eksisting dan rencana perluasan sampai 2034",
            "sumber": "PT PLN (Persero)",
            "url": "https://www.pln.co.id",
            "tahun": "2024-2034",
            "real": True,
        },
        {
            "nama": "Data Simulasi Tim (Prototype)",
            "deskripsi": "Dataset contoh 30 desa 3T lintas provinsi — disusun manual oleh tim dari kombinasi sumber resmi; untuk versi produksi diperlukan akses data granular resmi dari ESDM/BPS",
            "sumber": "Tim Pengembang PETA-EBT",
            "url": "",
            "tahun": "2026",
            "real": False,
        },
    ])
