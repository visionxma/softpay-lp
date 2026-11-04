#!/usr/bin/env node
// Cópia de ~/.jarvis/marcio-safirion/clone/bin/capturar.mjs (via moldes/lightspeed-varejo) para o molde lightspeed-estoque (03/11/2026).
// Única diferença: a Lightspeed revela os blocos meio-a-meio (texto | imagem) com GSAP ScrollTrigger em
// "reverse": a foto tirada com a página de volta ao topo saía com esses blocos a 50% de opacidade e 150 px
// abaixo, sobrepostos à seção seguinte. Aqui o estado REVELADO (o que a pessoa vê ao chegar no bloco) é
// fixado antes de medir e fotografar, e o aviso de cookies fixo (que tapava a faixa de números) sai.
// Captura RENDERIZADA de uma fonte de clone (31/10/2026).
//
// uso: node capturar.mjs <url> <pasta> [--larguras 1440,390] [--sem-fotos] [--sem-bloqueio]
//
// Grava em <pasta>:
//   pagina.html        o DOM depois dos scripts, com <base href> para os caminhos relativos
//   estilos/NN-*.css   cada folha de estilo na ordem do documento (externa baixada; <style> copiado)
//   estilos.json       ordem, origem e media de cada folha
//   recursos.json      imagens (src, srcset, fundo), vídeos e fontes usados
//   secoes-<L>.json    os blocos de 1º nível do conteúdo, com caixa, cor de fundo e títulos;
//                      `idx` é a posição do bloco entre os irmãos e é a MESMA em toda largura
//                      (é o número que o molde põe em data-mx-secao="<idx>")
//   secoes-html/NN.html o outerHTML renderizado de cada bloco (NN = idx), com endereços absolutos
//                      e sem <script>: o desenho que o render() do molde reproduz
//   ref-<L>.png        foto da página inteira em cada largura (a régua do portão de comparação)
//
// Para pasta local estática, sirva antes: python3 -m http.server <porta> --directory <pasta>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { comNavegador, novoContexto, prepararPagina, fotoInteira } from '/Users/victorgabryellferreiraqueiroz/.jarvis/marcio-safirion/clone/bin/pagina.mjs';

const args = process.argv.slice(2);
const pos = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').match(/^--larguras$/));
const [url, pasta] = pos;
if (!url || !pasta) { console.error('uso: node capturar.mjs <url> <pasta> [--larguras 1440,390] [--sem-fotos]'); process.exit(2); }
const iL = args.indexOf('--larguras');
const larguras = (iL >= 0 ? args[iL + 1] : '1440,390').split(',').map(Number);
const semFotos = args.includes('--sem-fotos');
const bloquear = !args.includes('--sem-bloqueio');
mkdirSync(join(pasta, 'estilos'), { recursive: true });

const relatorio = { url, quando: new Date().toISOString(), larguras: {}, folhas: 0 };

await comNavegador('capturar ' + url, async (nav) => {
  for (const [n, L] of larguras.entries()) {
    const ctx = await novoContexto(nav, L);
    const p = await ctx.newPage();
    try {
      await prepararPagina(p, url, { bloquear });
      await p.addStyleTag({ content: '[data-cypress-animated-section]{opacity:1!important;transform:none!important;translate:none!important}' });
      await p.evaluate(() => document.querySelectorAll('[data-cookie-notification],#onetrust-consent-sdk').forEach((e) => e.remove()));
      await p.waitForTimeout(400);
      const secoes = await p.evaluate(() => {
        const raiz = document.querySelector('main') || document.body;
        let blocos = [...raiz.children];
        // invólucro único (Framer, Webflow, React): desce até o nível em que os blocos se separam
        while (blocos.length === 1 && blocos[0].children.length >= 2) blocos = [...blocos[0].children];
        blocos = blocos.filter((b) => !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META)$/.test(b.tagName));
        const fundo = (el) => {
          for (let e = el; e; e = e.parentElement) {
            const c = getComputedStyle(e).backgroundColor;
            if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
          }
          return '';
        };
        const papel = (b) => {
          const t = b.tagName;
          if (t === 'HEADER' || (t === 'NAV' && b.getBoundingClientRect().top + scrollY < 200)) return 'cabecalho';
          if (t === 'FOOTER') return 'rodape';
          return 'conteudo';
        };
        return blocos.map((b, idx) => {
          const r = b.getBoundingClientRect();
          const cs = getComputedStyle(b);
          if (r.height < 4 || cs.display === 'none') return null;
          return {
            idx, papel: papel(b),
            tag: b.tagName.toLowerCase(), id: b.id || '', classe: (b.className && b.className.baseVal === undefined ? String(b.className) : '').slice(0, 120),
            y: Math.round(r.top + scrollY), altura: Math.round(r.height), fundo: fundo(b),
            imagemDeFundo: cs.backgroundImage !== 'none' ? cs.backgroundImage.slice(0, 160) : '',
            padding: cs.paddingTop + ' / ' + cs.paddingBottom,
            titulos: [...b.querySelectorAll('h1,h2,h3')].slice(0, 6).map((h) => h.tagName + ': ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 90)),
            imagens: b.querySelectorAll('img,picture,svg,video,canvas').length,
            botoes: [...b.querySelectorAll('a,button')].filter((a) => a.offsetHeight >= 28).slice(0, 4).map((a) => a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)),
          };
        }).filter(Boolean);
      });
      writeFileSync(join(pasta, `secoes-${L}.json`), JSON.stringify(secoes, null, 2));
      if (n === 0) {
        // o desenho de cada bloco, renderizado: endereço absoluto e nada que execute
        const pedacos = await p.evaluate(() => {
          const raiz = document.querySelector('main') || document.body;
          let blocos = [...raiz.children];
          while (blocos.length === 1 && blocos[0].children.length >= 2) blocos = [...blocos[0].children];
          blocos = blocos.filter((b) => !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META)$/.test(b.tagName));
          const abs = (u) => { try { return new URL(u, location.href).href; } catch { return u; } };
          return blocos.map((b, idx) => {
            const c = b.cloneNode(true);
            c.querySelectorAll('script,noscript,iframe').forEach((s) => s.remove());
            c.querySelectorAll('[src]').forEach((e) => e.setAttribute('src', abs(e.getAttribute('src'))));
            c.querySelectorAll('[href]').forEach((e) => { const h = e.getAttribute('href'); if (!/^(#|mailto:|tel:|javascript:)/.test(h)) e.setAttribute('href', abs(h)); });
            c.querySelectorAll('[poster]').forEach((e) => e.setAttribute('poster', abs(e.getAttribute('poster'))));
            c.querySelectorAll('[srcset]').forEach((e) => e.setAttribute('srcset', e.getAttribute('srcset').split(',').map((p) => { const [u, ...d] = p.trim().split(/\s+/); return [abs(u), ...d].join(' '); }).join(', ')));
            c.querySelectorAll('[style*="url("]').forEach((e) => e.setAttribute('style', e.getAttribute('style').replace(/url\((["']?)([^"')]+)\1\)/g, (_, q, u) => `url(${q}${abs(u)}${q})`)));
            [...c.querySelectorAll('*')].concat(c).forEach((e) => [...e.attributes].forEach((a) => { if (/^on/i.test(a.name)) e.removeAttribute(a.name); }));
            return { idx, html: c.outerHTML };
          });
        });
        mkdirSync(join(pasta, 'secoes-html'), { recursive: true });
        for (const x of pedacos) writeFileSync(join(pasta, 'secoes-html', String(x.idx).padStart(2, '0') + '.html'), x.html + '\n');
        relatorio.secoesHtml = pedacos.length;
        const html = await p.evaluate(() => {
          const base = document.createElement('base');
          base.href = location.href;
          const doc = document.documentElement.cloneNode(true);
          const head = doc.querySelector('head');
          if (head && !head.querySelector('base')) head.prepend(base);
          doc.querySelectorAll('script').forEach((s) => { s.type = 'text/plain'; s.setAttribute('data-desligado', ''); });
          return '<!doctype html>\n' + doc.outerHTML;
        });
        writeFileSync(join(pasta, 'pagina.html'), html);
        // O TEXTO ORIGINAL de cada folha, nunca a serialização do CSSOM: o Chrome expande o atalho
        // `animation` que tem `animation-timeline` em longhands com valor vazio (`animation-duration: ;`),
        // que o leitor descarta, e a animação presa à rolagem morria no clone (LinkAffiliattes, 01/11/2026).
        // O CSSOM fica só para <style> que o script encheu por insertRule (texto vazio, regras cheias).
        const folhas = await p.evaluate(() => [...document.styleSheets].map((s, i) => {
          let cssom = null;
          try { cssom = [...s.cssRules].map((r) => r.cssText).join('\n'); } catch { /* origem cruzada: baixa pelo href */ }
          const proprio = !s.href && s.ownerNode ? s.ownerNode.textContent : null;
          const texto = proprio && proprio.trim() ? proprio : s.href ? null : cssom;
          return { i, href: s.href || '', media: s.media ? s.media.mediaText : '', texto, cssom, dono: s.ownerNode ? s.ownerNode.tagName : '' };
        }));
        const lista = [];
        for (const f of folhas) {
          let texto = f.texto;
          if (texto == null && f.href) {
            try {
              const r = await p.request.get(f.href, { timeout: 20000 });
              texto = r.ok() ? await r.text() : null;
            } catch { texto = null; }
            if (texto == null) texto = f.cssom || '';
          }
          const nome = String(f.i).padStart(2, '0') + '-' + ((f.href.split('/').pop() || f.dono || 'inline').split('?')[0].replace(/[^a-z0-9._-]+/gi, '_').slice(0, 50) || 'inline') + (f.href.endsWith('.css') ? '' : '.css');
          writeFileSync(join(pasta, 'estilos', nome), texto || '');
          lista.push({ arquivo: 'estilos/' + nome, href: f.href, media: f.media, dono: f.dono, bytes: (texto || '').length });
        }
        writeFileSync(join(pasta, 'estilos.json'), JSON.stringify(lista, null, 2));
        relatorio.folhas = lista.length;
        const recursos = await p.evaluate(() => {
          const abs = (u) => { try { return new URL(u, location.href).href; } catch { return u; } };
          const imgs = [...document.images].map((i) => ({ src: abs(i.currentSrc || i.src), alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, caixa: [Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)] }));
          const fundos = new Set();
          document.querySelectorAll('*').forEach((e) => {
            const b = getComputedStyle(e).backgroundImage;
            if (b && b.includes('url(')) for (const m of b.matchAll(/url\(["']?([^"')]+)["']?\)/g)) fundos.add(abs(m[1]));
          });
          const videos = [...document.querySelectorAll('video')].map((v) => abs(v.currentSrc || v.src || (v.querySelector('source') || {}).src || ''));
          const fontes = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight + ' ' + f.style);
          return { imagens: imgs, fundos: [...fundos], videos, fontes: [...new Set(fontes)], titulo: document.title, lang: document.documentElement.lang };
        });
        writeFileSync(join(pasta, 'recursos.json'), JSON.stringify(recursos, null, 2));
      }
      if (!semFotos) {
        const r = await fotoInteira(p, join(pasta, `ref-${L}.png`));
        relatorio.larguras[L] = r;
      }
    } finally {
      await ctx.close().catch(() => {});
    }
  }
});

writeFileSync(join(pasta, 'captura.json'), JSON.stringify(relatorio, null, 2));
console.log(JSON.stringify(relatorio));
