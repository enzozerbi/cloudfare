const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cloudflare Stats</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #1a1a1a;
    --border: #2a2a2a;
    --border2: #333;
    --text: #e8e8e8;
    --muted: #888;
    --accent: #f6821f;
    --accent2: #faad3f;
    --blue: #4da6ff;
    --green: #4ade80;
    --red: #f87171;
    --yellow: #fbbf24;
  }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    font-size: 14px;
    line-height: 1.6;
  }

  header {
    border-bottom: 1px solid var(--border);
    padding: 1.25rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 10;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
    font-size: 15px;
    color: var(--accent);
    letter-spacing: -0.02em;
  }

  .logo svg { width: 22px; height: 22px; }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  select {
    background: var(--surface);
    border: 1px solid var(--border2);
    color: var(--text);
    padding: 6px 10px;
    border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    outline: none;
  }

  select:hover { border-color: var(--accent); }

  .refresh-btn {
    background: var(--accent);
    border: none;
    color: #fff;
    padding: 6px 14px;
    border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .refresh-btn:hover { opacity: 0.85; }
  .refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  main { padding: 2rem; max-width: 1200px; margin: 0 auto; }

  .section-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .metric-card {
    background: var(--surface);
    padding: 1.25rem 1.5rem;
    transition: background 0.15s;
  }

  .metric-card:hover { background: var(--surface2); }

  .metric-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .metric-value {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 26px;
    font-weight: 500;
    color: var(--text);
    line-height: 1.1;
  }

  .metric-value.accent { color: var(--accent); }
  .metric-value.blue { color: var(--blue); }
  .metric-value.green { color: var(--green); }
  .metric-value.red { color: var(--red); }

  .metric-sub {
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
  }

  .zone-selector {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .zone-btn {
    background: var(--surface);
    border: 1px solid var(--border2);
    color: var(--muted);
    padding: 6px 14px;
    border-radius: 20px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .zone-btn:hover { border-color: var(--accent); color: var(--text); }
  .zone-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  .chart-section { margin-bottom: 2rem; }

  .chart-container {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .chart-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  canvas { width: 100% !important; }

  .table-section { margin-bottom: 2rem; }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    font-family: 'IBM Plex Mono', monospace;
  }

  .data-table th {
    text-align: left;
    padding: 10px 14px;
    color: var(--muted);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--border);
    font-weight: 400;
  }

  .data-table td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }

  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--surface2); }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }

  .badge-green { background: rgba(74,222,128,0.12); color: var(--green); }
  .badge-red { background: rgba(248,113,113,0.12); color: var(--red); }
  .badge-yellow { background: rgba(251,191,36,0.12); color: var(--yellow); }
  .badge-blue { background: rgba(77,166,255,0.12); color: var(--blue); }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 700px) { .two-col { grid-template-columns: 1fr; } }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem;
    color: var(--muted);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    gap: 10px;
  }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid var(--border2);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .error-box {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.3);
    border-radius: 8px;
    padding: 1.5rem;
    color: var(--red);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    margin-bottom: 2rem;
  }

  .timestamp {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--muted);
  }

  .no-data {
    color: var(--muted);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    padding: 2rem;
    text-align: center;
  }
</style>
</head>
<body>

<header>
  <div class="logo">
    <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M51.4 32.4c0.3-1 0.2-2-0.4-2.8-0.5-0.7-1.4-1.1-2.4-1.2l-20.1-0.3c-0.2 0-0.3-0.1-0.4-0.2-0.1-0.1-0.1-0.3 0-0.4 0.1-0.2 0.3-0.4 0.5-0.4l20.3-0.3c2.4-0.1 5-2 5.9-4.3l1.1-3c0.1-0.2 0-0.4-0.1-0.5C53.4 14.6 47.8 11 41.4 11c-5.9 0-11 3.2-13.7 7.9-1.3-0.9-2.8-1.4-4.5-1.4-3.3 0-6.1 2.1-7.1 5-3.2 0.3-5.6 3-5.6 6.3 0 0.3 0 0.7 0.1 1h40.5c0.3 0 0.5-0.2 0.6-0.4l-0.3 3z" fill="#F6821F"/>
      <path d="M57.6 23.5c-0.2 0-0.4 0-0.6 0-0.1 0-0.2 0.1-0.3 0.2l-0.7 2.3c-0.3 1-0.2 2 0.4 2.8 0.5 0.7 1.4 1.1 2.4 1.2l4.3 0.3c0.2 0 0.3 0.1 0.4 0.2 0.1 0.1 0.1 0.3 0 0.4-0.1 0.2-0.3 0.4-0.5 0.4l-4.5 0.3c-2.4 0.1-5 2-5.9 4.3l-0.3 0.9c-0.1 0.2 0.1 0.4 0.3 0.4h15c0.2 0 0.3-0.1 0.4-0.3 0.3-1 0.5-2 0.5-3.1 0-5.6-4.5-10.1-10.9-10.1z" fill="#FAAD3F"/>
    </svg>
    cf/stats
  </div>
  <div class="header-right">
    <span class="timestamp" id="last-update">—</span>
    <select id="period-select">
      <option value="1">Ultime 24h</option>
      <option value="7" selected>Ultimi 7 giorni</option>
      <option value="30">Ultimi 30 giorni</option>
    </select>
    <button class="refresh-btn" id="refresh-btn" onclick="loadData()">↻ Aggiorna</button>
  </div>
</header>

<main>
  <div id="app">
    <div class="loading"><div class="spinner"></div> Caricamento dati...</div>
  </div>
</main>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script>
let allData = null;
let activeZone = null;
let charts = {};

Chart.defaults.color = '#888';
Chart.defaults.borderColor = '#2a2a2a';
Chart.defaults.font.family = "'IBM Plex Mono', monospace";
Chart.defaults.font.size = 11;

function fmt(n) {
  if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return String(Math.round(n));
}

function fmtBytes(b) {
  if (b >= 1e12) return (b/1e12).toFixed(1) + ' TB';
  if (b >= 1e9)  return (b/1e9).toFixed(1) + ' GB';
  if (b >= 1e6)  return (b/1e6).toFixed(1) + ' MB';
  if (b >= 1e3)  return (b/1e3).toFixed(1) + ' KB';
  return Math.round(b) + ' B';
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('it-IT', { day:'2-digit', month:'short' });
}

async function loadData() {
  const btn = document.getElementById('refresh-btn');
  const days = parseInt(document.getElementById('period-select').value);
  btn.disabled = true;
  btn.textContent = '↻ ...';
  document.getElementById('app').innerHTML = '<div class="loading"><div class="spinner"></div> Caricamento dati...</div>';

  try {
    const res = await fetch('/api/stats?days=' + days);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Errore server');
    allData = json;
    activeZone = json.zones[0]?.id || null;
    renderApp();
    document.getElementById('last-update').textContent = 'Aggiornato: ' + new Date().toLocaleTimeString('it-IT');
  } catch(e) {
    document.getElementById('app').innerHTML = '<div class="error-box">⚠ ' + e.message + '</div>';
  }
  btn.disabled = false;
  btn.textContent = '↻ Aggiorna';
}

document.getElementById('period-select').addEventListener('change', loadData);

function renderApp() {
  if (!allData || !allData.zones.length) {
    document.getElementById('app').innerHTML = '<div class="no-data">Nessun dominio trovato.</div>';
    return;
  }

  Object.values(charts).forEach(c => c.destroy());
  charts = {};

  const zone = allData.zones.find(z => z.id === activeZone) || allData.zones[0];
  const totals = zone.totals;
  const daily  = zone.daily;

  const cacheHit  = totals.requests > 0 ? Math.round(totals.cachedRequests / totals.requests * 100) : 0;
  const errorRate = totals.requests > 0 ? Math.round((totals.r4xx + totals.r5xx) / totals.requests * 100) : 0;

  const labels = daily.map(d => fmtDate(d.date));
  const reqData = daily.map(d => d.requests);
  const bwData  = daily.map(d => d.bytes);
  const thr4xx  = daily.map(d => d.r4xx);
  const thr5xx  = daily.map(d => d.r5xx);
  const cacheData = daily.map(d => d.requests > 0 ? Math.round(d.cachedRequests / d.requests * 100) : 0);

  document.getElementById('app').innerHTML = \`
    <div class="section-label" style="margin-bottom:1rem">Domini</div>
    <div class="zone-selector" id="zone-btns"></div>

    <div class="section-label">Panoramica — \${zone.name}</div>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Richieste totali</div>
        <div class="metric-value accent">\${fmt(totals.requests)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Traffico</div>
        <div class="metric-value blue">\${fmtBytes(totals.bytes)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Cache hit rate</div>
        <div class="metric-value green">\${cacheHit}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Errori 4xx</div>
        <div class="metric-value \${totals.r4xx > 0 ? 'red' : ''}">\${fmt(totals.r4xx)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Errori 5xx</div>
        <div class="metric-value \${totals.r5xx > 0 ? 'red' : ''}">\${fmt(totals.r5xx)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Error rate</div>
        <div class="metric-value \${errorRate > 5 ? 'red' : errorRate > 1 ? '' : 'green'}">\${errorRate}%</div>
      </div>
    </div>

    <div class="two-col chart-section">
      <div class="chart-container">
        <div class="chart-title">Richieste giornaliere</div>
        <canvas id="req-chart"></canvas>
      </div>
      <div class="chart-container">
        <div class="chart-title">Traffico giornaliero</div>
        <canvas id="bw-chart"></canvas>
      </div>
    </div>

    <div class="two-col chart-section">
      <div class="chart-container">
        <div class="chart-title">Errori 4xx / 5xx</div>
        <canvas id="err-chart"></canvas>
      </div>
      <div class="chart-container">
        <div class="chart-title">Cache hit rate %</div>
        <canvas id="cache-chart"></canvas>
      </div>
    </div>

    <div class="section-label">Tutti i domini</div>
    <div class="chart-container table-section">
      <table class="data-table">
        <thead>
          <tr>
            <th>Dominio</th>
            <th>Richieste</th>
            <th>Traffico</th>
            <th>Cache hit</th>
            <th>4xx</th>
            <th>5xx</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody id="zone-table-body"></tbody>
      </table>
    </div>
  \`;

  const zonesBtns = document.getElementById('zone-btns');
  allData.zones.forEach(z => {
    const b = document.createElement('button');
    b.className = 'zone-btn' + (z.id === activeZone ? ' active' : '');
    b.textContent = z.name;
    b.onclick = () => { activeZone = z.id; renderApp(); };
    zonesBtns.appendChild(b);
  });

  const tbody = document.getElementById('zone-table-body');
  allData.zones.forEach(z => {
    const ch = z.totals.requests > 0 ? Math.round(z.totals.cachedRequests / z.totals.requests * 100) : 0;
    const er = z.totals.requests > 0 ? Math.round((z.totals.r4xx + z.totals.r5xx) / z.totals.requests * 100) : 0;
    const statusBadge = z.status === 'active'
      ? '<span class="badge badge-green">active</span>'
      : '<span class="badge badge-yellow">' + z.status + '</span>';
    const tr = document.createElement('tr');
    tr.innerHTML = \`
      <td style="color:var(--accent); cursor:pointer" onclick="activeZone='\${z.id}';renderApp()">\${z.name}</td>
      <td>\${fmt(z.totals.requests)}</td>
      <td>\${fmtBytes(z.totals.bytes)}</td>
      <td><span class="badge \${ch >= 60 ? 'badge-green' : ch >= 30 ? 'badge-yellow' : 'badge-red'}">\${ch}%</span></td>
      <td>\${fmt(z.totals.r4xx)}</td>
      <td>\${fmt(z.totals.r5xx)}</td>
      <td>\${statusBadge}</td>
    \`;
    tbody.appendChild(tr);
  });

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.2,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { color: '#1e1e1e' }, ticks: { maxTicksLimit: 7 } },
      y: { grid: { color: '#1e1e1e' }, ticks: { maxTicksLimit: 5 } }
    }
  };

  charts.req = new Chart(document.getElementById('req-chart'), {
    type: 'bar',
    data: { labels, datasets: [{ data: reqData, backgroundColor: 'rgba(246,130,31,0.7)', borderRadius: 3 }] },
    options: { ...baseOpts, scales: { ...baseOpts.scales, y: { ...baseOpts.scales.y, ticks: { ...baseOpts.scales.y.ticks, callback: v => fmt(v) } } } }
  });

  charts.bw = new Chart(document.getElementById('bw-chart'), {
    type: 'bar',
    data: { labels, datasets: [{ data: bwData, backgroundColor: 'rgba(77,166,255,0.7)', borderRadius: 3 }] },
    options: { ...baseOpts, scales: { ...baseOpts.scales, y: { ...baseOpts.scales.y, ticks: { ...baseOpts.scales.y.ticks, callback: v => fmtBytes(v) } } } }
  });

  charts.err = new Chart(document.getElementById('err-chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '4xx', data: thr4xx, borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.08)', tension: 0.3, fill: true, pointRadius: 3 },
        { label: '5xx', data: thr5xx, borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', tension: 0.3, fill: true, pointRadius: 3 }
      ]
    },
    options: { ...baseOpts, plugins: { ...baseOpts.plugins, legend: { display: true, labels: { boxWidth: 10, padding: 14 } } } }
  });

  charts.cache = new Chart(document.getElementById('cache-chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{ data: cacheData, borderColor: '#4ade80', backgroundColor: 'rgba(74,222,128,0.08)', tension: 0.3, fill: true, pointRadius: 3 }]
    },
    options: { ...baseOpts, scales: { ...baseOpts.scales, y: { ...baseOpts.scales.y, min: 0, max: 100, ticks: { ...baseOpts.scales.y.ticks, callback: v => v + '%' } } } }
  });
}

loadData();
</script>
</body>
</html>`;

async function fetchZones(apiToken) {
  const res = await fetch("https://api.cloudflare.com/client/v4/zones?per_page=50", {
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json"
    }
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.errors?.[0]?.message || "Errore fetch zones");
  return json.result;
}

async function fetchZoneStats(apiToken, zoneId, days) {
  const now = new Date();
  const since = new Date(now.getTime() - days * 86400 * 1000);

  const sinceStr = since.toISOString().split("T")[0];
  const untilStr = now.toISOString().split("T")[0];

  const query = `
    query ZoneStats($zoneTag: String!, $since: String!, $until: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(
            limit: 31
            filter: { date_geq: $since, date_leq: $until }
            orderBy: [date_ASC]
          ) {
            date: dimensions { date }
            sum {
              requests
              bytes
              cachedRequests
              cachedBytes
              pageViews
              threats
              responseStatusMap { edgeResponseStatus requests }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables: { zoneTag: zoneId, since: sinceStr, until: untilStr }
    })
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || "GraphQL error");

  const groups = json.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];

  let totals = { requests: 0, bytes: 0, cachedRequests: 0, r4xx: 0, r5xx: 0 };
  const daily = groups.map(g => {
    const r4xx = g.sum.responseStatusMap
      .filter(s => s.edgeResponseStatus >= 400 && s.edgeResponseStatus < 500)
      .reduce((a, s) => a + s.requests, 0);
    const r5xx = g.sum.responseStatusMap
      .filter(s => s.edgeResponseStatus >= 500)
      .reduce((a, s) => a + s.requests, 0);

    totals.requests += g.sum.requests;
    totals.bytes += g.sum.bytes;
    totals.cachedRequests += g.sum.cachedRequests;
    totals.r4xx += r4xx;
    totals.r5xx += r5xx;

    return {
      date: g.date.date,
      requests: g.sum.requests,
      bytes: g.sum.bytes,
      cachedRequests: g.sum.cachedRequests,
      r4xx,
      r5xx
    };
  });

  return { totals, daily };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const apiToken = env.CF_API_TOKEN;

    if (!apiToken) {
      return new Response(
        JSON.stringify({ error: "CF_API_TOKEN non configurato. Aggiungilo in Settings > Variabili e segreti." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.pathname === "/api/stats") {
      try {
        const days = parseInt(url.searchParams.get("days") || "7");
        const zones = await fetchZones(apiToken);

        const zoneData = await Promise.all(
          zones.map(async z => {
            try {
              const stats = await fetchZoneStats(apiToken, z.id, days);
              return { id: z.id, name: z.name, status: z.status, ...stats };
            } catch (e) {
              return { id: z.id, name: z.name, status: z.status, totals: { requests: 0, bytes: 0, cachedRequests: 0, r4xx: 0, r5xx: 0 }, daily: [], error: e.message };
            }
          })
        );

        return new Response(
          JSON.stringify({ zones: zoneData }),
          { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }
        );
      } catch (e) {
        return new Response(
          JSON.stringify({ error: e.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(DASHBOARD_HTML, {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
};
