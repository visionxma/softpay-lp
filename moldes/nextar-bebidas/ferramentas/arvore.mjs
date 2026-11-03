#!/usr/bin/env node
// Mapa da árvore renderizada do Nex (03/11/2026): tag, classe, display, y e altura até 6 níveis, só nós com
// altura ≥ 40 px ou display:contents. Serve para achar o nível em que as seções da página se separam.
// uso: node arvore.mjs <url> [largura]
import { join } from 'node:path';
import { homedir } from 'node:os';

const { comNavegador, novoContexto, prepararPagina } = await import(join(homedir(), '.jarvis/marcio-safirion/clone/bin/pagina.mjs'));
const [url, L = '1440'] = process.argv.slice(2);
await comNavegador('arvore ' + url, async (nav) => {
  const ctx = await novoContexto(nav, Number(L));
  const p = await ctx.newPage();
  try {
    await prepararPagina(p, url, { bloquear: true });
    const linhas = await p.evaluate(() => {
      const out = [];
      const anda = (el, n) => {
        if (n > 7 || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META|svg|path)$/i.test(el.tagName)) return;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.height >= 40 || cs.display === 'contents') {
          const h = el.querySelector(':scope h1, :scope h2');
          out.push(`${'  '.repeat(n)}${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className || '').split(' ').slice(0, 2).join('.')} [${cs.display}/${cs.position}] y=${Math.round(r.top + scrollY)} h=${Math.round(r.height)} filhos=${el.children.length} ${h ? '«' + h.textContent.trim().slice(0, 40) + '»' : ''}`);
        }
        if (n < 7) for (const c of el.children) anda(c, n + 1);
      };
      anda(document.body, 0);
      return out;
    });
    console.log(linhas.slice(0, 160).join('\n'));
  } finally { await ctx.close(); }
});
