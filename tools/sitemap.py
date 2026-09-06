# -*- coding: utf-8 -*-
"""Gera public/sitemap.xml a partir das definições em tools/c_*.py.

Inclui a extensão de imagens (image:image) nas páginas que têm foto, o que
ajuda o Google a indexá-las na busca por imagens.

Uso: python3 tools/sitemap.py
"""
import io, os, sys

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import c_segmentos, c_solucoes, c_guias, c_perguntas, c_extras

BASE = "https://site.softpaybr.com"
HOJE = "2026-09-06"


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def main():
    os.chdir(RAIZ)
    urls = [("/", "1.0", "weekly", None),
            ("/sistema-de-gestao-para-pequenos-negocios/", "0.9", "monthly", None)]
    for slug in ["segmentos", "solucoes", "guias", "perguntas"]:
        urls.append(("/%s/" % slug, "0.8", "monthly", None))

    for mod, pri in [(c_segmentos, "0.8"), (c_solucoes, "0.8"),
                     (c_guias, "0.7"), (c_perguntas, "0.6")]:
        for pg in mod.PAGINAS:
            urls.append(("/%s/" % pg["slug"], pri, "monthly", pg.get("figura")))

    for pg in c_extras.PAGINAS:
        if pg["slug"] != "sistema-de-gestao-para-pequenos-negocios":
            urls.append(("/%s/" % pg["slug"], "0.5", "yearly", pg.get("figura")))

    for p in ["/termos", "/privacidade", "/reembolso"]:
        urls.append((p, "0.3", "yearly", None))

    blocos = []
    com_imagem = 0
    for u, pri, cf, fig in urls:
        img = ""
        if fig:
            com_imagem += 1
            img = ("\n    <image:image>\n"
                   "      <image:loc>%s%s</image:loc>\n"
                   "      <image:title>%s</image:title>\n"
                   "    </image:image>" % (BASE, fig[0], esc(fig[1])))
        blocos.append("""  <url>
    <loc>%s%s</loc>
    <lastmod>%s</lastmod>
    <changefreq>%s</changefreq>
    <priority>%s</priority>%s
  </url>""" % (BASE, u, HOJE, cf, pri, img))

    io.open("public/sitemap.xml", "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<!--\n'
        '  Sitemap do SoftPay. Só páginas públicas, indexáveis e canônicas.\n'
        '  Gerado por tools/sitemap.py a partir de tools/c_*.py — não editar à mão.\n'
        '-->\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
        + "\n".join(blocos) + "\n</urlset>\n")
    print("sitemap.xml: %d URLs, %d com imagem" % (len(urls), com_imagem))
    return 0


if __name__ == "__main__":
    sys.exit(main())
