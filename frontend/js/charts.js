let chartInstances = {};

function destroyChart(key) {
  if (chartInstances[key]) {
    chartInstances[key].destroy();
    delete chartInstances[key];
  }
}

function createTop10Chart(canvasId, data) {
  destroyChart("top10");
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const top10 = data.slice(0, 10);
  const colors = ["#f59e0b","#94a3b8","#d97706","#0891b2","#10b981","#8b5cf6","#3b82f6","#ef4444","#06b6d4","#84cc16"];
  chartInstances["top10"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: top10.map(v => v.desa),
      datasets: [{
        label: "Skor Prioritas",
        data: top10.map(v => v.skor_prioritas),
        backgroundColor: colors.map((c, i) => i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "#0891b2"),
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `Skor: ${ctx.raw}` } } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

function createTechChart(canvasId, data) {
  destroyChart("tech");
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = { "PLTS + Battery": "#f59e0b", "PLTMH (Mikrohidro)": "#3b82f6", "PLTB (Angin)": "#8b5cf6", "PLTBm (Biomassa)": "#10b981", "PLTS Hybrid": "#06b6d4" };
  chartInstances["tech"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data.map(d => d.teknologi),
      datasets: [{
        data: data.map(d => d.jumlah),
        backgroundColor: data.map(d => colors[d.teknologi] || "#94a3b8"),
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, padding: 12, font: { size: 11 } } }
      },
      cutout: "62%",
    }
  });
}

function createProvinceChart(canvasId, data) {
  destroyChart("province");
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const labels = data.map(d => d.provinsi);
  const values = data.map(d => d.total_potensi_mw);
  const bgColors = ["#0891b2","#10b981","#f59e0b","#8b5cf6","#3b82f6","#ef4444","#06b6d4","#84cc16","#f97316","#14b8a6"];
  chartInstances["province"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Potensi EBT (MW)",
        data: values,
        backgroundColor: labels.map((_, i) => bgColors[i % bgColors.length]),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } },
        y: { grid: { display: false }, ticks: { font: { size: 10, weight: "bold" } } }
      }
    }
  });
}

function createDistribusiChart(canvasId, data) {
  destroyChart("distribusi");
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const bgColors = ["#f1f5f9","#cbd5e1","#0891b2","#22d3ee","#10b981"];
  chartInstances["distribusi"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.range),
      datasets: [{
        label: "Jumlah Desa",
        data: data.map(d => d.jumlah),
        backgroundColor: bgColors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

function destroyAllCharts() {
  Object.keys(chartInstances).forEach(k => destroyChart(k));
}
