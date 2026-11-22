"""Build the reading-cat SVG in a bold, flat cartoon line style
(thick black outline, flat fills, fluffy scalloped head, big round eyes)
and swap it into the intro (envelope.html) and thumbnail v4.

Element ids (catRoot, catPop, catTail, catHead, catEyes, catBow, catBook,
flipPage, catFloat) are kept so the intro animation still drives them.
"""
import math
import re

K = '#1d1d1f'      # outline
W = '#ffffff'      # fur
G = '#d3d3d6'      # grey patches
P = '#f7b6c4'      # pink
B = '#9cc8ee'      # blue
SW = 6             # outline width


def scallop(cx, cy, rx, ry, n, amp, a0=0.0, a1=2 * math.pi, closed=True):
    pts = []
    for i in range(n + (0 if closed else 1)):
        a = a0 + (a1 - a0) * i / n
        pts.append((a, cx + rx * math.cos(a), cy + ry * math.sin(a)))
    d = f'M{pts[0][1]:.1f},{pts[0][2]:.1f} '
    seq = pts[1:] + ([pts[0]] if closed else [])
    prev = pts[0]
    for cur in seq:
        am = (prev[0] + cur[0]) / 2 if cur is not pts[0] else (prev[0] + a1) / 2
        qx = cx + rx * (1 + amp) * math.cos(am)
        qy = cy + ry * (1 + amp) * math.sin(am)
        d += f'Q{qx:.1f},{qy:.1f} {cur[1]:.1f},{cur[2]:.1f} '
        prev = cur
    return d + ('Z' if closed else '')


head = scallop(200, 180, 112, 90, 22, .09)
line = f'fill="none" stroke="{K}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round"'
fillk = f'stroke="{K}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round"'

cat_inner = f'''
<defs><filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="1" seed="2" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.2"/></filter></defs>
<g id="catPop" filter="url(#wob)">
 <ellipse cx="200" cy="442" rx="160" ry="14" fill="#5f7da0" opacity=".2"/>
 <g id="catTail">
  <path d="M286,418 C338,416 368,378 362,326 C360,306 350,292 338,292 C326,293 322,306 328,318 C340,352 330,384 284,392 Z" fill="{W}" {fillk}/>
  <path d="M338,292 C326,293 322,306 328,318 C334,316 344,312 352,300 C348,295 343,292 338,292Z" fill="{G}" stroke="none"/>
  <path d="M338,292 C326,293 322,306 328,318" {line}/>
 </g>
 <g id="catBody">
  <path d="M106,434 C88,336 118,252 200,248 C282,252 312,336 294,434 Z" fill="{W}" {fillk}/>
  <path d="M236,300 C262,300 280,330 282,362 C262,370 240,352 232,330 C228,316 228,304 236,300Z" fill="{G}" stroke="none"/>
  <path d="M106,434 C88,336 118,252 200,248 C282,252 312,336 294,434" {line}/>
  <path d="M112,434 q0,-28 36,-28 q36,0 36,28 Z" fill="{W}" {fillk}/>
  <path d="M216,434 q0,-28 36,-28 q36,0 36,28 Z" fill="{W}" {fillk}/>
  <path d="M136,434 v-10 M160,434 v-10 M240,434 v-10 M264,434 v-10" {line} stroke-width="4"/>
 </g>
 <g id="catHead">
  <path d="M106,138 L104,62 Q106,48 120,54 L178,98 Z" fill="{G}" {fillk}/>
  <path d="M294,138 L296,62 Q294,48 280,54 L222,98 Z" fill="{W}" {fillk}/>
  <path d="M118,118 L118,74 L156,102 Z" fill="{P}" stroke="none"/>
  <path d="M282,118 L282,74 L244,102 Z" fill="{P}" stroke="none"/>
  <path d="{head}" fill="{W}" stroke="none"/>
  <path d="M96,170 C92,120 130,96 170,100 C186,112 184,140 166,156 C140,176 112,180 96,170Z" fill="{G}" stroke="none"/>
  <path d="{head}" {line}/>
  <path d="M184,92 l-4,-16 M200,90 l0,-18 M216,92 l4,-16" {line} stroke-width="4.5"/>
  <path d="M90,186 l-18,-4 M90,200 l-18,4 M310,186 l18,-4 M310,200 l18,4" {line} stroke-width="4"/>
  <ellipse cx="138" cy="222" rx="15" ry="9" fill="{P}" stroke="none"/>
  <ellipse cx="262" cy="222" rx="15" ry="9" fill="{P}" stroke="none"/>
  <g id="catEyes">
   <ellipse cx="160" cy="192" rx="8" ry="9" fill="{K}"/><ellipse cx="240" cy="192" rx="8" ry="9" fill="{K}"/>
  </g>
  <circle cx="160" cy="190" r="31" fill="#eaf4ff" fill-opacity=".22" {fillk} stroke-width="5"/>
  <circle cx="240" cy="190" r="31" fill="#eaf4ff" fill-opacity=".22" {fillk} stroke-width="5"/>
  <path d="M191,186 q9,-8 18,0 M129,186 l-26,-8 M271,186 l26,-8" {line} stroke-width="5"/>
  <path d="M193,220 q7,-4 14,0 q-2,8 -7,9 q-5,-1 -7,-9Z" fill="{K}" stroke="{K}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M200,229 q-5,9 -12,5 M200,229 q5,9 12,5" {line} stroke-width="4"/>
 </g>
 <g id="catBow">
  <path d="M200,262 C180,244 160,250 164,266 C168,282 188,276 200,264 C212,276 232,282 236,266 C240,250 220,244 200,262Z" fill="{B}" {fillk} stroke-width="4.5"/>
  <circle cx="200" cy="264" r="7" fill="{B}" {fillk} stroke-width="4.5"/>
 </g>
 <g id="catBook">
  <path d="M82,306 Q200,286 318,306 L328,388 Q200,368 72,388 Z" fill="{B}" {fillk}/>
  <path d="M200,300 Q146,284 98,296 L92,376 Q148,364 200,380 Z" fill="{W}" {fillk} stroke-width="5"/>
  <path d="M200,300 Q254,284 302,296 L308,376 Q252,364 200,380 Z" fill="{W}" {fillk} stroke-width="5"/>
  <path d="M114,318 q38,-9 72,0 M114,336 q38,-9 72,0 M114,354 q28,-7 52,0 M214,318 q38,-9 72,0 M214,336 q38,-9 72,0 M234,354 q28,-7 52,0" fill="none" stroke="#b9c3cf" stroke-width="4" stroke-linecap="round"/>
  <path d="M272,296 v36 l-8,-8 l-8,8 v-38" fill="{P}" {fillk} stroke-width="4"/>
  <path id="flipPage" d="M200,300 Q254,284 302,296 L308,376 Q252,364 200,380 Z" fill="{W}" {fillk} stroke-width="5" opacity="0"/>
  <circle cx="92" cy="346" r="22" fill="{W}" {fillk}/>
  <circle cx="308" cy="346" r="22" fill="{W}" {fillk}/>
  <path d="M82,336 v8 M94,333 v8 M298,336 v8 M310,333 v8" {line} stroke-width="3.5"/>
 </g>
</g>'''


def swap(path, end_marker, root_tf, keep_float):
    s = open(path, encoding='utf-8').read()
    a = s.index('<svg id="cat"')
    b = s.index(end_marker, a)
    open_tag = s[a:s.index('>', a) + 1]
    block = (open_tag + f'\n<g id="catRoot" transform="{root_tf}">' + cat_inner
             + ('<g id="catFloat"></g>' if keep_float else '') + '</g>\n</svg>\n')
    s = s[:a] + block + s[b:]
    open(path, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
  swap('envelope.html', '<svg id="fx"', 'translate(1432,588) scale(1.1)', True)
  swap('thumbnails/let-them-v4.html', '<div id="brand">', 'translate(1012,440) scale(.68)', False)
  print('cat swapped')
