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
     8. link aninhado nos selos do rodapé.
   Acabamento (25/09/2026):
     9. revelar ao entrar na tela, com escalonamento entre irmãos;
    10. contadores dos números (+100, 8, 7 dias);
    11. chaves do catálogo que ligam ao entrar na tela;
    12. colagem dos relatórios peça por peça;
    13. ícones dos segmentos que mudam de cor no hover;
    14. seta que anda nos links de contato. */
(function () {
    'use strict';
    window.__spAcabamento = true;
    var AUTH = 'https://www.softpaybr.com/auth';
    var WA = 'https://wa.me/5586998193851?text=' + encodeURIComponent('Olá! Vim pela página do SoftPay e quero saber mais.');
    var mm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    var menosMovimento = !!(mm && mm.matches);
    function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
    function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function visivel(e) { return !!(e && e.getClientRects().length); }
    /* FLIP: mede antes, muda o layout, e anima a diferença só com transform */
    function flip(elementos, mudar, dur) {
        if (menosMovimento) { mudar(); return; }
        var antes = elementos.map(function (e) { return e.getBoundingClientRect(); });
        mudar();
        elementos.forEach(function (e, i) {
            var d = e.getBoundingClientRect();
            var dx = antes[i].left - d.left, dy = antes[i].top - d.top;
            if (Math.abs(dx) < .5 && Math.abs(dy) < .5) return;
            e.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
                { duration: dur || 420, easing: 'cubic-bezier(.22,1,.36,1)' });
        });
    }

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
    var topoCel = document.querySelector('.framer-7pbzve-container');
    if (topo) {
        var barra = topo.querySelector('.framer-gxirno');
        var itens = topo.querySelector('.framer-1holv8i');
        var criar = el('a', 'sp-criar-conta', 'Criar conta');
        criar.href = AUTH; criar.setAttribute('data-track', 'complete-registration');
        if (itens) itens.appendChild(criar);
        var compacto = false, rolou = false;
        var aoRolar = function () {
            var y = window.scrollY;
            var r = y > 8;
            if (r !== rolou) { rolou = r; topo.classList.toggle('sp-rolou', r); if (topoCel) topoCel.classList.toggle('sp-rolou', r); }
            var c = y > 60;
            if (c !== compacto) {
                compacto = c;
                // o botão "Criar conta" entra e os links do menu andam para a esquerda por FLIP
                var links = itens ? Array.prototype.slice.call(itens.children).filter(function (x) { return x !== criar && visivel(x); }) : [];
                flip(links, function () { topo.classList.toggle('sp-compacto', c); }, 420);
            }
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
    if (topoCel) {
        if (!topo) window.addEventListener('scroll', function () { topoCel.classList.toggle('sp-rolou', window.scrollY > 8); }, { passive: true });
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
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hasAttribute('hidden')) alterna(); });
        }
    }

    /* ------------------------------------------------- 4. carrossel das avaliações */
    $$('section[aria-roledescription="carousel"]').forEach(function (sec) {
        var ul = sec.querySelector('ul.framer--carousel');
        var lis = $$(':scope > li', ul);
        var ant = sec.querySelector('button[aria-label="Previous"]');
        var prox = sec.querySelector('button[aria-label="Next"]');
        if (ant) ant.setAttribute('aria-label', 'Avaliação anterior');
        if (prox) prox.setAttribute('aria-label', 'Próxima avaliação');
        // as bolinhas ficam abaixo dos cartões: o section corta o que sai dele, então vão para o pai
        var caixa = sec.parentElement;
        caixa.classList.add('sp-pontos-caixa');
        var pontos = el('div', 'sp-pontos');
        pontos.setAttribute('role', 'group'); pontos.setAttribute('aria-label', 'Escolher avaliação');
        caixa.appendChild(pontos);
        var passo = function () { return lis.length > 1 ? lis[1].offsetLeft - lis[0].offsetLeft : ul.clientWidth; };
        var maximo = function () { return ul.scrollWidth - ul.clientWidth; };
        // uma bolinha por parada de verdade: no computador cabem 3 cartões e meio, então são 2 paradas, não 4
        var paradas = function () { var m = maximo(); return m > 4 ? Math.min(lis.length, Math.ceil(m / Math.max(1, passo()) - 0.05) + 1) : 0; };
        var nPontos = -1;
        var montaPontos = function () {
            var n = paradas(); if (n === nPontos) return; nPontos = n;
            pontos.innerHTML = '';
            for (var i = 0; i < n; i++) (function (i) {
                var b = el('button', 'sp-ponto');
                b.type = 'button'; b.setAttribute('aria-label', 'Avaliações, parte ' + (i + 1) + ' de ' + n);
                b.addEventListener('click', function () { vai(i); });
                pontos.appendChild(b);
            })(i);
        };
        var vai = function (i) { ul.scrollTo({ left: Math.min(maximo(), Math.max(0, i) * passo()), behavior: menosMovimento ? 'auto' : 'smooth' }); };
        var atual = function () { return Math.round(ul.scrollLeft / Math.max(1, passo())); };
        var mostra = function (b, sim) { if (!b) return; b.style.opacity = sim ? '1' : '0'; b.style.pointerEvents = sim ? 'auto' : 'none'; b.style.cursor = sim ? 'pointer' : 'default'; b.tabIndex = sim ? 0 : -1; b.setAttribute('aria-hidden', String(!sim)); };
        var atualiza = function () {
            montaPontos();
            var max = maximo();
            mostra(ant, ul.scrollLeft > 4);
            mostra(prox, ul.scrollLeft < max - 4);
            var at = ul.scrollLeft >= max - 4 ? nPontos - 1 : Math.min(nPontos - 1, atual());
            $$('.sp-ponto', pontos).forEach(function (p, i) { p.classList.toggle('sp-ativo', i === at); if (i === at) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current'); });
            pontos.style.display = max > 4 ? '' : 'none';
        };
        if (ant) ant.addEventListener('click', function () { vai(atual() - 1); });
        if (prox) prox.addEventListener('click', function () { vai(Math.min(nPontos - 1, atual() + 1)); });
        ul.addEventListener('scroll', atualiza, { passive: true });
        window.addEventListener('resize', atualiza);
        ul.setAttribute('tabindex', '0');
        ul.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { e.preventDefault(); vai(atual() + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); vai(atual() - 1); }
        });
        // arrastar com o mouse (no toque, a rolagem nativa já arrasta)
        var arrasto = null;
        ul.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; arrasto = { x: e.clientX, s: ul.scrollLeft, mov: false }; });
        window.addEventListener('pointermove', function (e) {
            if (!arrasto) return; var dx = e.clientX - arrasto.x;
            if (!arrasto.mov && Math.abs(dx) > 4) { arrasto.mov = true; ul.classList.add('sp-arrastando'); }
            if (arrasto.mov) ul.scrollLeft = arrasto.s - dx;
        });
        window.addEventListener('pointerup', function () {
            if (!arrasto) return; var mov = arrasto.mov; arrasto = null;
            ul.classList.remove('sp-arrastando');
            if (mov) vai(atual());
        });
        atualiza();
    });

    /* ------------------------------------------- 5. abas do "Leve sua loja no bolso" */
    var ABAS = [];
    try { ABAS = JSON.parse(document.body.getAttribute('data-sp-abas') || '[]'); } catch (e) { ABAS = []; }
    var TEMPO = 5000;
    function quandoVisivel(alvo, cb) {
        if (!('IntersectionObserver' in window)) { cb(true); return; }
        new IntersectionObserver(function (es) { es.forEach(function (en) { cb(en.isIntersecting); }); }, { threshold: 0.25 }).observe(alvo);
    }
    // uma pilha de telas no lugar da imagem única: troca por opacity, sem piscar
    function pilhaDeTelas(img) {
        if (!img) return null;
        var pai = img.parentElement;
        var pilha = el('div', 'sp-telas');
        var feitas = {};
        var imgs = ABAS.map(function (a) {
            if (feitas[a.img]) return feitas[a.img];
            var i = el('img'); i.src = a.img; i.alt = ''; i.decoding = 'async'; i.setAttribute('aria-hidden', 'true');
            pilha.appendChild(i); feitas[a.img] = i; return i;
        });
        pai.appendChild(pilha);
        img.classList.add('sp-telas-origem');
        return function (k) {
            imgs.forEach(function (i) { i.classList.toggle('sp-tela-ativa', i === imgs[k]); });
            img.alt = ABAS[k].t;
        };
    }
    // computador e tablet: lista à esquerda, celular à direita
    $$('.framer-Ek2Cf').forEach(function (comp) {
        var itens = ['.framer-1um6hay', '.framer-suex8h', '.framer-d97nj1', '.framer-1qccymy'].map(function (s) { return comp.querySelector(s); });
        if (itens.some(function (x) { return !x; }) || ABAS.length !== 4) return;
        var modeloDesc = comp.querySelector('.framer-jdimrd');
        var img = comp.querySelector('.framer-10tmwri img');
        var mostraTela = pilhaDeTelas(img);
        itens.forEach(function (item, i) {
            item.classList.add('sp-aba');
            var col = item.firstElementChild;
            col.classList.add('sp-aba-col');
            // quem recebe o foco é a aba inteira; a coluna de dentro não é mais uma parada do Tab
            col.removeAttribute('tabindex'); $$('[tabindex]', col).forEach(function (x) { x.removeAttribute('tabindex'); });
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
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ativa(i, true); }
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); var k = (i + (e.key === 'ArrowDown' ? 1 : 3)) % 4; itens[k].focus(); ativa(k, true); }
            });
        });
        comp.querySelector('.framer-ynswgh').setAttribute('role', 'tablist');
        var idx = 0, timer = null, naTela = false, pausado = false, inicio = 0, restante = TEMPO, rodando = false;
        var titulos = itens.map(function (it) { return it.querySelector('.sp-aba-col > div:first-child'); });
        var barraDe = function (k) { return itens[k].querySelector('.sp-aba-progresso'); };
        var corre = function () {
            clearTimeout(timer);
            var b = barraDe(idx);
            if (menosMovimento || !naTela || pausado) {
                // parada: a barra congela onde está e guarda o tempo que falta
                // guarda a fração como scaleY(f): uma matrix com escala 0 não interpola, e a barra pularia para o fim
                var m = getComputedStyle(b).transform, f = 0;
                if (m && m !== 'none') { var v = m.match(/-?[\d.]+(e-?\d+)?/g); if (v && v.length >= 4) f = Math.max(0, Math.min(1, parseFloat(v[3]))); }
                b.style.transition = 'none'; b.style.transform = 'scaleY(' + f.toFixed(4) + ')';
                if (rodando) restante = Math.max(400, restante - (performance.now() - inicio));
                rodando = false;
                return;
            }
            void b.offsetHeight;
            b.style.transition = 'transform ' + restante + 'ms linear';
            b.style.transform = 'scaleY(1)';
            inicio = performance.now(); rodando = true;
            timer = setTimeout(function () { ativa((idx + 1) % itens.length); }, restante);
        };
        var ativa = function (i, animar) {
            var mudou = i !== idx || !itens[i].classList.contains('sp-ativa');
            idx = i;
            var aplica = function () {
                itens.forEach(function (item, k) {
                    item.classList.toggle('sp-ativa', k === i);
                    item.setAttribute('aria-selected', String(k === i));
                    var b = barraDe(k); b.style.transition = 'none'; b.style.transform = 'scaleY(0)';
                });
            };
            if (animar === false) aplica(); else flip(titulos, aplica, 480);
            if (animar !== false && mudou && !menosMovimento) {
                var d = itens[i].querySelector('.framer-jdimrd');
                if (d) d.animate([{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
            }
            if (mudou && mostraTela) mostraTela(i);
            restante = TEMPO; inicio = performance.now(); rodando = false;
            if (menosMovimento) { barraDe(i).style.transform = 'scaleY(1)'; return; }
            corre();
        };
        comp.addEventListener('mouseenter', function () { pausado = true; corre(); });
        comp.addEventListener('mouseleave', function () { pausado = false; corre(); });
        comp.addEventListener('focusin', function () { pausado = true; corre(); });
        comp.addEventListener('focusout', function () { pausado = false; corre(); });
        ativa(0, false);
        quandoVisivel(comp, function (v) { naTela = v; corre(); });
    });
    // celular: título, texto e tela trocam pelas setas e pelos pontos
    $$('.framer-s6ucG').forEach(function (comp) {
        var tit = comp.querySelector('.framer-5w9e5a h4, .framer-5w9e5a p');
        var desc = comp.querySelector('.framer-172ugb1 p');
        var img = comp.querySelector('.framer-1qznnun img');
        var pontos = comp.querySelector('.framer-17r60ws') ? $$(':scope > div', comp.querySelector('.framer-17r60ws')) : [];
        var esq = comp.querySelector('.framer-4ue4ve'), dir = comp.querySelector('.framer-13is5t9');
        if (!tit || !desc || ABAS.length !== 4) return;
        var mostraTela = pilhaDeTelas(img);
        var textos = [tit.parentElement, desc.parentElement];
        textos.forEach(function (t) { t.classList.add('sp-troca'); });
        var idx = 0, timer = null, naTela = false, troca = null;
        var agenda = function () { clearTimeout(timer); if (!menosMovimento && naTela) timer = setTimeout(function () { ativa(idx + 1); }, TEMPO); };
        var pinta = function () {
            tit.textContent = ABAS[idx].t; desc.textContent = ABAS[idx].d;
            pontos.forEach(function (p, k) { p.style.backgroundColor = k === idx ? '#1DA1F2' : '#DCE5EC'; p.setAttribute('aria-current', String(k === idx)); });
        };
        var ativa = function (i) {
            idx = (i + ABAS.length) % ABAS.length;
            if (mostraTela) mostraTela(idx);
            clearTimeout(troca);
            if (menosMovimento) { pinta(); agenda(); return; }
            textos.forEach(function (t) { t.classList.add('sp-saindo'); });
            troca = setTimeout(function () { pinta(); textos.forEach(function (t) { t.classList.remove('sp-saindo'); }); }, 180);
            agenda();
        };
        [[esq, -1, 'Tela anterior'], [dir, 1, 'Próxima tela']].forEach(function (a) {
            if (!a[0]) return;
            a[0].setAttribute('role', 'button'); a[0].setAttribute('tabindex', '0'); a[0].setAttribute('aria-label', a[2]); a[0].style.cursor = 'pointer';
            a[0].addEventListener('click', function () { ativa(idx + a[1]); });
            a[0].addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ativa(idx + a[1]); } });
        });
        pontos.forEach(function (p, k) {
            p.setAttribute('role', 'button'); p.setAttribute('tabindex', '0'); p.setAttribute('aria-label', 'Mostrar tela ' + (k + 1) + ' de ' + pontos.length);
            p.addEventListener('click', function () { ativa(k); });
            p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ativa(k); } });
        });
        // arrastar a tela para o lado troca também
        var x0 = null;
        comp.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
        comp.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 45) ativa(idx + (dx < 0 ? 1 : -1)); }, { passive: true });
        // o título e o texto mudam de tamanho de uma tela para outra (1 ou 2 linhas): reserva o maior,
        // para a página não pular 30 px a cada troca automática
        var reserva = function () {
            [[tit, 't'], [desc, 'd']].forEach(function (par) {
                var caixa = par[0].parentElement, orig = par[0].textContent, maior = 0;
                caixa.style.minHeight = '';
                ABAS.forEach(function (a) { par[0].textContent = a[par[1]]; maior = Math.max(maior, caixa.getBoundingClientRect().height); });
                par[0].textContent = orig;
                if (maior) caixa.style.minHeight = Math.ceil(maior) + 'px';
            });
        };
        pinta(); if (mostraTela) mostraTela(0);
        if (visivel(comp)) reserva();
        var larguraAntes = window.innerWidth;
        window.addEventListener('resize', function () { if (window.innerWidth !== larguraAntes) { larguraAntes = window.innerWidth; if (visivel(comp)) reserva(); } });
        quandoVisivel(comp, function (v) { naTela = v; if (v) agenda(); else clearTimeout(timer); });
    });

    /* -------------------------------------------------- 6. perguntas frequentes */
    $$('.sp-faq').forEach(function (item) {
        var resp = item.querySelector('.framer-1w06yyo');
        if (resp && !resp.querySelector('.sp-faq-dentro')) {
            var dentro = el('div', 'sp-faq-dentro');
            while (resp.firstChild) dentro.appendChild(resp.firstChild);
            resp.appendChild(dentro);
            item.classList.add('sp-faq-pronto');
            var pergunta = item.querySelector('h3');
            if (pergunta) { pergunta.id = pergunta.id || 'sp-faq-q-' + Math.random().toString(36).slice(2, 8); resp.setAttribute('role', 'region'); resp.setAttribute('aria-labelledby', pergunta.id); }
        }
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
            if (abre) $$('.sp-seg-extra', lista).forEach(function (x, i) { x.style.animationDelay = (i * 40) + 'ms'; });
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

    /* ------------------------------------ 9. revelar ao entrar na tela (escalonado) */
    var GRUPOS = [
        // depoimentos
        '.framer-uus3pg', 'section[aria-roledescription="carousel"] ul > li', '.framer-onq2qr',
        // estoque
        '.framer-1928pee', '.framer-jjffqa', '.framer-10st4v8', '.framer-lspc9i', '.framer-qj5aod', '.framer-sog9bi',
        '.framer-m2lzhs', '.framer-1em7iyx', '.framer-y1fwrb', '.framer-9oayc', '.framer-154w9nf',
        // relatórios
        '.framer-jg6wfp', '.framer-1ndpwtu', '.framer-sbtzlh', '.framer-i35te5',
        // aparelhos
        '.framer-1qwbgvv', '.framer-1i2xv69', '.framer-h9t4v9 > *', '.framer-1g8eh8a', '.framer-1dllzle', '.framer-ccholi',
        // caixa
        '.framer-hujhjs', '.framer-12zpz1z', '.framer-8698a2', '.framer-1uaj8g', '.framer-1ixbrvb',
        // loja online
        '.framer-3fz4l4', '.framer-11i5m8j', '.framer-1ttmn6q', '.framer-lm3hf6', '.framer-19n5gqy', '.framer-2p4pfi', '.framer-yyxrjg', '.framer-e4o2ik',
        // leve sua loja no bolso
        '.framer-mlz9mg', '.framer-1mapnee', '.framer-1cbzmci', '.framer-vu6kys-container', '.framer-8m6236', '.framer-17x45wv',
        // segmentos
        '.framer-qc4rtg', '.framer-1iedx35', '.framer-ja403i', '.framer-f3bb2l > a', '.framer-1hakzmu > a:not(.sp-seg-extra)',
        // perguntas
        '.framer-1oi9fjo', '.framer-1seoyt > *', '.framer-1qoawwe',
        // números e contato
        '.framer-vngv4v', '.framer-17qukd4', '.framer-1lsnjt', '.framer-12x7fmb', '.framer-1x9ji8x > a'
    ];
    var alvosRv = [];
    GRUPOS.forEach(function (s) { $$(s).forEach(function (e) { if (alvosRv.indexOf(e) < 0 && !e.closest('header.framer-15w5m0')) alvosRv.push(e); }); });
    var revelados = [];
    function revela(lista) {
        lista.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
        lista.forEach(function (e, i) {
            e.style.setProperty('--sp-d', Math.min(i, 6) * 70 + 'ms');
            e.classList.add('sp-in');
            var limpa = function () { e.classList.remove('sp-rv', 'sp-in'); e.style.removeProperty('--sp-d'); };
            setTimeout(limpa, 1100 + Math.min(i, 6) * 70);
            revelados.push(e);
        });
    }
    if ('IntersectionObserver' in window && alvosRv.length) {
        var io = new IntersectionObserver(function (es) {
            var lote = [];
            es.forEach(function (en) { if (en.isIntersecting) { lote.push(en.target); io.unobserve(en.target); } });
            if (lote.length) revela(lote);
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
        alvosRv.forEach(function (e) {
            var r = e.getBoundingClientRect();
            if (r.bottom < 0) return;            // já passou (recarregou no meio da página): fica como está
            e.classList.add('sp-rv');            // os de outra largura (display:none) entram quando aparecerem
            io.observe(e);
        });
    }

    /* ---------------------------------------------------------- 10. contadores */
    [['.framer-13nqdw3 p', 100, '+', ''], ['.framer-1mlxkep p', 8, '', ''], ['.framer-v2e4eo p', 7, '', ' dias']].forEach(function (c) {
        $$(c[0]).forEach(function (p) {
            var final = p.textContent;
            if (menosMovimento || !('IntersectionObserver' in window)) return;
            var o = new IntersectionObserver(function (es) {
                if (!es[0].isIntersecting) return; o.disconnect();
                var t0 = performance.now(), dur = c[1] > 10 ? 1400 : 900;
                p.setAttribute('aria-label', final);
                var passo = function (t) {
                    var k = Math.min(1, (t - t0) / dur);
                    var e = 1 - Math.pow(1 - k, 4);
                    p.textContent = c[2] + Math.round(c[1] * e) + c[3];
                    if (k < 1) requestAnimationFrame(passo); else { p.textContent = final; p.removeAttribute('aria-label'); }
                };
                p.textContent = c[2] + '0' + c[3];
                requestAnimationFrame(passo);
            }, { threshold: 0.6 });
            o.observe(p);
        });
    });

    /* ------------------------------------ 11. chaves do catálogo (liga ao entrar) */
    if (!menosMovimento && 'IntersectionObserver' in window) {
        $$('.framer-19n5gqy img').forEach(function (img) {
            // posições das chaves na imagem de 630 x 766 (a mesma arte, desenhada em 2x)
            var W = 630, H = 766, ch = [[60, true], [176, true], [292, true], [408, false]];
            var camada = el('div', 'sp-chaves');
            camada.setAttribute('aria-hidden', 'true');
            var chaves = ch.map(function (c) {
                var k = el('span', 'sp-chave', '<i></i>');
                k.style.left = (530 / W * 100) + '%'; k.style.top = (c[0] / H * 100) + '%';
                k.style.width = (60 / W * 100) + '%'; k.style.height = (36 / H * 100) + '%';
                camada.appendChild(k); return [k, c[1]];
            });
            img.parentElement.appendChild(camada);
            var o = new IntersectionObserver(function (es) {
                if (!es[0].isIntersecting) return; o.disconnect();
                chaves.forEach(function (k, i) { if (k[1]) setTimeout(function () { k[0].classList.add('sp-ligada'); }, 450 + i * 260); });
            }, { threshold: 0.5 });
            o.observe(img);
        });
    }

    /* -------------------------------------- 12. colagem dos relatórios, peça a peça */
    var alvosPeca = [];
    $$('.framer-1thkg2n img').forEach(function (img) {
        // quatro peças da imagem de 1124 x 932 (achadas pelo canal alfa): [cima, direita, baixo, esquerda] em %
        var W = 1124, H = 932, R = '2.85% / 3.43%';
        var pecas = [[0, 684, 442, 0, false], [0, W, 442, 736, true], [490, 388, H, 0, true], [490, W, H, 436, false]];
        var camada = el('div', 'sp-colagem');
        pecas.forEach(function (p, i) {
            var d = el('div', 'sp-peca-c' + (p[4] ? ' sp-foto' : ''));
            var ins = [(p[0] / H * 100), (100 - p[1] / W * 100), (100 - p[2] / H * 100), (p[3] / W * 100)].map(function (v) { return v.toFixed(2) + '%'; });
            d.style.clipPath = 'inset(' + ins.join(' ') + ' round ' + R + ')';
            var cx = ((p[3] + p[1]) / 2 / W * 100).toFixed(1), cy = ((p[0] + p[2]) / 2 / H * 100).toFixed(1);
            d.style.transformOrigin = cx + '% ' + cy + '%';
            var c = el('img'); c.src = img.currentSrc || img.src; c.alt = ''; c.setAttribute('aria-hidden', 'true'); c.decoding = 'async';
            c.style.transformOrigin = cx + '% ' + cy + '%';
            d.appendChild(c); camada.appendChild(d);
            d.classList.add('sp-rv');
            alvosPeca.push(d);
        });
        img.parentElement.appendChild(camada);
        img.classList.add('sp-colagem-origem');
    });
    if (alvosPeca.length && 'IntersectionObserver' in window) {
        var ioP = new IntersectionObserver(function (es) {
            es.forEach(function (en) {
                if (!en.isIntersecting) return; ioP.disconnect();
                var pecasVis = alvosPeca.filter(function (d) { return d.closest('.framer-1thkg2n') === en.target; });
                pecasVis.forEach(function (d, i) { d.style.setProperty('--sp-d', (120 + i * 110) + 'ms'); d.classList.add('sp-in'); setTimeout(function () { d.classList.remove('sp-rv', 'sp-in'); }, 1400 + i * 110); });
            });
        }, { threshold: 0.2 });
        $$('.framer-1thkg2n').forEach(function (b) { ioP.observe(b); });
    } else alvosPeca.forEach(function (d) { d.classList.remove('sp-rv'); });

    /* -------------------------- 13. ícones dos segmentos: traço fixo vira currentColor */
    var usados = {};
    $$('.framer-f3bb2l use, .framer-1hakzmu use').forEach(function (u) { var h = u.getAttribute('href') || u.getAttribute('xlink:href'); if (h) usados[h.slice(1)] = true; });
    Object.keys(usados).forEach(function (id) {
        var t = document.getElementById(id); if (!t) return;
        $$('[stroke="#0A1A28"]', t).forEach(function (x) { x.setAttribute('stroke', 'currentColor'); });
        $$('[fill="#0A1A28"]', t).forEach(function (x) { x.setAttribute('fill', 'currentColor'); });
        // o mesmo desenho usado fora dos segmentos continua na cor de antes
        $$('use[href="#' + id + '"]').forEach(function (u) { var s = u.closest('svg'); if (s && !s.closest('.framer-f3bb2l, .framer-1hakzmu')) s.style.color = '#0A1A28'; });
    });

    /* ---------------------- 15. brilho no botão principal (uma vez, e quando o ponteiro chega) */
    if (!menosMovimento) {
        var brilho = function (a) {
            if (a._spBrilho && a._spBrilho.playState === 'running') return;
            a._spBrilho = a.animate([{ backgroundPosition: '100% 0, 0 0' }, { backgroundPosition: '0% 0, 0 0' }],
                { duration: 1200, easing: 'cubic-bezier(.22,1,.36,1)' });
        };
        var finoMouse = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        $$('header.framer-15w5m0 a.framer-ucRyg, .framer-1d48c9n a.framer-ucRyg').forEach(function (a) {
            setTimeout(function () { if (visivel(a)) brilho(a); }, 1500);
            if (finoMouse) a.addEventListener('pointerenter', function () { brilho(a); });
        });
    }

    /* ------------ 16. WhatsApp flutuante: parado, não fica sobre texto, link, botão nem a peça do topo */
    var zap = document.querySelector('.sp-whats');
    if (zap && document.elementsFromPoint) {
        var faixa = document.createRange();
        var cobre = function () {
            var r = zap.getBoundingClientRect();
            var barraCel = $$('.framer-1d48c9n').filter(visivel)[0];
            // no celular, a parte de baixo do botão fica sobre a barra fixa: só conta o que sobra acima dela
            var fundo = barraCel ? Math.min(r.bottom, barraCel.getBoundingClientRect().top) : r.bottom;
            if (fundo - r.top < 2) return false;
            var xs = [r.left + 5, r.left + r.width / 2, r.right - 5], ys = [r.top + 3, (r.top + fundo) / 2, fundo - 2];
            for (var i = 0; i < xs.length; i++) for (var j = 0; j < ys.length; j++) {
                var x = xs[i], y = ys[j], pilha = document.elementsFromPoint(x, y);
                for (var k = 0; k < pilha.length; k++) {
                    var e = pilha[k];
                    if (e === zap || zap.contains(e) || e === document.body || e === document.documentElement || (barraCel && barraCel.contains(e))) continue;
                    if (e.closest('a, button, [role="button"], [role="tab"]')) return true;
                    if (e.tagName === 'IMG' && e.closest('header.framer-15w5m0')) return true;
                    for (var n = e.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType !== 3 || !n.textContent.trim()) continue;
                        faixa.selectNodeContents(n);
                        var rs = faixa.getClientRects();
                        for (var q = 0; q < rs.length; q++) if (x >= rs[q].left - 3 && x <= rs[q].right + 3 && y >= rs[q].top - 3 && y <= rs[q].bottom + 3) return true;
                    }
                }
            }
            return false;
        };
        var primeira = true;
        var decideZap = function () {
            if (document.documentElement.classList.contains('sp-menu-aberto')) return;
            var esconde = cobre();
            zap.setAttribute('tabindex', esconde ? '-1' : '0');
            if (primeira) {
                // a entrada passa a ser a transição do próprio recolher (o CSS de entrada fica só para quando não há JS)
                primeira = false;
                zap.classList.add('sp-recolhido'); zap.style.animation = 'none'; void zap.offsetWidth;
                if (!esconde) requestAnimationFrame(function () { zap.classList.remove('sp-recolhido'); });
                return;
            }
            zap.classList.toggle('sp-recolhido', esconde);
        };
        var tZap = null;
        var depois = function (ms) { clearTimeout(tZap); tZap = setTimeout(decideZap, ms); };
        window.addEventListener('scroll', function () { depois(170); }, { passive: true });
        window.addEventListener('resize', function () { depois(250); });
        document.addEventListener('click', function () { depois(650); });
        setTimeout(decideZap, 1000);
    }

    /* ------------------------------------ 14. seta que anda nos links de contato */
    $$('a.framer-1n9l4du').forEach(function (a) {
        var p = a.querySelector(':scope > div:nth-child(2) p');
        if (p && !p.querySelector('.sp-seta-link')) p.insertAdjacentHTML('beforeend', '<span class="sp-seta-link" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>');
    });
})();
