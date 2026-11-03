// Expressão para ferramentas/medir.mjs: mede os vãos verticais sem conteúdo dentro do <main> (texto, imagem,
// botão, fundo de imagem), a altura da hero contra a tela e a rolagem lateral.
// uso: node ferramentas/medir.mjs <url> <largura> "$(cat ferramentas/vaos.js)"
(() => {
  const main = document.querySelector('main#conteudo') || document.querySelector('main');
  // o revelar ao entrar desloca o que está abaixo da dobra: mede com tudo já revelado e sem transição
  document.querySelectorAll('[class*="FadeToastUp_fade-toast-up__"]').forEach((el) => { el.style.transition = 'none'; el.classList.add('mAZF70It--FadeToastUp_fade-toast-up--active__xnKww'); });
  void document.body.offsetHeight;
  const caixas = [];
  const ver = (r) => r.width > 2 && r.height > 2;
  const andar = document.createTreeWalker(main, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = andar.currentNode; n; n = andar.nextNode()) {
    if (n.nodeType === 3) {
      if (!n.textContent.trim()) continue;
      const g = document.createRange(); g.selectNodeContents(n);
      for (const r of g.getClientRects()) if (ver(r)) caixas.push([r.top + scrollY, r.bottom + scrollY]);
      continue;
    }
    const cs = getComputedStyle(n);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    // caixa pequena que se VÊ (botão feito de <a>, chip, linha com borda) conta pela borda dela, não pelo texto
    // de dentro; caixa grande (cartão, faixa tingida) não, senão esconderia os vãos de dentro dela
    const rr = n.getBoundingClientRect();
    const pintada = (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || parseFloat(cs.borderBottomWidth) > 0 || parseFloat(cs.borderTopWidth) > 0;
    const caixinha = pintada && rr.height <= 120 && rr.width < innerWidth * 0.9;
    const tem = caixinha || /^(IMG|SVG|BUTTON|INPUT|VIDEO|PICTURE)$/i.test(n.tagName) || (cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage));
    if (tem) { const r = n.getBoundingClientRect(); if (ver(r) && r.width < innerWidth * 2) caixas.push([r.top + scrollY, r.bottom + scrollY]); }
  }
  caixas.sort((a, b) => a[0] - b[0]);
  const vaos = []; let fim = caixas.length ? caixas[0][1] : 0;
  for (const [t, b] of caixas) { if (t - fim > 1) vaos.push([Math.round(fim), Math.round(t - fim)]); fim = Math.max(fim, b); }
  const mr = main.getBoundingClientRect();
  vaos.push([Math.round(fim), Math.round(mr.bottom + scrollY - fim)]);
  const teto = innerWidth >= 768 ? 120 : 72;
  const secs = [...main.querySelectorAll(':scope > article > *, :scope > *:not(article)')].map((s) => { const r = s.getBoundingClientRect(); return [s.className.toString().replace(/mAZF70It--/g, '').split(/\s+/).slice(0, 2).join(' ').slice(0, 50), Math.round(r.top + scrollY), Math.round(r.height)]; });
  const sec = (y) => { let a = ''; for (const s of secs) if (s[1] <= y) a = s[0]; return a; };
  const hero = main.querySelector('article > *') || main.firstElementChild;
  return {
    largura: innerWidth, alturaPagina: document.documentElement.scrollHeight,
    telas: +(document.documentElement.scrollHeight / innerHeight).toFixed(1),
    rolagemLateral: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hero: [Math.round(hero.getBoundingClientRect().height), innerHeight],
    acimaDoTeto: vaos.filter((v) => v[1] > teto).map((v) => ({ y: v[0], vao: v[1], secao: sec(v[0]) })),
    secoes: secs,
  };
})()
