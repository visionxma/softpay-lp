#!/usr/bin/env python3
"""Carimba CSS e JS com o hash do próprio conteúdo.

Sem isso, o `?v=2` escrito à mão fica para trás: o HTML novo sobe, o navegador
do visitante recorrente continua com o CSS velho em cache (a Cloudflare serve
`max-age=14400`, quatro horas) e a página aparece quebrada só para quem já
visitou — o caso mais difícil de perceber, porque em aba anônima está tudo bem.

Uso:  python3 tools/versionar-assets.py public/index.html
"""
import hashlib, pathlib, re, sys

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
        arquivo = arquivo.lstrip('/')
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

    EXT = r'(?:css|js|webp|png|jpe?g|svg)'
    # com versão já presente
    html = re.sub(r'([\w./+-]+\.' + EXT + r')\?v=([\w]+)', sub, html)
    # e sem versão nenhuma, dentro de src/srcset/href
    def primeira_vez(m):
        nonlocal trocas
        arquivo = m.group(1)
        if '?' in arquivo or arquivo.startswith('http'):
            return m.group(0)
        h = novo_hash(arquivo.lstrip('/'))
        if h is None:
            return m.group(0)
        trocas += 1
        return f'{arquivo}?v={h}'
    html = re.sub(r'(?<=[="\s])(/[\w./+-]+\.' + EXT + r')(?=[\s"\',)])', primeira_vez, html)
    if trocas:
        html_path.write_text(html)
    return trocas

if __name__ == '__main__':
    alvos = sys.argv[1:] or ['public/index.html']
    total = 0
    for a in alvos:
        p = pathlib.Path(a)
        n = carimbar(p)
        total += n
        print(f'{a}: {n} referência(s) atualizada(s)')
    sys.exit(0)
