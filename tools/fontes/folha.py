import sys, os, json
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from medir import fonte, eixos_de, CANDS_TODOS, AQUI
C = dict(CANDS_TODOS)
def linha(path, eixos, texto, cap_px, w):
    f1 = fonte(path, 1000, eixos if eixos_de(path) else None)
    ch = -f1.getbbox('H', anchor='ls')[1]
    f = fonte(path, int(round(cap_px * 1000 / ch)), eixos if eixos_de(path) else None)
    im = Image.new('RGB', (w, int(cap_px * 2.2)), 'white')
    ImageDraw.Draw(im).text((10, int(cap_px * 1.6)), texto, font=f, fill='black', anchor='ls')
    return im
def folha(saida, linhas, textos, cap_px, w=1900):
    rot = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 22)
    blocos = []
    for nome, path, eixos in linhas:
        for t in textos:
            im = linha(path, eixos, t, cap_px, w)
            blocos.append(im)
        lab = Image.new('RGB', (w, 34), '#eef')
        ImageDraw.Draw(lab).text((10, 6), f'{nome}  {eixos}', font=rot, fill='#224')
        blocos.insert(len(blocos) - len(textos), lab)
    H = sum(b.height for b in blocos)
    out = Image.new('RGB', (w, H), 'white'); y = 0
    for b in blocos: out.paste(b, (0, y)); y += b.height
    out.save(saida)
st = lambda n: os.path.join(AQUI, 'stone', n)
modo = sys.argv[1]
if modo == 'display':
    linhas = [('STONE ABC Gravity XCompressed', st('ABCGravity-XCompressed.ttf'), {})]
    for n, e in [('RobotoFlex', {'wght': 650, 'wdth': 28, 'opsz': 144}), ('RobotoFlex', {'wght': 800, 'wdth': 25, 'opsz': 144}), ('Anybody', {'wght': 650, 'wdth': 53}), ('Anybody', {'wght': 800, 'wdth': 50}), ('Saira', {'wght': 800, 'wdth': 50}), ('Archivo', {'wght': 800, 'wdth': 62})]:
        k = [x for x in C if x.startswith(n)][0]
        linhas.append((k[:20] + ' (hoje)' if n == 'Archivo' else k[:20], C[k], e))
    folha(os.path.join(AQUI, 'folha-display.png'), linhas, ['SISTEMA DE GESTÃO QUE VENDE', 'R\$ 49,90 · 3.000 LOJAS · 2026 · QRKWMGSJ'], 70)
else:
    ref = 'Roobert-Regular.otf'
    linhas = [('STONE Roobert Regular', st(ref), {})]
    for n, e in [('FunnelSans', {'wght': 350}), ('AlbertSans', {'wght': 425}), ('DMSans', {'wght': 425, 'opsz': 16}), ('InstrumentSans', {'wght': 450, 'wdth': 100}), ('HostGrotesk', {'wght': 375}), ('Figtree', {'wght': 425}), ('Satoshi', {'wght': 425}), ('GeneralSans', {'wght': 425}), ('Manrope', {'wght': 450}), ('Geist', {'wght': 400})]:
        k = [x for x in C if x.startswith(n)][0]
        linhas.append((k[:20] + (' (hoje)' if n == 'Geist' else ''), C[k], e))
    folha(os.path.join(AQUI, 'folha-texto.png'), linhas, ['Controle de estoque, vendas e caixa num só lugar — agora.', 'Emissão de nota fiscal em 3 cliques. Qual é o seu negócio? gjy R\$ 1.290'], 34)
