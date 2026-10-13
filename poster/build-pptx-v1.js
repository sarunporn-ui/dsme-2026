const pptxgen = require('pptxgenjs') // npm install pptxgenjs;
const D = '/home/user/dsme-2026/poster/', A = D + 'pptx-assets/';
const pres = new pptxgen();
pres.defineLayout({ name: 'POST45', width: 11.25, height: 14.0625 });
pres.layout = 'POST45';
pres.title = '1 Day AI ตัดคลิป';
const s = pres.addSlide();
const i = px => px / 96, pt = px => px * 0.75;
const F = 'LINE Seed Sans TH', FH = 'LINE Seed Sans TH Heavy';
const C = { navy:'0F172A', ink:'0F172A', blue:'2563FF', orange:'FF7A3D', soft:'C7D2FE', blk:'0B1020', w:'FFFFFF', deep:'1B47C2' };
const sh = () => ({ type:'outer', color:'000000', blur:14, offset:8, angle:90, opacity:0.45 });
// rotate point (x,y) around (cx,cy)
const rp = (x,y,cx,cy,deg) => { const r=deg*Math.PI/180, dx=x-cx, dy=y-cy; return [cx+dx*Math.cos(r)-dy*Math.sin(r), cy+dx*Math.sin(r)+dy*Math.cos(r)]; };
// place child box (local x,y,w,h inside group gx,gy,gw,gh rotated deg) -> absolute unrotated box + rotation
const inG = (g, x,y,w,h) => { const [cx,cy]=rp(g.x+x+w/2,g.y+y+h/2,g.x+g.w/2,g.y+g.h/2,g.rot); return { x:i(cx-w/2), y:i(cy-h/2), w:i(w), h:i(h), rotate:g.rot }; };
const box = (x,y,w,h,rot=0) => ({ x:i(x), y:i(y), w:i(w), h:i(h), rotate:rot });
const T = (o) => Object.assign({ isTextBox:true, margin:0, align:'center', valign:'middle', fontFace:F }, o);

s.background = { path: A + 'bg.png' };

// Timeline prop
const tl = { x:-30, y:30, w:420, h:146, rot:-12 };
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...box(tl.x,tl.y,tl.w,tl.h,tl.rot), rectRadius:0.18, fill:{color:C.blk}, line:{color:'2A3350',width:1.5}, shadow:sh(), objectName:'Timeline' });
const tracks = [[[150,'2563FF'],[90,'3B82F6'],[130,'2563FF']],[[70,'FF7A3D'],[180,'FF8A4C'],[100,'FF7A3D']],[[380,'22C55E']]];
let ty = 16 + 8;
tracks.forEach((tr,k) => { let tx = 16; const h = k===2?18:30;
  tr.forEach(([w,c]) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...inG(tl,tx,ty,w,h), rectRadius:0.06, fill:{color:c}, line:{type:'none'} }); tx += w + 6; });
  ty += h + 16; });
s.addShape(pres.shapes.RECTANGLE, { ...inG(tl,210,6,3,134), fill:{color:'FFFFFF'}, line:{type:'none'} });

s.addImage({ path:A+'cat-laptop.png', ...box(840-7,20-7,244,249,8), objectName:'Cat laptop' });

// Logo
const lg = { x:540, y:50, w:120, h:103, rot:-3 };
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...box(lg.x,lg.y,lg.w,lg.h,lg.rot), rectRadius:0.25, fill:{color:C.blk}, line:{color:C.w,width:3.75}, shadow:sh(), objectName:'Logo bg' });
s.addImage({ path:D+'assets/logo-togreater.png', ...inG(lg,21,15,78,73.5), objectName:'Logo' });

// Handle label
s.addText('คอร์สสด 1 วันจบ', T({ ...box(330,226,250,56,-2), fontSize:pt(28), bold:true, color:C.w, fill:{color:C.blk}, line:{color:'3A4152',width:1.5}, objectName:'Label course' }));

// Toggle
const tg = { x:770, y:300, w:200, h:96, rot:-6 };
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { ...box(tg.x,tg.y,tg.w,tg.h,tg.rot), rectRadius:0.5, fill:{color:C.blue}, line:{color:C.w,width:4.5}, shadow:sh(), objectName:'Toggle' });
s.addShape(pres.shapes.OVAL, { ...inG(tg,116,12,72,72), fill:{color:'EEF2FA'}, line:{type:'none'}, shadow:{type:'outer',color:'000000',blur:6,offset:4,angle:90,opacity:0.3} });
s.addText('AI', T({ ...inG(tg,24,20,70,56), fontFace:FH, fontSize:pt(34), color:C.w, objectName:'Toggle text' }));

// Headline bars
s.addText('1 Day', T({ ...box(110,300,370,148,-6), fontFace:FH, fontSize:pt(112), color:C.w, fill:{color:C.orange}, shadow:sh(), objectName:'Headline 1 Day' }));
s.addText('AI ตัดคลิป', T({ ...box(150,440,724,172,-4), fontFace:FH, fontSize:pt(136), color:C.w, fill:{color:C.blue}, shadow:sh(), objectName:'Headline AI' }));
s.addText([ { text:'ทำคลิป ตัดต่อ ', options:{ bold:true, color:C.ink } }, { text:'พร้อมขาย', options:{ fontFace:FH, color:C.orange } } ],
  T({ ...box(250,660,660,96,2), fontSize:pt(56), fill:{color:C.w}, shadow:sh(), objectName:'Subheadline' }));

// App icons + labels
s.addImage({ path:A+'claude.png', ...box(900,590,136,136,9), objectName:'Icon Claude' });
s.addText('Claude', T({ ...box(910,740,106,43,9), fontSize:pt(22), bold:true, color:C.w, fill:{color:C.blk} }));
s.addImage({ path:A+'capcut.png', ...box(80,790,150,150,-10), objectName:'Icon CapCut' });
s.addText('CapCut', T({ ...box(95,952,114,43,-10), fontSize:pt(22), bold:true, color:C.w, fill:{color:C.blk} }));

// Instructors + sparkle cat
s.addImage({ path:A+'instructors.png', ...box(250-7,800-7,614,557), objectName:'Instructors' });
s.addImage({ path:A+'cat-sparkle.png', ...box(225-7,870-7,124,124,-8), objectName:'Cat sparkle' });

// Badges
s.addShape(pres.shapes.OVAL, { ...box(60,1005,220,220,-8), fill:{color:C.w}, line:{color:C.blue,width:5.25}, shadow:sh(), objectName:'Badge seats' });
s.addShape(pres.shapes.OVAL, { ...box(770,880,270,270,10), fill:{color:C.orange}, line:{color:C.w,width:5.25}, shadow:sh(), objectName:'Badge price' });
s.addText([
  { text:'รับเพียง', options:{ fontSize:pt(24), bold:true, color:C.ink, breakLine:true } },
  { text:'10', options:{ fontFace:FH, fontSize:pt(96), color:C.blue, breakLine:true } },
  { text:'ที่นั่ง', options:{ fontSize:pt(24), bold:true, color:C.ink } } ],
  T({ ...box(60,1005,220,220,-8), lineSpacingMultiple:0.85, objectName:'Badge seats text' }));
s.addText([
  { text:'ราคารอบแรก', options:{ fontSize:pt(24), bold:true, breakLine:true } },
  { text:'6,990', options:{ fontFace:FH, fontSize:pt(76), breakLine:true } },
  { text:'บาท/ท่าน', options:{ fontSize:pt(24), bold:true, breakLine:true } },
  { text:'ราคาเต็ม 8,500', options:{ fontSize:pt(22), strike:'sngStrike' } } ],
  T({ ...box(770,880,270,270,10), color:C.w, lineSpacingMultiple:0.9, objectName:'Badge price text' }));

// Date
const dt = { x:50, y:1262, w:482, h:74, rot:-2 };
s.addText('วันเรียน', T({ ...inG(dt,0,12,132,50), fontSize:pt(24), bold:true, color:C.w, fill:{color:C.orange}, shadow:sh(), objectName:'Date label' }));
s.addText('เสาร์ 7 พ.ย. 2026', T({ ...inG(dt,132,0,350,74), fontFace:FH, fontSize:pt(40), color:C.w, fill:{color:C.blk}, line:{color:'3A4152',width:1.5}, shadow:sh(), objectName:'Date' }));

// CTA + cursor
s.addText('สนใจ คอมเมนต์เลย', T({ shape:pres.shapes.ROUNDED_RECTANGLE, rectRadius:0.5, ...box(590,1250,385,82,-4), fontSize:pt(34), bold:true, color:C.w, fill:{color:C.orange}, line:{color:C.w,width:3.75}, shadow:sh(), objectName:'CTA' }));
s.addImage({ path:A+'cursor.png', ...box(945,1258,84,84,-14), objectName:'Cursor' });

// Sparks
[[70,270,44],[990,440,30],[730,800,28]].forEach(([x,y,f]) => s.addText('✦', T({ ...box(x,y+8,f,f*1.3), fontSize:pt(f), color:C.w, fontFace:'Arial' })));

pres.writeFile({ fileName: D + 'ai-capcut-1day.pptx' }).then(f => console.log('wrote', f));
