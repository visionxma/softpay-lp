import cv2, numpy as np
from PIL import Image
CW, CH = 240, 832
det = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def cover(im, cw=CW, ch=CH):
    w,h = im.size; s = max(cw/w, ch/h)
    nw,nh = int(w*s+.5), int(h*s+.5)
    im2 = im.resize((nw,nh), Image.LANCZOS)
    return im2.crop(((nw-cw)//2,(nh-ch)//2,(nw-cw)//2+cw,(nh-ch)//2+ch))

def rosto(caminho, painel=None):
    """(largura, centro_x, centro_y) do rosto, medido no painel.
       Busca só na faixa 12%–55% da altura: abaixo disso é tronco, e o
       detector confunde dobra de roupa com rosto."""
    im = Image.open(caminho).convert('RGB') if isinstance(caminho,str) else caminho
    alvo = painel if painel is not None else cover(im)
    a = np.asarray(alvo)
    y0, y1 = int(CH*0.12), int(CH*0.55)
    g = cv2.cvtColor(a[y0:y1], cv2.COLOR_RGB2GRAY)
    g = cv2.equalizeHist(g)
    cands = []
    for esc, viz in ((1.03,6),(1.05,5),(1.08,4),(1.1,3)):
        for (x,y,w,h) in det.detectMultiScale(g, scaleFactor=esc, minNeighbors=viz, minSize=(22,22)):
            cands.append((w, x+w/2, y0+y+h/2))
        if cands: break
    if not cands: return None
    # o rosto da pessoa em primeiro plano é o mais largo entre os detectados
    return max(cands, key=lambda c: c[0])
