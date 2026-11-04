#!/usr/bin/env node
// Monta o CSS do molde lightspeed-varejo a partir do CSS escopado da captura da Lightspeed (lightspeedhq.com/pos/retail).
//
//   ferramentas/podado.css  = o CSS escopado em .mx-lightspeed-varejo só com as regras cujas classes e ids aparecem no
//                             HTML do molde (modo origem e modo produto); o resto do tema da Lightspeed sai;
//   origem.css              = as variáveis com as cores e fontes da PRÓPRIA Lightspeed (só a prova carrega);
//   molde.css               = podado.css vestido papel por papel (vestir-css.mjs + ferramentas/mapa.json)
//                             + acabamento.css (a identidade do SoftPay e o que é só do produto).
//
// uso: node moldes/lightspeed-varejo/ferramentas/construir.mjs [--so-podar] [<css-escopado>]
//      (padrão: ferramentas/escopado.css; gerado por escopar-css.mjs a partir de captura/estilos 01 e 02)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const MOLDE = path.resolve(AQUI, '..');
const PROJETO = path.resolve(MOLDE, '..', '..');
const CLONE = path.join(os.homedir(), '.jarvis/marcio-safirion/clone');
const req = createRequire(path.join(CLONE, 'node_modules/'));
const postcss = req('postcss');
const parser = req('postcss-selector-parser');

const args = process.argv.slice(2);
const soPodar = args.includes('--so-podar');
const fonte = args.find((a) => !a.startsWith('--')) || path.join(AQUI, 'escopado.css');
if (!fs.existsSync(fonte)) { console.error('CSS escopado não encontrado: ' + fonte); process.exit(2); }

// ---------- 1. o HTML das duas versões ----------
const mod = await import(pathToFileURL(path.join(MOLDE, 'molde.mjs')).href + '?t=' + Date.now());
const origem = JSON.parse(fs.readFileSync(path.join(MOLDE, 'origem.json'), 'utf8'));
const rota = JSON.parse(fs.readFileSync(path.join(PROJETO, 'tools/conteudo/segmentos/empresas-com-filiais.json'), 'utf8'));
const htmls = [
  mod.render({ ...origem, modo: 'origem' }),
  mod.desenho({ ...rota, origem: false, rota: '/segmentos/empresas-com-filiais/', links: { app: '#', cadastro: '#', wpp: '#' }, v: (u) => u, base: '/moldes/lightspeed-varejo' }),
];
const desfaz = (s) => s.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"');
const usadas = new Set(['mx-lightspeed-varejo', 'mx-pagina', 'js-ok', 'lazyloaded']);
for (const h of htmls) {
  for (const m of h.matchAll(/\bclass="([^"]*)"/g)) for (const t of desfaz(m[1]).split(/\s+/)) if (t) usadas.add(t);
  for (const m of h.matchAll(/\bid="([^"]*)"/g)) usadas.add(m[1]);
}

// ---------- 2. poda ----------
const PSEUDO_LIVRE = new Set([':not', ':where', ':is', ':has', ':matches', ':-webkit-any', ':-moz-any']);
const serve = (sel) => {
  if (/\[dir=["']?rtl|:dir\(rtl\)/.test(sel)) return false;
  for (const m of sel.matchAll(/:lang\(([^)]+)\)/g)) if (!/^["']?(pt|en)/i.test(m[1])) return false;
  let ok = true;
  try {
    parser((raiz) => {
      raiz.walk((n) => {
        if (!ok) return false;
        if (n.type === 'class' || n.type === 'id') {
          let p = n.parent;
          while (p && p.type !== 'root') { if (p.type === 'pseudo' && PSEUDO_LIVRE.has(p.value)) return; p = p.parent; }
          if (!usadas.has(n.value)) ok = false;
        }
      });
    }).processSync(sel);
  } catch { return true; }
  return ok;
};

const css = postcss.parse(fs.readFileSync(fonte, 'utf8'));
let antes = 0; let depois = 0;
css.walkAtRules('font-face', (r) => r.remove());
css.walkRules((r) => {
  if (r.parent?.type === 'atrule' && /keyframes$/.test(r.parent.name)) return;
  antes++;
  const fica = r.selectors.filter(serve);
  if (!fica.length) r.remove();
  else { r.selectors = fica; depois++; }
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
const CABECA = '/* gerado por moldes/lightspeed-varejo/ferramentas/construir.mjs a partir da captura renderizada de lightspeedhq.com/pos/retail (03/11/2026) — não editar à mão; ajuste vai em acabamento.css */\n';
const podado = path.join(AQUI, 'podado.css');
fs.writeFileSync(podado, CABECA + css.toString());
const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1);
console.log(`classes e ids usados: ${usadas.size} · regras: ${antes} → ${depois} · podado.css ${kb(podado)} KB`);
if (soPodar) process.exit(0);

// ---------- 3. veste papel por papel ----------
const NODE = process.execPath;
const vestido = path.join(AQUI, 'vestido.css');
const r = spawnSync(NODE, [path.join(CLONE, 'bin/vestir-css.mjs'), 'aplicar', podado, '--mapa', path.join(AQUI, 'mapa.json'),
  '--saida', vestido, '--raiz', '.mx-lightspeed-varejo', '--origem-css', path.join(MOLDE, 'origem.css')], { encoding: 'utf8' });
process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
if (r.status !== 0) { console.error('vestir-css falhou'); process.exit(1); }

// A prova carrega origem.css ANTES de molde.css: as variáveis da Lightspeed precisam ganhar das do SoftPay
// (acabamento.css define em .mx-lightspeed-varejo), então sobem para .mx-pagina .mx-lightspeed-varejo.
const oc = path.join(MOLDE, 'origem.css');
fs.writeFileSync(oc, fs.readFileSync(oc, 'utf8').replace(/(^|\n)\.mx-lightspeed-varejo\s*\{/g, '$1.mx-pagina .mx-lightspeed-varejo {')
  + '\n/* a prova renderiza só o modo origem: nada do acabamento do produto muda a letra ou a cor dela */\n');

// ---------- 4. molde.css ----------
const acab = fs.readFileSync(path.join(MOLDE, 'acabamento.css'), 'utf8');
fs.writeFileSync(path.join(MOLDE, 'molde.css'), fs.readFileSync(vestido, 'utf8') + '\n' + acab);
console.log(`molde.css ${kb(path.join(MOLDE, 'molde.css'))} KB · origem.css ${kb(oc)} KB`);
