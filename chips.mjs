import puppeteer from 'puppeteer-core';
const EXEC='/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const b=await puppeteer.launch({executablePath:EXEC,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1440,height:1000});
const SLUGS=['take-my-math-class','take-my-management-class','take-my-nursing-class','take-my-sophia-class','take-my-online-exam'];
const all=new Map();
for(const s of SLUGS){
  await p.goto(`http://localhost:3000/${s}`,{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,450));
  const r=await p.evaluate(()=>[...document.querySelectorAll('.svc-platform')].map(c=>{
    const logo=c.querySelector('.svc-platform-logo');
    const svg=logo?.querySelector('svg');
    const img=logo?.querySelector('img');
    const cb=c.getBoundingClientRect(), lb=logo?.getBoundingClientRect();
    // a lucide fallback glyph has no fill/brand colour paths
    const isLucide = svg && svg.getAttribute('stroke')==='currentColor' && !svg.querySelector('[fill]:not([fill="none"])');
    return {name:c.querySelector('.svc-platform-name')?.textContent.trim(),
      kind: img?'image': svg? (isLucide?'FALLBACK':'brand-svg') : (logo?.textContent.trim()?'wordmark':'none'),
      chipH:Math.round(cb.height), logoW:Math.round(lb?.width||0), logoH:Math.round(lb?.height||0),
      broken: img? !img.complete||img.naturalWidth===0 : false};
  }));
  r.forEach(x=>{ if(!all.has(x.name)) all.set(x.name,x); });
}
const heights=new Set(), rows=[...all.values()];
rows.forEach(x=>heights.add(x.chipH));
console.log('platform                     logo type     chip  logo box   broken');
rows.sort((a,b)=>a.name.localeCompare(b.name)).forEach(x=>
  console.log(`${x.name.padEnd(28)} ${x.kind.padEnd(12)} ${String(x.chipH).padStart(4)}  ${x.logoW}x${x.logoH}      ${x.broken?'YES':'no'}`));
console.log('\ndistinct chip heights:',[...heights].join(', '),heights.size===1?'(uniform)':'(UNEVEN)');
console.log('broken images:',rows.filter(x=>x.broken).length);
console.log('using fallback glyph:',rows.filter(x=>x.kind==='FALLBACK').map(x=>x.name).join(', ')||'none');
await b.close();
