/* SoftPay 2.0 — efeitos. Sem dependência, sem evento de scroll.
   Nada de conteúdo depende deste arquivo para aparecer: a classe .js-ok
   só é aplicada depois que o script roda. */
(function () {
    'use strict';

    var doc = document.documentElement;
    var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- 1. Revelar ao entrar na tela, com escalonamento entre irmãos --- */
    doc.classList.add('js-ok');
    var alvos = document.querySelectorAll('.revelar');
    if (!('IntersectionObserver' in window)) {
        alvos.forEach(function (el) { el.classList.add('visivel'); });
    } else {
        var obs = new IntersectionObserver(function (itens) {
            itens.forEach(function (item) {
                if (!item.isIntersecting) return;
                var el = item.target;
                var irmaos = Array.prototype.filter.call(
                    el.parentElement ? el.parentElement.children : [],
                    function (n) { return n.classList.contains('revelar'); }
                );
                var i = irmaos.indexOf(el);
                el.style.setProperty('--atraso', (i > 0 ? Math.min(i, 6) * 60 : 0) + 'ms');
                el.classList.add('visivel');
                obs.unobserve(el);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        alvos.forEach(function (el) { obs.observe(el); });
    }

    /* --- 2. Menu do celular --- */
    var botao = document.querySelector('[data-gaveta-botao]');
    var gaveta = document.getElementById('gaveta');
    if (botao && gaveta) {
        botao.addEventListener('click', function () {
            var aberta = gaveta.getAttribute('data-aberta') === 'sim';
            gaveta.setAttribute('data-aberta', aberta ? 'nao' : 'sim');
            botao.setAttribute('aria-expanded', String(!aberta));
            document.body.style.overflow = aberta ? '' : 'hidden';
        });
        gaveta.addEventListener('click', function (e) {
            if (e.target.tagName !== 'A') return;
            gaveta.setAttribute('data-aberta', 'nao');
            botao.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    }

    /* --- 3. Abas do bloco "o sistema por dentro" --- */
    var abas = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    function trocar(alvo) {
        abas.forEach(function (aba) {
            var ativa = aba === alvo;
            aba.setAttribute('aria-selected', String(ativa));
            aba.tabIndex = ativa ? 0 : -1;
            var painel = document.getElementById(aba.getAttribute('aria-controls'));
            if (painel) painel.hidden = !ativa;
        });
    }
    abas.forEach(function (aba, i) {
        aba.addEventListener('click', function () { trocar(aba); });
        aba.addEventListener('keydown', function (e) {
            var passo = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
            if (!passo) return;
            e.preventDefault();
            var proxima = abas[(i + passo + abas.length) % abas.length];
            proxima.focus();
            trocar(proxima);
        });
    });

    /* --- 4. FAQ: abrir uma fecha a outra (fallback do name= em <details>) --- */
    var suporta = (function () {
        var d = document.createElement('details');
        return 'name' in d;
    })();
    if (!suporta) {
        document.querySelectorAll('details[name]').forEach(function (d) {
            d.addEventListener('toggle', function () {
                if (!d.open) return;
                document.querySelectorAll('details[name="' + d.getAttribute('name') + '"]')
                    .forEach(function (o) { if (o !== d) o.open = false; });
            });
        });
    }

    /* --- 5. "Ver mais": revela o resto sem recarregar --- */
    document.querySelectorAll('[data-ver-mais]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll(btn.getAttribute('data-ver-mais'))
                .forEach(function (el) { el.hidden = false; });
            btn.remove();
        });
    });

    /* --- 6. Contador dos números --- */
    if (!calmo && 'IntersectionObserver' in window) {
        var contadores = document.querySelectorAll('[data-conta]');
        var obsN = new IntersectionObserver(function (itens) {
            itens.forEach(function (item) {
                if (!item.isIntersecting) return;
                var el = item.target;
                obsN.unobserve(el);
                var fim = parseFloat(el.getAttribute('data-conta'));
                var prefixo = el.getAttribute('data-prefixo') || '';
                var sufixo = el.getAttribute('data-sufixo') || '';
                var t0 = null;
                function passo(t) {
                    if (t0 === null) t0 = t;
                    var p = Math.min((t - t0) / 900, 1);
                    var v = Math.round(fim * (1 - Math.pow(1 - p, 3)));
                    el.textContent = prefixo + v.toLocaleString('pt-BR') + sufixo;
                    if (p < 1) requestAnimationFrame(passo);
                }
                requestAnimationFrame(passo);
            });
        }, { threshold: 0.4 });
        contadores.forEach(function (el) { obsN.observe(el); });
    }

    /* --- 7. Barra fixa de ação no celular, depois que o hero sai da tela --- */
    var barra = document.querySelector('.cta-fixa');
    var hero = document.querySelector('.hero');
    if (barra && hero && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (itens) {
            barra.setAttribute('data-visivel', itens[0].isIntersecting ? 'nao' : 'sim');
        }, { threshold: 0 }).observe(hero);
    }
})();
