#!/usr/bin/env python3
"""Lista COMPLETA e PROVADA de todos os links públicos do SoftPay, em partes para o
grupo de WhatsApp "SoftPay Admin".

Criado em 03/11/2026 (pedido do Victor: "todos os links novamente, sem erros, todos do SoftPay").
NUNCA envia nada: só coleta, prova, escreve /tmp/sp-zap-v2/parte<N>.txt e o relatório. Com --ensaio
ele chama `grupo-admin softpay ... --ensaio` em cada parte (o ensaio NÃO envia: passa o portão e
desenha o balão). Para enviar de verdade quem decide é o Victor, rodando o grupo-admin sem --ensaio.

Uso:
  python3 tools/links-do-grupo.py              coleta, prova, escreve as partes e o relatório
  python3 tools/links-do-grupo.py --ensaio     idem + ensaio do grupo-admin em cada parte
  python3 tools/links-do-grupo.py --saida DIR  outra pasta de saída (padrão /tmp/sp-zap-v2)

O que faz
  1. COLETA: sitemaps no ar (site.softpaybr.com, site.softpayco.com, softpaypdv.com; índice de
     sitemap é seguido), páginas de campanha (fora do sitemap de propósito: lê public/campanha do
     repositório e confere ao vivo), páginas legais e institucionais, rotas do aplicativo
     (www.softpaybr.com e www.softpayco.com), a página de venda do ERP (erp.softpaybr.com/erp) e
     os perfis fora do site (LinkedIn, FindSaaS, B2B Stack se já existir).
  2. PROVA por link: status 200 DIRETO (sem seguir redirecionamento; 301/302/307/308 = erro e o
     link é trocado pela URL final que responde 200), <title> próprio (não o da home nem de página
     de erro) e, nas páginas do site, rel=canonical igual à própria URL. Aplicativo de página única
     (SPA) responde 200 em QUALQUER caminho, então cada rota é conferida NO CÓDIGO do aplicativo
     (src/App.tsx) e o comportamento é mostrado pela sonda /x/nao-existe-123. O painel admin
     escondido só entra se o hash do código bater com o caminho.
  3. DIFF contra a lista de 03/11 (links-do-grupo-base-2026-11-03.txt): o que sumiu e o que é novo,
     cada um com o motivo.
  4. "O que falta, com quem": lido de links-do-grupo-falta.txt, e só entra se a data da 1ª linha
     for a de HOJE (estado velho nunca é repetido).

Só biblioteca padrão + curl. Requisições em série curta (até 6 em paralelo), com tempo-limite.
"""
import concurrent.futures as cf
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.parse

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ_LP = os.path.dirname(AQUI)
RAIZ_VISIONX = os.path.dirname(RAIZ_LP)
APP = os.path.join(RAIZ_VISIONX, "SOFTPAY APP")
BASE_ANTIGA = os.path.join(AQUI, "links-do-grupo-base-2026-11-03.txt")
FALTA = os.path.join(AQUI, "links-do-grupo-falta.txt")
LIMITE = 3700
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 conferir-links-softpay"
SONDA = "/x/nao-existe-123"
HOJE = datetime.date.today()

BR = "https://site.softpaybr.com"
CO = "https://site.softpayco.com"
PDV = "https://softpaypdv.com"
APP_BR = "https://www.softpaybr.com"
APP_CO = "https://www.softpayco.com"
ERP = "https://erp.softpaybr.com"
SITEMAPS = [BR + "/sitemap.xml", CO + "/sitemap.xml", PDV + "/sitemap.xml"]

# Campanhas de anúncio: ficam fora do sitemap DE PROPÓSITO. Além da lista fixa, o script lê
# public/campanha/* do repositório do site.
CAMPANHAS_FIXAS = [BR + "/campanha/teste-gratis/", BR + "/campanha/pdv/", BR + "/campanha/gestao/"]
# Institucionais e legais do site Brasil que o sitemap nem sempre traz; o script acha a forma
# (com ou sem barra) que responde 200 direto.
INST_BR = ["/sobre/", "/contato/", "/termos", "/privacidade", "/reembolso"]
INST_CO = ["/sobre/", "/contacto/", "/terminos-de-uso", "/politica-de-privacidad", "/politica-de-reembolso"]

# Rotas públicas do aplicativo (todas conferidas contra o código).
ROTAS_APP_BR = ["/", "/auth", "/planos-info", "/contato", "/politica-de-privacidade", "/termos-de-uso", "/politica-de-reembolso"]
# Na Colômbia a raiz "/" redireciona (307) para /auth (vercel.json): o link certo é /auth.
ROTAS_APP_CO = ["/", "/auth", "/planos-info", "/planes-info", "/contacto", "/politica-de-privacidad", "/terminos-de-uso", "/politica-de-reembolso"]
ROTAS_ERP = ["/erp"]
ADMIN_ANOTACAO = " (painel admin, mesmo login do aplicativo)"

PERFIS = {
    "https://www.linkedin.com/company/softpaybr": {"titulo_tem": "softpay"},
    "https://www.findsaas.com.br/saas/softpay": {"sitemap": "https://www.findsaas.com.br/sitemap-saas.xml"},
}
B2B_CANDIDATO = "https://www.b2bstack.com.br/product/softpay"

GENERICOS_ERRO = re.compile(r"\b(404|not found|n[ãa]o encontrad[ao]|p[áa]gina n[ãa]o encontrada|error|erro)\b", re.I)

ORDEM_GRUPOS = [
    ("site-br", "SITE BRASIL"),
    ("site-co", "SITE COLÔMBIA"),
    ("pdv", "PÁGINA POR PAÍS, softpaypdv.com"),
    ("app-br", "APLICATIVO BRASIL"),
    ("erp", "ERP COMPLETO, página de venda"),
    ("app-co", "APLICATIVO COLÔMBIA"),
    ("perfis", "PERFIS FORA DO SITE"),
]
NOME_CURTO = {"site-br": "Site Brasil", "site-co": "Site Colômbia", "pdv": "Página por país (softpaypdv.com)",
              "app-br": "Aplicativo Brasil", "erp": "ERP Completo (página de venda)",
              "app-co": "Aplicativo Colômbia", "perfis": "Perfis fora do site"}


# ----------------------------------------------------------------------------- rede (curl)
def curl(url, corpo=True):
    """GET sem seguir redirecionamento. Devolve dict(status, location, corpo)."""
    with tempfile.TemporaryDirectory() as d:
        h, b = os.path.join(d, "h"), os.path.join(d, "b")
        status = "000"
        for tentativa in range(2):
            try:
                r = subprocess.run(
                    ["curl", "-s", "-m", "25", "-A", UA, "-D", h, "-o", b, "-w", "%{http_code}", url],
                    capture_output=True, text=True, timeout=40)
                status = r.stdout.strip() or "000"
            except Exception:
                status = "000"
            if status != "000" and not status.startswith("5"):
                break
        loc = ""
        try:
            for ln in open(h, errors="replace"):
                if ln.lower().startswith("location:"):
                    loc = ln.split(":", 1)[1].strip()
        except Exception:
            pass
        try:
            txt = open(b, "rb").read().decode("utf-8", "replace") if corpo else ""
        except Exception:
            txt = ""
    if loc:
        loc = urllib.parse.urljoin(url, loc)
    return {"status": int(status), "location": loc, "corpo": txt}


def titulo(html):
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def canonical(html):
    for m in re.finditer(r"<link\b[^>]*>", html, re.I):
        tag = m.group(0)
        if re.search(r'rel=["\']?canonical', tag, re.I):
            h = re.search(r'href=["\']([^"\']+)', tag, re.I)
            if h:
                return h.group(1).strip()
    return ""


def locs_do_sitemap(url, vistos=None, aviso=None):
    """<loc> do sitemap; segue índice de sitemap (sitemapindex)."""
    vistos = vistos if vistos is not None else set()
    if url in vistos:
        return []
    vistos.add(url)
    r = curl(url)
    if r["status"] != 200:
        if aviso is not None:
            aviso.append(f"sitemap {url} respondeu {r['status']}")
        return []
    locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", r["corpo"])
    if "<sitemapindex" in r["corpo"]:
        out = []
        for l in locs:
            out += locs_do_sitemap(l, vistos, aviso)
        return out
    return locs


# ----------------------------------------------------------------------------- código do app
def rotas_do_codigo():
    """Caminhos estáticos declarados em <Route path="..."> no src/App.tsx do aplicativo."""
    arq = os.path.join(APP, "src", "App.tsx")
    try:
        t = open(arq, errors="replace").read()
    except Exception:
        return None
    return {p for p in re.findall(r'path="(/[^"]*)"', t) if ":" not in p and "*" not in p}


def hash_do_painel():
    arq = os.path.join(APP, "src", "lib", "painelEscondido.ts")
    try:
        m = re.search(r"HASH_DO_PAINEL\s*=\s*'([0-9a-f]{64})'", open(arq).read())
        return m.group(1) if m else None
    except Exception:
        return None


def caminho_admin():
    arq = os.path.join(APP, "supabase", "functions", "_shared", "adminCaminho.ts")
    try:
        m = re.search(r'ADMIN_CAMINHO\s*=\s*"(/[^"]+)"', open(arq).read())
        return m.group(1) if m else None
    except Exception:
        return None


# ----------------------------------------------------------------------------- coleta
def bloco_br(url):
    p = urllib.parse.urlparse(url).path
    seg = [s for s in p.split("/") if s]
    if p.startswith("/campanha/"):
        return "Campanhas de anúncio, fora do Google de propósito"
    if seg and seg[0] in ("sobre", "contato", "termos", "privacidade", "reembolso"):
        return "Institucional e legal"
    if len(seg) <= 1:
        return "Principais"
    nome = {"segmentos": "Segmentos", "solucoes": "Soluções", "comparativos": "Comparativos",
            "guias": "Guias", "blog": "Blog", "perguntas": "Perguntas"}
    return nome.get(seg[0], "Outras páginas")


def bloco_co(url):
    p = urllib.parse.urlparse(url).path
    seg = [s for s in p.split("/") if s]
    if seg and seg[0] in ("sobre", "contacto", "terminos-de-uso", "politica-de-privacidad", "politica-de-reembolso"):
        return "Institucional e legal"
    if len(seg) <= 1:
        return "Principais"
    nome = {"segmentos": "Segmentos", "soluciones": "Soluciones", "comparativos": "Comparativos",
            "guias": "Guias", "herramientas": "Ferramentas", "preguntas": "Perguntas"}
    return nome.get(seg[0], "Outras páginas")


def coletar(avisos):
    """Devolve {url: item}. item = grupo, bloco, tipo, origem."""
    itens = {}

    def add(url, grupo, bloco, tipo, origem):
        if url not in itens:
            itens[url] = {"url": url, "grupo": grupo, "bloco": bloco, "tipo": tipo, "origem": origem}

    # 1) sitemaps no ar
    for sm in SITEMAPS:
        for loc in locs_do_sitemap(sm, aviso=avisos):
            h = urllib.parse.urlparse(loc).netloc
            if h == "site.softpaybr.com":
                add(loc, "site-br", bloco_br(loc), "site", "sitemap")
            elif h == "site.softpayco.com":
                add(loc, "site-co", bloco_co(loc), "site", "sitemap")
            elif h == "softpaypdv.com":
                add(loc, "pdv", "Países", "site", "sitemap")
            else:
                avisos.append(f"sitemap traz endereço de outro domínio, ignorado: {loc}")

    # 2) campanhas (fora do sitemap): lista fixa + pastas do repositório
    camp = list(CAMPANHAS_FIXAS)
    pasta = os.path.join(RAIZ_LP, "public", "campanha")
    if os.path.isdir(pasta):
        for n in sorted(os.listdir(pasta)):
            if os.path.isfile(os.path.join(pasta, n, "index.html")):
                u = f"{BR}/campanha/{n}/"
                if u not in camp:
                    camp.append(u)
                    avisos.append(f"campanha achada só no repositório (não estava na lista fixa): {u}")
    for u in camp:
        add(u, "site-br", bloco_br(u), "site", "campanha (fora do sitemap)")

    # 3) institucionais e legais
    for p in INST_BR:
        add(BR + p, "site-br", "Institucional e legal", "site", "legal/institucional")
    for p in INST_CO:
        add(CO + p, "site-co", "Institucional e legal", "site", "legal/institucional")

    # 4) aplicativo
    for p in ROTAS_APP_BR:
        add(APP_BR + p, "app-br", "Aplicativo", "app", "rota do aplicativo")
    for p in ROTAS_APP_CO:
        add(APP_CO + p, "app-co", "Aplicativo", "app", "rota do aplicativo")
    for p in ROTAS_ERP:
        add(ERP + p, "erp", "ERP", "erp", "página de venda do ERP (anúncio)")
    adm = caminho_admin()
    if adm:
        add(APP_BR + adm, "app-br", "Aplicativo", "admin", "painel admin escondido")
    else:
        avisos.append("não achei ADMIN_CAMINHO no código: painel admin fora da lista")

    # 5) perfis fora do site
    for u in PERFIS:
        add(u, "perfis", "Perfis", "perfil", "perfil fora do site")
    r = curl(B2B_CANDIDATO)
    if r["status"] == 200 and "softpay" in titulo(r["corpo"]).lower():
        add(B2B_CANDIDATO, "perfis", "Perfis", "perfil", "perfil B2B Stack (apareceu)")
        avisos.append("B2B Stack: a página do SoftPay JÁ EXISTE, entrou na lista")
    return itens


# ----------------------------------------------------------------------------- prova
def seguir_ate_200(url, max_saltos=4):
    """url responde 3xx? segue (um passo por vez) até achar um endereço que responde 200 DIRETO."""
    atual = url
    for _ in range(max_saltos):
        r = curl(atual, corpo=False)
        if r["status"] == 200:
            return atual
        if r["status"] in (301, 302, 303, 307, 308) and r["location"]:
            atual = r["location"]
            continue
        return None
    return None


def provar(item, ctx):
    """Prova um item; devolve dict com url final, status, título, canonical, erros, trocas."""
    url = item["url"]
    erros, trocas = [], []
    r = curl(url)
    original = url
    if r["status"] != 200:
        alvo = None
        if r["status"] in (301, 302, 303, 307, 308) and r["location"]:
            alvo = seguir_ate_200(r["location"])
            motivo = f"{r['status']} direto, redireciona para {r['location']}"
        else:
            # 404 e afins: tenta a forma com/sem barra
            alt = url[:-1] if url.endswith("/") else url + "/"
            ra = curl(alt, corpo=False)
            alvo = alt if ra["status"] == 200 else None
            motivo = f"{r['status']} em {url}"
        if alvo:
            url = alvo
            trocas.append(f"{original} -> {url} ({motivo})")
            r = curl(url)
        else:
            erros.append(f"status {r['status']} direto ({r['location'] or 'sem destino'}), sem endereço 200 alternativo")
    html = r["corpo"] if r["status"] == 200 else ""
    t, c = titulo(html), canonical(html)

    # canonical divergente: se o canonical responde 200 direto e se auto-referencia, a troca é por ele
    exige_canonical = item["tipo"] in ("site", "erp")
    if r["status"] == 200 and exige_canonical and c and c != url:
        if c.rstrip("/") == url.rstrip("/") or urllib.parse.urlparse(c).netloc == urllib.parse.urlparse(url).netloc:
            rc = curl(c)
            if rc["status"] == 200 and canonical(rc["corpo"]) in (c, ""):
                trocas.append(f"{url} -> {c} (canonical aponta para outro endereço, que responde 200 direto)")
                url, r, html, t, c = c, rc, rc["corpo"], titulo(rc["corpo"]), canonical(rc["corpo"])
    return {"item": item, "url": url, "status": r["status"], "titulo": t, "canonical": c,
            "erros": erros, "trocas": trocas, "avisos": []}


def conferir(res, ctx):
    """Regras por tipo, depois da prova de rede."""
    it, url = res["item"], res["url"]
    t, c = res["titulo"], res["canonical"]
    host = urllib.parse.urlparse(url).netloc
    caminho = urllib.parse.urlparse(url).path
    e = res["erros"]
    if res["status"] != 200:
        return
    if it["tipo"] in ("site", "erp"):
        if not t:
            e.append("sem <title>")
        elif GENERICOS_ERRO.search(t):
            e.append(f"título de página de erro: {t!r}")
        home = ctx["home_titulo"].get(host)
        if home and caminho != "/" and t == home and it["tipo"] == "site":
            e.append("título igual ao da home do mesmo site")
        if c != url:
            if it["origem"].startswith("campanha"):
                res["avisos"].append(f"campanha: canonical aponta para {c or 'nada'} (de propósito, página de anúncio)")
            else:
                e.append(f"canonical {c or 'ausente'} diferente da própria URL")
    if it["tipo"] in ("app", "admin", "erp"):
        rotas = ctx["rotas"]
        if rotas is None:
            e.append("não consegui ler as rotas do código do aplicativo")
        else:
            if it["tipo"] == "admin":
                seg = caminho.strip("/")
                h = hashlib.sha256(seg.encode()).hexdigest()
                if h != ctx["hash_painel"]:
                    e.append("o hash do código NÃO bate com este caminho do painel admin")
                else:
                    res["avisos"].append("painel admin: hash do código confere (rota dinâmica, a SPA decide no navegador)")
            else:
                alvo = caminho if caminho != "" else "/"
                if alvo == "/":
                    pass  # raiz: a rota "/" é do Layout/Index; confirmada pelo 200 direto e pelo título do shell
                elif alvo not in rotas:
                    e.append(f"a rota {alvo} NÃO existe em src/App.tsx do aplicativo")
        sonda = ctx["sondas"].get(host)
        if sonda and it["tipo"] != "erp" and t != sonda["titulo"] and it["tipo"] == "app":
            res["avisos"].append("título diferente do shell da SPA")
        if it["tipo"] == "app" and GENERICOS_ERRO.search(t or ""):
            e.append(f"título de página de erro: {t!r}")
    if it["tipo"] == "perfil":
        cfg = PERFIS.get(url) or PERFIS.get(url.rstrip("/")) or {}
        if "titulo_tem" in cfg and cfg["titulo_tem"] not in t.lower():
            e.append(f"título sem '{cfg['titulo_tem']}': {t!r}")
        if "sitemap" in cfg:
            slug = url.rstrip("/").split("/")[-1]
            sm = ctx["sitemap_perfis"].get(cfg["sitemap"])
            if sm is None:
                e.append("não consegui ler o sitemap do diretório para provar o perfil")
            elif not any(l.rstrip("/").endswith("/saas/" + slug) for l in sm):
                e.append("o diretório NÃO lista este perfil no próprio sitemap")
            else:
                res["avisos"].append("diretório é SPA (200 em qualquer caminho): prova = o sitemap do diretório lista o perfil")
        if c and c.rstrip("/") != url.rstrip("/"):
            e.append(f"canonical {c} diferente")


def montar_ctx(itens):
    ctx = {"home_titulo": {}, "sondas": {}, "rotas": rotas_do_codigo(), "hash_painel": hash_do_painel(),
           "sitemap_perfis": {}}
    hosts = {urllib.parse.urlparse(u).netloc for u in itens}
    # título da home de cada host (para detectar "título da home em outra página") e sonda de inexistente
    def sonda_host(h):
        home = curl(f"https://{h}/")
        # Raiz que redireciona (softpaypdv.com/ é roteador por país, 302 conforme o visitante; o app
        # colombiano manda "/" para /auth): não existe "título da home" para comparar.
        th = titulo(home["corpo"]) if home["status"] == 200 else ""
        so = curl(f"https://{h}{SONDA}")
        return h, th, {"status": so["status"], "titulo": titulo(so["corpo"]), "location": so["location"]}
    with cf.ThreadPoolExecutor(6) as ex:
        for h, th, sd in ex.map(sonda_host, sorted(hosts)):
            ctx["home_titulo"][h] = th
            ctx["sondas"][h] = sd
    for cfg in PERFIS.values():
        if "sitemap" in cfg and cfg["sitemap"] not in ctx["sitemap_perfis"]:
            ls = locs_do_sitemap(cfg["sitemap"])
            ctx["sitemap_perfis"][cfg["sitemap"]] = ls or None
    return ctx


# ----------------------------------------------------------------------------- saída
def ordem_url(u):
    p = urllib.parse.urlparse(u).path
    return (p.count("/"), p)


def montar_partes(final, falta):
    """final: lista de (grupo, bloco, [linhas de URL])  ->  partes de texto (<= LIMITE)."""
    total = sum(len(us) for _, _, us in final)
    por_grupo = {}
    for g, _, us in final:
        por_grupo[g] = por_grupo.get(g, 0) + len(us)
    nome_grupo = dict(ORDEM_GRUPOS)

    def blocos_texto():
        for g, b, us in final:
            yield g, b, us

    agora = datetime.datetime.now().strftime("%H:%M")
    data = HOJE.strftime("%d/%m")

    def cabecalho(contagens):
        n = len(contagens)
        l = [f"Lista completa dos links do SoftPay, conferida hoje ({data}) às {agora}: {total} links, "
             f"cada um abrindo direto (200), sem redirecionamento.", "", "*Total por parte*"]
        for i, c in enumerate(contagens, 1):
            l.append(f"Parte {i} de {n}: {c} links")
        l += ["", "*Total por grupo*"]
        for g, _ in ORDEM_GRUPOS:
            if g in por_grupo:
                l.append(f"{NOME_CURTO[g]}: {por_grupo[g]}")
        l.append("")
        return l

    def empacotar(reserva):
        partes, atual, tam = [], [], 0
        iniciados = set()
        cont_atual = 0
        contagens = []
        grupo_atual = None

        def fechar():
            nonlocal atual, tam, grupo_atual, cont_atual
            if atual:
                partes.append(atual)
                contagens.append(cont_atual)
            atual, tam, grupo_atual, cont_atual = [], 0, None, 0

        cap = lambda: LIMITE - (reserva if not partes else 0)
        for g, b, us in blocos_texto():
            restantes = list(us)
            primeiro_pedaco = True
            while restantes:
                cab_g = []
                if g != grupo_atual:
                    suf = ", continuação" if g in iniciados else ""
                    cab_g = [f"*{nome_grupo[g]} ({por_grupo[g]}){suf}*", ""]
                tit = f"*{b} ({len(us)})*" if primeiro_pedaco else f"*{b}, continuação*"
                # quantas URLs cabem
                base = cab_g + ([tit] if b else [])  # grupo de um bloco só: o título do grupo basta
                custo_base = sum(len(x) + 1 for x in base)
                livre = cap() - tam - custo_base - 1
                cabem = 0
                gasto = 0
                for u in restantes:
                    c = len(u) + 1
                    if gasto + c <= livre:
                        gasto += c
                        cabem += 1
                    else:
                        break
                # bloco inteiro só cabe se couber tudo; senão: se já há conteúdo na parte e o bloco
                # inteiro cabe sozinho numa parte nova, fecha e recomeça (bloco não se parte à toa)
                if cabem < len(restantes):
                    inteiro_cabe_novo = (custo_base + sum(len(u) + 1 for u in restantes) + 1) <= LIMITE - (0 if partes else 0)
                    if atual and primeiro_pedaco and inteiro_cabe_novo:
                        fechar()
                        continue
                    if cabem == 0:
                        if not atual:
                            raise SystemExit("uma única linha não cabe numa parte vazia")
                        fechar()
                        continue
                lote, restantes = restantes[:cabem], restantes[cabem:]
                linhas = base + lote + [""]
                atual += linhas
                tam += sum(len(x) + 1 for x in linhas)
                cont_atual += len(lote)
                grupo_atual = g
                iniciados.add(g)
                primeiro_pedaco = False
        fechar()
        return partes, contagens

    reserva = 600
    for _ in range(6):
        partes, contagens = empacotar(reserva)
        cab = cabecalho(contagens)
        tam_cab = sum(len(x) + 1 for x in cab)
        if tam_cab <= reserva:
            break
        reserva = tam_cab + 20
    # texto final
    textos = []
    for i, linhas in enumerate(partes):
        corpo = (cab if i == 0 else []) + linhas
        if i == len(partes) - 1 and falta:
            corpo += ["*O que falta, com quem*"] + falta
        textos.append("\n".join(corpo).rstrip() + "\n")
    return textos, contagens


def ler_falta(avisos):
    try:
        linhas = open(FALTA, encoding="utf-8").read().splitlines()
    except Exception:
        avisos.append("sem arquivo links-do-grupo-falta.txt: bloco 'O que falta' fora")
        return []
    m = re.search(r"estado conferido em (\d{4}-\d{2}-\d{2})", linhas[0] if linhas else "")
    if not m or m.group(1) != HOJE.isoformat():
        avisos.append(f"links-do-grupo-falta.txt é de {m.group(1) if m else 'data desconhecida'}, não de hoje: "
                      "bloco 'O que falta, com quem' TIRADO (reconferir G2 e B2B Stack e atualizar a data)")
        return []
    return [l for l in linhas if l.strip() and not l.startswith("#")]


def main():
    ensaio = "--ensaio" in sys.argv
    saida = "/tmp/sp-zap-v2"
    if "--saida" in sys.argv:
        saida = sys.argv[sys.argv.index("--saida") + 1]
    os.makedirs(saida, exist_ok=True)
    avisos = []

    itens = coletar(avisos)
    print(f"coletados: {len(itens)} endereços candidatos", flush=True)
    ctx = montar_ctx(itens)

    with cf.ThreadPoolExecutor(6) as ex:
        resultados = list(ex.map(lambda it: provar(it, ctx), itens.values()))
    for r in resultados:
        conferir(r, ctx)

    # dedupe depois das trocas
    vistos, unicos, trocas, descartes = {}, [], [], []
    for r in resultados:
        trocas += r["trocas"]
        if r["erros"]:
            continue
        if r["url"] in vistos:
            descartes.append(f"{r['item']['url']} virou {r['url']}, que já estava na lista (duplicado, sai)")
            continue
        vistos[r["url"]] = r
        unicos.append(r)
    com_erro = [r for r in resultados if r["erros"]]

    # o canonical do shell do aplicativo aponta para um endereço que responde direto?
    for c in sorted({r["canonical"] for r in unicos if r["item"]["tipo"] == "app" and r["canonical"]}):
        rc = curl(c, corpo=False)
        if rc["status"] != 200:
            avisos.append(f"canonical do shell do aplicativo ({c}) responde {rc['status']} "
                          f"(redireciona para {rc['location'] or 'nada'}): achado de SEO, não afeta a lista")
    # raízes que a lista descarta por redirecionarem (a sitemap ainda as traz)
    for r in resultados:
        for t in r["trocas"]:
            if r["item"]["origem"] == "sitemap" or r["item"]["tipo"] == "app":
                avisos.append("endereço que estava na lista/sitemap redireciona: " + t)

    # títulos repetidos entre páginas do site (fora a home)
    por_titulo = {}
    for r in unicos:
        if r["item"]["tipo"] == "site":
            por_titulo.setdefault(r["titulo"], []).append(r["url"])
    for t, us in por_titulo.items():
        if len(us) > 1:
            avisos.append(f"título repetido em {len(us)} páginas ({t!r}): " + ", ".join(us))

    # --- blocos finais
    chaves = {}
    for r in unicos:
        it = r["item"]
        g = it["grupo"]
        if g == "app-br" or g == "app-co":
            b = "Aplicativo"
        elif g == "erp":
            b = "ERP"
        elif g == "perfis":
            b = "Perfis"
        else:
            b = it["bloco"]
        chaves.setdefault((g, b), []).append(r["url"])
    ordem_blocos = {
        "site-br": ["Principais", "Segmentos", "Soluções", "Comparativos", "Guias", "Blog", "Perguntas",
                    "Institucional e legal", "Campanhas de anúncio, fora do Google de propósito", "Outras páginas"],
        "site-co": ["Principais", "Segmentos", "Soluciones", "Comparativos", "Guias", "Ferramentas", "Perguntas",
                    "Institucional e legal", "Outras páginas"],
        "pdv": ["Países"], "app-br": ["Aplicativo"], "erp": ["ERP"], "app-co": ["Aplicativo"], "perfis": ["Perfis"],
    }
    admin_url = next((r["url"] for r in unicos if r["item"]["tipo"] == "admin"), None)
    final = []
    for g, _ in ORDEM_GRUPOS:
        for b in ordem_blocos[g]:
            us = chaves.get((g, b))
            if not us:
                continue
            # hubs ("/segmentos/") primeiro, depois alfabética
            us = sorted(us, key=ordem_url) if g not in ("app-br", "app-co", "perfis") else us
            if g == "app-br":
                us = [u for u in us if u != admin_url] + ([admin_url] if admin_url in us else [])
            titulo_bloco = "" if b in ("Países", "Aplicativo", "ERP", "Perfis") else b
            linhas = [u + (ADMIN_ANOTACAO if u == admin_url else "") for u in us]
            final.append((g, titulo_bloco, linhas))

    lista_final = [u for u in vistos]
    falta = ler_falta(avisos)
    textos, contagens = montar_partes(final, falta)

    # páginas do repositório do site Brasil que NÃO entraram na lista: dizer o motivo
    pub = os.path.join(RAIZ_LP, "public")
    if os.path.isdir(pub):
        for raiz, _dirs, arqs in os.walk(pub):
            if "index.html" in arqs and "/assets" not in raiz and "/fontes" not in raiz:
                rel = os.path.relpath(raiz, pub)
                u = BR + "/" + ("" if rel == "." else rel + "/")
                if u in lista_final:
                    continue
                try:
                    corpo_html = open(os.path.join(raiz, "index.html"), errors="replace").read()
                except Exception:
                    continue
                interna = re.search(r'<meta[^>]+name=["\']robots["\'][^>]+noindex', corpo_html, re.I)
                avisos.append(f"repositório tem {u}, que não está na lista: "
                              + ("noindex (página interna, fora da lista de propósito)" if interna
                                 else "SEM noindex e fora da lista: conferir"))

    # limpa partes antigas e grava
    for n in os.listdir(saida):
        if re.fullmatch(r"parte\d+\.txt", n):
            os.remove(os.path.join(saida, n))
    for i, t in enumerate(textos, 1):
        open(os.path.join(saida, f"parte{i}.txt"), "w", encoding="utf-8").write(t)

    # auto-conferência da saída
    urls_nas_partes = []
    for t in textos:
        for ln in t.splitlines():
            if ln.startswith("https://"):
                urls_nas_partes.append(ln.split(" ")[0])
    prob = []
    if sorted(urls_nas_partes) != sorted(lista_final):
        prob.append("as URLs das partes NÃO são exatamente as provadas")
    for i, t in enumerate(textos, 1):
        if len(t) > LIMITE:
            prob.append(f"parte{i} tem {len(t)} caracteres (> {LIMITE})")
        if "—" in t or "–" in t:
            prob.append(f"parte{i} tem travessão")
        if re.search(r"\*\*|`|^#|\]\(", t, re.M):
            prob.append(f"parte{i} tem Markdown que o WhatsApp não entende")

    # --- diff contra 03/11
    base = [l.strip().split(" ")[0] for l in open(BASE_ANTIGA, encoding="utf-8") if l.startswith("https://")]
    novas, antigas = set(lista_final), set(base)
    mapa_troca = {}
    for r in resultados:
        if r["item"]["url"] != r["url"]:
            mapa_troca[r["item"]["url"]] = r["url"]
    erro_por_url = {r["item"]["url"]: "; ".join(r["erros"]) for r in com_erro}
    sumiram = []
    for u in sorted(antigas - novas):
        if u in mapa_troca:
            mot = f"trocado por {mapa_troca[u]}"
        elif u in erro_por_url:
            mot = f"reprovado: {erro_por_url[u]}"
        elif u.rstrip("/") + "/" in novas or u.rstrip("/") in novas:
            mot = "trocado pela forma com/sem barra que é a canônica"
        else:
            mot = "não está mais no sitemap, nas campanhas, no código nem nos perfis conferidos hoje"
        sumiram.append((u, mot))
    nasceram = []
    for u in sorted(novas - antigas):
        r = vistos[u]
        origem = r["item"]["origem"]
        mot = origem
        for velho, novo in mapa_troca.items():
            if novo == u and velho in antigas:
                mot = f"substitui {velho}"
        nasceram.append((u, mot))

    # --- relatório
    L = []
    L.append(f"RELATÓRIO links-do-grupo.py, {HOJE.strftime('%d/%m/%Y')} {datetime.datetime.now().strftime('%H:%M')}")
    L.append(f"Total na lista: {len(lista_final)} links em {len(textos)} partes ({', '.join(str(c) for c in contagens)})")
    L.append("")
    L.append("Por grupo e bloco (todos com 200 direto):")
    for g, nome in ORDEM_GRUPOS:
        n = sum(len(us) for gg, _, us in final if gg == g)
        if n:
            L.append(f"  {nome}: {n}")
            for gg, b, us in final:
                if gg == g:
                    L.append(f"      {b or '(bloco único)'}: {len(us)}")
    L.append("")
    ok200 = sum(1 for r in unicos if r["status"] == 200)
    L.append(f"Com 200 DIRETO (sem seguir redirecionamento): {ok200} de {len(unicos)}")
    L.append("")
    L.append("Sonda de caminho inexistente (mostra se 200 prova algo):")
    for h, s in sorted(ctx["sondas"].items()):
        L.append(f"  https://{h}{SONDA} -> {s['status']} {s['location'] or ''} título: {s['titulo'][:70]!r}")
    L.append("")
    L.append(f"Erros achados e como saíram ({len(trocas)} trocas, {len(com_erro)} reprovados):")
    for t in trocas:
        L.append("  TROCA: " + t)
    for r in com_erro:
        L.append(f"  FORA : {r['item']['url']} -> {'; '.join(r['erros'])}")
    for d in descartes:
        L.append("  DEDUP: " + d)
    if not trocas and not com_erro and not descartes:
        L.append("  nenhum")
    L.append("")
    L.append(f"Diff contra 03/11 ({len(antigas)} links): {len(sumiram)} sumiram, {len(nasceram)} novos")
    for u, m in sumiram:
        L.append(f"  SUMIU: {u}  [{m}]")
    for u, m in nasceram:
        L.append(f"  NOVO : {u}  [{m}]")
    L.append("")
    L.append("Avisos:")
    for a in avisos:
        L.append("  " + a)
    for r in unicos:
        for a in r["avisos"]:
            L.append(f"  {r['url']}: {a}")
    if prob:
        L.append("")
        L.append("PROBLEMAS NA SAÍDA:")
        for p in prob:
            L.append("  " + p)
    rel = "\n".join(L) + "\n"
    open(os.path.join(saida, "relatorio.txt"), "w", encoding="utf-8").write(rel)
    json.dump([{"url": r["url"], "status": r["status"], "titulo": r["titulo"], "canonical": r["canonical"],
                "grupo": r["item"]["grupo"], "origem": r["item"]["origem"]} for r in unicos],
              open(os.path.join(saida, "provas.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(rel)

    sair = 1 if (prob or com_erro) else 0
    if ensaio:
        n = len(textos)
        for i in range(1, n + 1):
            arq = os.path.join(saida, f"parte{i}.txt")
            print(f"\n===== ensaio do grupo-admin, parte {i} de {n} (NÃO envia) =====", flush=True)
            # SEMPRE com --ensaio: este script nunca envia.
            r = subprocess.run(["grupo-admin", "softpay", f"Todos os links do SoftPay ({i} de {n})", arq, "--ensaio"],
                               capture_output=True, text=True)
            print(r.stdout + r.stderr)
            if r.returncode != 0:
                sair = 1
    sys.exit(sair)


if __name__ == "__main__":
    main()
