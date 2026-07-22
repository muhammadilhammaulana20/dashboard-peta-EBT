from data.generate_data import DataGenerator
gen = DataGenerator()
data = gen.generate()
print(f"SUCCESS: {len(data)} villages generated")
print(f"Sample: {data[0]['desa']} (skor: {data[0]['skor_prioritas']})")
