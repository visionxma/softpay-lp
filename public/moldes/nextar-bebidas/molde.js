/* Comportamento do molde nextar-bebidas (03/11/2026).
   Só na página vestida (na prova a referência está parada, sem nada a mexer):
   - planos: os 3 preços ficam lado a lado e o plano tocado abre o "para quem é" numa faixa da largura toda, logo
     abaixo (sem JS, cada descrição fica no próprio cartão);
   - FAQ: 5 à vista + "Ver mais perguntas (+N)", N contado; abrir uma pergunta fecha a outra (reserva do <details name>);
   - depoimento: o botão troca a foto pelo vídeo do cliente e dá play;
   - revelar ao entrar na tela, com escalonamento entre irmãos.
   Sem dependência; respeita "menos movimento"; sem JS, todo o conteúdo continua à vista. */
(function () {
  var base = document.querySelector('.mx-nextar-bebidas');
  if (!base) return;
  var raiz = base.querySelector('.mxn');
  if (!raiz) return;
  if (!base.classList.contains('page-molde')) return;
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- planos: no celular, o plano tocado abre a descrição numa faixa da largura toda ---------- */
  raiz.querySelectorAll('.mxn-numeros').forEach(function (sec) {
    var planos = [].slice.call(sec.querySelectorAll('.mxn-numero'));
    var texto = sec.querySelector('.mxn-planos__texto');
    if (!planos.length || !texto) return;
    function escolher(i) {
      planos.forEach(function (p, k) { p.classList.toggle('is-escolhido', k === i); p.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      var desc = planos[i] && planos[i].querySelector('.mxn-numero__desc');
      texto.innerHTML = desc ? desc.innerHTML.replace(/<span class="mxn-sr">[^<]*<\/span>/, '') : '';
    }
    planos.forEach(function (p, k) {
      p.setAttribute('role', 'button');
      p.setAttribute('tabindex', '0');
      p.addEventListener('click', function (ev) { if (!ev.target.closest('a')) escolher(k); });
      p.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); escolher(k); } });
    });
    var inicial = Math.max(0, planos.findIndex(function (p) { return p.classList.contains('is-destaque'); }));
    escolher(inicial);
    sec.classList.add('is-pronto');
  });

  /* ---------- FAQ: 5 à vista + "Ver mais perguntas (+N)", N contado; abrir uma fecha a outra ---------- */
  raiz.querySelectorAll('.mxn-faq-sec').forEach(function (sec) {
    var lista = sec.querySelector('.mxn-faq');
    var botao = sec.querySelector('[data-mxn-faq-mais]');
    var itens = [].slice.call(sec.querySelectorAll('.mxn-faq__item'));
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
    if (!lista || !botao) return;
    var n = sec.querySelectorAll('.mxn-faq__extra').length;
    if (!n) { botao.parentNode.hidden = true; return; }
    function pintar(aberto) {
      lista.classList.toggle('is-recolhido', !aberto);
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.textContent = aberto ? 'Ver menos perguntas' : 'Ver mais perguntas (+' + n + ')';
    }
    botao.addEventListener('click', function () {
      var abrir = botao.getAttribute('aria-expanded') !== 'true';
      pintar(abrir);
      if (abrir) { var primeira = sec.querySelector('.mxn-faq__extra summary'); if (primeira) primeira.focus({ preventScroll: true }); }
    });
    pintar(false);
  });

  /* ---------- depoimento: o botão mostra o vídeo do cliente no lugar da foto ---------- */
  raiz.querySelectorAll('[data-mxn-video]').forEach(function (b) {
    var caixa = b.closest('.mxn-depo__caixa');
    var video = caixa && caixa.querySelector('.mxn-depo__video');
    if (!video) return;
    b.addEventListener('click', function () {
      video.hidden = false;
      caixa.classList.add('is-video');
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      video.focus({ preventScroll: true });
    });
  });

  /* ---------- revelar ao entrar na tela, com escalonamento entre irmãos ---------- */
  var alvos = [].slice.call(raiz.querySelectorAll('.mxn-rv'));
  if (!alvos.length || !('IntersectionObserver' in window)) return;
  alvos.forEach(function (el) {
    var irmaos = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (x) { return x.classList.contains('mxn-rv'); }) : [];
    el.style.setProperty('--rv-i', String(Math.min(5, Math.max(0, irmaos.indexOf(el)))));
  });
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-visto');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  var alturaTela = window.innerHeight || 800;
  alvos.forEach(function (el) {
    if (el.getBoundingClientRect().top < alturaTela * 0.92) el.classList.add('is-visto');
    else io.observe(el);
  });
  raiz.classList.add('js-ok');
})();
