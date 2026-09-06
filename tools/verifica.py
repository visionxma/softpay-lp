# -*- coding: utf-8 -*-
"""Verificação automática de SEO técnico do site.

Confere, em todas as páginas de public/:
  - estrutura HTML balanceada
  - H1 único por página
  - links internos apontando para rotas que existem
  - title / meta description / H1 duplicados entre páginas
  - toda pergunta do FAQPage presente no HTML visível
  - presença de canonical, Open Graph e description

Uso:   python3 tools/verifica.py
Saída: código 0 se tudo passou, 1 se houve falha.
"""
import io, os, re, sys, json, glob
from html.parser import HTMLParser

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PUBLIC = os.path.join(RAIZ, "public")

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "source", "track", "wbr", "path", "circle", "rect", "line",
        "polyline", "polygon", "ellipse", "stop", "use"}

# links externos ao HTML que não são páginas
NAO_PAGINA = ("/assets/", "/style.css", "/script.js", "/robots.txt",
              "/sitemap.xml", "/_headers", "/_redirects")


class Balanco(HTMLParser):
    def __init__(self):
        super().__init__()
        self.pilha, self.erros = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.pilha.append(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.pilha or self.pilha[-1] != tag:
            self.erros.append(tag)
            if tag in self.pilha:
                while self.pilha and self.pilha.pop() != tag:
                    pass
        else:
            self.pilha.pop()


def rota_de(f):
    if f.endswith("index.html"):
        d = os.path.dirname(f)
        return "/" + (d + "/" if d else "")
    return "/" + f


def main():
    os.chdir(PUBLIC)
    paginas = sorted(glob.glob("**/*.html", recursive=True))

    rotas = set()
    for f in paginas:
        rotas.add(rota_de(f))
        if not f.endswith("index.html"):
            rotas.add("/" + f[:-5])       # /termos além de /termos.html

    falhas = []
    titles, descs, h1s = {}, {}, {}

    for f in paginas:
        s = io.open(f, encoding="utf-8").read()

        b = Balanco()
        b.feed(s)
        if b.erros or b.pilha:
            falhas.append("%s: HTML desbalanceado (fecha %s / abre %s)"
                          % (f, b.erros[:3], b.pilha[:3]))

        n_h1 = len(re.findall(r"<h1[\s>]", s))
        if n_h1 != 1:
            falhas.append("%s: %d tags H1 (esperado 1)" % (f, n_h1))

        for campo, padrao, acc in (
                ("title", r"<title>(.*?)</title>", titles),
                ("description", r'<meta name="description"\s+content="(.*?)"', descs),
                ("h1", r"<h1[^>]*>(.*?)</h1>", h1s)):
            m = re.search(padrao, s, re.S)
            if not m:
                falhas.append("%s: sem %s" % (f, campo))
            else:
                v = " ".join(re.sub(r"<[^>]+>", " ", m.group(1)).split())
                acc.setdefault(v, []).append(f)

        # o 404 é noindex: canonical e Open Graph não se aplicam a ele
        if f != "404.html":
            if 'rel="canonical"' not in s:
                falhas.append("%s: sem canonical" % f)
            if 'property="og:title"' not in s:
                falhas.append("%s: sem Open Graph" % f)

        for href in re.findall(r'href="(/[^"#?]*)"', s):
            if href.startswith(NAO_PAGINA):
                continue
            if href not in rotas:
                falhas.append("%s: link quebrado -> %s" % (f, href))

        m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
        if m:
            try:
                grafo = json.loads(m.group(1))
            except ValueError as e:
                falhas.append("%s: JSON-LD inválido (%s)" % (f, e))
            else:
                for no in grafo.get("@graph", []):
                    if no.get("@type") == "FAQPage":
                        for q in no["mainEntity"]:
                            alvo = (q["name"].replace("&", "&amp;")
                                    .replace('"', "&quot;"))
                            if alvo not in s:
                                falhas.append("%s: pergunta do FAQPage ausente no "
                                              "HTML visível: %s" % (f, q["name"][:60]))

    for campo, acc in (("title", titles), ("description", descs), ("H1", h1s)):
        for valor, arquivos in acc.items():
            if len(arquivos) > 1:
                falhas.append("%s duplicado em %s: %r" % (campo, arquivos, valor[:60]))

    os.chdir(RAIZ)
    print("Páginas verificadas: %d" % len(paginas))
    if falhas:
        print("\nFALHAS (%d):" % len(falhas))
        for f in falhas:
            print("  ✗ " + f)
        return 1
    print("Tudo certo: estrutura, H1, canonical, Open Graph, links internos, "
          "duplicatas e FAQ schema.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
