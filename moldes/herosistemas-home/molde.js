/* Comportamento do molde herosistemas-home (03/11/2026).
   Só na página vestida (na prova a referência está parada, sem nada a mexer):
   - formulário: monta a mensagem do WhatsApp com nome, loja e WhatsApp digitados (nada é gravado; sem JS, o
     formulário abre o WhatsApp com a mensagem padrão);
   - planos: no celular os 3 cartões ficam lado a lado e a lista do plano tocado abre numa faixa da largura toda,
     logo abaixo (sem JS, cada lista fica no próprio cartão);
   - FAQ: 5 à vista + "Ver mais perguntas (+N)", N contado; abrir uma pergunta fecha a outra (reserva do <details name>);
   - vídeo: toca mudo só enquanto está à vista e para fora dela; com "menos movimento" fica na capa;
   - revelar ao entrar na tela, com escalonamento entre irmãos.
   Sem dependência; respeita "menos movimento"; sem JS, todo o conteúdo continua à vista. */
(function () {
  var base = document.querySelector('.mx-herosistemas-home');
  if (!base) return;
  var raiz = base.querySelector('.mxh');
  if (!raiz) return;
  if (!base.classList.contains('page-molde')) return;
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- formulário → mensagem do WhatsApp ---------- */
  raiz.querySelectorAll('[data-mxh-form]').forEach(function (f) {
    var texto = f.querySelector('input[name="text"]');
    if (!texto) return;
    var padrao = texto.value;
    f.addEventListener('submit', function () {
      var v = function (i) { var c = f.querySelector('[data-campo="' + i + '"]'); return c ? c.value.trim() : ''; };
      var nome = v(0), loja = v(1), zap = v(2);
      var linhas = ['Olá! Quero ver como o SoftPay funciona na minha loja.'];
      if (nome) linhas.push('Nome: ' + nome);
      if (loja) linhas.push('Loja: ' + loja);
      if (zap) linhas.push('WhatsApp: ' + zap);
      texto.value = linhas.length > 1 ? linhas.join('\n') : padrao;
    });
  });

  /* ---------- planos: no celular, o plano tocado abre a lista numa faixa da largura toda ---------- */
  raiz.querySelectorAll('.mxh-planos').forEach(function (sec) {
    var planos = [].slice.call(sec.querySelectorAll('.mxh-plano'));
    var nome = sec.querySelector('.mxh-planos__faixa-nome');
    var lista = sec.querySelector('.mxh-planos__faixa-lista');
    if (!planos.length || !lista) return;
    function escolher(i) {
      planos.forEach(function (p, k) { p.classList.toggle('is-escolhido', k === i); p.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      var p = planos[i];
      var n = p && p.querySelector('.mxh-plano__nome');
      var d = p && p.querySelector('.mxh-plano__desc');
      var l = p && p.querySelector('.mxh-plano__lista');
      var limpa = function (el) { return el ? el.innerHTML.replace(/<span class="mxh-sr">[^<]*<\/span>/, '') : ''; };
      if (nome) nome.innerHTML = '<strong>' + limpa(n) + '</strong> · ' + limpa(d);
      lista.innerHTML = l ? l.innerHTML : '';
    }
    planos.forEach(function (p, k) {
      p.setAttribute('role', 'button');
      p.setAttribute('tabindex', '0');
      p.addEventListener('click', function (ev) { if (!ev.target.closest('a')) escolher(k); });
      p.addEventListener('keydown', function (ev) { if (ev.target !== p) return; if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); escolher(k); } });
    });
    var inicial = Math.max(0, planos.findIndex(function (p) { return p.classList.contains('is-destaque'); }));
    escolher(inicial);
    sec.classList.add('is-pronto');
  });

  /* ---------- FAQ: 5 à vista + "Ver mais perguntas (+N)", N contado; abrir uma fecha a outra ---------- */
  raiz.querySelectorAll('.mxh-faq').forEach(function (sec) {
    var lista = sec.querySelector('.mxh-faq__lista');
    var botao = sec.querySelector('[data-mxh-faq-mais]');
    var itens = [].slice.call(sec.querySelectorAll('.mxh-faq__item'));
    itens.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
    if (!lista || !botao) return;
    var n = sec.querySelectorAll('.mxh-faq__extra').length;
    if (!n) { botao.parentNode.hidden = true; return; }
    function pintar(aberto) {
      lista.classList.toggle('is-recolhido', !aberto);
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.textContent = aberto ? 'Ver menos perguntas' : 'Ver mais perguntas (+' + n + ')';
    }
    botao.addEventListener('click', function () {
      var abrir = botao.getAttribute('aria-expanded') !== 'true';
      pintar(abrir);
      if (abrir) { var primeira = sec.querySelector('.mxh-faq__extra summary'); if (primeira) primeira.focus({ preventScroll: true }); }
    });
    pintar(false);
  });

  /* ---------- vídeo: toca só enquanto está à vista ---------- */
  var videos = [].slice.call(raiz.querySelectorAll('[data-mxh-video]'));
  if (videos.length && !calmo && 'IntersectionObserver' in window) {
    var iov = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (v.preload === 'none') v.preload = 'auto';
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) v.pause();
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { v.muted = true; iov.observe(v); });
  }

  /* ---------- revelar ao entrar na tela, com escalonamento entre irmãos ---------- */
  var alvos = [].slice.call(raiz.querySelectorAll('.mxh-rv'));
  if (!alvos.length || !('IntersectionObserver' in window)) return;
  alvos.forEach(function (el) {
    var irmaos = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (x) { return x.classList.contains('mxh-rv'); }) : [];
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
