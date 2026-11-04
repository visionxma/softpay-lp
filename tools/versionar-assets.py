#!/usr/bin/env python3
"""Carimba CSS e JS com o hash do próprio conteúdo.

Sem isso, o `?v=2` escrito à mão fica para trás: o HTML novo sobe, o navegador
do visitante recorrente continua com o CSS velho em cache (a Cloudflare serve
`max-age=14400`, quatro horas) e a página aparece quebrada só para quem já
visitou — o caso mais difícil de perceber, porque em aba anônima está tudo bem.

Uso:  python3 tools/versionar-assets.py            # todas as páginas
      python3 tools/versionar-assets.py public/index.html  # só uma
"""
import hashlib, pathlib, re, sys

EXT = r'(?:css|js|webp|avif|png|jpe?g|gif|svg|woff2?|ttf|otf|mp4|webm)'
DOMINIO = re.compile(r'^(?:https?:)?//site\.softpaybr\.com')

def carimbar(html_path):
    base = html_path.parent
    html = html_path.read_text()
    trocas = 0

    raiz = html_path.parent
    while raiz.name and raiz.name != 'public':
        raiz = raiz.parent

    def novo_hash(arquivo):
        # O caminho no HTML começa com "/" (raiz do site). Sem tirar a barra,
        # pathlib trata como absoluto do disco, não acha o arquivo e devolve
        # None — e o ?v= antigo fica para trás, que é justamente o bug que
        # este script existe para evitar.
        # Endereço absoluto do próprio site (og:image, JSON-LD) aponta para o
        # mesmo arquivo de public/: tira o domínio e segue igual.
        arquivo = DOMINIO.sub('', arquivo).lstrip('/')
        for alvo in (base / arquivo, raiz / arquivo):
            if alvo.exists() and alvo.is_file():
                return hashlib.sha256(alvo.read_bytes()).hexdigest()[:10]
        return None

    def sub(m):
        nonlocal trocas
        arquivo, versao = m.group(1), m.group(2)
        h = novo_hash(arquivo)
        if h is None or h == versao:
            return m.group(0)
        trocas += 1
        return f'{arquivo}?v={h}'

    # com versão já presente
    html = re.sub(r'([\w./+-]+\.' + EXT + r')\?v=([\w]+)', sub, html)
    # e sem versão nenhuma: src/srcset/href e também url('...') de CSS (a
    # fonte do @font-face e o logo trocado por `content:` ficavam de fora e o
    # `conferir-cache.mjs` acusou em 03/11/2026). O preload do HTML e o
    # @font-face do CSS saem com o MESMO ?v=, porque o hash é do arquivo.
    def primeira_vez(m):
        nonlocal trocas
        arquivo = m.group(1)
        if '?' in arquivo:
            return m.group(0)
        h = novo_hash(arquivo)
        if h is None:
            return m.group(0)
        trocas += 1
        return f'{arquivo}?v={h}'
    html = re.sub(r'(?<=[="\s(\'])(/[\w./+-]+\.' + EXT + r')(?=[\s"\',)])', primeira_vez, html)
    # endereço absoluto do próprio site (og:image, twitter:image, JSON-LD)
    html = re.sub(r'(https://site\.softpaybr\.com/[\w./+-]+\.' + EXT + r')(?=[\s"\',)<])', primeira_vez, html)
    if trocas:
        html_path.write_text(html)
    return trocas

if __name__ == '__main__':
    # Sem argumento, TODAS as páginas. O padrão anterior era só o index.html e
    # isso mordeu em 20/09/2026: o CSS mudou, o index saiu carimbado e as
    # outras 72 páginas ficaram apontando para o hash velho — com `max-age` de
    # um ano no `_headers`, quem já tinha visitado ficaria com o arquivo antigo
    # para sempre. Carimbar a mais não custa nada; carimbar a menos é invisível.
    # O CSS vem ANTES do HTML: carimbar o url() muda o conteúdo do .css, e o
    # HTML só pega o hash novo do .css se ele já estiver no estado final.
    alvos = sys.argv[1:] or (sorted(str(f) for f in pathlib.Path('public').rglob('*.css'))
                             + sorted(str(f) for f in pathlib.Path('public').rglob('*.html')))
    total = 0
    for a in alvos:
        p = pathlib.Path(a)
        n = carimbar(p)
        total += n
        print(f'{a}: {n} referência(s) atualizada(s)')
    sys.exit(0)
