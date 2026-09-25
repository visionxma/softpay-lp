/* Comportamento que o React da referência fazia e a captura estática perdeu.
   Sem biblioteca. Três peças:
   1. Perguntas frequentes: acordeão de um aberto por vez, que também fecha (Radix "single, collapsible").
   2. Botão flutuante "Testar Grátis": aparece depois de 800px de rolagem (medido na referência).
   3. Depoimentos em vídeo: o clique abre o diálogo com o vídeo tocando, fecha no X, no fundo e no Esc. */
(function () {
  'use strict';

  /* 1. Acordeão ------------------------------------------------------------ */
  var gatilhos = Array.prototype.slice.call(document.querySelectorAll('h3 > button[aria-controls]'));

  function estado(botao, aberto) {
    var s = aberto ? 'open' : 'closed';
    var item = botao.parentElement.parentElement;
    var painel = document.getElementById(botao.getAttribute('aria-controls'));
    [item, botao.parentElement, botao, painel].forEach(function (el) { el.setAttribute('data-state', s); });
    botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    // a animação accordion-down/up do CSS original anima de/para esta altura
    painel.style.transitionDuration = '';
    painel.style.animationName = '';
    if (aberto) {
      painel.hidden = false;
      painel.style.setProperty('--radix-collapsible-content-height', painel.scrollHeight + 'px');
    } else {
      painel.style.setProperty('--radix-collapsible-content-height', painel.scrollHeight + 'px');
      var fim = function () { if (painel.getAttribute('data-state') === 'closed') painel.hidden = true; };
      painel.addEventListener('animationend', fim, { once: true });
      setTimeout(fim, 260); // sem animação (menos movimento) o animationend não vem
    }
  }

  gatilhos.forEach(function (botao) {
    botao.addEventListener('click', function () {
      var abrir = botao.getAttribute('aria-expanded') !== 'true';
      gatilhos.forEach(function (outro) {
        if (outro !== botao && outro.getAttribute('aria-expanded') === 'true') estado(outro, false);
      });
      estado(botao, abrir);
    });
  });

  /* 2. Botão flutuante ----------------------------------------------------- */
  var flutuante = document.querySelector('[data-flutuante]');
  if (flutuante) {
    var pedido = false;
    var confere = function () {
      pedido = false;
      var mostrar = (window.scrollY || document.documentElement.scrollTop) > 800;
      flutuante.classList.toggle('scale-100', mostrar);
      flutuante.classList.toggle('scale-0', !mostrar);
    };
    window.addEventListener('scroll', function () {
      if (!pedido) { pedido = true; requestAnimationFrame(confere); }
    }, { passive: true });
    confere();
  }

  /* 3. Diálogo do vídeo ---------------------------------------------------- */
  var aberto = null;
  var voltarFoco = null;

  function fechar() {
    if (!aberto) return;
    var par = aberto;
    aberto = null;
    par.forEach(function (el) { el.setAttribute('data-state', 'closed'); });
    var video = par[1].querySelector('video');
    if (video) video.pause();
    setTimeout(function () { par.forEach(function (el) { el.remove(); }); }, 200);
    document.documentElement.classList.remove('sp-travado');
    if (voltarFoco) voltarFoco.focus();
  }

  function abrir(botao) {
    voltarFoco = botao;
    var fundo = document.createElement('div');
    fundo.setAttribute('data-state', 'open');
    fundo.className = 'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';
    var caixa = document.createElement('div');
    caixa.setAttribute('role', 'dialog');
    caixa.setAttribute('aria-modal', 'true');
    caixa.setAttribute('aria-labelledby', 'sp-dialogo-titulo');
    caixa.setAttribute('data-state', 'open');
    caixa.tabIndex = -1;
    caixa.className = 'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-[#0B2033] border-white/10 max-w-3xl p-0 overflow-hidden';
    caixa.innerHTML =
      '<div class="flex flex-col space-y-1.5 text-center sm:text-left p-4 pb-0"><h2 id="sp-dialogo-titulo" class="text-lg font-semibold leading-none tracking-tight flex items-start justify-between font-sans"><div><p class="text-[#1DA1F2] font-semibold text-lg"></p><p class="text-gray-400 text-sm font-normal"></p></div></h2></div>' +
      '<div class="aspect-video w-full"><video class="sp-video" controls autoplay playsinline preload="metadata"></video></div>' +
      '<div class="p-4 border-t border-white/10 bg-[#06121F]"><p class="text-gray-300 text-sm leading-relaxed"></p></div>' +
      '<button type="button" class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg><span class="sr-only">Fechar</span></button>';
    var ps = caixa.querySelectorAll('p');
    ps[0].textContent = botao.getAttribute('data-nome');
    ps[1].textContent = botao.getAttribute('data-local');
    ps[2].textContent = botao.getAttribute('data-frase');
    var video = caixa.querySelector('video');
    video.setAttribute('poster', botao.getAttribute('data-capa'));
    video.src = botao.getAttribute('data-video');
    caixa.querySelector('button').addEventListener('click', fechar);
    fundo.addEventListener('click', fechar);
    document.body.appendChild(fundo);
    document.body.appendChild(caixa);
    document.documentElement.classList.add('sp-travado');
    aberto = [fundo, caixa];
    caixa.focus();
    var tocar = video.play();
    if (tocar && tocar.catch) tocar.catch(function () { /* o navegador pode exigir o clique no play */ });
  }

  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') fechar(); });
  Array.prototype.forEach.call(document.querySelectorAll('button[data-video]'), function (botao) {
    botao.addEventListener('click', function () { abrir(botao); });
  });

  /* ano do rodapé */
  Array.prototype.forEach.call(document.querySelectorAll('[data-ano]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
