#!/usr/bin/env node
// Refaz os secoes-<L>.json e a foto ref-<L>.png da captura da Hero Sistemas (herosistemas.com.br, 03/11/2026) e
// grava as medidas de cada seção (a régua do molde.css).
// Por que:
//  - o capturar.mjs desce pelo invólucro único e a página inteira virou UM bloco (idx 1, 10.857 px): a Hero é
//    Elementor e as seções são os contêineres `.e-con.e-parent` do documento wp-page, identificados por data-id;
//  - a foto da captura saiu com o banner de cookies (Complianz) por cima da hero e com o aviso "Click 'I agree' to
//    enable Youtube" no lugar do vídeo. Aqui o consentimento é aceito antes da foto (o que a pessoa vê depois do
//    primeiro clique). A foto antiga fica em ref-<L>.png.bak-com-cookies.
// O `idx` é a posição na lista SECOES, igual em toda largura, e é o número que o molde põe em data-mx-secao.
//
// uso: node secoes.mjs <url> <pasta-da-captura> <pasta-de-saida-das-medidas> [--larguras 1440,390]
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const { comNavegador, novoContexto, prepararPagina, fotoInteira } = await import(join(homedir(), '.jarvis/marcio-safirion/clone/bin/pagina.mjs'));

// [nome, data-id do contêiner Elementor, papel]
export const SECOES = [
  ['topo', 'a217eb3', 'cabecalho'],
  ['hero', '0c712c0', 'conteudo'],
  ['integracoes', 'e6cef8d', 'conteudo'],
  ['video-diferenciais', '9d4dcae', 'conteudo'],
  ['situacoes-solucoes', 'eabc0da', 'conteudo'],
  ['depoimentos', '335e549', 'conteudo'],
  ['app', '3fd627d', 'conteudo'],
  ['planos', '04d86f9', 'conteudo'],
  ['faq', '05cd8da', 'conteudo'],
  ['consultor', '998002f', 'conteudo'],
  ['rodape', 'acf8b93', 'rodape'],
];

const args = process.argv.slice(2);
const pos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--larguras');
const [url, pasta, saida] = pos;
const iL = args.indexOf('--larguras');
const larguras = (iL >= 0 ? args[iL + 1] : '1440,390').split(',').map(Number);

await comNavegador('secoes herosistemas', async (nav) => {
  for (const L of larguras) {
    const ctx = await novoContexto(nav, L);
    const p = await ctx.newPage();
    try {
      await prepararPagina(p, url, { bloquear: true });
      // aceita os cookies (Complianz) e espera o vídeo do YouTube trocar o aviso pela capa
      await p.evaluate(() => { const b = document.querySelector('.cmplz-accept, button.cmplz-btn.cmplz-accept'); if (b) b.click(); });
      await p.waitForTimeout(3500);
      await p.addStyleTag({ content: '.cmplz-cookiebanner,#cmplz-cookiebanner-container,.cmplz-manage-consent{display:none!important}' });
      await prepararPagina(p, url, { bloquear: true }).catch(() => {});
      await p.evaluate(() => { const b = document.querySelector('.cmplz-accept'); if (b && b.offsetParent) b.click(); });
      await p.addStyleTag({ content: '.cmplz-cookiebanner,#cmplz-cookiebanner-container,.cmplz-manage-consent{display:none!important}' });
      await p.waitForTimeout(2500);
      const r = await p.evaluate((S) => {
        const visivel = (el) => { const q = el.getBoundingClientRect(); const cs = getComputedStyle(el); return q.height > 0 && q.width > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05; };
        const out = [];
        const med = [];
        S.forEach(([nome, id, papel], idx) => {
          const el = document.querySelector(`[data-id="${id}"]`);
          if (!el || !visivel(el)) { out.push({ idx, nome, falta: true }); return; }
          const q = el.getBoundingClientRect();
          const y0 = Math.round(q.top + scrollY);
          let fundo = '';
          for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { fundo = c; break; } }
          const titulos = [...el.querySelectorAll('h1,h2,h3')].filter(visivel).slice(0, 6).map((x) => x.tagName + ': ' + x.textContent.replace(/\s+/g, ' ').trim().slice(0, 80));
          out.push({ idx, nome, papel, tag: el.tagName.toLowerCase(), classe: String(el.className).slice(0, 120), y: y0, altura: Math.round(q.height), x: Math.round(q.left), largura: Math.round(q.width), fundo, titulos });
          if (papel !== 'conteudo') return;
          med.push(`== ${idx} ${nome} y=${y0} h=${Math.round(q.height)} fundo=${fundo} bgimg=${getComputedStyle(el).backgroundImage.slice(0, 120)}`);
          const vistos = new Set();
          const cands = [...el.querySelectorAll('h1,h2,h3,h4,p,a,button,li,img,svg,input,select,textarea,summary,iframe,video,span,div')].filter(visivel);
          for (const c of cands) {
            const tag = c.tagName.toLowerCase();
            const cs = getComputedStyle(c);
            const texto = [...c.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
            const caixaDeCor = (tag === 'div' || tag === 'span') && !texto && ((cs.backgroundColor !== 'rgba(0, 0, 0, 0)') || cs.borderTopWidth !== '0px' || cs.backgroundImage !== 'none');
            if ((tag === 'div' || tag === 'span') && !texto && !caixaDeCor) continue;
            if (tag === 'svg' && c.closest('svg') !== c) continue;
            const b = c.getBoundingClientRect();
            if (b.width < 6 || b.height < 6) continue;
            const k = `${tag}${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.width)},${Math.round(b.height)}`;
            if (vistos.has(k)) continue; vistos.add(k);
            const pos = `x=${Math.round(b.left)} y=${Math.round(b.top + scrollY - y0)} ${Math.round(b.width)}×${Math.round(b.height)}`;
            const letra = texto ? ` ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily.split(',')[0]} ls=${cs.letterSpacing} cor=${cs.color} al=${cs.textAlign}` : '';
            const caixa = `${cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? ' bg=' + cs.backgroundColor : ''}${cs.backgroundImage !== 'none' ? ' bgi=' + cs.backgroundImage.slice(0, 90) : ''}${cs.borderTopWidth !== '0px' ? ' borda=' + cs.borderTopWidth + ' ' + cs.borderTopColor : ''}${cs.borderRadius !== '0px' ? ' raio=' + cs.borderRadius : ''}${cs.boxShadow !== 'none' ? ' sombra=' + cs.boxShadow.slice(0, 70) : ''}${cs.padding !== '0px' ? ' pad=' + cs.padding : ''}`;
            const src = tag === 'img' ? ' src=' + (c.currentSrc || c.src).slice(-70) : tag === 'iframe' ? ' iframe=' + c.src.slice(0, 60) : '';
            med.push(`  ${tag}${c.className && typeof c.className === 'string' ? '.' + c.className.split(' ').filter((x) => !/^elementor-(element|widget)-?[0-9a-f]{0,7}$/.test(x)).slice(0, 2).join('.') : ''} ${pos}${letra}${caixa}${src}${texto ? ' "' + texto.slice(0, 60) + '"' : ''}`);
          }
        });
        return { lista: out, med, altura: document.documentElement.scrollHeight };
      }, SECOES);
      const arq = join(pasta, `secoes-${L}.json`);
      if (existsSync(arq) && !existsSync(arq + '.bak-um-bloco')) copyFileSync(arq, arq + '.bak-um-bloco');
      writeFileSync(arq, JSON.stringify(r.lista.filter((s) => !s.falta), null, 2));
      const foto = join(pasta, `ref-${L}.png`);
      if (existsSync(foto) && !existsSync(foto + '.bak-com-cookies')) copyFileSync(foto, foto + '.bak-com-cookies');
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(400);
      const f = await fotoInteira(p, foto);
      writeFileSync(join(saida, `medidas-${L}.txt`), r.med.join('\n') + '\n');
      console.log(`${L}px: ${r.lista.filter((s) => !s.falta).length}/${SECOES.length} seção(ões), página ${r.altura}px, foto ${f.altura}px${f.cortada ? ' (cortada)' : ''}`);
      for (const s of r.lista) console.log(s.falta ? `  ${s.idx} ${s.nome}: NÃO ACHADA` : `  ${String(s.idx).padStart(2)} ${s.nome.padEnd(20)} y=${String(s.y).padStart(5)} h=${String(s.altura).padStart(5)} x=${s.x} w=${s.largura} ${s.fundo}`);
    } finally {
      await ctx.close();
    }
  }
});
