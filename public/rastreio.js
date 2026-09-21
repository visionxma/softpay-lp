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

    // Só o aplicativo. `(^|\.)softpaybr\.com` aceitava também
    // site.softpaybr.com: numa URL de prévia do Cloudflare o `location.hostname`
    // é outro, a guarda de mesmo domínio não pega, e os links institucionais
    // recebiam parâmetro de campanha à toa.
    var APP = /^(www\.)?softpaybr\.com$/i;
    // O que viaja para o aplicativo. Repare no que NÃO está aqui:
    //
    //   `ref` e `utm_campaign` — no aplicativo, `?ref=` é o código da
    //   Plataforma de Parceiros, que paga COMISSÃO EM DINHEIRO, e
    //   `utm_campaign` é o substituto dele (src/lib/partnerTracking.ts, "doc 03
    //   §2.2: o `ref` explícito vence; `utm_campaign` é o fallback"). O valor
    //   vai para `accounts.affiliate_ref` no cadastro, e conta que nasce com
    //   `affiliate_ref` fica de fora do programa Indique e Ganhe.
    //
    //   Ou seja: repassar o nome da campanha faria todo cadastro vindo de
    //   anúncio nascer atribuído a um afiliado que não existe. O próprio
    //   aplicativo já tinha tropeçado nessa classe de defeito e documentou a
    //   exceção da vitrine do lojista pelo mesmo motivo.
    //
    // Quem decide pagar comissão é a Plataforma de Parceiros, não a LP.
    // wbraid e gbraid: em iOS o Google Ads manda esses no lugar do gclid.
    // source_platform, creative_format e marketing_tactic são UTMs de nome
    // composto — `utm_[a-z]+` não pegava o segundo sublinhado.
    var UTM = /^(utm_(source|medium|content|term|id|source_platform|creative_format|marketing_tactic)|fbclid|gclid|wbraid|gbraid|ttclid|msclkid)$/i;

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
    // `voltou` é lido pelos vigias: restaurar do bfcache zera o relógio, e a
    // profundidade da visita anterior tem de zerar junto — senão 50% rolados
    // antes de sair se somam a 30 s depois de voltar e sai um Lead que não
    // aconteceu.
    var reinicios = [];
    window.addEventListener('pageshow', function (ev) {
        if (!ev.persisted) return;
        acumulado = 0; desde = Date.now();
        for (var i = 0; i < reinicios.length; i++) { try { reinicios[i](); } catch (e) {} }
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
        return Math.min(100, Math.floor((window.scrollY / rolavel) * 100));
    }

    // floor, não round: com round, 29,6 s viravam 30 e o evento saía antes da
    // condição ser cumprida de verdade.
    function segundos() {
        return Math.floor((acumulado + (desde ? Date.now() - desde : 0)) / 1000);
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
    // Clique duplo num link que abre em nova aba mandava dois eventos, com
    // event_id diferentes — a Meta contaria as duas intenções. Meio segundo de
    // carência por elemento resolve sem esconder clique legítimo em outro botão.
    var ultimo = { el: null, quando: 0 };

    function noClique(ev) {
        var a = ev.target.closest && ev.target.closest('a[href]');
        if (!a) return;
        var agora = Date.now();
        if (ultimo.el === a && agora - ultimo.quando < 500) return;
        ultimo.el = a; ultimo.quando = agora;

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
        // A lista de limiares é da SEÇÃO; a condição é em pixels da TELA. Com
        // poucos limiares as duas não conversam: na seção medida (1.223px de
        // altura em 390px), metade da tela são 422px, ou razão 0,345 — entre o
        // aviso de 0,25 e o de 0,5. Quem parasse ali não receberia aviso nenhum
        // e o evento sumia. Passo de 0,02 = aviso a cada ~24px.
        var limiares = [];
        for (var k = 0; k <= 50; k++) limiares.push(k / 50);

        var relogio = null;
        function desarma() { if (relogio) { clearTimeout(relogio); relogio = null; } }
        // O segundo de leitura não vale com a aba escondida: mostrar a seção,
        // trocar de aba e o evento sair sozinho seria contar o que ninguém viu.
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState !== 'visible') desarma();
        });

        var obs = new IntersectionObserver(function (itens) {
            itens.forEach(function (i) {
                var visivel = i.intersectionRect.height;
                var basta = Math.min(window.innerHeight * 0.5, i.boundingClientRect.height * 0.5);
                if (i.isIntersecting && visivel >= basta && document.visibilityState === 'visible') {
                    if (relogio) return;
                    relogio = setTimeout(function () {
                        empurra('viu_planos', 'ViewContent', { content_name: 'Planos', content_type: 'pricing' });
                        obs.disconnect();
                    }, 1000);
                } else { desarma(); }
            });
        }, { threshold: limiares });
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
            // Desistir depois de 10 minutos DE ABA À VISTA, não de relógio: com
            // relógio, quem deixa a aba aberta atrás de outra por dez minutos e
            // volta para ler perdia o evento sem nunca ter lido nada.
            if (!pronto && segundos() >= 600) para();
        }
        window.addEventListener('scroll', olha, { passive: true });
        t = setInterval(olha, 5000);
        reinicios.push(function () { maxProf = 0; });
    }

    // Página de conteúdo lida de verdade (15 s e um quarto rolado), não uma
    // batida de porta. Serve de público de remarketing por interesse.
    function vigiaLeitura() {
        var tipo = tipoDaPagina();
        if (!/^(guias|blog|comparativos|solucoes|segmentos|perguntas)/.test(tipo)) return;
        var pronto = false, t = null, maxProf = 0;
        function para() { pronto = true; if (t) { clearInterval(t); t = null; } }
        // Guarda a profundidade MÁXIMA: quem desce a 30%, volta ao topo e só
        // então completa os 15 segundos já leu — olhar só a posição atual, de
        // três em três segundos, perdia esse visitante.
        function marca() { maxProf = Math.max(maxProf, profundidade()); }
        window.addEventListener('scroll', marca, { passive: true });
        reinicios.push(function () { maxProf = 0; });

        t = setInterval(function () {
            if (pronto) { para(); return; }
            marca();
            if (segundos() >= 15 && maxProf >= 25) {
                empurra('leu_conteudo', 'ViewContent', {
                    content_name: (document.title || '').split('|')[0].trim().slice(0, 80),
                    content_type: tipo,
                    profundidade_max: maxProf
                });
                para();
                window.removeEventListener('scroll', marca);
            }
            if (!pronto && segundos() >= 600) { para(); window.removeEventListener('scroll', marca); }
        }, 3000);
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

        var links = document.querySelectorAll('a[href]');
        for (var i = 0; i < links.length; i++) {
            var a = links[i], u;
            try { u = new URL(a.href, location.href); } catch (e) { continue; }
            if (!APP.test(u.hostname) || u.hostname === location.hostname) continue;

            // `sp_lp=1` arma o pixel da campanha no aplicativo (a tabela LINKS
            // do index.html dele). Sem esta marca o pixel da campanha via o
            // clique aqui e nunca o cadastro lá — medido em 21/09/2026: /auth
            // carregava só o pixel próprio do SoftPay.
            //
            // Só nos botões de CADASTRO. "Entrar" é cliente voltando para a
            // conta: não é aquisição e não entra no público da campanha.
            if (!ehEntrar(a)) u.searchParams.set('sp_lp', '1');

            for (var j = 0; j < levar.length; j++) {
                if (!u.searchParams.has(levar[j][0])) u.searchParams.set(levar[j][0], levar[j][1]);
            }
            a.href = u.toString();
        }
    }

    /* ---------- inspetor ao vivo: ?sp_debug=1 ---------- */

    // Para o gestor de tráfego CONFERIR sem depender do Preview do GTM e sem
    // sujar relatório: o painel só OBSERVA o dataLayer, nunca empurra nada.
    // Navegue pelo site com ?sp_debug=1 e cada evento aparece na hora, com a
    // carga inteira. Fecha no × e não volta na mesma aba.
    function inspetor() {
        if (!/[?&]sp_debug=1(&|$)/.test(location.search)) return;
        try { if (sessionStorage.getItem('sp_debug_off') === '1') return; } catch (e) {}

        var st = document.createElement('style');
        st.textContent = [
            '.sp-insp{position:fixed;z-index:2147483647;left:0;right:0;bottom:0;',
            'max-height:min(58vh,32rem);display:flex;flex-direction:column;',
            'background:#06121F;color:#fff;font:500 12px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;',
            'box-shadow:0 -18px 44px -14px rgba(0,0,0,.6);',
            'padding-bottom:env(safe-area-inset-bottom,0px)}',
            '@media(min-width:56rem){.sp-insp{left:auto;width:31rem;bottom:1rem;right:1rem;border-radius:14px;overflow:hidden}}',
            '.sp-insp__topo{display:flex;align-items:center;gap:.5rem;padding:.6rem .75rem;',
            'background:#0B2033;border-bottom:1px solid rgba(255,255,255,.14);flex:none}',
            '.sp-insp__t{font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:11px;color:#7FC8F5}',
            '.sp-insp__n{margin-left:auto;background:#1DA1F2;color:#06121F;border-radius:999px;',
            'padding:.1rem .5rem;font-weight:700;font-size:11px}',
            '.sp-insp__x{min-width:44px;min-height:32px;border:0;background:transparent;color:#fff;',
            'font:inherit;font-size:18px;cursor:pointer;border-radius:8px}',
            '.sp-insp__x:active{transform:scale(.94)}',
            '.sp-insp__lista{overflow:auto;-webkit-overflow-scrolling:touch;padding:.5rem .75rem .75rem}',
            '.sp-insp__vazio{opacity:.62;padding:.4rem 0}',
            '.sp-insp__ev{border-top:1px solid rgba(255,255,255,.1);padding:.55rem 0}',
            '.sp-insp__ev:first-child{border-top:0}',
            '.sp-insp__nome{color:#7FC8F5;font-weight:700}',
            '.sp-insp__meta{color:#8FE3B0}',
            '.sp-insp__hora{opacity:.5;float:right}',
            '.sp-insp__campos{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,9rem),1fr));',
            'gap:.15rem .75rem;margin-top:.3rem}',
            '.sp-insp__k{opacity:.58}'
        ].join('');
        document.head.appendChild(st);

        var caixa = document.createElement('div');
        caixa.className = 'sp-insp';
        caixa.setAttribute('role', 'log');
        caixa.setAttribute('aria-label', 'Inspetor de eventos');
        caixa.innerHTML =
            '<div class="sp-insp__topo"><span class="sp-insp__t">Inspetor SoftPay</span>' +
            '<span class="sp-insp__n" data-n>0</span>' +
            '<button class="sp-insp__x" type="button" data-x aria-label="Fechar inspetor">&times;</button></div>' +
            '<div class="sp-insp__lista" data-lista><div class="sp-insp__vazio">' +
            'Nenhum evento ainda. Role até os planos, clique em “Testar grátis” ou no WhatsApp.' +
            '</div></div>';
        document.body.appendChild(caixa);

        var lista = caixa.querySelector('[data-lista]');
        var contador = caixa.querySelector('[data-n]');
        var vazio = lista.firstChild;
        var n = 0;

        caixa.querySelector('[data-x]').addEventListener('click', function () {
            try { sessionStorage.setItem('sp_debug_off', '1'); } catch (e) {}
            caixa.remove();
        });

        function mostra(d) {
            if (!d || typeof d.event !== 'string' || d.event.indexOf('gtm.') === 0) return;
            if (vazio && vazio.parentNode) { vazio.remove(); vazio = null; }
            n++; contador.textContent = String(n);
            var campos = '';
            for (var k in d) {
                if (k === 'event' || k === 'meta_evento' || k === 'gtm.uniqueEventId') continue;
                var v = String(d[k]);
                campos += '<div><span class="sp-insp__k">' + k + '</span> ' +
                          v.replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }).slice(0, 90) + '</div>';
            }
            var linha = document.createElement('div');
            linha.className = 'sp-insp__ev';
            linha.innerHTML =
                '<span class="sp-insp__hora">' + new Date().toLocaleTimeString('pt-BR') + '</span>' +
                '<span class="sp-insp__nome">' + d.event + '</span>' +
                (d.meta_evento ? ' <span class="sp-insp__meta">&rarr; ' + d.meta_evento + '</span>' : '') +
                '<div class="sp-insp__campos">' + campos + '</div>';
            lista.insertBefore(linha, lista.firstChild);
        }

        // O que já entrou antes do painel existir, e tudo que entrar depois.
        for (var i = 0; i < window.dataLayer.length; i++) mostra(window.dataLayer[i]);
        var empurrarOriginal = window.dataLayer.push;
        window.dataLayer.push = function () {
            var r = empurrarOriginal.apply(this, arguments);
            for (var j = 0; j < arguments.length; j++) { try { mostra(arguments[j]); } catch (e) {} }
            return r;
        };
    }

    /* ---------- "Fale agora": o formulário vira conversa ---------- */

    // Não existe servidor aqui, e nem precisa: o canal de atendimento é o
    // WhatsApp. O formulário monta a mensagem e abre a conversa com o texto
    // pronto — sem caixa de spam, sem chave de API, e o lead cai onde alguém
    // responde. O evento sai antes de abrir a janela.
    function formulario() {
        var f = document.querySelector('form[data-formulario]');
        if (!f) return;
        var nota = f.querySelector('[data-fala-nota]');
        var notaOriginal = nota ? nota.textContent : '';

        function erro(campo, msg) {
            campo.setAttribute('aria-invalid', 'true');
            if (nota) { nota.textContent = msg; nota.setAttribute('data-erro', ''); }
            campo.focus();
        }

        f.addEventListener('input', function (ev) {
            if (ev.target.getAttribute('aria-invalid')) {
                ev.target.removeAttribute('aria-invalid');
                if (nota) { nota.textContent = notaOriginal; nota.removeAttribute('data-erro'); }
            }
        });

        f.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var nome = f.elements.nome, negocio = f.elements.negocio, duvida = f.elements.duvida;

            if (!nome.value.trim()) return erro(nome, 'Só falta o seu nome.');
            if (!negocio.value) return erro(negocio, 'Escolha o tipo do seu negócio.');

            var linhas = ['Oi! Sou ' + nome.value.trim() + ', tenho ' + negocio.value.toLowerCase() + '.'];
            if (duvida.value.trim()) linhas.push(duvida.value.trim());
            else linhas.push('Quero saber sobre o SoftPay.');

            empurra('envio_formulario', 'Lead', {
                cta_texto: 'Abrir conversa',
                cta_local: 'formulario-contato',
                form_negocio: negocio.value,
                form_com_duvida: duvida.value.trim() ? 'sim' : 'nao'
            });

            window.open('https://wa.me/5586998193851?text=' + encodeURIComponent(linhas.join('\n')),
                        '_blank', 'noopener');
            if (nota) nota.textContent = 'Pronto — a conversa abriu numa aba nova.';
        });
    }

    function comeca() { repassa(); vigiaPlanos(); vigiaQualificada(); vigiaLeitura(); formulario(); inspetor(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', comeca);
    } else {
        comeca();
    }
})();
