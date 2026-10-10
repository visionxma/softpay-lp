# -*- coding: utf-8 -*-
"""Ligação interna: leva link das páginas JÁ INDEXADAS para as que não estão.

O Search Console de 09/10/2026 mostra 58 páginas "detectadas, mas não
indexadas". O Google descobre e dá peso a uma página pelos links que ela
recebe de páginas que ele já conhece. Este módulo reparte, por assunto, links
contextuais das indexadas para as demais, até cada uma ter MINIMO links
vindos de páginas indexadas, dentro do <main> (menu e rodapé não contam).

Como decide: semelhança de texto (TF-IDF) entre a página de destino e cada
página indexada; a mais parecida ganha o link, respeitando um teto por página
de origem para o bloco "Veja também" não virar lista infinita. Nada é
inventado: o texto do link é o <h1> da página de destino.

Atualize INDEXADAS quando o Search Console confirmar mais páginas: elas passam a
ser origem de links também. Fonte da lista atual:
~/.jarvis/busca-contas/filas/site.softpaybr.com/indexar-estado.json (09/10/2026).
"""
import math, re, unicodedata
from collections import Counter

MINIMO = 3

# Páginas que o Google já indexou (Search Console, 09/10/2026).
INDEXADAS = [
    "segmentos/loja-de-variedades", "segmentos/papelaria", "segmentos/mercadinho",
    "segmentos/loja-de-roupas", "segmentos/loja-de-celulares-e-acessorios",
    "segmentos/materiais-de-construcao", "segmentos/loja-de-autopecas",
    "segmentos/farmacia", "segmentos/empresas-com-filiais", "segmentos/loja-de-joias",
]
# Já recebem link do menu e do rodapé de TODAS as páginas, inclusive das
# indexadas: não precisam de link contextual.
SITEWIDE = {"segmentos", "solucoes", "guias", "blog", "perguntas", "sobre", "contato"}

PARADAS = set("""para como mais sobre pelo pela pelos pelas seus suas seu sua isso essa esse
esta este mesmo muito pode podem quando onde tem tudo todo toda todos todas uma umas uns
dos das nos nas com sem por que não nao são sao ser está estão voce você loja lojas
softpay sistema sistemas gestão gestao ainda depois antes entre cada outro outra mês""".split())


def _sem_acento(t):
    return "".join(c for c in unicodedata.normalize("NFKD", t.lower()) if not unicodedata.combining(c))


def _tokens(texto):
    t = _sem_acento(re.sub(r"<[^>]+>", " ", texto))
    return [w for w in re.findall(r"[a-z0-9]{4,}", t) if w not in PARADAS]


def texto_da_pagina(pg):
    return " ".join([pg["h1"], pg["h1"], pg["title"], pg["intro"], " ".join(pg["blocks"]),
                     " ".join(q + " " + a for q, a in (pg.get("faq") or []))])


def _vetores(docs):
    n = len(docs)
    df = Counter()
    toks = {k: Counter(_tokens(v)) for k, v in docs.items()}
    for c in toks.values():
        df.update(c.keys())
    vet = {}
    for k, c in toks.items():
        v = {w: (1 + math.log(f)) * math.log((1 + n) / (1 + df[w])) for w, f in c.items()}
        norma = math.sqrt(sum(x * x for x in v.values())) or 1.0
        vet[k] = {w: x / norma for w, x in v.items()}
    return vet


def _cos(a, b):
    if len(a) > len(b):
        a, b = b, a
    return sum(x * b.get(w, 0.0) for w, x in a.items())


def planejar(paginas, ja_recebem):
    """paginas: {slug: pg}. ja_recebem: {slug destino: set(slug origem indexada)}.
    Devolve {slug origem: [slug destino, ...]} (já ordenado por semelhança)."""
    origens = [s for s in INDEXADAS if s in paginas]
    alvos = [s for s in paginas if s not in INDEXADAS and s not in SITEWIDE]
    vet = _vetores({s: texto_da_pagina(p) for s, p in paginas.items()})
    falta = {t: MINIMO - len(ja_recebem.get(t, ())) for t in alvos}
    falta = {t: n for t, n in falta.items() if n > 0}
    total = sum(falta.values())
    teto = max(1, math.ceil(total / max(1, len(origens)))) + 1
    while True:
        pares = sorted(((_cos(vet[t], vet[o]), t, o) for t in falta for o in origens
                        if o not in ja_recebem.get(t, ())), reverse=True)
        usado, plano, restante = Counter(), {o: [] for o in origens}, dict(falta)
        for sim, t, o in pares:
            if restante[t] > 0 and usado[o] < teto and t not in plano[o]:
                plano[o].append((sim, t))
                usado[o] += 1
                restante[t] -= 1
        if all(v == 0 for v in restante.values()) or teto > 60:
            break
        teto += 1
    return {o: [t for _, t in sorted(v, reverse=True)] for o, v in plano.items()}, teto
