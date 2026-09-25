/* SoftPay — o que o JavaScript do Webflow/Swiper fazia na página de referência,
 * reescrito do zero, sem biblioteca:
 *  1. menu do computador: submenus abrem ao passar o mouse (e no clique/teclado);
 *  2. menu do celular: o hambúrguer abre o painel descendo, e os submenus abrem no toque;
 *  3. carrosséis (recursos e depoimentos): setas, arrastar com o dedo ou o mouse,
 *     passo de um cartão, parando quando o último encosta na borda — como o Swiper;
 *  4. perguntas frequentes: abre e fecha cada uma, o "+" gira para "×" (várias
 *     podem ficar abertas, como na referência).
 * Sem o script a página continua inteira: nada nasce escondido esperando JS. */
(function () {
  'use strict';

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
  document.querySelectorAll('.w-dropdown').forEach(function (dd) {
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
    document.querySelectorAll('.nav-layout .w-dropdown').forEach(function (dd) {
      if (!dd.contains(e.target)) abreDropdown(dd, false);
    });
  });

  /* ---------- 2. menu do celular ---------- */
  var navMob = document.querySelector('.nav-mobile-layout');
  if (navMob) {
    var botao = navMob.querySelector('.w-nav-button');
    var menu = navMob.querySelector('.w-nav-menu');
    var capa = navMob.querySelector('.w-nav-overlay');
    var casa = menu && menu.parentNode;
    var depois = menu && menu.nextSibling;
    var aberto = false;
    var DUR = 400;
    var abreMenu = function (abrir) {
      if (!botao || !menu || !capa || abrir === aberto) return;
      aberto = abrir;
      botao.classList.toggle('w--open', abrir);
      botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      if (abrir) {
        capa.appendChild(menu);
        menu.setAttribute('data-nav-menu-open', '');
        capa.style.display = 'block';
        capa.style.height = window.innerHeight + 'px';
        var h = menu.offsetHeight;
        menu.style.transition = 'none';
        menu.style.transform = 'translateY(-' + h + 'px)';
        void menu.offsetHeight;
        menu.style.transition = 'transform ' + DUR + 'ms ease-out';
        menu.style.transform = 'translateY(0px)';
      } else {
        menu.style.transition = 'transform ' + DUR + 'ms ease-out';
        menu.style.transform = 'translateY(-' + menu.offsetHeight + 'px)';
        setTimeout(function () {
          if (aberto) return;
          menu.removeAttribute('data-nav-menu-open');
          menu.style.transition = '';
          menu.style.transform = '';
          capa.style.display = '';
          capa.style.height = '';
          casa.insertBefore(menu, depois);
        }, DUR);
      }
    };
    if (botao) {
      botao.addEventListener('click', function () { abreMenu(!aberto); });
      botao.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abreMenu(!aberto); }
      });
    }
    if (capa) capa.addEventListener('click', function (e) { if (e.target === capa) abreMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abreMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 991) abreMenu(false); });
  }

  /* ---------- 3. carrosséis ---------- */
  function carrossel(raiz, envoltorio, anterior, proximo) {
    if (!raiz || !envoltorio) return;
    var slides = Array.prototype.slice.call(envoltorio.children);
    if (!slides.length) return;
    var pos = 0;       // deslocamento atual em px (positivo = andou para a esquerda)
    var passo = 0, max = 0;

    function medir() {
      var cs = getComputedStyle(raiz);
      var util = raiz.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var total = 0;
      slides.forEach(function (s, i) {
        var m = parseFloat(getComputedStyle(s).marginRight) || 0;
        total += s.getBoundingClientRect().width + (i < slides.length - 1 ? m : 0);
      });
      var m0 = parseFloat(getComputedStyle(slides[0]).marginRight) || 0;
      passo = slides[0].getBoundingClientRect().width + m0;
      max = Math.max(0, Math.round(total - util));
    }
    function aplica(animar) {
      envoltorio.classList.toggle('is-arrastando', !animar);
      envoltorio.style.transform = 'translate3d(' + (-pos) + 'px, 0px, 0px)';
      var noInicio = pos <= 0, noFim = pos >= max;
      [[anterior, noInicio], [proximo, noFim]].forEach(function (par) {
        if (!par[0]) return;
        par[0].classList.toggle('swiper-button-disabled', par[1]);
        par[0].setAttribute('aria-disabled', par[1] ? 'true' : 'false');
      });
      var ativo = Math.min(slides.length - 1, Math.round(pos / (passo || 1)));
      slides.forEach(function (s, i) {
        s.classList.toggle('swiper-slide-active', i === ativo);
        s.classList.toggle('swiper-slide-next', i === ativo + 1);
      });
    }
    function vaiPara(i) {
      medir();
      pos = Math.max(0, Math.min(max, Math.round(i) * passo));
      if (pos > max - 1) pos = max;
      aplica(true);
    }
    function indice() { return passo ? Math.round(pos / passo) : 0; }

    if (anterior) anterior.addEventListener('click', function () {
      medir(); vaiPara(pos >= max && max % passo ? Math.floor(max / passo) : indice() - 1);
    });
    if (proximo) proximo.addEventListener('click', function () { medir(); vaiPara(indice() + 1); });
    [anterior, proximo].forEach(function (b) {
      if (b) b.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
      });
    });

    // arrastar (dedo ou mouse); o eixo vertical continua rolando a página
    var x0 = 0, y0 = 0, pos0 = 0, arrastando = false, decidiu = false, moveu = false;
    envoltorio.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      medir();
      x0 = e.clientX; y0 = e.clientY; pos0 = pos;
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
      var i = pos0 / (passo || 1);
      if (Math.abs(andou) > 40) i = andou > 0 ? Math.floor(i) + 1 : Math.ceil(i) - 1;
      else i = Math.round(i);
      vaiPara(i);
    }
    window.addEventListener('pointerup', solta);
    window.addEventListener('pointercancel', solta);
    envoltorio.addEventListener('click', function (e) { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
    envoltorio.addEventListener('dragstart', function (e) { e.preventDefault(); });
    window.addEventListener('resize', function () { vaiPara(indice()); });
    medir(); aplica(true);
  }
  var rec = document.querySelector('.general-features_swiper-swiper');
  if (rec) carrossel(rec, rec.querySelector('.swiper-wrapper'),
    rec.querySelector('.swiper-button-prev'), rec.querySelector('.swiper-button-next'));
  var dep = document.querySelector('.g-testimonials_swiper-swiper');
  if (dep) carrossel(dep, dep.querySelector('.swiper-wrapper'),
    document.querySelector('.testimonials-prev'), document.querySelector('.testimonials-next'));

  /* ---------- 4. perguntas frequentes ---------- */
  document.querySelectorAll('.faq-question-wrap').forEach(function (q) {
    var c = q.querySelector('.faq-content');
    if (!c) return;
    function alterna() {
      var abrir = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      var h = c.scrollHeight;
      if (abrir) {
        c.style.height = h + 'px';
        var fim = function (e) {
          if (e.propertyName !== 'height') return;
          c.removeEventListener('transitionend', fim);
          if (q.getAttribute('aria-expanded') === 'true') c.style.height = 'auto';
        };
        c.addEventListener('transitionend', fim);
      } else {
        c.style.height = c.offsetHeight + 'px';
        void c.offsetHeight;
        c.style.height = '0px';
      }
    }
    q.addEventListener('click', alterna);
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alterna(); }
    });
  });
})();
