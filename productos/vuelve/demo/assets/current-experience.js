// Demo updates share the existing local seed data; no production records are created.
state.stampTarget ||= 8;
const beanIcon='<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="20" rx="10" ry="15" transform="rotate(35 20 20)" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M27 9c-10 5-3 15-14 22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
const cupIcon='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 12h21v10a10 10 0 0 1-21 0zM29 14h3a5 5 0 0 1 0 10h-3M7 32h25" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
const style=document.createElement('style');style.textContent='.demo-stamps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:20px 0}.demo-stamp{aspect-ratio:1;border:2px dashed #eac49a77;border-radius:50%;display:grid;place-items:center;color:#eac49a66}.demo-stamp.earned{background:#b97b45;border:2px solid #b97b45;color:#3b2419}.demo-stamp svg{width:65%;height:65%}.demo-achievement{font-weight:700;margin:16px 0}.demo-achievement svg{width:28px;height:28px;vertical-align:middle;margin-right:8px}.time-row input{min-width:140px;width:160px;line-height:1.5}.demo-mode-switch{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.demo-mode-switch button[aria-pressed=true]{background:#b97b45;color:#fff}.qty{flex-wrap:wrap}.demo-counter-actions{margin:8px 0}.demo-counter-actions button{padding:8px 12px}';document.head.append(style);
const stampVisual=document.createElement('div');$('balanceLabel').after(stampVisual);
const renderBeforeCurrent=render;
render=function(){
 renderBeforeCurrent();
 const stamps=state.mode==='stamps',target=state.stampTarget||8,total=state.stampBalance||0,available=Math.floor(total/target),progress=total%target;
 $('balance').parentElement.style.display=stamps?'none':'';
 $('levelStatus').style.display=stamps?'none':'';
 $('progress').parentElement.style.display=stamps?'none':'';
 stampVisual.replaceChildren();
 if(stamps){
  if(available){const achievement=document.createElement('p');achievement.className='demo-achievement';achievement.innerHTML=cupIcon;achievement.append(document.createTextNode(`${available} ${available===1?'recompensa disponible':'recompensas disponibles'}`));stampVisual.append(achievement);}
  const grid=document.createElement('div');grid.className='demo-stamps';grid.setAttribute('aria-label',`${progress} de ${target} sellos hacia la siguiente recompensa`);
  for(let i=0;i<target;i++){const stamp=document.createElement('div');stamp.className='demo-stamp'+(i<progress?' earned':'');stamp.setAttribute('aria-label',i<progress?'Sello ganado':'Sello pendiente');stamp.innerHTML=beanIcon;grid.append(stamp);}stampVisual.append(grid);
  $('balanceLabel').textContent=available?'Tu siguiente recompensa':'Mis sellos';$('goal').textContent=`${progress} de ${target} sellos · ${available?'Canjea o sigue sumando.':`Te faltan ${target-progress} para un americano.`}`;
 }
 if(role==='dueno')document.querySelector('.demo-mode-switch')?.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(state.mode===['grains','stamps'][i])));
 if(role==='barista')updateCounter();
};
if(role==='dueno'){
 const controls=document.createElement('section');controls.className='panel';const title=document.createElement('h3');title.textContent='Modalidad de tu programa';controls.append(title);
 const buttons=document.createElement('div');buttons.className='demo-mode-switch';
 for(const [mode,label] of [['grains','Granos'],['stamps','Sellos digitales']]){const button=document.createElement('button');button.textContent=label;button.setAttribute('aria-pressed',String(state.mode===mode));button.onclick=()=>{state.mode=mode;persist();renderRules();render();buttons.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));};buttons.append(button);}controls.append(buttons);
 const label=document.createElement('label');label.textContent='Sellos para un americano';const input=document.createElement('input');input.type='number';input.min=2;input.max=30;input.value=state.stampTarget;input.onchange=()=>{if(!input.checkValidity()||!Number.isInteger(Number(input.value)))return;state.stampTarget=Number(input.value);persist();render();};label.append(input);controls.append(label);const note=document.createElement('p');note.className='small muted';note.textContent='Cambiar conserva ambos saldos. Cada bebida suma un sello; alimentos y postres no suman.';controls.append(note);$('admin').prepend(controls);
 const savedBefore=$('save').onclick;$('save').onclick=()=>{savedBefore();buttons.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(state.mode===['grains','stamps'][i])));};
}
let searchArea,captureArea,changeCustomer;
function resetDemoCounter(){stopScanner();identified=false;qty=[0,0,0,0];$('customerCode').value='';$('matches').replaceChildren();$('identified').textContent='';render();$('customerCode').focus();}
function updateCounter(){if(!searchArea)return;searchArea.hidden=identified;captureArea.hidden=!identified;changeCustomer.hidden=!identified;cashierSummary.style.display=identified?'':'none';$('identified').style.display='none';}
if(role==='barista'){
 const sale=$('sale');searchArea=document.createElement('div');captureArea=document.createElement('div');
 const branchMenu=document.createElement('details');branchMenu.innerHTML='<summary>Opciones del mostrador</summary>';branchMenu.append(document.querySelector('label[for="branch"]'),$('branch'));sale.append(branchMenu);
 // Keep identification together; only consumption and redemption remain after selection.
 let element=document.querySelector('label[for="customerCode"]');while(element&&element.id!=='identified'){const next=element.nextElementSibling;searchArea.append(element);element=next;}
 sale.insertBefore(searchArea,$('identified'));sale.insertBefore(captureArea,$('products'));
 captureArea.append(cashierSummary,$('products'),$('summary'),$('register'),$('rewards').closest('.panel'));
 changeCustomer=document.createElement('div');changeCustomer.className='demo-counter-actions';const back=document.createElement('button');back.textContent='← Cambiar cliente';back.onclick=()=>{resetDemoCounter();$('notice').textContent='';};changeCustomer.append(back);sale.insertBefore(changeCustomer,captureArea);
 document.querySelector('label[for="customerCode"]').textContent='Buscar por nombre';$('customerCode').placeholder='Buscar por nombre';$('identify').textContent='Buscar cliente';$('register').textContent='Registrar compra';
 const timeOptions=document.createElement('details');timeOptions.innerHTML='<summary>Hora de la compra simulada</summary>';timeOptions.append(document.querySelector('label[for="saleTime"]'),$('saleTime'));branchMenu.append(timeOptions);
 const beforePurchase=$('register').onclick;$('register').onclick=()=>{if(!identified||!qty.some(Boolean))return;beforePurchase();resetDemoCounter();$('notice').textContent='Compra registrada. Listo para el siguiente cliente.';};
 document.addEventListener('click',event=>{if(event.target.closest('button[data-reward]')&&identified){resetDemoCounter();$('notice').textContent='Canje registrado. Listo para el siguiente cliente.';}});
 sale.querySelectorAll(':scope > p.muted, :scope > .eyebrow').forEach(e=>e.style.display='none');
 document.querySelector('header .brand').textContent=state.name;
}
if(role==='cliente'){
 document.querySelector('.hero .muted').textContent='Tu QR y tus recompensas, sin descargar una app.';
 const heading=$('rewards').closest('.panel').querySelector('h3');heading.innerHTML=cupIcon+' Tus recompensas';heading.querySelector('svg').classList.add('icon');
}
// Fictional balances for demonstrating completed cards, independent of historical grain purchases.
if(!state.stampDemoVersion){for(const [id,balance] of [['DEMO-ANA',18],['DEMO-DIEGO',6],['DEMO-LUCIA',8]]){const c=state.customers.find(c=>c.id===id);if(c){c.account.stampBalance=balance;c.account.stampIssued=balance;if(state.activeCustomer===id){state.stampBalance=balance;state.stampIssued=balance;}}}state.stampDemoVersion=1;persist();}
render();
// Keep the current switch as the single modality control.
if(role==='dueno'){
 $('mode').style.display='none';const heading=$('mode').previousElementSibling;if(heading?.tagName==='H3')heading.style.display='none';
 const explanation=$('mode').nextElementSibling;if(explanation)explanation.style.display='none';
 const caption=$('showGemini')?.nextElementSibling;if(caption)caption.textContent='Ejemplo guardado, generado con Super Inteligencia sobre datos ficticios. El plan de entrada incluye 1 análisis mensual. Ver este ejemplo no consume análisis.';
 const headingSI=$('showGemini')?.previousElementSibling;if(headingSI)headingSI.textContent='Super Inteligencia · ver ejemplo';
}
if(role==='cliente'){
 const edit=document.createElement('button');edit.textContent='Editar mis datos';edit.className='tab';document.querySelector('header').append(edit);
 const form=document.createElement('form');form.className='panel';form.hidden=true;
 const label=document.createElement('label');label.textContent='Nombre';const input=document.createElement('input');input.required=true;input.maxLength=60;label.append(input);form.append(label);
 const save=document.createElement('button');save.textContent='Guardar';const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancelar';cancel.onclick=()=>form.hidden=true;form.append(save,cancel);clientPanel.prepend(form);
 edit.onclick=()=>{input.value=customer().anonymous?'':customer().name;form.hidden=!form.hidden;if(!form.hidden)input.focus();};form.onsubmit=e=>{e.preventDefault();customer().name=input.value.trim();if(!customer().name)return;persist();form.hidden=true;render();};
 const intro=$('greeting')?.nextElementSibling;if(intro?.tagName==='P')intro.textContent='Presenta tu QR en mostrador. Tu saldo se comparte entre sucursales.';
 const past=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Beneficios anteriores';past.append(summary);$('rewards').closest('.panel').append(past);
 const prior=render;render=function(){prior();past.hidden=state.mode!=='stamps';past.querySelectorAll('p').forEach(e=>e.remove());if(state.mode==='stamps'){const text=document.createElement('p');text.textContent=`Conservas ${state.balance} Granos. Puedes canjearlos en mostrador.`;past.append(text);}};
}
render();
if(role==='cliente'){
 const examples=document.createElement('details');examples.innerHTML='<summary>Explorar Costalitos de ejemplo</summary>';
 for(const [id,label] of [['DEMO-ANA','Ana · recompensas acumuladas'],['DEMO-DIEGO','Diego · tarjeta en progreso'],['DEMO-LUCIA','Lucía · tarjeta completa']]){const button=document.createElement('button');button.className='tab';button.textContent=label;button.onclick=()=>{chooseCustomer(id);localStorage.setItem('vuelve-demo-client-id',id);const claim=$('demoClaim')?.closest('section');if(claim)claim.hidden=true;render();};examples.append(button);}clientPanel.append(examples);
}
