// Semantic colors shared by screens, previews and printable materials.
const light=(id,name,bg,text,muted,soft,accent,card,cardMuted)=>({id,name,dark:false,colors:{bg,surface:'#ffffff',text,muted,error:'#9c352b',border:soft,soft,accent,button:text,buttonText:'#ffffff',card,cardText:'#ffffff',cardMuted,stamp:cardMuted,stampText:card}});
export const palettes=Object.freeze([
 light('cafe','Café','#faf4ec','#3b2419','#796453','#e4d6c8','#9a5c2c','#3b2419','#eac49a'),
 light('azul','Azul','#f1f6fc','#183653','#536b85','#d4e2f1','#326aa1','#183653','#a9cff4'),
 light('morado','Morado','#f7f3fc','#422653','#766184','#e5d9ef','#8050a0','#422653','#d9b7ef'),
 light('rojo','Rojo','#fcf4f2','#642b33','#886168','#eed9d7','#a6404c','#642b33','#ffc1bb'),
 light('verde','Verde','#f2f7f2','#234b3b','#586f61','#d7e6db','#387b5c','#234b3b','#afdbc0'),
 light('naranja','Naranja','#fff6ec','#663719','#85684d','#efdfcc','#a85b20','#663719','#f5c594'),
 {id:'negro-dorado',name:'Negro con dorado',dark:true,colors:{bg:'#14130f',surface:'#222019',text:'#f7f3e9',muted:'#c7c1b4',error:'#ffb7a6',border:'#6b614d',soft:'#373125',accent:'#ddba68',button:'#ddba68',buttonText:'#211c11',card:'#29251c',cardText:'#fff5d9',cardMuted:'#dfc47f',stamp:'#dfc47f',stampText:'#29251c'}},
 {id:'negro-blanco',name:'Negro con blanco',dark:true,colors:{bg:'#111111',surface:'#222222',text:'#f5f5f5',muted:'#bdbdbd',error:'#ffb7a6',border:'#666666',soft:'#373737',accent:'#ffffff',button:'#ffffff',buttonText:'#171717',card:'#272727',cardText:'#ffffff',cardMuted:'#dddddd',stamp:'#ffffff',stampText:'#272727'}}
]);
export function getPalette(id){return palettes.find(p=>p.id===id)||palettes[0];}
export function paletteStyle(id){return Object.fromEntries(Object.entries(getPalette(id).colors).map(([key,value])=>['--'+key,value]));}
