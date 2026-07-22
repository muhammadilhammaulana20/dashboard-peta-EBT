"""
PETA-EBT Data Fetcher
Ambil data real dari portal open data pemerintah Indonesia.

Cara pakai:
    python fetch_real_data.py

Hasil akan disimpan ke ../backend/data/
"""

import csv
import json
import os
import sys
from urllib.request import urlopen, Request

BASE = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(BASE, "..", "backend", "data")


def fetch_csv(url, filename):
    path = os.path.join(OUTPUT, filename)
    print(f"[FETCH] Downloading {filename}...")
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urlopen(req, timeout=30) as resp:
            content = resp.read().decode("utf-8-sig")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        rows = content.split("\n")
        print(f"  OK: {len(rows)} baris -> {filename}")
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


def fetch_idm_aceh():
    url = ("https://data.acehprov.go.id/dataset/1ff0d14c-d0b2-4817-ad4f-9febdbf00a71/"
           "resource/ac1518eb-0d52-4c06-9162-25d95ddb8ead/download/master-rekap-rerata-idm-2018-2025-csv.csv")
    return fetch_csv(url, "idm_aceh.csv")


def search_data_go_id():
    """Cari dataset di data.go.id via CKAN API"""
    import json as j
    base = "https://data.go.id/api/3/action/package_search"
    queries = ["desa listrik", "indeks desa", "elektrifikasi", "energi desa"]
    print("\n[SEARCH] Mencari dataset di data.go.id...")
    for q in queries:
        url = f"{base}?q={q.replace(' ', '%20')}&rows=3"
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urlopen(req, timeout=15) as resp:
                result = j.loads(resp.read())
                if result.get("success") and result["result"]["results"]:
                    for ds in result["result"]["results"]:
                        print(f"  Dataset: {ds['title']}")
                        for r in ds.get("resources", []):
                            print(f"    -> {r.get('name','?')} ({r.get('format','?')}): {r.get('url','?')}")
        except Exception as e:
            print(f"  {q}: {e}")


def main():
    os.makedirs(OUTPUT, exist_ok=True)
    print("=" * 60)
    print("  PETA-EBT Data Fetcher")
    print("  Mengambil data dari portal pemerintah")
    print("=" * 60)

    fetch_idm_aceh()
    search_data_go_id()

    print("\n[DONE] Data tersimpan di:", OUTPUT)


if __name__ == "__main__":
    main()
