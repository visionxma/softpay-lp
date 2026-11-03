// Vãos verticais da hero, versão 2 (03/11/2026). Doutrina: sobra dividida igual, teto 120 px no computador e 72 no celular.
// uso: node vaos-hero2.mjs <url> <seletor-da-hero> [prefixo-das-fotos] [larguras ex.: 1440x900,390x844]
// O que mudou da v1: (1) filho com `display: contents` se abre nos filhos dele (a v1 o descartava por ter caixa zero e
// descia até uma imagem, dando "ok" falso no celular); (2) filhos lado a lado viram UMA fileira: o vão conta entre
// fileiras, e dentro da fileira mede a coluna principal (a de mais blocos empilhados) contra o topo e o pé da fileira.
// A coluna lateral de um bloco só (imagem centrada ao lado do texto) sai como informação, não reprova.
import { chromium } from '/Users/victorgabryellferreiraqueiroz/.jarvis/design-engine/node_modules/playwright/index.mjs';

const [URL, SEL, PREF, LARG] = process.argv.slice(2);
const tamanhos = (LARG || '1440x900,390x844').split(',').map((s) => s.split('x').map(Number));
const nav = await chromium.connectOverCDP('http://127.0.0.1:9444');
const ctx = await nav.newContext({ bypassCSP: true });
let pior = 0;
try {
  for (const [w, h] of tamanhos) {
    const p = await ctx.newPage();
    try {
      await p.setViewportSize({ width: w, height: h });
      await p.goto(URL, { waitUntil: 'networkidle' });
      await p.waitForTimeout(1500);
      const m = await p.evaluate((sel) => {
        const hero = document.querySelector(sel);
        if (!hero) return { erro: 'hero não achada' };
        const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.height > 2 && r.width > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.position !== 'absolute' && cs.position !== 'fixed'; };
        const abrir = (el) => [...el.children].flatMap((f) => (getComputedStyle(f).display === 'contents' ? abrir(f) : [f]));
        const filhosVis = (el) => abrir(el).filter(vis);
        const nome = (e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}`;
        const caixa = (e) => { const r = e.getBoundingClientRect(); return { e, nome: nome(e), top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), left: r.left, right: r.right }; };
        const descer = (el) => { let c = el; for (let k = 0; k < 10; k++) { const f = filhosVis(c); if (f.length === 1 && !/^(IMG|PICTURE|VIDEO|CANVAS|SVG|H1|H2|P|A|BUTTON)$/.test(f[0].tagName)) c = f[0]; else break; } return c; };
        const fileiras = (el) => {
          const bs = filhosVis(el).map(caixa).sort((a, b) => a.top - b.top);
          const rows = [];
          for (const b of bs) {
            const r = rows.at(-1);
            if (r && b.top < r.bottom - 4) { r.membros.push(b); r.bottom = Math.max(r.bottom, b.bottom); r.top = Math.min(r.top, b.top); } else rows.push({ top: b.top, bottom: b.bottom, membros: [b] });
          }
          return rows;
        };
        const rh = hero.getBoundingClientRect();
        const menu = [...document.querySelectorAll('body *')].find((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return cs.position === 'fixed' && r.top <= 1 && r.width > innerWidth * 0.6 && r.height < 200; });
        const topoUtil = Math.max(menu ? Math.round(menu.getBoundingClientRect().bottom) : 0, Math.round(rh.top + scrollY));
        const pe = Math.round(rh.bottom + scrollY);
        const c = descer(hero);
        const rows = fileiras(c);
        const vaos = []; const info = [];
        const rot = (r) => r.membros.map((b) => b.nome).join('|');
        if (rows.length) {
          vaos.push(['topo→' + rot(rows[0]), rows[0].top - topoUtil]);
          for (let i = 1; i < rows.length; i++) vaos.push([rot(rows[i - 1]) + '→' + rot(rows[i]), rows[i].top - rows[i - 1].bottom]);
          vaos.push([rot(rows.at(-1)) + '→pé', pe - rows.at(-1).bottom]);
        }
        // dentro de cada fileira com colunas: a coluna de mais blocos empilhados é a principal
        rows.filter((r) => r.membros.length > 1).forEach((r) => {
          const cols = r.membros.map((b) => { const d = descer(b.e); const sub = fileiras(d); return { b, sub }; }).sort((x, y) => y.sub.length - x.sub.length);
          const lim0 = Math.max(r.top, topoUtil);
          cols.forEach((col, i) => {
            const sub = col.sub; if (!sub.length) return;
            const lista = [['(col ' + col.b.nome + ') topo→' + rot(sub[0]), sub[0].top - lim0]];
            for (let k = 1; k < sub.length; k++) lista.push(['(col) ' + rot(sub[k - 1]) + '→' + rot(sub[k]), sub[k].top - sub[k - 1].bottom]);
            lista.push(['(col) ' + rot(sub.at(-1)) + '→pé da fileira', r.bottom - sub.at(-1).bottom]);
            if (i === 0 && sub.length > 1) vaos.push(...lista); else info.push(...lista);
          });
          // o vão de topo/pé da fileira conta da coluna principal (as bordas da fileira são da mais alta)
        });
        return { hero: [Math.round(rh.top + scrollY), Math.round(rh.height)], tela: innerHeight, topoUtil, conteiner: nome(c), vaos, info };
      }, SEL);
      const teto = w >= 1024 ? 120 : 72;
      const acima = (m.vaos || []).filter(([, v]) => v > teto);
      const heroMaior = m.hero && m.hero[1] > h + 2;
      if (acima.length || heroMaior || m.erro) pior = 1;
      console.log(`${w}x${h} ${acima.length ? 'ACIMA DO TETO' : 'ok'}${heroMaior ? ' HERO MAIOR QUE A TELA' : ''} (teto ${teto}) ${JSON.stringify(m)}`);
      if (PREF) await p.screenshot({ path: `${PREF}-${w}x${h}-hero.png` });
    } finally { await p.close().catch(() => {}); }
  }
} finally {
  await ctx.close().catch(() => {});
  await nav.close().catch(() => {});
}
process.exit(pior);
