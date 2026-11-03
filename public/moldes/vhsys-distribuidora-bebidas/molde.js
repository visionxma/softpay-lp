/* Comportamento do molde vhsys-distribuidora-bebidas (03/11/2026).
   Só na página vestida (na prova a referência está parada, sem nada a mexer):
   - abas de "o que muda com o SoftPay": a aba tocada acende os ladrilhos do assunto e apaga um pouco os outros;
     nenhum ladrilho some (todo o texto continua à vista para a busca e para quem lê);
   - planos: os 3 cartões ficam lado a lado e o plano tocado abre o "para a distribuidora" numa faixa da largura toda,
     logo abaixo (sem JS, cada descrição fica no próprio cartão);
   - FAQ: 5 à vista + "Ver mais perguntas (+N)", N contado; abrir uma pergunta fecha a outra (reserva do <details name>);
   - revelar ao entrar na tela, com escalonamento entre irmãos.
   Sem dependência; respeita "menos movimento"; sem JS, todo o conteúdo continua à vista. */
(function () {
  var base = document.querySelector('.mx-vhsys-distribuidora-bebidas');
  if (!base) return;
  var raiz = base.querySelector('.mxv');
  if (!raiz) return;
  if (!base.classList.contains('page-molde')) return;

  /* ---------- abas: acendem os ladrilhos do assunto ---------- */
  raiz.querySelectorAll('.mxv-recursos__cartao').forEach(function (cartao) {
    var abas = [].slice.call(cartao.querySelectorAll('[data-mxv-aba]'));
    var lista = cartao.querySelector('.mxv-ladrilhos');
    var itens = [].slice.call(cartao.querySelectorAll('.mxv-ladrilho'));
    if (!abas.length || !lista) return;
    function escolher(aba) {
      var cat = aba.getAttribute('data-mxv-aba');
      abas.forEach(function (a) { var on = a === aba; a.classList.toggle('is-ativa', on); a.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      lista.classList.toggle('is-filtrado', !!cat);
      itens.forEach(function (li) {
        var cats = (li.getAttribute('data-mxv-cat') || '').split(/\s+/);
        li.classList.toggle('is-aceso', !!cat && cats.indexOf(cat) >= 0);
      });
    }
    abas.forEach(function (a) { a.addEventListener('click', function () { escolher(a); }); });
  });

  /* ---------- planos: o plano tocado abre a descrição numa faixa da largura toda ---------- */
  raiz.querySelectorAll('.mxv-planos').forEach(function (sec) {
    var planos = [].slice.call(sec.querySelectorAll('.mxv-plano'));
    var texto = sec.querySelector('.mxv-planos__texto');
    if (!planos.length || !texto) return;
    function escolher(i) {
      planos.forEach(function (p, k) { p.classList.toggle('is-escolhido', k === i); p.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      var desc = planos[i] && planos[i].querySelector('.mxv-plano__desc');
      var nome = planos[i] && planos[i].querySelector('.mxv-plano__nome');
      var limpo = function (el) { return el ? el.innerHTML.replace(/<span class="mxv-sr">[^<]*<\/span>/, '') : ''; };
      texto.innerHTML = (nome ? '<strong class="mxv-planos__qual">' + limpo(nome) + '</strong> ' : '') + limpo(desc);
    }
    planos.forEach(function (p, k) {
      p.setAttribute('role', 'button');
      p.setAttribute('tabindex', '0');
      p.addEventListener('click', function (ev) { if (!ev.target.closest('a')) escolher(k); });
      p.addEventListener('keydown', function (ev) {
        if (ev.target !== p) return;
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); escolher(k); }
      });
    });
    var inicial = Math.max(0, planos.findIndex(function (p) { return p.classList.contains('is-destaque'); }));
    escolher(inicial);
    sec.classList.add('is-pronto');
  });

  /* ---------- FAQ: 5 à vista + "Ver mais perguntas (+N)", N contado; abrir uma fecha a outra ---------- */
  raiz.querySelectorAll('.mxv-faq-sec').forEach(function (sec) {
    var lista = sec.querySelector('.mxv-faq');
    var botao = sec.querySelector('[data-mxv-faq-mais]');
    var itens = [].slice.call(sec.querySelectorAll('.mxv-faq__item'));
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
    if (!lista || !botao) return;
    var n = sec.querySelectorAll('.mxv-faq__extra').length;
    if (!n) { botao.parentNode.hidden = true; return; }
    function pintar(aberto) {
      lista.classList.toggle('is-recolhido', !aberto);
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.textContent = aberto ? 'Ver menos perguntas' : 'Ver mais perguntas (+' + n + ')';
    }
    botao.addEventListener('click', function () {
      var abrir = botao.getAttribute('aria-expanded') !== 'true';
      pintar(abrir);
      if (abrir) { var primeira = sec.querySelector('.mxv-faq__extra summary'); if (primeira) primeira.focus({ preventScroll: true }); }
    });
    pintar(false);
  });

  /* ---------- revelar ao entrar na tela, com escalonamento entre irmãos ---------- */
  var alvos = [].slice.call(raiz.querySelectorAll('.mxv-rv'));
  if (!alvos.length || !('IntersectionObserver' in window)) return;
  alvos.forEach(function (el) {
    var irmaos = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (x) { return x.classList.contains('mxv-rv'); }) : [];
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
