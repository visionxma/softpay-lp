#!/usr/bin/env node
// Resegmenta a captura do Stripe Invoicing (copiado do stripe-pagamentos em 03/11/2026). O capturar.mjs desce até o 1º nível com 2+ filhos sob o
// <body>, e no Stripe esse nível é #MktContent + o aviso de cookies + 2 iframes: a página inteira virava UMA seção
// de 19.922 px, que não se compara. Aqui as seções são os filhos de #MktContent (cabeçalho, hero, as <section> e o
// rodapé), medidos na página AO VIVO, e cada seção ganha a própria foto (secoes-png/<L>-<idx>.png), sem o teto de
// 16.000 px da foto inteira. ref-<L>.png é refeita na mesma carga (as coordenadas batem com secoes-<L>.json).
// O aviso de cookies, a barra fixa do celular e a sub-navegação fixa não entram nas fotos (camadas fixas de terceiro).
//
// uso: node moldes/stripe-cobranca/ferramentas/resegmentar.mjs [<pasta-da-captura>] [--larguras 1440,390]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const cap = resolve((args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--larguras') || '~/.jarvis/visionx/clones/capturas/stripe-cobranca').replace(/^~/, homedir()));
const iL = args.indexOf('--larguras');
const larguras = (iL >= 0 ? args[iL + 1] : '1440,390').split(',').map(Number).filter(Boolean);
const URL_REF = 'https://stripe.com/invoicing';
const { comNavegador, novoContexto, prepararPagina, fotoInteira } = await import(pathToFileURL(join(homedir(), '.jarvis/marcio-safirion/clone/bin/pagina.mjs')).href);
mkdirSync(join(cap, 'secoes-png'), { recursive: true });
mkdirSync(join(cap, 'secoes-html'), { recursive: true });

await comNavegador('resegmentar stripe', async (nav) => {
  for (const [n, L] of larguras.entries()) {
    const ctx = await novoContexto(nav, L);
    try {
      const p = await ctx.newPage();
      await prepararPagina(p, URL_REF, { bloquear: true });
      await p.addStyleTag({ content: '.NotificationCenter,.MobileStickyNav,.PaymentsStickyNav__fixedNav,[class*="StickyNav__fixedNav"]{display:none!important}' });
      await p.waitForTimeout(300);
      // uma volta inteira ANTES de medir: a carga preguiçosa e os vídeos mudam a altura das seções ao rolar, e no celular
      // (390) a medida tirada antes da volta saía 57 a 114 px abaixo do que a foto mostra (prova de 02/11/2026)
      await fotoInteira(p, join(cap, `.volta-${L}.png`));
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(400);
      const secoes = await p.evaluate(() => {
        const raiz = document.getElementById('MktContent');
        const fundo = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; } return ''; };
        return [...raiz.children].map((b, idx) => {
          if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META)$/.test(b.tagName)) return null;
          const r = b.getBoundingClientRect(); const cs = getComputedStyle(b);
          if (r.height < 4 || cs.display === 'none') return null;
          const papel = b.tagName === 'HEADER' ? 'cabecalho' : b.tagName === 'FOOTER' ? 'rodape' : /StickyNav/.test(b.className) ? 'cabecalho' : 'conteudo';
          return {
            idx, papel, tag: b.tagName.toLowerCase(), id: b.id || '', classe: String(b.className).replace(/\s+/g, ' ').trim().slice(0, 140),
            y: Math.round(r.top + scrollY), altura: Math.round(r.height), fundo: fundo(b),
            titulos: [...b.querySelectorAll('h1,h2,h3')].slice(0, 8).map((h) => h.tagName + ': ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 90)),
            imagens: b.querySelectorAll('img,picture,svg,video,canvas').length,
            botoes: [...b.querySelectorAll('a,button')].filter((a) => a.offsetHeight >= 28).slice(0, 4).map((a) => a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)),
          };
        }).filter(Boolean);
      });
      writeFileSync(join(cap, `secoes-${L}.json`), JSON.stringify(secoes, null, 2));
      if (L === 1440) {
        const pedacos = await p.evaluate(() => [...document.getElementById('MktContent').children].map((b, idx) => {
          const c = b.cloneNode(true);
          c.querySelectorAll('script').forEach((s) => s.remove());
          c.querySelectorAll('[src]').forEach((e) => e.setAttribute('src', e.src));
          c.querySelectorAll('[href]').forEach((e) => { if (e.href) e.setAttribute('href', e.href); });
          return { idx, html: c.outerHTML };
        }));
        for (const x of pedacos) writeFileSync(join(cap, 'secoes-html', String(x.idx).padStart(2, '0') + '.html'), x.html + '\n');
      }
      const fi = await fotoInteira(p, join(cap, `ref-${L}.png`));
      for (const s of secoes) {
        await p.screenshot({ path: join(cap, 'secoes-png', `${L}-${s.idx}.png`), fullPage: true, clip: { x: 0, y: s.y, width: L, height: s.altura }, type: 'png' });
      }
      console.log(`${L}px: ${secoes.length} seções, página ${fi.altura}px`);
      for (const s of secoes) console.log(`  ${String(s.idx).padStart(2)} ${s.papel.padEnd(9)} y=${s.y} h=${s.altura} ${s.id} ${s.titulos.slice(0, 2).join(' | ')}`);
    } finally { await ctx.close().catch(() => {}); }
  }
});
