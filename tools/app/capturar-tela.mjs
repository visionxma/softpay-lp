// Captura uma tela do app SoftPay, na aba que JÁ EXISTE (9333), sem os avisos flutuantes
// (cookies, instalar app, toast do suporte, aviso de atualização, alça da extensão). Nunca /admin.
// Celular por padrão (390x844, densidade 3); --largura/--altura/--dpr para o computador.
// uso: node tools/app/capturar-tela.mjs <rota> <saida.png> [--largura=390] [--altura=844] [--dpr=3]
//        [--listar] [--y=<rolagem>] [--ancora="texto"] [--inteira] [--clicar="texto"] [--ocultar="Nome A|Nome B"]
import fs from 'node:fs';
import { chromium } from '/Users/victorgabryellferreiraqueiroz/.jarvis/design-engine/node_modules/playwright/index.mjs';

const [rota, saida] = process.argv.slice(2);
const opt = Object.fromEntries(process.argv.slice(4).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const W = +(opt.largura || 390), H = +(opt.altura || 844), DPR = +(opt.dpr || 3);
const nav = await chromium.connectOverCDP('http://127.0.0.1:9333', { timeout: 60000 });
const ctx = nav.contexts()[0];
const aba = ctx.pages().find((p) => p.url().includes('www.softpaybr.com'));
const cdp = await ctx.newCDPSession(aba);
try {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: W < 768 });
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
  // esconde os avisos flutuantes pelo texto (nada é clicado; some ao navegar); cabeçalho,
  // menu lateral e barra de baixo do app ficam
  await aba.evaluate((nomes) => {
    const some = (e) => e.style.setProperty('display', 'none', 'important');
    for (const e of document.querySelectorAll('body *')) {
      if (getComputedStyle(e).position !== 'fixed') continue;
      if (/Usamos cookies|Instale o SoftPay|Nova mensagem do Suporte|Nova atualização disponível/.test(e.innerText || '')) some(e);
    }
    for (const e of [...document.documentElement.children, ...document.body.children]) if (e.tagName.includes('-') || e.shadowRoot) some(e);
    document.querySelectorAll('[data-sonner-toaster], ol.toaster, section[aria-label^="Notifications"]').forEach(some);
    // computador: o botão flutuante do suporte (fone de ouvido, canto de baixo à direita)
    if (innerWidth >= 768) for (const e of document.querySelectorAll('body *')) {
      if (getComputedStyle(e).position !== 'fixed') continue;
      const r = e.getBoundingClientRect();
      if (r.width < 100 && r.height < 100 && r.right > innerWidth - 120 && r.bottom > innerHeight - 140) some(e);
    }
    // --ocultar: produtos de teste da equipe saem da grade (sobe até o cartão do produto)
    for (const el of document.querySelectorAll('body *')) {
      if (el.children.length || !nomes.includes((el.textContent || '').trim())) continue;
      let c = el; while (c.parentElement && c.parentElement.children.length === 1 || (c.parentElement && c.parentElement.getBoundingClientRect().height < 260 && c.parentElement.getBoundingClientRect().width < 400)) c = c.parentElement;
      some(c);
    }
  }, opt.ocultar ? opt.ocultar.split('|') : []);
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
    ? { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: await aba.evaluate(() => document.documentElement.scrollHeight), scale: 1 } }
    : { format: 'png' });
  fs.writeFileSync(saida, Buffer.from(r.data, 'base64'));
  console.log('ok', saida, aba.url());
} finally {
  await cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => {});
  await aba.goto('https://www.softpaybr.com/relatorios', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await cdp.detach().catch(() => {});
}
process.exit(0);
