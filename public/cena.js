/* ==========================================================================
   SoftPay — camada de imersão
   --------------------------------------------------------------------------
   O que se move aqui é sempre transform, opacity ou uma variável CSS lida por
   pseudo-elemento. Nenhum conteúdo depende deste arquivo para existir: o HTML
   é inteiro e legível sem JavaScript.

   Com "reduzir movimento" ligado: o fluxo do hero fica parado num quadro, o
   PDV mostra a venda já fechada, os contadores mostram o número final e não há
   inclinação nem holofote.
   ========================================================================== */
(function () {
    'use strict';

    var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var comMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ====================================================== 1. FLUXO DO HERO
       Uma malha de pontos em perspectiva, como o balcão visto de cima: cada
       ponto é uma venda entrando. A onda percorre da esquerda para a direita,
       e a fileira da frente pulsa mais forte — é o caixa de hoje.
       Custo: um canvas de 1.5x no máximo, parado quando sai da tela ou a aba
       vai para o fundo. */
    function fluxo(canvas) {
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var w = 0, h = 0, dpr = 1, raf = 0, visivel = true, t0 = performance.now();

        function medir() {
            var r = canvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = r.width; h = r.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function desenhar(agora) {
            var t = (agora - t0) / 1000;
            ctx.clearRect(0, 0, w, h);

            var estreito = w < 640;
            var cols = estreito ? 30 : 60;
            var linhas = estreito ? 14 : 20;
            var horizonte = h * 0.42;
            var base = h * 1.04;

            for (var j = 0; j < linhas; j++) {
                var z = j / (linhas - 1);          // 0 = fundo, 1 = frente
                var p = 0.2 + z * z * 0.8;          // perspectiva
                var yBase = horizonte + (base - horizonte) * z * z;
                var alfa = (0.05 + z * 0.4) * (estreito ? 0.8 : 1);

                for (var i = 0; i < cols; i++) {
                    var x0 = (i / (cols - 1) - 0.5) * 2;   // -1..1
                    // duas ondas somadas: o fluxo nunca repete o mesmo desenho
                    var onda = Math.sin(x0 * 2.6 + t * 0.5 + z * 3.4) * 0.6
                             + Math.cos(x0 * 1.4 - t * 0.28 + z * 5.2) * 0.4;
                    // pulso que atravessa a malha: a "venda" passando pelo caixa
                    var fase = (t * 0.22 + z * 0.35) % 1;
                    var dist = Math.abs(((x0 + 1) / 2) - fase);
                    var pulso = Math.max(0, 1 - dist * 7);

                    var x = w / 2 + x0 * w * 0.92 * (0.6 + p * 0.7);
                    var y = yBase - onda * 26 * p;
                    var tam = Math.max(1, (1.8 + pulso * 2.4) * p);
                    var a = Math.min(0.85, alfa + pulso * 0.5);

                    // do azul profundo no fundo ao azul do logotipo na frente
                    var cr = Math.round(12 + (29 - 12) * (z * 0.7 + pulso * 0.3));
                    var cg = Math.round(92 + (161 - 92) * (z * 0.7 + pulso * 0.3));
                    var cb = Math.round(158 + (242 - 158) * (z * 0.7 + pulso * 0.3));

                    ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + a.toFixed(3) + ')';
                    ctx.fillRect(x, y, tam, tam);
                }
            }
        }

        function laco(agora) {
            desenhar(agora);
            raf = (visivel && !document.hidden) ? requestAnimationFrame(laco) : 0;
        }
        function ligar() {
            if (!raf && !calmo && visivel && !document.hidden) raf = requestAnimationFrame(laco);
        }

        medir();
        desenhar(performance.now());   // com movimento reduzido, fica neste quadro
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (e) {
                visivel = e[0].isIntersecting;
                if (visivel) ligar(); else { cancelAnimationFrame(raf); raf = 0; }
            }).observe(canvas);
        }
        if ('ResizeObserver' in window) {
            new ResizeObserver(function () { medir(); desenhar(performance.now()); }).observe(canvas);
        }
        document.addEventListener('visibilitychange', ligar);
        ligar();
    }

    var tela = document.querySelector('[data-fluxo]');
    if (tela) fluxo(tela);

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
            requestAnimationFrame(function () { pedido = false; posicionar(); escolher(); });
        }
        /* --- Posição da coluna: os três estados que o sticky não dá ---
           1. começo  — parada no topo do bloco, na linha do primeiro tópico;
           2. meio    — acompanhando, centrada na altura da tela;
           3. fim     — travada, terminando junto com o último tópico.
           O valor vai para --desloca e o CSS aplica como translate3d. */
        var colunaEl = bloco.querySelector('.abas__botoes');
        var trilhoEl = bloco.querySelector('.abas__trilho');

        function posicionar() {
            if (!colunaEl || !trilhoEl) return;
            if (!window.matchMedia('(min-width: 64rem)').matches) {
                colunaEl.style.setProperty('--desloca', '0px');
                return;
            }
            var t = trilhoEl.getBoundingClientRect();
            var alturaColuna = colunaEl.offsetHeight;
            // onde o topo da coluna precisaria estar para ela ficar centrada
            var alvo = (window.innerHeight - alturaColuna) / 2 - t.top;
            // e o quanto ela pode andar sem sair do bloco
            var limite = trilhoEl.offsetHeight - alturaColuna;
            var d = Math.max(0, Math.min(alvo, limite));
            colunaEl.style.setProperty('--desloca', d.toFixed(1) + 'px');
        }

        if ('ResizeObserver' in window) new ResizeObserver(posicionar).observe(colunaEl);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(posicionar);
        window.addEventListener('resize', posicionar);

        window.addEventListener('scroll', aoRolar, { passive: true });
        window.addEventListener('resize', aoRolar);
        posicionar();
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
