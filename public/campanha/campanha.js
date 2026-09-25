/* SoftPay — páginas de campanha. Sem dependência e sem evento de scroll.
   efeitos.js (o da home) já cuida de revelar, contador, FAQ, "ver mais",
   menu e ano do rodapé; aqui fica só o que é destas páginas. */
(function () {
    'use strict';

    var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var temIO = 'IntersectionObserver' in window;

    /* --- 1. O cupom imprime quando entra na tela ---
       Cada linha ganha o seu índice (--i) para sair depois da anterior. */
    var cupons = document.querySelectorAll('[data-cupom]');
    cupons.forEach(function (c) {
        var i = 0;
        c.querySelectorAll('.cupom__linha, .cupom__total, .cupom__rodape, .cupom__barras').forEach(function (l) {
            l.style.setProperty('--i', i++);
        });
    });
    if (calmo || !temIO) {
        cupons.forEach(function (c) { c.classList.add('imprimindo'); });
    } else {
        var obsC = new IntersectionObserver(function (itens) {
            itens.forEach(function (it) {
                if (!it.isIntersecting) return;
                it.target.classList.add('imprimindo');
                obsC.unobserve(it.target);
            });
        }, { threshold: 0.35 });
        cupons.forEach(function (c) { obsC.observe(c); });
    }

    /* --- 2. Tour pelas telas do sistema ---
       Troca sozinho a cada 4,5 s enquanto está à vista; parou de trocar no
       primeiro toque da pessoa, porque aí quem manda é ela. */
    document.querySelectorAll('[data-tour]').forEach(function (tour) {
        var abas = Array.prototype.slice.call(tour.querySelectorAll('.lp-tour__aba'));
        var telas = Array.prototype.slice.call(tour.querySelectorAll('.lp-tour__tela'));
        var atual = 0, timer = null, tocou = false;
        function mostrar(n) {
            atual = (n + abas.length) % abas.length;
            abas.forEach(function (a, k) { a.setAttribute('aria-selected', k === atual ? 'true' : 'false'); });
            telas.forEach(function (t, k) {
                if (k === atual) { t.removeAttribute('data-oculta'); t.loading = 'eager'; }
                else t.setAttribute('data-oculta', '');
            });
        }
        abas.forEach(function (a, k) {
            a.addEventListener('click', function () { tocou = true; parar(); mostrar(k); });
        });
        tour.addEventListener('keydown', function (ev) {
            if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
            tocou = true; parar();
            mostrar(atual + (ev.key === 'ArrowRight' ? 1 : -1));
            abas[atual].focus();
        });
        function andar() { mostrar(atual + 1); }
        function parar() { if (timer) { clearInterval(timer); timer = null; } }
        if (!calmo && temIO) {
            new IntersectionObserver(function (itens) {
                var visivel = itens[0].isIntersecting;
                if (visivel && !tocou && !timer) timer = setInterval(andar, 4500);
                if (!visivel) parar();
            }, { threshold: 0.5 }).observe(tour);
        }
    });

    /* --- 4. Um vídeo de depoimento por vez --- */
    var videos = document.querySelectorAll('.lp-depo video');
    videos.forEach(function (v) {
        v.addEventListener('play', function () {
            videos.forEach(function (o) { if (o !== v && !o.paused) o.pause(); });
        });
    });

    /* --- 4b. A conversa do WhatsApp chega mensagem a mensagem --- */
    var conversas = document.querySelectorAll('[data-conversa]');
    conversas.forEach(function (c) {
        c.querySelectorAll('.lp-msg').forEach(function (m, k) { m.style.setProperty('--i', k); });
    });
    if (calmo || !temIO) {
        conversas.forEach(function (c) { c.classList.add('tocando'); });
    } else {
        var obsZ = new IntersectionObserver(function (itens) {
            itens.forEach(function (it) {
                if (!it.isIntersecting) return;
                it.target.classList.add('tocando');
                obsZ.unobserve(it.target);
            });
        }, { threshold: 0.4 });
        conversas.forEach(function (c) { obsZ.observe(c); });
    }

    /* --- 5. Barra fixa do celular depois que o hero sai da tela ---
       Mesmo comportamento da home (efeitos.js procura .hero, que aqui é
       .lp-hero): some de novo quando a chamada final ou o rodapé aparecem. */
    var barra = document.querySelector('.cta-fixa');
    var hero = document.querySelector('.lp-hero');
    if (barra && hero && temIO) {
        var heroVisivel = true, fimVisivel = {};
        var aplicar = function () {
            var algumFim = Object.keys(fimVisivel).some(function (k) { return fimVisivel[k]; });
            barra.setAttribute('data-visivel', (heroVisivel || algumFim) ? 'nao' : 'sim');
        };
        new IntersectionObserver(function (itens) { heroVisivel = itens[0].isIntersecting; aplicar(); }, { threshold: 0 }).observe(hero);
        var io = new IntersectionObserver(function (itens) {
            itens.forEach(function (it) { fimVisivel[it.target.dataset.fimId] = it.isIntersecting; });
            aplicar();
        }, { threshold: 0 });
        document.querySelectorAll('.lp-final, .lp-duplo, .lp-contato, footer.rodape').forEach(function (el, i) {
            el.dataset.fimId = 'f' + i; io.observe(el);
        });
    }
})();
