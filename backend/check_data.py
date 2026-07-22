import json
with open("data/villages.json") as f:
    data = json.load(f)
print(f"Total: {len(data)} villages")
print(f"Provinsi: {len(set(v['provinsi'] for v in data))}")
print("Top 3:")
for v in data[:3]:
    print(f"  #{v['ranking_ahp']} {v['desa']} ({v['provinsi']}) — Skor: {v['skor_ahp']}")
    print(f"    Breakdown: {v['skor_breakdown']}")
