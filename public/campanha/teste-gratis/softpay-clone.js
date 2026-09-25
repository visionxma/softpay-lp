/* Comportamento que o React da referência fazia e a captura estática perdeu, mais o
   acabamento da rodada de 25/09/2026. Sem biblioteca.
   1. Perguntas frequentes: acordeão de um aberto por vez, que também fecha (Radix "single, collapsible").
   2. Botão flutuante "Testar Grátis": aparece depois de 800px de rolagem (medido na referência), mas
      some quando um botão de teste já está na tela, no rodapé e com a faixa de cookies aberta. No
      celular ele não aparece: tapava texto e o cabeçalho fixo já mostra "TESTAR GRÁTIS" o tempo todo.
   3. Depoimentos em vídeo: <dialog> nativo com o vídeo vertical tocando; fecha no X, no fundo e no Esc;
      o resto da página fica inerte enquanto ele está aberto.
   4. Revelar ao entrar na tela, com escalonamento entre os que entram juntos.
   5. Contador nos números de prova.
   6. Cabeçalho que vira vidro ao rolar, menu que acende conforme a seção e âncora com rolagem suave.
   Nada fica escondido sem JS: o CSS só esconde o que este arquivo marca, e só depois de marcar. */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cada = function (lista, fn) { Array.prototype.forEach.call(lista, fn); };

  /* 1. Acordeão ------------------------------------------------------------ */
  var gatilhos = Array.prototype.slice.call(document.querySelectorAll('h3 > button[aria-controls]'));

  function estado(botao, aberto) {
    var s = aberto ? 'open' : 'closed';
    var item = botao.parentElement.parentElement;
    var painel = document.getElementById(botao.getAttribute('aria-controls'));
    [item, botao.parentElement, botao, painel].forEach(function (el) { el.setAttribute('data-state', s); });
    botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    // a animação accordion-down/up do CSS original anima de/para esta altura medida
    painel.style.transitionDuration = '';
    painel.style.animationName = '';
    if (aberto) {
      painel.hidden = false;
      painel.style.setProperty('--radix-collapsible-content-height', painel.scrollHeight + 'px');
      painel.classList.add('sp-animando'); // o texto entra junto, com um esmaecer curto
      setTimeout(function () { painel.classList.remove('sp-animando'); }, 520);
    } else {
      painel.classList.remove('sp-animando');
      painel.style.setProperty('--radix-collapsible-content-height', painel.scrollHeight + 'px');
      var fim = function () { if (painel.getAttribute('data-state') === 'closed') painel.hidden = true; };
      painel.addEventListener('animationend', fim, { once: true });
      setTimeout(fim, 320); // sem animação (menos movimento) o animationend não vem
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
  var rodape = document.querySelector('footer');
  var ctasNaTela = [];
  var rodapeNaTela = false;

  function confereFlutuante() {
    if (!flutuante) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    var celular = window.innerWidth < 768;
    var cookies = document.querySelector('.co-barra[data-visivel="sim"]');
    var mostrar = !celular && y > 800 && ctasNaTela.length === 0 && !rodapeNaTela && !cookies;
    flutuante.classList.toggle('sp-fab--on', mostrar);
  }

  if (flutuante && 'IntersectionObserver' in window) {
    var olhoCta = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.target === rodape) { rodapeNaTela = e.isIntersecting; return; }
        var i = ctasNaTela.indexOf(e.target);
        if (e.isIntersecting && i < 0) ctasNaTela.push(e.target);
        if (!e.isIntersecting && i >= 0) ctasNaTela.splice(i, 1);
      });
      confereFlutuante();
    });
    cada(document.querySelectorAll('a[data-botao]'), function (a) {
      if (!flutuante.contains(a) && !a.closest('nav')) olhoCta.observe(a);
    });
    if (rodape) olhoCta.observe(rodape);
    // a faixa de cookies entra e sai do body: quando ela some, o botão pode voltar
    new MutationObserver(confereFlutuante).observe(document.body, { childList: true });
  }

  /* 6a. Cabeçalho e menu (no mesmo quadro de rolagem) ------------------------ */
  var cabecalho = document.querySelector('nav.sticky');
  var linksMenu = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  var secoesMenu = linksMenu.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });

  function confereMenu() {
    var linha = (cabecalho ? cabecalho.offsetHeight : 80) + window.innerHeight * 0.3;
    var ativa = -1;
    secoesMenu.forEach(function (sec, i) {
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      if (r.top <= linha && r.bottom > linha) ativa = i;
    });
    linksMenu.forEach(function (a, i) {
      if (i === ativa) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  var pedido = false;
  function aoRolar() {
    pedido = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    if (cabecalho) cabecalho.classList.toggle('sp-rolou', y > 8);
    confereMenu();
    confereFlutuante();
  }
  window.addEventListener('scroll', function () {
    if (!pedido) { pedido = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  window.addEventListener('resize', function () { if (!pedido) { pedido = true; requestAnimationFrame(aoRolar); } });
  aoRolar();

  /* 6b. Âncora da própria página: rolagem suave, respeitando "menos movimento" */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var alvo = id && document.getElementById(id);
    if (!alvo) return;
    ev.preventDefault();
    alvo.scrollIntoView({ behavior: menosMovimento.matches ? 'auto' : 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* 3. Diálogo do vídeo ---------------------------------------------------- */
  /* <dialog> nativo com showModal(): o navegador prende o foco, deixa o resto inerte e entrega
     o Esc mesmo quando o foco está nos controles do vídeo (lá dentro o keydown não chega à página). */
  var aberto = null;
  var voltarFoco = null;
  var X = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  function fechar() {
    if (!aberto) return;
    var caixa = aberto;
    aberto = null;
    caixa.setAttribute('data-state', 'closed');
    var video = caixa.querySelector('video');
    if (video) video.pause();
    raiz.classList.remove('sp-travado');
    setTimeout(function () {
      if (caixa.open) caixa.close();
      caixa.remove();
      if (voltarFoco) voltarFoco.focus();
    }, 170);
  }

  function abrir(botao) {
    if (aberto) return;
    voltarFoco = botao;
    var caixa = document.createElement('dialog');
    caixa.className = 'sp-dialogo';
    caixa.setAttribute('aria-labelledby', 'sp-dialogo-titulo');
    caixa.setAttribute('aria-describedby', 'sp-dialogo-frase');
    caixa.setAttribute('data-state', 'open');
    caixa.innerHTML =
      '<div class="sp-dialogo-topo"><h2 id="sp-dialogo-titulo" class="text-[#1DA1F2] font-semibold text-lg leading-tight font-sans"></h2><p class="text-gray-400 text-sm font-normal mt-1"></p></div>' +
      '<button type="button" class="sp-fechar" aria-label="Fechar o vídeo">' + X + '</button>' +
      '<div class="sp-video-caixa"><video class="sp-video" controls autoplay playsinline preload="metadata"></video></div>' +
      '<div class="p-4 border-t border-white/10 bg-[#06121F]"><p id="sp-dialogo-frase" class="text-gray-300 text-sm leading-relaxed"></p></div>';
    caixa.querySelector('h2').textContent = botao.getAttribute('data-nome');
    caixa.querySelector('.sp-dialogo-topo p').textContent = botao.getAttribute('data-local');
    caixa.querySelector('#sp-dialogo-frase').textContent = botao.getAttribute('data-frase');
    var video = caixa.querySelector('video');
    video.setAttribute('poster', botao.getAttribute('data-capa'));
    video.src = botao.getAttribute('data-video');
    caixa.querySelector('.sp-fechar').addEventListener('click', fechar);
    // clique no fundo escurecido: o alvo é o próprio <dialog> (o conteúdo ocupa a caixa inteira)
    caixa.addEventListener('click', function (ev) { if (ev.target === caixa) fechar(); });
    // Esc: o navegador avisa com "cancel"; a saída animada é a nossa
    caixa.addEventListener('cancel', function (ev) { ev.preventDefault(); fechar(); });
    document.body.appendChild(caixa);
    raiz.classList.add('sp-travado');
    aberto = caixa;
    caixa.showModal(); // o foco vai para o X, o primeiro controle
    var tocar = video.play();
    if (tocar && tocar.catch) tocar.catch(function () { /* o navegador pode exigir o clique no play */ });
  }

  cada(document.querySelectorAll('button[data-video]'), function (botao) {
    botao.addEventListener('click', function () { abrir(botao); });
  });

  /* 4. Revelar ao entrar na tela ------------------------------------------- */
  function alvosDaSecao(sec) {
    var caixa = sec.querySelector(':scope > div');
    var out = [];
    if (!caixa) return out;
    cada(caixa.children, function (filho) {
      var grade = getComputedStyle(filho).display === 'grid' || filho.classList.contains('space-y-4');
      if (grade) cada(filho.children, function (f) { out.push(f); });
      else out.push(filho);
    });
    return out;
  }

  if ('IntersectionObserver' in window) {
    var alvos = [];
    cada(document.querySelectorAll('.min-h-screen > section'), function (sec) {
      alvos.push.apply(alvos, alvosDaSecao(sec));
    });
    var alturaTela = window.innerHeight;
    // o que já está na tela ao carregar fica como está (esconder e mostrar de novo seria piscar)
    alvos = alvos.filter(function (el) { return el.getBoundingClientRect().top > alturaTela; });
    alvos.forEach(function (el) { el.setAttribute('data-revelar', ''); });

    var olhoRevelar = new IntersectionObserver(function (entradas) {
      var chegaram = entradas.filter(function (e) { return e.isIntersecting || e.boundingClientRect.top < 0; })
        .map(function (e) { return e.target; });
      chegaram.sort(function (a, b) {
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return (ra.top - rb.top) || (ra.left - rb.left);
      });
      chegaram.forEach(function (el, i) {
        olhoRevelar.unobserve(el);
        var atraso = Math.min(i, 6) * 70; // escalonamento só entre os que entram juntos
        el.style.setProperty('--sp-atraso', atraso + 'ms');
        el.classList.add('sp-visto');
        setTimeout(function () {
          el.removeAttribute('data-revelar');
          el.classList.remove('sp-visto');
          el.style.removeProperty('--sp-atraso');
        }, 560 + atraso + 60);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    alvos.forEach(function (el) { olhoRevelar.observe(el); });
    raiz.classList.add('sp-revela');
    // impressão e "salvar como PDF" saem com tudo à mostra
    window.addEventListener('beforeprint', function () { raiz.classList.remove('sp-revela'); });
  }

  /* 5. Contadores ------------------------------------------------------------ */
  function contar(el) {
    var alvo = +el.getAttribute('data-contar');
    var de = +(el.getAttribute('data-de') || 0);
    var pre = el.getAttribute('data-prefixo') || '';
    var suf = el.getAttribute('data-sufixo') || '';
    var sufUm = el.getAttribute('data-sufixo-um'); // "1 dia", não "1 dias"
    var texto = function (n) { return pre + n + (n === 1 && sufUm !== null ? sufUm : suf); };
    var dur = alvo >= 50 ? 1400 : 900;
    // largura final fixa: os vizinhos na mesma linha não dançam enquanto os dígitos crescem
    if (getComputedStyle(el).display !== 'block' && getComputedStyle(el).display !== 'inline') {
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
    }
    el.textContent = texto(de);
    var t0 = 0;
    function passo(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = texto(Math.round(de + (alvo - de) * e));
      if (p < 1) requestAnimationFrame(passo);
    }
    setTimeout(function () { requestAnimationFrame(passo); }, +(el.getAttribute('data-atraso') || 0));
  }

  if (!menosMovimento.matches && 'IntersectionObserver' in window) {
    var olhoNumero = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        olhoNumero.unobserve(e.target);
        contar(e.target);
      });
    }, { threshold: 0.6 });
    cada(document.querySelectorAll('[data-contar]'), function (el) { olhoNumero.observe(el); });
  }

  /* ano do rodapé */
  cada(document.querySelectorAll('[data-ano]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
