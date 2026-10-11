// Presentation helpers only: no production accounts or external requests.
export function menuIcon(type){
 const paths={
 results:'<path d="M4 3v17h17M8 16v-5m5 5V7m5 9V4"/>',
 plan:'<path d="M12 21v-9M12 15C5 15 3 11 3 6c6 0 9 3 9 9ZM12 12c0-6 3-9 9-9 0 6-3 9-9 9Z"/>',
 appearance:'<path d="M21 11a9 9 0 1 0-9 10h1a2 2 0 0 0 1.5-3.3 1.5 1.5 0 0 1 1.1-2.5H18a3 3 0 0 0 3-4.2Z"/><circle cx="7" cy="10" r=".8"/><circle cx="10" cy="6.5" r=".8"/><circle cx="15" cy="7" r=".8"/>',
 loyalty:'<path d="M18 4.5c3.5 3.5 2.5 9-1.5 13s-9.5 5-13 1.5-2.5-9 1.5-13 9.5-5 13-1.5ZM6 19c0-8 12-8 12-15"/>',
 catalog:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="m18 14 1.2 2.7 2.8.3-2.1 1.9.6 2.8-2.5-1.5-2.5 1.5.6-2.8-2.1-1.9 2.8-.3Z"/>',
 branches:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 invite:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-2a6 6 0 0 1 10-4.5M15 11h7m-3-3 3 3-3 3"/>',
 cards:'<path d="M7 4h12a2 2 0 0 1 2 2v11"/><rect x="3" y="8" width="14" height="13" rx="2"/><path d="M7 12h2v2H7zm6 0v2m-6 3h2m4 0v1"/>',
 qr:'<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zm4 0h2v6h-2M15 19h2v2h-2"/>'
 };
 return `<svg class="menu-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[type]||paths.results}</svg>`;
}
export const ownerMenuOrder=[['results','Tu negocio, de un vistazo'],['plan','Tu plan y crecimiento'],['appearance','Imagen de tu negocio'],['loyalty','Modalidad de tu programa'],['catalog','Categorías y recompensas'],['branches','Sucursales'],['invite','Invita a tus clientes'],['cards','Tarjetas para entregar en mostrador']];
function formKey(form){return form.id||form.className+':'+(form.dataset.id||'new');}
export function captureOwner(root,skipForm){
 return {open:Object.fromEntries([...root.querySelectorAll('[data-owner-section]')].map(d=>[d.dataset.ownerSection,d.open])),drafts:[...root.querySelectorAll('form')].filter(f=>f!==skipForm).map(f=>({key:formKey(f),values:[...f.elements].filter(e=>e.name).map(e=>({name:e.name,type:e.type,value:e.value,checked:e.checked}))}))};
}
export function enhanceOwner(root,snapshot,{days,paletteName}){
 const panels=[...root.querySelectorAll(':scope>section.panel')];
 const map=new Map(panels.map((p,i)=>[p.querySelector(':scope>h2')?.textContent||(!i?'Tu negocio, de un vistazo':''),p]));
 const anchor=root.querySelector(':scope>.lab')||root.querySelector(':scope>footer');
 for(const [key,title] of ownerMenuOrder){
  const panel=map.get(title);if(!panel)continue;
  let heading=panel.querySelector(':scope>h2');if(!heading){heading=document.createElement('h2');heading.textContent=title;}
  heading.remove();
  if(key==='appearance'){
   const colors=panel.querySelector(':scope>details.subsection');
   if(colors){const summary=colors.querySelector('summary');summary.remove();colors.replaceWith(...colors.childNodes);}
  }
  const body=document.createElement('div');body.className='owner-section-body';body.id='owner-body-'+key;body.append(...panel.childNodes);
  const details=document.createElement('details');details.dataset.ownerSection=key;details.open=snapshot.open[key]??key==='results';
  const summary=document.createElement('summary');summary.setAttribute('aria-controls',body.id);
  const hint=key==='results'?`Últimos ${days} días`:key==='appearance'?paletteName:'';
  heading.id='owner-title-'+key;heading.innerHTML=menuIcon(key)+`<span>${title}${hint?`<small data-menu-hint="${key}"></small>`:''}</span><svg class="menu-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 5 7 7-7 7"/></svg>`;
  if(hint)heading.querySelector('small').textContent=hint;
  summary.append(heading);details.append(summary,body);panel.append(details);panel.classList.add('owner-section');panel.setAttribute('aria-labelledby',heading.id);root.insertBefore(panel,anchor);
 }
 for(const form of root.querySelectorAll('form')){
  const draft=snapshot.drafts.find(d=>d.key===formKey(form));if(!draft)continue;
  for(const entry of draft.values){const field=[...form.elements].find(e=>e.name===entry.name&&e.type===entry.type);if(field){field.value=entry.value;if(field.type==='checkbox'||field.type==='radio')field.checked=entry.checked;}}
 }
}
export function availableRewards(state,balance){
 const modes=[state.mode,...(state.mode==='stamps'&&balance.grains>0?['grains']:state.mode==='grains'&&balance.stamps>0?['stamps']:[])];
 return modes.flatMap(mode=>mode==='stamps'?(balance.stamps>=state.target?[{name:state.stampReward,count:Math.floor(balance.stamps/state.target),mode}]:[]):state.rewards.filter(r=>balance.grains>=r.cost).map(r=>({name:r.name,count:1,mode})));
}
