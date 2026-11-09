# -*- coding: utf-8 -*-
"""Botão "Baixar para iPhone" na navbar + Smart App Banner (app SoftPay PDV, id 6829463542).

Pedido do Victor (09/11/2026): LP de produto com app na App Store leva o botão na navbar.
O CSS vai inline (junto da navbar) porque as páginas geradas carregam /sistema.css sem
versão no endereço e o cache dele dura 1 dia: botão novo com CSS velho sairia sem estilo.
Rótulo: ícone só abaixo de 30rem e de 62rem a 72rem; "iPhone" de 30rem a 62rem e de 72rem a 83rem;
"Baixar para iPhone" a partir de 83rem (o menu central da barra e os botões da direita disputam o espaço).
"""
APP_ID = "6829463542"
URL = "https://apps.apple.com/br/app/softpay-pdv/id6829463542"
META = '<meta name="apple-itunes-app" content="app-id=%s" />' % APP_ID

CSS = """<style>.nav__iphone{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:2.75rem;min-width:2.75rem;padding:.5rem .625rem}
.nav__iphone svg{flex:none;width:20px;height:20px}
.nav__iphone-c,.nav__iphone-l{display:none}
@media (min-width:30rem) and (max-width:61.99rem){.nav__iphone-c{display:inline}}
@media (min-width:72rem) and (max-width:82.99rem){.nav__iphone-c{display:inline}}
@media (min-width:83rem){.nav__iphone-l{display:inline}}
@media (max-width:29.99rem){.nav__iphone{padding-inline:.25rem}}</style>"""

ICONE = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
         'stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="6" y="2" width="12" height="20" rx="3"/>'
         '<path d="M11 18h2"/></svg>')

BOTAO = (CSS + '<a class="nav__link nav__iphone" href="%s" target="_blank" rel="noopener" data-track="app-store" '
         'aria-label="Baixar para iPhone (abre a App Store em nova aba)">%s<span class="nav__iphone-c">iPhone</span>'
         '<span class="nav__iphone-l">Baixar para iPhone</span></a>') % (URL, ICONE)

GAVETA = '<a href="%s" target="_blank" rel="noopener" data-track="app-store">Baixar para iPhone</a>' % URL
