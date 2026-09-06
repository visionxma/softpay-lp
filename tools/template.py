# -*- coding: utf-8 -*-
"""Template compartilhado das páginas internas do site SoftPay.

Cada página traz o próprio conteúdo; daqui saem só as partes que devem ser
idênticas em todo o site: <head>, dados estruturados, navegação, breadcrumbs
e rodapé. Assim nenhuma página é "find and replace" de outra, mas todas
seguem o mesmo padrão de SEO e de layout.
"""

BASE = "https://site.softpaybr.com"
APP = "https://www.softpaybr.com/auth"
WPP = ("https://wa.me/558698193851?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida"
       "%20sobre%20o%20SoftPay.")


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


def _json(obj, indent=2):
    import json
    s = json.dumps(obj, ensure_ascii=False, indent=indent)
    return "\n".join("    " + l if l.strip() else l for l in s.split("\n"))


def render(*, slug, title, description, h1, intro, blocks, faq=None,
           related=None, breadcrumbs=None, cta_title=None, cta_text=None,
           updated="2026-09-04"):
    """slug: caminho sem barras nas pontas, ex 'segmentos/mercadinho'."""
    url = "%s/%s/" % (BASE, slug)
    crumbs = breadcrumbs or []

    # ---------- dados estruturados ----------
    graph = [{
        "@type": "WebPage",
        "@id": url + "#webpage",
        "url": url,
        "name": title,
        "description": description,
        "inLanguage": "pt-BR",
        "isPartOf": {"@id": BASE + "/#website"},
        "about": {"@id": BASE + "/#softpay"},
        "dateModified": updated,
    }]

    itens = [{"@type": "ListItem", "position": 1, "name": "Início", "item": BASE + "/"}]
    for i, (nome, href) in enumerate(crumbs, start=2):
        it = {"@type": "ListItem", "position": i, "name": nome}
        if href:
            it["item"] = BASE + href
        itens.append(it)
    graph.append({
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumb",
        "itemListElement": itens,
    })

    if faq:
        graph.append({
            "@type": "FAQPage",
            "@id": url + "#faq",
            "inLanguage": "pt-BR",
            "mainEntity": [{
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            } for q, a in faq],
        })

    ld = _json({"@context": "https://schema.org", "@graph": graph})

    # ---------- breadcrumbs visíveis ----------
    bc_html = ['<nav class="breadcrumb" aria-label="Você está aqui">',
               '        <ol>',
               '          <li><a href="/">Início</a></li>']
    for nome, href in crumbs:
        if href:
            bc_html.append('          <li><a href="%s">%s</a></li>' % (href, esc(nome)))
        else:
            bc_html.append('          <li><span aria-current="page">%s</span></li>' % esc(nome))
    bc_html += ['        </ol>', '      </nav>']
    bc_html = "\n        ".join(bc_html)

    # ---------- FAQ visível ----------
    faq_html = ""
    if faq:
        itens_faq = "\n".join(
            '          <details class="faq-item">\n'
            '            <summary class="faq-question">%s</summary>\n'
            '            <div class="faq-answer"><p>%s</p></div>\n'
            '          </details>' % (esc(q), esc(a)) for q, a in faq)
        faq_html = '''
      <section class="page-faq faq--split" id="perguntas">
        <div class="faq-layout">
          <div class="faq-aside">
            <h2>Perguntas frequentes</h2>
          </div>
          <div class="faq-list">
%s
          </div>
        </div>
      </section>
''' % itens_faq

    # ---------- links relacionados ----------
    rel_html = ""
    if related:
        li = "\n".join(
            '          <li><a href="%s"><strong>%s</strong><span>%s</span></a></li>'
            % (href, esc(nome), esc(desc)) for nome, href, desc in related)
        rel_html = '''
      <section class="page-related">
        <h2>Continue por aqui</h2>
        <ul class="related-grid">
%s
        </ul>
      </section>
''' % li

    corpo = "\n".join(blocks)

    return '''<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>%(title)s</title>
    <meta name="description" content="%(description)s" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
    <meta name="theme-color" content="#1DA1F2" />
    <link rel="canonical" href="%(url)s" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="SoftPay" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="%(url)s" />
    <meta property="og:title" content="%(title)s" />
    <meta property="og:description" content="%(description)s" />
    <meta property="og:image" content="%(base)s/assets/COmputador.webp" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="%(title)s" />
    <meta name="twitter:description" content="%(description)s" />
    <meta name="twitter:image" content="%(base)s/assets/COmputador.webp" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet" />
    <link rel="stylesheet" href="/style.css?v=cebb7bfb37" />
    <link rel="icon" href="/assets/icones e favicon.svg" type="image/svg+xml" />

    <script type="application/ld+json">
%(ld)s
    </script>

    <!-- Meta Pixel (mesmos IDs da home) -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1476552610693219');
    fbq('init', '26424939163836170');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1476552610693219&ev=PageView&noscript=1"
    /></noscript>
</head>

<body>
    <a class="skip-link" href="#conteudo">Ir para o conteúdo principal</a>

    <nav class="navbar navbar--solid" id="navbar">
        <div class="container">
            <div class="nav-wrapper">
                <div class="logo-container">
                    <a href="/"><img src="/assets/logo.png" width="150" height="40"
                        alt="SoftPay — sistema de gestão para pequenos negócios" class="logo-img" /></a>
                </div>
                <ul class="nav-menu nav-menu--simple">
                    <li><a href="/segmentos/" class="nav-link">Segmentos</a></li>
                    <li><a href="/solucoes/" class="nav-link">Soluções</a></li>
                    <li><a href="/guias/" class="nav-link">Guias</a></li>
                    <li><a href="/#pricing" class="nav-link">Preços</a></li>
                    <li><a href="%(app)s" class="nav-link btn-nav-cta">Teste Grátis 7 Dias</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <main id="conteudo" class="page">
      <div class="container container--article">
        %(bc)s

        <header class="page-header">
          <h1 class="page-title">%(h1)s</h1>
          <p class="page-intro">%(intro)s</p>
        </header>

%(corpo)s
%(faq)s
        <aside class="page-cta">
          <h2>%(cta_title)s</h2>
          <p>%(cta_text)s</p>
          <div class="page-cta-actions">
            <a href="%(app)s" class="btn btn-primary btn-large" data-track="complete-registration">Começar grátis por 7 dias</a>
            <a href="%(wpp)s" target="_blank" rel="noopener" class="btn btn-secondary" data-track="whatsapp-support">Falar com o suporte</a>
          </div>
          <p class="page-cta-note">7 dias grátis · sem cartão · sem compromisso</p>
        </aside>
%(rel)s
      </div>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <img src="/assets/logo.png" alt="SoftPay" class="footer-logo" width="150" height="40" loading="lazy" />
                    <p class="footer-description">
                        O SoftPay é um sistema de gestão para pequenos negócios brasileiros.
                        PDV, estoque, caixa, fiado, notas fiscais, clientes e loja online em um
                        só lugar, acessado pelo navegador, com suporte humano e atendimento
                        em todo o Brasil.
                    </p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Soluções</h4>
                        <ul>
                            <li><a href="/solucoes/sistema-pdv/">Sistema PDV</a></li>
                            <li><a href="/solucoes/sistema-de-estoque/">Controle de estoque</a></li>
                            <li><a href="/solucoes/controle-de-fiado/">Controle de fiado</a></li>
                            <li><a href="/solucoes/loja-online/">Loja online</a></li>
                            <li><a href="/solucoes/">Ver todas</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Para o seu negócio</h4>
                        <ul>
                            <li><a href="/segmentos/mercadinho/">Mercadinho</a></li>
                            <li><a href="/segmentos/loja-de-roupas/">Loja de roupas</a></li>
                            <li><a href="/segmentos/papelaria/">Papelaria</a></li>
                            <li><a href="/segmentos/distribuidora/">Distribuidora</a></li>
                            <li><a href="/segmentos/">Ver todos</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Conteúdo</h4>
                        <ul>
                            <li><a href="/sistema-de-gestao-para-pequenos-negocios/">O que é sistema de gestão</a></li>
                            <li><a href="/guias/">Guias</a></li>
                            <li><a href="/perguntas/">Perguntas</a></li>
                            <li><a href="/sobre/">Sobre</a></li>
                            <li><a href="/contato/">Contato</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="/termos">Termos de Uso</a></li>
                            <li><a href="/privacidade">Política de Privacidade</a></li>
                            <li><a href="/reembolso">Política de Reembolso</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="footer-company">
                    SoftPay é um produto de<br>
                    <strong>VisionX Inova Simples (IS)</strong><br>
                    CNPJ: 61.427.918/0001-06<br>
                    Pedreiras/MA · Brasil
                </p>
                <p>&copy; 2026 SoftPay · Todos os direitos reservados</p>
            </div>
        </div>
    </footer>

    <a href="%(wpp)s" target="_blank" rel="noopener" class="whatsapp-float" aria-label="Fale conosco no WhatsApp">
        <span class="whatsapp-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true" focusable="false">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
        </span>
    </a>

    <a href="%(app)s" class="float-cta" data-track="complete-registration">Começar grátis</a>

    <script src="/script.js?v=f6d90c0070"></script>
</body>

</html>
''' % dict(title=esc(title), description=esc(description), url=url, base=BASE,
           ld=ld, bc=bc_html, h1=h1, intro=intro, corpo=corpo, faq=faq_html,
           rel=rel_html, app=APP, wpp=WPP,
           cta_title=esc(cta_title or "Experimente o SoftPay por 7 dias"),
           cta_text=esc(cta_text or ("Teste todos os recursos do plano sem cartão de crédito. "
                                     "Se não fizer sentido para a sua loja, é só não continuar.")))
