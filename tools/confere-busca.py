#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Conferidor da camada de busca: sai 1 se algo da lista abaixo falhar.

Roda sobre public/ (padrão) ou sobre o site no ar (--url https://...).
Para cada página do sitemap confere:
  - título <= 60 caracteres e descrição entre 120 e 160;
  - canonical ABSOLUTO e igual ao endereço da página; um único <h1>;
  - JSON-LD presente (menos nas páginas legais), todo válido, com Organization
    de @id estável e sameAs preenchido, WebSite, e BreadcrumbList nas internas;
  - FAQPage: cada pergunta aparece no texto VISÍVEL da mesma página (as
    escondidas por `hidden` ou `data-faq-sexta` não valem);
  - Offer: o preço de cada oferta aparece no texto visível, junto ao nome do plano;
  - nenhum AggregateRating/Review (o site não exibe avaliações de clientes);
  - Article com datePublished <= dateModified <= hoje;
Ainda confere: verificação do Bing na home; robots.txt com TODOS os rastreadores
do protocolo; llms-full.txt com todas as páginas do sitemap, listado no
llms.txt e servido como text/plain (_headers); lastmod do sitemap real; e a
ligação interna: toda página fora do índice recebe >= 3 links, dentro do
<main>, de páginas já indexadas (tools/interlinks.py).

Uso:  python3 tools/confere-busca.py [--url https://site.softpaybr.com] [--tabela]
"""
import html as _h, io, json, os, re, sys, urllib.request
from datetime import date

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import interlinks, robots as robots_mod, schema_fonte  # noqa: E402

PUBLIC = os.environ.get("CONFERE_PUBLIC") or os.path.join(AQUI, "..", "public")
BASE = schema_fonte.BASE
LEGAIS = {"/termos", "/privacidade", "/reembolso"}          # sem JSON-LD, de propósito
TOPO = 60
DESC = (120, 160)

falhas, avisos = [], []
fonte_url = None


def ler(rota_ou_arquivo):
    """Texto de uma rota ('/x/') ou de um arquivo da raiz ('/robots.txt')."""
    if fonte_url:
        req = urllib.request.Request(fonte_url + rota_ou_arquivo, headers={"User-Agent": "confere-busca"})
        try:
            return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
        except Exception as e:
            return None
    caminho = rota_ou_arquivo.lstrip("/")
    if rota_ou_arquivo.endswith("/") or caminho == "":
        arq = os.path.join(PUBLIC, caminho, "index.html")
    elif "." in caminho.rsplit("/", 1)[-1]:
        arq = os.path.join(PUBLIC, caminho)
    else:
        arq = os.path.join(PUBLIC, caminho + ".html")
    return io.open(arq, encoding="utf-8").read() if os.path.exists(arq) else None


def falha(rota, msg):
    falhas.append("%s: %s" % (rota, msg))


def norm(t):
    return " ".join(_h.unescape(t).split()).lower()


def texto_visivel(doc, so_main=True):
    m = re.search(r"<main.*?</main>", doc, re.S) if so_main else None
    s = m.group(0) if m else doc
    s = re.sub(r"<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", s, flags=re.S)
    # perguntas atrás do "Ver mais" ou só de tela larga não contam como visíveis
    s = re.sub(r"<details[^>]*(?:\bhidden\b|data-faq-sexta)[^>]*>.*?</details>", " ", s, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    return norm(s)


def nos(obj):
    if isinstance(obj, list):
        for o in obj:
            yield from nos(o)
    elif isinstance(obj, dict):
        if "@graph" in obj:
            yield from nos(obj["@graph"])
        else:
            yield obj
            for v in obj.values():
                if isinstance(v, (dict, list)):
                    yield from nos(v)


def tipos(n):
    t = n.get("@type", [])
    return set(t if isinstance(t, list) else [t])


def conferir_pagina(rota, doc):
    url = BASE + rota
    t = re.search(r"<title>(.*?)</title>", doc, re.S)
    titulo = norm(t.group(1)) if t else ""
    if not titulo:
        falha(rota, "sem <title>")
    elif len(titulo) > TOPO:
        falha(rota, "título com %d caracteres (teto %d): %s" % (len(titulo), TOPO, titulo))
    d = re.findall(r'<meta name="description"\s+content="(.*?)"', doc, re.S)
    if len(d) != 1:
        falha(rota, "%d tags <meta name=description> (esperado 1)" % len(d))
    else:
        n = len(norm(d[0]))
        if not DESC[0] <= n <= DESC[1]:
            falha(rota, "descrição com %d caracteres (faixa %d-%d)" % (n, *DESC))
    c = re.search(r'<link rel="canonical" href="(.*?)"', doc)
    if not c or not c.group(1).startswith("https://"):
        falha(rota, "canonical ausente ou relativo")
    elif c.group(1) != url:
        falha(rota, "canonical %s diferente do endereço %s" % (c.group(1), url))
    if len(re.findall(r"<h1[\s>]", doc)) != 1:
        falha(rota, "esperado exatamente 1 <h1>")
    if 'lang="pt-BR"' not in doc[:200]:
        falha(rota, 'sem lang="pt-BR"')

    blocos = re.findall(r'<script type="application/ld\+json">(.*?)</script>', doc, re.S)
    if rota in LEGAIS:
        return titulo, d, []
    if not blocos:
        falha(rota, "sem nenhum bloco JSON-LD no HTML servido")
        return titulo, d, []
    todos = []
    for b in blocos:
        try:
            todos += [n for n in nos(json.loads(b)) if isinstance(n, dict)]
        except ValueError as e:
            falha(rota, "JSON-LD inválido: %s" % e)
    ts = set().union(*(tipos(n) for n in todos)) if todos else set()
    org = [n for n in todos if "Organization" in tipos(n) and n.get("@id")]
    if not org:
        falha(rota, "sem Organization com @id estável")
    elif not org[0].get("sameAs"):
        falha(rota, "Organization sem sameAs")
    if "WebSite" not in ts:
        falha(rota, "sem WebSite")
    if rota != "/" and "BreadcrumbList" not in ts:
        falha(rota, "página interna sem BreadcrumbList")
    if ts & {"AggregateRating", "Review", "Rating"} or any("aggregateRating" in n or "review" in n for n in todos):
        falha(rota, "tem avaliação (AggregateRating/Review) e o site não exibe avaliações de clientes")

    vis = texto_visivel(doc)
    for n in todos:
        if "FAQPage" in tipos(n):
            for q in n.get("mainEntity", []):
                nome = norm(q.get("name", ""))
                if nome not in vis:
                    falha(rota, "FAQPage marca pergunta que não está visível: %s" % nome[:70])
        if tipos(n) & {"Article", "BlogPosting"}:
            p, m = n.get("datePublished"), n.get("dateModified")
            if not p or not m or not (p <= m <= date.today().isoformat()):
                falha(rota, "Article com datas incoerentes (publicado=%s, modificado=%s)" % (p, m))
        for o in (n.get("offers") or []) if isinstance(n.get("offers"), list) else ([n["offers"]] if n.get("offers") else []):
            preco = int(float(o.get("price", 0)))
            plano = re.sub(r"^plano\s+", "", norm(o.get("name", "")))
            ok = re.search(r"%s.{0,70}?r\$\s?%d(?!\d)|r\$\s?%d(?!\d).{0,70}?%s" % (
                re.escape(plano), preco, preco, re.escape(plano)), vis)
            if not ok:
                falha(rota, "Offer 'R$ %d' (%s) sem esse preço visível na página" % (preco, plano))
    return titulo, d, todos


def principais(doc):
    m = re.search(r"<main.*?</main>", doc, re.S)
    return m.group(0) if m else ""


def destino(h):
    h = h.split("#")[0].split("?")[0]
    if h.startswith(BASE):
        h = h[len(BASE):]
    if not h.startswith("/"):
        return None
    if h.endswith(".html"):
        return h[:-5]                       # /termos.html -> /termos (sem barra final)
    if h != "/" and not h.endswith("/") and "." not in h.rsplit("/", 1)[-1]:
        h += "/"
    return h


def main():
    global fonte_url
    args = sys.argv[1:]
    if "--url" in args:
        fonte_url = args[args.index("--url") + 1].rstrip("/")
    sm = ler("/sitemap.xml")
    if not sm:
        print("sitemap.xml não encontrado")
        return 1
    rotas = [u[len(BASE):] or "/" for u in re.findall(r"<loc>(.*?)</loc>", sm)]
    for lm in re.findall(r"<lastmod>(.*?)</lastmod>", sm):
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", lm) or lm > date.today().isoformat():
            falhas.append("sitemap: lastmod inválido ou no futuro: %s" % lm)
    if len(set(re.findall(r"<lastmod>(.*?)</lastmod>", sm))) < 2:
        falhas.append("sitemap: todas as páginas com o mesmo lastmod (data não é real)")

    paginas, linhas = {}, []
    for rota in rotas:
        doc = ler(rota)
        if doc is None and rota in LEGAIS:
            doc = ler(rota + ".html")
        if doc is None:
            falha(rota, "página do sitemap não encontrada")
            continue
        paginas[rota] = doc
        titulo, d, grafo = conferir_pagina(rota, doc)
        linhas.append((rota, len(titulo), len(norm(d[0])) if d else 0,
                       ",".join(sorted({t for n in grafo for t in tipos(n)}
                                       & {"Organization", "WebSite", "SoftwareApplication", "FAQPage",
                                          "BreadcrumbList", "Article", "HowTo"}))))

    # home: verificação do Bing
    if 'name="msvalidate.01"' not in paginas.get("/", ""):
        falha("/", "sem a verificação do Bing (msvalidate.01)")

    # ligação interna: links de páginas indexadas, dentro do <main>
    indexadas = {"/" + s + "/" for s in interlinks.INDEXADAS} | {"/"}
    sitewide = {"/" + s + "/" for s in interlinks.SITEWIDE}
    recebe = {r: set() for r in paginas}
    recebe_qualquer = {r: set() for r in paginas}
    for origem, doc in paginas.items():
        if origem not in indexadas:
            continue
        for h in re.findall(r'href="([^"]+)"', principais(doc)):
            t = destino(h)
            if t in recebe and t != origem:
                recebe[t].add(origem)
        for h in re.findall(r'href="([^"]+)"', re.sub(r"<(script|style)[^>]*>.*?</\1>", "", doc, flags=re.S)):
            t = destino(h)
            if t in recebe_qualquer and t != origem:
                recebe_qualquer[t].add(origem)
    entrada = {}
    for r in paginas:
        if r in indexadas:
            continue
        n = len(recebe[r])
        entrada[r] = n
        if r in sitewide or r in LEGAIS:
            if len(recebe_qualquer[r]) < interlinks.MINIMO:
                falha(r, "recebe só %d link(s) de páginas indexadas (mínimo %d)" % (len(recebe_qualquer[r]), interlinks.MINIMO))
        elif n < interlinks.MINIMO:
            falha(r, "recebe só %d link(s) no conteúdo de páginas indexadas (mínimo %d)" % (n, interlinks.MINIMO))

    # robots.txt
    rb = ler("/robots.txt") or ""
    faltam = [r for r in robots_mod.ROBOS if not re.search(r"(?im)^user-agent:\s*%s\s*$" % re.escape(r), rb)]
    if faltam:
        falhas.append("robots.txt sem os rastreadores: " + ", ".join(faltam))
    if "Sitemap: %s/sitemap.xml" % BASE not in rb:
        falhas.append("robots.txt sem a linha Sitemap")

    # llms.txt e llms-full.txt
    ll = ler("/llms.txt") or ""
    full = ler("/llms-full.txt")
    if not full:
        falhas.append("llms-full.txt ausente")
    else:
        for rota in rotas:
            if "Endereço: %s%s\n" % (BASE, rota) not in full:
                falhas.append("llms-full.txt sem a página %s" % rota)
        if "/llms-full.txt" not in ll:
            falhas.append("llms.txt não lista o llms-full.txt")
    hd = io.open(os.path.join(PUBLIC, "_headers"), encoding="utf-8").read()
    if not re.search(r"/llms-full\.txt\s*\n\s*Content-Type: text/plain", hd):
        falhas.append("_headers sem Content-Type text/plain para /llms-full.txt")
    for h in re.findall(r"\]\((https://site\.softpaybr\.com[^)]*)\)", ll):
        r = destino(h)
        if r and r not in paginas and not r.endswith(".txt"):
            falhas.append("llms.txt aponta para página fora do sitemap: %s" % h)

    if "--tabela" in args:
        print("%-52s %5s %5s %4s  %s" % ("página", "título", "desc", "ent", "JSON-LD"))
        for rota, t, d, ld in linhas:
            print("%-52s %5d %5d %4s  %s" % (rota[:52], t, d, entrada.get(rota, "-"), ld))
    print("Páginas conferidas: %d" % len(paginas))
    for a in avisos:
        print("  aviso: " + a)
    if falhas:
        print("\nFALHAS (%d):" % len(falhas))
        for f in falhas:
            print("  ✗ " + f)
        return 1
    print("Tudo certo: títulos, descrições, canonical, JSON-LD, FAQ visível, preços, datas, "
          "robots, llms-full e ligação interna.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
