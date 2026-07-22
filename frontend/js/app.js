let allVillages = [];
let currentFilter = { provinsi: "", search: "" };

function fmtNum(n) {
  if (!n && n !== 0) return "0";
  return n.toLocaleString("id-ID");
}

function fmtRupiah(n) {
  if (n >= 1e12) return "Rp" + (n / 1e12).toFixed(2) + " T";
  if (n >= 1e9) return "Rp" + (n / 1e9).toFixed(2) + " M";
  if (n >= 1e6) return "Rp" + (n / 1e6).toFixed(1) + " Jt";
  return "Rp" + fmtNum(Math.round(n));
}

function badgeTeknologi(tech) {
  const map = {
    "PLTS + Battery": "badge-amber", "PLTMH (Mikrohidro)": "badge-blue",
    "PLTB (Angin)": "badge-purple", "PLTBm (Biomassa)": "badge-green", "PLTS Hybrid": "badge-green"
  };
  return `<span class="badge ${map[tech] || 'badge-blue'}">${tech}</span>`;
}

function badgeAkses(akses) {
  if (akses === "Sulit") return '<span class="badge badge-red"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Sulit</span>';
  if (akses === "Sedang") return '<span class="badge badge-amber"><i class="fa-solid fa-minus mr-1"></i>Sedang</span>';
  return '<span class="badge badge-green"><i class="fa-solid fa-check mr-1"></i>Mudah</span>';
}

function badgeIDM(status) {
  const map = { "Mandiri": "badge-green", "Maju": "badge-blue", "Berkembang": "badge-amber", "Tertinggal": "badge-red", "Sangat Tertinggal": "badge-red" };
  return `<span class="badge ${map[status] || 'badge-slate'}">${status}</span>`;
}

function rankingBadge(r) {
  if (r === 1) return '<span class="font-bold" style="color:#f59e0b;">🥇 1</span>';
  if (r === 2) return '<span class="font-bold" style="color:#94a3b8;">🥈 2</span>';
  if (r === 3) return '<span class="font-bold" style="color:#d97706;">🥉 3</span>';
  return `<span class="font-mono" style="color:#94a3b8;">${r}</span>`;
}

async function initDashboard() {
  try {
    // Show loading state
    document.getElementById("loadingOverlay").classList.remove("hidden");

    // Fetch all data in parallel
    const [summary, provStats, techStats, scoreDist, idmStatus, villagesResp, scoringExplain, dataSources] =
      await Promise.all([
        fetchSummary().catch(() => null),
        fetchProvinceStats().catch(() => []),
        fetchTechnologyStats().catch(() => []),
        fetchScoreDistribution().catch(() => []),
        fetchIdmStatus().catch(() => []),
        fetchVillages({ per_page: 9999 }).catch(() => ({ data: [] })),
        fetchScoringExplain().catch(() => null),
        fetchDataSources().catch(() => []),
      ]);

    allVillages = villagesResp.data || [];

    // Update summary stats
    if (summary) {
      animateCounter("statTotalDesa", summary.total_desa);
      animateCounter("statTotalProvinsi", summary.total_provinsi);
      animateCounter("statTotalKK", summary.total_kk_terdampak);
      animateCounter("statTotalPotensi", Math.round(summary.total_potensi_ebt_mw), " MW");
      document.getElementById("statTotalHemat").textContent = fmtRupiah(summary.total_penghematan_tahunan) + "/thn";
      document.getElementById("statRataSkor").textContent = summary.rata_skor.toFixed(1);
      document.getElementById("statTotalBiaya").textContent = fmtRupiah(summary.total_estimasi_biaya);
    }

    // Charts
    if (allVillages.length > 0) {
      createTop10Chart("top10Chart", allVillages);
    }
    if (techStats.length > 0) {
      createTechChart("techChart", techStats);
    }
    if (provStats.length > 0) {
      createProvinceChart("provinceChart", provStats);
    }
    if (scoreDist.length > 0) {
      createDistribusiChart("distribusiChart", scoreDist);
    }

    // Province map
    if (provStats.length > 0) {
      renderProvinceMap(provStats);
    }

    // Table
    renderTable(allVillages);

    // IDM Status chart
    if (idmStatus.length > 0) {
      renderIdmChart(idmStatus);
    }

    // Scoring methodology
    if (scoringExplain) {
      renderScoringMethod(scoringExplain);
    }

    // Data sources
    if (dataSources.length > 0) {
      renderDataSources(dataSources);
    }

    // Filters
    if (provStats.length > 0) {
      renderFilterButtons(provStats);
    }

  } catch (err) {
    console.error("Dashboard init error:", err);
    document.getElementById("loadError").classList.remove("hidden");
    document.getElementById("loadErrorMsg").textContent = err.message;
  } finally {
    document.getElementById("loadingOverlay").classList.add("hidden");
  }
}

function animateCounter(elId, target, suffix = "") {
  const el = document.getElementById(elId);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 60));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = fmtNum(current) + suffix;
  }, 16);
}

function renderProvinceMap(provStats) {
  const container = document.getElementById("provinceMap");
  if (!container) return;
  const colors = ["#0891b2","#10b981","#f59e0b","#8b5cf6","#3b82f6","#ef4444","#06b6d4","#84cc16","#f97316","#14b8a6"];
  container.innerHTML = provStats.map((p, i) => `
    <div class="map-province" style="background:linear-gradient(135deg,${colors[i % colors.length]}88,${colors[i % colors.length]});">
      <div class="text-xs opacity-80 font-medium">${p.provinsi}</div>
      <div class="text-2xl font-extrabold mt-1">${p.rata_skor}</div>
      <div class="text-xs opacity-80 mt-1">${fmtNum(p.jumlah_desa)} desa</div>
      <div class="text-xs opacity-70 mt-0.5">${fmtNum(p.total_kk)} KK</div>
    </div>
  `).join("");
}

function renderFilterButtons(provStats) {
  const container = document.getElementById("filterButtons");
  if (!container) return;
  let html = `<button class="filter-btn active" data-prov="">Semua Provinsi</button>`;
  provStats.forEach(p => {
    html += `<button class="filter-btn" data-prov="${p.provinsi}">${p.provinsi}</button>`;
  });
  container.innerHTML = html;

  container.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      container.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter.provinsi = this.dataset.prov;
      applyFilters();
    });
  });
}

function renderTable(villages) {
  const tbody = document.getElementById("tableBody");
  const counter = document.getElementById("tableCounter");
  if (!tbody) return;

  if (villages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" class="text-center py-10" style="color:#94a3b8;"><i class="fa-solid fa-search text-2xl mb-2"></i><br>Tidak ada desa ditemukan</td></tr>';
    if (counter) counter.textContent = "0 desa";
    return;
  }

  tbody.innerHTML = villages.map(v => `
    <tr class="table-row ${v.ranking === 1 ? 'top1' : v.ranking === 2 ? 'top2' : v.ranking === 3 ? 'top3' : ''}">
      <td class="text-center">${rankingBadge(v.ranking)}</td>
      <td class="font-medium">${v.desa}</td>
      <td>${v.kecamatan}</td>
      <td>${v.kabupaten}</td>
      <td>${v.provinsi}</td>
      <td class="font-medium">${fmtNum(v.kk_terdampak)}</td>
      <td>${badgeTeknologi(v.potensi_dominan)}</td>
      <td class="font-mono">${fmtNum(v.bpp_diesel)}</td>
      <td class="font-mono">${v.jarak_pln_km} km</td>
      <td>${badgeAkses(v.aksesibilitas)}</td>
      <td>${badgeIDM(v.idm_status)}</td>
      <td>
        <div class="flex items-center gap-2">
          <span class="font-bold ${v.skor_prioritas >= 75 ? 'text-green-600' : v.skor_prioritas >= 55 ? 'text-amber-600' : 'text-slate-500'}">${v.skor_prioritas.toFixed(1)}</span>
          <div class="progress-bar flex-1" style="max-width:50px;">
            <div class="progress-fill ${v.skor_prioritas >= 75 ? 'bg-green-500' : v.skor_prioritas >= 55 ? 'bg-amber-500' : 'bg-slate-300'}" style="width:${v.skor_prioritas}%;"></div>
          </div>
        </div>
      </td>
      <td>${badgeTeknologi(v.rekomendasi_teknologi)}</td>
    </tr>
  `).join("");

  if (counter) counter.textContent = `${fmtNum(villages.length)} desa`;
}

function applyFilters() {
  let filtered = [...allVillages];
  if (currentFilter.provinsi) {
    filtered = filtered.filter(v => v.provinsi === currentFilter.provinsi);
  }
  if (currentFilter.search) {
    const s = currentFilter.search.toLowerCase();
    filtered = filtered.filter(v =>
      v.desa.toLowerCase().includes(s) ||
      v.kecamatan.toLowerCase().includes(s) ||
      v.kabupaten.toLowerCase().includes(s) ||
      v.provinsi.toLowerCase().includes(s)
    );
  }
  renderTable(filtered);
}

function renderIdmChart(idmData) {
  const container = document.getElementById("idmChartContainer");
  if (!container) return;
  const colors = { "Mandiri": "#10b981", "Maju": "#3b82f6", "Berkembang": "#f59e0b", "Tertinggal": "#ef4444", "Sangat Tertinggal": "#dc2626" };
  const total = idmData.reduce((s, d) => s + d.jumlah, 0);
  container.innerHTML = idmData.map(d => `
    <div class="mb-3">
      <div class="flex justify-between text-sm mb-1">
        <span class="font-medium">${d.status}</span>
        <span class="font-semibold">${fmtNum(d.jumlah)} (${Math.round(d.jumlah/total*100)}%)</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${d.jumlah/total*100}%;background:${colors[d.status] || '#94a3b8'};"></div></div>
    </div>
  `).join("");
}

function renderScoringMethod(explain) {
  const container = document.getElementById("scoringMethod");
  if (!container || !explain.variabel) return;
  const colors = ["#0891b2","#10b981","#f59e0b","#8b5cf6","#ef4444"];
  container.innerHTML = explain.variabel.map((v, i) => `
    <div class="mb-3">
      <div class="flex justify-between text-sm mb-1">
        <span class="font-medium text-slate-700">${v.nama}</span>
        <span class="font-semibold" style="color:${colors[i]};">${Math.round(v.bobot * 100)}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${v.bobot * 100}%;background:${colors[i]};"></div></div>
      <div class="text-xs text-slate-400 mt-0.5">${v.justifikasi}</div>
    </div>
  `).join("");
}

function renderDataSources(sources) {
  const container = document.getElementById("dataSources");
  if (!container) return;
  container.innerHTML = sources.map(s => `
    <div class="flex items-start gap-3 p-3 rounded-xl" style="background:#f8fafc;">
      <div style="width:32px;height:32px;border-radius:8px;background:${s.real ? '#d1fae5' : '#fef3c7'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i class="fa-solid ${s.real ? 'fa-check-circle text-green-600' : 'fa-clock text-amber-600'}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm text-slate-700">${s.nama}</div>
        <div class="text-xs text-slate-500 mt-0.5">${s.deskripsi}</div>
        <div class="flex gap-2 mt-1 flex-wrap">
          <span class="text-xs text-slate-400"><i class="fa-solid fa-building mr-1"></i>${s.sumber}</span>
          <span class="text-xs text-slate-400"><i class="fa-solid fa-calendar mr-1"></i>${s.tahun}</span>
          ${s.url ? `<a href="${s.url}" target="_blank" class="text-xs text-energy-600 hover:underline"><i class="fa-solid fa-external-link mr-1"></i>Kunjungi</a>` : ''}
          ${s.real ? '<span class="text-xs text-green-600 font-medium"><i class="fa-solid fa-check mr-1"></i>Real</span>' : '<span class="text-xs text-amber-600 font-medium"><i class="fa-solid fa-gear mr-1"></i>Estimasi</span>'}
        </div>
      </div>
    </div>
  `).join("");
}

// CSV Export
document.addEventListener("click", function (e) {
  if (e.target.closest("#exportCSV")) {
    if (allVillages.length === 0) return;
    const headers = ["Ranking","Desa","Kecamatan","Kabupaten","Provinsi","KK Terdampak","KK Belum Listrik","KK Diesel","Potensi EBT (MW)","Potensi Dominan","BPP Diesel","Jarak PLN (km)","Aksesibilitas","Skor Prioritas","IDM Status","Estimasi Penghematan","Rekomendasi Teknologi"];
    const rows = allVillages.map(v => [
      v.ranking, v.desa, v.kecamatan, v.kabupaten, v.provinsi,
      v.kk_terdampak, v.kk_belum_listrik, v.kk_diesel,
      v.potensi_ebt_mw, v.potensi_dominan, v.bpp_diesel,
      v.jarak_pln_km, v.aksesibilitas, v.skor_prioritas,
      v.idm_status, v.estimasi_penghematan_tahunan, v.rekomendasi_teknologi
    ]);
    let csv = '\uFEFF' + headers.join(",") + "\n";
    csv += rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PETA-EBT_data_prioritas.csv";
    link.click();
  }
});

// Navbar active
document.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let current = "";
  sections.forEach(s => {
    const top = s.offsetTop - 120;
    if (window.scrollY >= top) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle("active", l.getAttribute("href") === "#" + current);
  });
  // Back to top
  const btn = document.getElementById("backToTop");
  if (btn) btn.style.display = window.scrollY > 500 ? "flex" : "none";
});

// Search
document.addEventListener("input", function (e) {
  if (e.target.id === "searchInput") {
    currentFilter.search = e.target.value;
    applyFilters();
  }
});

// Hamburger menu
document.addEventListener("click", function (e) {
  if (e.target.closest("#hamburger")) {
    document.getElementById("navLinks").classList.toggle("open");
  }
});

// Init on load
document.addEventListener("DOMContentLoaded", initDashboard);
