import puppeteer from 'puppeteer-core';
const EXEC='/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const CORS={'Access-Control-Allow-Origin':'http://localhost:3000','Access-Control-Allow-Credentials':'true',
 'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS'};
const J=(o,s=200)=>({status:s,contentType:'application/json',headers:CORS,body:JSON.stringify(o)});
const b=await puppeteer.launch({executablePath:EXEC,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setRequestInterception(true);
p.on('request',r=>{
  const u=r.url();
  if(!u.includes('main.myonlineclasspro.com')) return r.continue();
  if(r.method()==='OPTIONS') return r.respond(J({}));
  const path=u.split('main.myonlineclasspro.com')[1].split('?')[0];
  if(path==='/student/profile') return r.respond(J({id:1,name:'Jane',email:'j@e.com'}));
  if(path.startsWith('/student/orders/')) return r.respond(J({id:101,subject:'Statistics 201',status:'IN_PROGRESS',paymentStatus:'PENDING',price:40,deadline:'2026-09-01T12:00:00',createdAt:'2026-08-01T09:00:00',instructions:'Ch 4-6',fileCount:2}));
  if(path.startsWith('/api/order-chat')) return r.respond(J([]));
  return r.respond(J({content:[],totalPages:1}));
});
await p.goto('http://localhost:3000/login',{waitUntil:'networkidle2',timeout:60000});
await p.evaluate(()=>{localStorage.setItem('token','t');localStorage.setItem('userId','1');});
await p.setViewport({width:320,height:900});
await p.goto('http://localhost:3000/dashboard/orders/101',{waitUntil:'networkidle2'});
await new Promise(r=>setTimeout(r,900));
const rows=await p.evaluate(()=>{
  const vw=document.documentElement.clientWidth;
  return [...document.querySelectorAll('.db-content *')].filter(e=>{
    const b=e.getBoundingClientRect();
    return b.width>0 && b.right>vw+1 && getComputedStyle(e).position!=='fixed';
  }).slice(0,10).map(e=>({tag:e.tagName.toLowerCase(),
    cls:(e.className||'').toString().slice(0,42),
    w:Math.round(e.getBoundingClientRect().width),
    right:Math.round(e.getBoundingClientRect().right)}));
});
console.log('viewport 320 — elements past the right edge:');
rows.forEach(r=>console.log(`  ${r.tag}.${r.cls} w=${r.w} right=${r.right}`));
await b.close();
