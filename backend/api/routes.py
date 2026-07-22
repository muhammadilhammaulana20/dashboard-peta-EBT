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


def _get_province_list(data):
    provs = sorted(set(v["provinsi"] for v in data))
    prov_data = []
    for p in provs:
        filtered = [v for v in data if v["provinsi"] == p]
        prov_data.append({
            "provinsi": p,
            "jumlah_desa": len(filtered),
            "rata_skor": round(sum(v["skor_prioritas"] for v in filtered) / len(filtered), 1),
            "total_kk": sum(v["kk_terdampak"] for v in filtered),
            "total_potensi_mw": round(sum(v["potensi_ebt_mw"] for v in filtered), 1),
        })
    return prov_data


@api.route("/villages")
def get_villages():
    data = _load_data()
    prov = request.args.get("provinsi")
    search = request.args.get("search", "").lower()
    min_skor = request.args.get("min_skor", type=float)
    max_skor = request.args.get("max_skor", type=float)
    sort_by = request.args.get("sort_by", "skor_prioritas")
    sort_dir = request.args.get("sort_dir", "desc")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 100, type=int)

    result = data[:]
    if prov:
        result = [v for v in result if v["provinsi"] == prov]
    if search:
        result = [v for v in result if
                  search in v["desa"].lower() or
                  search in v["kecamatan"].lower() or
                  search in v["kabupaten"].lower() or
                  search in v["provinsi"].lower()]
    if min_skor is not None:
        result = [v for v in result if v["skor_prioritas"] >= min_skor]
    if max_skor is not None:
        result = [v for v in result if v["skor_prioritas"] <= max_skor]

    reverse = sort_dir == "desc"
    if sort_by in result[0] if result else False:
        result.sort(key=lambda v: v.get(sort_by, 0), reverse=reverse)

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


@api.route("/summary")
def get_summary():
    data = _load_data()
    if not data:
        return jsonify({"error": "No data"}), 404

    return jsonify({
        "total_desa": len(data),
        "total_provinsi": len(set(v["provinsi"] for v in data)),
        "total_kk_terdampak": sum(v["kk_terdampak"] for v in data),
        "total_potensi_ebt_mw": round(sum(v["potensi_ebt_mw"] for v in data), 1),
        "total_penghematan_tahunan": sum(v["estimasi_penghematan_tahunan"] for v in data),
        "rata_skor": round(sum(v["skor_prioritas"] for v in data) / len(data), 1),
        "total_estimasi_biaya": sum(v["estimasi_biaya_proyek"] for v in data),
    })


@api.route("/stats/provinces")
def get_province_stats():
    data = _load_data()
    return jsonify(_get_province_list(data))


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
        count = sum(1 for v in data if lo <= v["skor_prioritas"] < hi)
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
    from processor.scoring import ScoringModel
    model = ScoringModel()
    return jsonify(model.explain())


@api.route("/data/sources")
def get_data_sources():
    return jsonify([
        {
            "nama": "Indeks Desa Membangun (IDM) - Kemendesa",
            "deskripsi": "Data status perkembangan desa seluruh Indonesia (Mandiri, Maju, Berkembang, Tertinggal, Sangat Tertinggal)",
            "sumber": "Kementerian Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi",
            "url": "https://satudata.kemendesa.go.id",
            "tahun": "2023-2025",
            "real": True,
        },
        {
            "nama": "IDM Aceh - Open Data Aceh",
            "deskripsi": "Data IDM per kabupaten/kota di Provinsi Aceh (2018-2025)",
            "sumber": "Dinas Pemberdayaan Masyarakat dan Gampong Aceh",
            "url": "https://data.acehprov.go.id",
            "tahun": "2018-2025",
            "real": True,
        },
        {
            "nama": "ESDM One Map",
            "deskripsi": "Peta potensi energi baru terbarukan (EBT) seluruh Indonesia",
            "sumber": "Kementerian ESDM",
            "url": "https://geoportal.esdm.go.id",
            "tahun": "2024",
            "real": True,
        },
        {
            "nama": "PODES - BPS",
            "deskripsi": "Pendataan Potensi Desa: infrastruktur, demografi, akses listrik per desa",
            "sumber": "Badan Pusat Statistik (BPS)",
            "url": "https://www.bps.go.id",
            "tahun": "2024-2026",
            "real": True,
        },
        {
            "nama": "CELIOS - Riset Elektrifikasi",
            "deskripsi": "Riset akses listrik desa dan potensi EBT (data agregat nasional)",
            "sumber": "CELIOS",
            "url": "https://celios.co.id",
            "tahun": "2025-2026",
            "real": True,
        },
    ])


@api.route("/health")
def health():
    return jsonify({"status": "ok", "app": "PETA-EBT API", "version": "1.0.0"})
