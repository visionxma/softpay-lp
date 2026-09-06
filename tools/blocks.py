# -*- coding: utf-8 -*-
"""Blocos de conteúdo reutilizáveis (só estrutura; o texto vem de cada página)."""

import re
import unicodedata


def slug(texto):
    """Gera a âncora de uma seção a partir do próprio título."""
    t = re.sub(r"<[^>]+>", "", texto)
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9\s-]", "", t).strip().lower()
    return re.sub(r"[\s_-]+", "-", t)[:60].strip("-")


def sec(titulo, *partes, id=None):
    # Toda seção ganha âncora: permite link direto para um trecho específico.
    aid = id or slug(titulo)
    return ('      <section class="page-section" id="%s">\n        <h2>%s</h2>\n%s\n      </section>'
            % (aid, titulo, "\n".join(partes)))


def p(texto):
    return "        <p>%s</p>" % texto


def ul(*itens):
    li = "\n".join("          <li>%s</li>" % i for i in itens)
    return "        <ul class=\"page-list\">\n%s\n        </ul>" % li


def ol(*itens):
    li = "\n".join("          <li>%s</li>" % i for i in itens)
    return "        <ol class=\"page-steps\">\n%s\n        </ol>" % li


def h3(texto):
    return "        <h3>%s</h3>" % texto


def nota(texto, titulo="Importante"):
    return ('        <aside class="page-note">\n'
            '          <strong>%s</strong>\n          <p>%s</p>\n'
            '        </aside>' % (titulo, texto))


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
    return ('        <div class="page-example">\n'
            '          <span class="example-badge">Exemplo ilustrativo</span>\n'
            '          <h3>%s</h3>\n'
            '          <div class="calc">\n%s\n          </div>%s\n'
            '        </div>' % (titulo, "\n".join(rows), fim))


def tabela(cabecalho, linhas):
    th = "".join("<th>%s</th>" % c for c in cabecalho)
    trs = "\n".join("            <tr>%s</tr>" %
                    "".join("<td>%s</td>" % c for c in l) for l in linhas)
    return ('        <div class="table-wrap">\n          <table class="page-table">\n'
            '            <thead><tr>%s</tr></thead>\n            <tbody>\n%s\n            </tbody>\n'
            '          </table>\n        </div>' % (th, trs))


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
    return '        <ul class="card-grid">\n%s\n        </ul>' % "\n".join(out)
