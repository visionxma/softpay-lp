// Corta o CSS escopado da Clover (trabalho/escopado.css, ~970 KB) para só as regras que o molde usa.
// Uma regra fica se toda classe e todo id do seletor (fora de :not/:where/:is/:has) aparecem no HTML que o
// molde gera nos DOIS modos (origem e produto) ou no molde.js. Modelo: FINAGRO-LP/moldes/wise-conversor/construir.mjs.
// uso: node ferramentas/purgar-estatico.mjs   (grava ../trabalho/purgado.css)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = path.resolve(AQUI, '..', '..');
const req = createRequire(path.join(os.homedir(), '.jarvis/marcio-safirion/clone/node_modules/'));
const postcss = req('postcss');
const parser = req('postcss-selector-parser');

const m = await import(pathToFileURL(path.join(AQUI, 'molde.mjs')).href);
const O = JSON.parse(fs.readFileSync(path.join(AQUI, 'origem.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(RAIZ, 'tools/conteudo/segmentos/mercadinho.json'), 'utf8'));
const htmls = [
  m.render({ ...O, modo: 'origem' }),
  m.desenho({ ...C, origem: false, rota: '/segmentos/mercadinho/', links: { app: '#', cadastro: '#', wpp: '#' }, v: (s) => s, base: '/moldes/clover-varejo' }),
];
const js = path.join(AQUI, 'molde.js');
const usadas = new Set();
for (const h of htmls) {
  for (const a of h.matchAll(/\sclass="([^"]*)"/g)) for (const c of a[1].split(/\s+/)) if (c) usadas.add(c);
  for (const a of h.matchAll(/\sid="([^"]*)"/g)) usadas.add(a[1]);
}
if (fs.existsSync(js)) for (const t of fs.readFileSync(js, 'utf8').matchAll(/['"`.]([\w-]+)/g)) usadas.add(t[1]);

const PSEUDO_LIVRE = new Set([':not', ':where', ':is', ':has', ':matches', ':-webkit-any', ':-moz-any']);
const serve = (sel) => {
  if (/\[dir=["']?rtl|:dir\(rtl\)/.test(sel)) return false;
  for (const l of sel.matchAll(/:lang\(([^)]+)\)/g)) if (!/^["']?(pt|en)/i.test(l[1])) return false;
  let ok = true;
  try {
    parser((r) => {
      r.walk((n) => {
        if (!ok) return false;
        if (n.type === 'class' || n.type === 'id') {
          if (n.value === 'mx-clover-varejo') return;
          let p = n.parent;
          while (p && p.type !== 'root') { if (p.type === 'pseudo' && PSEUDO_LIVRE.has(p.value)) return; p = p.parent; }
          if (!usadas.has(n.value)) ok = false;
        }
      });
    }).processSync(sel);
  } catch { return true; }
  return ok;
};

const css = postcss.parse(fs.readFileSync(path.join(AQUI, 'trabalho/escopado.css'), 'utf8'));
let antes = 0; let depois = 0;
css.walkAtRules('font-face', (r) => r.remove());
css.walkRules((r) => {
  if (r.parent?.type === 'atrule' && /keyframes$/.test(r.parent.name)) return;
  antes++;
  const fica = r.selectors.filter(serve);
  if (!fica.length) r.remove(); else { r.selectors = fica; depois++; }
});
const animacoes = new Set();
css.walkDecls(/^animation(-name)?$/, (d) => { for (const p of d.value.split(/[\s,]+/)) animacoes.add(p); });
let mudou = true;
while (mudou) {
  mudou = false;
  css.walkAtRules((a) => {
    if (/keyframes$/.test(a.name)) { if (!animacoes.has(a.params.trim())) { a.remove(); mudou = true; } return; }
    if (['media', 'container', 'supports', 'layer'].includes(a.name) && a.nodes && !a.nodes.length) { a.remove(); mudou = true; }
  });
}
// variáveis de :root que ninguém lê pesam e não mudam nada; ficam só as lidas por var(--x)
const lidas = new Set();
css.walkDecls((d) => { for (const v of d.value.matchAll(/var\(\s*(--[\w-]+)/g)) lidas.add(v[1]); });
let varsFora = 0;
let de = true;
while (de) {
  de = false;
  css.walkDecls(/^--/, (d) => { if (!lidas.has(d.prop)) { d.remove(); varsFora++; de = true; } });
  lidas.clear();
  css.walkDecls((d) => { for (const v of d.value.matchAll(/var\(\s*(--[\w-]+)/g)) lidas.add(v[1]); });
}
css.walkRules((r) => { if (!r.nodes.length) r.remove(); });
mudou = true;
while (mudou) { mudou = false; css.walkAtRules((a) => { if (a.nodes && !a.nodes.length) { a.remove(); mudou = true; } }); }

const saida = path.join(AQUI, 'trabalho/purgado.css');
fs.writeFileSync(saida, '/* CSS da Clover (captura renderizada de clover.com/pos-systems, 03/11/2026), escopado e cortado para o que o molde usa — gerado por ferramentas/purgar-estatico.mjs */\n' + css.toString());
console.log(`classes usadas ${usadas.size} · regras ${antes} → ${depois} · variáveis sem leitura fora ${varsFora} · ${(fs.statSync(saida).size / 1024).toFixed(1)} KB`);
