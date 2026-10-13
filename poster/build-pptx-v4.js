const pptxgen = require('pptxgenjs');
const D = '/home/user/dsme-2026/poster/', A = D + 'pptx-assets-v4/';
const L = require('./layout-v4.json'); // from export-layers-v4.js
const pres = new pptxgen();
pres.defineLayout({ name: 'POST45', width: 11.25, height: 14.0625 }); pres.layout = 'POST45';
pres.title = '1 Day AI ตัดคลิป v4';
const s = pres.addSlide();
const i = px => px / 96, pt = px => px * 0.75;
const F = 'LINE Seed Sans TH', FH = 'LINE Seed Sans TH Heavy';
const C = { navy:'0F172A', orange:'FF7A3D', peach:'FFD3BC', w:'FFFFFF' };
const t = L.txt;
const box = (b, rot=0, dw=0) => ({ x:i(b.x), y:i(b.y), w:i(b.w+dw), h:i(b.h), rotate:rot });
const T = o => Object.assign({ isTextBox:true, margin:0, align:'left', valign:'middle', fontFace:F }, o);
const img = (k, name) => s.addImage({ path:A+k+'.png', ...box(L.img[k]), objectName:name||k });
const tsh = () => ({ type:'outer', color:'0A1450', opacity:0.35, blur:22, offset:8, angle:90 });

s.background = { path: A + 'bg.png' };

// Logo row
img('lgcat','Logo ToGreater'); img('lgcapcut','Logo CapCut'); img('lgclaude','Logo Claude');
t.lgtext.forEach(l => s.addText(l.t, T({ ...box(l,0,14), fontFace:FH, fontSize:pt(30), color:C.w, objectName:'Logo '+l.t })));
t.vr.forEach(v => s.addShape(pres.shapes.RECTANGLE, { ...box(v), fill:{ color:C.w, transparency:60 }, line:{ type:'none' } }));

// Price badge
s.addShape(pres.shapes.OVAL, { ...box(t.price,-8), fill:{ color:C.orange }, line:{ color:C.w, width:4.5 },
  shadow:{ type:'outer', color:'0A1450', opacity:0.35, blur:26, offset:14, angle:90 }, objectName:'Price badge' });
s.addText([
  { text:'ราคารอบแรก', options:{ fontSize:pt(24), bold:true, breakLine:true } },
  { text:'6,990', options:{ fontFace:FH, fontSize:pt(72), breakLine:true } },
  { text:'บาท/ท่าน', options:{ fontSize:pt(24), bold:true, breakLine:true } },
  { text:'ราคาเต็ม 8,500', options:{ fontSize:pt(20), strike:'sngStrike' } } ],
  T({ ...box(t.price,-8), align:'center', color:C.w, lineSpacingMultiple:0.9, objectName:'Price text' }));

img('people','Instructors');

// Right column
s.addText([{ text:'#ToGreater,', options:{ fontFace:FH, breakLine:true } }, { text:'คอร์สสด 1 วันจบ' }],
  T({ ...box(t.eyebrow,0,60), fontSize:pt(30), italic:true, color:C.w, valign:'top', objectName:'Eyebrow' }));
s.addText('1 Day',   T({ ...box(t.h1,0,40), fontFace:FH, fontSize:pt(140), color:C.w, shadow:tsh(), objectName:'Headline 1' }));
s.addText('AI',      T({ ...box(t.h2,0,40), fontFace:FH, fontSize:pt(150), color:C.w, shadow:tsh(), objectName:'Headline 2' }));
s.addText('ตัดคลิป', T({ ...box(t.h3,0,40), fontFace:FH, fontSize:pt(112), color:C.w, shadow:tsh(), objectName:'Headline 3' }));

// Speech bubble
const bb = t.bubble, cx = bb.x + 7 - 15, cy = bb.y + 58;
s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x:i(cx-18), y:i(cy-15), w:i(36), h:i(30), rotate:-90, fill:{ color:C.w }, line:{ type:'none' }, objectName:'Bubble tail' });
s.addShape(pres.shapes.PARALLELOGRAM, { ...box(bb), fill:{ color:C.w }, line:{ type:'none' },
  shadow:{ type:'outer', color:'0A1450', opacity:0.3, blur:20, offset:12, angle:90 }, objectName:'Bubble' });
s.addText([{ text:'ทำคลิป ตัดต่อ ' }, { text:'พร้อมขาย', options:{ fontFace:FH, color:C.orange, breakLine:true } }, { text:'ด้วย CapCut + Claude' }],
  T({ x:i(bb.x+33), y:i(bb.y), w:i(bb.w-50), h:i(bb.h), fontSize:pt(34), bold:true, color:C.navy, lineSpacingMultiple:1.05, objectName:'Bubble text' }));

// Chips
[['c1','วันเรียน ','เสาร์ 7 พ.ย. 69'],['c2','รับเพียง ','10 ที่นั่ง']].forEach(([k,a,b]) =>
  s.addText([{ text:a }, { text:b, options:{ fontFace:FH, color:C.peach } }], T({ shape:pres.shapes.ROUNDED_RECTANGLE, rectRadius:0.34,
    ...box(t[k]), align:'center', fontSize:pt(26), color:C.w, fill:{ color:C.navy, transparency:45 }, line:{ color:C.w, width:1.5, transparency:65 }, objectName:'Chip '+b })));

// Bottom bar
[['ib1','tb1','สนใจ คอมเมนต์เลย'],['ib2','tb2','@togreater'],['ib3','tb3','095-064-7272']].forEach(([ib,tb,txt]) => {
  s.addShape(pres.shapes.RECTANGLE, { ...box(t[ib]), fill:{ color:C.navy }, line:{ type:'none' }, objectName:'Bar icon bg' });
  s.addShape(pres.shapes.RECTANGLE, { ...box(t[tb]), fill:{ color:'FFFFFF', transparency:78 }, line:{ type:'none' }, objectName:'Bar bg' });
  s.addText(txt, T({ x:i(t[tb].x+18), y:i(t[tb].y+3), w:i(t[tb].w-10), h:i(t[tb].h), fontSize:pt(24), bold:true, color:C.w, objectName:'Bar '+txt }));
});
img('ib1','Icon comment'); img('ib3','Icon phone');
s.addText('LINE', T({ ...box(t.ib2), align:'center', fontFace:FH, fontSize:pt(22), color:C.w }));

pres.writeFile({ fileName: D + 'ai-capcut-1day-v4.pptx' }).then(f => console.log('wrote', f));
