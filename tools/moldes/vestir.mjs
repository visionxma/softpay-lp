#!/usr/bin/env node
// Veste as rotas de SEO com o molde clonado de cada uma (regra `rota-de-seo-e-clone-de-lp-diferente`).
//
// O build.py gera toda rota no molde de leitura (tools/template.py) e grava o conteúdo como dado em
// tools/conteudo/<slug>.json. Este script, para cada rota de rotas-clonadas.json:
//   1. importa <pasta>/molde.mjs e chama desenho(D) com o conteúdo da rota (D.origem = false);
//   2. troca o <main id="conteudo" class="page"> do HTML gerado pelo <main> do molde,
//      com data-molde="<id>" (o portão de rotas clonadas confere a página servida por ele);
//   3. publica <pasta>/molde.css, <pasta>/molde.js e <pasta>/publicar/* em public/moldes/<id>/,
//      com ?v=<hash do conteúdo> no endereço (arquivo que muda de conteúdo muda de endereço);
//   4. PORTÃO DE TEXTO: todo texto de busca da rota (h1, intro, títulos, parágrafos, itens, notas, tabelas,
//      exemplos, cartões, FAQ, links de "continue por aqui" e "veja também") tem de estar no <main> novo.
//      Faltou um, sai 1 e não grava a rota: a camada de busca nunca perde texto por causa do visual.
//
// Cabeçalho, rodapé, <head> (título, descrição, canonical, JSON-LD, pixel, consentimento) e os botões fixos
// continuam os do chassi gerado pelo template: o molde troca só o miolo.
//
// uso: node tools/moldes/vestir.mjs [--so /segmentos/x/] [--seco]   (--seco: confere sem gravar)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const PUBLIC = path.join(RAIZ, 'public');
const CONTEUDO = path.join(RAIZ, 'tools', 'conteudo');
const CONTRATO = path.join(RAIZ, 'rotas-clonadas.json');

const args = process.argv.slice(2);
const so = args.includes('--so') ? args[args.indexOf('--so') + 1] : null;
const seco = args.includes('--seco');

if (!fs.existsSync(CONTRATO)) { console.log('vestir: sem rotas-clonadas.json, nada a vestir'); process.exit(0); }
const contrato = JSON.parse(fs.readFileSync(CONTRATO, 'utf8'));
const rotas = Object.entries(contrato.rotas || {}).filter(([r]) => !so || r === so);

// Mesmos links do template.py (o cadastro leva o código de afiliado; "Entrar" vai para APP).
const tpl = fs.readFileSync(path.join(RAIZ, 'tools', 'template.py'), 'utf8');
const constante = (nome) => {
  const m = tpl.match(new RegExp(`^${nome} = \\(?([\\s\\S]*?)\\)?\\s*(?:#.*)?$`, 'm'));
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]*)"/g)].map((x) => x[1]).join('');
};
const LINKS = { app: constante('APP'), cadastro: constante('CADASTRO'), wpp: constante('WPP') };
if (!LINKS.cadastro || !LINKS.wpp) { console.error('vestir: não achei CADASTRO/WPP no template.py'); process.exit(2); }

const hash = (arq) => crypto.createHash('sha256').update(fs.readFileSync(arq)).digest('hex').slice(0, 10);

// ---------- texto visível (para o portão) ----------
const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', ndash: '–', mdash: '—', hellip: '…' };
const desentidade = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&([a-z]+);/gi, (m, n) => ENTIDADES[n.toLowerCase()] ?? m);
const plano = (html) => desentidade(String(html ?? '')
  .replace(/<(script|style|template)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' '))
  .replace(/[ \s]+/g, ' ').trim().toLowerCase();
// O que não se vê não conta: `hidden`, aria-hidden e o modo origem nunca vão para a rota.
const visivel = (html) => html
  .replace(/<([a-z0-9-]+)\b[^>]*\s(?:hidden|aria-hidden="true")[^>]*>[\s\S]*?<\/\1>/gi, ' ');

function textosDaRota(D) {
  const t = [];
  const add = (rotulo, html) => { const s = plano(html); if (s.length > 1) t.push([rotulo, s]); };
  add('h1', D.h1); add('intro', D.intro);
  for (const b of D.blocks || []) {
    if (b.tipo === 'html') { add('bloco html', b.html); continue; }
    add('título da seção', b.titulo);
    for (const x of b.partes || []) {
      if (x.tipo === 'p' || x.tipo === 'h3') add(x.tipo, x.texto);
      else if (x.tipo === 'ul' || x.tipo === 'ol') x.itens.forEach((i) => add(`item de ${x.tipo}`, i));
      else if (x.tipo === 'nota') { add('título da nota', x.titulo); add('nota', x.texto); }
      else if (x.tipo === 'exemplo') { add('título do exemplo', x.titulo); x.linhas.forEach((l) => { add('rótulo do exemplo', l.rotulo); add('valor do exemplo', l.valor); }); if (x.rodape) add('rodapé do exemplo', x.rodape); }
      else if (x.tipo === 'tabela') { x.cabecalho.forEach((c) => add('cabeçalho da tabela', c)); x.linhas.flat().forEach((c) => add('célula da tabela', c)); }
      else if (x.tipo === 'cards') x.itens.forEach((c) => { add('título do cartão', c.titulo); add('texto do cartão', c.texto); });
      else if (x.tipo === 'html') add('trecho html', x.html);
    }
  }
  for (const [q, a] of D.faq || []) { add('pergunta do FAQ', q); add('resposta do FAQ', a); }
  if (D.cta_title) add('título da chamada', D.cta_title);
  if (D.cta_text) add('texto da chamada', D.cta_text);
  return t;
}

function hrefsDaRota(D) {
  const h = [];
  for (const r of D.related || []) h.push(r[1] ?? r.href);
  for (const m of D.mais || []) h.push(m[1]);
  for (const b of D.breadcrumbs || []) if (b[1]) h.push(b[1]);
  return h.filter(Boolean);
}

function portaoDeTexto(rota, D, mainHtml) {
  const corpo = plano(visivel(mainHtml));
  const faltas = [];
  for (const [rotulo, s] of textosDaRota(D)) if (!corpo.includes(s)) faltas.push(`${rotulo}: "${s.slice(0, 90)}"`);
  for (const href of hrefsDaRota(D)) if (!mainHtml.includes(`href="${href}"`)) faltas.push(`link: ${href}`);
  const h1s = [...mainHtml.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => plano(m[1]));
  if (h1s.length !== 1) faltas.push(`a rota tem ${h1s.length} <h1> (precisa de exatamente 1)`);
  else if (h1s[0] !== plano(D.h1)) faltas.push(`o <h1> mudou: "${h1s[0]}" ≠ "${plano(D.h1)}"`);
  if (!mainHtml.includes(LINKS.cadastro.replace(/&/g, '&amp;')) && !mainHtml.includes(LINKS.cadastro)) faltas.push('nenhum botão leva ao cadastro com o código de afiliado');
  return faltas;
}

// ---------- publicação dos arquivos do molde ----------
function publicarArquivos(id, pasta) {
  const destino = path.join(PUBLIC, 'moldes', id);
  const v = {};
  const copia = (de, para) => {
    fs.mkdirSync(path.dirname(para), { recursive: true });
    if (!seco) fs.copyFileSync(de, para);
    v['/' + path.relative(PUBLIC, para).split(path.sep).join('/')] = hash(de);
  };
  for (const f of ['molde.css', 'molde.js']) if (fs.existsSync(path.join(pasta, f))) copia(path.join(pasta, f), path.join(destino, f));
  const pub = path.join(pasta, 'publicar');
  if (fs.existsSync(pub)) {
    const anda = (d) => { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); if (fs.statSync(p).isDirectory()) anda(p); else copia(p, path.join(destino, path.relative(pub, p))); } };
    anda(pub);
  }
  return v;
}

// ---------- veste cada rota ----------
let falhou = 0; let vestidas = 0;
for (const [rota, e] of rotas) {
  const slug = rota.replace(/^\/|\/$/g, '');
  const arqConteudo = path.join(CONTEUDO, slug + '.json');
  const arqHtml = path.join(PUBLIC, slug, 'index.html');
  const pasta = path.join(RAIZ, e.pasta);
  const moldeMjs = path.join(pasta, 'molde.mjs');
  if (!fs.existsSync(moldeMjs)) { console.log(`  · ${rota}: molde ${e.molde} ainda sem molde.mjs (fica no molde de leitura)`); continue; }
  if (!fs.existsSync(arqConteudo) || !fs.existsSync(arqHtml)) { console.error(`  ✗ ${rota}: falta ${!fs.existsSync(arqConteudo) ? arqConteudo : arqHtml}`); falhou++; continue; }

  const D = JSON.parse(fs.readFileSync(arqConteudo, 'utf8'));
  const versoes = publicarArquivos(e.molde, pasta);
  const v = (endereco) => (versoes[endereco] ? `${endereco}?v=${versoes[endereco]}` : endereco);
  const mod = await import(pathToFileURL(moldeMjs).href + `?t=${Date.now()}`);
  if (typeof mod.desenho !== 'function') { console.error(`  ✗ ${rota}: ${e.pasta}/molde.mjs não exporta desenho(D)`); falhou++; continue; }
  const miolo = mod.desenho({ ...D, origem: false, rota, links: LINKS, v, base: `/moldes/${e.molde}` });

  const faltas = portaoDeTexto(rota, D, miolo);
  if (faltas.length) {
    console.error(`  ✗ ${rota} (${e.molde}): ${faltas.length} texto(s) de busca sumiram do molde:`);
    for (const f of faltas.slice(0, 25)) console.error(`      - ${f}`);
    if (faltas.length > 25) console.error(`      … e mais ${faltas.length - 25}`);
    falhou++; continue;
  }

  let html = fs.readFileSync(arqHtml, 'utf8');
  const ini = html.indexOf('<main id="conteudo"');
  const fim = html.indexOf('</main>', ini);
  if (ini < 0 || fim < 0) { console.error(`  ✗ ${rota}: não achei o <main id="conteudo"> no HTML gerado`); falhou++; continue; }
  const classeExtra = mod.meta?.classeRaiz ? ` ${mod.meta.classeRaiz}` : '';
  html = html.slice(0, ini)
    + `<main id="conteudo" class="page-molde mx-${e.molde}${classeExtra}" data-molde="${e.molde}">\n${miolo}\n    </main>`
    + html.slice(fim + '</main>'.length);
  // rodar de novo não duplica: tira o CSS e o JS de molde que a página já tinha
  html = html.replace(/\s*<link rel="stylesheet" href="\/moldes\/[^"]+\/molde\.css[^"]*">/g, '')
    .replace(/\s*<script src="\/moldes\/[^"]+\/molde\.js[^"]*" defer><\/script>/g, '');
  if (versoes[`/moldes/${e.molde}/molde.css`]) {
    html = html.replace('</head>', `    <link rel="stylesheet" href="${v(`/moldes/${e.molde}/molde.css`)}">\n</head>`);
  }
  if (versoes[`/moldes/${e.molde}/molde.js`]) {
    html = html.replace('</body>', `    <script src="${v(`/moldes/${e.molde}/molde.js`)}" defer></script>\n</body>`);
  }
  if (!seco) fs.writeFileSync(arqHtml, html);
  vestidas++;
  console.log(`  ✓ ${rota} vestida com ${e.molde} (${e.referencia})`);
}
console.log(`vestir: ${vestidas} rota(s) vestida(s)${seco ? ' (seco, nada gravado)' : ''}, ${falhou} com defeito`);
process.exit(falhou ? 1 : 0);
