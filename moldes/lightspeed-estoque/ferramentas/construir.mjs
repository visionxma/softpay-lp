#!/usr/bin/env node
// Monta o CSS do molde lightspeed-estoque a partir do CSS escopado da captura da Lightspeed
// (lightspeedhq.com/pos/retail/inventory-management, 03/11/2026).
//
//   ferramentas/podado.css  = o CSS escopado em .mx-lightspeed-estoque só com as regras cujas classes e ids aparecem no
//                             HTML do molde (modo origem e modo produto); o resto do tema da Lightspeed sai;
//   origem.css              = as variáveis com as cores e fontes da PRÓPRIA Lightspeed (só a prova carrega);
//   molde.css               = podado.css vestido papel por papel (vestir-css.mjs + ferramentas/mapa.json)
//                             + acabamento.css (a identidade do SoftPay e o que é só do produto).
//
// uso: node moldes/lightspeed-estoque/ferramentas/construir.mjs [--so-podar] [<css-escopado>]
//      (padrão: ferramentas/escopado.css; gerado por escopar-css.mjs a partir de captura/estilos 02 e 03)
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
const rota = JSON.parse(fs.readFileSync(path.join(PROJETO, 'tools/conteudo/solucoes/sistema-de-estoque.json'), 'utf8'));
const htmls = [
  mod.render({ ...origem, modo: 'origem' }),
  mod.desenho({ ...rota, origem: false, rota: '/solucoes/sistema-de-estoque/', links: { app: '#', cadastro: '#', wpp: '#' }, v: (u) => u, base: '/moldes/lightspeed-estoque' }),
];
const desfaz = (s) => s.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"');
// iti e gb-recaptcha vêm do miolo do formulário da origem; o swiper marca as classes de estado em tempo de execução
const usadas = new Set(['mx-lightspeed-estoque', 'mx-pagina', 'js-ok', 'lazyloaded', 'swiper-slide-active', 'swiper-slide-next', 'swiper-slide-visible', 'swiper-slide-fully-visible']);
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
const CABECA = '/* gerado por moldes/lightspeed-estoque/ferramentas/construir.mjs a partir da captura renderizada de lightspeedhq.com/pos/retail/inventory-management (03/11/2026) — não editar à mão; ajuste vai em acabamento.css */\n';
const podado = path.join(AQUI, 'podado.css');
fs.writeFileSync(podado, CABECA + css.toString());
const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1);
console.log(`classes e ids usados: ${usadas.size} · regras: ${antes} → ${depois} · podado.css ${kb(podado)} KB`);
if (soPodar) process.exit(0);

// ---------- 3. veste papel por papel ----------
const NODE = process.execPath;
const vestido = path.join(AQUI, 'vestido.css');
const r = spawnSync(NODE, [path.join(CLONE, 'bin/vestir-css.mjs'), 'aplicar', podado, '--mapa', path.join(AQUI, 'mapa.json'),
  '--saida', vestido, '--raiz', '.mx-lightspeed-estoque', '--origem-css', path.join(MOLDE, 'origem.css')], { encoding: 'utf8' });
process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
if (r.status !== 0) { console.error('vestir-css falhou'); process.exit(1); }

// A prova carrega origem.css ANTES de molde.css: as variáveis da Lightspeed precisam ganhar das do SoftPay
// (acabamento.css define em .mx-lightspeed-estoque), então sobem para .mx-pagina .mx-lightspeed-estoque.
const oc = path.join(MOLDE, 'origem.css');
fs.writeFileSync(oc, fs.readFileSync(oc, 'utf8').replace(/(^|\n)\.mx-lightspeed-estoque\s*\{/g, '$1.mx-pagina .mx-lightspeed-estoque {')
  + '\n/* a prova renderiza só o modo origem: nada do acabamento do produto muda a letra ou a cor dela */\n'
  // o que o script da Lightspeed faz por largura e a captura (feita em 1440) não guardou:
  //  - altura igual dos cartões de uma fileira só de 960 para cima (abaixo ele a zera, um cartão por linha);
  //  - o swiper mede os cartões do carrossel pela largura: 384 + 24 no computador, 267 + 16 no celular;
  //  - a página dela corta na borda da tela o cartão seguinte do carrossel (o body não rola de lado).
  + '@media (min-width: 960px) { .mx-pagina .mx-lightspeed-estoque [data-element-reset-height] { min-height: var(--lv-minh, 0); } }\n'
  + '@media (max-width: 767.98px) { .mx-pagina .mx-lightspeed-estoque .swiper-slide { width: 267px !important; margin-right: 16px !important; } }\n'
  + '.mx-pagina .mx-lightspeed-estoque { overflow-x: clip; }\n'
  //  - o reCAPTCHA dela (78 px, um iframe que a captura não traz) ocupa o lugar acima do botão do formulário.
  + '.mx-pagina .mx-lightspeed-estoque .gb-recaptcha:empty::before { content: ""; display: block; height: 78px; }\n');

// ---------- 4. molde.css ----------
const acab = fs.readFileSync(path.join(MOLDE, 'acabamento.css'), 'utf8');
fs.writeFileSync(path.join(MOLDE, 'molde.css'), fs.readFileSync(vestido, 'utf8') + '\n' + acab);
console.log(`molde.css ${kb(path.join(MOLDE, 'molde.css'))} KB · origem.css ${kb(oc)} KB`);
