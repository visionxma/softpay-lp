#!/usr/bin/env node
// Portão do topo do site SoftPay (15/11/2026), no molde do scripts/portao-topo.mjs do FINAGRO-LP
// (regra `topo-sem-item-sobreposto`): mede a barra em 16 larguras, nos dois estados (estendida no alto da
// página e cápsula depois de rolar), e sai 1 se
//   · choque     — um item (logo, link do menu, iPhone, Entrar, Testar grátis, menu) passa por cima de outro;
//   · fora       — um item sai da tela;
//   · rolagem    — a página ganha rolagem lateral;
//   · centro     — com o menu à vista, o centro dele se afasta mais de 12 px do centro da barra
//                  (a mesma régua do `abas-no-centro` do portao-lp-victor.mjs);
//   · respiro    — com o menu à vista, sobra menos de 24 px entre o menu e o logo ou entre o menu e as ações
//                  (o link de menos prioridade tem de sair da barra ANTES de encostar);
//   · grupo      — o grupo que o `abas-no-centro` do portao-lp-victor.mjs toma por "abas" (3+ links diretos,
//                  o de menos links) não é o menu: aí ele mede as ações e reprova uma barra centrada.
// Nasceu de 14/11/2026: o portão das correções reprovava /segmentos/* em abas-no-centro (479 px em 1440) porque
// media o grupo das ações (iPhone, Entrar, Testar grátis), e a cápsula de 1440 tinha "Planos" 7 px por baixo do
// botão do iPhone (24 px em "Dúvidas", na home).
//
// uso: node tools/portao-topo.mjs <url-base> [caminho ...] [--foto <pasta>] [--larguras 360,390,...]
//      ex.: node tools/portao-topo.mjs http://127.0.0.1:8791 / /segmentos/mercadinho/
//           node tools/portao-topo.mjs https://site.softpaybr.com / /segmentos/loja-de-roupas/ --foto /tmp/topo
// Navegador: CHROME_PORTAO=<binário> (no servidor Linux o Chromium precisa de --no-sandbox, que vai sozinho).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
const require = createRequire(import.meta.url);
const carregar = () => {
  for (const c of [process.env.PLAYWRIGHT_CORE, 'playwright-core', `${os.homedir()}/.jarvis/design-engine-deps/node_modules/playwright-core`,
    `${os.homedir()}/.jarvis/design-engine/node_modules/playwright-core`].filter(Boolean)) {
    try { return require(c); } catch { /* próximo */ }
  }
  throw new Error('playwright-core não encontrado (PLAYWRIGHT_CORE=<pasta>)');
};
const { chromium } = carregar();

const args = process.argv.slice(2);
const op = (n) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : null; };
const soltos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const [base, ...caminhos] = soltos;
if (!base) { console.error('uso: node tools/portao-topo.mjs <url-base> [caminho ...] [--foto <pasta>]'); process.exit(2); }
const pastaFoto = op('foto');
const LARGURAS = (op('larguras') || '360,390,414,640,768,900,992,1024,1100,1180,1280,1366,1440,1536,1680,1920').split(',').map(Number);
const RESPIRO = 24, CENTRO = 12;

const linux = os.platform() === 'linux';
const chromeLinux = `${os.homedir()}/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome`;
const exe = process.env.CHROME_PORTAO || (linux && fs.existsSync(chromeLinux) ? chromeLinux : undefined);
const nav = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), headless: true, args: linux ? ['--no-sandbox', '--hide-scrollbars'] : ['--hide-scrollbars'] });

const medir = () => {
  const barra = document.querySelector('nav.nav');
  if (!barra) return { erro: 'sem nav.nav' };
  const visivel = (e) => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const b = e.getBoundingClientRect(); return b.width >= 2 && b.height >= 2 ? b : null; };
  const nome = (e) => (e.textContent || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 22);
  const zonas = { logo: [...barra.querySelectorAll('.nav__logo')], menu: [...barra.querySelectorAll('.nav__menu > a')],
    acoes: [...barra.querySelectorAll('.nav__iphone, .nav__entrar, .btn--acao, .nav__hamburguer')] };
  const itens = [];
  for (const [zona, els] of Object.entries(zonas)) for (const e of els) { const b = visivel(e); if (b) itens.push({ zona, nome: nome(e) || zona, x: b.left, d: b.right, y: b.top, b: b.bottom }); }
  const choques = [];
  for (let i = 0; i < itens.length; i++) for (let j = i + 1; j < itens.length; j++) {
    const a = itens[i], c = itens[j];
    const sobre = Math.min(a.d, c.d) - Math.max(a.x, c.x), vert = Math.min(a.b, c.b) - Math.max(a.y, c.y);
    if (sobre > 0 && vert > 0) choques.push(`${a.nome} × ${c.nome} (${Math.round(sobre)}px)`);
  }
  const fora = itens.filter((i) => i.x < -0.5 || i.d > innerWidth + 0.5).map((i) => i.nome);
  const menu = itens.filter((i) => i.zona === 'menu'), logo = itens.filter((i) => i.zona === 'logo'), acoes = itens.filter((i) => i.zona === 'acoes');
  const rb = barra.getBoundingClientRect();
  let centro = null, respiro = null;
  if (menu.length) {
    const mx = Math.min(...menu.map((i) => i.x)), md = Math.max(...menu.map((i) => i.d));
    centro = Math.round(Math.max(Math.abs((mx + md) / 2 - (rb.left + rb.width / 2)), Math.abs((mx + md) / 2 - innerWidth / 2)));
    const esq = logo.length ? mx - Math.max(...logo.map((i) => i.d)) : Infinity;
    const dir = acoes.length ? Math.min(...acoes.map((i) => i.x)) - md : Infinity;
    respiro = Math.round(Math.min(esq, dir));
  }
  // o mesmo critério do abas-no-centro do portao-lp-victor.mjs: o grupo com 3+ links diretos à vista e o MENOR número de links
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility === 'visible' && cs.display !== 'none' && r.top < 140 && r.bottom > 0 && r.right > 0 && r.left < innerWidth; };
  const grupos = [...barra.querySelectorAll('nav,ul,div')].filter((g) => vis(g) && [...g.querySelectorAll(':scope > a, :scope > li > a')].filter(vis).length >= 3);
  const grupo = grupos.length ? grupos.sort((a, b) => a.querySelectorAll('a').length - b.querySelectorAll('a').length)[0].className : null;
  return { choques, fora, rolagem: document.documentElement.scrollWidth - innerWidth, centro, respiro, grupo,
    links: menu.map((i) => i.nome), acoes: acoes.map((i) => i.nome), estado: barra.getAttribute('data-topo'), largBarra: Math.round(rb.width) };
};

let falhas = 0, medidas = 0;
try {
  for (const caminho of caminhos.length ? caminhos : ['/']) {
    console.log(`\n### ${base}${caminho}`);
    for (const w of LARGURAS) {
      const fotoAqui = pastaFoto && [390, 1440].includes(w);
      const ctx = await nav.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: fotoAqui ? 2 : 1 });
      const pag = await ctx.newPage();
      await pag.goto(base + caminho + (base.startsWith('https') ? '?v=' + Date.now() : ''), { waitUntil: 'domcontentloaded', timeout: 60000 });
      await pag.waitForTimeout(1200);
      await pag.evaluate(() => document.fonts.ready);
      for (const estado of ['topo', 'rolado']) {
        if (estado === 'rolado') {
          await pag.evaluate(() => window.scrollTo(0, 700)); await pag.waitForTimeout(900);
          await pag.evaluate(() => { const c = document.querySelector('nav.nav'); if (c && c.getAnimations) c.getAnimations({ subtree: true }).forEach((a) => { try { if (isFinite(a.effect.getComputedTiming().endTime)) a.finish(); } catch {} }); });
        }
        const r = await pag.evaluate(medir);
        medidas++;
        const erros = [];
        if (r.erro) erros.push(r.erro);
        else {
          erros.push(...r.choques, ...r.fora.map((f) => 'fora da tela: ' + f));
          if (r.rolagem > 0) erros.push(`rolagem lateral de ${r.rolagem}px`);
          if (r.centro != null && r.centro > CENTRO) erros.push(`menu ${r.centro}px fora do centro`);
          if (r.respiro != null && r.respiro < RESPIRO) erros.push(`respiro de ${r.respiro}px (mínimo ${RESPIRO})`);
          if (r.grupo && !/nav__menu/.test(r.grupo)) erros.push(`o abas-no-centro mediria "${r.grupo}", não o menu`);
        }
        if (erros.length) falhas++;
        const det = r.erro ? '' : ` [${r.estado} ${r.largBarra}px] links=${r.links.length ? r.links.join('|') : '—'} centro=${r.centro ?? '—'} respiro=${r.respiro ?? '—'}`;
        console.log(`${erros.length ? 'XX' : 'ok'} ${String(w).padStart(4)}px ${estado.padEnd(6)}${det}${erros.length ? ' :: ' + erros.join(' · ') : ''}`);
        if (fotoAqui) {
          fs.mkdirSync(pastaFoto, { recursive: true });
          const nomeArq = `${pastaFoto}/topo${caminho.replace(/\/+/g, '-').replace(/-$/, '') || '-home'}-${w}-${estado}.png`;
          await pag.screenshot({ path: nomeArq, clip: { x: 0, y: 0, width: w, height: w < 600 ? 84 : 104 } });
        }
      }
      await ctx.close();
    }
  }
} finally { await nav.close(); }
console.log(falhas ? `\n${falhas} de ${medidas} medida(s) com problema` : `\ntopo sem choque, centrado e com respiro nas ${medidas} medidas`);
process.exit(falhas ? 1 : 0);
