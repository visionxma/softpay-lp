# -*- coding: utf-8 -*-
"""Gera as páginas internas do site em public/.

Uso:  python3 tools/build.py
"""
import io, os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from template import render, BASE
from blocks import sec, p, ul, nota, tabela, cards
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
    description="Veja como o SoftPay atende cada tipo de comércio: mercadinho, roupas, variedades, papelaria, farmácia, distribuidora, celulares, autopeças, construção, joias, filiais e MEI.",
    h1="Feito para o seu tipo de negócio",
    intro="Cada comércio tem uma rotina diferente, e um sistema que serve para todo mundo costuma não servir direito para ninguém. Estas páginas mostram o que muda no SoftPay quando a loja é a sua.",
    breadcrumbs=[("Segmentos", None)],
    blocks=[
      sec("Para que tipo de negócio o SoftPay foi feito",
        p("O SoftPay é um sistema de gestão comercial para <strong>comércio que vende produto e controla estoque</strong>. Ele se encaixa bem quando a loja tem estas características:"),
        ul("<strong>Vende produto físico</strong>, com entrada de mercadoria e baixa a cada venda.",
           "<strong>Tem de 1 a 10 pessoas com acesso ao sistema</strong> — o teto do plano ERP Completo.",
           "<strong>Já sente a perda de controle:</strong> estoque incerto, fiado no caderno, caixa que não fecha.",
           "<strong>Não quer implantação nem servidor na loja.</strong> Roda no navegador, no computador ou no celular."),
        p("Se a sua loja tem esse formato, é bem provável que um dos segmentos abaixo descreva a sua rotina — e, se nenhum descrever exatamente, a base é a mesma."),
      ),
      sec("Escolha o seu segmento", _lista(c_segmentos.PAGINAS, "segmentos")),
      sec("Do seu segmento para o recurso que resolve",
        p("As páginas de segmento contam a rotina do seu negócio. As de <a href=\"/solucoes/\">soluções</a> explicam cada recurso por dentro. Este é o caminho de uma para a outra:"),
        tabela(["Se o seu problema é…", "O recurso", "Onde ele aparece"], [
          ["Não sei o que tenho em estoque",
           "<a href=\"/solucoes/sistema-de-estoque/\">Controle de estoque</a>",
           "Todos os segmentos. Essencial em mercadinho, variedades e distribuidora"],
          ["A fila trava no caixa",
           "<a href=\"/solucoes/sistema-pdv/\">Sistema PDV</a>",
           "Mercadinho, papelaria, farmácia"],
          ["O mesmo item existe em tamanhos e cores",
           "Variações, no <a href=\"/solucoes/sistema-de-estoque/\">estoque</a>",
           "Loja de roupas e loja de joias. A partir do plano Loja"],
          ["Não sei quem me deve",
           "<a href=\"/solucoes/controle-de-fiado/\">Controle de fiado</a>",
           "Mercadinho, farmácia, joias, pequeno comércio"],
          ["Registrar exige parar o atendimento",
           "<a href=\"/solucoes/bot-whatsapp/\">Bot do WhatsApp</a>",
           "Todos. A partir do plano Loja"],
          ["Preciso emitir nota fiscal",
           "<a href=\"/solucoes/nfe/\">NF-e e NFC-e</a>",
           "Distribuidora, autopeças, materiais de construção"],
          ["Tenho mais de um ponto de venda",
           "<a href=\"/solucoes/multiplas-lojas/\">Múltiplas lojas</a>",
           "Empresas com filiais e distribuidora"],
          ["Quero vender além da loja física",
           "<a href=\"/solucoes/loja-online/\">Loja online</a>",
           "Roupas, variedades, joias. A partir do plano Loja"],
        ]),
      ),
      sec("Não achou o seu segmento?",
        p("A base é a mesma para qualquer comércio com estoque: PDV, caixa, estoque, fiado, clientes e relatórios. Se a sua loja não tem página própria, comece pela de <a href=\"/segmentos/pequeno-comercio/\">pequeno comércio e MEI</a> — ela descreve o que vale para todos."),
        p("Também vale ser direto sobre onde o SoftPay <strong>não</strong> é a escolha certa hoje: pizzaria e delivery, prestadores de serviço com agenda e ordem de serviço, gestão de franquia e redes com mais de dez acessos simultâneos. Nesses casos falta recurso específico, e dizer isso antes é melhor que você descobrir durante o teste."),
        nota("Cada página de segmento traz um bloco com o que o sistema <strong>não</strong> faz naquele ramo. Vale ler esse bloco antes do resto — ele responde mais rápido se o SoftPay serve para você.", "Como ler estas páginas"),
      ),
    ],
    cta_title="Teste no seu próprio balcão",
    cta_text="Sete dias grátis, sem cartão de crédito. Cadastre os produtos de maior giro, passe algumas vendas e veja se a rotina melhora.",
    related=[("Soluções", "/solucoes/", "Por recurso do sistema"),
             ("Guias", "/guias/", "Como organizar a loja"),
             ("Preços", "/#pricing", "O que tem em cada plano"),
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
