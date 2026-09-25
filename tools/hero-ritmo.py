#!/usr/bin/env python3
"""Vídeo de fundo da hero da home: "ritmo do comércio", cortes de lojistas trabalhando.

A hero da home segue a da stone.com.br (pedido do Victor, 25/09/2026): vídeo de
cortes em tela cheia, escurecido pelo CSS (filter: brightness(.3)), com o título no
centro. O vídeo da Stone é deles (gente deles); o nosso sai das 10 fotos de
segmento que o site já usa (public/assets/lojistas/*.webp), cada uma num corte de
2 s com aproximação lenta na direção de quem está trabalhando, corte seco entre elas.

Saídas (public/assets/hero/):
  ritmo-paisagem.mp4  1280x720  (computador e tablet)
  ritmo-retrato.mp4   720x1280  (celular: o enquadramento segue a pessoa)
  ritmo-poster.webp   1280x720  (primeiro quadro: aparece enquanto o vídeo carrega)
  ritmo-poster-retrato.webp 720x1280

Uso: nice -n 10 uv run --with pillow python tools/hero-ritmo.py
"""
import pathlib
import subprocess
import tempfile
from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FOTOS = RAIZ / 'public/assets/lojistas'
SAIDA = RAIZ / 'public/assets/hero'
FPS, SEG = 24, 2.0
QUADROS = int(FPS * SEG)
ZOOM = 0.07

# (arquivo, centro horizontal de quem trabalha, de 0 a 1) — medido na folha de contato
CORTES = [
    ('casal-comerciantes', .52), ('loja-de-roupas', .56), ('distribuidora', .51),
    ('farmacia', .55), ('loja-de-calcados', .46), ('mercadinho', .60),
    ('papelaria', .61), ('loja-de-bebidas', .41), ('cosmeticos-e-perfumaria', .40),
    ('pet-shop', .48),
]


def recorte(im, centro, prop):
    """Recorte na proporção `prop` (largura/altura) com a altura inteira, centrado na pessoa."""
    w, h = im.size
    cw = min(w, round(h * prop))
    x0 = round(centro * w - cw / 2)
    x0 = max(0, min(w - cw, x0))
    return im.crop((x0, 0, x0 + cw, h))


def clipe(foto, centro, largura, altura, destino, tmp):
    im = Image.open(FOTOS / f'{foto}.webp').convert('RGB')
    base = recorte(im, centro, largura / altura)
    # 4x antes do zoompan: sem isso a aproximação treme meio pixel por quadro
    grande = base.resize((largura * 4, altura * 4), Image.LANCZOS)
    src = tmp / f'{foto}-{largura}.png'
    grande.save(src)
    z = f"1+{ZOOM}*on/{QUADROS}"
    vf = (f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={QUADROS}:s={largura}x{altura}:fps={FPS},"
          f"format=yuv420p")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', str(src), '-vf', vf, '-frames:v', str(QUADROS),
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', str(destino)], check=True)


def montar(largura, altura, nome, tmp):
    partes = []
    for foto, centro in CORTES:
        destino = tmp / f'{foto}-{largura}x{altura}.mp4'
        clipe(foto, centro, largura, altura, destino, tmp)
        partes.append(destino)
    lista = tmp / f'lista-{largura}.txt'
    lista.write_text(''.join(f"file '{p}'\n" for p in partes))
    saida = SAIDA / f'{nome}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lista),
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p',
                    '-movflags', '+faststart', '-an', str(saida)], check=True)
    # pôster = o primeiro quadro, para a hero nunca abrir vazia
    poster = SAIDA / (f'ritmo-poster.webp' if largura > altura else 'ritmo-poster-retrato.webp')
    png = tmp / f'poster-{largura}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(saida), '-frames:v', '1', str(png)], check=True)
    Image.open(png).save(poster, quality=80, method=6)
    print('ok', saida.name, f'{saida.stat().st_size // 1024} KB', '·', poster.name, f'{poster.stat().st_size // 1024} KB')


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        tmp = pathlib.Path(t)
        montar(1280, 720, 'ritmo-paisagem', tmp)
        montar(720, 1280, 'ritmo-retrato', tmp)


if __name__ == '__main__':
    main()
