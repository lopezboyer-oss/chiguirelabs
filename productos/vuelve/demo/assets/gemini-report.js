const resultBox = document.querySelector('#geminiResult');
let geminiSnapshot;let geminiSnapshotMode;
async function showGeminiReport() {
  resultBox.replaceChildren();
  if (Number($('reportPeriod').value || 30) !== 30 || ($('reportBranch').value || 'all') !== 'all') {
    resultBox.textContent = 'Este informe corresponde a 30 días y todas las sucursales. Selecciona ese periodo para consultarlo.';
    return;
  }
  resultBox.textContent = 'Cargando informe…';
  try {
    const mode=state.economics?.salesEnabled===false?'loyalty':'sales';
    if (!geminiSnapshot||geminiSnapshotMode!==mode) {
      const response = await fetch(mode==='loyalty'?'/productos/vuelve/demo/assets/seed-ai-loyalty-report.json':'/productos/vuelve/demo/assets/seed-ai-report.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('No report');
      geminiSnapshot = await response.json();geminiSnapshotMode=mode;
    }
    const report = geminiSnapshot;
    const authorized = report.recommendations.filter(r => state.analysisSettings.enabled[r.focus] && analysisFocuses.find(f => f.id === r.focus)?.plans.includes(state.analysisSettings.plan));
    resultBox.replaceChildren();
    const metadata = document.createElement('p'); metadata.className = 'small';
    metadata.textContent = `${report.provider} · ${report.model} · ${report.period.start} a ${report.period.end} · generado ${new Date(report.generatedAt).toLocaleString('es-MX', { timeZone: 'America/Tijuana' })} (Tijuana). Instantánea: ${report.snapshotMetrics.tickets} tickets${mode==='sales'?" y "+money(report.snapshotMetrics.sales):" · sin información económica"}. Datos sintéticos.`;
    resultBox.append(metadata);
    if (!authorized.length) { const p = document.createElement('p'); p.textContent = 'El plan o los enfoques habilitados no permiten mostrar recomendaciones de este informe.'; resultBox.append(p); return; }
    // No unfiltered summary: it could disclose disabled demographic findings.
    const intro=document.createElement('h3');intro.textContent='Tus 3 prioridades';resultBox.append(intro);
    authorized.forEach((r,index) => {
      const article = document.createElement(index<3?'article':'details'); article.className = 'summary';if(index>=3){const summary=document.createElement('summary');summary.textContent=analysisFocuses.find(f=>f.id===r.focus).name+' · '+r.finding;article.append(summary)}
      const h = document.createElement('h3'); h.textContent = (index<3?(index+1)+'. ':'')+analysisFocuses.find(f => f.id === r.focus).name; article.append(h);
      for (const [label, key] of [['Hallazgo', 'finding'], ['Evidencia', 'evidence'], ['Acción propuesta', 'action'], ['Cómo medir', 'measurement'], ['Limitaciones', 'limitations']]) {
        const p = document.createElement('p'); const b = document.createElement('strong'); b.textContent = label + ': '; p.append(b); p.append(document.createTextNode(r[key])); article.append(p);
      }
      if(index===3){const heading=document.createElement('h3');heading.textContent='Más oportunidades · abre solo las que te interesen';resultBox.append(heading)}resultBox.append(article);
    });
  } catch { resultBox.textContent = 'El informe de Gemini no está disponible. No se sustituye por un análisis simulado.'; }
}
$('showGemini').onclick = showGeminiReport;
for (const id of ['reportPeriod', 'reportBranch', 'analysisPlan']) $(id).addEventListener('change', () => { resultBox.replaceChildren(); });
$('focusControls').addEventListener('change', () => { resultBox.replaceChildren(); });
