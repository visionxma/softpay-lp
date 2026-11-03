// Expressão para ferramentas/medir.mjs: para cada vão acima do teto (mesma conta de vaos.js), diz QUEM o faz:
// o elemento mais fundo que contém o vão inteiro e, entre os filhos dele, o que vem antes e depois, com
// padding e margin verticais de cada um.
// uso: node ferramentas/medir.mjs <url> <largura> "$(cat ferramentas/vaos-quem.js)"
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
  for (const [t, b] of caixas) { if (t - fim > 1) vaos.push([fim, t]); fim = Math.max(fim, b); }
  const teto = innerWidth >= 768 ? 120 : 72;
  const nome = (el) => (el.tagName.toLowerCase() + '.' + [...el.classList].map((c) => c.replace(/^mAZF70It--/, '').replace(/__\w+$/, '')).join('.')).slice(0, 70);
  const pm = (el) => { const c = getComputedStyle(el); const r = el.getBoundingClientRect(); return `t${Math.round(r.top + scrollY)} p${parseFloat(c.paddingTop)}/${parseFloat(c.paddingBottom)} m${parseFloat(c.marginTop)}/${parseFloat(c.marginBottom)} h${Math.round(el.getBoundingClientRect().height)}`; };
  const todos = [...main.querySelectorAll('*')];
  // (a cadeia desce pelo filho que contém a borda do vão; sem ele, pelo vizinho mais perto)
  return vaos.filter(([a, b]) => b - a > teto).map(([a, b]) => {
    let fundo = main;
    for (const el of todos) { const r = el.getBoundingClientRect(); if (r.top + scrollY <= a + 1 && r.bottom + scrollY >= b - 1 && fundo.contains(el)) fundo = el; }
    const filhos = [...fundo.children].map((f) => { const r = f.getBoundingClientRect(); return { f, t: r.top + scrollY, b: r.bottom + scrollY }; });
    // o filho que CONTÉM a borda do vão vence (o vão começa no fim do conteúdo dele, não no fim da caixa)
    const antes = filhos.find((x) => x.t < a - 1 && x.b > a + 1) || filhos.filter((x) => x.b <= a + 2).sort((p, q) => p.b - q.b).pop();
    const depois = filhos.find((x) => x.t < b - 1 && x.b > b + 1) || filhos.filter((x) => x.t >= b - 2).sort((p, q) => p.t - q.t)[0];
    // cadeia descendo pelo "antes" até onde a borda encosta no início do vão (quem carrega o padding de baixo)
    const cadeia = (x, lado) => { const out = []; let el = x && x.f; while (el) { out.push(nome(el) + ' ' + pm(el)); const kids = [...el.children].filter((k) => k.getBoundingClientRect().height > 0); const borda = lado === 'fim' ? a : b; const dentro = kids.find((k) => { const r = k.getBoundingClientRect(); return r.top + scrollY < borda - 1 && r.bottom + scrollY > borda + 1; }); kids.sort((p, q) => lado === 'fim' ? p.getBoundingClientRect().bottom - q.getBoundingClientRect().bottom : q.getBoundingClientRect().top - p.getBoundingClientRect().top); el = dentro || (lado === 'fim' ? kids.filter((k) => k.getBoundingClientRect().bottom + scrollY <= a + 2).pop() : kids.filter((k) => k.getBoundingClientRect().top + scrollY >= b - 2).pop()); if (out.length > 8) break; } return out; };
    return { y: Math.round(a), vao: Math.round(b - a), dentro: nome(fundo) + ' ' + pm(fundo), antes: cadeia(antes, 'fim'), depois: cadeia(depois, 'inicio') };
  });
})()
