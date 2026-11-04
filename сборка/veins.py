# Generative leaf-vein backgrounds for presentation 2 (palette: A6B8A0 / 8B729C / E20942)
import numpy as np, math, sys, os
from PIL import Image, ImageDraw, ImageFilter
from scipy.spatial import cKDTree
SCALE = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
W, H = int(3840*SCALE), int(2160*SCALE)
OUT = sys.argv[1]
def hx(h): return np.array([int(h[i:i+2],16) for i in (0,2,4)], np.float32)
INK, VIO, CRIM, SAGE, LIL = hx('1B1422'), hx('8B729C'), hx('E20942'), hx('A6B8A0'), hx('E6DDEC')
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
def blur(a, r): return np.asarray(Image.fromarray(a).filter(ImageFilter.GaussianBlur(r)), np.float32)
def network(n, seed, width):
    # Voronoi cell borders (leaf areoles), computed at half res then upscaled
    h, w = H//2, W//2
    rng = np.random.default_rng(seed); pts = rng.random((n, 2)) * [w, h]
    g = np.stack(np.mgrid[0:h, 0:w][::-1], -1).reshape(-1, 2).astype(np.float32)
    d, _ = cKDTree(pts).query(g, k=2)
    e = np.clip(1 - (d[:, 1] - d[:, 0]) / width, 0, 1).reshape(h, w).astype(np.float32)
    return np.asarray(Image.fromarray(e).resize((W, H), Image.BILINEAR), np.float32)
def veins(origin, direction, length, width, seed, depth=3, spread=0.75):
    # leaf-like hierarchy: a curved main vein, secondary veins at regular intervals on alternating sides,
    # a few tertiary veins; each branch bends gently towards the parent's direction
    img = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(img); rng = np.random.default_rng(seed)
    NB = {3: 7, 2: 4, 1: 2, 0: 0}
    def grow(x, y, ang, L, wd, d, bend):
        steps = max(8, int(L / (10*SCALE))); seg = L / steps; pts = [(x, y)]
        nb = NB.get(d, 0); marks = set(int(steps*(0.15 + 0.75*k/max(1, nb))) for k in range(nb)) if nb else set()
        side = 1 if rng.random() < 0.5 else -1
        for i in range(steps):
            ang += bend + rng.normal(0, 0.012); x += math.cos(ang)*seg; y += math.sin(ang)*seg; pts.append((x, y))
            if i in marks:
                a2 = ang + side*(spread + rng.normal(0, 0.08))
                grow(x, y, a2, L*(0.38 + 0.12*rng.random())*(1 - 0.45*i/steps), max(1.0, wd*0.5), d-1, -side*0.004/SCALE**0)
                side = -side
        for k in range(len(pts)-1):
            ww = max(1, int(round(wd*(1 - 0.75*k/len(pts)))))
            dr.line([pts[k], pts[k+1]], fill=255, width=ww)
    lens = length if isinstance(length, (list, tuple)) else [length]*len(origin)
    for o, a, ln in zip(origin, direction, lens):
        grow(o[0]*W, o[1]*H, a, ln*W, width*SCALE*4, depth, 0.0008)
    return np.asarray(img.filter(ImageFilter.GaussianBlur(0.6*SCALE*4)), np.float32) / 255
def converge(fx, fy, n, seed, reach=0.75, width=7):
    # veins start at the slide edges and run towards a focal point, stopping just short of it
    rng = np.random.default_rng(seed); org, dirs, lens = [], [], []
    for i in range(n):
        t = i / n * 2*math.pi + rng.normal(0, 0.2)
        ox, oy = fx + math.cos(t)*0.75, fy + math.sin(t)*0.75*1.1
        ox, oy = min(max(ox, -0.02), 1.02), min(max(oy, -0.03), 1.03)
        dx, dy = (fx-ox)*W, (fy-oy)*H; dist = math.hypot(dx, dy)/W
        org.append((ox, oy)); dirs.append(math.atan2(dy, dx)); lens.append(max(0.1, dist - 0.11))
    return veins(org, dirs, lens, width, seed, depth=2, spread=0.75)
def compose(name, art_mask, major, glow_xy=None, sage_amt=0.10, seed=1):
    img = np.ones((H, W, 3), np.float32) * INK
    # soft violet light behind the focal area
    if glow_xy:
        gx, gy, r = glow_xy
        m = np.exp(-(((xx-gx*W)/(r*W))**2 + ((yy-gy*H)/(r*H*1.2))**2)*2.2)*0.55
        img = img*(1-m[..., None]) + (VIO*0.8+INK*0.2)*m[..., None]
    fine = network(int(2600*SCALE**0) , seed, 1.6) ; coarse = network(260, seed+1, 3.2)
    # sage patches (low-frequency noise), like the pale areas of the leaf
    rng = np.random.default_rng(seed+2)
    patch = blur((rng.random((H//16, W//16))*255).astype(np.uint8), 3)/255
    patch = np.asarray(Image.fromarray((patch*255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32)/255
    patch = np.clip((patch-0.5)*3, 0, 1)
    A = art_mask
    def lay(color, alpha):
        nonlocal img
        a = np.clip(alpha*A, 0, 1)[..., None]; img = img*(1-a) + color*a
    lay(SAGE, patch*sage_amt)
    lay(VIO*1.15, fine*0.26)
    lay(LIL*0.7+VIO*0.3, coarse*0.24)
    g1 = blur((major*255).astype(np.uint8), 30*SCALE)/255; g2 = blur((major*255).astype(np.uint8), 6*SCALE)/255
    lay(CRIM, np.clip(g1*1.2, 0, 1)*0.22)
    lay(CRIM*0.9+LIL*0.1, np.clip(g2*1.2, 0, 1)*0.45)
    lay(CRIM*0.75+LIL*0.25, np.clip(major*1.3, 0, 1)*0.9)
    # vignette + grain
    d = np.sqrt(((xx-W/2)/(W/2))**2*0.8 + ((yy-H/2)/(H/2))**2*0.9); v = np.clip((d-0.55)/0.75, 0, 1)**1.6*0.55
    img = img*(1-v[..., None]) + INK*0.4*v[..., None]
    img += np.random.default_rng(seed+3).normal(0, 4.5, (H, W))[..., None]
    p = f'{OUT}/{name}.png'
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(p, optimize=True)
    print(name, os.path.getsize(p)//1024, 'KB')
def ramp(x0, x1, axis):  # 0 -> 1 between x0 and x1 along axis
    t = (xx/W if axis == 'x' else yy/H); return np.clip((t-x0)/(x1-x0), 0, 1)**1.3
# title: midrib sweeping in from the lower right, art on the right 60%
compose('vtitle', 0.25 + 0.75*ramp(0.25, 0.75, 'x'),
        veins([(1.04, 0.98)], [math.radians(-158)], 0.82, 5, 5, depth=3), glow_xy=(0.72, 0.55, 0.45), sage_amt=0.14, seed=11)
# right edge (photo frame side / right diagrams)
compose('vedge_r', 0.08 + 0.92*ramp(0.55, 0.98, 'x'),
        veins([(1.02, 0.62)], [math.radians(192)], 0.42, 3.5, 7, depth=3), glow_xy=(0.8, 0.5, 0.35), seed=21)
# bottom edge (text-heavy slides)
compose('vedge_b', 0.05 + 0.75*ramp(0.62, 1.0, 'y'),
        veins([(1.03, 0.97)], [math.radians(-172)], 0.62, 3, 9, depth=3), glow_xy=(0.35, 0.3, 0.55), sage_amt=0.07, seed=31)
# converging on the shared-solution circle (slide 18) and the work-environment circle (slide 28)
def cmask(fx, fy, inner=0.12):
    d = np.sqrt(((xx/W-fx))**2 + ((yy/H-fy)*H/W)**2); return 0.1 + 0.9*np.clip((d-inner)/0.25, 0, 1)
compose('vconv18', cmask(0.709, 0.433, 0.16)*np.clip(0.2 + ramp(0.42, 0.62, 'x'), 0, 1), converge(0.709, 0.433, 7, 41, 0, 3.4), glow_xy=(0.709, 0.433, 0.3), seed=41)
compose('vconv28', cmask(0.70, 0.53, 0.16)*np.clip(0.2 + ramp(0.42, 0.62, 'x'), 0, 1), converge(0.70, 0.53, 7, 51, 0, 3.4), glow_xy=(0.70, 0.53, 0.3), seed=51)
# centre: veins from the four corners towards the middle, kept away from the content block
compose('vconvC', 0.1 + 0.9*np.clip((np.sqrt(((xx/W-0.5))**2 + ((yy/H-0.55)*0.56)**2)-0.3)/0.25, 0, 1),
        converge(0.5, 0.55, 8, 61, 0, 3.0), glow_xy=(0.5, 0.56, 0.4), seed=61)
compose('vedge_bl', 0.05 + 0.75*ramp(0.62, 1.0, 'y'),
        veins([(-0.03, 0.96)], [math.radians(-9)], 0.62, 3, 19, depth=3), glow_xy=(0.62, 0.3, 0.55), sage_amt=0.07, seed=71)
