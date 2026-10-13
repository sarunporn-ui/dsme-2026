const { chromium } = require('playwright');
const D='/home/user/dsme-2026/poster/', O=D+'pptx-assets-v5/';
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1350}});
  await pg.goto('file://'+D+'ai-capcut-1day-v5.html'); await pg.waitForTimeout(800);
  await pg.screenshot({ path:D+'ai-capcut-1day-v5.png' });
  const layers={ bg:['#poster',0], logocat:['#logo img',0], peekW:['#peekW',0], peekM:['#peekM',0], laptop:['#laptop',60],
    stCapcut:['#stCapcut',40], stCat:['#stCat',30], stClaude:['#stClaude',40] };
  const out={};
  for (const [k,[sel,pad]] of Object.entries(layers)) {
    await pg.evaluate(([sel])=>{ const t=document.querySelector(sel);
      document.querySelectorAll('#poster *').forEach(e=>e.style.visibility='hidden');
      for (const e of [document.documentElement, document.body]) e.style.background='transparent';
      if (sel!=='#poster') document.querySelector('#poster').style.background='transparent'; else document.querySelector('#poster').style.background='';
      t.style.visibility='visible'; t.querySelectorAll('*').forEach(e=>e.style.visibility='visible'); },[sel]);
    const r=await pg.evaluate(s=>{const q=document.querySelector(s).getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height}},sel);
    let x=Math.max(0,Math.floor(r.x-pad)), y=Math.max(0,Math.floor(r.y-pad));
    let x2=Math.min(1080,Math.ceil(r.x+r.w+pad)), y2=Math.min(1350,Math.ceil(r.y+r.h+pad));
    if (k==='bg'){x=0;y=0;x2=1080;y2=1350;}
    
    await pg.screenshot({ path:O+k+'.png', clip:{x,y,width:x2-x,height:y2-y}, omitBackground:true });
    out[k]={x,y,w:x2-x,h:y2-y};
  }
  await pg.reload(); await pg.waitForTimeout(500);
  const tx=await pg.evaluate(()=>{
    const g=s=>{const q=document.querySelector(s).getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height}};
    const o={}; ['hey','bar','big','copy'].forEach(i=>{const e=document.getElementById(i); o[i]={x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight};});
    o.logotext=g('#logo span'); o.nameW=g('#nameW'); o.nameM=g('#nameM'); o.l1=g('#copy .l1'); o.l2=g('#copy .l2'); o.l3=g('#copy .l3'); return o; });
  console.log(JSON.stringify({img:out,txt:tx})); await b.close();
})();
