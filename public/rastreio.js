/* Rastreio de conversão da LP do SoftPay.
 *
 * Este arquivo só EMPURRA eventos para o dataLayer (fila de dados que o Google
 * Tag Manager lê). Quem transforma evento em conversão — Meta, GA4, Google Ads —
 * é o container GTM-MCJHLF3Q, do lado do gestor de tráfego. De propósito não
 * existe nenhuma chamada fbq() de conversão aqui: se a página disparasse o
 * evento e o GTM disparasse de novo, a mesma conversão contaria duas vezes e
 * estragaria a otimização da campanha.
 *
 * Todo evento carrega `meta_evento` com o nome do evento padrão da Meta
 * correspondente. Assim o gestor monta UMA tag só, com o nome vindo da própria
 * camada de dados, em vez de uma tag por evento.
 *
 * ---------------------------------------------------------------------------
 * EVENTOS
 *
 *  event                | meta_evento       | quando
 *  ---------------------|-------------------|---------------------------------
 *  cta_teste_gratis     | InitiateCheckout  | clique em botão que leva ao cadastro
 *  clique_whatsapp      | Contact           | clique em link de WhatsApp
 *  clique_email         | Contact           | clique em mailto:
 *  clique_entrar        | (nenhum)          | login de cliente — NÃO é conversão
 *  viu_planos           | ViewContent       | a tabela de preço entrou na tela
 *  visita_qualificada   | Lead              | 30 s na página E 50% de rolagem
 *  leu_conteudo         | ViewContent       | 15 s E 25% numa página de conteúdo
 *
 * Por que os três últimos existem: a Meta precisa de ~50 eventos por semana por
 * conjunto de anúncios para sair da fase de aprendizado
 * (developers/business help center; ver docs/rastreamento.md para as fontes).
 * O SoftPay fazia ~2 cadastros por dia em 16/09 — 14 por semana. Otimizar pelo
 * cadastro mantém a campanha em "aprendizado limitado" para sempre. `viu_planos`
 * e `visita_qualificada` têm volume muitas vezes maior e continuam correlacionados
 * com a intenção de compra, que é a condição para um evento intermediário não
 * ensinar a Meta a trazer o público errado.
 * ---------------------------------------------------------------------------
 */
(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    var APP = /(^|\.)softpaybr\.com$/i;              // domínio do aplicativo
    var UTM = /^(utm_[a-z]+|fbclid|gclid|ttclid|msclkid|ref)$/i;

    // O relógio só corre com a aba à vista. Sem isso, uma aba aberta em segundo
    // plano acumularia 30 segundos sozinha e a "visita qualificada" passaria a
    // significar presença, não atenção — que é justamente o que faz um evento
    // intermediário ensinar o algoritmo a buscar o público errado.
    var acumulado = 0;
    var desde = document.visibilityState === 'visible' ? Date.now() : 0;
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') { desde = Date.now(); }
        else if (desde) { acumulado += Date.now() - desde; desde = 0; }
    });
    // Voltar pelo botão do navegador restaura a página do cache (bfcache): sem
    // zerar aqui, o visitante que foi ao cadastro e voltou apareceria com
    // minutos de leitura que não existiram.
    window.addEventListener('pageshow', function (ev) {
        if (ev.persisted) { acumulado = 0; desde = Date.now(); }
    });

    /* ---------- identificador único, para o dia do CAPI ---------- */

    // A Conversions API (envio pelo servidor) recupera as conversões que o
    // navegador perde — mais da metade, segundo a própria Meta. Quando o
    // servidor mandar o mesmo evento, os dois precisam carregar o MESMO
    // event_id, senão a conversão conta em dobro. Gerar agora custa nada e
    // evita ter de mexer em 77 páginas depois.
    function id() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        return 'e-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    }

    /* ---------- contexto ---------- */

    function profundidade() {
        var de = document.documentElement;
        var rolavel = de.scrollHeight - window.innerHeight;
        if (rolavel <= 0) return 100;
        return Math.min(100, Math.round((window.scrollY / rolavel) * 100));
    }

    function segundos() {
        return Math.round((acumulado + (desde ? Date.now() - desde : 0)) / 1000);
    }

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

    // De onde a visita veio. O gestor precisa disto no próprio evento para
    // separar tráfego pago de orgânico sem depender do relatório do GA4.
    function origem() {
        var q = new URLSearchParams(location.search);
        if (q.get('fbclid')) return 'meta';
        if (q.get('gclid')) return 'google-ads';
        if (q.get('ttclid')) return 'tiktok';
        var u = q.get('utm_source');
        if (u) return u.toLowerCase().slice(0, 40);
        if (!document.referrer) return 'direto';
        try {
            var h = new URL(document.referrer).hostname.replace(/^www\./, '');
            return h === location.hostname ? 'interno' : h.slice(0, 40);
        } catch (e) { return 'direto'; }
    }

    var ORIGEM = origem();

    function empurra(nome, metaEvento, extra) {
        var dado = {
            event: nome,
            meta_evento: metaEvento || '',
            event_id: id(),
            pagina: location.pathname,
            pagina_tipo: tipoDaPagina(),
            origem: ORIGEM,
            profundidade_pct: profundidade(),
            segundos_na_pagina: segundos()
        };
        if (extra) for (var k in extra) dado[k] = extra[k];
        window.dataLayer.push(dado);
    }

    // Que tipo de página é esta — dá ao gestor público de remarketing por
    // interesse ("quem leu a página de NF-e") sem ele listar 77 URLs à mão.
    function tipoDaPagina() {
        var p = location.pathname;
        if (p === '/' || p === '/index.html') return 'home';
        var m = p.match(/^\/(segmentos|solucoes|guias|blog|comparativos|perguntas|contato|sobre)\b/);
        if (m) return p.split('/').filter(Boolean).length > 1 ? m[1] + '-interna' : m[1];
        if (/privacidade|termos|reembolso/.test(p)) return 'legal';
        return 'outra';
    }

    /* ---------- cliques ---------- */

    function ehEntrar(a) {
        return a.classList.contains('nav__entrar') ||
               /^(entrar|login|acessar|fazer login)$/i.test(texto(a));
    }

    function doBotao(el) {
        var extra = { cta_texto: texto(el), cta_local: local(el), cta_destino: el.href || '' };
        var p = plano(el);
        if (p) extra.cta_plano = p;
        return extra;
    }

    // Captura: roda antes de qualquer handler que chame preventDefault, e o
    // push é síncrono — entra na fila antes de a navegação começar.
    //
    // Dois eventos, não um: o botão do meio (abrir em nova aba) NÃO dispara
    // 'click' no Chrome desde a versão 55 — dispara 'auxclick'. Quem compara
    // preço costuma abrir o cadastro em aba nova, e esse clique estava sumindo.
    function noClique(ev) {
        var a = ev.target.closest && ev.target.closest('a[href]');
        if (!a) return;

        var href = a.getAttribute('href') || '';

        if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp.com') > -1) {
            empurra('clique_whatsapp', 'Contact', doBotao(a)); return;
        }
        if (href.slice(0, 7) === 'mailto:') {
            empurra('clique_email', 'Contact', doBotao(a)); return;
        }

        var destino;
        try { destino = new URL(a.href, location.href); } catch (e) { return; }
        if (!APP.test(destino.hostname) || destino.hostname === location.hostname) return;

        if (ehEntrar(a)) empurra('clique_entrar', '', doBotao(a));
        else empurra('cta_teste_gratis', 'InitiateCheckout', doBotao(a));
    }

    document.addEventListener('click', noClique, true);
    document.addEventListener('auxclick', function (ev) {
        if (ev.button === 1) noClique(ev);   // só o do meio; o direito abre menu
    }, true);

    /* ---------- a tabela de preço entrou na tela ---------- */

    // Medido em 21/09/2026: a seção de planos começa a 77% da altura da home
    // (12.495px de 16.253px). Quem chega do anúncio cai no topo — saber quantos
    // realmente alcançam o preço é o diagnóstico que o relatório de campanha
    // não dá.
    function vigiaPlanos() {
        var alvo = document.querySelector('#planos, [data-secao="planos"], .planos');
        if (!alvo || !('IntersectionObserver' in window)) return;

        // Não use `intersectionRatio >= 0.5`: essa razão é da SEÇÃO, e a seção
        // de planos é mais alta que a tela do celular. Medido em 21/09/2026, a
        // razão máxima possível era 0,59 em 360px — uma linha a mais num cartão
        // e o evento pararia de disparar sem ninguém perceber. O que interessa
        // é quanto da TELA a tabela de preço ocupa.
        var relogio = null;
        var obs = new IntersectionObserver(function (itens) {
            itens.forEach(function (i) {
                var visivel = i.intersectionRect.height;
                var basta = Math.min(window.innerHeight * 0.5, i.boundingClientRect.height * 0.5);
                if (i.isIntersecting && visivel >= basta) {
                    if (relogio) return;
                    relogio = setTimeout(function () {
                        empurra('viu_planos', 'ViewContent', { content_name: 'Planos', content_type: 'pricing' });
                        obs.disconnect();
                    }, 1000);
                } else if (relogio) { clearTimeout(relogio); relogio = null; }
            });
        }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
        obs.observe(alvo);
    }

    /* ---------- visita que vale como sinal ---------- */

    // 30 s E metade da página. Tem volume muitas vezes maior que o cadastro e
    // continua ligado à intenção — que é a condição para um evento intermediário
    // não ensinar a Meta a trazer quem nunca compra.
    function vigiaQualificada() {
        // Página legal, 404 e afins ficam de fora: alguém lendo a política de
        // privacidade por 30 segundos viraria "Lead" e entraria no evento pelo
        // qual a campanha otimiza. Sinal de intenção de compra, não de leitura
        // de contrato.
        if (/^(legal|outra)$/.test(tipoDaPagina())) return;

        var pronto = false, maxProf = 0, t = null;
        function para() {
            pronto = true;
            window.removeEventListener('scroll', olha);
            if (t) { clearInterval(t); t = null; }
        }
        function olha() {
            if (pronto) return;
            maxProf = Math.max(maxProf, profundidade());
            if (segundos() >= 30 && maxProf >= 50) {
                empurra('visita_qualificada', 'Lead', { profundidade_max: maxProf });
                para();
            }
        }
        window.addEventListener('scroll', olha, { passive: true });
        t = setInterval(olha, 5000);
        // Quem passou 10 minutos à vista sem chegar à metade não vai chegar.
        // Desistir é o que impede um temporizador de sobreviver a aba esquecida.
        setTimeout(function () { if (!pronto) para(); }, 10 * 60 * 1000);
    }

    // Página de conteúdo lida de verdade (15 s e um quarto rolado), não uma
    // batida de porta. Serve de público de remarketing por interesse.
    function vigiaLeitura() {
        var tipo = tipoDaPagina();
        if (!/^(guias|blog|comparativos|solucoes|segmentos|perguntas)/.test(tipo)) return;
        var pronto = false, t = null;
        function para() { pronto = true; if (t) { clearInterval(t); t = null; } }
        t = setInterval(function () {
            if (pronto) { para(); return; }
            if (segundos() >= 15 && profundidade() >= 25) {
                empurra('leu_conteudo', 'ViewContent', {
                    content_name: (document.title || '').split('|')[0].trim().slice(0, 80),
                    content_type: tipo
                });
                para();
            }
        }, 3000);
        setTimeout(function () { if (!pronto) para(); }, 10 * 60 * 1000);
    }

    /* ---------- a origem da visita viaja junto para o aplicativo ---------- */

    // A LP está em site.softpaybr.com e o cadastro em www.softpaybr.com. Os
    // cookies _fbp e _fbc ficam em .softpaybr.com, então a Meta já liga os dois
    // — mas o GA4 e os relatórios do gestor não: sem repassar utm_* na própria
    // URL, o cadastro aparece como tráfego direto.
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

    function comeca() { repassa(); vigiaPlanos(); vigiaQualificada(); vigiaLeitura(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', comeca);
    } else {
        comeca();
    }
})();
