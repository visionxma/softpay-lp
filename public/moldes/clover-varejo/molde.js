// Comportamento do molde clover-varejo (o da Clover, refeito sem dependência):
//  - FAQ: abrir uma pergunta fecha a outra (<details name> + reserva para navegador sem `name`);
//    5 à vista e UM "Ver mais perguntas (+N)", com N contado na hora;
//  - revelar ao entrar (FadeToastUp da Clover): só na página vestida, nunca na prova contra a captura.
// Sem script, tudo aparece: o que esconde as perguntas extras é a classe .mx-js que este arquivo põe.
(function () {
  var raiz = document.querySelector('.mx-clover-varejo');
  if (!raiz) return;
  raiz.classList.add('mx-js');

  // ---- FAQ ----
  var botao = raiz.querySelector('[data-mx-ver-mais]');
  function contar() {
    if (!botao) return;
    var extras = raiz.querySelectorAll('.mx-faq-extra');
    var visiveis = 0;
    for (var i = 0; i < extras.length; i++) if (extras[i].offsetParent === null) visiveis++;
    var conta = botao.querySelector('[data-mx-conta]');
    if (conta) conta.textContent = visiveis ? '(+' + visiveis + ')' : '';
    botao.hidden = visiveis === 0;
  }
  if (botao) {
    botao.addEventListener('click', function () {
      raiz.classList.add('mx-faq-tudo');
      botao.setAttribute('aria-expanded', 'true');
      var primeira = raiz.querySelector('.mx-faq-extra summary');
      contar();
      if (primeira) primeira.focus();
    });
    contar();
    var espera;
    window.addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(contar, 150); });
  }
  var itens = raiz.querySelectorAll('details[name]');
  if (!('name' in HTMLDetailsElement.prototype)) {
    for (var j = 0; j < itens.length; j++) {
      itens[j].addEventListener('toggle', function (ev) {
        var d = ev.target;
        if (!d.open) return;
        for (var k = 0; k < itens.length; k++) if (itens[k] !== d && itens[k].getAttribute('name') === d.getAttribute('name')) itens[k].open = false;
      });
    }
  }

  // ---- revelar ao entrar ----
  if (!raiz.classList.contains('mx-vestido') || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ATIVO = 'mAZF70It--FadeToastUp_fade-toast-up--active__xnKww';
  var alvos = raiz.querySelectorAll('.mAZF70It--FadeToastUp_fade-toast-up__jmg7z');
  var olho = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add(ATIVO);
      olho.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  var altura = window.innerHeight || document.documentElement.clientHeight;
  for (var n = 0; n < alvos.length; n++) {
    var r = alvos[n].getBoundingClientRect();
    if (r.top < altura * 0.92) continue; // o que já está na tela fica como está
    alvos[n].classList.remove(ATIVO);
    olho.observe(alvos[n]);
  }
})();
