import puppeteer from 'puppeteer-core';
const EXEC='/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const CORS={'Access-Control-Allow-Origin':'http://localhost:3000','Access-Control-Allow-Credentials':'true',
 'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS'};
const J=(o,s=200)=>({status:s,contentType:'application/json',headers:CORS,body:JSON.stringify(o)});
const b=await puppeteer.launch({executablePath:EXEC,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setRequestInterception(true);
p.on('request',r=>{const u=r.url();
  // Simulate the Zoho widget loading and injecting its launcher.
  if(u.includes('salesiq')) return r.respond({status:200,contentType:'application/javascript',
    body:`var d=document.createElement('div');d.id='zsiq_float';d.style.cssText='position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;background:#0a84ff;z-index:9999';document.body.appendChild(d);`});
  if(!u.includes('main.myonlineclasspro.com')) return r.continue();
  if(r.method()==='OPTIONS') return r.respond(J({}));
  const path=u.split('main.myonlineclasspro.com')[1].split('?')[0];
  if(path==='/student/profile') return r.respond(J({id:77,name:'Jane',email:'j@e.com'}));
  if(path.startsWith('/student/orders/')) return r.respond(J({id:1,subject:'Stats',status:'IN_PROGRESS',instructions:'x',fileCount:0}));
  if(path.startsWith('/api/order-chat')) return r.respond(J([]));
  return r.respond(J({content:[],totalPages:1,totalElements:0}));});
await p.goto('http://localhost:3000/login',{waitUntil:'networkidle2',timeout:60000});
await p.evaluate(()=>{localStorage.setItem('token','t');localStorage.setItem('userId','77');});

async function probe(label){
  await new Promise(r=>setTimeout(r,1400));
  return p.evaluate(l=>{
    const send=document.querySelector('.db-chat-send');
    const floats=[...document.querySelectorAll('#zsiq_float,#whatsappBtn,[aria-label*="WhatsApp" i]')]
      .filter(e=>e.getBoundingClientRect().width>0);
    if(!send) return {label:l,noSend:true,floats:floats.length};
    const sb=send.getBoundingClientRect();
    const overlaps=floats.map(f=>{const fb=f.getBoundingClientRect();
      const ox=Math.max(0,Math.min(sb.right,fb.right)-Math.max(sb.left,fb.left));
      const oy=Math.max(0,Math.min(sb.bottom,fb.bottom)-Math.max(sb.top,fb.top));
      return {id:f.id||f.tagName, area:Math.round(ox*oy),
        gap:Math.round(fb.top-sb.bottom)};});
    const topAtSend=document.elementFromPoint(Math.round(sb.left+sb.width/2),Math.round(sb.top+sb.height/2));
    return {label:l, send:{r:Math.round(sb.right),b:Math.round(sb.bottom),w:Math.round(sb.width)},
      floats:floats.map(f=>({id:f.id||f.tagName,r:Math.round(f.getBoundingClientRect().right),
        b:Math.round(f.getBoundingClientRect().bottom)})),
      overlaps, sendReachable: send.contains(topAtSend)||topAtSend===send};
  },label);
}
await p.setViewport({width:1440,height:900});
// A) direct load of the order workspace
await p.goto('http://localhost:3000/dashboard/orders/1',{waitUntil:'networkidle2'});
console.log(JSON.stringify(await probe('direct load'),null,0));
// B) homepage first (widget injects), then client-side nav into the dashboard
await p.goto('http://localhost:3000/',{waitUntil:'networkidle2'});
await new Promise(r=>setTimeout(r,1800));
const injected=await p.evaluate(()=>!!document.querySelector('#zsiq_float'));
await p.evaluate(()=>{const a=[...document.querySelectorAll('a')].find(x=>x.getAttribute('href')==='/login');a&&a.click();});
await new Promise(r=>setTimeout(r,1200));
await p.goto('http://localhost:3000/dashboard/orders/1',{waitUntil:'networkidle2'});
console.log('widget injected on homepage:',injected);
console.log(JSON.stringify(await probe('after visiting homepage'),null,0));
await b.close();
