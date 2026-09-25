#!/usr/bin/env python3
"""Peça do balcão completo (hero de /campanha/gestao/): monitor, gaveta de
dinheiro, impressora de cupom, maquininha, leitor de código de barras e
celular — os mesmos objetos da foto da referência (nextar.com.br), com as telas
do SoftPay.

Fonte: assets-fonte/hero/kit-balcao-chroma.png — render do codex (25/09/2026),
vista de FRENTE, com as telas em verde puro. Ampliado 4x pelo Real-ESRGAN para
kit-balcao-chroma-x4.png (fora do git: refaz sozinho se faltar).

Regra aprendida no aparelhos-2 (o Victor apontou duas vezes a tela torta no
lado direito do monitor): tela vista de frente NÃO passa por perspectiva. A
captura ocupa a caixa da máscara, reta. Perspectiva só onde o aparelho está
inclinado de verdade (maquininha e celular deitado), e aí os quatro cantos saem
do encontro das RETAS ajustadas às bordas da máscara — nunca do ponto mais
perto do canto, que num canto arredondado ou tapado cai no lugar errado.

O que vai em cada tela:
· MONITOR — o PDV com a venda de R$ 414,60 no carrinho (capturas/pdv-1440-dpr2.png),
  cortado 6 a 805,5 px CSS para bater a proporção da tela (1,8015). Duas limpezas,
  sem inventar nada: sai a fileira de produtos cortada pela metade no pé da grade
  (onde aparecia "PRODUTO TESTE", item da loja de demonstração) e sai o selo de
  latência laranja (470ms lê como sistema lento num print).
· MAQUININHA — tela de pagamento aprovado da mesma venda (R$ 414,60): o SoftPay
  não processa cartão, trabalha junto com a maquininha.
· CELULAR (deitado na gaveta) — o carrinho da mesma venda no layout de celular.

Saída: public/campanha/gestao/midia/kit-balcao-{1400,2400}.webp
Uso: uv run --with numpy --with pillow --with scipy --with fonttools --with brotli python tools/peca-kit-balcao.py
"""
import io
import pathlib
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'assets-fonte/hero'
CHROMA = FONTE / 'kit-balcao-chroma.png'
CHROMA4 = FONTE / 'kit-balcao-chroma-x4.png'
CAP = FONTE / 'capturas'
SAIDA = RAIZ / 'public/campanha/gestao/midia'
PROP_SLOT = 1310 / 928          # a caixa da imagem na página (a mesma da referência)


def ampliado():
    if not CHROMA4.exists():
        e = pathlib.Path.home() / '.local/share/realesrgan'
        subprocess.run(['nice', '-n', '10', str(e / 'realesrgan-ncnn-vulkan'), '-i', str(CHROMA), '-o', str(CHROMA4),
                        '-n', 'realesrgan-x4plus', '-s', '4', '-t', '200', '-m', str(e / 'models')], check=True)
    return Image.open(CHROMA4).convert('RGB')


def regioes(img):
    a = np.asarray(img).astype(np.int16)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    verde = (G > 150) & (R < 140) & (B < 140) & (G - R > 60)
    lab, n = ndimage.label(verde)
    tam = ndimage.sum(verde, lab, range(1, n + 1))
    ordem = [int(i) + 1 for i in np.argsort(-tam)]
    return verde, lab, ordem


def reta(pontos):
    """reta x = a*y + b (bordas quase verticais) ou y = a*x + b (quase horizontais)."""
    p = np.array(pontos, float)
    return np.polyfit(p[:, 0], p[:, 1], 1)


def quad(mask):
    """Quatro cantos pelo encontro das retas ajustadas às quatro bordas."""
    ys, xs = np.nonzero(mask)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    h, w = y1 - y0, x1 - x0
    esq, dir_, cima, baixo = [], [], [], []
    for y in range(int(y0 + h * .25), int(y1 - h * .25)):
        r = xs[ys == y]
        if len(r): esq.append((y, r.min())); dir_.append((y, r.max()))
    for x in range(int(x0 + w * .25), int(x1 - w * .25)):
        c = ys[xs == x]
        if len(c): cima.append((x, c.min())); baixo.append((x, c.max()))
    E, D, C, B = reta(esq), reta(dir_), reta(cima), reta(baixo)   # x=f(y) para E/D, y=f(x) para C/B

    def cruza(vert, horiz):
        # x = av*y + bv ; y = ah*x + bh
        av, bv = vert; ah, bh = horiz
        y = (ah * bv + bh) / (1 - ah * av)
        return (av * y + bv, y)
    return [cruza(E, C), cruza(D, C), cruza(D, B), cruza(E, B)]


def coef(origem, destino):
    A, Bv = [], []
    for (xd, yd), (xs, ys) in zip(destino, origem):
        A.append([xd, yd, 1, 0, 0, 0, -xs * xd, -xs * yd]); Bv.append(xs)
        A.append([0, 0, 0, xd, yd, 1, -ys * xd, -ys * yd]); Bv.append(ys)
    return np.linalg.solve(np.array(A, float), np.array(Bv, float))


def dilatar(m, n=3):
    return ndimage.binary_dilation(m, iterations=n)


def colar_reto(base, mask, tela):
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    w, h = x1 - x0 + 1, y1 - y0 + 1
    img = tela.resize((w, h), Image.LANCZOS)
    m = Image.fromarray((dilatar(mask)[y0:y1 + 1, x0:x1 + 1] * 255).astype('uint8'))
    base.paste(img, (x0, y0), m)


def colar_perspectiva(base, mask, tela, cantos):
    xs = [c[0] for c in cantos]; ys = [c[1] for c in cantos]
    x0, y0 = int(np.floor(min(xs))), int(np.floor(min(ys)))
    x1, y1 = int(np.ceil(max(xs))), int(np.ceil(max(ys)))
    lw, lh = x1 - x0 + 1, y1 - y0 + 1
    # a tela é desenhada no tamanho de destino x2 e reduzida: borda sem serrilhado
    tw, th = tela.size
    # PERSPECTIVE do Pillow leva o pixel de SAÍDA (a caixa do aparelho) ao pixel
    # de ENTRADA (a tela): origem = cantos da tela, destino = cantos na caixa.
    # Invertido (como estava no peca-hero-celular.py), o trapézio sai ao contrário.
    c = coef([(0, 0), (tw - 1, 0), (tw - 1, th - 1), (0, th - 1)], [(x - x0, y - y0) for x, y in cantos])
    warp = tela.transform((lw, lh), Image.PERSPECTIVE, tuple(c), Image.BICUBIC)
    m = dilatar(mask)[y0:y1 + 1, x0:x1 + 1]
    base.paste(warp, (x0, y0), Image.fromarray((m * 255).astype('uint8')))


def fonte(peso, tam):
    from fontTools.ttLib import TTFont
    t = TTFont(RAIZ / f'public/fontes/softpay-texto-{peso}-v1.woff2')
    t.flavor = None
    b = io.BytesIO(); t.save(b); b.seek(0)
    return ImageFont.truetype(b, tam)


def tela_pdv():
    cap = Image.open(CAP / 'pdv-1440-dpr2.png').convert('RGB')       # 2880x1704, densidade 2
    d = ImageDraw.Draw(cap)
    # captura de 25/09 (tools/app/capturar-caixa.mjs --sem-resumo --ocultar=...): só os 12
    # produtos da loja de demonstração, em 3 fileiras que terminam em y=724,5 CSS; abaixo
    # sobra o título "Serviços 1" (747-760), cujo serviço de teste da equipe saiu da grade.
    # Pinta esse título com o fundo da grade (x 240-1019,5).
    d.rectangle((240 * 2, 735 * 2, int(1019.5 * 2) - 1, 770 * 2 - 1), fill=(246, 248, 249))
    # selo de latência entre o nº do caixa e o "Operador" (x 514,5-596, y 72-97,5): a
    # captura já o esconde; a pintura fica de garantia
    d.rectangle((514 * 2, 71 * 2, 597 * 2, 99 * 2), fill=(254, 255, 255))
    return cap.crop((0, 6 * 2, cap.width, int(805.5 * 2)))              # 2880x1599 = 1,8011


def tela_maquininha(w, h):
    esc = 2
    im = Image.new('RGB', (w * esc, h * esc), (250, 252, 253))
    d = ImageDraw.Draw(im)
    W, H = im.size
    r = int(H * .19)
    cx, cy = W // 2, int(H * .34)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(6, 122, 76))
    lw = max(4, int(r * .16))
    d.line([(cx - r * .45, cy + r * .02), (cx - r * .1, cy + r * .36), (cx + r * .5, cy - r * .32)],
           fill=(255, 255, 255), width=lw, joint='curve')
    f1 = fonte(700, int(H * .12)); f2 = fonte(600, int(H * .085))
    t1 = 'Aprovado'; t2 = 'R$ 414,60'
    d.text((cx, int(H * .66)), t1, font=f1, fill=(10, 26, 40), anchor='mm')
    d.text((cx, int(H * .82)), t2, font=f2, fill=(12, 92, 158), anchor='mm')
    return im


def tela_celular():
    car = Image.open(CAP / 'carrinho-390-dpr3.png').convert('RGB')     # 1170x2532 (25/09, com acentos)
    return car


def cupom_impresso(base):
    """O papel que sai da impressora ganha a impressão do cupom da mesma venda.

    O papel está de frente (medido no render 1x: x 1274-1420, topo 594, entra na
    fenda em 685). A impressão vai por MULTIPLICAÇÃO, para a sombra e a curva do
    papel continuarem por cima da tinta, e só na parte chata (abaixo da dobra do topo).
    """
    x0, x1, y0, y1 = 1274 * 4, 1420 * 4, 594 * 4, 685 * 4
    w, h = x1 - x0, y1 - y0
    camada = Image.new('RGB', (w, h), (255, 255, 255))
    d = ImageDraw.Draw(camada)
    tinta, cinza = (40, 48, 58), (150, 158, 166)
    m = int(w * .12)
    y = int(h * .16)
    d.text((w // 2, y), 'SOFTPAY', font=fonte(700, int(h * .085)), fill=tinta, anchor='mm')
    y += int(h * .1)
    d.text((w // 2, y), 'Caixa 1 · venda 000001', font=fonte(400, int(h * .05)), fill=cinza, anchor='mm')
    y += int(h * .07)
    for xx in range(m, w - m, int(w * .025)):
        d.line([(xx, y), (xx + int(w * .012), y)], fill=cinza, width=max(2, h // 160))
    f = fonte(400, int(h * .055))
    for nome, valor in [('Camiseta Básica', '49,90'), ('Batom Matte', '24,90'),
                        ('Perfume Floral', '139,90'), ('Tênis Casual', '199,90')]:
        y += int(h * .075)
        d.text((m, y), nome, font=f, fill=tinta, anchor='lm')
        d.text((w - m, y), valor, font=f, fill=tinta, anchor='rm')
    y += int(h * .07)
    for xx in range(m, w - m, int(w * .025)):
        d.line([(xx, y), (xx + int(w * .012), y)], fill=cinza, width=max(2, h // 160))
    y += int(h * .085)
    ft = fonte(700, int(h * .07))
    d.text((m, y), 'TOTAL', font=ft, fill=tinta, anchor='lm')
    d.text((w - m, y), 'R$ 414,60', font=ft, fill=tinta, anchor='rm')
    trecho = base.crop((x0, y0, x1, y1))
    from PIL import ImageChops
    base.paste(ImageChops.multiply(trecho, camada), (x0, y0))


def main():
    base = ampliado()
    verde, lab, ordem = regioes(base)
    monitor = lab == ordem[0]
    # as outras regiões grandes: maquininha (a mais à esquerda) e celular (à direita, na gaveta)
    resto = []
    for k in ordem[1:4]:
        ys, xs = np.nonzero(lab == k)
        resto.append((len(xs), xs.mean(), ys.mean(), k))
    resto = [r for r in resto if r[0] > 20000]
    maq = min(resto, key=lambda r: r[1])[3]
    cel = max(resto, key=lambda r: r[1])[3]

    colar_reto(base, monitor, tela_pdv())

    m = lab == maq
    q = quad(m)
    ys, xs = np.nonzero(m)
    colar_perspectiva(base, m, tela_maquininha(int(xs.max() - xs.min()), int(ys.max() - ys.min())), q)

    m = lab == cel
    colar_perspectiva(base, m, tela_celular(), quad(m))

    cupom_impresso(base)

    # enquadramento: tudo o que não é branco + respiro, na proporção da caixa da página
    a = np.asarray(base).astype(np.int16)
    tinta = a.min(axis=2) < 248
    ys, xs = np.nonzero(tinta)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    folga = int((x1 - x0) * .03)
    x0, x1, y0, y1 = x0 - folga, x1 + folga, y0 - folga, y1 + folga
    w, h = x1 - x0, y1 - y0
    if w / h > PROP_SLOT:
        nh = int(w / PROP_SLOT); y0 -= (nh - h) // 2; h = nh
    else:
        nw = int(h * PROP_SLOT); x0 -= (nw - w) // 2; w = nw
    tela = Image.new('RGB', (w, h), (255, 255, 255))
    tela.paste(base.crop((max(0, x0), max(0, y0), min(base.width, x0 + w), min(base.height, y0 + h))),
               (max(0, -x0), max(0, -y0)))
    SAIDA.mkdir(parents=True, exist_ok=True)
    for larg in (1400, 2400):
        v = tela.resize((larg, round(larg / PROP_SLOT)), Image.LANCZOS)
        v = v.filter(ImageFilter.UnsharpMask(radius=0.9, percent=55, threshold=2))
        v.save(SAIDA / f'kit-balcao-{larg}.webp', quality=90, method=6)
        print('ok', larg, v.size)
    tela.resize((1310, 928), Image.LANCZOS).save('/tmp/kit-balcao-previa.png')


if __name__ == '__main__':
    main()
