const { chromium } = require('playwright');
const D='/home/user/dsme-2026/poster/', O=D+'pptx-assets-v4/';
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1350}});
  await pg.goto('file://'+D+'ai-capcut-1day-v4.html'); await pg.waitForTimeout(800);
  await pg.screenshot({ path:D+'ai-capcut-1day-v4.png' });
  const layers={ bg:['#bg',0], people:['#people',0], lgcat:['#lgcat',0], lgcapcut:['#lgcapcut',0], lgclaude:['#lgclaude',0],
    ib1:['#ib1 svg',2], ib3:['#ib3 svg',2] };
  const out={};
  for (const [k,[sel,pad]] of Object.entries(layers)) {
    await pg.evaluate(([sel])=>{ const t=document.querySelector(sel);
      document.querySelectorAll('#poster *').forEach(e=>e.style.visibility='hidden');
      for (const e of [document.documentElement, document.body, document.querySelector('#poster')]) e.style.background='transparent';
      t.style.visibility='visible'; t.querySelectorAll('*').forEach(e=>e.style.visibility='visible'); },[sel]);
    const r=await pg.evaluate(s=>{const q=document.querySelector(s).getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height}},sel);
    let x=Math.max(0,Math.floor(r.x-pad)), y=Math.max(0,Math.floor(r.y-pad));
    let x2=Math.min(1080,Math.ceil(r.x+r.w+pad)), y2=Math.min(1350,Math.ceil(r.y+r.h+pad));
    if (k==='bg'){x=0;y=0;x2=1080;y2=1350;}
    if (k==='people'){ y2=Math.min(1350,Math.ceil(r.y+r.h)); }
    await pg.screenshot({ path:O+k+'.png', clip:{x,y,width:x2-x,height:y2-y}, omitBackground:true });
    out[k]={x,y,w:x2-x,h:y2-y};
  }
  await pg.reload(); await pg.waitForTimeout(500);
  const tx=await pg.evaluate(()=>{
    const g=s=>{const q=document.querySelector(s).getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height}};
    const o={}; ['eyebrow','h1','h2','h3','bubble','c1','c2','ib1','ib2','ib3','tb1','tb2','tb3'].forEach(i=>o[i]=g('#'+i));
    o.lgtext=[...document.querySelectorAll('.lg span')].map(e=>{const q=e.getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height,t:e.textContent}});
    o.vr=[...document.querySelectorAll('.vr')].map(e=>{const q=e.getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height}});
    const e=document.querySelector('#price'); o.price={x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight}; return o; });
  console.log(JSON.stringify({img:out,txt:tx})); await b.close();
})();
