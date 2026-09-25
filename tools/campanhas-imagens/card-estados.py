#!/usr/bin/env python3
"""Imagem do 4º cartão de "+100 lojistas já confiam" em /campanha/teste-gratis/:
o mapa do Brasil com os oito estados onde já tem loja usando o SoftPay.

Parte do mapa aprovado da home (seção #onde de public/index.html): os mesmos 27
contornos, os oito estados no azul do logotipo e, no Maranhão, os três lojistas
REAIS dos cartões ao lado (Gabriel Landim, Neto da RN Grifes e o dono da Naldo
Bebidas). Nos outros sete estados vai um ponto com halo, e não o retrato
ilustrativo da home: o cartão não tem o aviso de "retrato ilustrativo" que a
home tem, então rosto ali passaria por cliente de verdade.

Gera o HTML; quem fotografa é tools/campanhas-imagens/fotografar.mjs (Chrome sem
janela da porta 9444, densidade 2).
Uso: python3 tools/campanhas-imagens/card-estados.py > /tmp/card-estados.html
"""
import base64
import pathlib
import re

RAIZ = pathlib.Path(__file__).resolve().parents[2]
PUB = RAIZ / 'public'

home = (PUB / 'index.html').read_text()
i = home.find('<svg class="mapa__svg"')
j = home.find('</svg>', i) + len('</svg>')
svg = home[i:j]
svg = re.sub(r'<title[^>]*>.*?</title>', '', svg, flags=re.S)
svg = re.sub(r'<desc[^>]*>.*?</desc>', '', svg, flags=re.S)
svg = svg.replace(' role="img" aria-labelledby="mapa-titulo mapa-desc"', ' aria-hidden="true"')

pinos = {m.group(3): (float(m.group(1)), float(m.group(2))) for m in re.finditer(
    r'style="--x: ([\d.]+)%; --y: ([\d.]+)%" data-uf="(\w+)"', home)}
assert len(pinos) == 8, pinos


def dado(caminho):
    b = (PUB / caminho).read_bytes()
    return 'data:image/webp;base64,' + base64.b64encode(b).decode()


def fonte(peso):
    b = (PUB / f'fontes/softpay-texto-{peso}-v1.woff2').read_bytes()
    return 'data:font/woff2;base64,' + base64.b64encode(b).decode()


rostos = ''.join(f'<img src="{dado(p)}" alt="">' for p in (
    'assets/mapa/gabriel-landim.webp', 'assets/mapa/rn-grifes.webp', 'assets/mapa/naldo-bebidas.webp'))

W, H = 600, 450            # CSS; fotografado com densidade 2 = 1200x900

# o enquadramento vem dos oito estados: o viewBox do SVG vira a caixa que junta os
# contornos deles (medida no navegador), com folga, e o mapa enche o cartão
pinos_js = ','.join(f'{{uf:"{uf}",x:{x},y:{y}}}' for uf, (x, y) in pinos.items())
print(f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
@font-face {{ font-family: T; src: url({fonte(600)}) format('woff2'); }}
* {{ margin: 0; box-sizing: border-box; }}
html, body {{ width: {W}px; height: {H}px; overflow: hidden; background: #0B2033; }}
.palco {{ position: relative; width: {W}px; height: {H}px; overflow: hidden;
  background:
    radial-gradient(ellipse 58% 62% at 62% 44%, rgba(29,161,242,.20), rgba(29,161,242,0) 70%),
    radial-gradient(circle at 1px 1px, rgba(255,255,255,.06) 1px, transparent 1.2px) 0 0 / 14px 14px,
    linear-gradient(180deg, #0D2640 0%, #0B2033 55%, #081A2B 100%); }}
.mapa {{ position: absolute; inset: 0; }}
.mapa svg {{ display: block; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 18px 30px rgba(3,10,18,.55)); }}
.mapa .uf {{ fill: rgba(255,255,255,.05); stroke: rgba(255,255,255,.17); stroke-width: 1; stroke-linejoin: round; }}
.mapa .uf--ativo {{ fill: #0C5C9E; stroke: #1DA1F2; stroke-width: 1.4; }}
.ponto {{ position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%;
  background: #fff; box-shadow: 0 0 0 3px rgba(29,161,242,.55), 0 0 14px 4px rgba(29,161,242,.65); }}
.ponto::after {{ content: ""; position: absolute; inset: -10px; border-radius: 50%; border: 1.5px solid rgba(127,200,245,.55); }}
.tres {{ position: absolute; display: flex; transform: translate(-50%, -50%); }}
.tres::before {{ content: ""; position: absolute; inset: -6px; border-radius: 999px; border: 1.5px solid rgba(127,200,245,.6); }}
.tres img {{ width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;
  box-shadow: 0 8px 18px -6px rgba(3,10,18,.9); background: #0B2033; }}
.tres img + img {{ margin-left: -15px; }}
</style></head><body><div class="palco"><div class="mapa">{svg}</div></div>
<script>
const svg = document.querySelector('.mapa svg'), palco = document.querySelector('.palco');
svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
for (const p of svg.querySelectorAll('.uf--ativo')) {{ const b = p.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); }}
const f = 26; x0 -= f; y0 -= f; x1 += f; y1 += f;
// a caixa vira 4:3 ao redor do centro dos oito estados
let w = x1 - x0, h = y1 - y0; const alvo = {W} / {H};
if (w / h < alvo) {{ const nw = h * alvo; x0 -= (nw - w) / 2; w = nw; }} else {{ const nh = w / alvo; y0 -= (nh - h) / 2; h = nh; }}
svg.setAttribute('viewBox', [x0, y0, w, h].join(' '));
const esc = {W} / w;
for (const p of [{pinos_js}]) {{
  const px = (p.x / 100 * 640 - x0) * esc, py = (p.y / 100 * 619 - y0) * esc;
  const d = document.createElement('div');
  if (p.uf === 'MA') {{ d.className = 'tres'; d.innerHTML = {rostos!r}; }} else d.className = 'ponto';
  d.style.left = px + 'px'; d.style.top = py + 'px'; palco.appendChild(d);
}}
</script></body></html>''')
