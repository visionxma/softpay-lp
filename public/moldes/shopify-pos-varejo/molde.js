/* Molde shopify-pos-varejo — comportamento da rota /segmentos/loja-de-roupas/.
   Sem dependência. Conteúdo nunca depende deste arquivo: o CSS só esconde o que anima depois de .js-ok.
   - revelar ao entrar na tela, com escalonamento de 60 ms entre irmãos (IntersectionObserver, nunca scroll);
   - abas (fileira e verticais): acendem no toque, no foco e ao passar o mouse; a fileira gira sozinha a cada
     5 s enquanto está à vista, só sem "menos movimento", e para quando a pessoa mexe;
   - perguntas frequentes: "Ver mais perguntas (+N)" com N CONTADO no que está escondido (recalcula no resize,
     porque em duas colunas a 6ª entra à vista) e "abrir uma fecha a outra" de reserva para quem não tem name. */
(function () {
  var raiz = document.querySelector('.mx-shopify-pos-varejo');
  if (!raiz) return;
  raiz.classList.add('js-ok');
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- revelar ---------- */
  var anima = raiz.querySelectorAll('[data-sh-anima]');
  if (!('IntersectionObserver' in window)) {
    anima.forEach(function (el) { el.classList.add('is-visto'); });
  } else {
    anima.forEach(function (el) {
      var irmaos = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (x) { return x.hasAttribute('data-sh-anima'); }) : [];
      var i = irmaos.indexOf(el);
      if (i > 0) el.style.setProperty('--sh-d', Math.min(i, 6) * 60 + 'ms');
    });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visto'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    anima.forEach(function (el) { io.observe(el); });
  }

  /* ---------- abas ---------- */
  raiz.querySelectorAll('[data-sh-abas]').forEach(function (grupo) {
    var abas = Array.prototype.slice.call(grupo.querySelectorAll('[data-sh-aba]'));
    if (abas.length < 2) return;
    var mexeu = false;
    function acende(alvo) {
      abas.forEach(function (a) {
        var on = a === alvo;
        a.classList.toggle('is-ativa', on);
        var t = a.querySelector('.sh-aba-titulo');
        if (t) t.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    }
    abas.forEach(function (a) {
      var gatilho = a.querySelector('.sh-aba-titulo') || a;
      gatilho.setAttribute('tabindex', '0');
      gatilho.setAttribute('role', 'button');
      function vai() { mexeu = true; acende(a); }
      gatilho.addEventListener('click', vai);
      gatilho.addEventListener('focus', vai);
      gatilho.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); vai(); }
      });
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) a.addEventListener('mouseenter', vai);
    });
    acende(abas.filter(function (a) { return a.classList.contains('is-ativa'); })[0] || abas[0]);

    /* só a fileira (ul) gira sozinha */
    if (calmo || grupo.tagName !== 'UL' || !('IntersectionObserver' in window)) return;
    var visivel = false, relogio = null;
    new IntersectionObserver(function (ents) { visivel = ents[0].isIntersecting; }, { threshold: 0.4 }).observe(grupo);
    relogio = setInterval(function () {
      if (mexeu) { clearInterval(relogio); return; }
      if (!visivel || document.hidden) return;
      var i = abas.findIndex(function (a) { return a.classList.contains('is-ativa'); });
      acende(abas[(i + 1) % abas.length]);
    }, 5000);
  });

  /* ---------- perguntas frequentes ---------- */
  var faq = raiz.querySelector('.sh-faq');
  var botao = raiz.querySelector('[data-sh-faq-mais]');
  var itens = faq ? Array.prototype.slice.call(faq.querySelectorAll('.sh-faq-item')) : [];
  function conta() {
    if (!botao) return;
    var escondidas = itens.filter(function (d) { return getComputedStyle(d).display === 'none'; }).length;
    var n = botao.querySelector('[data-sh-faq-n]');
    if (n) n.textContent = String(escondidas);
    botao.parentElement.hidden = escondidas === 0;
  }
  if (botao) {
    botao.addEventListener('click', function () {
      faq.classList.add('is-tudo');
      conta();
      var prox = itens.filter(function (d) { return d.hasAttribute('data-sh-extra'); })[0];
      var s = prox && prox.querySelector('summary');
      if (s) s.focus({ preventScroll: true });
    });
    conta();
    var t = null;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(conta, 150); });
  }
  /* reserva para navegador sem <details name>: abrir uma fecha as outras */
  var temName = 'name' in document.createElement('details');
  if (!temName) {
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }
})();
