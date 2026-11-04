import sys
src=open(sys.argv[1]).read().split("out=sys.argv[1]")[0]
exec(src)
from PIL import Image
import os
out=sys.argv[2]
def mk(name, glows, seed):
    p=f'{out}/{name}.png'
    make(p, INK, glows, vig=0.6, vigcol=INK*0.4, grain=5, seed=seed)
    im=Image.open(p).quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    im.save(p, optimize=True); print(name, os.path.getsize(p)//1024)
mk('title',  [(0.30,0.48,0.6,0.6,BLUE,0.75),(0.86,0.88,0.16,0.18,CORAL,0.16)], 3)
mk('left',   [(0.27,0.52,0.42,0.6,BLUE,0.7)], 11)
mk('right',  [(0.72,0.52,0.42,0.62,BLUE,0.7)], 12)
mk('center', [(0.50,0.56,0.40,0.55,BLUE,0.72)], 13)
mk('two',    [(0.27,0.55,0.32,0.5,BLUE,0.7),(0.74,0.55,0.30,0.45,BLUE*0.6+INK*0.4,0.5)], 4)
mk('top',    [(0.35,0.30,0.6,0.5,BLUE,0.55)], 14)
