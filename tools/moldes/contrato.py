#!/usr/bin/env python3
"""Gera rotas-clonadas.json (raiz do projeto) a partir de tools/moldes/mapa-de-fontes.tsv.

Todas as rotas geradas pelo build entram em `exigir`: o portão geral
(`portao-rotas-clonadas.mjs rotas-clonadas.json`) mostra quantas ainda faltam
virar clone. Sai 1 se uma rota do build não tiver fonte ou se uma fonte se repetir.

uso: python3 tools/moldes/contrato.py
"""
import json, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
sys.path.insert(0, os.path.join(RAIZ, "tools"))


def main():
    rotas = {}
    for linha in open(os.path.join(AQUI, "mapa-de-fontes.tsv"), encoding="utf-8"):
        if not linha.strip() or linha.startswith("#"):
            continue
        slug, molde, url = linha.rstrip("\n").split("\t")
        rotas["/%s/" % slug] = {"molde": molde, "referencia": url, "pasta": "moldes/" + molde}
    erros = []
    for campo in ("molde", "referencia"):
        vistos = {}
        for r, e in rotas.items():
            if e[campo] in vistos:
                erros.append("%s repetido: %s em %s e %s" % (campo, e[campo], vistos[e[campo]], r))
            vistos[e[campo]] = r
    import build
    geradas = ["/%s/" % pg["slug"] for pg in build.PAGINAS + build.INDICES]
    for r in geradas:
        if r not in rotas:
            erros.append("rota sem fonte: " + r)
    for r in rotas:
        if r not in geradas:
            erros.append("fonte para rota que o build não gera: " + r)
    if erros:
        print("\n".join(erros))
        return 1
    contrato = {
        "dominio": "site.softpaybr.com",
        "observacao": ("Cada rota de SEO é clone, pela captura renderizada, de uma LP diferente "
                       "(regra rota-de-seo-e-clone-de-lp-diferente). A home (/) é a LP principal e não entra. "
                       "Fonte por rota: tools/moldes/mapa-de-fontes.tsv. Rota cujo molde ainda não tem "
                       "molde.mjs continua no molde de leitura até a onda dela."),
        "exigir": geradas,
        "rotas": rotas,
    }
    with open(os.path.join(RAIZ, "rotas-clonadas.json"), "w", encoding="utf-8") as f:
        json.dump(contrato, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("rotas-clonadas.json: %d rotas, %d exigidas, nenhuma fonte repetida" % (len(rotas), len(geradas)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
