# "Waves of infection": interfering ripples from several epicentres on a deep Coffee Bean / Ultrasonic gradient.
import numpy as np, sys, os
from PIL import Image
SC = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
W, H = int(3840*SC), int(2160*SC); OUT = sys.argv[1]
def hx(h): return np.array([int(h[i:i+2],16) for i in (0,2,4)], np.float32)
PARCH, ICY, ULTRA, CRIM, COFFEE = map(hx, ['EDEDE8', 'C5F9FC', '5320C0', '4F032E', '1D0C13'])
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); X, Y = xx/W, yy/H*(H/W)    # Y in width units
def lay(img, c, a): a = np.clip(a, 0, 1)[..., None]; return img*(1-a) + c*a
def glow(cx, cy, r): return np.exp(-(((X-cx)**2 + (Y-cy*H/W)**2)/r**2)*2.2)
def ripples(src, lam, width_px, decay):
    acc = np.zeros((H, W), np.float32)
    for (cx, cy, ph, amp) in src:
        r = np.sqrt((X-cx)**2 + (Y-cy*H/W)**2)
        d = np.abs(((r/lam - ph) % 1.0) - 0.5)*lam*W                       # px distance to the nearest ring
        ring = np.clip(1 - np.abs(d - 0.5*lam*W*0) / (width_px*SC) * 0 + 0, 0, 1)
        ring = np.clip(1 - (0.5*lam*W - d)/(width_px*SC), 0, 1)             # thin line at each period
        acc = np.maximum(acc, ring*amp*np.exp(-r/decay))
    return acc
def make(name, g_ultra, g_crim, src, quiet=None, seed=1, lam=0.028):
    img = np.ones((H, W, 3), np.float32)*COFFEE
    img = lay(img, ULTRA, glow(*g_ultra)*0.9)
    img = lay(img, CRIM*1.3, glow(*g_crim)*0.75)
    rp = ripples(src, lam, 2.6, 0.6)
    q = np.ones((H, W), np.float32) if quiet is None else quiet
    img = lay(img, ICY, rp*0.6*q)
    for (cx, cy, ph, amp) in src:                                             # epicentre glow
        img = lay(img, CRIM*1.6, glow(cx, cy, 0.05)*0.55*amp)
        img = lay(img, ICY, glow(cx, cy, 0.012)*0.7*amp)
    d = np.sqrt(((xx/W-0.5)/0.5)**2*0.8 + ((yy/H-0.5)/0.5)**2*0.9); v = np.clip((d-0.55)/0.75, 0, 1)**1.6*0.65
    img = lay(img, COFFEE*0.45, v)
    img += np.random.default_rng(seed).normal(0, 5, (H, W))[..., None]
    p = f'{OUT}/{name}.png'
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(p, optimize=True)
    print(name, os.path.getsize(p)//1024, 'KB')
def box(x0, y0, x1, y1, soft=0.04, floor=0.12):     # quieter ripples inside a text/card box (slide-fraction coords)
    xs, ys = xx/W, yy/H
    inside = np.clip(np.minimum.reduce([(xs-x0)/soft, (x1-xs)/soft, (ys-y0)/soft, (y1-ys)/soft]), 0, 1)
    return 1 - (1-floor)*inside
# title: three epicentres, the strongest behind the right half
make('w_title', (0.30, 0.50, 0.55), (0.85, 0.80, 0.35), [(0.78, 0.42, 0.0, 1.0), (0.97, 0.90, 0.3, 0.8), (0.55, 0.95, 0.6, 0.6)],
     quiet=box(0.04, 0.12, 0.62, 0.55, floor=0.35)*box(0.04, 0.56, 0.95, 0.86, floor=0.3), seed=1)
make('w_end', (0.75, 0.25, 0.5), (0.10, 0.95, 0.35), [(0.95, 0.12, 0.2, 1.0), (0.05, 0.98, 0.5, 0.7)],
     quiet=box(0.04, 0.22, 0.96, 0.9, floor=0.18), seed=2)
# content slides: epicentres in corners, ripples quiet behind header text and the chart card
def content(name, srcs, gu, gc, seed):
    make(name, gu, gc, srcs, quiet=box(0.04, 0.05, 0.96, 0.31, floor=0.25)*box(0.04, 0.31, 0.96, 0.9, floor=0.0), seed=seed)
content('w_c1', [(1.00, 0.95, 0.0, 1.0), (0.02, 0.05, 0.5, 0.6)], (0.85, 0.70, 0.5), (0.10, 0.05, 0.35), 11)
content('w_c2', [(0.98, 0.05, 0.2, 1.0), (0.04, 0.98, 0.7, 0.7)], (0.15, 0.80, 0.5), (0.90, 0.10, 0.35), 12)
content('w_c3', [(0.50, 1.05, 0.4, 1.0), (1.02, 0.30, 0.1, 0.6)], (0.50, 0.95, 0.6), (0.95, 0.20, 0.3), 13)
