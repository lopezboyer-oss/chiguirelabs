// Visual demo roles. These are not production authentication boundaries.
const role = document.currentScript.dataset.role;
const allowed = role === 'cliente' ? ['client'] : role === 'barista' ? ['sale'] : ['analytics', 'admin'];
const firstColumn = document.querySelector('#workspaceGrid > section:first-child');
const secondColumn = document.querySelector('#workspaceGrid > section:last-child');
const grid = document.querySelector('#workspaceGrid');
const hide = element => { if (element) element.style.display = 'none'; };
document.querySelectorAll('.tab[data-view]').forEach(button => { if (!allowed.includes(button.dataset.view)) button.remove(); });
document.querySelector('h1').textContent = role === 'cliente' ? 'Mi Costalito' : role === 'barista' ? 'Mostrador' : 'Panel del dueño';
document.querySelector('.hero .muted').textContent = role === 'cliente' ? 'Tu QR, tus Granos y tus recompensas.' : role === 'barista' ? 'Identifica al cliente y registra su compra.' : 'Resultados del café y reglas de tu programa.';
const link = document.createElement('a'); link.href = '/productos/vuelve/demo/'; link.textContent = '← Elegir experiencia de demo'; link.style.cssText = 'display:block;margin-bottom:20px;color:var(--ink)'; document.querySelector('main').prepend(link);
// Owner-only and selected-customer totals never appear in customer/cashier views.
secondColumn.querySelectorAll(':scope > .metrics, :scope > .panel:not(#sale):not(#client):not(#admin), :scope > p').forEach(hide);
const clientPanel = $('client');
let cashierSummary;
if (role === 'barista') {
  hide(firstColumn); hide(clientPanel); hide($('admin')); grid.style.gridTemplateColumns = '1fr';
  const sale = $('sale');
  sale.querySelector('h2').textContent = 'Nueva compra';
  sale.querySelector('p.muted').textContent = 'Busca o escanea al cliente; después agrega los productos.';
  cashierSummary = document.createElement('section'); cashierSummary.className = 'summary'; cashierSummary.id = 'cashierCustomer';
  $('identified').after(cashierSummary);
  const rewardsPanel = $('rewards').closest('.panel'); rewardsPanel.querySelector('h3').textContent = 'Canjes disponibles';
  sale.append(rewardsPanel);
  // Customer history, decorative card, QR downloads and Wallet stay out of checkout.
  identified = false;
  $('identified').textContent = 'Ningún cliente identificado. Escanea su QR o busca un dato.';
  const migration = document.createElement('details');
  const migrationSummary = document.createElement('summary'); migrationSummary.textContent = 'Trasladar tarjeta física del cliente'; migration.append(migrationSummary);
  let migrationHeading = [...$('admin').querySelectorAll('h3')].find(h=>h.textContent.includes('Trasladar tarjeta'));
  while(migrationHeading && migrationHeading.id !== 'save'){const next=migrationHeading.nextElementSibling;migration.append(migrationHeading);migrationHeading=next;}
  sale.append(migration);
} else if (role === 'cliente') {
  hide($('sale')); hide($('admin'));
  const details = $('enroll').closest('details'); details.open = true;
  const enrollment = document.createElement('section'); enrollment.className = 'panel'; enrollment.style.marginBottom = '20px';
  const heading = document.createElement('h2'); heading.textContent = 'Crea tu Costalito';
  const intro = document.createElement('p'); intro.textContent = 'Nombre y un contacto. Edad y género opcionales. También puedes continuar sin datos personales.';
  enrollment.append(heading, intro, details); clientPanel.prepend(enrollment);
  $('enroll').querySelector('button[type="submit"]').textContent = 'Crear mi Costalito';
  const sample = document.createElement('button'); sample.className = 'tab'; sample.textContent = 'Ver Costalito de ejemplo'; enrollment.append(sample);
  let memberId; try { memberId = localStorage.getItem('vuelve-demo-client-id'); } catch {}
  let enrolled = Boolean(state.customers.find(c => c.id === memberId));
  clientPanel.querySelectorAll('button[data-view]').forEach(button=>button.remove());
  const cardChildren = [...clientPanel.children].filter(e => e !== enrollment);
  function showCard() { hide(enrollment); firstColumn.style.display = ''; cardChildren.forEach(e => { e.style.display = ''; }); }
  function showEnrollment() { hide(firstColumn); grid.style.gridTemplateColumns = '1fr'; cardChildren.forEach(hide); }
  function finishEnrollment() { try { localStorage.setItem('vuelve-demo-client-id', customer().id); } catch {} enrolled = true; grid.style.gridTemplateColumns = ''; showCard(); }
  const originalSubmit = $('enroll').onsubmit;
  $('enroll').onsubmit = event => { const previous = state.customers.length; originalSubmit(event); if (state.customers.length > previous) finishEnrollment(); };
  const originalAnonymous = $('anonymous').onclick;
  $('anonymous').onclick = () => { originalAnonymous(); finishEnrollment(); };
  sample.onclick = () => { chooseCustomer('DEMO-ANA'); finishEnrollment(); };
  if (enrolled) { chooseCustomer(memberId); showCard(); } else showEnrollment();
  hide($('client').querySelector('button[data-view="sale"]'));
} else {
  hide(firstColumn); grid.style.gridTemplateColumns = '1fr'; hide($('sale')); hide(clientPanel);
  // Physical-card import is a cashier action, not global program configuration.
  const admin = $('admin');
  const migrationTitle = [...admin.querySelectorAll('h3')].find(h => h.textContent.includes('Trasladar tarjeta'));
  if (migrationTitle) { let element = migrationTitle; while (element && element.id !== 'save') { const next = element.nextElementSibling; hide(element); element = next; } }
}
const previousRender = render;
render = function () {
  previousRender();
  if(role==='cliente')$('rewards').querySelectorAll('button').forEach(hide);
  if (role === 'barista') {
    cashierSummary.replaceChildren();
    const title = document.createElement('strong'); title.textContent = identified ? customer().name : 'Esperando cliente'; cashierSummary.append(title);
    const detail = document.createElement('p'); detail.className = 'small'; detail.textContent = identified ? `${activeBalance()} ${state.mode === 'stamps' ? 'sellos' : 'Granos'} disponibles · ${levelFor(state.loyaltyDays.length).name}` : 'El saldo y los canjes aparecerán después de identificarlo.'; cashierSummary.append(detail);
    $('rewards').closest('.panel').style.display = identified ? '' : 'none';$('importStamps').disabled=!identified||state.imported;
  }
};
document.querySelector('.tab[data-view="' + allowed[0] + '"]').click();
render();
