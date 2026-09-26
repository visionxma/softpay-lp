#!/usr/bin/env python3
"""Ícones 3D da seção "O que a sua loja precisa" (#tudo-em-um-lugar da home).

Fonte: assets-fonte/recursos/*.png — 13 ícones do Victor (26/09/2026, azul da marca +
cromado, 512x512 com fundo transparente) e o do PDV, gerado no mesmo estilo pelo
codex (pdv-frente-de-caixa-render.png, recortado do branco em pdv-frente-de-caixa.png).

Cada ícone é recortado pelo alfa e recolocado num quadrado com a mesma margem
(o objeto ocupa 86% do lado), para os 14 terem o mesmo peso visual na grade.
Saída: public/assets/recursos/<nome>.webp em 256x256 (o maior uso é 80px a 3x).

Uso: uv run --with pillow python tools/icones-recursos.py
"""
import pathlib
from PIL import Image, ImageFilter

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'assets-fonte/recursos'
SAIDA = RAIZ / 'public/assets/recursos'
LADO, OCUPA = 256, 0.86


def normalizar(caminho):
    im = Image.open(caminho).convert('RGBA')
    im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
    esc = LADO * OCUPA / max(im.size)
    im = im.resize((round(im.width * esc), round(im.height * esc)), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=0.8, percent=40, threshold=2))
    tela = Image.new('RGBA', (LADO, LADO), (0, 0, 0, 0))
    tela.alpha_composite(im, ((LADO - im.width) // 2, (LADO - im.height) // 2))
    return tela


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    total = 0
    for f in sorted(FONTE.glob('*.png')):
        if f.stem.endswith('-render'):
            continue
        destino = SAIDA / f'{f.stem}.webp'
        normalizar(f).save(destino, quality=88, method=6)
        total += destino.stat().st_size
        print('ok', destino.name, f'{destino.stat().st_size // 1024} KB')
    print('total', total // 1024, 'KB')


if __name__ == '__main__':
    main()
