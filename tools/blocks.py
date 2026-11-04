# -*- coding: utf-8 -*-
"""Blocos de conteúdo reutilizáveis (só estrutura; o texto vem de cada página)."""

import re
import unicodedata


class Bloco(str):
    """O HTML de sempre, com o mesmo conteúdo em forma de dado (`.dado`).

    O molde clonado de cada rota (tools/moldes/vestir.mjs) lê o `.dado` para pôr
    cada parte no bloco do mesmo tipo da referência; o HTML continua idêntico
    para quem ainda usa o molde de leitura.
    """

    def __new__(cls, html, dado):
        obj = str.__new__(cls, html)
        obj.dado = dado
        return obj


def dado_de(parte):
    """Dado de uma parte; texto solto vira bloco de HTML cru."""
    return getattr(parte, "dado", None) or {"tipo": "html", "html": str(parte)}


def slug(texto):
    """Gera a âncora de uma seção a partir do próprio título."""
    t = re.sub(r"<[^>]+>", "", texto)
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9\s-]", "", t).strip().lower()
    return re.sub(r"[\s_-]+", "-", t)[:60].strip("-")


def sec(titulo, *partes, id=None):
    # Toda seção ganha âncora: permite link direto para um trecho específico.
    aid = id or slug(titulo)
    return Bloco('      <section class="page-section" id="%s">\n        <h2>%s</h2>\n%s\n      </section>'
                 % (aid, titulo, "\n".join(partes)),
                 {"tipo": "secao", "id": aid, "titulo": titulo, "partes": [dado_de(x) for x in partes]})


def p(texto):
    return Bloco("        <p>%s</p>" % texto, {"tipo": "p", "texto": texto})


def ul(*itens):
    li = "\n".join("          <li>%s</li>" % i for i in itens)
    return Bloco("        <ul class=\"page-list\">\n%s\n        </ul>" % li, {"tipo": "ul", "itens": list(itens)})


def ol(*itens):
    li = "\n".join("          <li>%s</li>" % i for i in itens)
    return Bloco("        <ol class=\"page-steps\">\n%s\n        </ol>" % li, {"tipo": "ol", "itens": list(itens)})


def h3(texto):
    return Bloco("        <h3>%s</h3>" % texto, {"tipo": "h3", "texto": texto})


def nota(texto, titulo="Importante"):
    return Bloco('        <aside class="page-note">\n'
                 '          <strong>%s</strong>\n          <p>%s</p>\n'
                 '        </aside>' % (titulo, texto),
                 {"tipo": "nota", "titulo": titulo, "texto": texto})


def exemplo(titulo, linhas, rodape=None):
    """linhas: lista de (rótulo, valor, classe) — classe: '', 'minus', 'result', 'final'."""
    rows = []
    for rot, val, cls in linhas:
        c = " calc-row--" + cls if cls else ""
        rows.append('            <div class="calc-row%s">\n'
                    '              <span class="calc-label">%s</span>\n'
                    '              <span class="calc-value">%s</span>\n'
                    '            </div>' % (c, rot, val))
    fim = ('\n          <p class="calc-note">%s</p>' % rodape) if rodape else ""
    return Bloco('        <div class="page-example">\n'
                 '          <span class="example-badge">Exemplo ilustrativo</span>\n'
                 '          <h3>%s</h3>\n'
                 '          <div class="calc">\n%s\n          </div>%s\n'
                 '        </div>' % (titulo, "\n".join(rows), fim),
                 {"tipo": "exemplo", "titulo": titulo, "rodape": rodape,
                  "linhas": [{"rotulo": r, "valor": v, "classe": c} for r, v, c in linhas]})


def tabela(cabecalho, linhas):
    # data-rotulo repete o nome da coluna em cada célula: é o que permite a
    # tabela virar cartão por linha no celular, em vez de rolagem lateral
    # (doutrina do Victor, 15/09/2026).
    th = "".join("<th>%s</th>" % c for c in cabecalho)
    trs = "\n".join("            <tr>%s</tr>" %
                    "".join('<td data-rotulo="%s">%s</td>' % (cabecalho[i] if i < len(cabecalho) else "", c)
                            for i, c in enumerate(l)) for l in linhas)
    return Bloco('        <div class="table-wrap">\n          <table class="page-table">\n'
                 '            <thead><tr>%s</tr></thead>\n            <tbody>\n%s\n            </tbody>\n'
                 '          </table>\n        </div>' % (th, trs),
                 {"tipo": "tabela", "cabecalho": list(cabecalho), "linhas": [list(l) for l in linhas]})


def cards(itens):
    """itens: lista de (titulo, texto) ou (titulo, texto, href)."""
    out = []
    for it in itens:
        if len(it) == 3:
            out.append('          <li><a href="%s"><strong>%s</strong><span>%s</span></a></li>'
                       % (it[2], it[0], it[1]))
        else:
            out.append('          <li><div><strong>%s</strong><span>%s</span></div></li>'
                       % (it[0], it[1]))
    return Bloco('        <ul class="card-grid">\n%s\n        </ul>' % "\n".join(out),
                 {"tipo": "cards", "itens": [{"titulo": it[0], "texto": it[1], "href": it[2] if len(it) == 3 else None}
                                             for it in itens]})
