import numpy as np, sys, os
from PIL import Image
W,H=3840,2160
def hx(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],dtype=np.float32)
INK,PAPER,ICE,CORAL,BLUE=map(hx,['0D1F2D','F3F6F9','C6D8E6','F97279','2A72A3'])
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
def make(name, base, glows, vig=0.35, vigcol=None, grain=4.0, seed=1):
    img=np.ones((H,W,3),np.float32)*base
    for (cx,cy,rx,ry,col,a) in glows:
        d=((xx-cx*W)/(rx*W))**2+((yy-cy*H)/(ry*H))**2
        m=np.exp(-d*2.2)*a            # soft gaussian light
        img=img*(1-m[...,None])+col*m[...,None]
    # vignette toward edges
    d=np.sqrt(((xx-W/2)/(W/2))**2*0.8+((yy-H/2)/(H/2))**2*0.9)
    v=np.clip((d-0.55)/0.75,0,1)**1.6*vig
    vc=vigcol if vigcol is not None else base*0.55
    img=img*(1-v[...,None])+vc*v[...,None]
    rng=np.random.default_rng(seed)
    g=rng.normal(0,grain,(H,W)).astype(np.float32)
    img+=g[...,None]
    Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save(name, optimize=True)
    print(name, os.path.getsize(name)//1024,'KB')
out=sys.argv[1]
# A: editorial light — cool paper, ice light from the right where arch/photo sits
make(f'{out}/A_title.png', PAPER, [(0.78,0.45,0.55,0.75,ICE,0.85),(0.95,0.05,0.35,0.4,BLUE*0.35+PAPER*0.65,0.35)], vig=0.18, vigcol=ICE*0.8, grain=3)
make(f'{out}/A_content.png', PAPER, [(0.30,0.55,0.55,0.7,ICE,0.55)], vig=0.14, vigcol=ICE*0.85, grain=3, seed=2)
# B: poster dark — ink with blue light behind headline, coral ember at focal point
make(f'{out}/B_title.png', INK, [(0.30,0.48,0.6,0.6,BLUE,0.75),(0.86,0.88,0.16,0.18,CORAL,0.16)], vig=0.6, vigcol=INK*0.4, grain=5, seed=3)
make(f'{out}/B_data.png', INK, [(0.27,0.55,0.32,0.5,BLUE,0.7),(0.74,0.55,0.30,0.45,BLUE*0.6+INK*0.4,0.5)], vig=0.6, vigcol=INK*0.4, grain=5, seed=4)
make(f'{out}/B_photo.png', INK, [(0.70,0.5,0.45,0.65,BLUE,0.6),(0.22,0.38,0.25,0.3,CORAL,0.12)], vig=0.6, vigcol=INK*0.4, grain=5, seed=5)
# C: cyanotype — deep blue field with ice light patches (mesh-like), heavier grain
deep=BLUE*0.55+INK*0.45
make(f'{out}/C_title.png', deep, [(0.72,0.42,0.38,0.55,ICE,0.55),(0.88,0.85,0.25,0.3,BLUE,0.6),(0.15,0.1,0.3,0.3,BLUE,0.5)], vig=0.45, vigcol=INK*0.6, grain=7, seed=6)
make(f'{out}/C_light.png', ICE*0.55+PAPER*0.45, [(0.25,0.5,0.45,0.7,PAPER,0.8),(0.92,0.15,0.3,0.35,ICE*0.8+BLUE*0.2,0.5)], vig=0.2, vigcol=ICE*0.75, grain=5, seed=7)
make(f'{out}/C_photo.png', deep, [(0.30,0.5,0.40,0.6,BLUE,0.7),(0.32,0.45,0.18,0.25,ICE,0.25)], vig=0.45, vigcol=INK*0.6, grain=7, seed=8)
