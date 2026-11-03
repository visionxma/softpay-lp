/* Comportamento do molde square-pdv (03/11/2026).
   Nos dois modos: as abas de modo (pílulas da Square: troca o texto e a cena do cartão escuro) e os dois carrosséis
   do computador (aparelhos e cartões), movidos por setas, um item por vez, como na referência.
   Só na página vestida: a faixa do plano tocado no celular, o "Ver mais perguntas (+N)" com N contado, a reserva do
   <details name> (abrir uma pergunta fecha a outra) e o revelar ao entrar. Sem dependência; respeita "menos
   movimento"; sem JS, todo o conteúdo continua à vista (abas empilhadas, passos e cartões em grade). */
(function () {
  var base = document.querySelector('.mx-square-pdv');
  if (!base) return;
  var raiz = base.querySelector('.mxq');
  if (!raiz) return;
  var vestida = base.classList.contains('page-molde');
  var computador = window.matchMedia ? matchMedia('(min-width: 64rem)') : { matches: true };

  /* ---------- abas de modo ---------- */
  raiz.querySelectorAll('.mxq-modos').forEach(function (sec) {
    var abas = [].slice.call(sec.querySelectorAll('[role="tab"]'));
    var paineis = [].slice.call(sec.querySelectorAll('[role="tabpanel"]'));
    var midias = [].slice.call(sec.querySelectorAll('.mxq-modos__midia'));
    if (!abas.length) return;
    function ir(i, foco) {
      i = (i + abas.length) % abas.length;
      abas.forEach(function (a, k) {
        var on = k === i;
        a.classList.toggle('is-ativa', on);
        a.setAttribute('aria-selected', on ? 'true' : 'false');
        a.tabIndex = on ? 0 : -1;
      });
      paineis.forEach(function (p, k) { p.classList.toggle('is-ativo', k === i); });
      midias.forEach(function (m) { m.classList.toggle('is-ativa', Number(m.getAttribute('data-modo')) === i); });
      if (foco) abas[i].focus();
    }
    abas.forEach(function (a, k) {
      a.addEventListener('click', function () { ir(k, false); });
      a.addEventListener('keydown', function (ev) {
        var alvo = { ArrowRight: k + 1, ArrowDown: k + 1, ArrowLeft: k - 1, ArrowUp: k - 1, Home: 0, End: abas.length - 1 }[ev.key];
        if (alvo === undefined) return;
        ev.preventDefault();
        ir(alvo, true);
      });
    });
    ir(0, false);
    sec.classList.add('is-pronto');
  });

  /* ---------- carrosséis (só se movem no computador; no celular e no tablet o CSS mostra tudo em grade) ---------- */
  function carrossel(sec, trilhoSel, itemSel) {
    var trilho = sec.querySelector(trilhoSel);
    var itens = trilho ? [].slice.call(trilho.querySelectorAll(itemSel)) : [];
    var setas = [].slice.call(sec.querySelectorAll('.mxq-seta'));
    if (itens.length < 2) { setas.forEach(function (s) { s.hidden = true; }); return; }
    var atual = 0;
    var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* na página vestida, no computador, o próprio trilho rola (overflow-x + encaixe): as setas rolam um item e o item
       ativo acompanha a rolagem, inclusive a do trackpad. Na origem (prova) segue o deslocamento por transform. */
    function rola() { return vestida && computador.matches; }
    function passo() {
      var a = itens[0].getBoundingClientRect(), b = itens[1].getBoundingClientRect();
      return b.left - a.left;
    }
    function pintar() {
      itens.forEach(function (it, k) { it.classList.toggle('is-ativo', k === atual); });
      if (rola()) {
        trilho.style.transform = '';
        var fim = trilho.scrollWidth - trilho.clientWidth - 1;
        setas.forEach(function (s) {
          var d = Number(s.getAttribute('data-dir'));
          s.disabled = (d < 0 && trilho.scrollLeft <= 1) || (d > 0 && trilho.scrollLeft >= fim);
        });
        return;
      }
      trilho.style.transform = computador.matches && atual ? 'translateX(' + (-atual * passo()) + 'px)' : '';
      setas.forEach(function (s) {
        var d = Number(s.getAttribute('data-dir'));
        s.disabled = (d < 0 && atual === 0) || (d > 0 && atual === itens.length - 1);
      });
    }
    setas.forEach(function (s) {
      s.addEventListener('click', function () {
        var d = Number(s.getAttribute('data-dir'));
        if (rola()) {
          trilho.scrollBy({ left: d * passo(), behavior: calmo ? 'auto' : 'smooth' });
          return;
        }
        atual = Math.max(0, Math.min(itens.length - 1, atual + d));
        pintar();
      });
    });
    var quadro = 0;
    trilho.addEventListener('scroll', function () {
      if (!rola() || quadro) return;
      quadro = requestAnimationFrame(function () {
        quadro = 0;
        var p = passo() || 1;
        atual = Math.max(0, Math.min(itens.length - 1, Math.round(trilho.scrollLeft / p)));
        if (trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 1) atual = itens.length - 1;
        pintar();
      });
    }, { passive: true });
    var t = null;
    addEventListener('resize', function () { clearTimeout(t); t = setTimeout(pintar, 120); }, { passive: true });
    if (computador.addEventListener) computador.addEventListener('change', pintar);
    pintar();
  }
  raiz.querySelectorAll('[data-mxq-carrossel]').forEach(function (s) { carrossel(s, '.mxq-carro__trilho', '.mxq-carro__item'); });
  raiz.querySelectorAll('[data-mxq-cartoes]').forEach(function (s) { carrossel(s, '.mxq-cartoes', '.mxq-cartao'); });

  if (!vestida) return;

  /* ---------- planos: no celular, o plano tocado abre a descrição numa faixa da largura toda ---------- */
  raiz.querySelectorAll('.mxq-planos').forEach(function (grade) {
    var faixa = grade.nextElementSibling;
    if (!faixa || !faixa.classList.contains('mxq-planos__faixa')) return;
    var planos = [].slice.call(grade.querySelectorAll('.mxq-plano'));
    var opcoes = [].slice.call(faixa.querySelectorAll('.mxq-planos__opcao'));
    var texto = faixa.querySelector('.mxq-planos__texto');
    function escolher(i) {
      planos.forEach(function (p, k) { p.classList.toggle('is-escolhido', k === i); });
      opcoes.forEach(function (o, k) {
        o.classList.toggle('is-ativo', k === i);
        o.setAttribute('aria-pressed', k === i ? 'true' : 'false');
      });
      var desc = planos[i] && planos[i].querySelector('.mxq-plano__desc');
      if (texto) texto.innerHTML = desc ? desc.innerHTML : '';
    }
    opcoes.forEach(function (o, k) { o.addEventListener('click', function () { escolher(k); }); });
    planos.forEach(function (p, k) {
      p.addEventListener('click', function (ev) { if (!ev.target.closest('a')) escolher(k); });
    });
    var inicial = Math.max(0, planos.findIndex(function (p) { return p.classList.contains('mxq-plano--destaque'); }));
    escolher(inicial);
    grade.classList.add('is-pronto');
  });

  /* ---------- FAQ: 5 à vista + "Ver mais perguntas (+N)", N contado; abrir uma fecha a outra ---------- */
  raiz.querySelectorAll('.mxq-s6').forEach(function (sec) {
    var lista = sec.querySelector('.mxq-faq');
    var botao = sec.querySelector('[data-mxq-faq-mais]');
    var itens = [].slice.call(sec.querySelectorAll('.mxq-faq__item'));
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
    if (!lista || !botao) return;
    var n = sec.querySelectorAll('.mxq-faq__extra').length;
    if (!n) { botao.parentNode.hidden = true; return; }
    function pintar(aberto) {
      lista.classList.toggle('is-recolhido', !aberto);
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.textContent = aberto ? 'Ver menos perguntas' : 'Ver mais perguntas (+' + n + ')';
    }
    botao.addEventListener('click', function () {
      var abrir = botao.getAttribute('aria-expanded') !== 'true';
      pintar(abrir);
      if (abrir) { var primeira = sec.querySelector('.mxq-faq__extra summary'); if (primeira) primeira.focus({ preventScroll: true }); }
    });
    pintar(false);
  });

  /* ---------- revelar ao entrar na tela, com escalonamento entre irmãos ---------- */
  var alvos = [].slice.call(raiz.querySelectorAll('.mxq-rv'));
  if (!alvos.length || !('IntersectionObserver' in window)) return;
  alvos.forEach(function (el) {
    var irmaos = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (x) { return x.classList.contains('mxq-rv'); }) : [];
    el.style.setProperty('--rv-i', String(Math.min(5, Math.max(0, irmaos.indexOf(el)))));
  });
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-visto');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  /* o que já está na tela ao abrir aparece sem esperar */
  var alturaTela = window.innerHeight || 800;
  alvos.forEach(function (el) {
    if (el.getBoundingClientRect().top < alturaTela * 0.92) el.classList.add('is-visto');
    else io.observe(el);
  });
  raiz.classList.add('js-ok');
})();
