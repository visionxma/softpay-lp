#!/usr/bin/env python3
"""Fotos de "Para quem é" em tela cheia no celular — recorte padronizado e ampliado.

No celular cada lojista ocupa o aparelho inteiro (sistema.css, bloco 32). O
recorte 3:4 de 1000px da grade não serve: esticado até a altura de um iPhone
ele era ampliado 1,9x pelo navegador. Aqui cada foto ganha um recorte próprio:

1. Rosto medido pelo detector (OpenCV, cascata Haar), procurado só na faixa
   central (30%–70% da largura) e entre 10% e 60% da altura — fora disso o
   detector pega prateleira e dobra de roupa.
2. O MESMO padrão nos seis: rosto com 25% da largura da tela, centrado, a 36%
   da altura da foto. A foto tem a proporção de 390 x (844 x 0,78): ocupa os
   78% de cima do painel e se dissolve no azul-noite embaixo, onde ficam o
   nome e o botão. O recorte tem de caber INTEIRO na fonte (assert) — nada de
   espelhar borda, que o Victor reprovou.
3. Ampliação 4x com Real-ESRGAN (realesrgan-x4plus, ncnn/Vulkan, roda local
   no Mac em ~1 min por foto) e redução para 1170px (DPR 3) e 780px (DPR 2).

Fontes (assets-fonte/clientes/): os três clientes reais nas versões de plano
médio (gabriel-alto, neto-ext, naldo-ext) e as três de banco nas versões
abertas de corpo inteiro (farmacia-w, papelaria-w, variedades-w).

Uso:
    python3 tools/tela-cheia.py            # precisa de opencv-python-headless 4.10 e Pillow
    Real-ESRGAN em ~/.local/share/realesrgan (binário + models/)
"""
import os, subprocess, pathlib
import cv2, numpy as np
from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'assets-fonte/clientes'
SAIDA = RAIZ / 'public/assets/lojistas/tela'
ESRGAN = pathlib.Path.home() / '.local/share/realesrgan'
TMP = pathlib.Path('/tmp/telacheia')

FONTES = {'celulares-e-acessorios': 'gabriel-alto.png', 'loja-de-roupas': 'neto-ext.png',
          'distribuidora': 'naldo-ext.png', 'farmacia': 'farmacia-w.png',
          'papelaria': 'papelaria-w.png', 'loja-de-variedades': 'variedades-w.png'}
R, FY = 0.25, 0.36                 # rosto / largura da tela, altura do rosto na foto
ASP = 390 / (844 * 0.78)           # largura / altura da foto no painel
det = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def rosto(im):
    a = np.asarray(im.convert('RGB')); h, w = a.shape[:2]; y0, y1 = int(h * .10), int(h * .60)
    g = cv2.equalizeHist(cv2.cvtColor(a[y0:y1], cv2.COLOR_RGB2GRAY))
    for esc, viz in ((1.03, 6), (1.05, 5), (1.08, 4), (1.1, 3), (1.05, 2)):
        f = [r for r in det.detectMultiScale(g, scaleFactor=esc, minNeighbors=viz, minSize=(40, 40))
             if .3 < (r[0] + r[2] / 2) / w < .7]
        if f:
            x, y, fw, fh = max(f, key=lambda r: r[2]); return fw, x + fw / 2, y0 + y + fh / 2
    raise SystemExit('rosto não encontrado')

def main():
    TMP.mkdir(exist_ok=True); SAIDA.mkdir(parents=True, exist_ok=True)
    for slug, arq in FONTES.items():
        im = Image.open(FONTE / arq).convert('RGB'); W, H = im.size
        fw, cx, cy = rosto(im)
        Wc = fw / R; Hc = Wc / ASP; x0 = cx - Wc / 2; y0 = cy - FY * Hc
        assert x0 >= 0 and y0 >= 0 and x0 + Wc <= W and y0 + Hc <= H, f'{slug}: recorte não cabe'
        rec = TMP / f'rec-{slug}.png'; up = TMP / f'up-{slug}.png'
        im.crop((round(x0), round(y0), round(x0 + Wc), round(y0 + Hc))).save(rec)
        if not up.exists():
            subprocess.run([str(ESRGAN / 'realesrgan-ncnn-vulkan'), '-i', str(rec), '-o', str(up),
                            '-n', 'realesrgan-x4plus', '-s', '4', '-t', '200', '-m', str(ESRGAN / 'models')],
                           check=True)
        grande = Image.open(up).convert('RGB')
        for L in (1170, 780):
            grande.resize((L, round(L / ASP)), Image.LANCZOS).save(SAIDA / f'{slug}-{L}.webp', 'WEBP', quality=84, method=6)
        print(slug, 'ok')

if __name__ == '__main__':
    main()
