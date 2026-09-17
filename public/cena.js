/* ==========================================================================
   SoftPay — camada de imersão
   --------------------------------------------------------------------------
   O que se move aqui é sempre transform, opacity ou uma variável CSS lida por
   pseudo-elemento. Nenhum conteúdo depende deste arquivo para existir: o HTML
   é inteiro e legível sem JavaScript.

   Com "reduzir movimento" ligado: o PDV mostra a venda já fechada, os
   contadores mostram o número final e não há inclinação nem holofote.
   ========================================================================== */
(function () {
    'use strict';

    var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var comMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* (1. FLUXO DO HERO saiu em 17/09/2026: a malha de pontos em perspectiva
       desenhada em canvas virava um chuvisco brilhante atrás do texto e do
       monitor. O Victor pediu para tirar. O hero fica com a fotografia, o véu
       e o movimento do próprio conteúdo.) */

    /* ================================================== 2. TÍTULO QUE ENTRA
       Palavra a palavra, de baixo para cima. O texto inteiro já está no HTML:
       aqui ele só é reembrulhado em <span>. Sem JS, aparece normalmente. */
    if (!calmo) {
        document.querySelectorAll('[data-entra]').forEach(function (alvo) {
            var i = 0;
            alvo.querySelectorAll('.linha').forEach(function (linha) {
                var partes = linha.textContent.split(' ');
                linha.textContent = '';
                partes.forEach(function (palavra, k) {
                    var fora = document.createElement('span');
                    fora.className = 'palavra';
                    var dentro = document.createElement('span');
                    dentro.textContent = palavra;
                    dentro.style.setProperty('--atraso', (i * 70) + 'ms');
                    fora.appendChild(dentro);
                    linha.appendChild(fora);
                    if (k < partes.length - 1) linha.appendChild(document.createTextNode(' '));
                    i++;
                });
            });
            requestAnimationFrame(function () { alvo.classList.add('entrou'); });
        });
    }

    /* ============================================= 3. PARALLAX DA FOTO DO HERO
       A foto sobe mais devagar que a página. Escrito numa variável CSS e lido
       por transform — sem tocar em layout, uma vez por quadro. */
    var foto = document.querySelector('.hero__foto');
    var hero = document.querySelector('.hero');
    if (foto && hero && !calmo) {
        var pedido = false;
        window.addEventListener('scroll', function () {
            if (pedido) return;
            pedido = true;
            requestAnimationFrame(function () {
                pedido = false;
                var y = window.scrollY;
                if (y > hero.offsetHeight) return;
                hero.style.setProperty('--parallax', (y * 0.18).toFixed(1) + 'px');
                hero.style.setProperty('--recuo', (1 - Math.min(y / hero.offsetHeight, 1) * 0.35).toFixed(3));
            });
        }, { passive: true });
    }

    /* ============================================ 4. HOLOFOTE E INCLINAÇÃO
       Só com mouse de verdade. No toque, nada disso existe. */
    if (comMouse && !calmo) {
        document.querySelectorAll('[data-holofote]').forEach(function (el) {
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
                el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
            });
        });

        document.querySelectorAll('[data-inclina]').forEach(function (el) {
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                var gx = (e.clientX - r.left) / r.width - 0.5;
                var gy = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty('--rx', (-gy * 5).toFixed(2) + 'deg');
                el.style.setProperty('--ry', (gx * 6).toFixed(2) + 'deg');
            });
            el.addEventListener('pointerleave', function () {
                el.style.setProperty('--rx', '0deg');
                el.style.setProperty('--ry', '0deg');
            });
        });
    }

    /* ================================================== 5. O PDV OPERANDO
       A venda acontece sozinha quando a cena entra na tela: o item é bipado,
       entra na lista, o total sobe e o estoque baixa. Depois de fechada, ela
       recomeça — é uma vitrine, não um relógio.
       Com movimento reduzido, mostra a venda já fechada. */
    function pdv(cena) {
        var itens = [].slice.call(cena.querySelectorAll('.pdv__item'));
        var totalEl = cena.querySelector('[data-pdv-total]');
        var contaEl = cena.querySelector('[data-pdv-conta]');
        var selo = cena.querySelector('.pdv__selo');
        if (!itens.length || !totalEl) return;

        // Só a partir daqui os itens podem nascer escondidos: quem esconde é
        // quem sabe revelar. Sem JavaScript, a venda aparece fechada no HTML.
        document.documentElement.classList.add('cena-ok');

        var valores = itens.map(function (it) { return parseFloat(it.dataset.valor) || 0; });
        var somaTudo = valores.reduce(function (a, b) { return a + b; }, 0);

        function dinheiro(v) {
            return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        if (calmo) {
            itens.forEach(function (it) { it.classList.add('dentro'); });
            totalEl.textContent = dinheiro(somaTudo);
            if (contaEl) contaEl.textContent = itens.length;
            if (selo) selo.classList.add('aceso');
            return;
        }

        var tempos = [];
        function limpar() { tempos.forEach(clearTimeout); tempos = []; }

        function rodar() {
            limpar();
            itens.forEach(function (it) { it.classList.remove('dentro'); });
            if (selo) selo.classList.remove('aceso');
            totalEl.textContent = '0,00';
            if (contaEl) contaEl.textContent = '0';

            var acumulado = 0;
            itens.forEach(function (it, i) {
                tempos.push(setTimeout(function () {
                    it.classList.add('dentro');
                    var de = acumulado;
                    acumulado += valores[i];
                    var para = acumulado;
                    if (contaEl) contaEl.textContent = i + 1;
                    var t0 = performance.now();
                    (function sobe(t) {
                        var p = Math.min((t - t0) / 420, 1);
                        totalEl.textContent = dinheiro(de + (para - de) * (1 - Math.pow(1 - p, 3)));
                        if (p < 1) requestAnimationFrame(sobe);
                    })(performance.now());
                }, 700 + i * 720));
            });

            tempos.push(setTimeout(function () {
                if (selo) selo.classList.add('aceso');
            }, 700 + itens.length * 720 + 300));

            tempos.push(setTimeout(rodar, 700 + itens.length * 720 + 3600));
        }

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (e) {
                if (e[0].isIntersecting) rodar(); else limpar();
            }, { threshold: 0.35 }).observe(cena);
        } else {
            rodar();
        }
    }

    document.querySelectorAll('[data-pdv]').forEach(pdv);


    /* ============================================ 7. ABAS PELA ROLAGEM
       Fazer o visitante clicar em seis tópicos para descobrir o que cada um
       diz é o contrário de intuitivo — quem lê uma página de venda não caça
       informação. Aqui a rolagem escolhe a aba: o painel que está no meio da
       tela acende o rótulo correspondente, e o conteúdo dele já está ao lado.
       O clique continua funcionando, para quem quiser saltar.

       Sem JavaScript, todos os painéis aparecem empilhados e legíveis — o
       comportamento de rolagem é um ganho, não um requisito. */
    (function abasPorRolagem() {
        var bloco = document.querySelector('.abas--rolagem');
        if (!bloco) return;

        var abas = [].slice.call(bloco.querySelectorAll('.abas__botoes .aba'));
        var painels = abas.map(function (a) {
            return document.getElementById(a.getAttribute('href').slice(1));
        });
        if (!abas.length || painels.some(function (p) { return !p; })) return;

        var atual = -1;
        function acender(i) {
            if (i === atual || i < 0) return;
            atual = i;
            abas.forEach(function (aba, k) {
                if (k === i) aba.setAttribute('aria-current', 'true');
                else aba.removeAttribute('aria-current');
            });
            // no celular a fila de pílulas rola junto, para a ativa ficar à vista
            var trilho = bloco.querySelector('.abas__botoes');
            if (trilho && trilho.scrollWidth > trilho.clientWidth) {
                var alvo = abas[i];
                var meio = alvo.offsetLeft - (trilho.clientWidth - alvo.offsetWidth) / 2;
                trilho.scrollTo({ left: Math.max(0, meio), behavior: calmo ? 'auto' : 'smooth' });
            }
        }

        /* Qual tópico acende é uma pergunta de geometria: qual painel ocupa o
           meio da tela. O IntersectionObserver respondia por intersectionRatio,
           que é relativo ao tamanho de CADA painel — e eles têm alturas
           diferentes, então o painel mais alto perdia o desempate mesmo
           dominando a faixa. Medido em 1920x1080: "Loja online" no meio da tela
           e "Nota fiscal" aceso.

           Agora a conta é direta e determinística: o painel que contém o meio
           da tela; se nenhum contém (estamos num vão entre dois), o de borda
           mais próxima. Roda uma vez por quadro. */
        var pedido = false;
        function escolher() {
            var meio = window.innerHeight / 2;
            var melhor = -1, menorDist = Infinity;
            for (var k = 0; k < painels.length; k++) {
                var r = painels[k].getBoundingClientRect();
                if (r.top <= meio && r.bottom >= meio) { melhor = k; break; }
                var dist = r.top > meio ? r.top - meio : meio - r.bottom;
                if (dist < menorDist) { menorDist = dist; melhor = k; }
            }
            acender(melhor);
        }
        function aoRolar() {
            if (pedido) return;
            pedido = true;
            requestAnimationFrame(function () { pedido = false; escolher(); });
        }
        /* A coluna gruda centralizada, e para isso o CSS precisa saber metade
           da altura dela — que depende da fonte carregada e da largura. Medida
           aqui e escrita numa variável. Não é por quadro: só quando algo muda,
           porque posicionar a cada quadro por script é o que causava tremor. */
        var colunaEl = bloco.querySelector('.abas__botoes');
        function medirColuna() {
            if (!colunaEl) return;
            colunaEl.style.setProperty('--meia-coluna', (colunaEl.offsetHeight / 2).toFixed(1) + 'px');
        }
        medirColuna();
        if ('ResizeObserver' in window) new ResizeObserver(medirColuna).observe(colunaEl);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(medirColuna);
        window.addEventListener('resize', medirColuna);

        window.addEventListener('scroll', aoRolar, { passive: true });
        window.addEventListener('resize', aoRolar);
        escolher();

        // clique e teclado continuam valendo: levam a rolagem até o painel
        abas.forEach(function (aba, i) {
            aba.addEventListener('click', function (e) {
                e.preventDefault();
                acender(i);
                painels[i].scrollIntoView({ block: 'center', behavior: calmo ? 'auto' : 'smooth' });
            });

        });

        acender(0);
    })();

    /* ============================================== 6. NAVBAR APÓS O HERO */
    var nav = document.querySelector('.nav');
    if (nav && hero && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
            nav.setAttribute('data-solida', e[0].isIntersecting ? 'nao' : 'sim');
        }, { threshold: 0, rootMargin: '-72px 0px 0px 0px' }).observe(hero);
    }
})();
