# -*- coding: utf-8 -*-
"""Regenera docs/seo/MAPA-DE-INTERLINKS.md a partir dos links reais do site.

Uso:  python3 tools/mapa_interlinks.py
"""
import io, os, re, glob

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
IGNORAR_ORFA = {"/404"}


def rota(f):
    if f.endswith("index.html"):
        d = os.path.dirname(f)
        return "/" + (d + "/" if d else "")
    return "/" + f[:-5]


def main():
    os.chdir(os.path.join(RAIZ, "public"))
    # tokens de verificação de propriedade não são páginas: são texto solto
    # dentro de um .html, ninguém linka para eles e não devem contar como órfãs
    paginas = sorted(p for p in glob.glob("**/*.html", recursive=True)
                     if not re.match(r"^google[0-9a-f]{16}\.html$", os.path.basename(p)))
    titulos, links = {}, []
    for f in paginas:
        s = io.open(f, encoding="utf-8").read()
        h = re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S)
        titulos[rota(f)] = " ".join(re.sub(r"<[^>]+>", " ", h.group(1)).split()) if h else rota(f)
        for m in re.finditer(r'<a[^>]+href="(/[^"#?]*)"[^>]*>(.*?)</a>', s, re.S):
            destino = m.group(1)
            anchor = re.sub(r"<[^>]+>", "", m.group(2)).strip()
            if destino.startswith("/assets/") or destino in ("/style.css", "/script.js") or not anchor:
                continue
            links.append((rota(f), destino, anchor))
    os.chdir(RAIZ)

    entrantes = {}
    for o, d, _ in links:
        if o != d:
            entrantes.setdefault(d, set()).add(o)

    vistos, ctx = set(), []
    for o, d, a in sorted(links):
        if len(a) <= 18 or o == d or (o, d, a) in vistos:
            continue
        vistos.add((o, d, a))
        ctx.append("| `%s` | `%s` | %s |" % (o, d, a[:70]))

    orfas = sorted(r for r in titulos
                   if not entrantes.get(r) and r != "/" and r not in IGNORAR_ORFA)

    doc = """# Mapa de Interlinks — SoftPay

Atualizado automaticamente. **Gerado a partir dos links reais das páginas**, não
de um plano no papel — se a tabela mostra um link, ele existe no HTML.

Regenere com `python3 tools/mapa_interlinks.py` sempre que adicionar páginas ou
mudar links, para o mapa não virar ficção.

## Fluxo desenhado

```text
Home  →  Segmentos  →  Soluções  →  Guias  →  Perguntas  →  Home
  ↕                        ↕            ↕
  └──────  Página pilar  ──┴────────────┘
```

Cada página termina com um bloco "Continue por aqui" com 3 destinos escolhidos
por relevância, e traz links contextuais dentro do texto.

## Cobertura

| Métrica | Valor |
|---|---|
| Páginas | %d |
| Links internos (com âncora) | %d |
| Links contextuais no corpo | %d |
| Páginas órfãs | %d |

> O `/404` é excluído da checagem de órfãs de propósito: página de erro não
> deve receber link.

## Páginas mais linkadas

| Página | Links de entrada |
|---|---|
%s

## Links contextuais

| Origem | Destino | Âncora |
|---|---|---|
%s

## Páginas órfãs

%s
""" % (
        len(titulos), len(links), len(ctx), len(orfas),
        "\n".join("| `%s` | %d |" % (d, len(o))
                  for d, o in sorted(entrantes.items(), key=lambda x: -len(x[1]))[:12]),
        "\n".join(ctx[:80]),
        ("\n".join("- `%s`" % o for o in orfas) if orfas
         else "Nenhuma. Toda página tem pelo menos um link de entrada."),
    )
    io.open("docs/seo/MAPA-DE-INTERLINKS.md", "w", encoding="utf-8").write(doc)
    print("MAPA-DE-INTERLINKS.md atualizado — %d páginas, %d links, %d órfãs"
          % (len(titulos), len(links), len(orfas)))
    return len(orfas)


if __name__ == "__main__":
    main()
