#!/usr/bin/env python3
"""Celular de frente com os relatórios do SoftPay — as duas peças da página
/campanha/pdv/ que na referência (muvypdv.com.br) são o celular do app deles:

· HERO (1432x1068): o celular grande, cortado pela base, com dois cartões
  flutuando — um atrás dele, no alto à esquerda (o número do faturamento), e um na
  frente, embaixo à direita (o caixa ágil). Mesmos objetos e mesma disposição da
  referência, com a nossa cor e dados de verdade da loja de demonstração.
· DORES (1245x1252): o mesmo celular, maior, sobre um painel claro, cortado pela base.

Fonte do aparelho: assets-fonte/hero/fone-prata-chroma.png (render do codex,
25/09/2026, celular prateado de FRENTE com a tela em verde puro), ampliado 4x pelo
Real-ESRGAN para fone-prata-chroma-x4.png (fora do git). Tela de frente entra RETA
(regra tela-de-aparelho-de-frente-nao-entorta).

A tela é uma captura REAL do sistema no layout de celular (argumento 1): o Relatório
Financeiro da loja de demonstração (Financeiro > Resumo, rolado até o relatório),
tirada em 25/09/2026 com tools/app/capturar-tela.mjs (entrar antes com tools/app/entrar.mjs). Por cima dela só entra
a barra de status do aparelho (hora e ícones), que a captura do navegador não tem.
Os números dos cartões são da mesma tela (Pix: R$ 8.528,90 em 51 vendas).

Uso: uv run --with numpy --with pillow --with scipy --with fonttools --with brotli \\
       python tools/peca-celular-relatorios.py [captura-390-dpr3.png]
"""
import io
import pathlib
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CHROMA4 = RAIZ / 'assets-fonte/hero/fone-prata-chroma-x4.png'
CAP = RAIZ / 'assets-fonte/hero/capturas'
SAIDA = RAIZ / 'public/campanha/pdv/images'
CAPTURA = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else CAP / 'relatorios-390-dpr3.png'

NOITE, TINTA, AZUL, MARCA, CLARO = (6, 18, 31), (10, 26, 40), (12, 92, 158), (29, 161, 242), (232, 243, 251)
BORDA = (127, 200, 245)


def fonte(peso, tam):
    from fontTools.ttLib import TTFont
    t = TTFont(RAIZ / f'public/fontes/softpay-texto-{peso}-v1.woff2')
    t.flavor = None
    b = io.BytesIO(); t.save(b); b.seek(0)
    return ImageFont.truetype(b, tam)


def barra_de_status(w, h, fundo):
    """Hora à esquerda, sinal/wi-fi/bateria à direita, na cor que contrasta com o topo da tela."""
    im = Image.new('RGB', (w, h), fundo)
    d = ImageDraw.Draw(im)
    escuro = sum(fundo) < 380
    cor = (255, 255, 255) if escuro else TINTA
    f = fonte(600, int(h * .46))
    d.text((int(w * .07), h // 2), '9:41', font=f, fill=cor, anchor='lm')
    x = int(w * .93); cy = h // 2; u = h / 10
    # bateria
    bw, bh = int(u * 5.2), int(u * 2.6)
    d.rounded_rectangle((x - bw, cy - bh // 2, x, cy + bh // 2), radius=int(u * .7), outline=cor, width=max(2, int(u * .35)))
    d.rectangle((x - bw + int(u * .7), cy - bh // 2 + int(u * .7), x - int(u * 1.6), cy + bh // 2 - int(u * .7)), fill=cor)
    x -= bw + int(u * 1.6)
    # wi-fi (três arcos)
    for k, r in enumerate((u * 2.6, u * 1.8, u * 1.0)):
        d.arc((x - r, cy - r + u * 1.2, x + r, cy + r + u * 1.2), 225, 315, fill=cor, width=max(2, int(u * .45)))
    x -= int(u * 4.2)
    # sinal (quatro barras)
    for k in range(4):
        bx = x - (3 - k) * int(u * 1.1)
        d.rectangle((bx, cy + u * 1.2 - (k + 1) * u * .65, bx + int(u * .7), cy + u * 1.2), fill=cor)
    return im


def celular(captura):
    base = Image.open(CHROMA4).convert('RGB')
    a = np.asarray(base).astype(np.int16)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    verde = (G > 150) & (R < 140) & (B < 140) & (G - R > 60)
    lab, n = ndimage.label(verde)
    maior = 1 + int(np.argmax(ndimage.sum(verde, lab, range(1, n + 1))))
    tela_m = lab == maior
    # o furo da câmera fica FORA da máscara: a captura passa por baixo dele
    ys, xs = np.nonzero(tela_m)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    w, h = x1 - x0 + 1, y1 - y0 + 1

    cap = Image.open(captura).convert('RGB')
    topo = cap.getpixel((cap.width // 2, 4))
    sb = round(h * .05)
    corpo = cap.resize((w, round(cap.height * w / cap.width)), Image.LANCZOS)
    tela = Image.new('RGB', (w, h), (244, 247, 250))
    tela.paste(barra_de_status(w, sb, topo), (0, 0))
    tela.paste(corpo, (0, sb))
    tela = tela.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    m = ndimage.binary_dilation(tela_m, iterations=3)
    base.paste(tela, (int(x0), int(y0)), Image.fromarray((m[y0:y1 + 1, x0:x1 + 1] * 255).astype('uint8')))

    arr = np.asarray(base).astype(np.float32)
    alpha = np.clip((arr.max(axis=2) - 8.0) / 14.0, 0, 1)
    corpo_m = ndimage.binary_dilation(arr.max(axis=2) > 40, iterations=3)
    alpha = np.where(corpo_m, alpha, 0)
    solido = ndimage.binary_fill_holes(corpo_m)
    alpha = np.where(ndimage.binary_erosion(solido, iterations=5), 1.0, alpha)
    rgba = Image.fromarray(np.dstack([arr, alpha * 255]).astype('uint8'), 'RGBA')
    ys, xs = np.nonzero(alpha > .05)
    return rgba.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def icone_tendencia(d, cx, cy, r, cor):
    w = max(4, int(r * .16))
    pts = [(cx - r * .55, cy + r * .28), (cx - r * .12, cy - r * .12), (cx + r * .12, cy + r * .12), (cx + r * .55, cy - r * .32)]
    d.line(pts, fill=cor, width=w, joint='curve')
    d.line([(cx + r * .2, cy - r * .34), (cx + r * .57, cy - r * .34), (cx + r * .57, cy + r * .02)], fill=cor, width=w, joint='curve')


def icone_raio(d, cx, cy, r, cor):
    s = r * .62
    d.polygon([(cx + s * .15, cy - s), (cx - s * .6, cy + s * .12), (cx - s * .02, cy + s * .12),
               (cx - s * .2, cy + s), (cx + s * .6, cy - s * .15), (cx + s * .02, cy - s * .15)], fill=cor)


def cartao(tam, icone, titulo, linhas, destaque=False):
    """Cartão branco com borda azul-clara e ícone num círculo, como os da referência."""
    esc = 2
    W, H = tam[0] * esc, tam[1] * esc
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((2, 2, W - 3, H - 3), radius=46 * esc, fill=(255, 255, 255, 255), outline=BORDA + (255,), width=3 * esc)
    r = 47 * esc
    cx, cy = 96 * esc, 96 * esc
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=CLARO + (255,), outline=AZUL + (255,), width=3 * esc)
    icone(d, cx, cy, r, AZUL + (255,))
    y = int(H * .62) if not destaque else int(H * .6)
    if destaque:
        d.text((48 * esc, y), titulo, font=fonte(700, 40 * esc), fill=TINTA, anchor='ls')
        yy = y + 48 * esc
        for l in linhas:
            d.text((48 * esc, yy), l, font=fonte(400, 30 * esc), fill=(70, 89, 107), anchor='ls'); yy += 38 * esc
    else:
        d.text((48 * esc, y), titulo, font=fonte(400, 30 * esc), fill=(70, 89, 107), anchor='ls')
        d.text((48 * esc, y + 56 * esc), linhas[0], font=fonte(700, 44 * esc), fill=TINTA, anchor='ls')
    return im.resize(tam, Image.LANCZOS)


def sombra(im, raio=18, opac=.18, desloc=(0, 14)):
    a = im.split()[3].point(lambda v: int(v * opac))
    s = Image.new('RGBA', im.size, NOITE + (0,)); s.putalpha(a)
    pad = raio * 3
    c = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    c.alpha_composite(s, (pad + desloc[0], pad + desloc[1]))
    c = c.filter(ImageFilter.GaussianBlur(raio))
    c.alpha_composite(im, (pad, pad))
    return c, pad


def main():
    fone = celular(CAPTURA)
    SAIDA.mkdir(parents=True, exist_ok=True)

    # HERO 1432x1068 — medidas tiradas da imagem da referência
    W, H = 1432, 1068
    hero = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    # o número do cartão de trás NÃO repete o que já está na tela do celular (a referência faz igual)
    c1 = cartao((358, 358), icone_tendencia, 'Pix', ['R$ 8.528,90'])
    s1, p1 = sombra(c1, 16, .10)
    hero.alpha_composite(s1, (0 - p1, 0 - p1))
    larg = 988
    f = fone.resize((larg, round(fone.height * larg / fone.width)), Image.LANCZOS)
    sf, pf = sombra(f, 24, .22, (0, 18))
    hero.alpha_composite(sf, (218 - pf, 45 - pf))
    c2 = cartao((346, 434), icone_raio, 'Caixa ágil', ['Venda fechada em', 'poucos cliques'], destaque=True)
    s2, p2 = sombra(c2, 18, .14)
    hero.alpha_composite(s2, (1085 - p2, 495 - p2))
    hero.save(SAIDA / 'hero-celular.webp', quality=90, method=6)

    # DORES 1245x1252 — o celular maior sobre um painel claro
    W, H = 1245, 1252
    dores = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(dores)
    d.rounded_rectangle((2, 132, W - 3, H + 80), radius=72, fill=(244, 247, 250, 255), outline=BORDA + (255,), width=4)
    larg = 1112
    f = fone.resize((larg, round(fone.height * larg / fone.width)), Image.LANCZOS)
    sf, pf = sombra(f, 22, .20, (0, 16))
    dores.alpha_composite(sf, ((W - larg) // 2 - pf, 24 - pf))
    dores.save(SAIDA / 'dores-celular.webp', quality=90, method=6)
    print('ok', CAPTURA.name)


if __name__ == '__main__':
    main()
