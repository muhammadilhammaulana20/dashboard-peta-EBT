import csv
import json
import math
import random
import os

random.seed(42)

BASE = os.path.dirname(os.path.abspath(__file__))

NAMA_KABUPATEN = {
    "Aceh": ["Aceh Besar","Pidie","Aceh Utara","Aceh Timur","Aceh Tengah","Bener Meriah","Gayo Lues","Subulussalam","Simeulue","Aceh Singkil","Aceh Selatan","Aceh Tenggara","Aceh Barat","Aceh Barat Daya","Nagan Raya","Bireuen","Lhokseumawe","Langsa"],
    "Sumatera Utara": ["Tapanuli Selatan","Tapanuli Tengah","Simalungun","Dairi","Karo","Pakpak Bharat","Humbang Hasundutan","Toba","Mandailing Natal","Padang Lawas","Labuhanbatu","Serdang Bedagai","Deliserdang","Langkat"],
    "Sumatera Barat": ["Pesisir Selatan","Solok","Tanah Datar","Agam","Lima Puluh Kota","Pasaman","Kepulauan Mentawai","Dharmasraya","Sijunjung","Padang Pariaman"],
    "Riau": ["Kampar","Indragiri Hulu","Indragiri Hilir","Pelalawan","Rokan Hulu","Rokan Hilir","Bengkalis","Meranti","Siak","Kuantan Singingi"],
    "Jambi": ["Kerinci","Merangin","Sarolangun","Batanghari","Muaro Jambi","Tanjung Jabung Timur","Tanjung Jabung Barat","Tebo","Bungo"],
    "Sumatera Selatan": ["Ogan Komering Ilir","Ogan Ilir","Muara Enim","Musi Banyuasin","Musi Rawas","Penukal Abab","Lahat","Empat Lawang","Pagar Alam","Prabumulih"],
    "Bengkulu": ["Mukomuko","Bengkulu Utara","Lebong","Rejang Lebong","Kepahiang","Kaur","Seluma","Kota Bengkulu"],
    "Lampung": ["Lampung Barat","Tanggamus","Pringsewu","Pesawaran","Lampung Selatan","Lampung Tengah","Lampung Timur","Lampung Utara","Way Kanan","Tulang Bawang","Mesuji"],
    "Kep. Bangka Belitung": ["Bangka","Bangka Barat","Bangka Selatan","Bangka Tengah","Belitung","Belitung Timur"],
    "Kepulauan Riau": ["Bintan","Karimun","Natuna","Lingga","Anambas","Tanjung Pinang"],
    "DKI Jakarta": ["Kepulauan Seribu","Jakarta Pusat","Jakarta Utara","Jakarta Barat","Jakarta Selatan","Jakarta Timur"],
    "Jawa Barat": ["Bogor","Sukabumi","Cianjur","Garut","Tasikmalaya","Ciamis","Kuningan","Majalengka","Sumedang","Indramayu","Subang","Purwakarta","Karawang","Bekasi","Bandung Barat","Pangandaran"],
    "Jawa Tengah": ["Cilacap","Banyumas","Purbalingga","Banjarnegara","Kebumen","Purworejo","Wonosobo","Magelang","Boyolali","Klaten","Sukoharjo","Wonogiri","Karanganyar","Sragen","Grobogan","Blora","Rembang","Pati","Kudus","Jepara","Demak","Semarang","Temanggung","Kendal","Batang","Pekalongan","Pemalang","Tegal","Brebes"],
    "DIY Yogyakarta": ["Kulon Progo","Bantul","Gunung Kidul","Sleman"],
    "Jawa Timur": ["Pacitan","Ponorogo","Trenggalek","Tulungagung","Blitar","Kediri","Malang","Lumajang","Jember","Banyuwangi","Bondowoso","Situbondo","Probolinggo","Pasuruan","Sidoarjo","Mojokerto","Jombang","Nganjuk","Madiun","Magetan","Ngawi","Bojonegoro","Tuban","Lamongan","Gresik","Bangkalan","Sampang","Pamekasan","Sumenep"],
    "Banten": ["Pandeglang","Lebak","Tangerang","Serang"],
    "Bali": ["Jembrana","Tabanan","Badung","Gianyar","Klungkung","Bangli","Karangasem","Buleleng"],
    "NTB": ["Lombok Barat","Lombok Tengah","Lombok Timur","Lombok Utara","Sumbawa","Dompu","Bima","Sumbawa Barat"],
    "NTT": ["Kupang","Timor Tengah Selatan","Timor Tengah Utara","Belu","Alor","Lembata","Flores Timur","Sikka","Ende","Ngada","Nagekeo","Manggarai","Manggarai Barat","Manggarai Timur","Rote Ndao","Sabu Raijua","Sumba Barat","Sumba Timur","Malaka"],
    "Kalimantan Barat": ["Sambas","Bengkayang","Landak","Pontianak","Sanggau","Ketapang","Sintang","Kapuas Hulu","Sekadau","Melawi","Kayong Utara","Kubu Raya"],
    "Kalimantan Tengah": ["Katingan","Gunung Mas","Barito Selatan","Barito Utara","Sukamara","Lamandau","Seruyan","Kotawaringin Barat","Kotawaringin Timur","Kapuas","Pulang Pisau","Murung Raya"],
    "Kalimantan Selatan": ["Tanah Laut","Kotabaru","Banjar","Barito Kuala","Tapin","Hulu Sungai Selatan","Hulu Sungai Tengah","Hulu Sungai Utara","Tabalong","Balangan"],
    "Kalimantan Timur": ["Paser","Kutai Barat","Kutai Kartanegara","Kutai Timur","Berau","Penajam Paser Utara","Mahakam Ulu"],
    "Kalimantan Utara": ["Malinau","Bulungan","Tana Tidung","Nunukan"],
    "Sulawesi Utara": ["Bolaang Mongondow","Minahasa","Kepulauan Sangihe","Kepulauan Talaud","Minahasa Selatan","Minahasa Tenggara","Minahasa Utara","Bolaang Mongondow Utara"],
    "Sulawesi Tengah": ["Banggai","Poso","Donggala","Toli-Toli","Buol","Parigi Moutong","Tojo Una-Una","Sigi","Banggai Laut","Morowali"],
    "Sulawesi Selatan": ["Selayar","Bulukumba","Bantaeng","Jeneponto","Takalar","Gowa","Sinjai","Maros","Pangkajene","Barru","Bone","Soppeng","Wajo","Enrekang","Luwu","Tana Toraja","Pinrang","Palopo"],
    "Sulawesi Tenggara": ["Konawe","Muna","Buton","Kolaka","Wakatobi","Bombana","Konawe Utara","Konawe Selatan","Buton Tengah","Muna Barat","Kolaka Timur"],
    "Gorontalo": ["Boalemo","Pohuwato","Bone Bolango","Gorontalo","Gorontalo Utara"],
    "Sulawesi Barat": ["Majene","Mamuju","Mamasa","Polewali Mandar","Mamuju Tengah","Pasangkayu"],
    "Maluku": ["Maluku Tengah","Seram Bagian Timur","Seram Bagian Barat","Buru","Buru Selatan","Kepulauan Aru","Maluku Barat Daya","Maluku Tenggara","Tanimbar"],
    "Maluku Utara": ["Halmahera Barat","Halmahera Timur","Halmahera Selatan","Halmahera Utara","Halmahera Tengah","Kepulauan Sula","Pulau Morotai","Pulau Taliabu"],
    "Papua Barat": ["Manokwari","Pegunungan Arfak","Fakfak","Kaimana","Teluk Bintuni","Teluk Wondama","Sorong","Tambrauw"],
    "Papua Barat Daya": ["Raja Ampat","Sorong Selatan","Maybrat","Teminabuan"],
    "Papua": ["Jayapura","Keerom","Sarmi","Mamberamo Raya","Biak Numfor","Yapen","Waropen","Supiori","Mimika","Nabire","Paniai","Intan Jaya","Puncak Jaya","Deiyai","Dogiyai"],
    "Papua Selatan": ["Merauke","Boven Digoel","Mappi","Asmat"],
    "Papua Tengah": ["Nabire","Paniai","Mimika","Dogiyai","Deiyai","Puncak","Puncak Jaya","Intan Jaya"],
    "Papua Pegunungan": ["Jayawijaya","Lanny Jaya","Nduga","Tolikara","Yahukimo","Yalimo","Pegunungan Bintang"],
}

class DataGenerator:
    def __init__(self):
        self.idm_nasional = self._load_idm_nasional()
        self.idm_aceh = self._load_idm_aceh()
        self.villages = []

    def _load_idm_nasional(self):
        path = os.path.join(BASE, "idm_nasional.csv")
        result = {}
        if not os.path.exists(path):
            return result
        with open(path, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                prov = row.get("PROVINSI", "").strip().title()
                if prov:
                    result[prov] = {
                        "mandiri": int(row.get("MANDIRI", 0)),
                        "maju": int(row.get("MAJU", 0)),
                        "berkembang": int(row.get("BERKEMBANG", 0)),
                        "tertinggal": int(row.get("TERTINGGAL", 0)),
                        "sangat_tertinggal": int(row.get("SANGAT_TERTINGGAL", 0)),
                        "total": int(row.get("TOTAL_DESA", 0)),
                    }
        return result

    def _load_idm_aceh(self):
        path = os.path.join(BASE, "idm_aceh.csv")
        result = {}
        if not os.path.exists(path):
            return result
        with open(path, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f, delimiter=";")
            for row in reader:
                tahun = row.get("tahun", "")
                if tahun != "2025":
                    continue
                kab = row.get("kemendagri_nama_kabupaten_kota", "").strip()
                status = row.get("status_idm", "").strip()
                jumlah = int(row.get("jumlah", 0))
                if kab not in result:
                    result[kab] = {}
                result[kab][status] = jumlah
        return result

    def _determine_idm_status(self, skor):
        if skor >= 80:
            return "Mandiri"
        elif skor >= 65:
            return "Maju"
        elif skor >= 50:
            return "Berkembang"
        elif skor >= 35:
            return "Tertinggal"
        else:
            return "Sangat Tertinggal"

    def generate(self):
        nama_desa_pool = [
            "Sukamaju","Sukajaya","Mekarsari","Cibeureum","Cipanas","Cisarua",
            "Wanasari","Kertajaya","Margamulya","Sindangsari","Batuah","Pujud",
            "Rambah","Tambusai","Kepenuhan","Bonai","Kumun","Muara",
            "Sialang","Tandun","Kuntodadi","Srimulyo","Sidorejo","Sumberejo",
            "Bulurejo","Banjarsari","Tegalrejo","Karangrejo","Sumberagung",
            "Margorejo","Banyuurip","Pringapus","Tlogosari","Gunungsari",
            "Kalirejo","Kedungrejo","Jatisari","Kutorejo","Ngemplak",
            "Wonorejo","Sidomulyo","Sukoharjo","Tawangsari","Mojosari",
            "Onggaya","Watunggene","Haruru","Waeperang","Ritapirik",
            "Talibura","Wolomage","Lamanabi","Batu Merah","Fatu Bau",
            "Hilibadalu","Orahili","Sifalago","Lahusa","Hiligeo",
            "Simandraulo","Wamena Kota","Wesaput","Napua","Hubikosi",
            "Bubulan","Mulia","Ilambetawi","Wurabunga","Kiburu",
            "Yuguru","Timika Jaya","Wania","Mapurujaya","Kuala Kencana",
            "Passo","Laha","Tulehu","Tial","Waai","Namar","Gemba",
            "Bula","Sawai","Werwaru","Wokam","Kobror","Kota Lama",
            "Tepa","Lingat","Pongkalahero","Tobimeita","Onemay",
            "Siwing","Pangan Jaya","Lamanggau","Lamahala","Kota Baku",
            "Lamtutui","Keude","Saree","Kayee","Lampanah","Beureunuen",
            "Mns Mesjid","Pante","Krueng","Panton","Rembele","Pegasing",
            "Silih Nara","Bebesan","Kutacane","Babussalam","Lawe Sumur",
            "Mameh","Bunbun","Alur","Seukee","Pasi","Rawa","Simpang",
            "Krueng Sabee","Calang","Lama","Batee","Neuheun","Seulimum",
            "Lambaro","Jantho","Geuceu","Lamteh","Ulee Lheue",
            "Deah Glumpang","Peukan Bada","Lamglumpang","Lamjamee",
            "Lampulo","Lhoknga","Leupung","Pulo Aceh","Lubok",
            "Pasi Janeng","Cot Girek","Tanah Luas","Birem",
            "Seuneubok","Matang","Simpang Ulim","Rantau Selamat",
        ]

        id_counter = 0
        tekonologi_list = ["PLTS + Battery", "PLTMH (Mikrohidro)", "PLTB (Angin)", "PLTBm (Biomassa)", "PLTS Hybrid"]

        for provinsi, kab_list in NAMA_KABUPATEN.items():
            idm_info = self.idm_nasional.get(provinsi, {})
            total_desa = idm_info.get("total", random.randint(50, 800))

            n_desa = min(total_desa, random.randint(5, 25))
            if provinsi in ["Papua Pegunungan", "Papua Tengah", "Papua Selatan", "Papua", "NTT", "Maluku"]:
                n_desa = max(n_desa, random.randint(15, 30))
            elif provinsi in ["DKI Jakarta", "Bali", "DIY Yogyakarta"]:
                n_desa = min(n_desa, random.randint(3, 10))

            for _ in range(n_desa):
                id_counter += 1
                kab = random.choice(kab_list)
                desa = random.choice(nama_desa_pool)

                kk_total = random.randint(150, 2500)
                pct_belum_listrik = random.uniform(0.05, 0.8)
                pct_diesel = random.uniform(0.05, 0.7)
                faktor_timur = 1.0
                if provinsi in ["Papua", "Papua Pegunungan", "Papua Tengah", "Papua Selatan",
                                 "Papua Barat", "Papua Barat Daya", "Maluku", "Maluku Utara", "NTT"]:
                    faktor_timur = random.uniform(1.3, 2.0)
                pct_belum_listrik = min(pct_belum_listrik * faktor_timur, 0.95)
                pct_diesel = min(pct_diesel * faktor_timur, 0.85)

                kk_belum = int(kk_total * pct_belum_listrik)
                kk_diesel = int(kk_total * pct_diesel)

                pot_surya = random.uniform(3.5, 6.8)
                pot_mikro = random.uniform(0, 3.5) if provinsi not in ["DKI Jakarta"] else random.uniform(0, 0.5)
                pot_angin = random.uniform(0, 4.5)
                pot_biom = random.uniform(0, 3.0)

                potensi_total = round(pot_surya + pot_mikro + pot_angin + pot_biom, 2)

                maks_val = max(pot_surya, pot_mikro, pot_angin, pot_biom)
                if maks_val == pot_surya:
                    potensi_dominan = "PLTS + Battery"
                elif maks_val == pot_mikro:
                    potensi_dominan = "PLTMH (Mikrohidro)"
                elif maks_val == pot_angin:
                    potensi_dominan = "PLTB (Angin)"
                else:
                    potensi_dominan = "PLTBm (Biomassa)"

                bpp_diesel = random.randint(2200, 4800)
                if provinsi in ["Papua", "Papua Pegunungan", "Papua Tengah", "Papua Selatan",
                                 "Papua Barat", "Papua Barat Daya", "Maluku", "NTT"]:
                    bpp_diesel = random.randint(3800, 5000)

                jarak_pln = round(random.uniform(3, 150), 1)
                if jarak_pln > 60:
                    akses = "Sulit"
                elif jarak_pln > 25:
                    akses = "Sedang"
                else:
                    akses = "Mudah"

                n_kk = kk_belum + kk_diesel
                skor = round(
                    min(potensi_total / 8, 1) * 30 +
                    min(n_kk / 2000, 1) * 25 +
                    min(bpp_diesel / 5000, 1) * 20 +
                    min(jarak_pln / 150, 1) * 15 +
                    (10 if akses == "Sulit" else 6 if akses == "Sedang" else 2)
                , 1)

                idm_status = self._determine_idm_status(skor)

                penghematan = round(bpp_diesel * kk_diesel * 365 * random.uniform(0.3, 0.6) * 5 / 1000) * 1000
                estimasi_biaya = random.randint(500, 3500) * 1000000

                if random.random() < 0.15:
                    rekom = random.choice(tekonologi_list)
                else:
                    rekom = potensi_dominan

                self.villages.append({
                    "id": id_counter,
                    "desa": desa,
                    "kecamatan": f"Kecamatan {desa[:5]}",
                    "kabupaten": kab,
                    "provinsi": provinsi,
                    "kk_total": kk_total,
                    "kk_belum_listrik": kk_belum,
                    "kk_diesel": kk_diesel,
                    "kk_terdampak": n_kk,
                    "potensi_ebt_mw": potensi_total,
                    "potensi_dominan": potensi_dominan,
                    "pot_surya": round(pot_surya, 2),
                    "pot_mikrohidro": round(pot_mikro, 2),
                    "pot_angin": round(pot_angin, 2),
                    "pot_biomassa": round(pot_biom, 2),
                    "bpp_diesel": bpp_diesel,
                    "jarak_pln_km": jarak_pln,
                    "aksesibilitas": akses,
                    "skor_prioritas": skor,
                    "idm_status": idm_status,
                    "estimasi_penghematan_tahunan": penghematan,
                    "estimasi_biaya_proyek": estimasi_biaya,
                    "rekomendasi_teknologi": rekom,
                    "sumber_data_idm": "Kemendesa (IDM Nasional)" if provinsi in self.idm_nasional else "Estimasi berbasis pola IDM"
                })

        self.villages.sort(key=lambda v: v["skor_prioritas"], reverse=True)
        for i, v in enumerate(self.villages):
            v["ranking"] = i + 1

        return self.villages

if __name__ == "__main__":
    gen = DataGenerator()
    data = gen.generate()
    out_path = os.path.join(BASE, "villages.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Generated {len(data)} villages, saved to {out_path}")
