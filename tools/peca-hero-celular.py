#!/usr/bin/env python3
"""Peça da hero do CELULAR: monitor + celular com as telas do sistema encaixadas.

Fonte: assets-fonte/hero/aparelhos-2-chroma.png — render do codex (18/09/2026)
com a tela do monitor em verde puro e a do celular em magenta puro.

O que vai em cada tela (refeito em 19/09/2026, "deixe perfeito"):
· MONITOR — o PDV INTEIRO (public/assets/sistema/pdv.webp, 1400x845), só com a
  faixa de rodapé cortada para bater a proporção da tela (1,69). A versão
  anterior usava um recorte do meio do PDV (pdv-celular.webp) que cortava
  cartões de produto na esquerda e preços do carrinho na direita. Tela
  inteira é o que um monitor de verdade mostra; nada fica partido na borda.
· CELULAR — o painel do carrinho recortado do mesmo PDV, da borda do painel
  (x=1036) até o fim, com uma faixa branca no alto para o entalhe da câmera não
  cobrir o título "Carrinho". A captura anterior (celular-carrinho.webp) já
  vinha cortada na esquerda — ícone e números dos itens pela metade.

As duas telas mostram a MESMA venda (R$ 414,60): no balcão e no celular.

Encaixe: máscara do chroma engordada 2px (senão sobra fio colorido na borda),
cantos medidos pelo ponto da máscara mais próximo de cada canto da caixa,
captura redimensionada em LANCZOS e colada por perspectiva. O fundo preto vira
alfa por rampa de luminância, preservando a sombra de contato.

Saída: public/assets/hero/aparelhos-2.webp (1448) e aparelhos-2-1200.webp.
Uso: python3 tools/peca-hero-celular.py   (Pillow + numpy)
"""
import pathlib
import numpy as np
from PIL import Image, ImageFilter

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CHROMA = RAIZ / 'assets-fonte/hero/aparelhos-2-chroma.png'
CAP = RAIZ / 'assets-fonte/hero/capturas'
PDV = CAP / 'pdv-1152-dpr2.png'          # 2304x1364 — PDV a 1152px (interface maior na tela pequena)
CARRINHO = CAP / 'carrinho-390-dpr3.png'  # 1170x2532 — carrinho no layout de celular, densidade 3
SAIDA = RAIZ / 'public/assets/hero'

def dilatar(m, n=2):
    for _ in range(n):
        m = m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1)
    return m

def cantos(mask):
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    out = []
    for ax, ay in [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]:
        i = int(np.argmin((xs - ax) ** 2 + (ys - ay) ** 2)); out.append((float(xs[i]), float(ys[i])))
    return out, (int(x0), int(y0), int(x1), int(y1))

def coef(origem, destino):
    A, B = [], []
    for (xd, yd), (xs, ys) in zip(destino, origem):
        A.append([xd, yd, 1, 0, 0, 0, -xs * xd, -xs * yd]); B.append(xs)
        A.append([0, 0, 0, xd, yd, 1, -ys * xd, -ys * yd]); B.append(ys)
    return np.linalg.solve(np.array(A, float), np.array(B, float))

def encaixar(base, mask, tela):
    mask = dilatar(mask)
    quad, (x0, y0, x1, y1) = cantos(mask)
    lw, lh = x1 - x0 + 1, y1 - y0 + 1
    # cobre a caixa exatamente: a tela já vem na proporção certa
    # a redução é grande (o PDV inteiro cabe num monitor de 253px na página):
    # sem realce, o traço fino da fonte some e a tela vira mancha cinza
    img = tela.resize((lw, lh), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.1, percent=85, threshold=2))
    c = coef([(x - x0, y - y0) for x, y in quad], [(0, 0), (lw - 1, 0), (lw - 1, lh - 1), (0, lh - 1)])
    warp = img.transform((lw, lh), Image.PERSPECTIVE, tuple(c), Image.BICUBIC)
    base.paste(warp, (x0, y0), Image.fromarray((mask[y0:y1 + 1, x0:x1 + 1] * 255).astype('uint8')))
    return lw, lh

def main():
    peca = Image.open(CHROMA).convert('RGB')
    a = np.asarray(peca).astype(np.int16); R, G, B = a[..., 0], a[..., 1], a[..., 2]
    verde = (G > 150) & (R < 120) & (B < 120)
    magenta = (R > 150) & (B > 150) & (G < 120)
    pdv = Image.open(PDV).convert('RGB')                       # 2880x1704

    # MONITOR: PDV inteiro, cortando só o rodapé até a proporção da tela
    _, (x0, y0, x1, y1) = cantos(dilatar(verde)); prop = (x1 - x0 + 1) / (y1 - y0 + 1)
    monitor = pdv.crop((0, 0, pdv.width, min(pdv.height, round(pdv.width / prop))))

    # CELULAR: o carrinho no layout de CELULAR do próprio sistema (capturado a
    # 390px, densidade 3), sem a sombra da gaveta na borda esquerda e com uma
    # faixa no alto para o entalhe da câmera não cobrir o "4 itens"
    _, (x0, y0, x1, y1) = cantos(dilatar(magenta)); prop_c = (x1 - x0 + 1) / (y1 - y0 + 1)
    car = Image.open(CARRINHO).convert('RGB')
    car = car.crop((20, 0, car.width, car.height))
    # a captura é um pouco mais alta que a proporção da tela: ela entra pela
    # ALTURA (nada do rodapé do carrinho — Limpar e Finalizar — fica de fora) e
    # sobra uma margem estreita dos lados, na cor do fundo do painel
    larg = car.width; alto = round(larg / prop_c)
    faixa = round(alto * 0.045)
    esc = (alto - faixa) / car.height
    car2 = car.resize((round(car.width * esc), alto - faixa), Image.LANCZOS)
    celular = Image.new('RGB', (larg, alto), car.getpixel((car.width // 2, 8)))
    celular.paste(car2, ((larg - car2.width) // 2, faixa))

    base = peca.copy()
    print('monitor', encaixar(base, verde, monitor), 'de', monitor.size)
    print('celular', encaixar(base, magenta, celular), 'de', celular.size)

    arr = np.asarray(base).astype(np.float32)
    alpha = np.clip((arr.max(axis=2) - 6.0) / 16.0, 0, 1)
    alpha[dilatar(verde) | dilatar(magenta)] = 1.0
    final = Image.fromarray(np.dstack([arr, alpha * 255]).astype('uint8'), 'RGBA')
    final.save(SAIDA / 'aparelhos-2.webp', quality=88, method=6)
    menor = final.resize((1200, round(1200 * final.height / final.width)), Image.LANCZOS)
    rgb = Image.merge('RGB', menor.split()[:3]).filter(ImageFilter.UnsharpMask(radius=0.8, percent=60, threshold=2))
    menor = Image.merge('RGBA', (*rgb.split(), menor.split()[3]))
    menor.save(SAIDA / 'aparelhos-2-1200.webp', quality=90, method=6)
    final.save('/tmp/peca2-final.png')
    print('ok')

if __name__ == '__main__':
    main()
