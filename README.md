# PETA-EBT Dashboard

**Dashboard Prioritas Dedieselisasi Desa 3T Berbasis Data**

## Cara Menggunakan

1. **Buka `dashboard.html`** di browser (double-click)
2. Dashboard akan otomatis menampilkan data 122 desa dari 6 provinsi
3. Gunakan **filter provinsi** untuk mempersempit data
4. Gunakan **pencarian** untuk mencari desa/kecamatan/kabupaten tertentu
5. Klik **Download CSV** untuk mengekspor data ke Excel
6. Scroll untuk melihat **grafik analisis** dan **rekomendasi**

## File

| File | Deskripsi |
|------|-----------|
| `dashboard.html` | Dashboard utama (buka langsung di browser) |
| `data_villages.json` | Data desa dalam format JSON (122 desa) |
| `README.md` | File ini |

## Sumber Data (Prototype)

Data yang ditampilkan adalah data sintetis yang direkayasa berdasarkan pola realistis dari:
- ESDM One Map (potensi EBT per wilayah)
- BPS PODES (karakteristik desa)
- Kementerian ESDM (data desa belum berlistrik)
- CELIOS & IESR (riset transisi energi)

Untuk implementasi riil, data harus diganti dengan data aktual dari sumber-sumber tersebut.

## Teknologi

- TailwindCSS — styling
- Chart.js — grafik interaktif
- Font Awesome 6 — ikon
- AOS — animasi scroll
- Vanilla JavaScript — logika aplikasi
