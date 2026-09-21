/* Consentimento de cookies (LGPD) — pronto, desligado por padrão.
 *
 * Para ligar: troque `false` por `true` no bloco SOFTPAY_CONSENTIMENTO que está
 * no <head> de cada página (e em tools/template.py, para as geradas).
 *
 * Enquanto está desligado este arquivo sai na primeira linha: nenhum banner,
 * nenhum estilo, nenhum listener. O site se comporta exatamente como antes.
 *
 * Por que desligado: ligar muda o que o gestor de tráfego mede. Com o
 * consentimento exigido, o Google Tag Manager sobe em modo negado (Consent Mode
 * v2: pings sem cookie) e o Pixel da Meta fica com `consent: revoke` até o
 * visitante aceitar — quem recusar deixa de ser atribuído à campanha. Isso é
 * decisão de negócio, e precisa ser combinada com o Érick antes, não descoberta
 * por ele numa queda de conversão.
 */
(function () {
    'use strict';
    if (!window.SOFTPAY_CONSENTIMENTO) return;

    // ESTILO precisa ser atribuído ANTES do `return` de quem já escolheu: quem
    // já aceitou ou recusou sai cedo, e se a folha de estilo ficasse depois
    // disso, reabrir a escolha pelo link do rodapé injetaria `undefined`.
    // Declaração de função é içada; atribuição de `var`, não.

    var CHAVE = 'softpay-consentimento';
    var POLITICA = '/privacidade';

    // Microsoft Clarity — mapa de calor e gravação de sessão. Cole aqui o ID do
    // projeto (Configurações → Setup, o código dentro de clarity("set", ...)).
    // Vazio: não carrega nada.
    //
    // Fica AQUI, e não no <head>, de propósito: gravação de sessão é cookie não
    // essencial, então só pode subir depois do aceite. Quem recusa nunca é
    // gravado.
    var CLARITY = '';

    function lido() {
        try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
    }
    function grava(v) {
        try { localStorage.setItem(CHAVE, v); } catch (e) { /* navegação privativa */ }
    }

    function gtag() { (window.dataLayer = window.dataLayer || []).push(arguments); }

    function aplica(aceitou) {
        var v = aceitou ? 'granted' : 'denied';
        gtag('consent', 'update', {
            ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v
        });
        if (typeof window.fbq === 'function') window.fbq('consent', aceitou ? 'grant' : 'revoke');
        window.dataLayer.push({ event: 'consentimento', consentimento_escolha: aceitou ? 'aceito' : 'recusado' });
        if (aceitou) sobeClarity();
    }

    // Carrega uma vez só. Quem aceita, recusa e aceita de novo na mesma aba não
    // pode acabar com dois gravadores na página.
    var clarityNoAr = false;
    function sobeClarity() {
        if (!CLARITY || clarityNoAr) return;
        clarityNoAr = true;
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY);
    }

    var ESTILO = [
        '.co-barra{position:fixed;left:0;right:0;bottom:0;z-index:60;',
        'background:var(--noite,#06121F);color:#fff;',
        'padding:var(--sp-4,1rem) var(--gutter,1rem);',
        'padding-bottom:calc(var(--sp-4,1rem) + env(safe-area-inset-bottom,0px));',
        'box-shadow:0 -18px 44px -14px rgba(6,18,31,.5);',
        'transform:translateY(100%);transition:transform .38s cubic-bezier(.22,1,.36,1)}',
        '.co-barra[data-visivel="sim"]{transform:none}',
        '.co-caixa{width:100%;max-width:var(--shell,78rem);margin-inline:auto;',
        'display:grid;gap:var(--sp-3,.75rem)}',
        '@media (min-width:56rem){.co-caixa{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:var(--sp-5,1.5rem)}}',
        '.co-texto{margin:0;font-size:.875rem;line-height:1.5;color:rgba(255,255,255,.8)}',
        '.co-texto a{color:#7FC8F5}',
        '.co-acoes{display:flex;flex-wrap:wrap;gap:var(--sp-2,.5rem)}',
        '.co-acoes>*{flex:1 1 8.5rem}',
        '@media (min-width:56rem){.co-acoes>*{flex:0 0 auto}}',
        '.co-btn{min-height:2.75rem;padding:0 1.15rem;border-radius:9999px;border:1px solid transparent;',
        'font:inherit;font-size:.875rem;font-weight:600;cursor:pointer;',
        'display:inline-flex;align-items:center;justify-content:center;',
        'transition:transform .15s cubic-bezier(.22,1,.36,1)}',
        '.co-btn:active{transform:scale(.98)}',
        '.co-btn--sim{background:#1DA1F2;color:#06121F}',
        '.co-btn--nao{background:transparent;color:#fff;border-color:rgba(255,255,255,.55)}',
        '@media (prefers-reduced-motion:reduce){.co-barra{transition:opacity .2s linear;transform:none;opacity:0}',
        '.co-barra[data-visivel="sim"]{opacity:1}}'
    ].join('');

    // Revogar tem de ser tão fácil quanto aceitar — a ANPD pede que o titular
    // possa retirar o consentimento "de forma facilitada e gratuita". Qualquer
    // link com href="#cookies" ou [data-cookies] reabre a escolha, em qualquer
    // página. É o que o rodapé e a Política de Privacidade usam.
    document.addEventListener('click', function (ev) {
        var a = ev.target.closest && ev.target.closest('[data-cookies], a[href="#cookies"]');
        if (!a) return;
        ev.preventDefault();
        try { localStorage.removeItem(CHAVE); } catch (e) {}
        var velho = document.querySelector('.co-barra');
        if (velho) velho.remove();
        monta();
    });

    var escolha = lido();
    if (escolha === 'aceito' || escolha === 'recusado') {
        aplica(escolha === 'aceito');
        return;
    }


    function monta() {
        if (!document.getElementById('co-estilo')) {
            var st = document.createElement('style');
            st.id = 'co-estilo';
            st.textContent = ESTILO;
            document.head.appendChild(st);
        }

        var barra = document.createElement('div');
        barra.className = 'co-barra';
        barra.setAttribute('role', 'region');
        barra.setAttribute('aria-label', 'Aviso de cookies');
        barra.dataset.visivel = 'nao';
        barra.innerHTML =
            '<div class="co-caixa">' +
              '<p class="co-texto">Usamos cookies de medição e publicidade para entender como o site é usado ' +
              'e mostrar o SoftPay a quem já demonstrou interesse. Os essenciais, que fazem a página funcionar, ' +
              'continuam ativos. <a href="' + POLITICA + '">Política de Privacidade</a>.</p>' +
              '<div class="co-acoes">' +
                '<button type="button" class="co-btn co-btn--nao" data-co="nao">Só os essenciais</button>' +
                '<button type="button" class="co-btn co-btn--sim" data-co="sim">Aceitar</button>' +
              '</div>' +
            '</div>';
        document.body.appendChild(barra);
        requestAnimationFrame(function () { barra.dataset.visivel = 'sim'; });

        barra.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-co]');
            if (!b) return;
            var aceitou = b.dataset.co === 'sim';
            grava(aceitou ? 'aceito' : 'recusado');
            aplica(aceitou);
            barra.dataset.visivel = 'nao';
            setTimeout(function () { barra.remove(); }, 400);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', monta);
    } else {
        monta();
    }
})();
