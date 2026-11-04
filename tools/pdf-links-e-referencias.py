#!/usr/bin/env python3
"""PDF com TODOS os links do SoftPay e, ao lado de cada um, a referência em que a página se baseou.

Pedido do Victor (03/11/2026): "um PDF com link clicável ... cada link do SoftPay e a referência ao lado do que ele foi
baseado. E todos devem ser links clicáveis."

  python3 tools/pdf-links-e-referencias.py [--provas /tmp/sp-zap-v2/provas.json] [--data 03-11-2026] [--so-html]

De onde vem cada coisa (nada é escrito à mão aqui, a não ser as origens antigas listadas em ORIGEM_FIXA):
  - a lista de links e a prova de cada um (200 direto, título): provas.json do tools/links-do-grupo.py;
  - a referência de cada rota de SEO: tools/moldes/mapa-de-fontes.tsv (rota, molde, URL da referência);
  - se o clone já está aplicado: public/<rota>/index.html contém a classe "mx-<molde>" que o vestir.mjs põe no <main>.
Política de 04/11/2026 (`jarvis manual pdf-de-links-com-referencia-no-grupo-admin`): toda LP com referência ao lado,
situação lida no HTML SERVIDO (produção e prévia), e --drive sobe no link fixo do Drive (drive link … softpay).
Saída: ~/Documents/VisionX Docs/SoftPay/SoftPay-Links-e-Referencias-<data>.pdf (corpo em .../SoftPay/fonte/), pelo
gera-doc --produto visionx. Depois de gerar, confere que cada URL da tabela virou anotação de link no PDF (sai 1 se não).
"""
import datetime
import html
import importlib.util
import json
import os
import subprocess
import sys
import urllib.parse

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.expanduser("~/Documents/VisionX Docs/SoftPay")
TSV = os.path.join(RAIZ, "tools/moldes/mapa-de-fontes.tsv")


def arg(nome, padrao=None):
    return sys.argv[sys.argv.index(nome) + 1] if nome in sys.argv else padrao


def _provas_mais_novas():
    # O padrão fixo em /tmp/sp-zap-v2 já fez o PDF sair sem os perfis de diretório (04/11/2026: a v3 tinha
    # o B2B Stack e o Portal Software; a v2, não). Sem --provas, vale a rodada mais nova do links-do-grupo.py.
    import glob
    achados = sorted(glob.glob("/tmp/sp-zap-v*/provas.json"), key=os.path.getmtime)
    return achados[-1] if achados else "/tmp/sp-zap-v2/provas.json"


PROVAS = arg("--provas") or _provas_mais_novas()
DATA = arg("--data", datetime.date.today().strftime("%d-%m-%Y"))
MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro",
         "novembro", "dezembro"]

# Origem das páginas que não estão no mapa de moldes. Campanhas: clones de 25/09/2026 (memória
# softpay-lp-campanhas-e-fonte-stone; capturas em ~/.jarvis/referencias/softpay-clones/<dominio>/ai-brief.md).
ORIGEM_FIXA = {
    "campanha/teste-gratis": ("https://lp.gestaomaissimples.com.br/lp/gratis", "Gestão Mais Simples", "clone no ar desde 25/09"),
    "campanha/pdv": ("https://www.muvypdv.com.br/", "Muvy PDV", "clone no ar desde 25/09"),
    "campanha/gestao": ("https://www.nextar.com.br/", "Nextar", "clone no ar desde 25/09"),
    "": ("https://www.stone.com.br/", "Stone (a letra)", "LP principal, elevada em 03/11"),
}
# referências que o Raykkony mandou na conversa (03/11/2026)
DO_RAYKKONY = {"segmentos/loja-de-bebidas", "segmentos/distribuidora", "sistema-de-gestao-para-pequenos-negocios"}

TITULO_GRUPO = {
    "site-br": "site.softpaybr.com, o site de busca do Brasil", "site-co": "site.softpayco.com, o site da Colômbia",
    "pdv": "softpaypdv.com, uma página por país", "app-br": "www.softpaybr.com, o aplicativo no Brasil",
    "erp": "erp.softpaybr.com, a página de venda do ERP", "app-co": "www.softpayco.com, o aplicativo na Colômbia",
    "perfis": "Perfis do SoftPay fora do site",
}

MARCA = {  # nome legível da marca da referência, pelo domínio
    "lightspeedhq.com": "Lightspeed", "clover.com": "Clover", "squareup.com": "Square", "herosistemas.com.br": "Hero Sistemas",
    "shopify.com": "Shopify", "marketup.com": "MarketUP", "lojaintegrada.com.br": "Loja Integrada",
    "digifarma.com.br": "Digifarma", "vhsys.com.br": "vhsys", "zettle.com": "Zettle (PayPal)", "hiper.com.br": "Hiper",
    "loyverse.com": "Loyverse", "fourpet.com.br": "FourPet", "protrole.com.br": "Protrole", "nextar.com.br": "Nextar",
    "stripe.com": "Stripe", "ramp.com": "Ramp", "bling.com.br": "Bling", "sumup.com": "SumUp",
    "nuvemshop.com.br": "Nuvemshop", "pipedrive.com": "Pipedrive", "anota.ai": "Anota AI", "razorpay.com": "Razorpay",
    "infinitepay.io": "InfinitePay", "contaazul.com": "Conta Azul", "omie.com.br": "Omie", "hubspot.com": "HubSpot",
    "olist.com": "Olist", "sebrae.com.br": "Sebrae RN", "sebraers.com.br": "Sebrae RS", "rippling.com": "Rippling",
    "wise.com": "Wise", "gestaoclick.com.br": "GestãoClick", "brex.com": "Brex", "wegou.com.br": "Wegou",
    "linear.app": "Linear", "stone.com.br": "Stone", "ton.com.br": "Ton", "sebrae-sc.com.br": "Sebrae SC",
    "framer.com": "Framer", "mercury.com": "Mercury", "granmoney.com": "GranMoney", "pennylane.com": "Pennylane",
    "attio.com": "Attio", "gestaomaissimples.com.br": "Gestão Mais Simples", "muvypdv.com.br": "Muvy PDV",
}


def marca(url):
    h = urllib.parse.urlparse(url).hostname or ""
    partes = h.split(".")
    for k in range(len(partes) - 1):
        d = ".".join(partes[k:])
        if d in MARCA:
            return MARCA[d]
    return h.removeprefix("www.")


def carregar_links_do_grupo():
    spec = importlib.util.spec_from_file_location("links_do_grupo", os.path.join(RAIZ, "tools/links-do-grupo.py"))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def ler_mapa():
    mapa = {}
    for ln in open(TSV, encoding="utf-8"):
        if not ln.strip() or ln.startswith("#"):
            continue
        rota, molde, ref = ln.rstrip("\n").split("\t")[:3]
        mapa[rota.strip("/")] = (molde, ref)
    return mapa


PREVIA = "https://softpay-previa.pages.dev"
PRODUCAO = "https://site.softpaybr.com"
OUTROS = os.path.join(RAIZ, "tools/moldes/mapa-de-fontes-outros.tsv")
# grupos que não são LP: tela do aplicativo e perfil em diretório não têm referência de fora
NAO_LP_GRUPOS = {"app-br", "app-co", "perfis"}
NAO_LP_ROTAS = {"termos", "privacidade", "reembolso"}


def html_servido(url):
    """HTML como está NO AR (a situação do clone se lê no servido, nunca no ramo local)."""
    r = subprocess.run(["curl", "-s", "-L", "--max-time", "20", "-A", "Mozilla/5.0 jarvis-pdf-links/1", url],
                       capture_output=True)
    return r.stdout.decode("utf-8", "replace") if r.returncode == 0 else ""


def situacoes(rotas_molde):
    """{rota: 'ar' | 'previa' | 'fila'} pelo HTML servido em produção e na prévia (classe mx-<molde> no <main>)."""
    import concurrent.futures as cf
    def uma(item):
        rota, molde = item
        cam = f"/{rota}/" if rota else "/"
        if f"mx-{molde}" in html_servido(PRODUCAO + cam):
            return rota, "ar"
        if f"mx-{molde}" in html_servido(PREVIA + cam):
            return rota, "previa"
        return rota, "fila"
    with cf.ThreadPoolExecutor(max_workers=6) as ex:
        return dict(ex.map(uma, rotas_molde))


def ler_outros():
    """url → (referência | 'nao-e-lp', nota), escolhidas para Colômbia, páginas por país e ERP."""
    saida = {}
    if not os.path.exists(OUTROS):
        return saida
    for ln in open(OUTROS, encoding="utf-8"):
        if not ln.strip() or ln.startswith("#"):
            continue
        c = ln.rstrip("\n").split("\t")
        if len(c) >= 2:
            saida[c[0].strip().rstrip("/")] = (c[1].strip(), c[2].strip() if len(c) > 2 else "")
    return saida


def mostrar(url):
    """Texto visível do link: o endereço sem o https://, com ponto de quebra depois de cada barra."""
    t = html.escape(url.removeprefix("https://").removeprefix("http://"))
    return t.replace("/", "/<wbr>")


def link(url, texto=None):
    return f'<a href="{html.escape(url, quote=True)}">{texto or mostrar(url)}</a>'


def nome_da_pagina(titulo):
    t = (titulo or "").strip()
    for corte in (" | SoftPay", " · SoftPay", " — SoftPay", " - SoftPay"):
        t = t.split(corte)[0]
    return html.escape(t)


def main():
    lg = carregar_links_do_grupo()
    provas = json.load(open(PROVAS, encoding="utf-8"))
    if not any(p["grupo"] == "perfis" for p in provas):
        sys.exit(f"{PROVAS} não tem os perfis de diretório: rode tools/links-do-grupo.py de novo ou passe --provas")
    mapa = ler_mapa()
    linhas_por_grupo = {g: {} for g, _ in lg.ORDEM_GRUPOS}
    cont = {"clone": 0, "previa": 0, "fila": 0, "propria": 0, "falta": 0, "total": 0, "ok200": 0}
    usados = set()
    outros = ler_outros()
    rotas_br = {urllib.parse.urlparse(p["url"]).path.strip("/") for p in provas if p["grupo"] == "site-br"}
    situ_de = situacoes([(r, mapa[r][0]) for r in rotas_br if r in mapa])
    lateral = {"paginas": [], "sem_referencia_lp": [], "referencias": {}}

    for p in provas:
        url, g = p["url"], p["grupo"]
        cont["total"] += 1
        cont["ok200"] += p["status"] == 200
        u = urllib.parse.urlparse(url)
        rota = u.path.strip("/")
        if g == "site-br":
            bloco = lg.bloco_br(url)
        elif g == "site-co":
            bloco = lg.bloco_co(url)
        else:
            bloco = ""
        ref_html, situ, classe = "", "", ""
        if g == "site-br" and rota in mapa:
            molde, ref = mapa[rota]
            usados.add(rota)
            nota = ' <span class="nota">indicada pelo Raykkony</span>' if rota in DO_RAYKKONY else ""
            ref_html = f'<span class="marca">{html.escape(marca(ref))}</span>{nota}<br>{link(ref)}'
            lateral["referencias"][url] = ref
            estado = situ_de.get(rota, "fila")
            if estado == "ar":
                situ, classe = "clone no ar", "ok"
                cont["clone"] += 1
            elif estado == "previa":
                cam = f"{PREVIA}/{rota}/" if rota else f"{PREVIA}/"
                situ, classe = f'pronto na prévia<br>{link(cam, "ver a prévia")}', "previa"
                cont["previa"] += 1
            else:
                situ, classe = "na fila: referência escolhida", "fila"
                cont["fila"] += 1
        elif g == "site-br" and rota in ORIGEM_FIXA:
            ref, nome, situ = ORIGEM_FIXA[rota]
            ref_html = f'<span class="marca">{html.escape(nome)}</span><br>{link(ref)}'
            lateral["referencias"][url] = ref
            classe = "ok"
            cont["clone" if rota.startswith("campanha/") else "propria"] += 1
        elif url.rstrip("/") in outros and outros[url.rstrip("/")][0] != "nao-e-lp":
            ref, nota_o = outros[url.rstrip("/")]
            nota = f' <span class="nota">{html.escape(nota_o)}</span>' if nota_o else ""
            ref_html = f'<span class="marca">{html.escape(marca(ref))}</span>{nota}<br>{link(ref)}'
            lateral["referencias"][url] = ref
            situ, classe = "na fila: referência escolhida", "fila"
            cont["fila"] += 1
        elif (g in NAO_LP_GRUPOS or (g == "site-br" and rota in NAO_LP_ROTAS)
              or outros.get(url.rstrip("/"), ("",))[0] == "nao-e-lp"):
            tipo = {"app-br": "tela do aplicativo", "app-co": "tela do aplicativo", "perfis": "perfil em diretório"}
            ref_html = f'<span class="propria">não é LP ({tipo.get(g, "página legal ou institucional")}): sem referência de fora</span>'
            situ, classe = "no ar", "propria"
            cont["propria"] += 1
        else:
            ref_html = '<span class="falta">LP sem referência: escolher e clonar</span>'
            situ, classe = "falta referência", "falta"
            cont["falta"] += 1
            lateral["sem_referencia_lp"].append(url)
        lateral["paginas"].append(url)
        nome = nome_da_pagina(p.get("titulo"))
        if "/j64tuzdncescfu" in url:
            nome = "Painel admin (endereço escondido)"
        sp = f'<span class="pag">{nome}</span><br>{link(url)}' if nome else link(url)
        linhas_por_grupo[g].setdefault(bloco, []).append(
            f'<tr><td class="sp">{sp}</td><td class="ref">{ref_html}</td>'
            f'<td class="sit {classe}">{situ}</td></tr>')

    sem_link = [r for r in mapa if r not in usados]
    agora = datetime.datetime.now()
    d, m, a = DATA.split("-")
    data_ext = f"{int(d)} de {MESES[int(m) - 1]} de {a}"

    secoes, sumario = [], []
    n = 0
    for g, _ in lg.ORDEM_GRUPOS:
        blocos = linhas_por_grupo[g]
        if not blocos:
            continue
        n += 1
        total_g = sum(len(v) for v in blocos.values())
        titulo_g = lg.NOME_CURTO[g]
        corpo = []
        for bloco, linhas in blocos.items():
            if bloco:
                corpo.append(f'<h3>{html.escape(bloco)} <span class="qtd">({len(linhas)})</span></h3>')
            corpo.append('<table class="longa links"><thead><tr><th class="sp">Página do SoftPay</th>'
                         '<th class="ref">Baseada em</th><th class="sit">Situação</th></tr></thead><tbody>'
                         + "".join(linhas) + "</tbody></table>")
        primeira = ' class="pos-sumario"' if n == 1 else ""
        secoes.append(
            f'<section{primeira}><div class="cab"><div class="cab__motivo produto-motivo"></div>'
            f'<div class="cab__linha"><span class="ancora">ANCORA{n:02d}</span><span class="cab__num">{n:02d}</span>'
            f'<span class="cab__rot">{html.escape(titulo_g)}</span></div>'
            f'<h2>{html.escape(TITULO_GRUPO.get(g, titulo_g))}: {total_g} links</h2></div>'
            + "".join(corpo) + "</section>")
        sumario.append(f'<li><span class="s-num">{n:02d}</span><span class="s-tit">{html.escape(titulo_g)}</span>'
                       f'<span class="s-desc">{total_g} links</span><span class="s-guia"></span>'
                       f'<span class="s-pag">{{{{PAG{n:02d}}}}}</span></li>')

    aviso_mapa = ""
    if sem_link:
        aviso_mapa = ('<div class="achado"><div class="achado__tit">Rotas do mapa sem link na lista</div><p>'
                      + ", ".join(html.escape(r) for r in sem_link) + "</p></div>")

    corpo = f"""<!-- titulo: SoftPay: todos os links e a referência de cada página -->
<style>
.links{{ table-layout:fixed; width:100%; }}
.links th.sp{{ width:43%; }} .links th.ref{{ width:39%; }} .links th.sit{{ width:18%; }}
.links td{{ vertical-align:top; }}
.links a{{ color:var(--marca); text-decoration:underline; text-decoration-thickness:.6pt; text-underline-offset:1.4pt;
  font-family:"Inter Tight",sans-serif; font-size:7.6pt; line-height:1.35; overflow-wrap:anywhere; }}
.links .pag{{ font-family:"Inter Tight",sans-serif; font-weight:600; font-size:8.4pt; color:var(--t1); }}
.links .marca{{ font-family:"Inter Tight",sans-serif; font-weight:600; font-size:8.4pt; color:var(--t1); }}
.links .nota{{ font-family:"Inter Tight",sans-serif; font-size:7pt; font-weight:600; color:var(--marca);
  border:1px solid var(--marca-100); border-radius:.7mm; padding:0 .8mm; white-space:nowrap; }}
.links .propria{{ font-size:8pt; color:var(--t2); font-style:italic; }}
.links td.sit{{ font-family:"Inter Tight",sans-serif; font-size:7.8pt; font-weight:600; }}
.links td.sit.ok{{ color:#0a7a3b; }} .links td.sit.fila{{ color:#9a5b00; }} .links td.sit.propria{{ color:var(--t2); }}
.links td.sit.previa{{ color:#1d4ed8; }} .links td.sit.falta{{ color:#b42318; }}
.links .falta{{ font-size:8pt; font-weight:600; color:#b42318; }}
h3 .qtd{{ font-weight:400; color:var(--t2); }}
</style>

<div class="capa">
  <div class="capa__topo">
    <span class="capa__produto"><span>SoftPay · Sistema de PDV e gestão para lojas</span></span>
    <span class="origem"><span>Um produto</span><img src="{{{{VISIONX}}}}" alt="VisionX"></span>
  </div>
  <div class="capa__corpo">
    <div class="capa__eyebrow">Lista de links · {data_ext}</div>
    <h1>Todos os links do SoftPay e a referência de cada página</h1>
    <p class="capa__sub">Cada página do SoftPay aparece com a página de fora em que ela se baseou ao lado. Os dois endereços são clicáveis: um toque abre a página do SoftPay, o outro abre a referência.</p>
    <div class="regua"><i></i><i></i></div>
    <dl class="capa__ficha">
      <dt>Preparado para</dt><dd>Victor Gabryell</dd>
      <dt>Data</dt><dd>{data_ext}, lista conferida às {agora:%H:%M}</dd>
      <dt>Base</dt><dd>sitemaps, campanhas, páginas legais, telas do aplicativo e perfis; cada link abriu com 200, sem desvio. Referências: tools/moldes/mapa-de-fontes.tsv e mapa-de-fontes-outros.tsv; situação lida no HTML servido</dd>
      <dt>Como ler</dt><dd><b>clone no ar</b>: já é a cópia da referência. <b>pronto na prévia</b>: feito e conferido, esperando publicar. <b>na fila</b>: referência escolhida, clone a caminho. <b>não é LP</b>: aplicativo, página legal ou perfil</dd>
      <dt>Link fixo</dt><dd>o mesmo link do grupo SoftPay Admin sempre abre a versão do dia</dd>
    </dl>
    <div class="capa__resumo">
      <dl class="capa__item"><dt>Links</dt><dd><span class="cifra">{cont['total']}</span>{cont['ok200']} abriram direto (200) na conferência.</dd></dl>
      <dl class="capa__item"><dt>Clones</dt><dd><span class="cifra">{cont['clone'] + cont['previa']}</span>{cont['clone']} no ar e {cont['previa']} prontos na prévia, cada um com a referência ao lado.</dd></dl>
      <dl class="capa__item"><dt>Na fila</dt><dd><span class="cifra">{cont['fila']}</span>páginas com a referência escolhida, clone a caminho{f"; {cont['falta']} LP ainda sem referência" if cont['falta'] else ""}.</dd></dl>
    </div>
  </div>
</div>

<div class="sumario">
  <div class="cab"><div class="cab__linha"><span class="cab__rot">Neste documento</span></div><h2>Os links por grupo</h2></div>
  <ol>{"".join(sumario)}</ol>
</div>
{"".join(secoes)}
{aviso_mapa}
<div class="creditos"><b>De onde vieram os dados:</b> lista e prova de cada link pelo tools/links-do-grupo.py ({PROVAS}); referência de cada rota pelo tools/moldes/mapa-de-fontes.tsv; situação do clone lida no próprio HTML da página (classe do molde aplicada). As referências foram testadas na pesquisa de 3 de novembro de 2026.</div>
"""
    os.makedirs(os.path.join(DOCS, "fonte"), exist_ok=True)
    html_saida = os.path.join(DOCS, "fonte", f"links-e-referencias-{DATA}.html")
    pdf = os.path.join(DOCS, f"SoftPay-Links-e-Referencias-{DATA}.pdf")
    if os.path.exists(html_saida):
        os.replace(html_saida, html_saida + f".bak-{agora:%H%M%S}")
    open(html_saida, "w", encoding="utf-8").write(corpo)
    print(f"corpo: {html_saida}")
    print(f"contagem: {cont}; rotas do mapa sem link: {sem_link}")
    if "--so-html" in sys.argv:
        return 0
    if os.path.exists(pdf):
        os.replace(pdf, pdf + f".bak-{agora:%H%M%S}")
    r = subprocess.run([os.path.expanduser("~/.local/bin/gera-doc"), html_saida, pdf, "--produto", "visionx",
                        "--rodape", f"SoftPay · Todos os links e as referências · {DATA.replace('-', '/')}"])
    if r.returncode not in (0,):
        print(f"gera-doc saiu {r.returncode}")
    # lateral: o que o portão grupo_em_dia.py lê para saber se o PDF cobre o sitemap e se toda LP tem referência
    lateral["gerado"] = agora.isoformat(timespec="seconds")
    lateral["contagem"] = cont
    json.dump(lateral, open(pdf + ".links.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    falhou = conferir_links(pdf, provas, mapa, lateral) or r.returncode
    if lateral["sem_referencia_lp"]:
        print(f"LP sem referência ({len(lateral['sem_referencia_lp'])}): a política pede referência em toda LP")
        for u in lateral["sem_referencia_lp"][:30]:
            print("  SEM REFERÊNCIA", u)
    if "--drive" in sys.argv and not falhou:
        d = subprocess.run([os.path.expanduser("~/.local/bin/drive"), "link", pdf, "softpay",
                            "--titulo", "SoftPay · Links e referências (link fixo).pdf"], capture_output=True, text=True)
        print(d.stdout.strip())
        falhou = d.returncode
    return falhou


def conferir_links(pdf, provas, mapa, lateral=None):
    """Cada URL do SoftPay e cada referência usada tem de virar anotação /Link /URI no PDF."""
    py = os.path.expanduser("~/.claude/marca-visionx/.venv/bin/python")
    codigo = ("import sys,json\nfrom pypdf import PdfReader\nr=PdfReader(sys.argv[1]);s=set()\n"
              "for pg in r.pages:\n for a in pg.get('/Annots') or []:\n  o=a.get_object();A=o.get('/A')\n"
              "  if A and A.get('/URI'): s.add(str(A['/URI']))\nprint(json.dumps(sorted(s)))")
    saida = subprocess.run([py, "-c", codigo, pdf], capture_output=True, text=True)
    if saida.returncode:
        print(saida.stderr)
        return 1
    uris = set(json.loads(saida.stdout))
    esperadas = {p["url"] for p in provas}
    rotas = {urllib.parse.urlparse(p["url"]).path.strip("/") for p in provas if p["grupo"] == "site-br"}
    esperadas |= {ref for r, (_, ref) in mapa.items() if r in rotas}
    esperadas |= {v[0] for k, v in ORIGEM_FIXA.items() if k in rotas}
    if lateral:
        esperadas |= set(lateral["referencias"].values())
    faltam = sorted(u for u in esperadas if u not in uris)
    print(f"links clicáveis no PDF: {len(uris)} anotações; esperadas {len(esperadas)}; faltam {len(faltam)}")
    for u in faltam[:20]:
        print("  FALTA", u)
    print(f"pdf: {pdf}")
    return 1 if faltam else 0


if __name__ == "__main__":
    sys.exit(main())
