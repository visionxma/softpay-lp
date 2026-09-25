// Captura do app SoftPay no layout de celular, na aba que JÁ EXISTE (9333), sem os avisos
// flutuantes (cookies, instalar app, toast do suporte, alça lateral). Nunca /admin.
// uso: node tools/app/capturar-tela.mjs <rota> <saida.png> [--listar] [--y=<rolagem>] [--inteira] [--clicar="texto"]
import fs from 'node:fs';
import { chromium } from '/Users/victorgabryellferreiraqueiroz/.jarvis/design-engine/node_modules/playwright/index.mjs';

const [rota, saida] = process.argv.slice(2);
const opt = Object.fromEntries(process.argv.slice(4).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const nav = await chromium.connectOverCDP('http://127.0.0.1:9333', { timeout: 60000 });
const ctx = nav.contexts()[0];
const aba = ctx.pages().find((p) => p.url().includes('www.softpaybr.com'));
const cdp = await ctx.newCDPSession(aba);
try {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  await aba.goto('https://www.softpaybr.com' + rota, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await aba.waitForTimeout(6000);
  if (/\/admin|\/auth/.test(aba.url())) { console.log('recusado:', aba.url()); process.exit(0); }
  if (opt.clicar) { await aba.getByText(opt.clicar, { exact: true }).first().click(); await aba.waitForTimeout(2500); }
  const fixos = await aba.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => {
    const s = getComputedStyle(e); return (s.position === 'fixed' || s.position === 'sticky') && e.offsetWidth > 20;
  }).map((e) => { const r = e.getBoundingClientRect(); return {
    tag: e.tagName, cls: (e.className?.baseVal ?? e.className ?? '').toString().slice(0, 70), txt: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50),
    x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), pos: getComputedStyle(e).position }; }));
  const estranhos = await aba.evaluate(() => [...document.documentElement.children, ...document.body.children]
    .filter((e) => e.tagName.includes('-') || e.shadowRoot || !['HEAD','BODY','SCRIPT','STYLE','LINK','NOSCRIPT','DIV','TEMPLATE'].includes(e.tagName))
    .map((e) => e.tagName + (e.id ? '#' + e.id : '') + (e.shadowRoot ? ' [shadow]' : '')));
  if (opt.listar) { console.log('fora do app:', JSON.stringify(estranhos)); }
  if (opt.listar) { console.log(JSON.stringify(fixos, null, 0).replace(/},{/g, '},\n{')); }
  // esconde os avisos flutuantes (nada é clicado; some ao navegar)
  await aba.evaluate(() => {
    for (const e of document.querySelectorAll('body *')) {
      const s = getComputedStyle(e);
      if (s.position !== 'fixed') continue;
      const t = (e.innerText || '').trim();
      const r = e.getBoundingClientRect();
      const ehNavBaixo = r.bottom >= innerHeight - 2 && r.height < 110 && /Início|Vendas|Estoque|Mais/.test(t) && !/cookies|Instale/.test(t);
      const ehTopo = r.top <= 1 && r.height < 90 && !/Nova mensagem|cookies|Instale/.test(t);
      if (!ehNavBaixo && !ehTopo) e.style.setProperty('display', 'none', 'important');
    }
    for (const e of [...document.documentElement.children, ...document.body.children])
      if (e.tagName.includes('-') || e.shadowRoot) e.style.setProperty('display', 'none', 'important');
    document.querySelectorAll('[data-sonner-toaster], section[aria-label^="Notifications"]').forEach((e) => e.style.setProperty('display', 'none', 'important'));
  });
  if (opt.ancora) {
    opt.y = await aba.evaluate((t) => {
      const h = [...document.querySelectorAll('h1,h2,h3,h4,p,span,div')].find((e) => e.children.length === 0 && e.textContent.trim() === t);
      const topo = document.querySelector('header')?.getBoundingClientRect().height || 0;
      return Math.max(0, Math.round(h.getBoundingClientRect().top + scrollY - topo - 22));
    }, opt.ancora);
    console.log('rolagem', opt.y);
  }
  // pt-BR: a margem sai com ponto no app ("57.8%"); na foto, vírgula
  await aba.evaluate(() => { for (const e of document.querySelectorAll('body *')) if (e.children.length === 0 && /^\d+\.\d+%$/.test(e.textContent.trim())) e.textContent = e.textContent.replace('.', ','); });
  if (opt.y) { await aba.evaluate((y) => window.scrollTo({ top: +y, behavior: 'instant' }), opt.y); await aba.waitForTimeout(900); }
  const r = await cdp.send('Page.captureScreenshot', opt.inteira
    ? { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 390, height: await aba.evaluate(() => document.documentElement.scrollHeight), scale: 1 } }
    : { format: 'png' });
  fs.writeFileSync(saida, Buffer.from(r.data, 'base64'));
  console.log('ok', saida, aba.url());
} finally {
  await cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => {});
  await aba.goto('https://www.softpaybr.com/relatorios', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await cdp.detach().catch(() => {});
}
process.exit(0);
