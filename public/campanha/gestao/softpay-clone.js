/* O que o JavaScript da referência (Framer) fazia na tela e a captura estática
   perdeu, refeito do zero, sem biblioteca:
     1. cabeçalho que encolhe ao rolar, com o botão "Criar conta";
     2. menus de "Recursos", "Segmentos" e "Saiba mais" (computador e tablet);
     3. menu do celular ("Abrir menu" / "Fechar menu");
     4. carrossel das avaliações (setas, pontos, arrastar);
     5. abas do "Leve sua loja no bolso!" (computador: lista com barra de
        progresso; celular: setas e pontos), trocando texto e tela;
     6. perguntas frequentes (uma aberta por vez);
     7. "Exibir todos os segmentos" no celular;
     8. link aninhado nos selos do rodapé. */
(function () {
    'use strict';
    var AUTH = 'https://www.softpaybr.com/auth';
    var WA = 'https://wa.me/5586998193851?text=' + encodeURIComponent('Olá! Vim pela página do SoftPay e quero saber mais.');
    var menosMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

    /* ------------------------------------------------------------ conteúdo dos menus */
    var RECURSOS = [
        ['Estoque', [['Controle de estoque', '/solucoes/sistema-de-estoque/'], ['Curva ABC', '/solucoes/sistema-de-estoque/'], ['Estoque de filiais', '/solucoes/multiplas-lojas/']]],
        ['Gestão', [['Cadastro de clientes', '/solucoes/controle-de-clientes/'], ['Controle de caixa', '/solucoes/sistema-pdv/'], ['Caderninho de fiado', '/solucoes/controle-de-fiado/'], ['Relatórios', '/solucoes/sistema-financeiro/']]],
        ['Vendas', [['PDV', '/solucoes/sistema-pdv/'], ['Loja online', '/solucoes/loja-online/'], ['Venda pelo WhatsApp', '/solucoes/bot-whatsapp/'], ['Cobrança por Pix', '/solucoes/controle-de-fiado/']]],
        ['Fiscal', [['NFC-e', '/solucoes/nfce/'], ['NF-e', '/solucoes/nfe/']]]
    ];
    var SEGMENTOS = [['Mercadinho', 'mercadinho'], ['Loja de roupas', 'loja-de-roupas'], ['Farmácia', 'farmacia'], ['Distribuidora', 'distribuidora'],
        ['Papelaria', 'papelaria'], ['Loja de variedades', 'loja-de-variedades'], ['Loja de bebidas', 'loja-de-bebidas'], ['Loja de joias', 'loja-de-joias'],
        ['Loja de calçados', 'loja-de-calcados'], ['Materiais de construção', 'materiais-de-construcao'], ['Cosméticos e perfumaria', 'cosmeticos-e-perfumaria'],
        ['Autopeças', 'loja-de-autopecas'], ['Pet shop', 'pet-shop'], ['Celulares e acessórios', 'loja-de-celulares-e-acessorios'],
        ['Empresas com filiais', 'empresas-com-filiais'], ['Pequeno comércio e MEI', 'pequeno-comercio']].map(function (s) { return [s[0], '/segmentos/' + s[1] + '/']; });
    SEGMENTOS.push(['Todos os segmentos', '/segmentos/']);
    var SAIBA = [
        ['Suporte', [['Perguntas frequentes', '/perguntas/'], ['WhatsApp', WA], ['E-mail', 'mailto:suporte@softpaybr.com']]],
        ['Institucional', [['Sobre nós', '/sobre/'], ['Planos', '/#planos'], ['Contato', '/contato/']]],
        ['Conteúdo', [['Blog', '/blog/'], ['Guias', '/guias/'], ['Comparativos', '/comparativos/']]]
    ];
    function linkHtml(l) {
        var ext = /^https:\/\/wa\.me/.test(l[1]);
        return '<a href="' + l[1] + '"' + (ext ? ' target="_blank" rel="noopener" data-track="whatsapp-support"' : '') + '>' + l[0] + '</a>';
    }
    function colunas(grupos) {
        return grupos.map(function (g) {
            return '<div class="sp-col"><p class="sp-col-titulo">' + g[0] + '</p>' + g[1].map(linkHtml).join('') + '</div>';
        }).join('');
    }
    function colunasSegmentos(n) {
        var por = Math.ceil(SEGMENTOS.length / n), html = '';
        for (var i = 0; i < n; i++) html += '<div class="sp-col">' + SEGMENTOS.slice(i * por, (i + 1) * por).map(linkHtml).join('') + '</div>';
        return html;
    }

    /* ------------------------------------------ 1 e 2. cabeçalho do computador/tablet */
    var topo = document.querySelector('.framer-lxjkbx-container');
    if (topo) {
        var barra = topo.querySelector('.framer-gxirno');
        var itens = topo.querySelector('.framer-1holv8i');
        var criar = el('a', 'sp-criar-conta', 'Criar conta');
        criar.href = AUTH; criar.setAttribute('data-track', 'complete-registration');
        if (itens) itens.appendChild(criar);
        var compacto = false;
        var aoRolar = function () {
            var c = window.scrollY > 60;
            if (c !== compacto) { compacto = c; topo.classList.toggle('sp-compacto', c); }
        };
        window.addEventListener('scroll', aoRolar, { passive: true });
        aoRolar();

        var painel = el('div', 'sp-painel');
        painel.setAttribute('hidden', '');
        barra.appendChild(painel);
        var gatilhos = [
            ['.framer-euwz04', function () { return '<div class="sp-painel-grade">' + colunas(RECURSOS) + '</div>'; }],
            ['.framer-z4usgl', function () { return '<div class="sp-painel-grade">' + colunasSegmentos(3) + '</div>'; }],
            ['.framer-i2xvej', function () {
                return '<div class="sp-painel-grade sp-painel-saiba"><div class="sp-col sp-col-larga"><p class="sp-col-titulo">Já sou cliente</p>' +
                    '<div class="sp-pilulas"><a class="sp-pilula" href="' + AUTH + '">Entrar no sistema</a>' +
                    '<a class="sp-pilula" href="' + AUTH + '" data-track="complete-registration">Teste 7 dias grátis</a>' +
                    '<a class="sp-pilula" href="' + WA + '" target="_blank" rel="noopener" data-track="whatsapp-support">Falar no WhatsApp</a></div>' +
                    '<p class="sp-col-titulo">Segmentos</p><div class="sp-painel-grade sp-sub">' + colunasSegmentos(3) + '</div></div>' +
                    colunas(SAIBA) + '</div>';
            }]
        ];
        var aberto = null, fecharTimer = null;
        var abrir = function (g, alvo) {
            clearTimeout(fecharTimer);
            if (aberto === alvo) return;
            if (aberto) aberto.classList.remove('sp-nav-ativo');
            aberto = alvo; alvo.classList.add('sp-nav-ativo');
            painel.innerHTML = g[1]();
            painel.removeAttribute('hidden');
            alvo.setAttribute('aria-expanded', 'true');
        };
        var fechar = function () {
            if (!aberto) return;
            aberto.classList.remove('sp-nav-ativo'); aberto.setAttribute('aria-expanded', 'false');
            aberto = null; painel.setAttribute('hidden', '');
        };
        var fecharDepois = function () { clearTimeout(fecharTimer); fecharTimer = setTimeout(fechar, 180); };
        gatilhos.forEach(function (g) {
            var alvo = topo.querySelector(g[0]);
            if (!alvo) return;
            alvo.setAttribute('role', 'button'); alvo.setAttribute('tabindex', '0'); alvo.setAttribute('aria-expanded', 'false');
            alvo.addEventListener('mouseenter', function () { abrir(g, alvo); });
            alvo.addEventListener('mouseleave', fecharDepois);
            alvo.addEventListener('click', function () { if (aberto === alvo) fechar(); else abrir(g, alvo); });
            alvo.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (aberto === alvo) fechar(); else abrir(g, alvo); } });
        });
        painel.addEventListener('mouseenter', function () { clearTimeout(fecharTimer); });
        painel.addEventListener('mouseleave', fecharDepois);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
        document.addEventListener('click', function (e) { if (aberto && !topo.contains(e.target)) fechar(); });
    }

    /* --------------------------------------------------------- 3. menu do celular */
    var topoCel = document.querySelector('.framer-7pbzve-container');
    if (topoCel) {
        var botao = $$('p', topoCel).filter(function (p) { return /Abrir menu/.test(p.textContent); })[0];
        if (botao) {
            var menu = el('nav', 'sp-menu-cel');
            menu.setAttribute('aria-label', 'Menu');
            menu.setAttribute('hidden', '');
            menu.innerHTML =
                '<p class="sp-menu-titulo">Recursos</p>' + RECURSOS.map(function (g) { return g[1].map(linkHtml).join(''); }).join('') +
                '<p class="sp-menu-titulo">Segmentos</p>' + SEGMENTOS.map(linkHtml).join('') +
                '<p class="sp-menu-titulo">Saiba mais</p>' + [['Planos', '/#planos'], ['Perguntas frequentes', '/perguntas/'], ['Blog', '/blog/'], ['Sobre nós', '/sobre/'], ['Falar no WhatsApp', WA], ['Entrar', AUTH]].map(linkHtml).join('');
            document.body.appendChild(menu);
            var alvoBotao = botao.parentElement;
            alvoBotao.setAttribute('role', 'button'); alvoBotao.setAttribute('tabindex', '0'); alvoBotao.setAttribute('aria-expanded', 'false');
            alvoBotao.style.cursor = 'pointer';
            var alterna = function () {
                var abre = menu.hasAttribute('hidden');
                if (abre) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
                botao.textContent = abre ? 'Fechar menu' : 'Abrir menu';
                alvoBotao.setAttribute('aria-expanded', String(abre));
                document.documentElement.classList.toggle('sp-menu-aberto', abre);
            };
            alvoBotao.addEventListener('click', alterna);
            alvoBotao.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alterna(); } });
            menu.addEventListener('click', function (e) { if (e.target.closest('a') && !menu.hasAttribute('hidden')) alterna(); });
        }
    }

    /* ------------------------------------------------- 4. carrossel das avaliações */
    $$('section[aria-roledescription="carousel"]').forEach(function (sec) {
        var ul = sec.querySelector('ul.framer--carousel');
        var lis = $$(':scope > li', ul);
        var ant = sec.querySelector('button[aria-label="Previous"]');
        var prox = sec.querySelector('button[aria-label="Next"]');
        var pontos = el('div', 'sp-pontos');
        pontos.setAttribute('role', 'group'); pontos.setAttribute('aria-label', 'Escolher avaliação');
        lis.forEach(function (li, i) {
            var b = el('button', 'sp-ponto');
            b.type = 'button'; b.setAttribute('aria-label', 'Avaliação ' + (i + 1) + ' de ' + lis.length);
            b.addEventListener('click', function () { vai(i); });
            pontos.appendChild(b);
        });
        sec.appendChild(pontos);
        var passo = function () { return lis.length > 1 ? lis[1].offsetLeft - lis[0].offsetLeft : ul.clientWidth; };
        var vai = function (i) { ul.scrollTo({ left: Math.max(0, i) * passo(), behavior: menosMovimento ? 'auto' : 'smooth' }); };
        var atual = function () { return Math.round(ul.scrollLeft / Math.max(1, passo())); };
        var mostra = function (b, sim) { if (!b) return; b.style.opacity = sim ? '1' : '0'; b.style.pointerEvents = sim ? 'auto' : 'none'; b.style.cursor = sim ? 'pointer' : 'default'; };
        var atualiza = function () {
            var max = ul.scrollWidth - ul.clientWidth;
            mostra(ant, ul.scrollLeft > 4);
            mostra(prox, ul.scrollLeft < max - 4);
            var at = ul.scrollLeft >= max - 4 ? lis.length - 1 : atual();
            $$('.sp-ponto', pontos).forEach(function (p, i) { p.classList.toggle('sp-ativo', i === at); });
            pontos.style.display = max > 4 ? '' : 'none';
        };
        if (ant) ant.addEventListener('click', function () { vai(atual() - 1); });
        if (prox) prox.addEventListener('click', function () { vai(atual() + 1); });
        ul.addEventListener('scroll', atualiza, { passive: true });
        window.addEventListener('resize', atualiza);
        // arrastar com o mouse (no toque, a rolagem nativa já arrasta)
        var arrasto = null;
        ul.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; arrasto = { x: e.clientX, s: ul.scrollLeft, mov: false }; ul.style.scrollSnapType = 'none'; });
        window.addEventListener('pointermove', function (e) { if (!arrasto) return; var dx = e.clientX - arrasto.x; if (Math.abs(dx) > 4) arrasto.mov = true; ul.scrollLeft = arrasto.s - dx; });
        window.addEventListener('pointerup', function () { if (!arrasto) return; var mov = arrasto.mov; arrasto = null; ul.style.scrollSnapType = 'x mandatory'; if (mov) vai(atual()); });
        atualiza();
    });

    /* ------------------------------------------- 5. abas do "Leve sua loja no bolso" */
    var ABAS = [];
    try { ABAS = JSON.parse(document.body.getAttribute('data-sp-abas') || '[]'); } catch (e) { ABAS = []; }
    var TEMPO = 5000;
    // computador e tablet: lista à esquerda, celular à direita
    $$('.framer-Ek2Cf').forEach(function (comp) {
        var itens = ['.framer-1um6hay', '.framer-suex8h', '.framer-d97nj1', '.framer-1qccymy'].map(function (s) { return comp.querySelector(s); });
        if (itens.some(function (x) { return !x; }) || ABAS.length !== 4) return;
        var modeloDesc = comp.querySelector('.framer-jdimrd');
        var img = comp.querySelector('.framer-10tmwri img');
        itens.forEach(function (item, i) {
            item.classList.add('sp-aba');
            var col = item.firstElementChild;
            col.classList.add('sp-aba-col');
            if (!col.querySelector('.framer-jdimrd')) {
                var d = modeloDesc.cloneNode(true);
                d.querySelector('p').textContent = ABAS[i].d;
                col.appendChild(d);
            }
            var linha = item.lastElementChild;
            linha.classList.add('sp-aba-linha');
            linha.innerHTML = '<i class="sp-aba-progresso"></i>';
            item.setAttribute('role', 'tab'); item.setAttribute('tabindex', '0');
            item.addEventListener('click', function () { ativa(i, true); });
            item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ativa(i, true); } });
        });
        comp.querySelector('.framer-ynswgh').setAttribute('role', 'tablist');
        var idx = 0, timer = null;
        var ativa = function (i) {
            idx = i;
            itens.forEach(function (item, k) {
                item.classList.toggle('sp-ativa', k === i);
                item.setAttribute('aria-selected', String(k === i));
                var barra = item.querySelector('.sp-aba-progresso');
                barra.style.transition = 'none'; barra.style.height = '0%';
            });
            if (img) { img.src = ABAS[i].img; img.alt = ABAS[i].t; }
            var b = itens[i].querySelector('.sp-aba-progresso');
            void b.offsetHeight;
            b.style.transition = menosMovimento ? 'none' : 'height ' + TEMPO + 'ms linear';
            b.style.height = '100%';
            clearTimeout(timer);
            if (!menosMovimento) timer = setTimeout(function () { ativa((idx + 1) % itens.length); }, TEMPO);
        };
        ativa(0);
    });
    // celular: título, texto e tela trocam pelas setas e pelos pontos
    $$('.framer-s6ucG').forEach(function (comp) {
        var tit = comp.querySelector('.framer-5w9e5a h4, .framer-5w9e5a p');
        var desc = comp.querySelector('.framer-172ugb1 p');
        var img = comp.querySelector('.framer-1qznnun img');
        var pontos = comp.querySelector('.framer-17r60ws') ? $$(':scope > div', comp.querySelector('.framer-17r60ws')) : [];
        var esq = comp.querySelector('.framer-4ue4ve'), dir = comp.querySelector('.framer-13is5t9');
        if (!tit || !desc || ABAS.length !== 4) return;
        var idx = 0, timer = null;
        var ativa = function (i) {
            idx = (i + ABAS.length) % ABAS.length;
            tit.textContent = ABAS[idx].t; desc.textContent = ABAS[idx].d;
            if (img) { img.src = ABAS[idx].img; img.alt = ABAS[idx].t; }
            pontos.forEach(function (p, k) { p.style.backgroundColor = k === idx ? '#1DA1F2' : '#DCE5EC'; });
            clearTimeout(timer);
            if (!menosMovimento) timer = setTimeout(function () { ativa(idx + 1); }, TEMPO);
        };
        [[esq, -1, 'Anterior'], [dir, 1, 'Próxima']].forEach(function (a) {
            if (!a[0]) return;
            a[0].setAttribute('role', 'button'); a[0].setAttribute('aria-label', a[2]); a[0].style.cursor = 'pointer';
            a[0].addEventListener('click', function () { ativa(idx + a[1]); });
            a[0].addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ativa(idx + a[1]); } });
        });
        pontos.forEach(function (p, k) { p.style.cursor = 'pointer'; p.addEventListener('click', function () { ativa(k); }); });
        ativa(0);
    });

    /* -------------------------------------------------- 6. perguntas frequentes */
    $$('.sp-faq').forEach(function (item) {
        var alterna = function () {
            var abre = !item.classList.contains('sp-aberto');
            $$('.sp-faq', item.parentElement.parentElement).forEach(function (o) {
                if (o !== item) { o.classList.remove('sp-aberto'); o.setAttribute('aria-expanded', 'false'); }
            });
            item.classList.toggle('sp-aberto', abre);
            item.setAttribute('aria-expanded', String(abre));
        };
        item.addEventListener('click', function (e) { if (e.target.closest('a')) return; alterna(); });
        item.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) { e.preventDefault(); alterna(); } });
    });

    /* ------------------------------------------ 7. "Exibir todos os segmentos" */
    $$('.framer-13rb6er').forEach(function (b) {
        var alvo = b.closest('.framer-1fg9rrb') || b;
        var lista = document.querySelector('.framer-1hakzmu');
        var p = b.querySelector('p');
        alvo.setAttribute('role', 'button'); alvo.setAttribute('tabindex', '0'); alvo.style.cursor = 'pointer';
        var alterna = function () {
            var abre = !lista.classList.contains('sp-segs-abertos');
            lista.classList.toggle('sp-segs-abertos', abre);
            if (p) p.textContent = abre ? 'Exibir menos segmentos' : 'Exibir todos os segmentos';
            alvo.setAttribute('aria-expanded', String(abre));
        };
        alvo.addEventListener('click', alterna);
        alvo.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alterna(); } });
    });

    /* ---------------------------------------------- 8. link aninhado (span[href]) */
    $$('span[href]').forEach(function (s) {
        s.style.cursor = 'pointer';
        s.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); window.location.href = s.getAttribute('href'); });
    });
})();
