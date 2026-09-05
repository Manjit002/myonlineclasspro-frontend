import puppeteer from 'puppeteer-core';
const EXEC='/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const b=await puppeteer.launch({executablePath:EXEC,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();
await p.setViewport({width:1440,height:1000});
await p.goto('http://localhost:3000/take-my-math-class',{waitUntil:'networkidle2',timeout:60000});
await new Promise(r=>setTimeout(r,500));
const r=await p.evaluate(()=>[...document.querySelectorAll('.svc-platform')].slice(0,6).map(c=>{
  const l=c.querySelector('.svc-platform-logo');
  return {name:c.querySelector('.svc-platform-name')?.textContent.trim(),
    boxW:Math.round(l.getBoundingClientRect().width),
    contentW:l.scrollWidth, contentH:l.scrollHeight,
    clipped:l.scrollWidth>Math.ceil(l.getBoundingClientRect().width)+1,
    text:l.textContent.trim().slice(0,22),
    childTag:l.firstElementChild?.tagName};
}));
r.forEach(x=>console.log(`${x.name.padEnd(20)} box=${x.boxW} content=${x.contentW}x${x.contentH} clipped=${x.clipped} tag=${x.childTag} text="${x.text}"`));
await b.close();
