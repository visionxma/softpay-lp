# -*- coding: utf-8 -*-
"""Gera public/llms-full.txt: o texto integral do site em Markdown puro.

Lê o <main> de cada página publicada (na ordem do sitemap) e o converte em
texto: títulos, parágrafos, listas, tabelas e as perguntas com respostas. Fica
de fora o que não é conteúdo (menu, rodapé, botões, ícones, scripts, bloco
"veja também"). Quem lê é assistente de IA: texto limpo, uma URL por página.

Uso: python3 tools/llms_full.py
"""
import html, io, os, re, sys
from html.parser import HTMLParser

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PUBLIC = os.path.join(RAIZ, "public")
BASE = "https://site.softpaybr.com"
PULAR = {"script", "style", "noscript", "svg", "button", "nav", "iframe", "video", "picture", "form", "template"}
VAZIOS = {"br", "img", "hr", "input", "meta", "link", "source", "track", "wbr", "col", "area", "base", "embed"}
PULAR_CLASSE = ("page-related", "page-mais", "page-cta", "breadcrumb", "so-leitor", "whatsapp-float", "float-cta")


class Extrator(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pilha, self.saida, self.cel, self.linha, self.dentro_main = [], [], None, None, False
        self.pulando = 0

    def _classe(self, attrs):
        return dict(attrs).get("class") or ""

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "main":
            self.dentro_main = True
        if not self.dentro_main:
            return
        if tag in VAZIOS:
            if tag == "br" and not self.pulando:
                self.saida.append(" ")
            return
        pula = (tag in PULAR or any(c in self._classe(attrs) for c in PULAR_CLASSE)
                or d.get("aria-hidden") == "true")
        self.pilha.append((tag, pula))
        if pula:
            self.pulando += 1
            return
        if self.pulando:
            return
        if tag in ("h1", "h2", "h3", "h4", "summary"):
            self.saida.append("\n\n" + {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### ", "summary": "### "}[tag])
        elif tag in ("p", "div", "section", "article", "details", "ul", "ol", "table", "figure", "blockquote"):
            self.saida.append("\n")
        elif tag == "li":
            self.saida.append("\n- ")
        elif tag == "tr":
            self.linha = []
        elif tag in ("td", "th"):
            self.cel = []

    def handle_endtag(self, tag):
        if tag == "main":
            self.dentro_main = False
        if tag in VAZIOS or not self.dentro_main or not self.pilha:
            return
        for i in range(len(self.pilha) - 1, -1, -1):
            if self.pilha[i][0] == tag:
                _, pula = self.pilha[i]
                del self.pilha[i:]
                if pula:
                    self.pulando -= 1
                    return
                break
        if self.pulando:
            return
        if tag in ("td", "th") and self.cel is not None:
            if self.linha is not None:
                self.linha.append(" ".join("".join(self.cel).split()))
            self.cel = None
        elif tag == "tr" and self.linha is not None:
            self.saida.append("\n| " + " | ".join(self.linha) + " |")
            self.linha = None
        elif tag in ("h1", "h2", "h3", "h4", "summary", "p", "li"):
            self.saida.append("\n")

    def handle_data(self, data):
        if not self.dentro_main or self.pulando:
            return
        t = re.sub(r"\s+", " ", data)
        if not t.strip():
            if self.cel is not None:
                self.cel.append(" ")
            elif self.saida and not self.saida[-1].endswith(("\n", " ")):
                self.saida.append(" ")
            return
        (self.cel if self.cel is not None else self.saida).append(t)


def texto_da_pagina(doc):
    ex = Extrator()
    ex.feed(doc)
    t = "".join(ex.saida)
    t = re.sub(r"[ \t]+\n", "\n", t)
    t = re.sub(r"\n[ \t]+", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    t = re.sub(r"\n\n(?=- )", "\n", t)          # itens de lista colados
    t = re.sub(r"\n\n(?=\|)", "\n", t)          # linhas de tabela coladas
    return t.strip()


def _meta(doc, padrao):
    m = re.search(padrao, doc, re.S)
    return " ".join(html.unescape(m.group(1)).split()) if m else ""


def arquivo_da_rota(rota):
    caminho = rota.strip("/")
    if rota.endswith("/") or caminho == "":
        return os.path.join(PUBLIC, caminho, "index.html")
    return os.path.join(PUBLIC, caminho + ".html")


def rotas_do_sitemap():
    sm = io.open(os.path.join(PUBLIC, "sitemap.xml"), encoding="utf-8").read()
    return [u[len(BASE):] or "/" for u in re.findall(r"<loc>(.*?)</loc>", sm)]


def gerar():
    partes = ["# SoftPay — conteúdo integral do site",
              "",
              "> Texto completo das páginas públicas de %s, em Markdown, para assistentes de IA. "
              "O resumo curto está em %s/llms.txt." % (BASE, BASE),
              "",
              "Cada seção abaixo é uma página: título, endereço e o texto como ela mostra. "
              "Preços, planos e o que o sistema não faz são os da própria página."]
    n = 0
    for rota in rotas_do_sitemap():
        arq = arquivo_da_rota(rota)
        if not os.path.exists(arq):
            continue
        doc = io.open(arq, encoding="utf-8").read()
        if re.search(r'<meta name="robots" content="noindex', doc):
            continue
        titulo = _meta(doc, r"<title>(.*?)</title>")
        corpo = texto_da_pagina(doc)
        partes += ["", "---", "", "Página: " + titulo, "Endereço: " + BASE + rota, "", corpo]
        n += 1
    saida = "\n".join(partes).rstrip() + "\n"
    io.open(os.path.join(PUBLIC, "llms-full.txt"), "w", encoding="utf-8").write(saida)
    return n, len(saida)


SECOES = [("Páginas principais", ("/sistema-de-gestao-para-pequenos-negocios/", "/sobre/", "/contato/")),
          ("Para quem é (por tipo de negócio)", "/segmentos/"),
          ("Soluções (por recurso)", "/solucoes/"),
          ("Guias (conteúdo de apoio, sem exigir o produto)", "/guias/"),
          ("Comparativos", "/comparativos/"),
          ("Perguntas de quem está avaliando", "/perguntas/"),
          ("Blog do lojista", "/blog/")]


def _h1(doc):
    return _meta(doc, r"<h1[^>]*>(.*?)</h1>") and " ".join(
        html.unescape(re.sub(r"<[^>]+>", " ", re.search(r"<h1[^>]*>(.*?)</h1>", doc, re.S).group(1))).split())


def atualizar_llms_txt():
    """Refaz as listas de páginas do llms.txt a partir do sitemap. O resumo, os
    planos e o "o que não é" (acima da primeira lista) continuam escritos à mão."""
    arq = os.path.join(PUBLIC, "llms.txt")
    atual = io.open(arq, encoding="utf-8").read()
    marcas = [atual.index(m) for m in ("## Páginas principais", "## Para quem é") if m in atual]
    if not marcas:
        raise SystemExit("llms.txt sem a marca '## Para quem é': nada foi alterado")
    corte = min(marcas)
    contato = atual[atual.index("## Contato"):] if "## Contato" in atual else ""
    rotas = rotas_do_sitemap()
    out = []
    for titulo, filtro in SECOES:
        if isinstance(filtro, tuple):
            alvo = [r for r in rotas if r in filtro]
        else:
            alvo = [r for r in rotas if r.startswith(filtro) and r != filtro]
            if filtro in rotas:
                alvo = [filtro] + alvo
        linhas = []
        for r in alvo:
            doc = io.open(arquivo_da_rota(r), encoding="utf-8").read()
            linhas.append("- [%s](%s%s)" % (_h1(doc), BASE, r))
        out.append("## %s\n\n%s\n" % (titulo, "\n".join(linhas)))
    out.append("## Texto completo do site\n\n- [llms-full.txt](%s/llms-full.txt): o conteúdo integral das "
               "páginas acima, em texto puro.\n" % BASE)
    novo = atual[:corte] + "\n".join(out) + "\n" + contato
    io.open(arq, "w", encoding="utf-8").write(novo)


if __name__ == "__main__":
    n, tam = gerar()
    atualizar_llms_txt()
    print("llms-full.txt: %d páginas, %d bytes; llms.txt atualizado" % (n, tam))
