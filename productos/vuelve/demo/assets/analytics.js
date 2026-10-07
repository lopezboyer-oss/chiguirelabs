// Synthetic local demo; no contacts are needed for the owner's calculations.
const analysisFocuses = [
  { id: 'economic', name: 'Económico', plans: ['growth', 'pro'], detail: 'Ventas, ticket y cambios por producto y horario.' },
  { id: 'operations', name: 'Operación', plans: ['growth', 'pro'], detail: 'Distribución de demanda; capacidad y tiempos de espera pendientes.' },
  { id: 'loyalty', name: 'Fidelización', plans: ['growth', 'pro'], detail: 'Recurrencia y oportunidad de segunda visita.' },
  { id: 'audience', name: 'Audiencia y consumo', plans: ['pro'], detail: 'Patrones agregados por rango de edad y género declarado.' },
];

function seedDemographics() {
  if (!state.analysisSettings) state.analysisSettings = { plan: 'pro', enabled: Object.fromEntries(analysisFocuses.map(f => [f.id, true])) };
  if (state.demographicSeedVersion === 1) return;
  storeCustomer();
  state.customers.filter(c => c.analyticsSeed).forEach((c, i) => {
    c.gender = ['woman', 'man', 'nonbinary', 'woman', 'man', 'undisclosed'][i % 6];
    if (i % 9 !== 0) c.age = 18 + (i * 7 % 48);
    c.anonymous = false; // Fictitious optional demographic responses, no real identity.
    let issued = 0, spent = 0, seasonCount = 0;
    c.account.records.forEach((r, j) => {
      if (r.type === 'purchase' && r.seed) {
        // Deliberately constructed patterns, with exceptions in every group.
        const seasonal = c.gender === 'woman' ? j % 4 !== 0 : c.gender === 'man' ? j % 4 === 0 : j % 2 === 0;
        r.items = [seasonal ? 0 : 1, seasonal ? 1 : 0, r.items[2], r.items[3]];
        r.amount = r.items.reduce((sum, q, k) => sum + q * catalog[k].price, 0);
        r.points = r.items.reduce((sum, q, k) => sum + q * [10, 18, 22, 12][k], 0) + (r.items[2] ? 8 : 0);
      }
      if (r.type === 'purchase') { issued += r.points; seasonCount += r.items?.[1] || 0; }
      if (r.type === 'redemption') spent += r.points;
    });
    c.account.issued = issued; c.account.balance = issued - spent; c.account.seasonCount = seasonCount;
    c.account.events = c.account.records.slice().reverse().map(r => r.type === 'purchase' ? `Ejemplo · ${r.moment.slice(0, 10)} · ${r.branch} · $${r.amount} MXN · +${r.points} Granos` : 'Ejemplo · Americano canjeado · −100 Granos');
  });
  const active = customer();
  Object.assign(state, active.account);
  state.demographicSeedVersion = 1;
  persist();
}

function renderFocusAnalysis(data) {
  const settings = state.analysisSettings;
  $('analysisPlan').value = settings.plan;
  $('focusControls').replaceChildren();
  analysisFocuses.forEach(f => {
    const allowed = f.plans.includes(settings.plan)&&!(f.id==='economic'&&state.economics?.salesEnabled===false);
    const row = document.createElement('div'); row.className = 'row';
    const label = document.createElement('label'); label.htmlFor = 'focus-' + f.id;
    label.textContent = f.name + ' · ' + (f.id==='economic'&&state.economics?.salesEnabled===false?'Desactivado: decidiste no compartir datos económicos':allowed ? f.detail : 'Disponible en ' + f.plans.join(' / '));
    const input = document.createElement('input'); input.type = 'checkbox'; input.id = 'focus-' + f.id;
    input.disabled = !allowed; input.checked = allowed && settings.enabled[f.id];
    input.onchange = () => { settings.enabled[f.id] = input.checked; persist(); renderAnalytics(); };
    row.append(label); row.append(input); $('focusControls').append(row);
  });
  $('analysisPlan').onchange = () => { settings.plan = $('analysisPlan').value; persist(); renderAnalytics(); };
  const entries = [];
  const enabled = id => !(id==='economic'&&state.economics?.salesEnabled===false)&&settings.enabled[id] && analysisFocuses.find(f => f.id === id).plans.includes(settings.plan);
  if (data.active < 5) { $('focusResults').textContent = 'Muestra insuficiente para analizar.'; return; }
  if (enabled('economic')) {
    const current = data.sales.reduce((s, r) => s + r.amount, 0), previous = data.previous.reduce((s, r) => s + r.amount, 0);
    entries.push(['Económico', `${money(current)} registrados. ${uniqueCount(data.previous) >= 5 && previous ? 'Variación frente al periodo anterior: ' + ((current / previous - 1) * 100).toFixed(1) + '%.' : 'Sin muestra anterior suficiente para comparar.'} No equivale a utilidad ni incluye compras fuera de Vuelve.`]);
  }
  if (enabled('operations')) entries.push(['Operación', 'Consulta las franjas de actividad para elegir dónde probar un multiplicador. El volumen de tickets no permite afirmar saturación sin capacidad, personal y tiempos de espera.']);
  if (enabled('loyalty')) entries.push(['Fidelización', `${data.repeat} de ${data.active} Costalitos compraron en dos o más días. Prueba un incentivo de segunda visita y mide el regreso y los Granos usados.`]);
  if (enabled('audience')) {
    const profiles = new Map(state.customers.map(c => [c.id, c]));
    const groups = [['Mujeres', c => c.gender === 'woman'], ['Hombres', c => c.gender === 'man'], ['No binario', c => c.gender === 'nonbinary'], ['18–24 años', c => c.age >= 18 && c.age <= 24], ['25–34 años', c => c.age >= 25 && c.age <= 34], ['35–44 años', c => c.age >= 35 && c.age <= 44], ['45 años o más', c => c.age >= 45]];
    groups.forEach(([label, predicate]) => {
      const rows = data.sales.filter(r => predicate(profiles.get(r.key)));
      const clients = uniqueCount(rows);
      if (clients < 5) { entries.push([label, 'Muestra insuficiente: se requieren al menos cinco Costalitos.']); return; }
      const seasonal = rows.filter(r => r.items?.[1] > 0).length, americano = rows.filter(r => r.items?.[0] > 0).length;
      entries.push([label, `${clients} Costalitos · ${rows.length} tickets. Bebida de temporada presente en ${Math.round(seasonal / rows.length * 100)}% de tickets; americano en ${Math.round(americano / rows.length * 100)}%. Patrón construido para la demo; no demuestra preferencia por promociones ni aplica a todas las personas del grupo.`]);
    });
    const answered = [...data.grouped.keys()].filter(id => ['woman', 'man', 'nonbinary'].includes(profiles.get(id)?.gender)).length;
    entries.push(['Cobertura de género', `${answered} de ${data.active} Costalitos activos tienen una respuesta utilizable. El resto no respondió o prefirió no especificar. Las respuestas opcionales no representan necesariamente a toda la clientela.`]);
  }
  $('focusResults').replaceChildren();
  if (!entries.length) { $('focusResults').textContent = 'No hay enfoques habilitados para este plan.'; return; }
  entries.forEach(([title, body]) => { const article = document.createElement('div'); article.className = 'summary'; const h = document.createElement('h3'); h.textContent = title; const p = document.createElement('p'); p.textContent = body; article.append(h); article.append(p); $('focusResults').append(article); });
}
function seedAnalytics() {
  if (state.analyticsSeedVersion === 1) return;
  const today = clockValue().slice(0, 10);
  const anchor = Date.parse(today + 'T12:00:00Z');
  for (let i = 0; i < 120; i++) {
    const id = `SAMPLE-${String(i + 1).padStart(3, '0')}`;
    if (state.customers.some(c => c.id === id)) continue;
    const account = { balance: 0, seasonCount: 0, visits: 0, issued: 0, redeemed: 0, events: [], records: [], imported: false, stampBalance: 0, stampIssued: 0, loyaltyDays: [] };
    const count = 1 + (i * 7 % 17);
    for (let j = 0; j < count; j++) {
      const daysAgo = (i * 13 + j * 6) % 90;
      const day = new Date(anchor - daysAgo * 86400000).toISOString().slice(0, 10);
      const hour = [8, 9, 10, 12, 15, 16, 18, 19][(i + j * 3) % 8];
      const moment = `${day}T${String(hour).padStart(2, '0')}:30`;
      const items = [(i + j) % 3 === 0 ? 1 : 0, (i + j) % 3 !== 0 ? 1 : 0, (i + j) % 4 === 0 ? 1 : 0, (i + j) % 5 === 0 ? 1 : 0];
      const amount = items.reduce((sum, q, k) => sum + q * catalog[k].price, 0);
      // Seed uses fixed illustrative rules, independent of later merchant edits.
      const points = items.reduce((sum, q, k) => sum + q * [10, 18, 22, 12][k], 0) + (items[2] ? 8 : 0);
      const branch = (i + j) % 5 < 3 ? 'Playas' : 'Cacho';
      account.records.push({ type: 'purchase', branch, items, amount, points, mode: 'grains', moment, at: moment + ':00-07:00', seed: true });
      account.balance += points; account.issued += points; account.visits++; account.seasonCount += items[1];
      account.loyaltyDays.push(day); account.stampBalance++; account.stampIssued++;
    }
    account.records.sort((a, b) => a.moment.localeCompare(b.moment));
    if (account.balance >= 100 && i % 3 === 0) {
      const latest = account.records.at(-1);
      account.balance -= 100; account.redeemed++;
      account.records.push({ type: 'redemption', branch: latest.branch, reward: 'Americano de cortesía', points: 100, mode: 'grains', moment: latest.moment, at: latest.at, seed: true });
    }
    account.events = account.records.slice().reverse().map(r => r.type === 'purchase' ? `Ejemplo · ${r.moment.slice(0, 10)} · ${r.branch} · $${r.amount} MXN · +${r.points} Granos` : 'Ejemplo · Americano canjeado · −100 Granos');
    state.customers.push({ id, name: `Visitante de ejemplo ${i + 1}`, anonymous: true, analyticsSeed: true, account });
  }
  state.analyticsSeedVersion = 1;
  persist();
}

function ownerData(days, branch) {
  const end = clockValue().slice(0, 10);
  const start = new Date(Date.parse(end + 'T12:00:00Z') - (days - 1) * 86400000).toISOString().slice(0, 10);
  const previousStart = new Date(Date.parse(start + 'T12:00:00Z') - days * 86400000).toISOString().slice(0, 10);
  const rows = state.customers.flatMap(c => (c.id === state.activeCustomer ? state.records : c.account.records).map(r => ({ ...r, key: c.id, day: (r.moment || r.at || '').slice(0, 10) })));
  const scope = rows.filter(r => branch === 'all' || r.branch === branch);
  const current = scope.filter(r => r.day >= start && r.day <= end);
  const sales = current.filter(r => r.type === 'purchase');
  const previous = scope.filter(r => r.type === 'purchase' && r.day >= previousStart && r.day < start);
  const grouped = new Map();
  sales.forEach(r => { if (!grouped.has(r.key)) grouped.set(r.key, new Set()); grouped.get(r.key).add(r.day); });
  const active = grouped.size, repeat = [...grouped.values()].filter(days => days.size >= 2).length;
  return { start, end, sales, current, previous, active, repeat, rows, grouped };
}

const money = value => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);
const uniqueCount = rows => new Set(rows.map(r => r.key)).size;
function aggregateRow(label, rows, text) {
  const count = uniqueCount(rows);
  return `<div class="row"><strong>${label}</strong><span class="small">${count < 5 ? 'Muestra insuficiente (mínimo 5 Costalitos)' : text}</span></div>`;
}

function renderAnalytics() {
  const data = ownerData(Number($('reportPeriod').value || 30), $('reportBranch').value || 'all');
  renderFocusAnalysis(data);
  const total = data.sales.reduce((sum, r) => sum + r.amount, 0);
  const previous = data.previous.reduce((sum, r) => sum + r.amount, 0);
  const redemptions = data.current.filter(r => r.type === 'redemption');
  const visits = [...data.grouped.values()].reduce((sum, days) => sum + days.size, 0);
  const salesEnabled=state.economics?.salesEnabled!==false;
  const metrics = [
    ['Venta registrada', money(total), 'Tickets en Vuelve; no ventas totales del negocio.'],
    ['Ticket promedio', data.sales.length ? money(total / data.sales.length) : 'Sin compras', 'Venta registrada / número de tickets.'],
    ['Costalitos activos', data.active, 'Al menos una compra en el periodo.'],
    ['Recurrencia', data.active ? Math.round(data.repeat / data.active * 100) + '%' : 'Sin muestra', 'Costalitos con compras en 2 o más días / activos.'],
    ['Visitas Promedio', data.active ? (visits / data.active).toFixed(1) : 'Sin muestra', 'Días distintos de compra / Costalitos activos.'],
    ['Recompensas canjeadas', redemptions.length, 'Canjes realizados en el periodo.'],
  ].filter(([label])=>salesEnabled||!['Venta registrada','Ticket promedio'].includes(label));
  $('reportRange').textContent = `${data.start} a ${data.end}${salesEnabled?" · MXN":""} · ${data.sales.length} tickets · datos ficticios y movimientos locales`;
  $('ownerMetrics').innerHTML = data.active < 5 ? '<p>Muestra insuficiente para mostrar métricas: se requieren 5 Costalitos activos.</p>' : metrics.map(([label, value, detail]) => `<div class="metric"><strong>${value}</strong><span>${label}</span><p class="small muted">${detail}</p></div>`).join('');
  const difference = previous ? ((total - previous) / previous * 100).toFixed(1) + '%' : 'sin base comparable';
  $('ownerInsights').textContent = data.active < 5 ? 'Amplía el periodo para obtener una muestra suficiente.' : `${salesEnabled?"Venta registrada frente al periodo anterior: "+difference+". ":""}${data.active - data.repeat} Costalitos compraron en un solo día: una oportunidad para probar incentivos de regreso. La muestra solo cubre 90 días; comparaciones anteriores pueden estar incompletas.`;
  const weeks = new Map();
  data.sales.forEach(r => { const date = new Date(r.day + 'T12:00:00Z'); date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7); const week = date.toISOString().slice(0, 10); if (!weeks.has(week)) weeks.set(week, []); weeks.get(week).push(r); });
  $('weeklyReport').innerHTML = [...weeks].sort().map(([week, rows]) => aggregateRow('Semana ' + week, rows, `${rows.length} tickets${salesEnabled?" · "+money(rows.reduce((s,r)=>s+(r.amount||0),0)):""}`)).join('') || '<p>Sin compras en este periodo.</p>';
  $('productReport').innerHTML = catalog.map((p, i) => { const rows = data.sales.filter(r => r.items?.[i]); return aggregateRow(p.name, rows, `${rows.reduce((s, r) => s + r.items[i], 0)} unidades · ${Math.round(rows.length / Math.max(1, data.sales.length) * 100)}% de tickets`); }).join('');
  const slots = [{ label: 'Mañana · 06–12 h', start: 6, end: 12 }, { label: 'Mediodía · 12–15 h', start: 12, end: 15 }, { label: 'Tarde · 15–18 h', start: 15, end: 18 }, { label: 'Noche · 18–24 h', start: 18, end: 24 }];
  $('hourReport').innerHTML = slots.map(slot => { const rows = data.sales.filter(r => { const hour = r.moment ? Number(r.moment.slice(11, 13)) : Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Tijuana', hour: '2-digit', hour12: false }).format(new Date(r.at))); return hour >= slot.start && hour < slot.end; }); return aggregateRow(slot.label, rows, `${rows.length} tickets${salesEnabled?" · "+money(rows.reduce((s,r)=>s+(r.amount||0),0)):""}`); }).join('');
  const grains = data.current.filter(r => r.type === 'purchase' && r.mode !== 'stamps').reduce((sum, r) => sum + r.points, 0);
  const spent = redemptions.filter(r => r.mode !== 'stamps').reduce((sum, r) => sum + r.points, 0);
  $('rewardReport').innerHTML = data.active < 5 ? '<p>Muestra insuficiente.</p>' : `<div class="row"><span>Granos otorgados en compras</span><strong>${grains}</strong></div><div class="row"><span>Granos usados en canjes</span><strong>${spent}</strong></div><p class="small muted">Los canjes pueden usar Granos ganados antes de este periodo. Estas cantidades no son costo de recompensas ni una tasa de conversión.</p>`;
}

seedAnalytics();
seedDemographics();
$('reportPeriod').onchange = renderAnalytics;
$('reportBranch').onchange = renderAnalytics;
renderAnalytics();
render();
