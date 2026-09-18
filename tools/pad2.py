import sys; sys.path.insert(0,'/tmp')
import numpy as np
from PIL import Image, ImageOps
from rosto import det, rosto, cover, CW, CH
import cv2

ALVO_W, ALVO_CX, ALVO_CY = 0.42, 0.50, 0.38   # no PAINEL

def acha(im):
    a = np.asarray(im.convert('RGB')); h=a.shape[0]
    y0,y1 = int(h*0.05), int(h*0.62)
    g = cv2.equalizeHist(cv2.cvtColor(a[y0:y1], cv2.COLOR_RGB2GRAY))
    for esc,viz in ((1.03,6),(1.05,5),(1.08,4),(1.1,3),(1.05,2)):
        f = det.detectMultiScale(g, scaleFactor=esc, minNeighbors=viz, minSize=(30,30))
        if len(f):
            x,y,w,hh = max(f, key=lambda r:r[2]); return w, x+w/2, y0+y+hh/2
    return None

def espelha(im, larg, alt):
    """cresce a cena por espelhamento até caber `larg` x `alt`, centrada"""
    w,h = im.size
    bx = max(0, int(np.ceil((larg-w)/2)) + 4)
    by = max(0, int(np.ceil((alt-h)/2)) + 4)
    if bx: 
        bx = min(bx, w-1)
        o = Image.new('RGB',(w+2*bx,h))
        o.paste(ImageOps.mirror(im.crop((0,0,bx,h))),(0,0)); o.paste(im,(bx,0))
        o.paste(ImageOps.mirror(im.crop((w-bx,0,w,h))),(bx+w,0)); im=o; w=im.width
    if by:
        by = min(by, h-1)
        o = Image.new('RGB',(w,h+2*by))
        o.paste(ImageOps.flip(im.crop((0,0,w,by))),(0,0)); o.paste(im,(0,by))
        o.paste(ImageOps.flip(im.crop((0,h-by,w,h))),(0,by+h)); im=o
    return im, bx, by

def gerar(fonte, slug):
    im = Image.open(fonte).convert('RGB')
    r = acha(im)
    if not r: return f'{slug}: rosto não encontrado'
    wF, cxF, cyF = r
    # a faixa que o painel mostra é 38,46% da largura do arquivo 3:4
    faixa = (CW/CH)/(3/4)
    # quero: wF / (L*faixa) = ALVO_W  →  L = wF/(ALVO_W*faixa)
    L = wF/(ALVO_W*faixa)
    A = L*4/3
    # o rosto tem de ficar no centro da FAIXA (que é o centro do recorte)
    # e a ALVO_CY da altura do recorte
    # margem generosa: o recorte tem de caber INTEIRO, senão sobra faixa preta
    prec_l = 2*max(cxF, im.width-cxF) + L
    prec_a = 2*max(cyF, im.height-cyF) + A
    im2, bx, by = espelha(im, prec_l, prec_a)
    cx2, cy2 = cxF+bx, cyF+by
    x0 = cx2 - L/2
    y0 = cy2 - A*ALVO_CY
    # garante que o recorte cabe INTEIRO dentro da imagem
    assert x0 >= -1 and y0 >= -1 and x0+L <= im2.width+1 and y0+A <= im2.height+1, \
        f'{slug}: recorte fora dos limites {x0:.0f},{y0:.0f} {L:.0f}x{A:.0f} em {im2.size}'
    x0 = max(0, min(im2.width-L, x0)); y0 = max(0, min(im2.height-A, y0))
    rec = im2.crop((int(x0),int(y0),int(x0+L),int(y0+A))).resize((1000,1333), Image.LANCZOS)
    for Lp in (500,1000):
        rec.resize((Lp,int(Lp*4/3)), Image.LANCZOS).save(f'assets/lojistas/vitrine/{slug}-{Lp}.webp','WEBP',quality=84,method=6)
    return f'{slug}: recorte {int(L)}x{int(A)} de {im2.size} (espelhou {bx}/{by})'
