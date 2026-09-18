#!/usr/bin/env python3
"""Monta a peça do hero: render com as capturas REAIS encaixadas nas telas.

Como funciona, de ponta a ponta:

1. O render sai do gerador (codex, conta visionxma) com cada tela pintada numa
   cor de chroma diferente — verde no monitor, vermelho no notebook, azul no
   tablet, magenta no celular. O prompt exige cor CHAPADA, sem reflexo e sem
   gradiente: é o que permite achar a tela com uma regra de canal.
2. Para cada chroma, os quatro cantos da tela são medidos pelo ponto da máscara
   mais próximo de cada canto da caixa. Pegar extremos de (x+y)/(x-y) devolve o
   mesmo canto duas vezes em forma retangular — erro que já custou uma rodada.
3. A captura entra por `Image.PERSPECTIVE` com a matriz resolvida nesses quatro
   cantos. Num render frontal ela é quase a identidade, então a nitidez da
   captura chega inteira.
4. O fundo preto vira alfa por rampa de luminância (0 abaixo de 6, 1 acima de
   22), o que preserva a sombra de contato como semitransparência em vez de
   recortá-la fora.

Por que render e não CSS: bezel de `border` é tira de cor chapada, sem chanfro
nem reflexo de metal — o Victor reprovou em 18/09/2026. O render anterior tinha
sido reprovado em 17/09 por borda mole, e a causa era resolução, não método:
esta peça sai em 1774px para ser exibida em 790 (2,2x).

Uso:
    cd /tmp/peca4 && python3 peca-hero.py     # espera peca4.png no diretório
"""
import numpy as np
from PIL import Image

PECA = Image.open('peca4.png').convert('RGB')
W, H = PECA.size
a = np.asarray(PECA).astype(np.int16)
R, G, B = a[:, :, 0], a[:, :, 1], a[:, :, 2]

verde    = (G > 140) & (R < 110) & (B < 110)
vermelho = (R > 140) & (G < 110) & (B < 110)
azul     = (B > 140) & (R < 110) & (G < 110)
magenta  = (R > 140) & (B > 140) & (G < 110)

def cantos(mask):
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    # Para cada canto da caixa, o ponto da máscara mais PRÓXIMO dele. Em forma
    # retangular isso devolve os quatro cantos de verdade; pegar extremos de
    # (x+y)/(x-y) devolveria o mesmo ponto duas vezes.
    alvos = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
    saida = []
    for (ax, ay) in alvos:
        d = (xs - ax) ** 2 + (ys - ay) ** 2
        i = int(np.argmin(d))
        saida.append((float(xs[i]), float(ys[i])))
    return saida, (x0, y0, x1, y1)

def coef(origem, destino):
    """8 coeficientes para Image.PERSPECTIVE: destino(saida) -> origem(entrada)."""
    A, Bv = [], []
    for (xd, yd), (xs_, ys_) in zip(destino, origem):
        A.append([xd, yd, 1, 0, 0, 0, -xs_ * xd, -xs_ * yd]); Bv.append(xs_)
        A.append([0, 0, 0, xd, yd, 1, -ys_ * xd, -ys_ * yd]); Bv.append(ys_)
    return np.linalg.solve(np.array(A, float), np.array(Bv, float))

def dilatar(mask, n=2):
    """Engorda a máscara em n pixels. Sem isso sobra um fio da cor de chroma na
    borda da tela — o halo verde/magenta que denuncia a montagem."""
    m = mask.copy()
    for _ in range(n):
        m = (m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1))
    return m

def encaixar(base, mask, captura, foco=(0.5, 0.0)):
    mask = dilatar(mask, 2)
    quad, caixa = cantos(mask)
    x0, y0, x1, y1 = caixa
    lw, lh = x1 - x0 + 1, y1 - y0 + 1
    im = Image.open(captura).convert('RGB')
    # cover: cobre a caixa da tela e corta o excedente no ponto de foco
    esc = max(lw / im.width, lh / im.height)
    nova = im.resize((max(1, round(im.width * esc)), max(1, round(im.height * esc))), Image.LANCZOS)
    ox = int((nova.width - lw) * foco[0]); oy = int((nova.height - lh) * foco[1])
    nova = nova.crop((ox, oy, ox + lw, oy + lh))
    # a captura vai para o quadrilátero da tela
    destino = [(0, 0), (lw - 1, 0), (lw - 1, lh - 1), (0, lh - 1)]
    origem = [(x - x0, y - y0) for (x, y) in quad]
    c = coef(origem, destino)
    warp = nova.transform((lw, lh), Image.PERSPECTIVE, tuple(c), Image.BICUBIC)
    m = Image.fromarray((mask[y0:y1 + 1, x0:x1 + 1] * 255).astype('uint8'))
    base.paste(warp, (x0, y0), m)
    return caixa

base = PECA.copy()
A = '/Users/victorgabryellferreiraqueiroz/BACKUP_VICTOR/Projetos/VISIONX/SOFTPAY LP/public/assets/sistema/'
print('monitor ', encaixar(base, verde,    A + 'pdv.webp',              foco=(0.5, 0.0)))
print('notebook', encaixar(base, vermelho, A + 'estoque.webp',          foco=(0.5, 0.0)))
print('tablet  ', encaixar(base, azul,     A + 'tablet-financeiro.webp', foco=(0.5, 0.0)))
print('celular ', encaixar(base, magenta,  A + 'celular-carrinho.webp', foco=(0.5, 0.0)))

# ---- fundo preto vira transparência, com rampa para preservar a sombra ----
arr = np.asarray(base).astype(np.float32)
lum = arr.max(axis=2)                     # o metal escuro ainda tem canal alto
alpha = np.clip((lum - 6.0) / 16.0, 0, 1)  # 0 abaixo de 6, 1 acima de 22
# tudo que é tela (chroma original) é opaco de qualquer jeito
alpha[verde | vermelho | azul | magenta] = 1.0
out = np.dstack([arr, alpha * 255]).astype('uint8')
Image.fromarray(out, 'RGBA').save('peca4-composta.png')
print('salvo peca4-composta.png', base.size)
