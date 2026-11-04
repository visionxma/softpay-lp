/* Molde stripe-cobranca — comportamento da rota /solucoes/controle-de-fiado/.
   Sem dependência. Conteúdo nunca depende deste arquivo: o CSS só esconde o que anima depois de .js-ok.
   - revelar ao entrar na tela, com escalonamento de 60 ms entre irmãos (IntersectionObserver, nunca scroll);
   - perguntas frequentes: 5 à vista em uma coluna, 6 em duas; "Ver mais perguntas (+N)" com N CONTADO no que
     está escondido (recalcula no resize) e "abrir uma fecha a outra" de reserva para quem não tem name. */
(function () {
  var raiz = document.querySelector('.mx-stripe-cobranca');
  if (!raiz) return;
  raiz.classList.add('js-ok');

  /* ---------- revelar ---------- */
  var anima = raiz.querySelectorAll('[data-sc-anima]');
  if (!('IntersectionObserver' in window)) {
    anima.forEach(function (el) { el.classList.add('is-visto'); });
  } else {
    anima.forEach(function (el) {
      var irmaos = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (x) { return x.hasAttribute('data-sc-anima'); }) : [];
      var i = irmaos.indexOf(el);
      if (i > 0) el.style.setProperty('--sc-atraso', Math.min(i, 6) * 60 + 'ms');
    });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visto'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    anima.forEach(function (el) { io.observe(el); });
  }

  /* ---------- perguntas ---------- */
  var sec = raiz.querySelector('.sc-faq');
  if (!sec) return;
  var itens = Array.prototype.slice.call(sec.querySelectorAll('.sc-faq-item'));
  var botao = sec.querySelector('[data-sc-faq-mais]');
  var aberta = false;
  function contar() {
    var duas = window.matchMedia('(min-width: 48rem)').matches;
    var vista = duas ? 6 : 5;
    itens.forEach(function (it, i) { if (i >= vista) it.setAttribute('data-sc-faq-oculta', ''); else it.removeAttribute('data-sc-faq-oculta'); });
    var n = sec.querySelectorAll('[data-sc-faq-oculta]').length;
    if (!botao) return;
    if (aberta || n === 0) { botao.hidden = true; sec.classList.remove('sc-faq--fechada'); return; }
    sec.classList.add('sc-faq--fechada');
    botao.hidden = false;
    botao.textContent = 'Ver mais perguntas (+' + n + ')';
  }
  if (botao) botao.addEventListener('click', function () { aberta = true; contar(); });
  window.addEventListener('resize', contar, { passive: true });
  contar();
  itens.forEach(function (it) {
    it.addEventListener('toggle', function () {
      if (!it.open) return;
      itens.forEach(function (o) { if (o !== it && o.open) o.open = false; });
    });
  });
})();
