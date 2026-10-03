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
  if(path==='/student/student-dashboard') return r.respond(J({totalOrders:12,activeOrders:3,completedOrders:8,walletBalance:42.5}));
  if(path==='/student/profile') return r.respond(J({id:1,name:'Jane Doe',email:'jane@e.com',verified:true}));
  if(path==='/student/orders') return r.respond(J({content:[
    {id:101,subject:'Statistics 201',assignmentType:'Quiz',status:'IN_PROGRESS',paymentStatus:'PENDING',price:40,deadline:'2026-09-01T12:00:00'},
    {id:102,subject:'Biology',assignmentType:'Essay',status:'COMPLETED',paymentStatus:'SUCCESS',price:25,deadline:'2026-08-20T12:00:00'}],totalPages:1,totalElements:12}));
  if(path.startsWith('/student/orders/')) return r.respond(J({id:101,subject:'Statistics 201',status:'IN_PROGRESS',paymentStatus:'PENDING',price:40,deadline:'2026-09-01T12:00:00',createdAt:'2026-08-01T09:00:00',instructions:'Ch 4-6',fileCount:2}));
  if(path==='/student/wallet') return r.respond(J({id:9,balance:42.5}));
  if(path==='/wallet/transactions') return r.respond(J({content:[{id:1,type:'CREDIT',amount:50,reason:'Top-up',createdAt:'2026-08-01T09:00:00'}]}));
  if(path==='/student/payment-summary') return r.respond(J({totalPaid:125,pendingInstallments:2}));
  if(path==='/student/payments') return r.respond(J([]));
  if(path.startsWith('/api/order-chat')) return r.respond(J([]));
  return r.respond(J({content:[],totalPages:1,totalElements:0}));
});
await p.goto('http://localhost:3000/login',{waitUntil:'networkidle2',timeout:60000});
await p.evaluate(()=>{localStorage.setItem('token','t');localStorage.setItem('userId','1');localStorage.setItem('userEmail','jane@e.com');});

const ROUTES=['/dashboard','/dashboard/orders','/dashboard/wallet','/dashboard/payments',
              '/dashboard/deadlines','/dashboard/files','/dashboard/profile','/dashboard/orders/101'];
console.log('=== OVERFLOW / OFF-SCREEN across 12 widths x 8 routes ===');
let issues=0;
for(const w of [320,360,375,390,414,480,768,820,1024,1280,1440,1920]){
  await p.setViewport({width:w,height:900});
  const bad=[];
  for(const route of ROUTES){
    await p.goto('http://localhost:3000'+route,{waitUntil:'networkidle2'});
    await new Promise(r=>setTimeout(r,320));
    const r2=await p.evaluate(()=>{
      const vw=document.documentElement.clientWidth;
      const off=[...document.querySelectorAll('.db-content *')].filter(e=>{
        const b=e.getBoundingClientRect();
        return b.width>0 && b.right>vw+1 && getComputedStyle(e).position!=='fixed';}).length;
      return {o:document.documentElement.scrollWidth-document.documentElement.clientWidth, off};
    });
    if(r2.o>0||r2.off>0){bad.push(`${route}(ov${r2.o}/off${r2.off})`);issues++;}
  }
  console.log(`${String(w).padStart(4)}px ${bad.length?bad.join(' '):'clean'}`);
}
console.log(issues===0?'\nNO overflow anywhere':`\n${issues} issues`);
await b.close();
