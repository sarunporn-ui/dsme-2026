const { chromium } = require('playwright');
const D='/home/user/dsme-2026/poster/', O=D+'pptx-assets-v3/';
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1350}});
  await pg.goto('file://'+D+'ai-capcut-1day-v3.html'); await pg.waitForTimeout(800);
  const layers={ bg:['#bg',0], blurL:['#blurL',40], blurR:['#blurR',40], people:['#people',0], iconSharp:['#iconSharp',50],
    logocat:['#tab img',0], ic1:['#i1 svg',2], ic2:['#i2 svg',2], ic3:['#i3 svg',2] };
  const out={};
  for (const [k,[sel,pad]] of Object.entries(layers)) {
    await pg.evaluate(([sel])=>{ const t=document.querySelector(sel);
      document.querySelectorAll('#poster *').forEach(e=>e.style.visibility='hidden');
      for (const e of [document.documentElement, document.body, document.querySelector('#poster')]) e.style.background='transparent';
      t.style.visibility='visible'; t.querySelectorAll('*').forEach(e=>e.style.visibility='visible');
      // ภาพผู้สอน/ไอคอนต้องไม่ติด glass ของพ่อแม่
    },[sel]);
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
    const ids=['tab','eyebrow','hai','p1day','pedit','hsell','card','plab','price','pfull','i1','i2','i3','cta'];
    const o={}; ids.forEach(i=>o[i]=g('#'+i)); o.tabtext=g('#tab span'); o.i1t=g('#i1 span'); o.i2t=g('#i2 span'); o.i3t=g('#i3 span');
    o.ctak=g('#cta .k'); o.ctav=g('#cta .v');
    const e=document.querySelector('#seat'); o.seat={x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight}; return o; });
  console.log(JSON.stringify({img:out,txt:tx})); await b.close();
})();
