/* SoftPay — o que o JavaScript do Webflow/Swiper fazia na página de referência,
 * reescrito do zero, sem biblioteca, mais o acabamento de 25/09/2026:
 *  1. menu do computador: submenus abrem ao passar o mouse (e no clique/teclado);
 *  2. menu do celular: o hambúrguer abre o painel descendo, e os submenus abrem no toque;
 *  3. carrosséis (recursos e depoimentos): setas que se apagam nas pontas, bolinhas que
 *     acompanham, arrastar com o dedo ou o mouse (com impulso), rolagem lateral do trackpad
 *     e parada sempre num cartão;
 *  4. perguntas frequentes: abertura suave, o "+" gira para "×", uma aberta por vez;
 *  5. revelar ao entrar na tela, escalonado entre irmãos;
 *  6. hero: título entra palavra por palavra; números de prova contam;
 *  7. cabeçalho: some ao descer e volta ao subir (como na referência), vira vidro ao rolar,
 *     e o item do menu acende conforme a seção visível;
 *  8. balão do WhatsApp: no celular e no tablet só aparece onde não tapa texto, botão nem foto.
 * Sem o script a página continua inteira: nada nasce escondido esperando JS (o <head>
 * só marca .js-ok, e desmarca sozinho se este arquivo não rodar em 2,5 s). */
(function () {
  'use strict';
  window.spPolido = true;
  var html = document.documentElement;
  var EFEITOS = html.classList.contains('js-ok');
  var MENOS = window.matchMedia('(prefers-reduced-motion: reduce)');
  var CELULAR = window.matchMedia('(max-width: 991px)'); // celular e tablet: o conteúdo ocupa a largura toda
  var toArr = function (l) { return Array.prototype.slice.call(l); };

  /* ---------- 1. submenus do computador ---------- */
  function abreDropdown(dd, abrir) {
    var t = dd.querySelector('.w-dropdown-toggle');
    var l = dd.querySelector('.w-dropdown-list');
    if (!t || !l) return;
    t.classList.toggle('w--open', abrir);
    l.classList.toggle('w--open', abrir);
    var w = l.querySelector('.nav-dropdown-wrapper');
    if (w) w.classList.toggle('w--open', abrir);
    t.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  }
  toArr(document.querySelectorAll('.w-dropdown')).forEach(function (dd) {
    var t = dd.querySelector('.w-dropdown-toggle');
    if (!t) return;
    if (dd.getAttribute('data-hover') === 'true') {
      dd.addEventListener('mouseenter', function () { abreDropdown(dd, true); });
      dd.addEventListener('mouseleave', function () { abreDropdown(dd, false); });
    }
    t.addEventListener('click', function (e) {
      e.preventDefault();
      abreDropdown(dd, !t.classList.contains('w--open'));
    });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); }
      if (e.key === 'Escape') abreDropdown(dd, false);
    });
  });
  document.addEventListener('click', function (e) {
    toArr(document.querySelectorAll('.nav-layout .w-dropdown')).forEach(function (dd) {
      if (!dd.contains(e.target)) abreDropdown(dd, false);
    });
  });

  /* ---------- 2. menu do celular ---------- */
  var navMob = document.querySelector('.nav-mobile-layout');
  var menuAberto = false;
  var abreMenu = function () {};
  if (navMob) {
    var botao = navMob.querySelector('.w-nav-button');
    var menu = navMob.querySelector('.w-nav-menu');
    var capa = navMob.querySelector('.w-nav-overlay');
    var casa = menu && menu.parentNode;
    var depois = menu && menu.nextSibling;
    var DUR = 380, CURVA = 'cubic-bezier(.22, 1, .36, 1)';
    abreMenu = function (abrir) {
      if (!botao || !menu || !capa || abrir === menuAberto) return;
      menuAberto = abrir;
      botao.classList.toggle('w--open', abrir);
      botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      var dur = MENOS.matches ? 1 : DUR;
      if (abrir) {
        capa.appendChild(menu);
        menu.setAttribute('data-nav-menu-open', '');
        capa.style.display = 'block';
        capa.style.height = window.innerHeight + 'px';
        var h = menu.offsetHeight;
        menu.style.transition = 'none';
        menu.style.transform = 'translateY(-' + h + 'px)';
        void menu.offsetHeight;
        menu.style.transition = 'transform ' + dur + 'ms ' + CURVA;
        menu.style.transform = 'translateY(0px)';
      } else {
        menu.style.transition = 'transform ' + Math.round(dur * 0.75) + 'ms ease-in';
        menu.style.transform = 'translateY(-' + menu.offsetHeight + 'px)';
        setTimeout(function () {
          if (menuAberto) return;
          menu.removeAttribute('data-nav-menu-open');
          menu.style.transition = '';
          menu.style.transform = '';
          capa.style.display = '';
          capa.style.height = '';
          casa.insertBefore(menu, depois);
        }, Math.round(dur * 0.75));
      }
    };
    if (botao) {
      botao.addEventListener('click', function () { abreMenu(!menuAberto); });
      botao.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abreMenu(!menuAberto); }
      });
    }
    if (capa) capa.addEventListener('click', function (e) { if (e.target === capa) abreMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abreMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 991) abreMenu(false); });
    // link para uma seção desta página fecha o painel antes de rolar
    if (menu) menu.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || !menuAberto) return;
      var alvo = document.querySelector(a.getAttribute('href'));
      if (!alvo) return;
      e.preventDefault();
      abreMenu(false);
      setTimeout(function () {
        alvo.scrollIntoView({ behavior: MENOS.matches ? 'auto' : 'smooth', block: 'start' });
        if (history.pushState) history.pushState(null, '', a.getAttribute('href'));
      }, MENOS.matches ? 0 : 300);
    });
  }

  /* ---------- 3. carrosséis ---------- */
  function carrossel(raiz, envoltorio, anterior, proximo, grupoSetas, rotulo) {
    if (!raiz || !envoltorio) return;
    var slides = toArr(envoltorio.children);
    if (!slides.length) return;
    var pos = 0, max = 0, paradas = [0];
    var pontos = null;
    if (grupoSetas && proximo) {
      pontos = document.createElement('div');
      pontos.className = 'sp-pontos';
      pontos.setAttribute('role', 'group');
      pontos.setAttribute('aria-label', 'Escolher ' + rotulo);
      grupoSetas.insertBefore(pontos, proximo);
    }

    function medir() {
      var cs = getComputedStyle(raiz);
      var util = raiz.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var total = 0;
      slides.forEach(function (s, i) {
        var m = parseFloat(getComputedStyle(s).marginRight) || 0;
        total += s.getBoundingClientRect().width + (i < slides.length - 1 ? m : 0);
      });
      max = Math.max(0, Math.round(total - util));
      // uma parada no começo de cada cartão, e a última quando o último encosta na borda
      var novas = [0], x = 0;
      for (var i = 0; i < slides.length - 1; i++) {
        x += slides[i].getBoundingClientRect().width + (parseFloat(getComputedStyle(slides[i]).marginRight) || 0);
        if (x < max - 8) novas.push(Math.round(x)); else break;
      }
      if (max > 0) novas.push(max);
      if (novas.join() !== paradas.join() || (pontos && !pontos.children.length)) { paradas = novas; montaPontos(); }
    }
    function montaPontos() {
      if (!pontos) return;
      pontos.innerHTML = '';
      pontos.hidden = paradas.length < 2;
      paradas.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'sp-ponto';
        b.setAttribute('aria-label', 'Ir para ' + rotulo + ' ' + (i + 1) + ' de ' + paradas.length);
        b.addEventListener('click', function () { vaiPara(i); });
        pontos.appendChild(b);
      });
    }
    function indice() {
      var melhor = 0;
      paradas.forEach(function (p, i) { if (Math.abs(p - pos) < Math.abs(paradas[melhor] - pos)) melhor = i; });
      return melhor;
    }
    function aplica(animar) {
      envoltorio.classList.toggle('is-arrastando', !animar);
      envoltorio.style.transform = 'translate3d(' + (-pos) + 'px, 0px, 0px)';
      var noInicio = pos <= 1, noFim = pos >= max - 1;
      [[anterior, noInicio], [proximo, noFim]].forEach(function (par) {
        if (!par[0]) return;
        par[0].classList.toggle('swiper-button-disabled', par[1]);
        par[0].setAttribute('aria-disabled', par[1] ? 'true' : 'false');
        par[0].setAttribute('tabindex', par[1] ? '-1' : '0');
      });
      var ativo = indice();
      if (pontos) toArr(pontos.children).forEach(function (b, i) {
        if (i === ativo) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      // cartão ativo = o primeiro que aparece inteiro
      var x = 0, primeiro = 0;
      for (var i = 0; i < slides.length; i++) {
        if (x >= pos - 4) { primeiro = i; break; }
        x += slides[i].getBoundingClientRect().width + (parseFloat(getComputedStyle(slides[i]).marginRight) || 0);
      }
      slides.forEach(function (s, i) {
        s.classList.toggle('swiper-slide-active', i === primeiro);
        s.classList.toggle('swiper-slide-next', i === primeiro + 1);
      });
    }
    function vaiPara(i) {
      medir();
      i = Math.max(0, Math.min(paradas.length - 1, i));
      pos = paradas[i];
      aplica(true);
    }

    if (anterior) anterior.addEventListener('click', function () { medir(); vaiPara(indice() - 1); });
    if (proximo) proximo.addEventListener('click', function () { medir(); vaiPara(indice() + 1); });
    [anterior, proximo].forEach(function (b) {
      if (b) b.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
      });
    });
    [anterior, proximo, pontos].forEach(function (b) {
      if (b) b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); vaiPara(indice() + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); vaiPara(indice() - 1); }
      });
    });

    // arrastar (dedo ou mouse), com impulso; o eixo vertical continua rolando a página
    var x0 = 0, y0 = 0, pos0 = 0, arrastando = false, decidiu = false, moveu = false;
    var ultX = 0, ultT = 0, vel = 0;
    envoltorio.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (arrastando) return; // segundo dedo não rouba o arrasto
      medir();
      x0 = ultX = e.clientX; y0 = e.clientY; pos0 = pos; ultT = performance.now(); vel = 0;
      arrastando = true; decidiu = false; moveu = false;
    });
    window.addEventListener('pointermove', function (e) {
      if (!arrastando) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (!decidiu) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        decidiu = true;
        if (Math.abs(dy) > Math.abs(dx)) { arrastando = false; return; }
      }
      moveu = true;
      var agora = performance.now();
      if (agora - ultT > 0) vel = 0.7 * vel + 0.3 * ((e.clientX - ultX) / (agora - ultT));
      ultX = e.clientX; ultT = agora;
      var alvo = pos0 - dx;
      if (alvo < 0) alvo = alvo / 3;                // resistência nas pontas
      if (alvo > max) alvo = max + (alvo - max) / 3;
      pos = alvo;
      aplica(false);
    });
    function solta() {
      if (!arrastando) return;
      arrastando = false;
      if (!moveu) return;
      var andou = pos - pos0;
      var i0 = indice();
      var rapido = Math.abs(vel) > 0.35 && performance.now() - ultT < 120;
      var i = i0;
      if (rapido || Math.abs(andou) > 40) {
        var dir = rapido ? (vel < 0 ? 1 : -1) : (andou > 0 ? 1 : -1);
        // de onde saiu o arrasto, anda ao menos um cartão no sentido do gesto
        var ini = 0;
        paradas.forEach(function (p, k) { if (Math.abs(p - pos0) < Math.abs(paradas[ini] - pos0)) ini = k; });
        i = dir > 0 ? Math.max(i0, ini + 1) : Math.min(i0, ini - 1);
      }
      vaiPara(i);
    }
    window.addEventListener('pointerup', solta);
    window.addEventListener('pointercancel', solta);
    envoltorio.addEventListener('click', function (e) { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
    envoltorio.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // rolagem lateral do trackpad / roda com Shift: segue o dedo e assenta no cartão mais perto
    var tRoda = 0;
    raiz.addEventListener('wheel', function (e) {
      var dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!dx || max <= 0) return;
      e.preventDefault();
      if (!tRoda) medir();
      pos = Math.max(-40, Math.min(max + 40, pos + dx));
      aplica(false);
      clearTimeout(tRoda);
      tRoda = setTimeout(function () { tRoda = 0; vaiPara(indice()); }, 140);
    }, { passive: false });

    var tRes = 0;
    window.addEventListener('resize', function () {
      clearTimeout(tRes);
      tRes = setTimeout(function () { var i = indice(); medir(); vaiPara(i); }, 120);
    });
    medir(); aplica(true);
  }
  var rec = document.querySelector('.general-features_swiper-swiper');
  if (rec) carrossel(rec, rec.querySelector('.swiper-wrapper'),
    rec.querySelector('.swiper-button-prev'), rec.querySelector('.swiper-button-next'),
    rec.querySelector('.slider-arrow-group'), 'recurso');
  var dep = document.querySelector('.g-testimonials_swiper-swiper');
  if (dep) carrossel(dep, dep.querySelector('.swiper-wrapper'),
    document.querySelector('.testimonials-prev'), document.querySelector('.testimonials-next'),
    document.querySelector('.home-testimonials_swiper-main_wrap .slider-arrow-group'), 'depoimento');

  /* ---------- 4. perguntas frequentes (uma aberta por vez) ---------- */
  var perguntas = toArr(document.querySelectorAll('.faq-question-wrap'));
  if (perguntas.length) html.classList.add('js-faq');
  // a altura abre e fecha no CSS (grid-template-rows 0fr → 1fr): aqui só o estado
  function faqAbre(q, abrir) {
    if ((q.getAttribute('aria-expanded') === 'true') === abrir) return;
    q.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  }
  perguntas.forEach(function (q, n) {
    var c = q.querySelector('.faq-content');
    if (!c) return;
    c.id = c.id || 'faq-resposta-' + (n + 1);
    q.setAttribute('aria-controls', c.id);
    function alterna() {
      var abrir = q.getAttribute('aria-expanded') !== 'true';
      if (abrir) perguntas.forEach(function (o) { if (o !== q) faqAbre(o, false); });
      faqAbre(q, abrir);
    }
    q.addEventListener('click', function (e) {
      // dentro da resposta aberta o clique é para ler/copiar, não para fechar
      if (c.contains(e.target) && q.getAttribute('aria-expanded') === 'true') return;
      alterna();
    });
    q.addEventListener('keydown', function (e) {
      if (e.target !== q) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alterna(); }
    });
  });

  /* ---------- 6a. título do hero, palavra por palavra ---------- */
  function partePalavras(el) {
    var i = 0, nos = [], tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) nos.push(n);
    nos.forEach(function (no) {
      var frag = document.createDocumentFragment();
      // só espaço comum separa palavra: o espaço fixo de "R$ 69/mês" mantém o preço inteiro
      no.textContent.split(/([ \t\n\r]+)/).forEach(function (p) {
        if (!p) return;
        if (/^[ \t\n\r]+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span');
        s.className = 'sp-palavra';
        s.style.setProperty('--p', i++);
        s.textContent = p;
        frag.appendChild(s);
      });
      no.parentNode.replaceChild(frag, no);
    });
  }
  var h1 = document.querySelector('.home-hero-heading');
  if (h1 && EFEITOS && !MENOS.matches) {
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    h1.classList.add('sp-partido');
    partePalavras(h1);
  }

  /* ---------- 6b. números de prova que contam ---------- */
  function conta(el, atraso) {
    var alvo = parseInt(el.getAttribute('data-num'), 10);
    var pre = el.getAttribute('data-pre') || '';
    if (!alvo || !EFEITOS || MENOS.matches) return;
    el.style.width = el.getBoundingClientRect().width + 'px'; // o texto em volta não anda
    el.textContent = pre + '0';
    var dur = alvo >= 50 ? 1300 : 800, t0 = 0;
    setTimeout(function () {
      requestAnimationFrame(function passo(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + Math.round(alvo * e);
        if (k < 1) requestAnimationFrame(passo); else el.style.width = '';
      });
    }, atraso || 0);
  }
  var numeros = toArr(document.querySelectorAll('.sp-num[data-num]'));
  if (numeros.length && 'IntersectionObserver' in window) {
    var ioNum = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        ioNum.unobserve(en.target);
        conta(en.target, en.target.closest('.section-home-hero') ? 380 : 120);
      });
    }, { threshold: 0.6 });
    numeros.forEach(function (n) { if (n.offsetParent !== null) ioNum.observe(n); });
  }

  /* ---------- 5. revelar ao entrar na tela ---------- */
  var SOLTOS = [
    '.info_video-heading', '.home-info_video-video_column > .info_video-lightbox-img', '.info_video-card',
    '.home-bento-content-heading > *', '.home-bento-card', '.home-bento-general_wrap > .g-btn',
    '.general-benefits-main_card', '.home-benefits-card',
    '.features_swiper-heading', '.general-features_swiper-swiper .slider-arrow-group',
    '.plans-card-first', '.plans-card-basic', '.plans-card-third',
    '.testimonials-heading', '.home-testimonials_swiper-main_wrap > .slider-arrow-group',
    '.home-cta-content-heading > *', '.home-cta-button_wrap > .g-btn',
    '.faq-heading', '.faq-card',
    '.footer-brand-wrap', '.footer-social-wrap', '.footer-pages-wrap'
  ];
  var CARROSSEIS = ['.general-features_swiper-wrapper', '.g-testimonials-wrapper'];
  function revela(el, atraso) {
    el.style.setProperty('--sp-atraso', atraso + 'ms');
    el.classList.add('visto');
    setTimeout(function () {
      el.removeAttribute('data-revelar');
      el.classList.remove('visto');
      el.style.removeProperty('--sp-atraso');
    }, atraso + 640);
  }
  if (EFEITOS && 'IntersectionObserver' in window) {
    var ioRev = new IntersectionObserver(function (ents) {
      var novos = [];
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        ioRev.unobserve(en.target);
        if (en.target.hasAttribute('data-carrossel')) {
          // o carrossel entra junto: os cartões à vista em cascata, os de fora já prontos
          var vw = window.innerWidth, k = 0;
          toArr(en.target.children).forEach(function (s) {
            var r = s.getBoundingClientRect();
            if (r.left < vw && r.right > 0) revela(s, Math.min(k++, 4) * 80); else revela(s, 0);
          });
        } else novos.push(en.target);
      });
      // escalonamento entre IRMÃOS: cada grupo de mesmo pai começa do zero, em ordem de leitura
      var grupos = new Map();
      novos.forEach(function (el) {
        var p = el.parentElement;
        if (!grupos.has(p)) grupos.set(p, []);
        grupos.get(p).push(el);
      });
      grupos.forEach(function (lista) {
        lista.sort(function (a, b) {
          var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          return (Math.round(ra.top / 8) - Math.round(rb.top / 8)) || (ra.left - rb.left);
        });
        lista.forEach(function (el, i) { revela(el, Math.min(i, 5) * 70); });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    SOLTOS.forEach(function (sel) {
      toArr(document.querySelectorAll(sel)).forEach(function (el) {
        if (el.hasAttribute('data-revelar')) return;
        el.setAttribute('data-revelar', '');
        ioRev.observe(el);
      });
    });
    CARROSSEIS.forEach(function (sel) {
      var w = document.querySelector(sel);
      if (!w) return;
      w.setAttribute('data-carrossel', '');
      toArr(w.children).forEach(function (s) { s.setAttribute('data-revelar', ''); });
      ioRev.observe(w);
    });
  }

  /* ---------- 7. cabeçalho ---------- */
  var gnav = document.querySelector('.g-nav');
  var ultimoY = window.scrollY, tic = false;
  function algoAberto() {
    return menuAberto || !!document.querySelector('.nav-layout .w-dropdown-toggle.w--open');
  }
  function atualizaNav() {
    var y = window.scrollY, d = y - ultimoY;
    gnav.classList.toggle('sp-rolou', y > 24);
    if (algoAberto() || y < 160) gnav.classList.remove('sp-escondido');
    else if (d > 8) gnav.classList.add('sp-escondido');
    else if (d < -8) gnav.classList.remove('sp-escondido');
    if (Math.abs(d) > 8) ultimoY = y;
  }
  if (gnav) {
    gnav.addEventListener('focusin', function () { gnav.classList.remove('sp-escondido'); });
    atualizaNav();
  }

  // item do menu acende conforme a seção que está no meio da tela
  var MAPA = [
    ['.section-blue-bento', '.nav-layout .nav-menu-dropdown:nth-of-type(2) .nav-menu-dropdown-toggle'],
    ['.section-general-features_swiper', '.nav-layout .nav-menu-dropdown:nth-of-type(1) .nav-menu-dropdown-toggle'],
    ['#planos', 'a[href="#planos"]']
  ];
  if ('IntersectionObserver' in window) {
    var ioMenu = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var par = MAPA.filter(function (m) { return en.target.matches(m[0]); })[0];
        if (!par) return;
        toArr(document.querySelectorAll(par[1])).forEach(function (a) {
          a.classList.toggle('sp-ativo', en.isIntersecting);
          if (a.tagName === 'A') { if (en.isIntersecting) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    MAPA.forEach(function (m) { var s = document.querySelector(m[0]); if (s) ioMenu.observe(s); });
  }

  /* ---------- 8. balão do WhatsApp ---------- */
  // No celular e no tablet o balão só aparece com a rolagem PARADA e num ponto em que não cobre texto,
  // botão, link nem foto; enquanto a página rola ele só pode sumir (nunca pisca aparecendo).
  var balao = document.querySelector('.g-chat-btn');
  var hero = document.querySelector('.section-home-hero');
  var CONTEUDO = 'p, h1, h2, h3, h4, li, a, button, [role="button"], input, label, img, .g-btn, .u-text-main, .u-text-large, .u-text-small, .co-barra';
  var conteudo = [], tParado = 0, balaoPronto = false;
  function listaConteudo() {
    conteudo = toArr(document.querySelectorAll(CONTEUDO)).filter(function (e) {
      return !balao.contains(e) && !e.closest('.g-chat, .g-nav') && !e.matches('.home-hero-bg, .home-bento-bg');
    });
  }
  function areaLivre() {
    // posição de repouso do balão (sem o deslocamento da animação), com 8px de folga
    var cs = getComputedStyle(balao), f = 8;
    var w = balao.offsetWidth, h = balao.offsetHeight;
    var x1 = window.innerWidth - parseFloat(cs.right) - w - f, y1 = window.innerHeight - parseFloat(cs.bottom) - h - f;
    var x2 = x1 + w + 2 * f, y2 = y1 + h + 2 * f;
    if (!conteudo.length) listaConteudo();
    for (var i = 0; i < conteudo.length; i++) {
      var r = conteudo[i].getBoundingClientRect();
      if (r.width && r.height && r.right > x1 && r.left < x2 && r.bottom > y1 && r.top < y2) return false;
    }
    var faixa = document.querySelector('.co-barra'); // faixa de cookies, injetada depois
    if (faixa && faixa.getBoundingClientRect().top < y2) return false;
    return true;
  }
  function mostraBalao(sim) { if (balao) balao.classList.toggle('sp-oculto', !sim); }
  function podeMostrar() {
    if (menuAberto) return false;
    if (!CELULAR.matches) return true;
    if (hero && hero.getBoundingClientRect().bottom > window.innerHeight - 40) return false;
    return areaLivre();
  }
  function atualizaBalao(rolando) {
    if (!balao || !balaoPronto) return;
    var visivel = !balao.classList.contains('sp-oculto');
    if (visivel) { if (!podeMostrar()) mostraBalao(false); }
    else if (!rolando && podeMostrar()) mostraBalao(true);
    clearTimeout(tParado);
    if (rolando) tParado = setTimeout(function () { atualizaBalao(false); }, 260);
  }
  if (balao && EFEITOS) {
    balao.classList.add('sp-oculto');
    setTimeout(function () { balaoPronto = true; listaConteudo(); atualizaBalao(false); }, 1400); // entra depois do hero
    if (CELULAR.addEventListener) CELULAR.addEventListener('change', function () { atualizaBalao(false); });
    window.addEventListener('resize', function () { listaConteudo(); atualizaBalao(true); });
  }

  /* ---------- rolagem: um quadro por vez para cabeçalho e balão ---------- */
  window.addEventListener('scroll', function () {
    if (tic) return;
    tic = true;
    requestAnimationFrame(function () {
      tic = false;
      if (gnav) atualizaNav();
      atualizaBalao(true);
    });
  }, { passive: true });
  // o balão também reage ao abrir/fechar o menu do celular e à faixa de cookies
  document.addEventListener('click', function () { setTimeout(function () { atualizaBalao(true); }, 420); });
})();

/* ---------- 5g. Todos os planos: a vitrine no pé da foto abre a janela dos 4 planos ---------- */
(function () {
  var dlg = document.getElementById('sp-planos');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var menos = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var origem = null;
  function abrir(plano, botao) {
    origem = botao || document.activeElement;
    if (!dlg.open) dlg.showModal();
    requestAnimationFrame(function () { dlg.classList.add('is-aberto'); });
    var alvo = dlg.querySelector('.sp-plano[data-plano="' + (plano || 'loja') + '"]');
    if (alvo) {
      alvo.focus({ preventScroll: true });
      // no celular a janela rola por dentro: o plano tocado aparece inteiro
      setTimeout(function () { alvo.scrollIntoView({ block: 'nearest', behavior: menos ? 'auto' : 'smooth' }); }, menos ? 0 : 120);
    }
  }
  function fechar() {
    dlg.classList.remove('is-aberto');
    setTimeout(function () { if (dlg.open) dlg.close(); }, menos ? 0 : 260);
  }
  document.querySelectorAll('[aria-controls="sp-planos"]').forEach(function (b) {
    b.addEventListener('click', function () { abrir(b.getAttribute('data-plano'), b); });
  });
  // clique fora da caixa (no fundo escurecido) ou no X fecha
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-fecha-planos]')) fechar();
  });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); fechar(); }); // Esc com a mesma saída suave
  dlg.addEventListener('close', function () {
    dlg.classList.remove('is-aberto');
    if (origem && origem.focus) origem.focus({ preventScroll: true });
  });
})();
