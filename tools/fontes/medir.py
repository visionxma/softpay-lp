# Mede o quanto cada fonte livre se parece com as da Stone (Roobert e ABC Gravity).
# Cada glifo é desenhado com a mesma altura de maiúscula, apoiado na linha de base
# e centrado pela tinta; a nota é a interseção sobre a união (IoU) dos pixels.
# Também mede largura da frase (quebra de linha) e altura-x.
import glob, json, sys, os, itertools
import numpy as np
from PIL import Image, ImageDraw, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = 110
W, H, BASE = 420, 260, 200

def fonte(path, size, eixos=None):
    f = ImageFont.truetype(path, size)
    if eixos:
        try:
            ax = f.get_variation_axes()
        except Exception:
            return f
        vals = []
        for a in ax:
            nome = a.get('name', b'')
            nome = nome.decode() if isinstance(nome, bytes) else str(nome)
            tag = TAGS.get(nome.lower(), nome.lower())
            v = eixos.get(tag, a['default'])
            v = max(a['minimum'], min(a['maximum'], v))
            vals.append(v)
        f.set_variation_by_axes(vals)
    return f

TAGS = {'weight': 'wght', 'width': 'wdth', 'optical size': 'opsz', 'optical_size': 'opsz',
        'opticalsize': 'opsz', 'slant': 'slnt', 'grade': 'GRAD'}

def eixos_de(path):
    try:
        f = ImageFont.truetype(path, 20)
        out = {}
        for a in f.get_variation_axes():
            nome = a.get('name', b'')
            nome = nome.decode() if isinstance(nome, bytes) else str(nome)
            out[TAGS.get(nome.lower(), nome.lower())] = (a['minimum'], a['default'], a['maximum'])
        return out
    except Exception:
        return {}

def glifo(f, ch):
    im = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(im)
    d.text((W // 2, BASE), ch, font=f, fill=255, anchor='ls')
    a = np.asarray(im) > 110
    cols = np.where(a.any(0))[0]
    if len(cols) == 0:
        return a, 0
    cx = (cols[0] + cols[-1]) / 2
    a = np.roll(a, int(round(W / 2 - cx)), axis=1)
    return a, cols[-1] - cols[0] + 1

def cap_height(path, eixos):
    f = fonte(path, 1000, eixos)
    bb = f.getbbox('H', anchor='ls')
    return -bb[1]

def preparar(path, eixos, chars):
    ch1000 = cap_height(path, eixos)
    size = max(8, int(round(CAP * 1000 / ch1000)))
    f = fonte(path, size, eixos)
    gl = {c: glifo(f, c) for c in chars}
    # métricas por altura de maiúscula (independe do tamanho em CSS)
    f1000 = fonte(path, 1000, eixos)
    xb = f1000.getbbox('x', anchor='ls')
    return gl, ch1000, -xb[1], f1000

def iou(A, B, chars):
    s, ws = [], []
    for c in chars:
        a, wa = A[c]; b, wb = B[c]
        u = (a | b).sum()
        s.append((a & b).sum() / u if u else 1)
    return float(np.mean(s))

def largura(f1000, texto):
    return f1000.getlength(texto)

TEXTO = 'Controle de estoque, vendas e caixa num só lugar. Emissão de nota fiscal em 3 cliques.'
TITULO = 'SISTEMA DE GESTÃO PARA PEQUENOS NEGÓCIOS 2026'
MIN = 'abcdefghijklmnopqrstuvwxyz'
MAI = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
NUM = '0123456789'

def avaliar(ref, cands, chars, texto, grades):
    R, rcap, rx, rf = preparar(ref, None, chars)
    rlarg = largura(rf, texto) / rcap
    res = []
    for nome, path in cands:
        ax = eixos_de(path)
        grid = [{}]
        opcoes = []
        for tag, valores in grades.items():
            if tag in ax:
                mn, df, mx = ax[tag]
                vs = sorted({max(mn, min(mx, v)) for v in valores})
                opcoes.append([(tag, v) for v in vs])
        if 'opsz' in ax and 'opsz' in grades.get('_fixo', {}):
            pass
        grid = [dict(p) for p in itertools.product(*opcoes)] if opcoes else [{}]
        melhor = None
        for g in grid:
            g2 = dict(g)
            if 'opsz' in ax:
                g2['opsz'] = grades.get('_opsz', ax['opsz'][1])
            try:
                C, ccap, cx, cf = preparar(path, g2 if ax else None, chars)
            except Exception as e:
                continue
            nota = iou(R, C, chars)
            if not melhor or nota > melhor['iou']:
                melhor = dict(nome=nome, eixos=g2, iou=round(nota, 4),
                              xh_ratio=round((cx / ccap) / (rx / rcap), 3),
                              larg_por_cap=round((largura(cf, texto) / ccap) / rlarg, 3),
                              cap_upm_ratio=round((ccap / 1000) / (rcap / 1000), 3))
        if melhor:
            res.append(melhor)
    return sorted(res, key=lambda r: -r['iou'])

def largura_mesmo_tamanho(ref, cands_res, texto):
    rf = fonte(ref, 1000)
    rl = rf.getlength(texto)
    for r in cands_res:
        path = dict(CANDS_TODOS)[r['nome']]
        ax = eixos_de(path)
        f = fonte(path, 1000, r['eixos'] if ax else None)
        r['larg_mesmo_tam'] = round(f.getlength(texto) / rl, 3)
    return cands_res

import urllib.parse
def nome_de(p):
    n = urllib.parse.unquote(os.path.basename(p))
    return n.replace('.ttf', '')

CANDS_TODOS = []
for p in sorted(glob.glob(os.path.join(AQUI, 'cand', '*.ttf'))) + sorted(glob.glob(os.path.join(AQUI, 'cand', 'fs', '*', '*', 'Fonts', 'TTF', '*-Variable.ttf'))):
    CANDS_TODOS.append((nome_de(p), p))

if __name__ == '__main__':
    modo = sys.argv[1]
    st = lambda n: os.path.join(AQUI, 'stone', n)
    if modo in ('texto400', 'texto600'):
        ref = st('Roobert-Regular.otf' if modo == 'texto400' else 'Roobert-SemiBold.otf')
        alvo = 400 if modo == 'texto400' else 600
        excl = ('BarlowCondensed', 'Anton', 'Antonio', 'LeagueGothic', 'SmoochSans', 'SofiaSansExtra', 'SofiaSansCond', 'BigShoulders', 'Oswald', 'WixMadeforText-', 'Saira', 'CabinetGrotesk')
        cands = [(n, p) for n, p in CANDS_TODOS if not n.startswith(excl)]
        # estáticos: só o peso certo
        cands = [(n, p) for n, p in cands if '-' not in n or n.endswith('Variable') or n.endswith('Regular' if alvo == 400 else 'SemiBold')]
        grades = {'wght': list(range(alvo - 150, alvo + 151, 25)), 'wdth': [85, 90, 95, 100, 105, 110], '_opsz': 16}
        res = avaliar(ref, cands, MIN + MAI + NUM, TEXTO, grades)
        res = largura_mesmo_tamanho(ref, res, TEXTO)
    else:
        ref = st('ABCGravity-XCompressed.ttf')
        excl = ()
        cands = [(n, p) for n, p in CANDS_TODOS if '-' not in n or n.endswith(('Black', 'ExtraBold', 'Regular', 'Variable'))]
        grades = {'wght': [450, 500, 550, 600, 650, 700, 800, 900, 1000], 'wdth': [25, 28, 31, 34, 37, 40, 45, 50, 53, 56, 60, 62, 70, 75, 80], '_opsz': 144}
        res = avaliar(ref, cands, MAI + NUM, TITULO, grades)
        res = largura_mesmo_tamanho(ref, res, TITULO)
    json.dump(res, open(os.path.join(AQUI, f'res-{modo}.json'), 'w'), indent=1, ensure_ascii=False)
    for r in res[:14]:
        print(f"{r['iou']:.3f}  {r['nome'][:38]:38} {json.dumps({k: round(v) for k, v in r['eixos'].items()})[:40]:40} xh={r['xh_ratio']} cap={r['cap_upm_ratio']} larg/cap={r['larg_por_cap']} larg={r['larg_mesmo_tam']}")
