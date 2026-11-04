# Extrai da captura renderizada da Lightspeed (inventory management, 03/11/2026) os textos, imagens e peças que o
# modo origem do molde precisa, e grava moldes/lightspeed-estoque/origem.json.
# uso: uvx --with beautifulsoup4 python ferramentas/extrair-origem.py
import json
import os
import re
from bs4 import BeautifulSoup

CAP = os.path.expanduser('~/.jarvis/visionx/clones/capturas/lightspeed-estoque/secoes-html')
SAI = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'origem.json')


def sopa(n):
    with open(os.path.join(CAP, f'{n:02d}.html'), encoding='utf8') as f:
        return BeautifulSoup(f.read(), 'html.parser')


def limpo(t):
    return re.sub(r'\s+', ' ', t or '').strip()


def interno(el):
    """HTML de dentro do elemento, sem o estilo inline que o GSAP da origem escreve."""
    for x in el.find_all(style=True):
        if 'transform' in x['style'] or 'translate' in x['style']:
            del x['style']
    return ''.join(str(c) for c in el.contents).strip()


def imagem(i):
    return {
        'src': i.get('src') or i.get('data-src'),
        'srcset': i.get('srcset') or i.get('data-srcset') or '',
        'sizes': i.get('sizes') or i.get('data-sizes') or '',
        'w': int(i.get('width')), 'h': int(i.get('height')), 'alt': i.get('alt', ''),
    }


def botao(a):
    return {'texto': limpo(a.get_text()), 'href': a.get('href')}


O = {}

# 0 · hero
s = sopa(0)
O['hero'] = {
    'pre': limpo(s.find('h1').get_text()),
    'titulo': limpo(s.select_one('hgroup p').get_text()),
    'intro': limpo(s.select_one('header > p').get_text()),
    'botoes': [botao(a) for a in s.select('.hero-united__cta-buttons a')],
    'img': imagem(s.select_one('.hero-united__media img')),
}

# 1 · números
s = sopa(1)
O['numeros'] = [{
    'valor': limpo(c.find('h3').get_text()),
    'texto': limpo(c.find('p').get_text()),
    'minh': re.search(r'min-height:\s*([\d.]+)px', c.find('h3').get('style', '') or '').group(1) if c.find('h3').get('style') else '',
} for c in s.select('.tw\\:grid > section')]


# 2, 3, 10 · grades de cartões
def grade(n):
    s = sopa(n)
    sub = s.select_one('.module-subtitle')
    linhas = []
    for row in s.select('.override-desc-with-icons-card-container'):
        cards = []
        for col in row.find_all('div', recursive=False):
            card = col.select_one('[data-desc-with-icons-card]')
            midia = card.select_one('.html-module-override--desc-with-icons-image-wrapper')
            im = midia.find('img')
            ic = midia.select_one('[data-desc-with-icons-visual-icon]')
            alto = card.select_one('[data-element-reset-height]')
            h3 = card.find('h3')
            p = card.find('p')
            cards.append({
                'col': [c for c in col['class'] if c.startswith('col-md-')][0],
                'img': imagem(im) if im else None,
                'svg': str(ic.find('svg')) if ic else '',
                'titulo': limpo(h3.get_text()) if h3 else '',
                'texto': interno(p) if p else '',
                'minh': (re.search(r'min-height:\s*([\d.]+)px', alto.get('style', '')) or [None, ''])[1] if alto else '',
            })
        linhas.append(cards)
    fim = s.select_one('.gb-button-container > a.gb-button-cta-regular')
    return {
        'titulo': limpo(s.select_one('.module-title').get_text()),
        'subtitulo': limpo(sub.get_text()) if sub else '',
        'linhas': linhas,
        'botao': botao(fim) if fim else None,
    }


O['grade2'] = grade(2)
O['grade3'] = grade(3)
O['grade10'] = grade(10)

# 4, 5, 7, 8, 9, 11, 13 · meia largura
O['meias'] = {}
for n in (4, 5, 7, 8, 9, 11, 13):
    s = sopa(n)
    sec = s.select_one('section[data-module-content-alignment]')
    texto = s.select_one('.tw\\:text-primary.tw\\:w-full')
    for svg in texto.select('.gb-button-jumpoff__arrow'):
        svg.decompose()
    links = [botao(a) for a in texto.select('a.gb-button-jumpoff')]
    for c in texto.select('.gb-button-container'):
        c.decompose()
    O['meias'][str(n)] = {
        'alinhamento': sec['data-module-content-alignment'],
        'bullets': 'half-width-module-with-bullets' in sec['class'],
        'texto': interno(texto),
        'link': links[0] if links else None,
        'img': imagem(s.select_one('figure img')),
    }

# 14 · carrossel
s = sopa(14)
cont = s.select_one('[data-flexible-card-carousel="container"]')
O['carrossel'] = {
    'titulo': limpo(cont.find('h2').get_text()),
    'aria': cont.get('aria-label', ''),
    'slides': [{
        'img': imagem(li.find('img')),
        'titulo': limpo(li.find('h3').get_text()),
        'texto': limpo(li.find('p').get_text()),
        'link': botao(li.select_one('a.gb-button-jumpoff')),
    } for li in cont.select('ul[data-flexible-card-carousel="slider"] > li')],
}

# 15 · formulário (o campo de telefone da origem vem com a lista de países do intl-tel-input: sai, fica a bandeira)
s = sopa(15)
for x in s.select('.iti__country-list, .iti__dropdown-content, script, noscript'):
    x.decompose()
form = s.select_one('form.gb-form')
for x in form.select('.gb-recaptcha'):
    x.clear()
O['form'] = {
    'titulo': limpo(s.select_one('.leadform__title').get_text()),
    'subtitulo': limpo(s.select_one('.leadform__subtitle').get_text()),
    'atributos': {k: (' '.join(v) if isinstance(v, list) else v) for k, v in form.attrs.items() if k in ('class', 'style', 'novalidate')},
    'miolo': interno(form),
}

# 16 · perguntas
s = sopa(16)
O['faq'] = [[limpo(d.find('h3').get_text()), interno(d.select_one('[data-accordion="content"]'))] for d in s.find_all('details')]

with open(SAI, 'w', encoding='utf8') as f:
    json.dump(O, f, ensure_ascii=False, indent=1)
print(SAI, os.path.getsize(SAI), 'bytes')
for k, v in O.items():
    print(k, (len(v) if isinstance(v, (list, dict)) else v))
print('grade2 linhas', [len(l) for l in O['grade2']['linhas']], 'grade3', [len(l) for l in O['grade3']['linhas']], O['grade3']['botao'], 'grade10', [len(l) for l in O['grade10']['linhas']])
print('slides', len(O['carrossel']['slides']), 'faq', len(O['faq']), 'form miolo', len(O['form']['miolo']))
