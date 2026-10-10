# -*- coding: utf-8 -*-
"""Fonte única da camada de busca: entidade, dados estruturados e datas.

Tudo o que descreve QUEM é o SoftPay para o Google, o Bing e as IAs nasce aqui
e só aqui. O template das internas (template.py) e o injetor da home
(busca_home.py) leem este módulo; nenhum JSON-LD é escrito à mão em HTML.

Regra de ouro: só entra dado que a página mostra. Preço só vira Offer se a
página exibe o plano com o valor; FAQ só vira FAQPage com a pergunta visível;
nota de avaliação, número de clientes e perfis sociais que não existem NÃO
entram (não há nenhum aqui).
"""
import hashlib, io, json, os, re
from datetime import date

BASE = "https://site.softpaybr.com"
APP_SITE = "https://www.softpaybr.com"
RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Código de verificação do Bing Webmaster Tools (o mesmo das outras páginas
# iniciais da casa: a conta é uma só). O do Google já existe na home.
BING_VERIFICACAO = "5E69B07F43190E69D262B300A28AA2EC"

ID_ORG = BASE + "/#organizacao"
ID_SITE = BASE + "/#website"
ID_APP = BASE + "/#softpay"

# Os planos e os valores são os da página de preços. Mudou preço na home?
# Mude aqui também: o conferidor (confere-busca.py) acusa se o preço do schema
# não aparece no texto visível.
PLANOS = [("Nota Fiscal", 65), ("Comércio", 69), ("Loja", 89), ("ERP Completo", 109)]


def organizacao():
    # sameAs: só perfis que existem. Hoje o único endereço próprio do SoftPay
    # fora deste site é o aplicativo. Perfil de rede social entra aqui quando
    # for criado (nenhum foi encontrado em 10/10/2026).
    return {
        "@type": "Organization",
        "@id": ID_ORG,
        "name": "SoftPay",
        "url": BASE + "/",
        "logo": {"@type": "ImageObject", "url": BASE + "/assets/logo.png"},
        "description": ("Sistema de gestão em nuvem para comércio: PDV, estoque, "
                        "caixa, fiado, nota fiscal e loja online."),
        "email": "suporte@softpaybr.com",
        "areaServed": {"@type": "Country", "name": "Brasil"},
        # A VisionX é quem desenvolve o produto (assinatura no rodapé). O @id e os
        # perfis são os que a própria visionxma.com declara no schema dela.
        "parentOrganization": {
            "@type": "Organization",
            "@id": "https://visionxma.com/#organization",
            "name": "VisionX",
            "url": "https://visionxma.com/",
            "sameAs": ["https://www.instagram.com/visionx.dev/",
                       "https://www.linkedin.com/in/visionx-desenvolvedora-de-software-9b23b1373/",
                       "https://github.com/visionxma"],
        },
        "contactPoint": [{
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "suporte@softpaybr.com",
            "telephone": "+55-86-99819-3851",
            "availableLanguage": "pt-BR",
        }],
        "sameAs": [APP_SITE + "/"],
    }


def website():
    return {
        "@type": "WebSite",
        "@id": ID_SITE,
        "url": BASE + "/",
        "name": "SoftPay",
        "inLanguage": "pt-BR",
        "publisher": {"@id": ID_ORG},
    }


def _texto_visivel(html):
    s = re.sub(r"<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", html, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    s = (s.replace("&amp;", "&").replace("&nbsp;", " ").replace("&#8209;", "-"))
    return re.sub(r"\s+", " ", s)


def planos_visiveis(html):
    """Planos cujo nome E valor aparecem juntos (a até 70 caracteres) no texto."""
    t = _texto_visivel(html)
    achados = []
    for nome, preco in PLANOS:
        val = r"R\$\s?%d(?!\d)" % preco
        n = re.escape(nome)
        if re.search(n + r".{0,70}?" + val, t, re.I) or re.search(val + r".{0,70}?" + n, t, re.I):
            achados.append((nome, preco))
    return achados


def software(html_visivel):
    """SoftwareApplication; Offer só para o plano cujo preço a página exibe."""
    no = {
        "@type": "SoftwareApplication",
        "@id": ID_APP,
        "name": "SoftPay",
        "url": BASE + "/",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "Sistema de gestão comercial (ERP, PDV e estoque)",
        "operatingSystem": "Web (navegador, computador, celular e tablet)",
        "inLanguage": "pt-BR",
        "description": ("PDV, controle de estoque, caixa, fiado, clientes, nota fiscal "
                        "e loja online no mesmo sistema, com 7 dias de teste grátis."),
        "publisher": {"@id": ID_ORG},
        "provider": {"@id": ID_ORG},
    }
    ofertas = planos_visiveis(html_visivel)
    if ofertas:
        no["offers"] = [{
            "@type": "Offer",
            "name": "Plano " + nome,
            "price": "%d.00" % preco,
            "priceCurrency": "BRL",
            "description": "Valor mensal, com 7 dias de teste grátis e sem cartão de crédito.",
            "url": BASE + "/#planos",
            "availability": "https://schema.org/InStock",
        } for nome, preco in ofertas]
    return no


def nos_do_site(html_visivel):
    return [organizacao(), website(), software(html_visivel)]


# ------------------------------------------------------------------ datas
# Datas reais, por página. datePublished = dia do primeiro commit da página;
# dateModified = dia da última mudança no CONTEÚDO (título, introdução, blocos
# e FAQ). Mudança de menu, rodapé ou bloco "veja também" não conta. A semente
# (datas-paginas.seed.json) saiu do histórico do git; daí em diante o build
# compara o hash do conteúdo e só avança o dateModified quando ele muda.
ARQ_DATAS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datas-paginas.json")
ARQ_SEMENTE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datas-paginas.seed.json")
_datas = None


def _carregar():
    global _datas
    if _datas is None:
        _datas = {}
        for arq in (ARQ_SEMENTE, ARQ_DATAS):
            if os.path.exists(arq):
                _datas.update(json.load(io.open(arq, encoding="utf-8")))
    return _datas


def hash_conteudo(pg):
    base = "|".join([pg.get("h1", ""), pg.get("intro", ""), "".join(pg.get("blocks", [])),
                     json.dumps(pg.get("faq") or [], ensure_ascii=False)])
    return hashlib.sha1(base.encode("utf-8")).hexdigest()[:12]


def datas_de(pg):
    """(publicado, modificado) da página; avança o modificado se o conteúdo mudou."""
    d = _carregar()
    slug, h = pg["slug"], hash_conteudo(pg)
    reg = d.get(slug)
    hoje = date.today().isoformat()
    if reg is None:
        reg = d[slug] = {"publicado": hoje, "modificado": hoje, "hash": h}
    elif "hash" not in reg:
        reg["hash"] = h                      # primeira vez: fixa sem mexer na data
    elif reg["hash"] != h:
        reg["hash"], reg["modificado"] = h, hoje
    return reg["publicado"], reg["modificado"]


def gravar_datas():
    if _datas is not None:
        io.open(ARQ_DATAS, "w", encoding="utf-8").write(
            json.dumps(_datas, ensure_ascii=False, indent=1, sort_keys=True) + "\n")
