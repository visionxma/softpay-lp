#!/usr/bin/env node
// Refaz os secoes-<L>.json da captura do vhsys, distribuidora de bebidas (03/11/2026). Adaptado do molde nextar-bebidas.
// No vhsys (Elementor) o capturar.mjs devolveu a página inteira num bloco só (div.elementor, 9.209 px em 1440).
// Por que: o capturar.mjs desce pelo invólucro único ANTES de tirar <script>/<style> da lista. No Nex o <body> tem
// div#main e vários <script>, então a página inteira virou um bloco só (idx 0, 8.865 px). Mesmo filtrando antes, o
// Framer põe as seções em níveis diferentes (hero e 5 linhas num invólucro; FAQ, depoimento e cartão de números
// num componente de 2.473 px), com invólucros `display: contents` no meio.
// Como: cada seção nasce de uma ÂNCORA de texto (o título dela). Sobe-se da âncora visível até o maior ancestral que
// não contém a âncora de outra seção; a caixa é a do conteúdo (Range), que vale também para `display: contents`.
// O `idx` é a posição na lista ANCORAS, igual em toda largura, e é o número que o molde põe em data-mx-secao.
// Lista também as imagens grandes de cada seção (img, svg, fundo) para recortar os ativos/ do modo origem.
// Grava por cima dos secoes-<L>.json (o original fica em .bak-um-bloco) e em secoes-imagens-<L>.json.
//
// uso: node secoes.mjs <url> <pasta-da-captura> [--larguras 1440,390]
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const { comNavegador, novoContexto, prepararPagina } = await import(join(homedir(), '.jarvis/marcio-safirion/clone/bin/pagina.mjs'));

export const ANCORAS = [
  ['hero', 'Sistema de gestão para'],
  ['tudo', 'Tudo o que sua loja ou distribuidora'],
  ['recursos', 'Mais recursos do ERP'],
  ['gestao', 'Quanto mais sua loja vende'],
  ['pdv', 'Quer só a frente de caixa'],
  ['planos', 'Planos e preços'],
  ['pratica', 'Veja na prática como o'],
  ['palma', 'Sua loja na palma da mão'],
  ['canais', 'Venda em vários canais'],
  ['suporte', 'Conte com o melhor suporte'],
  ['conecte', 'Conecte o seu negócio'],
  ['milhao', 'Mais de um milhão de empreendedores'],
  ['opiniao', 'Confira a opinião de quem'],
  ['blog', 'Aprenda a vender mais'],
  ['faq', 'Perguntas frequentes'],
];

const args = process.argv.slice(2);
const [url, pasta] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--larguras');
const iL = args.indexOf('--larguras');
const larguras = (iL >= 0 ? args[iL + 1] : '1440,390').split(',').map(Number);
const cap = JSON.parse(readFileSync(join(pasta, 'captura.json'), 'utf8'));

await comNavegador('secoes ' + url, async (nav) => {
  for (const L of larguras) {
    const ctx = await novoContexto(nav, L);
    const p = await ctx.newPage();
    try {
      await prepararPagina(p, url, { bloquear: true });
      const r = await p.evaluate((ANC) => {
        const caixa = (el) => {
          const g = document.createRange(); g.selectNodeContents(el);
          const q = el.getBoundingClientRect();
          const c = getComputedStyle(el).display === 'contents' || q.height === 0 ? g.getBoundingClientRect() : q;
          return { x: Math.round(c.left), y: Math.round(c.top + scrollY), w: Math.round(c.width), h: Math.round(c.height) };
        };
        const visivel = (el) => { const q = el.getBoundingClientRect(); return q.height > 0 && q.width > 0 && getComputedStyle(el).visibility !== 'hidden'; };
        const norm = (s) => s.replace(/\s+/g, ' ').replace(/["“”]/g, '').trim();
        // o nó de texto mais fundo e visível que contém a frase, título primeiro ("Controle de estoque" também é item da lista do hero)
        const acha = (frase) => {
          for (const sel of ['h1,h2,h3', 'h4,p,span,div']) {
            const cands = [...document.querySelectorAll(sel)].filter((el) => norm(el.textContent).includes(frase) && visivel(el));
            const fundo = cands.filter((el) => !cands.some((o) => o !== el && el.contains(o)))[0];
            if (fundo) return fundo;
          }
          return null;
        };
        const ancoras = ANC.map(([nome, frase]) => ({ nome, el: acha(frase) }));
        const out = [];
        const imagens = [];
        ancoras.forEach(({ nome, el }, idx) => {
          if (!el) { out.push({ idx, nome, falta: true }); return; }
          const outras = ancoras.filter((a, j) => j !== idx && a.el).map((a) => a.el);
          let s = el;
          while (s.parentElement && s.parentElement !== document.body && !outras.some((o) => s.parentElement.contains(o))) s = s.parentElement;
          const b = caixa(s);
          const h = [...s.querySelectorAll('h1,h2,h3')].filter(visivel).slice(0, 6).map((x) => x.tagName + ': ' + norm(x.textContent).slice(0, 90));
          let fundo = '';
          for (let e = s; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { fundo = c; break; } }
          out.push({ idx, nome, papel: 'conteudo', tag: s.tagName.toLowerCase(), classe: String(s.className || '').slice(0, 120), y: b.y, altura: b.h, x: b.x, largura: b.w, fundo, titulos: h });
          const vistas = new Set();
          for (const im of s.querySelectorAll('img, svg, div, picture, video')) {
            if (!visivel(im)) continue;
            const cs = getComputedStyle(im);
            const ehImg = im.tagName === 'IMG' || im.tagName === 'VIDEO' || (im.tagName === 'svg' && !im.closest('a,button')) || (cs.backgroundImage !== 'none' && /url\(/.test(cs.backgroundImage));
            if (!ehImg) continue;
            const c = caixa(im);
            if (c.w < 24 || c.h < 24) continue;
            const k = `${c.x},${c.y},${c.w},${c.h}`; if (vistas.has(k)) continue; vistas.add(k);
            imagens.push({ secao: nome, tag: im.tagName.toLowerCase(), x: c.x, y: c.y, w: c.w, h: c.h, src: (im.currentSrc || im.getAttribute('src') || '').slice(-80), raio: cs.borderRadius });
          }
        });
        return { lista: out, imagens, altura: document.documentElement.scrollHeight };
      }, ANCORAS);
      const esperada = cap.larguras?.[L]?.altura;
      const arq = join(pasta, `secoes-${L}.json`);
      if (existsSync(arq) && !existsSync(arq + '.bak-um-bloco')) copyFileSync(arq, arq + '.bak-um-bloco');
      writeFileSync(arq, JSON.stringify(r.lista.filter((s) => !s.falta), null, 2));
      writeFileSync(join(pasta, `secoes-imagens-${L}.json`), JSON.stringify(r.imagens, null, 2));
      console.log(`${L}px: ${r.lista.filter((s) => !s.falta).length}/${ANCORAS.length} seção(ões), página ${r.altura}px (captura ${esperada}px)${esperada && Math.abs(esperada - r.altura) > 4 ? '  ← ALTURA DIFERENTE DA FOTO' : ''}`);
      for (const s of r.lista) console.log(s.falta ? `  ${s.idx} ${s.nome}: ÂNCORA NÃO ACHADA` : `  ${String(s.idx).padStart(2)} ${s.nome.padEnd(12)} x=${String(s.x).padStart(4)} y=${String(s.y).padStart(5)} w=${String(s.largura).padStart(4)} h=${String(s.altura).padStart(5)} ${s.fundo}`);
      for (const im of r.imagens.filter((m) => m.w * m.h >= 6000)) console.log(`     img ${im.secao.padEnd(12)} ${im.tag.padEnd(5)} x=${im.x} y=${im.y} ${im.w}×${im.h} r=${im.raio} ${im.src}`);
    } finally {
      await ctx.close();
    }
  }
});
