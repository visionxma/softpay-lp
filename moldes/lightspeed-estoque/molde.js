/* Comportamento do molde lightspeed-estoque (03/11/2026).
   Só age na página VESTIDA (.mx-lightspeed-estoque.mx-vestido); na prova (modo origem) não faz nada, porque a página
   de estoque da Lightspeed só tem o acordeão nativo do <details> e o swiper, que a prova congela como na captura.
   O que faz: marca a raiz com .lv-js (o CSS só esconde o que depende do script depois disso), revela os blocos ao
   entrar na tela com 60 ms de escalonamento entre irmãos, troca o texto do plano tocado no celular, o "Ver mais (+N)"
   dos cartões do celular e o "Ver mais perguntas (+N)" com N contado, as setas do trilho do carrossel, a mensagem do
   formulário montada com o que a pessoa digitou (vai SÓ no texto do WhatsApp, nada é gravado), e a reserva do
   <details name> (abrir uma pergunta fecha a outra) para navegador que ainda não tem o atributo.
   Sem dependência; respeita "menos movimento"; sem JS, todo o conteúdo continua à vista e o formulário abre o
   WhatsApp com a mensagem padrão. */
(function () {
  var raiz = document.querySelector('.mx-lightspeed-estoque.mx-vestido');
  if (!raiz) return;
  raiz.classList.add('lv-js');
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- revelar ao entrar na tela ---------- */
  var alvos = [].slice.call(raiz.querySelectorAll('[data-lv-anima]'));
  var pais = new Map();
  alvos.forEach(function (el) {
    var p = el.parentElement;
    var n = pais.get(p) || 0;
    el.style.setProperty('--lv-atraso', Math.min(n, 5) * 60 + 'ms');
    pais.set(p, n + 1);
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (vistos) {
      vistos.forEach(function (v) {
        if (!v.isIntersecting) return;
        v.target.classList.add('lv-visto');
        io.unobserve(v.target);
      });
    // A área observada vai da linha de 92% da tela até muito acima do topo: o que a rolagem pulou num salto só
    // (âncora, rolagem rápida, quadro atrasado) também cruza a fronteira e é revelado, nunca fica apagado para trás.
    }, { rootMargin: '100000px 0px -8% 0px', threshold: 0 });
    alvos.forEach(function (el) {
      // caixa em display:contents (o cartão de plano no celular) não tem retângulo para observar: já nasce revelada
      if (getComputedStyle(el).display === 'contents') el.classList.add('lv-visto');
      else io.observe(el);
    });
  } else {
    alvos.forEach(function (el) { el.classList.add('lv-visto'); });
  }

  /* ---------- planos: o cartão tocado abre o texto dele ---------- */
  var planos = [].slice.call(raiz.querySelectorAll('.lv-plano'));
  if (planos.length) {
    var ativar = function (alvo) {
      planos.forEach(function (pl) {
        var liga = pl === alvo;
        pl.classList.toggle('lv-ativo', liga);
        var topo = pl.querySelector('.lv-plano-topo');
        if (topo) topo.setAttribute('aria-pressed', liga ? 'true' : 'false');
      });
    };
    planos.forEach(function (pl) {
      var topo = pl.querySelector('.lv-plano-topo');
      if (!topo) return;
      topo.setAttribute('role', 'button');
      topo.setAttribute('tabindex', '0');
      topo.addEventListener('click', function () { ativar(pl); });
      topo.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ativar(pl); }
      });
    });
    ativar(raiz.querySelector('.lv-plano--destaque') || planos[0]);
  }

  /* ---------- cartões do "como resolve": no celular, 4 à vista e "Ver mais (+N)" ---------- */
  var resolve = raiz.querySelector('.lv-resolve');
  if (resolve) {
    var guardados = resolve.querySelectorAll('.lv-extra-celular');
    var verMais = resolve.querySelector('[data-lv-ver-mais]');
    if (verMais && guardados.length) {
      var rotuloR = function () {
        var aberto = resolve.classList.contains('lv-mais-aberto');
        verMais.textContent = aberto ? 'Ver menos' : 'Ver mais (+' + guardados.length + ')';
        verMais.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      };
      verMais.hidden = false;
      rotuloR();
      verMais.addEventListener('click', function () {
        resolve.classList.toggle('lv-mais-aberto');
        rotuloR();
        if (resolve.classList.contains('lv-mais-aberto')) {
          var t = guardados[0].querySelector('h3');
          if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
        }
      });
    }
  }

  /* ---------- carrossel: as setas rolam o trilho um cartão por vez ---------- */
  var trilho = raiz.querySelector('.lv-trilho');
  if (trilho) {
    var volta = raiz.querySelector('[data-lv-volta]');
    var segue = raiz.querySelector('[data-lv-segue]');
    var passo = function () {
      var li = trilho.querySelector('.lv-slide');
      if (!li) return trilho.clientWidth;
      var gap = parseFloat(getComputedStyle(trilho).columnGap) || 0;
      return li.getBoundingClientRect().width + gap;
    };
    var marcar = function () {
      var max = trilho.scrollWidth - trilho.clientWidth - 2;
      if (volta) volta.disabled = trilho.scrollLeft <= 2;
      if (segue) segue.disabled = trilho.scrollLeft >= max;
    };
    var rolar = function (dir) { trilho.scrollBy({ left: dir * passo(), behavior: calmo ? 'auto' : 'smooth' }); };
    if (volta) volta.addEventListener('click', function () { rolar(-1); });
    if (segue) segue.addEventListener('click', function () { rolar(1); });
    var quadro = 0;
    trilho.addEventListener('scroll', function () {
      if (quadro) return;
      quadro = requestAnimationFrame(function () { quadro = 0; marcar(); });
    }, { passive: true });
    window.addEventListener('resize', marcar, { passive: true });
    marcar();
  }

  /* ---------- formulário: a mensagem do WhatsApp leva o que a pessoa digitou ---------- */
  var form = raiz.querySelector('[data-lv-form]');
  if (form) {
    form.addEventListener('submit', function () {
      var valor = function (id) {
        var c = form.querySelector('[data-lv-campo="' + id + '"]');
        return c ? String(c.value || '').trim() : '';
      };
      var linhas = ['Olá! Quero ver como o controle de estoque do SoftPay funciona na minha loja.'];
      if (valor('nome')) linhas.push('Nome: ' + valor('nome'));
      if (valor('loja')) linhas.push('Loja: ' + valor('loja'));
      if (valor('zap')) linhas.push('WhatsApp: ' + valor('zap'));
      if (valor('tipo')) linhas.push('Tipo de loja: ' + valor('tipo'));
      var texto = form.querySelector('input[name="text"]');
      if (texto) texto.value = linhas.join('\n');
    });
  }

  /* ---------- perguntas: "ver mais" contado e uma aberta por vez ---------- */
  var faq = raiz.querySelector('.lv-faq');
  if (faq) {
    var extras = faq.querySelectorAll('.lv-faq-extra');
    var botao = faq.querySelector('[data-lv-faq-mais]');
    if (botao && extras.length) {
      var rotulo = function () {
        var aberto = faq.classList.contains('lv-faq-aberto');
        botao.textContent = aberto ? 'Ver menos perguntas' : 'Ver mais perguntas (+' + extras.length + ')';
        botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      };
      botao.hidden = false;
      rotulo();
      botao.addEventListener('click', function () {
        faq.classList.toggle('lv-faq-aberto');
        rotulo();
        if (faq.classList.contains('lv-faq-aberto')) {
          var s = extras[0].querySelector('summary');
          if (s) s.focus({ preventScroll: true });
        }
      });
    }
    var itens = [].slice.call(faq.querySelectorAll('details'));
    if (!('name' in HTMLDetailsElement.prototype)) {
      itens.forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (!d.open) return;
          itens.forEach(function (o) { if (o !== d && o.open) o.open = false; });
        });
      });
    }
  }
})();
