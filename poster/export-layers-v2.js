const { chromium } = require('playwright');
const D='/home/user/dsme-2026/poster/', O=D+'pptx-assets-v2/';
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1350}});
  await pg.goto('file://'+D+'ai-capcut-1day-v2.html'); await pg.waitForTimeout(800);
  const layers={ bg:['#bg',0], logocat:['#logo img',0], chip:['#chip',20], pill:['#pill',24], lines:['#lines',4], people:['#people',0],
    capcut:['#capcut',40], claude:['#claude',44], toolbar:['#toolbar',50], sel:['#sel',16], swirl:['#swirl',4],
    tile1:['.it:nth-child(1) .tile',22], tile2:['.it:nth-child(2) .tile',22], tile3:['.it:nth-child(3) .tile',22] };
  const out={};
  for (const [k,[sel,pad]] of Object.entries(layers)) {
    await pg.evaluate(([sel])=>{ const t=document.querySelector(sel);
      document.querySelectorAll('#poster *').forEach(e=>e.style.visibility='hidden');
      document.querySelector('#poster').style.background='transparent'; document.body.style.background='transparent'; document.documentElement.style.background='transparent';
      t.style.visibility='visible'; t.querySelectorAll('*').forEach(e=>e.style.visibility='visible');
      if (sel==='#bg') { document.querySelector('#poster').style.background='#F5F9FF'; } },[sel]);
    const r=await pg.evaluate(s=>{const q=document.querySelector(s).getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height}},sel);
    let x=Math.max(0,Math.floor(r.x-pad)), y=Math.max(0,Math.floor(r.y-pad));
    let x2=Math.min(1080,Math.ceil(r.x+r.w+pad)), y2=Math.min(1350,Math.ceil(r.y+r.h+pad));
    if (k==='bg'){x=0;y=0;x2=1080;y2=1350;}
    await pg.screenshot({ path:O+k+'.png', clip:{x,y,width:x2-x,height:y2-y}, omitBackground:true, scale:'device' });
    out[k]={x,y,w:x2-x,h:y2-y};
  }
  // reset & measure text boxes (pre-transform)
  await pg.reload(); await pg.waitForTimeout(500);
  const tx=await pg.evaluate(()=>{
    const m=s=>{const e=document.querySelector(s); let x=0,y=0,n=e; while(n&&n.id!=='poster'){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;} return {x,y,w:e.offsetWidth,h:e.offsetHeight};};
    const g=s=>{const q=document.querySelector(s).getBoundingClientRect();return {x:q.x,y:q.y,w:q.width,h:q.height}};
    return { logotext:g('#logo span'), script:m('#script'), hblue:m('#hblue'), horange:m('#horange'), body:m('#body'), circle:g('.circle'),
      label:m('#label'), cta:m('#cta'), contact:g('#contact'), p1:g('.it:nth-child(1) p'), p2:g('.it:nth-child(2) p'), p3:g('.it:nth-child(3) p') };
  });
  console.log(JSON.stringify({img:out,txt:tx},null,1)); await b.close();
})();
