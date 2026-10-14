/* Aggregate page views/clicks only: no persistent visitor ID, cookie or form content. */
(()=>{
 const app='https://vuelve-chiguirelabs.netlify.app',host=location.hostname;
 if(!['vuelve-chiguirelabs.netlify.app','chiguirelabs.com','www.chiguirelabs.com'].includes(host)||navigator.doNotTrack==='1')return;
 const p=location.pathname,isApp=host==='vuelve-chiguirelabs.netlify.app';
 let screen=isApp?(p.startsWith('/login')?'login':p.startsWith('/app')?'app':p.startsWith('/tarjeta/')?'wallet':null):p.includes('/productos/vuelve/demo/dueno')?'demo_owner':p.includes('/productos/vuelve/demo/barista')?'demo_barista':p.includes('/productos/vuelve/demo/cliente')?'demo_customer':p.includes('/productos/vuelve/demo')?'demo':p.includes('/productos/vuelve')?'landing':null;
 if(!screen)return;
 const sources=['whatsapp','instagram','facebook','google','chiguirelabs'];
 let source=new URLSearchParams(location.search).get('utm_source')?.toLowerCase();
 if(!sources.includes(source)){let ref='';try{ref=new URL(document.referrer).hostname;}catch{}source=ref.includes('instagram.com')?'instagram':ref.includes('facebook.com')?'facebook':ref.includes('google.')?'google':ref==='chiguirelabs.com'?'chiguirelabs':ref?'other':'direct';}
 const seen=new Set();
 function send(event,nextScreen=screen){
  try{const id=crypto.randomUUID(),cafeId=isApp?window.VUELVE_BUSINESS:null;fetch(app+'/api/usage',{method:'POST',mode:'cors',credentials:isApp?'same-origin':'omit',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({id,event,screen:nextScreen,source,...(cafeId?{cafeId}:{})})}).catch(()=>{});}catch{}
 }
 function view(next){if(!seen.has(next)){seen.add(next);send('page_view',next);}}
 const map={owner:'owner',desk:'desk',wallet:'wallet',team:'team'};
 view(screen);if(map[window.VUELVE_SCREEN])view(map[window.VUELVE_SCREEN]);
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(!a)return;try{const u=new URL(a.href);if(u.origin===app&&u.pathname==='/login'&&u.searchParams.get('registro')==='negocio'){send('start_click');if(!u.searchParams.has('utm_source')){u.searchParams.set('utm_source',source);a.href=u.href;}}}catch{}});
 window.addEventListener('vuelve-screen',e=>{if(map[e.detail])view(map[e.detail]);});
})();
