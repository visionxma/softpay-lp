# -*- coding: utf-8 -*-
"""Gera as páginas internas do site em public/.

Uso:  python3 tools/build.py
"""
import io, os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from template import render, BASE
from blocks import sec, p, cards
import c_segmentos, c_solucoes, c_guias, c_perguntas, c_extras

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")

PAGINAS = (c_segmentos.PAGINAS + c_solucoes.PAGINAS + c_guias.PAGINAS
           + c_perguntas.PAGINAS + c_extras.PAGINAS)


def _lista(paginas, prefixo):
    """Cards de um cluster, a partir das próprias páginas já definidas."""
    out = []
    for pg in paginas:
        nome = pg["h1"]
        # usa a primeira frase do intro como resumo do card
        resumo = re.sub(r"<[^>]+>", "", pg["intro"]).split(". ")[0].strip()
        if len(resumo) > 110:
            resumo = resumo[:107].rsplit(" ", 1)[0] + "…"
        out.append((nome, resumo, "/%s/" % pg["slug"]))
    return cards(out)


INDICES = [
  dict(
    slug="segmentos",
    title="Sistema de Gestão por Segmento de Loja | SoftPay",
    description="Veja como o SoftPay atende cada tipo de comércio: mercadinho, loja de roupas, variedades, papelaria, farmácia, distribuidora e pequeno comércio.",
    h1="Feito para o seu tipo de negócio",
    intro="Cada comércio tem uma rotina diferente. Veja como o SoftPay se encaixa no seu.",
    breadcrumbs=[("Segmentos", None)],
    blocks=[sec("Escolha o seu segmento", _lista(c_segmentos.PAGINAS, "segmentos"))],
    related=[("Soluções", "/solucoes/", "Por recurso do sistema"),
             ("Guias", "/guias/", "Como organizar a loja"),
             ("O que é sistema de gestão", "/sistema-de-gestao-para-pequenos-negocios/", "Guia completo")],
  ),
  dict(
    slug="solucoes",
    title="Soluções do SoftPay: PDV, Estoque, Fiado e Mais | SoftPay",
    description="Conheça os recursos do SoftPay: PDV, controle de estoque, fiado, financeiro, NF-e, NFC-e, loja online, clientes e múltiplas lojas.",
    h1="O que o SoftPay resolve",
    intro="Cada recurso existe para responder uma pergunta concreta da sua loja. Veja qual resolve o seu problema.",
    breadcrumbs=[("Soluções", None)],
    blocks=[sec("Escolha pelo que você precisa resolver", _lista(c_solucoes.PAGINAS, "solucoes"))],
    related=[("Segmentos", "/segmentos/", "Pelo seu tipo de loja"),
             ("Preços", "/#pricing", "O que tem em cada plano"),
             ("Guias", "/guias/", "Aprenda o método")],
  ),
  dict(
    slug="guias",
    title="Guias de Gestão para Lojistas | SoftPay",
    description="Guias práticos para organizar sua loja: controle de estoque, caixa, fiado, cálculo de lucro e margem, e como sair do caderno.",
    h1="Guias para organizar sua loja",
    intro="Conteúdo prático, com método e exemplos. Serve mesmo que você não use o SoftPay.",
    breadcrumbs=[("Guias", None)],
    blocks=[sec("Escolha o que você quer resolver", _lista(c_guias.PAGINAS, "guias"))],
    related=[("Perguntas", "/perguntas/", "Dúvidas antes de contratar"),
             ("Soluções", "/solucoes/", "Como o SoftPay ajuda"),
             ("O que é sistema de gestão", "/sistema-de-gestao-para-pequenos-negocios/", "Guia completo")],
  ),
  dict(
    slug="perguntas",
    title="Perguntas Frequentes sobre Sistema de Gestão | SoftPay",
    description="Respostas diretas: quanto custa, se loja pequena precisa, caderno ou sistema, Excel ou sistema, segurança, celular, migração e suporte.",
    h1="Perguntas de quem está avaliando",
    intro="Respostas diretas às dúvidas que aparecem antes de contratar um sistema de gestão.",
    breadcrumbs=[("Perguntas", None)],
    blocks=[sec("O que você quer saber", _lista(c_perguntas.PAGINAS, "perguntas"))],
    related=[("Guias", "/guias/", "Método passo a passo"),
             ("Preços", "/#pricing", "Planos e valores"),
             ("Contato", "/contato/", "Fale com o suporte")],
  ),
]


def main():
    todas = PAGINAS + INDICES
    escritas = []
    for pg in todas:
        html = render(**pg)
        destino = os.path.join(RAIZ, pg["slug"], "index.html")
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        io.open(destino, "w", encoding="utf-8").write(html)
        escritas.append("/%s/" % pg["slug"])
    print("Páginas geradas: %d" % len(escritas))
    for u in escritas:
        print("  " + u)
    return escritas


if __name__ == "__main__":
    main()
