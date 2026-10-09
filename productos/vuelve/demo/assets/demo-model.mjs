export const categories=[{id:'americano',name:'Americano',grains:5,drink:true},{id:'bebida',name:'Clásicos',grains:8,drink:true},{id:'temporada',name:'Temporada',grains:10,drink:true},{id:'alimento',name:'Alimentos',grains:12,drink:false},{id:'postre',name:'Postres',grains:8,drink:false}];
export function today(date=new Date()){const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Tijuana',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
export const shiftDay=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function seedState(anchor=today()){
 const s={version:4,anchor,name:'Aramellia Café',mode:'grains',palette:'cafe',target:8,stampReward:'Americano de cortesía',weights:categories.map(p=>p.grains),rewards:[{id:'americano',name:'Americano de cortesía',cost:40},{id:'galleta',name:'Galleta de cortesía',cost:60},{id:'temporada',name:'Bebida de temporada',cost:80}],customers:[],events:[],team:[{id:'ana',name:'Ana',role:'leader',cards:true,loyalty:true,branches:['Playas','Cacho']},{id:'diego',name:'Diego',role:'barista',branches:['Playas']},{id:'sofia',name:'Sofía',role:'barista',branches:['Cacho']}],batches:[],lab:{levels:false,happy:false,start:'15:00',end:'18:00',factor:2,combo:false,season:false},focus:{operations:true,loyalty:true,audience:true}};
 for(let i=0;i<120;i++){
  const id=i<3?['DEMO-ANA','DEMO-DIEGO','DEMO-LUCIA'][i]:'SAMPLE-'+String(i+1).padStart(3,'0');
  s.customers.push({id,name:i<3?['Ana Torres','Diego Ruiz','Lucía Vega'][i]:'Visitante de ejemplo '+(i+1),anonymous:i%8===0&&i>2,ageBand:i%7===0?'':['18–24','25–34','35–44','45+'][i%4],gender:i%6===0?'':['Mujer','Hombre','No binario'][i%3],openingGrains:0,openingStamps:i<3?[18,6,8][i]:0});
  for(let j=0;j<8+(i*7%17);j++){
   const day=shiftDay(anchor,-((i*13+j*6)%180)),gender=s.customers.at(-1).gender;
   const drink=gender==='Mujer'&&j%3!==0?2:gender==='Hombre'&&j%3!==0?0:(i+j)%3;
   const quantities=[0,0,0,(i+j)%4===0?1:0,(i+j)%5===0?1:0];quantities[drink]=(i+j)%7===0?2:1;
   const mode=i<3?'grains':j%3===0?'stamps':'grains',branch=(i+j)%5<3?'Playas':'Cacho',eligible=s.team.filter(t=>t.branches.includes(branch));
   s.events.push({id:`seed-${i}-${j}`,type:'purchase',customerId:id,day,hour:[8,10,13,16,19][(i+j)%5],branch,actorId:eligible[(i+j)%eligible.length].id,mode,quantities,earned:mode==='grains'?quantities.reduce((n,q,k)=>n+q*s.weights[k],0):quantities.slice(0,3).reduce((a,b)=>a+b,0),seed:true});
  }
 }
 s.events.sort((a,b)=>a.day.localeCompare(b.day)||a.hour-b.hour);
 // Valid, fictional historical redemptions, each consuming a previously earned balance.
 for(let i=0;i<120;i+=4){const c=s.customers[i],redemptionDay=shiftDay(anchor,-(i%25)),earnedBefore=s.events.filter(e=>e.customerId===c.id&&e.mode==='grains'&&e.day<=redemptionDay).reduce((n,e)=>n+e.earned,0);if(earnedBefore>=40)s.events.push({id:'seed-redeem-'+i,type:'redemption',customerId:c.id,day:shiftDay(anchor,-(i%25)),hour:10,branch:i%8?'Cacho':'Playas',actorId:i%8?'sofia':'diego',mode:'grains',earned:-40,reward:'Americano de cortesía',seed:true});}
 return s;
}
export function balances(s,id){const c=s.customers.find(c=>c.id===id);if(!c)throw Error('Costalito no encontrado.');let grains=c.openingGrains||0,stamps=c.openingStamps||0;for(const e of s.events.filter(e=>e.customerId===id)){if(e.mode==='stamps')stamps+=e.earned;else grains+=e.earned;}return{grains,stamps};}
export function purchase(s,{id,customerId,quantities,branch,actorId,day=today(),hour=12}){
 if(s.events.some(e=>e.id===id))return s.events.find(e=>e.id===id);
 if(!s.customers.some(c=>c.id===customerId)||!['Playas','Cacho'].includes(branch)||!s.team.some(t=>t.id===actorId&&t.branches.includes(branch)))throw Error('Revisa el cliente y el turno.');
 if(!Array.isArray(quantities)||quantities.length!==5||!quantities.every(n=>Number.isInteger(n)&&n>=0&&n<=50)||!quantities.some(Boolean))throw Error('Agrega al menos una categoría.');
 const earned=quote(s,{customerId,quantities,day,hour});
 const e={id,type:'purchase',customerId,quantities:[...quantities],branch,actorId,day,hour,mode:s.mode,earned};s.events.push(e);return e;
}
export function quote(s,{customerId,quantities,day=today(),hour=12}){
 const drinks=quantities.slice(0,3).reduce((a,b)=>a+b,0);let earned=drinks;
 if(s.mode==='grains'){
  const previous=s.events.filter(e=>e.type==='purchase'&&e.customerId===customerId),days=new Set(previous.map(e=>e.day));days.add(day);
  const level=s.lab.levels?(days.size>=5?1.4:days.size>=3?1.2:1):1;
  const minutes=hour*60,start=Number(s.lab.start.slice(0,2))*60+Number(s.lab.start.slice(3)),end=Number(s.lab.end.slice(0,2))*60+Number(s.lab.end.slice(3));
  const inSlot=start<end?minutes>=start&&minutes<end:minutes>=start||minutes<end;
  const multiplier=s.lab.happy&&inSlot?s.lab.factor:1;
  earned=Math.floor(quantities.reduce((n,q,i)=>n+q*s.weights[i],0)*level*multiplier);
  if(s.lab.combo&&drinks&&quantities[3])earned+=8;
  if(s.lab.season){const before=previous.reduce((n,e)=>n+(e.quantities?.[2]||0),0);earned+=(Math.floor((before+quantities[2])/3)-Math.floor(before/3))*20;}
 }
 return earned;
}

export function redeem(s,{id,customerId,branch,actorId,mode=s.mode,rewardId,day=today()}){
 if(s.events.some(e=>e.id===id))return s.events.find(e=>e.id===id);
 if(!s.team.some(t=>t.id===actorId&&t.branches.includes(branch)))throw Error('Revisa el turno.');
 const reward=mode==='stamps'?{name:s.stampReward,cost:s.target}:s.rewards.find(r=>r.id===rewardId);if(!reward)throw Error('Recompensa no disponible.');
 const available=balances(s,customerId)[mode==='stamps'?'stamps':'grains'];if(available<reward.cost)throw Error('Aún no hay saldo suficiente.');
 const e={id,type:'redemption',customerId,branch,actorId,mode,reward:reward.name,earned:-reward.cost,day,hour:12};s.events.push(e);return e;
}
export function metrics(s,days=30,branch='all',anchor=today()){
 const start=shiftDay(anchor,1-days),priorStart=shiftDay(start,-days);const scoped=s.events.filter(e=>branch==='all'||e.branch===branch);const rows=scoped.filter(e=>e.day>=start&&e.day<=anchor),tickets=rows.filter(e=>e.type==='purchase');
 const visits=new Map();for(const e of tickets)visits.set(e.customerId,(visits.get(e.customerId)||0)+1);
 const totals=categories.map((c,i)=>({...c,units:tickets.reduce((n,e)=>n+(e.quantities?.[i]||0),0)})).sort((a,b)=>b.units-a.units||a.name.localeCompare(b.name,'es'));
 const previous=scoped.filter(e=>e.type==='purchase'&&e.day>=priorStart&&e.day<start);
 return{start,end:anchor,tickets,rows,active:visits.size,repeat:[...visits.values()].filter(n=>n>1).length,average:visits.size?tickets.length/visits.size:0,redemptions:rows.filter(e=>e.type==='redemption').length,totals,previous};
}
export function groups(s,tickets,kind){const buckets=new Map();for(const e of tickets){const c=s.customers.find(c=>c.id===e.customerId);const label=c?.[kind];if(!label||label==='Prefiero no responder')continue;const g=buckets.get(label)||{label,customers:new Set(),tickets:0,seasonal:0,american:0};g.customers.add(c.id);g.tickets++;g.seasonal+=e.quantities?.[2]||0;g.american+=e.quantities?.[0]||0;buckets.set(label,g);}return[...buckets.values()].filter(g=>g.customers.size>=5).map(g=>({...g,customers:g.customers.size}));}
