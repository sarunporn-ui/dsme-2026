const pptxgen = require('pptxgenjs');
const D = '/home/user/dsme-2026/poster/', A = D + 'pptx-assets-v3/';
const L = require('./layout-v3.json'); // from export-layers-v3.js
const pres = new pptxgen();
pres.defineLayout({ name: 'POST45', width: 11.25, height: 14.0625 }); pres.layout = 'POST45';
pres.title = '1 Day AI ตัดคลิป v3';
const s = pres.addSlide();
const i = px => px / 96, pt = px => px * 0.75;
const F = 'LINE Seed Sans TH', FH = 'LINE Seed Sans TH Heavy';
const C = { navy:'0F172A', orange:'FF7A3D', sell:'FF9A60', w:'FFFFFF', chip:'24307A' };
const t = L.txt;
const box = (b, rot=0, dx=0, dw=0) => ({ x:i(b.x+dx), y:i(b.y), w:i(b.w+dw), h:i(b.h), rotate:rot });
const T = o => Object.assign({ isTextBox:true, margin:0, align:'center', valign:'middle', fontFace:F }, o);
const img = (k, name) => s.addImage({ path:A+k+'.png', ...box(L.img[k]), objectName:name||k });
const glass = (b, r, name) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...box(b), rectRadius:r,
  fill:{ color:'FFFFFF', transparency:80 }, line:{ color:'FFFFFF', width:1.5, transparency:40 },
  shadow:{ type:'outer', color:'050A28', opacity:0.35, blur:20, offset:10, angle:90 }, objectName:name });
const tshadow = () => ({ type:'outer', color:'0A1450', opacity:0.45, blur:22, offset:8, angle:90 });

s.background = { path: A + 'bg.png' };
img('blurL','Blur icon left');

// Top tab + eyebrow
glass(t.tab, 0.3, 'Top tab');
img('logocat','Logo cat');
s.addText('ToGreater', T({ ...box(t.tabtext,0,0,20), align:'left', fontFace:FH, fontSize:pt(36), color:C.w, objectName:'Logo text' }));
s.addText('คอร์สสด 1 วันจบ', T({ ...box(t.eyebrow), fontSize:pt(34), bold:true, color:C.navy, fill:{ color:C.w, transparency:5 }, objectName:'Eyebrow' }));

// Headline
s.addText('AI ตัดคลิป', T({ ...box(t.hai,0,0,40), align:'left', fontFace:FH, fontSize:pt(116), color:C.w, shadow:tshadow(), objectName:'Headline AI' }));
glass(t.p1day, 0.25, '1 Day pill');
s.addText('1 Day', T({ ...box(t.p1day), fontSize:pt(64), bold:true, color:C.w, objectName:'1 Day text' }));
glass(t.pedit, 0.25, 'Edit pill');
s.addText('ทำคลิป ตัดต่อ', T({ ...box(t.pedit), fontSize:pt(56), bold:true, color:C.w, objectName:'Edit text' }));
s.addText('พร้อมขาย', T({ ...box(t.hsell,0,0,40), align:'left', fontFace:FH, fontSize:pt(116), color:C.sell,
  shadow:{ type:'outer', color:'FF7A3D', opacity:0.35, blur:22, offset:8, angle:90 }, objectName:'Headline sell' }));

// Card
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...box(t.card), rectRadius:0.32, fill:{ color:'8FA8FF', transparency:65 },
  line:{ color:'FFFFFF', width:2.25, transparency:40 }, shadow:{ type:'outer', color:'050A28', opacity:0.45, blur:40, offset:20, angle:90 }, objectName:'Card' });
img('people','Instructors');
img('iconSharp','Icon CapCut');
glass(t.plab, 0.32, 'Price label pill');
s.addText('ราคารอบแรก', T({ ...box(t.plab), fontSize:pt(28), color:C.w }));
s.addText('6,990', T({ ...box(t.price,0,0,40), align:'left', fontFace:FH, fontSize:pt(124), color:C.w, shadow:tshadow(), objectName:'Price' }));
s.addText([{ text:'บาท/ท่าน · ' }, { text:'ราคาเต็ม 8,500', options:{ strike:'sngStrike' } }],
  T({ shape:pres.shapes.ROUNDED_RECTANGLE, rectRadius:0.32, ...box(t.pfull), fontSize:pt(28), bold:true, color:C.w,
     fill:{ color:C.navy, transparency:45 }, line:{ color:'FFFFFF', width:1.5, transparency:50 }, objectName:'Price note' }));
s.addShape(pres.shapes.OVAL, { ...box(t.seat, 8), fill:{ color:C.orange }, line:{ color:C.w, width:4.5 },
  shadow:{ type:'outer', color:'050A28', opacity:0.45, blur:24, offset:12, angle:90 }, objectName:'Seat badge' });
s.addText([{ text:'รับเพียง', options:{ fontSize:pt(22), bold:true, breakLine:true } }, { text:'10', options:{ fontFace:FH, fontSize:pt(66), breakLine:true } },
  { text:'ที่นั่ง', options:{ fontSize:pt(22), bold:true } }], T({ ...box(t.seat, 8), color:C.w, lineSpacingMultiple:0.85, objectName:'Seat text' }));

// Info row
[['i1','ic1','i1t','เสาร์ 7 พ.ย. 2026'],['i2','ic2','i2t','CapCut × Claude'],['i3','ic3','i3t','LINE @togreater']].forEach(([p,ic,tt,txt]) => {
  glass(t[p], 0.36, 'Info '+txt); img(ic, 'Icon '+txt);
  s.addText(txt, T({ ...box(t[tt],0,0,16), align:'left', fontSize:pt(26), color:C.w }));
});

// CTA
glass(t.cta, 0.45, 'CTA pill');
s.addText('สนใจ', T({ shape:pres.shapes.ROUNDED_RECTANGLE, rectRadius:0.33, ...box(t.ctak), fontSize:pt(28), color:C.w, fill:{ color:C.chip }, objectName:'CTA label' }));
s.addText('คอมเมนต์เลย', T({ ...box(t.ctav), fontFace:FH, fontSize:pt(36), color:C.w, objectName:'CTA text' }));

img('blurR','Blur icon right');
pres.writeFile({ fileName: D + 'ai-capcut-1day-v3.pptx' }).then(f => console.log('wrote', f));
