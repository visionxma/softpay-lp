/* Comportamento do molde lightspeed-varejo (03/11/2026).
   Só age na página VESTIDA (.mx-lightspeed-varejo.mx-vestido); na prova (modo origem) não faz nada, porque a Retail
   POS da Lightspeed não anima nada além do acordeão nativo do <details>.
   O que faz: marca a raiz com .lv-js (o CSS só esconde o que depende do script depois disso), revela os blocos ao
   entrar na tela com 60 ms de escalonamento entre irmãos, troca o texto do plano tocado no celular (os três cartões
   ficam lado a lado e o texto abre numa faixa larga), o "Ver mais perguntas (+N)" com N contado, e a reserva do
   <details name> (abrir uma pergunta fecha a outra) para navegador que ainda não tem o atributo.
   Sem dependência; respeita "menos movimento"; sem JS, todo o conteúdo continua à vista. */
(function () {
  var raiz = document.querySelector('.mx-lightspeed-varejo.mx-vestido');
  if (!raiz) return;
  raiz.classList.add('lv-js');

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
