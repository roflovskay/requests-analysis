# Generative backgrounds: dot-matrix "data field" + soft light + grain. Palette: EDEDE8 C5F9FC 5320C0 4F032E 1D0C13
import numpy as np, sys, os
from PIL import Image, ImageFilter
SC = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
W, H = int(3840*SC), int(2160*SC); OUT = sys.argv[1]
def hx(h): return np.array([int(h[i:i+2],16) for i in (0,2,4)], np.float32)
PARCH, ICY, ULTRA, CRIM, COFFEE = map(hx, ['EDEDE8', 'C5F9FC', '5320C0', '4F032E', '1D0C13'])
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); X, Y = xx/W, yy/H
def glow(cx, cy, rx, ry): return np.exp(-(((X-cx)/rx)**2 + ((Y-cy)/ry)**2)*2.2)
def smooth_noise(seed, cells=10):
    g = np.random.default_rng(seed).random((cells*H//W+2, cells+2)).astype(np.float32)
    return np.asarray(Image.fromarray(g, 'F').resize((W, H), Image.BICUBIC), np.float32)
def dots(step, r):
    # regular dot matrix (like a scatter of measurement points); returns coverage 0..1
    s = step*SC; gx = (xx % s) - s/2; gy = (yy % s) - s/2
    d = np.sqrt(gx**2 + gy**2); return np.clip(r*SC + 0.8 - d, 0, 1)
def gridlines(step, w):
    s = step*SC; gx = np.abs((xx % s) - s/2); gy = np.abs((yy % s) - s/2)
    return np.clip(w*SC + 0.6 - np.minimum(s/2-gx, s/2-gy)*0 - np.minimum(np.abs(gx - s/2), np.abs(gy - s/2)), 0, 1)
def save(img, name, grain, seed):
    img = img + np.random.default_rng(seed).normal(0, grain, (H, W))[..., None]
    p = f'{OUT}/{name}.png'
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(p, optimize=True)
    print(name, os.path.getsize(p)//1024, 'KB')
def lay(img, color, a): a = np.clip(a, 0, 1)[..., None]; return img*(1-a) + color*a
def dark(name, g1, g2, seed):
    img = np.ones((H, W, 3), np.float32)*COFFEE
    G1 = glow(*g1); G2 = glow(*g2)
    img = lay(img, ULTRA, G1*0.85); img = lay(img, CRIM*1.25, G2*0.7)
    n = smooth_noise(seed, 14)
    lit = np.clip(G1*1.2 + G2*0.6, 0, 1)*(0.35 + 0.65*n)
    img = lay(img, ICY, dots(48, 2.4)*(0.10 + 0.55*lit))
    img = lay(img, ICY, gridlines(384, 0.9)*0.07)
    d = np.sqrt(((X-0.5)/0.5)**2*0.8 + ((Y-0.5)/0.5)**2*0.9); v = np.clip((d-0.55)/0.75, 0, 1)**1.6*0.6
    img = lay(img, COFFEE*0.5, v)
    save(img, name, 5, seed)
def light(name, g, mask_center, seed):
    img = np.ones((H, W, 3), np.float32)*PARCH
    G = glow(*g)
    img = lay(img, ICY, G*0.9)                       # icy light spot
    img = lay(img, ULTRA, glow(g[0], g[1], g[2]*0.55, g[3]*0.55)*0.10)   # faint violet core
    n = smooth_noise(seed, 12)
    cx, cy, rx, ry = mask_center
    m = np.clip(((np.abs(X-cx)/rx)**4 + (np.abs(Y-cy)/ry)**4)**0.25 - 1, 0, 0.35)/0.35  # 0 inside content box
    img = lay(img, ULTRA, dots(48, 2.2)*(0.06 + 0.30*m*(0.4 + 0.6*n)))
    img = lay(img, ULTRA, gridlines(384, 0.8)*0.05*m)
    save(img, name, 3, seed)
dark('d_title', (0.30, 0.52, 0.55, 0.6), (0.92, 0.95, 0.35, 0.4), 1)
dark('d_end', (0.78, 0.25, 0.45, 0.55), (0.12, 0.98, 0.35, 0.35), 2)
light('l_right', (0.85, 0.35, 0.45, 0.6), (0.5, 0.55, 0.47, 0.36), 3)
light('l_left', (0.12, 0.70, 0.45, 0.6), (0.5, 0.55, 0.47, 0.36), 4)
