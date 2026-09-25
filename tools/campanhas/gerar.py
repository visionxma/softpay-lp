#!/usr/bin/env python3
"""Páginas de campanha do SoftPay: /campanha/<slug>/.

Molde: a LP de captação que o Alexandre mandou em 25/09/2026
(lp.gestaomaissimples.com.br/lp/gratis, "estrutura e copy"). A espinha é a
dela, na mesma ordem — hero com prova, números, dores, por que escolheram,
como começar, depoimentos, por que na nuvem, chamada curta, perguntas e
chamada final — e a identidade é a do SoftPay: sistema.css, a tipografia da
Stone em OFL, o azul-noite e as fotos de loja.

O que é só nosso: o CUPOM. Uma LP de sistema de PDV fala a língua do balcão,
e o papel que sai da impressora térmica é o objeto que todo lojista reconhece.
Ele imprime a primeira venda no hero e fecha a conta no fim ("total para
começar: R$ 0,00").

Por que /campanha/ e não /lp/: o _redirects manda /lp/* para a raiz desde o
rebranding (a home nunca mais é /lp/), então qualquer página ali seria
redirecionada antes de abrir.

Uso:  python3 tools/campanhas/gerar.py          # todas
      python3 tools/campanhas/gerar.py pdv      # uma
Depois: python3 tools/versionar-assets.py (carimba CSS, JS e imagens).
"""
import html
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from icones import icone  # noqa: E402
from paginas import PAGINAS  # noqa: E402

RAIZ = pathlib.Path(__file__).resolve().parents[2]
PUBLIC = RAIZ / 'public'
BASE = 'https://site.softpaybr.com'
APP = 'https://www.softpaybr.com/auth'
WHATS = 'https://wa.me/5586998193851'

e = html.escape


def rodape_da_home():
    """O rodapé é o da home, lido na hora: um só lugar para mudar link e assinatura."""
    s = (PUBLIC / 'index.html').read_text(encoding='utf-8')
    m = re.search(r'(    <footer class="rodape">.*?</footer>)', s, re.S)
    return m.group(1)


def fonte_da_foto(img, sizes):
    """Foto de lojista em 1600px ganha a versão de 800px (assets/lojistas/800/)
    para cartão pequeno: num cartão de 170px o celular baixava o dobro do que
    precisava. A miniatura de 400px não serve: o cartão recorta pela altura e
    ela chegaria esticada."""
    m = re.match(r'(/assets/lojistas/)([\w-]+\.webp)$', img)
    if m and (PUBLIC / 'assets/lojistas/800' / m.group(2)).exists():
        return (f'src="{img}" srcset="{m.group(1)}800/{m.group(2)} 800w, {img} 1600w" '
                f'sizes="{sizes}"')
    return f'src="{img}"'


def cabeca(p):
    url = f"{BASE}/campanha/{p['slug']}/"
    return f'''<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8" />
    <!-- Página gerada por tools/campanhas/gerar.py a partir de paginas.py.
         Não edite aqui: a próxima geração sobrescreve. -->
    <script>window.SOFTPAY_CONSENTIMENTO=true;if(window.SOFTPAY_CONSENTIMENTO){{window.dataLayer=window.dataLayer||[];
    window.gtag=function(){{window.dataLayer.push(arguments)}};gtag('consent','default',{{ad_storage:'denied',
    ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500}})}}</script>

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
    new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    }})(window,document,'script','dataLayer','GTM-MCJHLF3Q');</script>
    <!-- End Google Tag Manager -->

    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>{e(p['title'])}</title>
    <meta name="description" content="{e(p['description'])}" />
    <!-- Página de campanha: recebe tráfego pago e não disputa a busca com a
         home e as páginas de solução, que dizem o mesmo com mais fôlego. -->
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#06121F" />
    <link rel="canonical" href="{url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="SoftPay" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="{url}" />
    <meta property="og:title" content="{e(p['title'])}" />
    <meta property="og:description" content="{e(p['description'])}" />
    <meta property="og:image" content="{BASE}/assets/desktop.webp" />
    <meta property="og:image:alt" content="SoftPay aberto num monitor, com os produtos da loja e o carrinho da venda" />
    <meta name="twitter:card" content="summary_large_image" />

    <link rel="preload" href="/fontes/softpay-display-v1.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fontes/softpay-texto-400-v1.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" as="image" href="{p['hero']['peca']}" fetchpriority="high" />
    <link rel="stylesheet" href="/sistema.css" />
    <link rel="stylesheet" href="/campanha/campanha.css" />
    <link rel="icon" href="/assets/icones e favicon.svg" />

    <!-- Meta Pixel Code (mesmos IDs da home) -->
    <script>
    !function(f,b,e,v,n,t,s)
    {{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    if (window.SOFTPAY_CONSENTIMENTO) fbq('consent', 'revoke');
    fbq('init', '1476552610693219');
    fbq('init', '26424939163836170');
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', {{
    content_name: 'Campanha {e(p['slug'])}',
    content_category: 'Gestão de Vendas e Estoque'
    }});
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1476552610693219&ev=PageView&noscript=1"
    /></noscript>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=26424939163836170&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
</head>
'''


def nav(p):
    links = ''.join(f'<a class="nav__link" href="#{a}">{e(t)}</a>' for a, t in p['menu'])
    gav = ''.join(f'<a href="#{a}">{e(t)}</a>' for a, t in p['menu'])
    return f'''
<body class="campanha">
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCJHLF3Q"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <a class="so-leitor" href="#conteudo">Pular para o conteúdo</a>

    <nav class="nav" aria-label="Principal">
        <a class="nav__logo" href="/" aria-label="SoftPay, página inicial">
            <img src="/assets/logo-232.png" width="232" height="84" alt="SoftPay" />
        </a>
        <div class="nav__menu">{links}</div>
        <div class="nav__acoes">
            <a class="nav__link nav__entrar" href="{APP}">Entrar</a>
            <a class="btn btn--acao" href="{APP}" data-track="complete-registration">Testar grátis</a>
            <button class="nav__hamburguer" type="button" data-gaveta-botao aria-expanded="false" aria-controls="gaveta"
                aria-label="Abrir menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
        </div>
    </nav>

    <div class="gaveta" id="gaveta" data-aberta="nao">
        {gav}
        <a href="{APP}">Entrar</a>
        <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">Testar grátis</a>
    </div>
'''


def titulo(linhas, classe='display display--secao', tag='h2', ident=''):
    """Linhas do display; a que vem marcada com * sai no acento da marca."""
    partes = []
    for l in linhas:
        if l.startswith('*'):
            partes.append(f'<span class="linha acento-titulo">{e(l[1:])}</span>')
        else:
            partes.append(f'<span class="linha">{e(l)}</span>')
    idt = f' id="{ident}"' if ident else ''
    return f'<{tag} class="{classe}"{idt}>{"".join(partes)}</{tag}>'


def cupom(c, classe=''):
    """O papel da impressora térmica. As linhas entram uma a uma (campanha.js)."""
    linhas = ''.join(
        f'<li class="cupom__linha"><span>{e(d)}</span><i aria-hidden="true"></i><b>{e(v)}</b></li>'
        for d, v in c['linhas'])
    rodape = f'<p class="cupom__rodape">{e(c["rodape"])}</p>' if c.get('rodape') else ''
    return f'''<div class="cupom {classe}" data-cupom>
                        <div class="cupom__papel">
                            <p class="cupom__cabeca"><b>{e(c['titulo'])}</b><span>{e(c['sub'])}</span></p>
                            <ul class="cupom__linhas">{linhas}</ul>
                            <p class="cupom__total"><span>{e(c['total'][0])}</span><b>{e(c['total'][1])}</b></p>
                            {rodape}
                            <span class="cupom__barras" aria-hidden="true"></span>
                        </div>
                    </div>'''


def hero(p):
    h = p['hero']
    chips = ''.join(f'<li>{icone(i, 20)}<span>{e(t)}</span></li>' for i, t in h['chips'])
    prova = ''.join(f'<li>{icone(i, 18)}<span><b>{e(f)}</b> {e(r)}</span></li>' for i, f, r in h['prova'])
    return f'''
    <main id="conteudo">
        <section class="lp-hero" id="topo">
            <img class="lp-hero__foto" src="{h['foto']}" width="1600" height="667" alt="" decoding="async" />
            <div class="lp-hero__veu" aria-hidden="true"></div>
            <div class="shell lp-hero__grade">
                <div class="lp-hero__texto">
                    <p class="lp-selo">{icone('check', 16)}<span>{e(h['selo'])}</span></p>
                    {titulo(h['h1'], 'display lp-hero__titulo', 'h1')}
                    <p class="lp-hero__sub">{h['sub']}</p>
                    <ul class="lp-chips">{chips}</ul>
                    <div class="cluster cluster--cta">
                        <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(h['cta'])}</a>
                        <a class="btn btn--fantasma-claro btn--grande" href="{h['cta2'][1]}">{e(h['cta2'][0])}</a>
                    </div>
                    <ul class="lp-prova">{prova}</ul>
                </div>
                <figure class="lp-hero__peca">
                    <img class="lp-hero__aparelhos" src="{h['peca']}" width="1200" height="900"
                        fetchpriority="high" decoding="async" alt="{e(h['peca_alt'])}" />
                    {cupom(h['cupom'], 'cupom--hero')}
                </figure>
            </div>
        </section>
'''


def numeros(p):
    n = p['numeros']
    itens = ''.join(
        f'''<li class="lp-num revelar{' lp-num--grande' if i == 0 else ''}">
                        <b class="lp-num__valor"{f' data-conta="{c}" data-prefixo="{e(pre)}" data-sufixo="{e(suf)}"' if c else ''}>{e(v)}</b>
                        <span>{e(r)}</span></li>'''
        for i, (v, c, pre, suf, r) in enumerate(n['itens']))
    segs = ''.join(
        f'''<li class="revelar"><a class="lp-seg" href="{href}">
                            <img src="{img}" width="400" height="167" loading="lazy" decoding="async" alt="" />
                            <span>{e(nome)}</span></a></li>'''
        for nome, img, href in n['segmentos'])
    return f'''
        <section class="secao secao--alt lp-numeros" aria-labelledby="numeros-titulo">
            <div class="shell">
                <h2 class="lp-lead" id="numeros-titulo">{e(n['lead'])}</h2>
                <ul class="lp-nums">{itens}</ul>
                <ul class="lp-segs" aria-label="Segmentos que usam o SoftPay">{segs}</ul>
            </div>
        </section>
'''


def dores(p):
    d = p['dores']
    itens = ''.join(
        f'''<li class="lp-dor revelar">
                        <span class="lp-dor__ic">{icone(i, 22)}</span>
                        <h3>{e(t)}</h3>
                        <p>{e(x)}</p></li>'''
        for i, t, x in d['itens'])
    m = d['meio']
    return f'''
        <section class="secao lp-dores" id="{d['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    <p class="lp-pilula lp-pilula--alerta">{e(d['pilula'])}</p>
                    {titulo(d['h2'])}
                    <p class="grande leitura">{e(d['sub'])}</p>
                </div>
                <ul class="lp-dores__grade">{itens}</ul>
                <div class="lp-meio revelar">
                    <div>
                        <h3>{e(m['titulo'])}</h3>
                        <p>{e(m['texto'])}</p>
                    </div>
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(m['cta'])}</a>
                </div>
            </div>
        </section>
'''


def porque(p):
    q = p['porque']
    itens = []
    for i, t, x, bul, plano in q['itens']:
        b = ''.join(f'<li>{icone("check", 16)}<span>{e(y)}</span></li>' for y in bul)
        pl = f'<p class="lp-rec__plano">{e(plano)}</p>' if plano else ''
        itens.append(f'''<li class="lp-rec">
                        <span class="lp-rec__ic">{icone(i, 24)}</span>
                        <h3 class="display display--cartao">{e(t)}</h3>
                        <p>{e(x)}</p>
                        <ul>{b}</ul>
                        {pl}</li>''')
    # No celular os seis cartões somavam 3,3 telas. A mesma informação vira um
    # acordeão de uma tela (o primeiro já aberto); do tablet para cima, cartões.
    lista = []
    for k, (i, t, x, bul, plano) in enumerate(q['itens']):
        b = ''.join(f'<li>{icone("check", 16)}<span>{e(y)}</span></li>' for y in bul)
        pl = f'<p class="lp-rec__plano">{e(plano)}</p>' if plano else ''
        lista.append(f'''<details class="lp-recl" name="recursos"{' open' if k == 0 else ''}>
                        <summary><span class="lp-rec__ic">{icone(i, 20)}</span><b>{e(t)}</b>{icone('mais', 18, 'lp-recl__mais')}</summary>
                        <div><p>{e(x)}</p><ul>{b}</ul>{pl}</div>
                    </details>''')
    return f'''
        <section class="secao secao--alt lp-porque" id="{q['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(q['h2'])}
                    <p class="grande leitura">{e(q['sub'])}</p>
                </div>
                <ol class="lp-recs">{''.join(itens)}</ol>
                <div class="lp-recs-lista">{''.join(lista)}</div>
            </div>
        </section>
'''


def passos(p):
    s = p['passos']
    itens = ''.join(
        f'''<li class="lp-passo revelar">
                        <span class="lp-passo__n" aria-hidden="true">{k}</span>
                        <h3>{e(t)}</h3>
                        <p>{e(x)}</p></li>'''
        for k, (t, x) in enumerate(s['itens'], 1))
    abas = ''.join(
        f'<button class="lp-tour__aba" type="button" role="tab" aria-selected="{"true" if k == 0 else "false"}" '
        f'aria-controls="tour-{k}" id="tour-aba-{k}">{e(r)}</button>'
        for k, (r, _, _) in enumerate(s['tour']))
    telas = ''.join(
        f'''<img class="lp-tour__tela" id="tour-{k}" role="tabpanel" aria-labelledby="tour-aba-{k}" src="{img}"
                            width="1400" height="845" loading="lazy" decoding="async" alt="{e(alt)}"{'' if k == 0 else ' data-oculta'} />'''
        for k, (_, img, alt) in enumerate(s['tour']))
    return f'''
        <section class="secao lp-passos" id="{s['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(s['h2'])}
                    <p class="grande leitura">{e(s['sub'])}</p>
                </div>
                <ol class="lp-passos__linha">{itens}</ol>
                <div class="lp-tour revelar" data-tour>
                    <p class="lp-tour__titulo">{e(s['tour_titulo'])}</p>
                    <div class="lp-tour__abas" role="tablist" aria-label="Telas do sistema">{abas}</div>
                    <div class="lp-tour__janela">
                        <span class="lp-tour__barra" aria-hidden="true"><i></i><i></i><i></i><em>softpaybr.com</em></span>
                        <div class="lp-tour__telas">{telas}</div>
                    </div>
                </div>
            </div>
        </section>
'''


def depoimentos(p):
    d = p['depoimentos']
    vids = ''.join(
        f'''<figure class="lp-depo revelar">
                        <div class="lp-depo__video">
                            <video src="{v}" poster="{poster}" preload="none" playsinline controls
                                aria-label="Depoimento em vídeo de {e(nome)}"></video>
                        </div>
                        <blockquote>“{e(frase)}”</blockquote>
                        <figcaption><b>{e(nome)}</b><span>{e(loja)}</span></figcaption>
                    </figure>'''
        for v, poster, frase, nome, loja in d['videos'])
    nums = ''.join(
        f'<li><b{f" data-conta={chr(34)}{c}{chr(34)} data-prefixo={chr(34)}{e(pre)}{chr(34)}" if c else ""}>{e(v)}</b><span>{e(r)}</span></li>'
        for v, c, pre, r in d['numeros'])
    ufs = ''.join(f'<li>{e(u)}</li>' for u in d['estados'])
    nums += f'<li class="lp-depos__ufs"><span>{e(d["estados_titulo"])}</span><ul>{ufs}</ul></li>'
    return f'''
        <section class="secao secao--escura lp-depos" id="{d['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(d['h2'])}
                    <p class="grande leitura">{e(d['sub'])}</p>
                </div>
                <div class="lp-depos__grade">
                    {vids}
                    <ul class="lp-depos__nums revelar">{nums}</ul>
                </div>
            </div>
        </section>
'''


def nuvem(p):
    n = p['nuvem']
    itens = ''.join(
        f'''<li class="lp-nuvem__item revelar">
                        <span class="lp-nuvem__ic">{icone(i, 22)}</span>
                        <div><h3>{e(t)}</h3><p>{e(x)}</p></div></li>'''
        for i, t, x in n['itens'])
    return f'''
        <section class="secao lp-nuvem" id="{n['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    <p class="lp-pilula">{icone('nuvem', 16)}<span>{e(n['pilula'])}</span></p>
                    {titulo(n['h2'])}
                    <p class="grande leitura">{e(n['sub'])}</p>
                </div>
                <ul class="lp-nuvem__grade">{itens}</ul>
            </div>
        </section>
'''


def comece(p):
    c = p['comece']
    checks = ''.join(f'<li>{icone("check", 16)}<span>{e(t)}</span></li>' for t in c['checks'])
    return f'''
        <section class="secao secao--alt lp-comece" id="comecar">
            <div class="shell lp-comece__grade">
                <div class="lp-comece__texto">
                    {titulo(c['h2'])}
                    <p class="grande">{e(c['texto'])}</p>
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(c['cta'])}</a>
                    <p class="apoio lp-comece__nota">{e(c['nota'])}</p>
                    <ul class="lp-checks">{checks}</ul>
                </div>
                {cupom(c['cupom'], 'cupom--conta')}
            </div>
        </section>
'''


def faq(p):
    f = p['faq']
    mais = ('<span class="faq__mais"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" '
            'stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true">'
            '<path d="M12 5v14M5 12h14"/></svg></span>')
    itens = []
    for k, (q, a) in enumerate(f['itens']):
        if k < 5:
            attr = 'class="faq__item" name="faq"'
        elif k == 5:
            attr = 'class="faq__item" name="faq" data-faq-sexta'
        else:
            attr = 'class="faq__item faq__extra" name="faq" hidden'
        itens.append(f'''<details {attr}>
                        <summary>{e(q)}{mais}</summary>
                        <div><p>{a}</p></div>
                    </details>''')
    return f'''
        <section class="secao lp-faq" id="{f['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(f['h2'])}
                </div>
                <div class="faq">{''.join(itens)}</div>
                <div class="faq__mais-perguntas">
                    <button class="btn btn--linha" type="button" data-ver-mais=".faq__extra" aria-expanded="false">
                        <span data-ver-mais-rotulo>Ver mais perguntas</span> <span data-ver-mais-conta></span>
                    </button>
                </div>
                <div class="lp-duvida revelar">
                    <div>
                        <h3>Ainda tem dúvida?</h3>
                        <p>Fale com uma pessoa da equipe pelo WhatsApp. Ela responde e ajuda a configurar.</p>
                    </div>
                    <a class="btn btn--linha btn--grande" href="{WHATS}" target="_blank" rel="noopener" data-track="whatsapp-support">{icone('whats', 20, 'btn__icone')}Chamar no WhatsApp</a>
                </div>
            </div>
        </section>
'''


def final(p):
    f = p['final']
    return f'''
        <section class="secao secao--escura cta-final lp-final">
            <div class="shell cabeca-secao--centro">
                {titulo(f['h2'])}
                <p class="grande leitura leitura--centro">{e(f['texto'])}</p>
                <div class="cluster cluster--cta lp-final__acoes">
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(f['cta'])}</a>
                    <a class="btn btn--fantasma-claro btn--grande btn--whats" href="{WHATS}" target="_blank" rel="noopener" data-track="whatsapp-support">{icone('whats', 18, 'btn__icone')}WhatsApp</a>
                </div>
                <ul class="lp-final__selos">{''.join(f'<li>{icone("check", 16)}<span>{e(t)}</span></li>' for t in f['selos'])}</ul>
            </div>
        </section>
'''


def planos_da_home():
    """Os planos são os da home, lidos na hora: preço muda num lugar só."""
    s = (PUBLIC / 'index.html').read_text(encoding='utf-8')
    m = re.search(r'(<div class="planos">.*?</aside>)', s, re.S)
    return m.group(1)


def prosa(p):
    q = p['prosa']
    paras = ''.join(f'<p>{x}</p>' for x in q['paragrafos'])
    return f"""
        <section class="secao lp-prosa" id="{q['id']}">
            <div class="shell lp-prosa__grade">
                <figure class="lp-prosa__foto revelar">
                    <img src="{q['foto']}" width="1600" height="667" loading="lazy" decoding="async" alt="{e(q['foto_alt'])}" />
                    {cupom(q['cupom'], 'cupom--prosa') if q.get('cupom') else ''}
                </figure>
                <div class="lp-prosa__texto">
                    {titulo(q['h2'])}
                    {paras}
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(q['cta'])}</a>
                </div>
            </div>
        </section>
"""


def bento(p):
    b = p['bento']
    itens = ''.join(
        f"""<li class="lp-bento__item revelar">
                        <a href="{href}">
                            <img src="{img}" width="400" height="167" loading="lazy" decoding="async" alt="" />
                            <span class="lp-bento__rotulo"><b>{e(nome)}</b><span>{e(texto)}</span></span>
                        </a></li>"""
        for nome, img, href, texto in b['itens'])
    return f"""
        <section class="secao secao--escura lp-bento" id="{b['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(b['h2'])}
                    <p class="grande leitura">{e(b['sub'])}</p>
                </div>
                <ul class="lp-bento__grade">{itens}</ul>
                <div class="lp-bento__acao">
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(b['cta'])}</a>
                </div>
            </div>
        </section>
"""


def citacoes(p):
    c = p['citacoes']
    itens = ''.join(
        f"""<li class="lp-cit revelar">
                        <p class="lp-cit__dor">“{e(dor)}”</p>
                        <p class="lp-cit__resposta">{icone('check', 18)}<span>{e(resp)}</span></p></li>"""
        for dor, resp in c['itens'])
    return f"""
        <section class="secao secao--alt lp-cits" id="{c['id']}">
            <div class="shell lp-cits__grade">
                <div class="lp-cits__lado">
                    {titulo(c['h2'])}
                    <p class="grande">{e(c['sub'])}</p>
                    <figure class="lp-cits__tela">
                        <img src="{c['tela']}" width="690" height="1498" loading="lazy" decoding="async" alt="{e(c['tela_alt'])}" />
                    </figure>
                </div>
                <ul class="lp-cits__lista">{itens}</ul>
            </div>
        </section>
"""


def fotorecursos(p):
    r = p['fotorecursos']
    itens = ''.join(
        f"""<li class="lp-foto revelar">
                        <img {fonte_da_foto(img, '(min-width: 64rem) 33vw, 50vw')} width="400" height="167" loading="lazy" decoding="async" alt="" />
                        <div><h3>{e(t)}</h3><p>{e(x)}</p></div></li>"""
        for img, t, x in r['itens'])
    return f"""
        <section class="secao lp-fotos" id="{r['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(r['h2'])}
                    <p class="grande leitura">{e(r['sub'])}</p>
                </div>
                <ul class="lp-fotos__grade">{itens}</ul>
            </div>
        </section>
"""


def planos(p):
    q = p['planos']
    return f"""
        <section class="secao lp-planos" id="planos">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(q['h2'])}
                    <p class="grande leitura">{e(q['sub'])}</p>
                </div>
                {planos_da_home()}
                <ul class="lp-planos__notas">{''.join(f'<li>{icone("check", 16)}<span>{e(t)}</span></li>' for t in q['notas'])}</ul>
            </div>
        </section>
"""


def cta_duplo(p):
    c = p['cta_duplo']
    return f"""
        <section class="secao secao--escura lp-duplo">
            <div class="shell cabeca-secao--centro">
                {titulo(c['h2'])}
                <p class="grande leitura leitura--centro">{e(c['texto'])}</p>
                <div class="cluster cluster--cta lp-final__acoes">
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(c['cta'])}</a>
                    <a class="btn btn--fantasma-claro btn--grande" href="{WHATS}" target="_blank" rel="noopener" data-track="whatsapp-support">{e(c['cta2'])}</a>
                </div>
            </div>
        </section>
"""


def modulos(p):
    m = p['modulos']
    itens = ''.join(f'<li><a href="#{a}">{icone(i, 18)}<span>{e(t)}</span></a></li>' for a, i, t in m)
    return f"""
        <nav class="lp-modulos" aria-label="O que o sistema faz">
            <div class="shell"><ul>{itens}</ul></div>
        </nav>
"""


def _tela(img, alt, largura=1400, altura=845):
    return f"""<div class="lp-janela">
                        <span class="lp-tour__barra" aria-hidden="true"><i></i><i></i><i></i><em>softpaybr.com</em></span>
                        <img src="{img}" width="{largura}" height="{altura}" loading="lazy" decoding="async" alt="{e(alt)}" />
                    </div>"""


def recurso_tela(p, chave):
    r = p[chave]
    sub = ''
    if r.get('lista'):
        itens = ''.join(f'<li><h3>{e(t)}</h3><p>{e(x)}</p></li>' for t, x in r['lista'])
        sub = f"""
                <div class="lp-sub">
                    <figure class="lp-sub__foto revelar"><img src="{r['lista_foto']}" width="1600" height="667" loading="lazy" decoding="async" alt="" /></figure>
                    <ul class="lp-sub__lista">{itens}</ul>
                </div>"""
    lado = ' lp-rt--invertido' if r.get('invertido') else ''
    return f"""
        <section class="secao lp-rt{lado}{' secao--alt' if r.get('alt') else ''}" id="{r['id']}">
            <div class="shell">
                <div class="lp-rt__grade">
                    <div class="lp-rt__texto">
                        <p class="lp-pilula">{icone(r['icone'], 16)}<span>{e(r['pilula'])}</span></p>
                        {titulo(r['h2'])}
                        {''.join(f'<p>{x}</p>' for x in r['texto'])}
                        <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(r['cta'])}</a>
                        <p class="apoio lp-rt__nota">7 dias grátis, sem cartão de crédito.</p>
                    </div>
                    <figure class="lp-rt__tela revelar">{_tela(r['tela'], r['tela_alt'])}</figure>
                </div>{sub}
            </div>
        </section>
"""


def estoque(p):
    return recurso_tela(p, 'estoque')


def caixa(p):
    return recurso_tela(p, 'caixa')


def relatorios(p):
    r = p['relatorios']
    return f"""
        <section class="secao lp-rel" id="{r['id']}">
            <div class="shell lp-rel__grade">
                <div class="lp-rel__texto">
                    <p class="lp-pilula">{icone('grafico', 16)}<span>{e(r['pilula'])}</span></p>
                    {titulo(r['h2'])}
                    <p class="grande">{e(r['texto'])}</p>
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(r['cta'])}</a>
                </div>
                <div class="lp-rel__colagem" aria-hidden="true">
                    <img class="lp-rel__tablet revelar" src="/assets/sistema/tablet-financeiro.webp" width="1268" height="1690" loading="lazy" decoding="async" alt="" />
                    <img class="lp-rel__foto revelar" src="{r['foto']}" width="400" height="167" loading="lazy" decoding="async" alt="" />
                    <div class="lp-rel__abc revelar">
                        <p>Curva ABC</p>
                        <ul><li style="--v:.92"><b>A</b><i></i><span>o que sustenta o faturamento</span></li>
                            <li style="--v:.55"><b>B</b><i></i><span>o que gira no meio</span></li>
                            <li style="--v:.22"><b>C</b><i></i><span>o que empata dinheiro</span></li></ul>
                    </div>
                </div>
            </div>
        </section>
"""


def plataformas(p):
    q = p['plataformas']
    ap = ''.join(f'<li>{icone(i, 40)}<span>{e(t)}</span></li>' for i, t in q['aparelhos'])
    ch = ''.join(f'<li>{icone(i, 18)}<span>{e(t)}</span></li>' for i, t in q['chips'])
    return f"""
        <section class="secao secao--alt lp-plat" id="{q['id']}">
            <div class="shell cabeca-secao--centro">
                {titulo(q['h2'])}
                <p class="grande leitura leitura--centro">{e(q['sub'])}</p>
                <ul class="lp-plat__aparelhos">{ap}</ul>
                <ul class="lp-plat__chips">{ch}</ul>
            </div>
        </section>
"""


def catalogo(p):
    c = p['catalogo']
    prods = ''.join(
        f'<li><img src="{img}" width="400" height="167" loading="lazy" decoding="async" alt="" /><span><b>{e(n)}</b>{e(v)}</span><i class="lp-chave{" lp-chave--ligada" if on else ""}" aria-hidden="true"></i></li>'
        for img, n, v, on in c['produtos'])
    return f"""
        <section class="secao secao--escura lp-cat" id="{c['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    <p class="lp-cat__lema">{e(c['lema'])}</p>
                    {titulo(c['h2'])}
                    <p class="grande leitura">{e(c['texto'])}</p>
                </div>
                <div class="lp-cat__cartoes">
                    <div class="lp-ui revelar">
                        <p class="lp-ui__titulo">Produtos no catálogo</p>
                        <ul class="lp-ui__prods">{prods}</ul>
                    </div>
                    <div class="lp-ui lp-ui--zap revelar">
                        <p class="lp-ui__titulo">WhatsApp da loja</p>
                        <p class="lp-bolha lp-bolha--eles">Oi! Tem a camiseta básica no M?</p>
                        <p class="lp-bolha lp-bolha--nos">Tem sim! Veja o catálogo com o estoque de hoje: <u>{e(c['link'])}</u></p>
                    </div>
                    <div class="lp-ui lp-ui--pedido revelar">
                        <p class="lp-ui__titulo">Pedido novo</p>
                        <p class="lp-ui__valor">R$ 89,90</p>
                        <p class="lp-ui__linha">2 itens, retirar na loja</p>
                        <p class="lp-ui__ok">{icone('check', 16)}Pix confirmado sozinho</p>
                    </div>
                </div>
                <div class="lp-cat__acao">
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(c['cta'])}</a>
                </div>
            </div>
        </section>
"""


def zap(p):
    z = p['zap']
    ops = ''.join(f'<li>{e(t)}</li>' for t in z['operacoes'])
    return f"""
        <section class="secao lp-zap" id="{z['id']}">
            <div class="shell lp-zap__grade">
                <div class="lp-zap__texto">
                    <p class="lp-pilula">{icone('whats', 16)}<span>{e(z['pilula'])}</span></p>
                    {titulo(z['h2'])}
                    <p class="grande">{e(z['texto'])}</p>
                    <ul class="lp-zap__ops">{ops}</ul>
                    <a class="btn btn--acao btn--grande" href="{APP}" data-track="complete-registration">{e(z['cta'])}</a>
                    <p class="apoio lp-rt__nota">{e(z['nota'])}</p>
                </div>
                <div class="lp-conversa revelar" data-conversa aria-label="Exemplo de conversa com o SoftPay no WhatsApp">
                    <p class="lp-conversa__topo"><b>SoftPay</b><span>assistente da loja</span></p>
                    <div class="lp-conversa__corpo">
                        <p class="lp-msg lp-msg--eu lp-msg--audio"><span class="lp-play">{icone('play', 14)}</span><span class="lp-onda" aria-hidden="true"></span><small>“Vendi duas cocas no pix”</small></p>
                        <p class="lp-msg lp-msg--ele lp-msg--nao">Não registrei: o estoque de coca está zerado.<small>16:08:12</small></p>
                        <p class="lp-msg lp-msg--eu">Registre no estoque 10 coca<small>16:08:27</small></p>
                        <p class="lp-msg lp-msg--ele">Entrada registrada: 10 unidades de coca.</p>
                        <p class="lp-msg lp-msg--eu">Vende duas cocas no Pix<small>16:08:38</small></p>
                        <p class="lp-msg lp-msg--ele">Venda de <b>R$ 10,00</b> registrada no Pix. Estoque baixado.</p>
                    </div>
                    <p class="lp-conversa__nota">Sequência real: 46 segundos, sem abrir o painel. O bot recusou a primeira venda porque o estoque estava zerado.</p>
                </div>
            </div>
        </section>
"""


def segmentos(p):
    s_ = p['segmentos']
    itens = ''.join(
        f'<li class="revelar"><a class="lp-seg" href="{href}"><img src="{img}" width="400" height="167" loading="lazy" decoding="async" alt="" /><span>{e(nome)}</span></a></li>'
        for nome, img, href in s_['itens'])
    return f"""
        <section class="secao lp-segmentos" id="{s_['id']}">
            <div class="shell">
                <div class="cabeca-secao cabeca-secao--centro">
                    {titulo(s_['h2'])}
                    <p class="grande leitura">{e(s_['sub'])}</p>
                </div>
                <ul class="lp-segs lp-segs--muitos">{itens}</ul>
            </div>
        </section>
"""


def contato(p):
    c = p['contato']
    nums = ''.join(f'<li><b>{e(v)}</b><span>{e(r)}</span></li>' for v, r in c['numeros'])
    return f"""
        <section class="secao lp-contato">
            <div class="shell lp-contato__grade">
                <ul class="lp-contato__nums">{nums}</ul>
                <div class="lp-contato__fale">
                    <h2 class="display display--cartao">Fale com a gente</h2>
                    <ul>
                        <li><a href="{WHATS}" target="_blank" rel="noopener" data-track="whatsapp-support">{icone('whats', 22)}<span><b>WhatsApp</b>Uma pessoa da equipe responde</span></a></li>
                        <li><a href="mailto:suporte@softpaybr.com">{icone('nota', 22)}<span><b>E-mail</b>suporte@softpaybr.com</span></a></li>
                        <li><a href="/perguntas/">{icone('mais', 22)}<span><b>Perguntas</b>Tudo sobre o SoftPay, com resposta</span></a></li>
                    </ul>
                </div>
            </div>
        </section>
"""


SECOES_PADRAO = ['hero', 'numeros', 'dores', 'porque', 'passos', 'depoimentos', 'nuvem', 'comece', 'faq', 'final']


def pe(p):
    return f'''
    </main>

{rodape_da_home()}

    <div class="cta-fixa" data-visivel="nao">
        <a class="btn btn--acao" href="{APP}" data-track="complete-registration">Testar grátis</a>
        <a class="btn btn--linha" href="{WHATS}" target="_blank" rel="noopener" data-track="whatsapp-support">WhatsApp</a>
    </div>

    <script src="/efeitos.js" defer></script>
    <script src="/campanha/campanha.js" defer></script>
    <script src="/rastreio.js" defer></script>
    <script src="/consentimento.js" defer></script>
</body>

</html>
'''


def gerar(p):
    montar = {'hero': hero, 'numeros': numeros, 'dores': dores, 'porque': porque, 'passos': passos,
              'depoimentos': depoimentos, 'nuvem': nuvem, 'comece': comece, 'faq': faq, 'final': final,
              'prosa': prosa, 'bento': bento, 'citacoes': citacoes, 'fotorecursos': fotorecursos,
              'planos': planos, 'cta_duplo': cta_duplo, 'modulos': modulos, 'estoque': estoque,
              'caixa': caixa, 'relatorios': relatorios, 'plataformas': plataformas, 'catalogo': catalogo,
              'zap': zap, 'segmentos': segmentos, 'contato': contato}
    corpo = cabeca(p) + nav(p) + ''.join(montar[n](p) for n in p.get('secoes', SECOES_PADRAO)) + pe(p)
    # a home escreve os caminhos relativos (sistema.css, efeitos.js); aqui tudo é absoluto
    destino = PUBLIC / 'campanha' / p['slug'] / 'index.html'
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(corpo, encoding='utf-8')
    return destino


if __name__ == '__main__':
    quais = sys.argv[1:]
    for p in PAGINAS:
        if quais and p['slug'] not in quais:
            continue
        print('gerada:', gerar(p).relative_to(RAIZ))
