# -*- coding: utf-8 -*-
"""Camada de busca da página inicial (public/index.html, escrita à mão).

A home não nasce de um gerador, então este módulo escreve só o que é de busca,
entre as marcas `busca:inicio` e `busca:fim` dentro do <head>:
  - a verificação do Bing (msvalidate.01);
  - o <link rel=alternate> do llms.txt;
  - o JSON-LD, montado do módulo único (schema_fonte.py): Organization,
    WebSite, SoftwareApplication (Offer só dos planos com preço visível),
    WebPage e FAQPage.

A FAQPage lê as perguntas direto do HTML da home: só entra pergunta que está
visível em QUALQUER largura (as escondidas atrás do botão "Ver mais" e a sexta,
que só aparece em tela larga, ficam de fora).

Rode:  python3 tools/busca_home.py    (o build.py também chama)
"""
import html as _h, io, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import schema_fonte as S

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ARQ = os.path.join(RAIZ, "public", "index.html")
INI, FIM = "<!-- busca:inicio (gerado por tools/busca_home.py; não editar à mão) -->", "<!-- busca:fim -->"


def _limpo(t):
    return " ".join(_h.unescape(re.sub(r"<[^>]+>", " ", t)).split())


def perguntas_visiveis(doc):
    """(pergunta, resposta) dos <details> da FAQ que NÃO têm o atributo hidden."""
    sec = re.search(r'<section[^>]*id="duvidas".*?</section>', doc, re.S)
    if not sec:
        return []
    out = []
    for m in re.finditer(r"<details([^>]*)>\s*<summary[^>]*>(.*?)</summary>\s*<div>(.*?)</div>\s*</details>",
                         sec.group(0), re.S):
        # `hidden` = atrás do "Ver mais"; `data-faq-sexta` = só aparece em tela larga
        if re.search(r"\bhidden\b|data-faq-sexta", m.group(1)):
            continue
        q = _limpo(re.sub(r"<span class=\"faq__mais\">.*?</span>", "", m.group(2), flags=re.S))
        out.append((q, _limpo(m.group(3))))
    return out


def _data_do_arquivo():
    try:
        r = subprocess.run(["git", "log", "-1", "--format=%ad", "--date=short", "--",
                            "public/index.html"], cwd=RAIZ, capture_output=True, text=True)
        return r.stdout.strip() or None
    except OSError:
        return None


def bloco(doc):
    miolo = re.search(r"<main.*?</main>", doc, re.S)
    visivel = miolo.group(0) if miolo else doc
    faq = perguntas_visiveis(doc)
    mod = _data_do_arquivo()
    pagina = {
        "@type": "WebPage", "@id": S.BASE + "/#webpage", "url": S.BASE + "/",
        "name": _limpo(re.search(r"<title>(.*?)</title>", doc, re.S).group(1)),
        "description": _limpo(re.search(r'<meta name="description"\s+content="(.*?)"', doc, re.S).group(1)),
        "inLanguage": "pt-BR", "isPartOf": {"@id": S.ID_SITE}, "about": {"@id": S.ID_APP},
        "primaryImageOfPage": S.BASE + "/assets/desktop.webp",
    }
    if mod:
        pagina["dateModified"] = mod
    grafo = S.nos_do_site(visivel) + [pagina]
    if faq:
        grafo.append({"@type": "FAQPage", "@id": S.BASE + "/#faq", "inLanguage": "pt-BR",
                      "mainEntity": [{"@type": "Question", "name": q,
                                      "acceptedAnswer": {"@type": "Answer", "text": a}}
                                     for q, a in faq]})
    ld = json.dumps({"@context": "https://schema.org", "@graph": grafo}, ensure_ascii=False, indent=2)
    ld = "\n".join("    " + l for l in ld.split("\n"))
    return (INI + "\n"
            '    <meta name="msvalidate.01" content="%s" />\n'
            '    <link rel="alternate" type="text/plain" href="/llms.txt" title="SoftPay para assistentes de IA" />\n'
            '    <script type="application/ld+json">\n%s\n    </script>\n    ' % (S.BING_VERIFICACAO, ld) + FIM)


def aplicar():
    doc = io.open(ARQ, encoding="utf-8").read()
    novo = bloco(doc)
    if INI in doc:
        doc2 = re.sub(re.escape(INI) + r".*?" + re.escape(FIM), lambda m: novo, doc, flags=re.S)
    else:
        ancora = "    <!-- Meta Pixel Code -->"
        assert ancora in doc, "âncora do Pixel não achada na home"
        doc2 = doc.replace(ancora, "    " + novo + "\n\n" + ancora, 1)
    if doc2 != doc:
        io.open(ARQ, "w", encoding="utf-8").write(doc2)
    return doc2 != doc


if __name__ == "__main__":
    print("home: busca %s" % ("atualizada" if aplicar() else "já em dia"))
