#!/usr/bin/env python3
"""Carimba CSS e JS com o hash do próprio conteúdo.

Sem isso, o `?v=2` escrito à mão fica para trás: o HTML novo sobe, o navegador
do visitante recorrente continua com o CSS velho em cache (a Cloudflare serve
`max-age=14400`, quatro horas) e a página aparece quebrada só para quem já
visitou — o caso mais difícil de perceber, porque em aba anônima está tudo bem.

Uso:  python3 tools/versionar-assets.py public/v2/index.html
"""
import hashlib, pathlib, re, sys

def carimbar(html_path):
    base = html_path.parent
    html = html_path.read_text()
    trocas = 0

    def novo_hash(arquivo):
        alvo = base / arquivo
        if not alvo.exists():
            return None
        return hashlib.sha256(alvo.read_bytes()).hexdigest()[:10]

    def sub(m):
        nonlocal trocas
        arquivo, versao = m.group(1), m.group(2)
        h = novo_hash(arquivo)
        if h is None or h == versao:
            return m.group(0)
        trocas += 1
        return f'{arquivo}?v={h}'

    html = re.sub(r'([\w./-]+\.(?:css|js))\?v=([\w]+)', sub, html)
    if trocas:
        html_path.write_text(html)
    return trocas

if __name__ == '__main__':
    alvos = sys.argv[1:] or ['public/v2/index.html']
    total = 0
    for a in alvos:
        p = pathlib.Path(a)
        n = carimbar(p)
        total += n
        print(f'{a}: {n} referência(s) atualizada(s)')
    sys.exit(0)
