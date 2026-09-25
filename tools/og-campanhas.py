#!/usr/bin/env python3
"""Imagem de compartilhamento (og:image, 1200x630) das páginas de campanha.

Antes elas apontavam para /assets/desktop.webp, o monitor antigo com "PRODUTO TESTE"
e "R$ 0,00" na tela e fundo transparente (vira preto no WhatsApp). Cada página ganha
a peça do próprio hero, o título dela e a promessa verdadeira do teste.

Uso: uv run --with pillow --with fonttools --with brotli python tools/og-campanhas.py [pagina ...]
Saída: public/campanha/<pagina>/og.jpg
"""
import io
import pathlib
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = pathlib.Path(__file__).resolve().parent.parent
PUB = RAIZ / 'public'
W, H = 1200, 630
NOITE, AZUL, MARCA, CLARO = (6, 18, 31), (12, 92, 158), (29, 161, 242), (232, 243, 251)

PAGINAS = {
    'pdv': {
        'titulo': 'O sistema PDV que resolve o caixa, o estoque e o fiado por R$ 69/mês',
        'peca': 'campanha/pdv/images/hero-celular.webp', 'modo': 'arco',
    },
    'gestao': {
        'titulo': 'Registre a venda e baixe o estoque falando no WhatsApp',
        'peca': 'campanha/gestao/midia/kit-balcao-1400.webp', 'modo': 'branco',
    },
    'teste-gratis': {
        'titulo': 'Sistema de gestão grátis por 7 dias, com nota fiscal',
        'peca': 'campanha/teste-gratis/images/hero-balcao.webp', 'modo': 'foto',
    },
}


def fonte(peso, tam):
    from fontTools.ttLib import TTFont
    t = TTFont(PUB / f'fontes/softpay-texto-{peso}-v1.woff2')
    t.flavor = None
    b = io.BytesIO(); t.save(b); b.seek(0)
    return ImageFont.truetype(b, tam)


def quebrar(d, texto, f, larg):
    linhas, atual = [], ''
    for p in texto.split():
        t = (atual + ' ' + p).strip()
        if d.textlength(t, font=f) <= larg: atual = t
        else: linhas.append(atual); atual = p
    return linhas + [atual]


def fundo(modo):
    im = Image.new('RGB', (W, H), (255, 255, 255))
    if modo == 'arco':
        g = Image.linear_gradient('L').resize((W, H)).point(lambda v: int(v * .9))
        claro = Image.new('RGB', (W, H), CLARO)
        im = Image.composite(im, claro, g)
        d = ImageDraw.Draw(im)
        cx, cy, r = 905, 900, 520
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=MARCA)
    return im


def peca(caminho, modo, caixa):
    x0, y0, x1, y1 = caixa
    p = Image.open(PUB / caminho)
    p = p.convert('RGBA')
    esc = min((x1 - x0) / p.width, (y1 - y0) / p.height)
    p = p.resize((round(p.width * esc), round(p.height * esc)), Image.LANCZOS)
    if modo == 'foto':
        m = Image.new('L', p.size, 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, p.width - 1, p.height - 1), radius=28, fill=255)
        p.putalpha(m)
    return p


def main(nomes):
    for nome in nomes:
        cfg = PAGINAS[nome]
        if not (PUB / cfg['peca']).exists():
            print('falta a peça de', nome, cfg['peca']); continue
        im = fundo(cfg['modo']).convert('RGBA')
        caixa = (600, 40, 1170, 630) if cfg['modo'] == 'arco' else (590, 70, 1170, 560)
        p = peca(cfg['peca'], cfg['modo'], caixa)
        px = caixa[0] + (caixa[2] - caixa[0] - p.width) // 2
        py = caixa[3] - p.height if cfg['modo'] == 'arco' else (H - p.height) // 2
        if cfg['modo'] == 'foto':
            s = Image.new('RGBA', (p.width + 120, p.height + 120), (0, 0, 0, 0))
            sa = Image.new('L', p.size, 0); ImageDraw.Draw(sa).rounded_rectangle((0, 0, p.width - 1, p.height - 1), radius=28, fill=70)
            s.paste(Image.new('RGBA', p.size, NOITE + (255,)), (60, 76), sa)
            s = s.filter(ImageFilter.GaussianBlur(26))
            im.alpha_composite(s, (px - 60, py - 60))
        im.alpha_composite(p, (px, py))

        d = ImageDraw.Draw(im)
        logo = Image.open(PUB / 'assets/logo.png').convert('RGBA')
        logo = logo.resize((200, round(logo.height * 200 / logo.width)), Image.LANCZOS)
        im.alpha_composite(logo, (64, 60))
        f = fonte(700, 50)
        y = 190
        for l in quebrar(d, cfg['titulo'], f, 500)[:4]:
            d.text((64, y), l, font=f, fill=NOITE); y += 60
        y += 22
        f2 = fonte(600, 25)
        txt = 'Teste 7 dias grátis, sem cartão'
        tw = d.textlength(txt, font=f2)
        d.rounded_rectangle((64, y, 64 + tw + 56, y + 58), radius=29, fill=AZUL)
        d.text((64 + 28, y + 29), txt, font=f2, fill=(255, 255, 255), anchor='lm')
        saida = PUB / 'campanha' / nome / 'og.jpg'
        im.convert('RGB').save(saida, quality=88, optimize=True, progressive=True)
        print('ok', saida.relative_to(RAIZ), f'{saida.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main(sys.argv[1:] or list(PAGINAS))
