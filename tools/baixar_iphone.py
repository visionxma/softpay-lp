# -*- coding: utf-8 -*-
"""Botão "Baixar para iPhone" na navbar + Smart App Banner (app SoftPay PDV, id 6829463542).

Pedido do Victor (09/11/2026): LP de produto com app na App Store leva o botão na navbar.
O estilo do botão mora em public/sistema.css (seção 6, "Barra: logo | links no CENTRO |
ações"), desde 15/11/2026. Antes ia num <style> repetido em cada página, com o rótulo
escolhido pela largura da JANELA, e a cápsula (no máximo 1184 px) mostrava "Baixar para
iPhone" por cima do menu de 1366 a 1920. Agora quem escolhe o rótulo é a largura da
própria barra; o sistema.css já sai com ?v=<hash> (tools/versionar-assets.py), então o
cache não serve mais CSS velho com HTML novo, que era a razão do <style> embutido.
"""
APP_ID = "6829463542"
URL = "https://apps.apple.com/br/app/softpay-pdv/id6829463542"
META = '<meta name="apple-itunes-app" content="app-id=%s" />' % APP_ID

ICONE = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
         'stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="6" y="2" width="12" height="20" rx="3"/>'
         '<path d="M11 18h2"/></svg>')

BOTAO = ('<a class="nav__link nav__iphone" href="%s" target="_blank" rel="noopener" data-track="app-store" '
         'aria-label="Baixar para iPhone (abre a App Store em nova aba)">%s<span class="nav__iphone-c">iPhone</span>'
         '<span class="nav__iphone-l">Baixar para iPhone</span></a>') % (URL, ICONE)

GAVETA = '<a href="%s" target="_blank" rel="noopener" data-track="app-store">Baixar para iPhone</a>' % URL
