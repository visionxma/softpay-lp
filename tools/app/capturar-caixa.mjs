// Captura o Caixa (PDV) do app SoftPay com uma venda montada no carrinho, na aba que JÁ
// EXISTE no Chrome do agente (9333): nenhuma página ou contexto novo, navegador nunca
// fechado, nunca /admin. A venda NÃO é finalizada, e o carrinho não fica: ele vive só na
// memória da página (medido em 25/09: recarregar a página zera), e o fim do script navega.
// Esconde só o que é aviso flutuante (cookies, "Instalar app", toast do suporte, a alça
// da extensão CodeMirror e o selo de latência "NNNms" do cabeçalho do caixa).
//
// uso: node tools/app/capturar-caixa.mjs <largura> <altura> <dpr> <saida.png> [--itens="A|B|C"] [--sem-resumo] [--abrir-carrinho] [--ocultar="Nome A|Nome B"] [--listar]
//   padrão dos itens: a venda de R$ 414,60 das peças (camiseta, batom, perfume, tênis)
import fs from 'node:fs';
import { chromium } from '/Users/victorgabryellferreiraqueiroz/.jarvis/design-engine/node_modules/playwright/index.mjs';

const [w, h, dpr, saida] = process.argv.slice(2);
const opt = Object.fromEntries(process.argv.slice(6).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const itens = (opt.itens || 'Camiseta Básica Algodão|Batom Matte Vermelho|Perfume Floral Feminino 100ml|Tênis Casual Branco').split('|');
const celular = +w < 768;

const nav = await chromium.connectOverCDP('http://127.0.0.1:9333', { timeout: 60000 });
const ctx = nav.contexts()[0];
const aba = ctx.pages().find((p) => p.url().includes('www.softpaybr.com'));
const cdp = await ctx.newCDPSession(aba);

async function limparAvisos(semResumo) {
  await aba.evaluate((semResumo) => {
    const some = (e) => e.style.setProperty('display', 'none', 'important');
    for (const e of [...document.documentElement.children, ...document.body.children]) if (e.tagName.includes('-') || e.shadowRoot) some(e);
    document.querySelectorAll('[data-sonner-toaster], ol.toaster').forEach(some);
    for (const e of document.querySelectorAll('body *')) {
      if (getComputedStyle(e).position !== 'fixed') continue;
      if (/Usamos cookies|Instale o SoftPay|Nova mensagem do Suporte|Nova atualização disponível/.test(e.innerText || '')) some(e);
    }
    // selo de latência do caixa ("268ms"): medição interna, não é informação do lojista
    for (const e of document.querySelectorAll('body *'))
      if (e.children.length <= 1 && /^\s*\d{2,4}\s?ms\s*$/.test(e.textContent || '')) {
        let s = e; while (s.parentElement && s.parentElement.getBoundingClientRect().width < 130 && s.parentElement.textContent.trim() === e.textContent.trim()) s = s.parentElement;
        s.style.visibility = 'hidden';
      }
    // --sem-resumo: a faixa "Vendas: 0 · Faturamento: R$ 0,00" do turno (estatística do caixa
    // aberto hoje, não faz parte da venda que a foto mostra)
    if (semResumo) {
      const cands = [...document.querySelectorAll('body *')].filter((e) => /^Vendas:\s*\d+\s*Faturamento:\s*R\$/.test((e.innerText || '').trim()));
      const menor = cands.sort((a, b) => a.innerText.length - b.innerText.length || b.querySelectorAll('*').length - a.querySelectorAll('*').length)[0];
      if (menor) { let alvo = menor; while (alvo.parentElement && alvo.parentElement.innerText.trim() === menor.innerText.trim()) alvo = alvo.parentElement; alvo.style.setProperty('visibility', 'hidden', 'important'); }
    }
  }, semResumo);
}

async function ocultarProdutos(nomes) {
  if (!nomes.length) return;
  const n = await aba.evaluate((nomes) => {
    let k = 0;
    for (const el of document.querySelectorAll('body *')) {
      if (el.children.length || !nomes.includes((el.textContent || '').trim())) continue;
      // sobe até o cartão: o maior ancestral que ainda cabe numa coluna da grade
      let c = el; while (c.parentElement && c.parentElement.children.length === 1 || (c.parentElement && c.parentElement.getBoundingClientRect().height < 260 && c.parentElement.getBoundingClientRect().width < 400)) c = c.parentElement;
      c.style.setProperty('display', 'none', 'important'); k++;
    }
    return k;
  }, nomes);
  console.log('produtos ocultos da grade:', n);
}

try {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: +dpr, mobile: celular });
  await aba.goto('https://www.softpaybr.com/vendas', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await aba.waitForTimeout(5000);
  if (/\/admin|\/auth/.test(aba.url())) throw new Error('recusado: ' + aba.url());
  for (const nome of itens) {
    await aba.getByText(nome, { exact: true }).first().click();
    await aba.waitForTimeout(700);
  }
  await ocultarProdutos(opt.ocultar ? opt.ocultar.split('|') : []);
  if (opt['abrir-carrinho']) {
    // celular: o carrinho abre pelo botão flutuante com o número de itens
    const ok = await aba.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((e) => {
        const s = getComputedStyle(e); const r = e.getBoundingClientRect();
        return (s.position === 'fixed' || e.closest('[style*="fixed"]')) && /^\d+$/.test((e.innerText || '').trim()) && r.width < 90 && r.bottom > innerHeight * .6;
      }) || [...document.querySelectorAll('body *')].find((e) => getComputedStyle(e).position === 'fixed' && /^\d+$/.test((e.innerText || '').trim()) && e.getBoundingClientRect().width < 90 && e.querySelector('svg'));
      if (!b) return false; b.click(); return true;
    });
    console.log('carrinho aberto:', ok);
    await aba.waitForTimeout(1500);
  }
  // o ponteiro sai de cima do último cartão (senão fica o cartão de detalhes aberto)
  await aba.mouse.move(2, 2);
  await limparAvisos(!!opt['sem-resumo']);
  // a grade rola dentro de uma caixa própria: volta tudo ao topo
  await aba.evaluate(() => { window.scrollTo({ top: 0, behavior: 'instant' });
    for (const e of document.querySelectorAll('body *')) if (e.scrollTop > 0) e.scrollTop = 0; });
  await aba.waitForTimeout(900);
  if (opt.listar) {
    const txt = await aba.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => {
      const s = getComputedStyle(e); return (s.position === 'fixed' || s.position === 'sticky') && e.offsetWidth > 20; })
      .map((e) => (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80)).filter(Boolean));
    console.log(JSON.stringify(txt, null, 1));
  }
  const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(saida, Buffer.from(r.data, 'base64'));
  console.log('ok', saida);
} finally {
  await cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => {});
  await aba.goto('https://www.softpaybr.com/relatorios', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await cdp.detach().catch(() => {});
}
process.exit(0);
