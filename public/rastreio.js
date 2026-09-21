/* Rastreio de conversão da LP do SoftPay.
 *
 * Este arquivo só EMPURRA eventos para o dataLayer (fila de dados que o Google
 * Tag Manager lê). Quem transforma evento em conversão — Meta, GA4, Google Ads —
 * é o container GTM-MCJHLF3Q, do lado do gestor de tráfego. De propósito não
 * existe nenhuma chamada fbq() aqui: se a página disparasse o evento e o GTM
 * disparasse de novo, a mesma conversão contaria duas vezes e estragaria a
 * otimização da campanha.
 *
 * Eventos publicados (nome do `event` no dataLayer):
 *   cta_teste_gratis   clique em qualquer botão que leva ao cadastro do trial
 *   clique_entrar      clique em "Entrar" (login de quem já é cliente)
 *   clique_whatsapp    clique em qualquer link de WhatsApp
 *   clique_email       clique em qualquer link mailto:
 */
(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    var APP = /(^|\.)softpaybr\.com$/i;              // domínio do aplicativo
    var UTM = /^(utm_[a-z]+|fbclid|gclid|ttclid|msclkid|ref)$/i;

    /* ---------- de onde o botão foi clicado ---------- */

    // Rótulo humano de onde o botão estava. As peças flutuantes vêm primeiro:
    // elas ficam fora de qualquer <section> e seriam rotuladas como "corpo".
    function local(el) {
        if (el.classList.contains('whatsapp-float') || el.closest('.whatsapp-float')) return 'bolha-whatsapp';
        if (el.classList.contains('float-cta') || el.closest('.float-cta')) return 'cta-flutuante';
        if (el.closest('.cta-fixa, .barra-fixa, [data-fixo]')) return 'barra-fixa';
        if (el.closest('.gaveta')) return 'menu-celular';
        if (el.closest('nav')) return 'menu';
        if (el.closest('footer')) return 'rodape';
        if (el.closest('.page-cta')) return 'cta-final';
        var sec = el.closest('section[id], [data-secao]');
        if (sec) return sec.getAttribute('data-secao') || sec.id;
        return 'corpo';
    }

    // Nome do plano, quando o botão está dentro de um cartão de plano.
    function plano(el) {
        var card = el.closest('.plano, .plano-parte');
        if (!card) return '';
        var nome = card.querySelector('.plano__nome, .plano-parte__nome');
        return nome ? nome.textContent.trim() : '';
    }

    function texto(el) {
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!t) t = el.getAttribute('aria-label') || '';
        return t.slice(0, 80);
    }

    function empurra(nome, el, extra) {
        var dado = {
            event: nome,
            cta_texto: texto(el),
            cta_local: local(el),
            cta_destino: el.href || '',
            pagina: location.pathname
        };
        var p = plano(el);
        if (p) dado.cta_plano = p;
        if (extra) for (var k in extra) dado[k] = extra[k];
        window.dataLayer.push(dado);
    }

    /* ---------- classificação do clique ---------- */

    function ehEntrar(a) {
        return a.classList.contains('nav__entrar') ||
               /^(entrar|login|acessar|fazer login)$/i.test(texto(a));
    }

    // Captura: roda antes de qualquer handler que chame preventDefault, e o
    // push é síncrono — entra na fila antes de a navegação começar.
    document.addEventListener('click', function (ev) {
        var a = ev.target.closest && ev.target.closest('a[href]');
        if (!a) return;

        var href = a.getAttribute('href') || '';

        if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp.com') > -1) {
            empurra('clique_whatsapp', a, { canal: 'whatsapp' });
            return;
        }
        if (href.slice(0, 7) === 'mailto:') {
            empurra('clique_email', a, { canal: 'email' });
            return;
        }

        var destino;
        try { destino = new URL(a.href, location.href); } catch (e) { return; }
        if (!APP.test(destino.hostname)) return;
        if (destino.hostname === location.hostname) return;   // link interno do site

        empurra(ehEntrar(a) ? 'clique_entrar' : 'cta_teste_gratis', a);
    }, true);

    /* ---------- a origem da visita viaja junto para o aplicativo ---------- */

    // A LP está em site.softpaybr.com e o cadastro em www.softpaybr.com. Sem
    // repassar utm_* e fbclid na própria URL, o cadastro chega como tráfego
    // direto e a campanha perde o crédito da conversão.
    function repassa() {
        var atual = new URLSearchParams(location.search);
        var levar = [];
        atual.forEach(function (v, k) { if (UTM.test(k)) levar.push([k, v]); });
        if (!levar.length) return;

        var links = document.querySelectorAll('a[href]');
        for (var i = 0; i < links.length; i++) {
            var a = links[i], u;
            try { u = new URL(a.href, location.href); } catch (e) { continue; }
            if (!APP.test(u.hostname) || u.hostname === location.hostname) continue;
            for (var j = 0; j < levar.length; j++) {
                if (!u.searchParams.has(levar[j][0])) u.searchParams.set(levar[j][0], levar[j][1]);
            }
            a.href = u.toString();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', repassa);
    } else {
        repassa();
    }
})();
