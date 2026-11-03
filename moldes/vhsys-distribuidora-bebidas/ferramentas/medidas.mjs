#!/usr/bin/env node
// Medidas da referência do vhsys (distribuidora de bebidas) por seção (03/11/2026, adaptado do nextar-bebidas): para cada seção de secoes-<L>.json, as caixas visíveis de
// título, parágrafo, link, botão, item e imagem, com a posição RELATIVA ao topo da seção, letra e cores. É a régua
// do molde.css (tamanho de letra, vão e largura de coluna saem daqui, não do olho).
// uso: node medidas.mjs <url> <pasta-da-captura> [--larguras 1440,390] > medidas.txt
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const { comNavegador, novoContexto, prepararPagina } = await import(join(homedir(), '.jarvis/marcio-safirion/clone/bin/pagina.mjs'));
const args = process.argv.slice(2);
const [url, pasta] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--larguras');
const iL = args.indexOf('--larguras');
const larguras = (iL >= 0 ? args[iL + 1] : '1440,390').split(',').map(Number);

await comNavegador('medidas ' + url, async (nav) => {
  for (const L of larguras) {
    const secoes = JSON.parse(readFileSync(join(pasta, `secoes-${L}.json`), 'utf8'));
    const ctx = await novoContexto(nav, L);
    const p = await ctx.newPage();
    try {
      await prepararPagina(p, url, { bloquear: true });
      const linhas = await p.evaluate((S) => {
        const out = [];
        const visivel = (el) => { const q = el.getBoundingClientRect(); return q.height > 0 && q.width > 0 && getComputedStyle(el).visibility !== 'hidden' && Number(getComputedStyle(el).opacity) > 0.05; };
        const els = [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,img,svg,summary,details,.e-con,.e-n-tab-title,.elementor-icon-list-item')].filter(visivel);
        for (const s of S) {
          out.push(`== ${s.idx} ${s.nome} y=${s.y} h=${s.altura} x=${s.x} w=${s.largura} fundo=${s.fundo}`);
          const vistos = new Set();
          for (const el of els) {
            const q = el.getBoundingClientRect();
            const y = Math.round(q.top + scrollY);
            if (y < s.y - 2 || y > s.y + s.altura + 2 || q.left < s.x - 2 || q.right > s.x + s.largura + 2) continue;
            const t = el.tagName.toLowerCase();
            const txt = (el.tagName === 'IMG' || el.tagName === 'svg') ? '' : (el.innerText || '').replace(/\s+/g, ' ').trim();
            if (/^(p|h\d|a|button|summary|li)$/.test(t) && !txt) continue;
            if (t === 'div' && !el.classList.contains('e-con') && !el.classList.contains('e-n-tab-title')) continue;
            if (el.classList.contains('e-con')) { const c2 = getComputedStyle(el); if ((c2.backgroundColor === 'rgba(0, 0, 0, 0)' || c2.backgroundColor === 'transparent') && c2.borderTopLeftRadius === '0px') continue; }
            const cs = getComputedStyle(el);
            const k = `${t}${Math.round(q.left)},${y},${Math.round(q.width)},${Math.round(q.height)}`;
            if (vistos.has(k)) continue; vistos.add(k);
            const nome = el.classList.contains('e-con') ? 'card' : null;
            
            out.push(`  ${t}${nome ? '[' + nome + ']' : ''} x=${Math.round(q.left)} dy=${y - s.y} ${Math.round(q.width)}×${Math.round(q.height)} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ls=${cs.letterSpacing} pad=${cs.padding} ff=${cs.fontFamily.split(',')[0]} cor=${cs.color} fundo=${cs.backgroundColor} borda=${cs.borderTopWidth} ${cs.borderTopColor} raio=${cs.borderTopLeftRadius} al=${cs.textAlign} «${txt.slice(0, 60)}»`);
          }
        }
        return out;
      }, secoes);
      console.log(`######## ${L}px`);
      console.log(linhas.join('\n'));
    } finally { await ctx.close(); }
  }
});
