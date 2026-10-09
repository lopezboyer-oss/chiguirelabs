// A4 business QR poster, generated locally without an external service.
export function posterPdf(jpeg){
 const cards=[{jpeg}];
 const encode=(s)=>new TextEncoder().encode(s),objects=[];
 const textObject=(s)=>{objects.push(encode(s));return objects.length;};
 const streamObject=(dictionary,bytes)=>{const prefix=encode(`<< ${dictionary} /Length ${bytes.length} >>\nstream\n`),suffix=encode('\nendstream');const body=new Uint8Array(prefix.length+bytes.length+suffix.length);body.set(prefix);body.set(bytes,prefix.length);body.set(suffix,prefix.length+bytes.length);objects.push(body);return objects.length;};
 textObject('');textObject('');const pages=[];
 for(let start=0;start<cards.length;start+=1){let commands='',resources='';
  cards.slice(start,start+1).forEach((card,i)=>{const raw=atob(card.jpeg.split(',')[1]),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));const image=streamObject('/Type /XObject /Subtype /Image /Width 1000 /Height 1400 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode',bytes);resources+=`/Card${i} ${image} 0 R `;const width=539,height=width*1.4,x=28,y=(842-height)/2;commands+=`q ${width} 0 0 ${height} ${x} ${y.toFixed(2)} cm /Card${i} Do Q\n`;});
  const content=streamObject('',encode(commands));pages.push(textObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << ${resources} >> >> /Contents ${content} 0 R >>`));
 }
 objects[0]=encode('<< /Type /Catalog /Pages 2 0 R >>');objects[1]=encode(`<< /Type /Pages /Count ${pages.length} /Kids [${pages.map(n=>`${n} 0 R`).join(' ')}] >>`);
 const parts=[encode('%PDF-1.4\n')],offsets=[0];let length=parts[0].length;
 objects.forEach((body,i)=>{offsets.push(length);const before=encode(`${i+1} 0 obj\n`),after=encode('\nendobj\n');parts.push(before,body,after);length+=before.length+body.length+after.length;});
 const xref=length;parts.push(encode(`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(n=>`${String(n).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
 return new Blob(parts,{type:'application/pdf'});
}
