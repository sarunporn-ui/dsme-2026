const pptxgen = require('pptxgenjs');
const D = '/home/user/dsme-2026/poster/', A = D + 'pptx-assets-v2/';
const L = require('./layout-v2.json') // from export-layers-v2.js;
const pres = new pptxgen();
pres.defineLayout({ name: 'POST45', width: 11.25, height: 14.0625 }); pres.layout = 'POST45';
pres.title = '1 Day AI ตัดคลิป v2';
const s = pres.addSlide();
const i = px => px / 96, pt = px => px * 0.75;
const F = 'LINE Seed Sans TH', FH = 'LINE Seed Sans TH Heavy';
const C = { blue:'1E7BF0', orange:'FF7A3D', ink:'0F172A', body:'5B6475', mute:'7A8496', w:'FFFFFF' };
const box = (x,y,w,h,rot=0) => ({ x:i(x), y:i(y), w:i(w), h:i(h), rotate:rot });
const T = o => Object.assign({ isTextBox:true, margin:0, align:'left', valign:'middle', fontFace:F }, o);
const img = (k, name) => { const b = L.img[k]; s.addImage({ path:A+k+'.png', ...box(b.x,b.y,b.w,b.h), objectName:name }); };

s.background = { path: A + 'bg.png' };
const t = L.txt;

img('logocat','Logo cat');
s.addText([{ text:'To', options:{ color:'2563FF' } }, { text:'Greater', options:{ color:C.ink } }],
  T({ ...box(t.logotext.x, t.logotext.y, t.logotext.w+40, t.logotext.h), fontFace:FH, fontSize:pt(52), objectName:'Logo text' }));

['chip','pill','lines','people','capcut','claude'].forEach(k => img(k, k));
s.addText('คอร์สสด 1 วันจบ', T({ ...box(t.label.x, t.label.y, t.label.w, t.label.h), align:'center', fontSize:pt(34), bold:true, color:C.w,
  fill:{ color:C.blue }, shadow:{ type:'outer', color:'2563FF', opacity:0.18, blur:0, offset:7, angle:50 }, objectName:'Label' }));
img('toolbar','Toolbar');

// Headline
img('sel','Selection box');
s.addText('AI ตัดคลิป', T({ ...box(t.hblue.x, t.hblue.y, t.hblue.w+60, t.hblue.h, -2.5), fontFace:FH, fontSize:pt(126), color:C.blue,
  shadow:{ type:'outer', color:'1E7BF0', opacity:0.25, blur:16, offset:8, angle:90 }, objectName:'Headline blue' }));
s.addText('1 Day', T({ ...box(t.script.x, t.script.y, t.script.w+40, t.script.h+20, -8), fontFace:'Charm', bold:true, fontSize:pt(130), color:C.orange, objectName:'Script 1 Day' }));
s.addText('ตัดต่อ พร้อมขาย', T({ ...box(t.horange.x, t.horange.y, t.horange.w+60, t.horange.h), fontFace:FH, fontSize:pt(96), color:C.orange,
  shadow:{ type:'outer', color:'FF7A3D', opacity:0.22, blur:14, offset:8, angle:90 }, objectName:'Headline orange' }));
s.addText([
  { text:'ใช้ Claude ช่วยคิดสคริปต์ + CapCut ตัดต่อ', options:{ breakLine:true } },
  { text:'ทำคลิปขายของได้เอง ' }, { text:'ใช้ได้จริง', options:{ bold:true, color:C.ink } }, { text:' จบใน 1 วัน' } ],
  T({ ...box(t.body.x, t.body.y, t.body.w+40, t.body.h), fontSize:pt(30), color:C.body, lineSpacingMultiple:1.2, valign:'top', objectName:'Body' }));
s.addShape(pres.shapes.OVAL, { ...box(t.circle.x-12, t.circle.y-4, t.circle.w+24, t.circle.h+6, -3), fill:{ type:'none' }, line:{ color:C.orange, width:2.25 }, objectName:'Circle highlight' });

// Info row
['tile1','tile2','tile3'].forEach(k => img(k, k));
const info = (b, small, big, bigColor, extra) => {
  const runs = [{ text:small, options:{ fontSize:pt(24), color:C.mute, breakLine:true } },
                { text:big, options:{ fontFace:FH, fontSize:pt(30), color:bigColor, breakLine:!!extra } }];
  if (extra) runs.push({ text:extra, options:{ fontSize:pt(20), color:C.mute, strike:'sngStrike' } });
  s.addText(runs, T({ ...box(b.x, b.y, b.w+50, b.h), lineSpacingMultiple:1.0, objectName:'Info '+small }));
};
info(t.p1, 'วันเรียน', 'เสาร์ 7 พ.ย. 69', C.orange);
info(t.p2, 'รับเพียง', '10 ที่นั่ง', C.ink);
info(t.p3, 'ราคารอบแรก', '6,990.-', C.orange, 'ราคาเต็ม 8,500');

// Bottom
s.addText('สนใจ คอมเมนต์เลย', T({ shape:pres.shapes.ROUNDED_RECTANGLE, rectRadius:0.49, ...box(t.cta.x, t.cta.y, t.cta.w, t.cta.h), align:'center',
  fontSize:pt(34), bold:true, color:C.w, fill:{ color:C.blue }, shadow:{ type:'outer', color:'1E7BF0', opacity:0.35, blur:20, offset:10, angle:90 }, objectName:'CTA' }));
img('swirl','Swirl');
s.addText([
  { text:'LINE ', options:{ fontFace:FH, fontSize:pt(36), color:C.blue } },
  { text:'@togreater', options:{ fontFace:FH, fontSize:pt(36), color:C.orange, breakLine:true } },
  { text:'โทร 095-064-7272 (คุณเกรท)', options:{ fontSize:pt(26), color:C.body } } ],
  T({ ...box(t.contact.x-60, t.contact.y, t.contact.w+60, t.contact.h), align:'right', objectName:'Contact' }));

pres.writeFile({ fileName: D + 'ai-capcut-1day-v2.pptx' }).then(f => console.log('wrote', f));
