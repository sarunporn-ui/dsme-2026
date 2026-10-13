const pptxgen = require('pptxgenjs');
const D = '/home/user/dsme-2026/poster/', A = D + 'pptx-assets-v5/';
const L = require('./layout-v5.json'); // from export-layers-v5.js
const pres = new pptxgen();
pres.defineLayout({ name: 'POST45', width: 11.25, height: 14.0625 }); pres.layout = 'POST45';
pres.title = '1 Day AI ตัดคลิป v5';
const s = pres.addSlide();
const i = px => px / 96, pt = px => px * 0.75;
const F = 'LINE Seed Sans TH', FH = 'LINE Seed Sans TH Heavy';
const C = { orange:'FF7A3D', blue:'2563FF', soft:'C7D2FE', w:'FFFFFF' };
const t = L.txt;
const box = (b, rot=0, dw=0) => ({ x:i(b.x), y:i(b.y), w:i(b.w+dw), h:i(b.h), rotate:rot });
const T = o => Object.assign({ isTextBox:true, margin:0, align:'left', valign:'middle', fontFace:F }, o);
const img = (k, name) => s.addImage({ path:A+k+'.png', ...box(L.img[k]), objectName:name||k });

s.background = { path: A + 'bg.png' };
img('logocat','Logo cat');
s.addText('ToGreater', T({ ...box(t.logotext,0,10), fontFace:FH, fontSize:pt(32), color:C.w, objectName:'Logo text' }));
s.addText('เฮ้ย!', T({ ...box(t.hey,-9,30), fontFace:FH, fontSize:pt(96), color:C.orange, objectName:'Hey' }));
s.addText('ตัดเองมันเมื่อยมือ !!!', T({ ...box(t.bar), align:'center', bold:true, fontSize:pt(66), color:C.w, fill:{ color:C.blue }, objectName:'Bar' }));
s.addText('AI ตัดคลิป', T({ ...box(t.big), align:'center', fontFace:FH, fontSize:pt(186), color:C.w, charSpacing:-2, objectName:'Big word' }));
img('stClaude','Sticker Claude');
img('peekW','Big head woman'); img('peekM','Big head man');
img('laptop','Laptop CapCut UI');
[['nameW','น้องเกรท','ToGreater'],['nameM','พี่มิค','AI ง่ายง่าย']].forEach(([k,a,b]) =>
  s.addText([{ text:a, options:{ breakLine:true } }, { text:b }], T({ ...box(t[k],0,20), x:i(t[k].x-10), align:'center', fontSize:pt(22), bold:true, color:C.w, lineSpacingMultiple:0.95,
    shadow:{ type:'outer', color:'000000', opacity:0.6, blur:10, offset:2, angle:90 }, objectName:'Name '+a })));
img('stCapcut','Sticker CapCut'); img('stCat','Sticker cat');
s.addText([{ text:'CapCut + Claude + 1 วัน = ' }, { text:'คลิปพร้อมขาย', options:{ color:C.orange } }],
  T({ ...box(t.l1), align:'center', fontSize:pt(32), bold:true, color:C.w, objectName:'Copy 1' }));
s.addText('คอร์สสด 1 วันจบ · สนใจ คอมเมนต์เลย!', T({ ...box(t.l2), align:'center', fontSize:pt(30), color:C.soft, objectName:'Copy 2' }));
s.addText([{ text:'เสาร์ 7 พ.ย. 69 · รับ 10 ที่นั่ง · รอบแรก 9,900.- ' }, { text:'(ปกติ 12,900)', options:{ strike:'sngStrike', bold:false } }],
  T({ ...box(t.l3), align:'center', fontSize:pt(28), bold:true, color:C.w, fill:{ color:C.blue }, objectName:'Copy 3' }));
pres.writeFile({ fileName: D + 'ai-capcut-1day-v5.pptx' }).then(f => console.log('wrote', f));
