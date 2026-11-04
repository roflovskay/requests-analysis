import sys, os
src=open(sys.argv[1]).read().split("out=sys.argv[1]")[0]
exec(src)
from PIL import Image
out=sys.argv[2]
INK2,VIO,CRIM,SAGE=hx('1B1422'),hx('8B729C'),hx('E20942'),hx('A6B8A0')
def mk(name, glows, seed):
    p=f'{out}/{name}.png'
    make(p, INK2, glows, vig=0.6, vigcol=INK2*0.4, grain=5, seed=seed)
    im=Image.open(p).quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    im.save(p, optimize=True); print(name, os.path.getsize(p)//1024)
V=VIO*0.85+INK2*0.15
mk('title',  [(0.30,0.48,0.6,0.6,V,0.7),(0.86,0.88,0.16,0.18,CRIM,0.18)], 21)
mk('left',   [(0.27,0.52,0.42,0.6,V,0.62)], 22)
mk('right',  [(0.72,0.52,0.42,0.62,V,0.62)], 23)
mk('center', [(0.50,0.56,0.40,0.55,V,0.65)], 24)
mk('two',    [(0.27,0.55,0.32,0.5,V,0.62),(0.74,0.55,0.30,0.45,SAGE*0.35+INK2*0.65,0.5)], 25)
mk('top',    [(0.35,0.30,0.6,0.5,V,0.5)], 26)
