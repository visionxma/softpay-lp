// Fotografa um HTML local no Chrome sem janela (porta 9444), num contexto próprio fechado no fim.
// uso: node tools/campanhas-imagens/fotografar.mjs <arquivo.html> <saida.png> <largura> <altura> [densidade=2]
import { chromium } from '/Users/victorgabryellferreiraqueiroz/.jarvis/design-engine/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
const [html, saida, w, h, dpr = '2'] = process.argv.slice(2);
const nav = await chromium.connectOverCDP('http://127.0.0.1:9444', { timeout: 60000 });
const ctx = await nav.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr });
try {
  const p = await ctx.newPage();
  await p.goto(pathToFileURL(html).href, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: saida, clip: { x: 0, y: 0, width: +w, height: +h } });
  console.log('ok', saida);
} finally { await ctx.close(); }
process.exit(0);
