"""Synthesize the soundtrack for the ฮีลใจ by book envelope intro (7 s).

Everything is generated from scratch with numpy (no samples), timed to the
animation in envelope.html. Output: intro_sfx.wav (44.1 kHz, 16-bit stereo).
"""
import wave
import numpy as np

SR = 44100
DUR = 7.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def note(name):
    names = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    n, o = name[:-1], int(name[-1])
    semi = names[n[0]] + (1 if '#' in n else 0)
    return 440.0 * 2 ** ((semi - 9) / 12 + (o - 4))


def add(sig, t0, gain=1.0, pan=0.0):
    """Mix a mono signal at time t0 (s); pan -1 (left) .. 1 (right)."""
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * gl * 1.414
    R[i:i + len(sig)] += sig * gain * gr * 1.414


def tt(d):
    return np.arange(int(d * SR)) / SR


def band_noise(d, lo, hi):
    n = int(d * SR)
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)


def bell(freq, d=1.2, decay=3.0, bright=1.0):
    t = tt(d)
    parts = [(1, 1.0), (2.76, .45 * bright), (5.40, .22 * bright), (8.93, .10 * bright)]
    x = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * decay * (1 + r * .35)) for r, a in parts)
    att = np.minimum(1, t / .004)
    return x * att


def music_box(freq, d=1.4):
    t = tt(d)
    x = (np.sin(2 * np.pi * freq * t) + .35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 6)
         + .15 * np.sin(2 * np.pi * freq * 4.2 * t) * np.exp(-t * 12))
    return x * np.exp(-t * 2.6) * np.minimum(1, t / .003)


def swell(d, shape=2.0):
    t = np.linspace(0, 1, int(d * SR))
    return np.sin(np.pi * t) ** shape


# ---------- music bed: music-box lullaby + soft pad ----------
melody = ['E5', 'G5', 'A5', 'C6', 'A5', 'G5', 'E5', 'G5',
          'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5']
for k, nm in enumerate(melody):
    add(music_box(note(nm)), 0.30 + k * 0.38, gain=.16, pan=-.15 + .3 * (k % 2))
for k, nm in enumerate(['C4', 'G4', 'A3', 'E4', 'F3', 'C4', 'C4', 'G4']):
    add(music_box(note(nm), 1.8), 0.30 + k * 0.76, gain=.07)

chords = [(0.0, 3.0, ['C3', 'G3', 'E4']), (3.0, 4.5, ['A2', 'E3', 'C4']),
          (4.5, 5.5, ['F2', 'C3', 'A3']), (5.5, 7.0, ['C3', 'G3', 'E4'])]
for a, b, ns in chords:
    t = tt(b - a + .4)
    env = np.minimum(1, t / .5) * np.minimum(1, (t[::-1]) / .5)
    pad = sum(np.sin(2 * np.pi * note(n) * t) + .5 * np.sin(2 * np.pi * note(n) * 1.003 * t) for n in ns)
    add(pad * env, max(0, a - .2), gain=.022, pan=-.2)
    add(pad * env, max(0, a - .2), gain=.022, pan=.2)

# ---------- sound effects, timed to the animation ----------
# 0.2-1.1 envelope slides up: soft airy whoosh
add(band_noise(.9, 300, 2500) * swell(.9, 1.5), .2, gain=.18)
# 1.12 wax seal pops off
t = tt(.12)
add(np.sin(2 * np.pi * np.cumsum(np.linspace(900, 260, len(t))) / SR) * np.exp(-t * 40), 1.10, gain=.42)
# 1.25-1.9 flap opens: paper rustle
d = .65
crackle = np.repeat(rng.random(int(d * 120)) ** 3, int(SR / 120) + 1)[: int(d * SR)]
add(band_noise(d, 1500, 9000) * swell(d, 1) * (.4 + crackle), 1.25, gain=.16)
# 1.85-2.65 letter slides out of the envelope
add(band_noise(.8, 700, 5000) * swell(.8, 1.2), 1.85, gain=.17)
# 2.6 sparkle burst as the letter comes free
for k, nm in enumerate(['C7', 'E7', 'G7', 'C8', 'E8']):
    add(bell(note(nm), 1.0, 4.5, .6), 2.58 + k * .035, gain=.07, pan=-.4 + k * .2)
add(band_noise(.8, 6000, 14000) * np.exp(-tt(.8) * 5), 2.58, gain=.05)
# 2.8-3.3 wand swoops in from the bottom right
t = tt(.5)
add(band_noise(.5, 600, 4500) * swell(.5, 1.2), 2.8, gain=.15, pan=.5)
add(np.sin(2 * np.pi * np.cumsum(np.linspace(500, 1400, len(t))) / SR) * swell(.5, 2) * .5, 2.8, gain=.10, pan=.4)
# 3.3-4.4 magic writing: twinkling bells moving left -> right with the wand
pent = ['C6', 'D6', 'E6', 'G6', 'A6', 'C7', 'D7', 'E7', 'G7', 'A7']
tcur = 3.3
while tcur < 4.42:
    p = (tcur - 3.3) / 1.1
    idx = int(np.clip(p * 7 + rng.integers(0, 4), 0, len(pent) - 1))
    add(bell(note(pent[idx]), .9, 5.0, .7), tcur, gain=.075, pan=-.6 + 1.2 * p)
    tcur += .055 + rng.random() * .03
add(band_noise(1.2, 5000, 13000) * swell(1.2, .8), 3.3, gain=.045)
# 3.35 cat pops in (right side): soft bloop
t = tt(.16)
add(np.sin(2 * np.pi * np.cumsum(np.linspace(330, 720, len(t))) / SR) * np.exp(-t * 18) * np.minimum(1, t / .01), 3.36, gain=.28, pan=.7)
# 4.4-4.8 wand hops down to "by book"
add(band_noise(.35, 800, 5000) * swell(.35, 1.5), 4.42, gain=.09)
# 4.85 tap: bright "ting" + little burst
add(bell(note('E7'), 1.8, 2.2, 1.0), 4.85, gain=.30, pan=.15)
add(bell(note('B7'), 1.4, 3.0, .6), 4.86, gain=.10, pan=.15)
for k, nm in enumerate(['G7', 'C8', 'E8']):
    add(bell(note(nm), .7, 6, .5), 4.92 + k * .045, gain=.05, pan=-.3 + k * .3)
# 5.05-5.6 wand flies away: rising whoosh
add(band_noise(.55, 1200, 7000) * swell(.55, 1.4), 5.05, gain=.10, pan=.6)
# 5.25-5.75 cat turns a page
d = .5
flutter = (np.sin(2 * np.pi * 18 * tt(d)) * .5 + .5) ** 2
add(band_noise(d, 1200, 7000) * swell(d, 1.3) * (.35 + flutter), 5.25, gain=.13, pan=.7)
# 5.6-6.4 final glint across the title
for k, nm in enumerate(['G6', 'C7', 'E7']):
    add(bell(note(nm), 1.4, 2.6, .5), 5.62 + k * .12, gain=.07, pan=-.4 + .4 * k)

# ---------- master ----------
fade = np.ones(N)
fs = int(.5 * SR)
fade[-fs:] = np.linspace(1, 0, fs) ** 1.5
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * .89, R / peak * .89
pcm = (np.stack([L, R], 1) * 32767).astype('<i2')
with wave.open('intro_sfx.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote intro_sfx.wav', DUR, 's')
