// Monta o molde.css: o CSS da Clover já vestido por papel (trabalho/vestido.css) + o acabamento escrito à mão.
// O vestir-css troca a família nas declarações de font-family, mas não dentro dos atalhos `font:` guardados em
// variável (--font-modern-h1: 300 4rem/1.1 altform,sans-serif): aqui eles passam a ler os papéis de fonte.
// Ordem completa: purgar-estatico.mjs → vestir-css.mjs aplicar → montar-css.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let css = fs.readFileSync(path.join(AQUI, 'trabalho/vestido.css'), 'utf8');
let trocas = 0;
css = css.replace(/(\b(?:altform|Formula-Black)\b)\s*,\s*sans-serif/gi, () => { trocas++; return 'var(--m-f-titulo)'; })
  .replace(/\bgraphik(?:-light|-medium)?\b\s*,\s*sans-serif/gi, () => { trocas++; return 'var(--m-f-corpo)'; });
const sobra = css.match(/\b(altform|graphik[\w-]*|Formula-Black)\b/gi) || [];
const acabamento = fs.readFileSync(path.join(AQUI, 'acabamento.css'), 'utf8');
fs.writeFileSync(path.join(AQUI, 'molde.css'), css + '\n' + acabamento);
console.log(`fontes em atalho trocadas: ${trocas} · nomes da Clover que sobraram: ${sobra.length ? [...new Set(sobra)].join(', ') : 'nenhum'} · molde.css ${(fs.statSync(path.join(AQUI, 'molde.css')).size / 1024).toFixed(1)} KB`);
