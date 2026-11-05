# Generative topographic backgrounds for presentation 1 ("маршрут через Альпы").
# Palette: ink 0D1F2D, blue 2A72A3, ice C6D8E6, coral F97279.
import numpy as np, math, sys, os
from PIL import Image, ImageDraw, ImageFilter
SCALE = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
W, H = int(3840*SCALE), int(2160*SCALE); OUT = sys.argv[1]
def hx(h): return np.array([int(h[i:i+2],16) for i in (0,2,4)], np.float32)
INK, BLUE, ICE, CORAL = hx('0D1F2D'), hx('2A72A3'), hx('C6D8E6'), hx('F97279')
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); X, Y = xx/W, yy/H
def fbm(seed, octaves=5, base=3):
    rng = np.random.default_rng(seed); h = np.zeros((H, W), np.float32); amp = 1.0
    for o in range(octaves):
        n = base * 2**o
        g = rng.random((max(2, int(n*H/W))+1, n+1)).astype(np.float32)
        h += amp*np.asarray(Image.fromarray(g, 'F').resize((W, H), Image.BICUBIC), np.float32); amp *= 0.5
    return (h - h.min())/(h.max() - h.min())
def bump(cx, cy, r): return np.exp(-(((X-cx)/r)**2 + ((Y-cy)*H/W/r)**2))
def contours(h, n, width):
    v = h*n; f = np.abs(v - np.round(v))
    gy, gx = np.gradient(v); g = np.sqrt(gx**2 + gy**2) + 1e-4
    line = np.clip(1 - f/(g*width*SCALE*4), 0, 1)
    idx = (np.round(v).astype(int) % 5 == 0).astype(np.float32)      # every 5th line = index contour
    return line, idx
def route(pts, dash=True, width=9):
    img = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(img)
    P = [(p[0]*W, p[1]*H) for p in pts]; P = [P[0]] + P + [P[-1]]; curve = []
    for i in range(1, len(P)-2):                                    # Catmull-Rom spline
        p0, p1, p2, p3 = map(np.array, P[i-1:i+3])
        for t in np.linspace(0, 1, 40, endpoint=False):
            curve.append(0.5*((2*p1) + (-p0+p2)*t + (2*p0-5*p1+4*p2-p3)*t*t + (-p0+3*p1-3*p2+p3)*t**3))
    curve.append(np.array(P[-2])); acc = 0; on = True; step = 20*SCALE*4
    for a, b in zip(curve[:-1], curve[1:]):
        seg = np.linalg.norm(b-a); acc += seg
        if acc > step: acc = 0; on = not on
        if on or not dash: dr.line([tuple(a), tuple(b)], fill=255, width=max(1, int(width*SCALE*4/4*1.0)))
    for p in pts[1:-1]:
        r = 7*SCALE*4/4*2; dr.ellipse([p[0]*W-r, p[1]*H-r, p[0]*W+r, p[1]*H+r], fill=255)
    e = pts[-1]; r = 16*SCALE*4/4*2
    dr.ellipse([e[0]*W-r, e[1]*H-r, e[0]*W+r, e[1]*H+r], outline=255, width=max(1, int(4*SCALE*4/4*1.5)))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(0.7*SCALE*4)), np.float32)/255
def blur(a, r): return np.asarray(Image.fromarray((np.clip(a, 0, 1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), np.float32)/255
def compose(name, h, mask, glow=None, rt=None, n=26, seed=1):
    if os.environ.get('ONLY') and name not in os.environ['ONLY'].split(','): return
    img = np.ones((H, W, 3), np.float32)*INK
    if glow:
        gx, gy, r = glow; m = np.exp(-(((X-gx)/r)**2 + ((Y-gy)/(r*1.25))**2)*2.2)*0.7
        img = img*(1-m[..., None]) + BLUE*m[..., None]
    line, idx = contours(h, n, 1.25)
    def lay(color, a):
        nonlocal img; a = np.clip(a, 0, 1)[..., None]; img = img*(1-a) + color*a
    lay(BLUE*0.5+ICE*0.5, line*(1-idx)*0.40*mask)
    lay(ICE, line*idx*0.62*mask)
    if rt is not None:
        lay(CORAL, blur(rt, 14*SCALE*4/4*2)*0.8)
        lay(CORAL, np.clip(rt*1.4, 0, 1))
    d = np.sqrt(((X-0.5)/0.5)**2*0.8 + ((Y-0.5)/0.5)**2*0.9); v = np.clip((d-0.55)/0.75, 0, 1)**1.6*0.6
    img = img*(1-v[..., None]) + INK*0.4*v[..., None]
    img += np.random.default_rng(seed).normal(0, 4.5, (H, W))[..., None]
    p = f'{OUT}/{name}.png'
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(p, optimize=True)
    print(name, os.path.getsize(p)//1024, 'KB')
def ramp(a, b, t): return np.clip((t-a)/(b-a), 0, 1)**1.3
base = fbm(7)
# title: a massif on the right, route climbs from the lower left to the summit
h = 0.45*base + 0.75*bump(0.82, 0.50, 0.22) + 0.35*bump(0.62, 0.78, 0.16)
compose('ttitle', h, 0.35 + 0.65*ramp(0.35, 0.75, X), glow=(0.82, 0.50, 0.35),
        rt=route([(0.52, 1.05), (0.58, 0.90), (0.66, 0.80), (0.72, 0.68), (0.78, 0.58), (0.82, 0.51)]), n=40, seed=11)
# peak behind a focal element on the right (client circle, ОРГАНИЗМ, ≈100)
h = 0.40*fbm(17) + 0.9*bump(0.79, 0.38, 0.20)
r = np.sqrt(((X-0.79))**2 + ((Y-0.38)*H/W)**2)
compose('tpeak_r', h, np.clip(0.12 + ramp(0.45, 0.75, X)*0.9, 0, 1)*np.clip((r-0.07)/0.06, 0, 1), glow=(0.79, 0.38, 0.3), n=28, seed=21)
# peak in the centre, contours kept to the margins
h = 0.40*fbm(27) + 0.9*bump(0.5, 0.56, 0.3)
r = np.sqrt(((X-0.5))**2 + ((Y-0.56)*0.56)**2)
compose('tpeak_c', h, 0.08 + 0.92*np.clip((r-0.3)/0.22, 0, 1), glow=(0.5, 0.56, 0.4), n=40, seed=31)
# bottom band (text-heavy slides) and bottom-left band (text column on the left, photo frame on the right)
h = 0.6*fbm(37) + 0.5*bump(0.75, 1.0, 0.3)
compose('tedge_b', h, 0.05 + 0.95*ramp(0.58, 0.95, Y), glow=(0.35, 0.3, 0.55), n=44, seed=41)
h = 0.6*fbm(47) + 0.5*bump(0.15, 1.0, 0.3)
compose('tedge_bl', h, np.clip(0.05 + 0.85*ramp(0.6, 1.0, Y) + 0.3*(1-ramp(0.0, 0.12, X)), 0, 1), glow=(0.3, 0.5, 0.45), n=44, seed=51)
