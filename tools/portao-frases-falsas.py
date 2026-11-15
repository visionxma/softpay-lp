#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Portão das frases falsas sobre o SoftPay (sai 1 se achar alguma).

15/11/2026. O site dizia duas coisas que o produto desmente, e as duas
diminuíam o SoftPay em páginas de segmento e de solução:

  1. "Não integra com balança" (e "venda por peso entra como produto comum,
     com o valor digitado no PDV"). Falso: o caixa LÊ a etiqueta da balança
     etiquetadora (código de 13 dígitos que começa com 2, peso em gramas) e
     lança o item com o peso, para produto vendido em kg ou g. O que ele não faz
     é ler o peso direto da balança pelo cabo.
  2. "A loja online, a partir do plano Loja, é catálogo com Pix — não gestão de
     entregador". Falso: a loja online recebe o pedido com Pix e soma a taxa de
     entrega do bairro; quem leva é o lojista.

Prova no código do app (repositório SOFTPAY APP, main de 14/11/2026, 5686718d):
  - src/lib/scaleBarcode.ts: parseScaleBarcode lê /^2\\d{12}$/ (prefixo 2,
    código de 6 dígitos, peso em gramas) e buildScaleBarcode gera a etiqueta.
  - src/components/PDV.tsx linhas 2426 a 2453: o código lido casa o produto
    pelo código da balança e usa o peso como quantidade (unidade kg ou g).
  - src/components/ProductLabel.tsx: gera e imprime a etiqueta com o peso.
  - nenhum uso de navigator.serial: o cabo da balança não é lido.
  - src/components/storefront/CartDrawer.tsx linhas 468 a 476: a loja online
    soma a taxa de entrega do bairro (deliveryZones) ou a taxa única.

Lê public/**/*.html, public/llms*.txt, tools/c_*.py e tools/conteudo/**/*.json.
Texto comparado em minúsculas e sem acento. Uso: python3 tools/portao-frases-falsas.py
"""
import glob, html, os, re, sys, unicodedata

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# (nome, expressão sobre o texto em minúsculas e sem acento)
LISTA_NEGRA = [
    ("nao integra com balanca",
     r"(nao|sem)\W+(integra|integracao|tem integracao|faz integracao)\W+(com\W+)?(a\W+)?balanca"),
    ("peso entra como produto comum com o valor digitado",
     r"produto comum,?\s+com\s+o\s+valor\s+digitado"),
    ("venda por peso com o valor digitado no PDV",
     r"(peso|granel)[^.<]{0,90}valor\s+digitado\s+no\s+pdv"),
    ("loja online e catalogo com Pix (a partir do plano Loja)",
     r"plano\s+loja,?\s+e\s+catalogo\s+com\s+pix"),
    ("catalogo com Pix, nao gestao de entregador",
     r"catalogo\s+com\s+pix\W{1,8}nao\s+gestao\s+de\s+entregador"),
]
LISTA_NEGRA = [(n, re.compile(r)) for n, r in LISTA_NEGRA]


def normalizar(t):
    t = html.unescape(t).lower()
    return "".join(c for c in unicodedata.normalize("NFD", t) if unicodedata.category(c) != "Mn")


def arquivos():
    pad = ["public/**/*.html", "public/llms*.txt", "tools/c_*.py", "tools/conteudo/**/*.json"]
    vistos = set()
    for p in pad:
        for f in sorted(glob.glob(os.path.join(RAIZ, p), recursive=True)):
            if f not in vistos:
                vistos.add(f)
                yield f


def main():
    achados, total = [], 0
    for f in arquivos():
        total += 1
        with open(f, encoding="utf-8", errors="replace") as fh:
            for n, linha in enumerate(fh, 1):
                # o JSON escreve acento como \uXXXX em alguns casos
                bruto = linha
                if "\\u" in bruto:
                    try:
                        bruto = bruto.encode().decode("unicode_escape").encode("latin-1", "ignore").decode("utf-8", "ignore") or linha
                    except Exception:
                        bruto = linha
                t = normalizar(bruto)
                for nome, rx in LISTA_NEGRA:
                    if rx.search(t):
                        achados.append((os.path.relpath(f, RAIZ), n, nome))
    if achados:
        print("PORTÃO DAS FRASES FALSAS: REPROVADO (%d achado(s) em %d arquivos lidos)" % (len(achados), total))
        for f, n, nome in achados:
            print("  %s:%d  [%s]" % (f, n, nome))
        sys.exit(1)
    print("PORTÃO DAS FRASES FALSAS: OK (%d arquivos lidos, %d frases na lista negra)" % (total, len(LISTA_NEGRA)))


if __name__ == "__main__":
    main()
