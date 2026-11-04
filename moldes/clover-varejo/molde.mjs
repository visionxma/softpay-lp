// Molde clover-varejo: o corpo da página de sistemas de PDV da Clover (clover.com/pos-systems), clonado pela captura
// renderizada em 03/11/2026 (a de varejo, /pos-systems/retail, respondeu 404; a reserva do enunciado foi a usada).
// As mesmas peças montam as duas versões:
//   modo 'origem'  → textos, imagens e endereços da própria Clover (origem.json): é o que a prova compara com a captura;
//   modo produto   → o conteúdo da rota do SoftPay (tools/conteudo/<slug>.json), sem tirar nada, nos MESMOS blocos.
// A marcação é a da Clover (TextMediaModule, GridModule, ControlledScroll, FloatingText, FaqModule), com o prefixo das
// classes dela (mAZF70It--); o CSS escopado (molde.css) faz tamanho, espaço e composição, e a roupa do SoftPay
// (cores, letra, hero de tela inteira, celular lado a lado, tabela em cartão) mora no fim do molde.css, sob .mx-vestido.
import { readFileSync } from 'node:fs';

const O = JSON.parse(readFileSync(new URL('./origem.json', import.meta.url), 'utf8'));

export const meta = {
  id: 'clover-varejo',
  referencia: 'https://www.clover.com/pos-systems',
  captura: '~/.jarvis/visionx/clones/capturas/clover-varejo-geral',
  // o cabeçalho da Clover (faixa de oferta + menu) fica FORA das seções capturadas: a hero já começa abaixo dele
  topoDoChassi: { 1440: 0, 390: 0 },
  secoes: [
    { idx: 0, tipo: 'hero: texto à esquerda e aparelhos à direita' },
    { idx: 1, tipo: 'grade de vantagens com ícone (recebe os problemas de sempre)' },
    { idx: 2, tipo: 'rolagem controlada: imagem ao lado de cada tópico (recebe o que muda com o SoftPay)' },
    { idx: 3, tipo: 'texto e foto em faixa tingida (recebe a rotina do mercadinho)' },
    { idx: 4, tipo: 'grade de recursos com título (recebe as perguntas que passam a ter resposta)' },
    { idx: 5, tipo: 'cartão flutuante sobre imagem (recebe a conta do mês)' },
    { idx: 6, tipo: 'foto à esquerda e texto à direita (recebe qual plano faz sentido)' },
    { idx: 7, tipo: 'cartão flutuante sobre imagem (recebe Continue por aqui; os logos de terceiros da Clover saem)' },
    { idx: 8, tipo: 'grade em faixa cinza (recebe o que o SoftPay não faz)' },
    { idx: 9, tipo: 'perguntas frequentes em sanfona com ver mais (recebe a FAQ e o Veja também)' },
    { idx: 10, tipo: 'chamada final centralizada com a fileira de aparelhos' },
  ],
  classeRaiz: 'mx-vestido',
};

const P = 'mAZF70It--';
const K = (s) => s.replace(/~/g, P);
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sec = (D, idx) => (D.origem ? ` data-mx-secao="${idx}"` : '');
const FT = '~FadeToastUp_fade-toast-up__jmg7z ~FadeToastUp_fade-toast-up--active__xnKww';
const DUR = ' style="transition-duration: 600ms;"';

// botão da Clover: medium/small, cheio ou contornado; `extra` são as classes que cada módulo acrescenta ao <a>
function botao(b, { tam = 'medium', contorno = false, extra = '' } = {}) {
  if (!b) return '';
  const tamanho = tam === 'small' ? '~TextWithArrow_small__HRlM4' : '~TextWithArrow_medium__S5L+z';
  return `<div class="${K('~TextStack_cta-container__xpS3k')}"><a class="${K(`~Button_with-button-theme__65PpL ~Button_light__WvRrx${extra}`)}" href="${e(b.href)}">`
    + `<span class="${K(`~TextWithArrow_root__azywr ~TextWithArrow_light__Sz7KG ${tamanho} ~TextWithArrow_cta__oC8O+${contorno ? ' ~TextWithArrow_outline__9-iUz' : ''} ~Button_text-with-arrow__sg7EX`)}">`
    + `<span class="${K('~TextV2_modern-button-text__lbHgv ~TextWithArrow_text__IyWS7')}">${e(b.texto)}</span></span>`
    + (b.oculto ? `<span class="visually-hidden">${e(b.oculto)}</span>` : '') + '</a></div>';
}

// <img> com srcset quando há a versão de 800 px ao lado
function imagem(D, im, { classe = '', prioridade = false } = {}) {
  const src = D.v ? D.v(im.src) : im.src;
  const menor = im.menor ? (D.v ? D.v(im.menor) : im.menor) : '';
  const srcset = menor ? ` srcset="${menor} 800w, ${src} ${im.w || 1200}w" sizes="${im.sizes || '(min-width: 1200px) 50vw, 100vw'}"` : '';
  const dim = im.w && im.h ? ` width="${im.w}" height="${im.h}"` : '';
  const carga = D.origem ? '' : prioridade ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
  return `<img class="${K(classe)}" alt="${e(im.alt)}" src="${src}"${srcset}${dim}${carga}>`;
}
const fundo = (D, src) => `background-image: url(&quot;${e(D.v ? D.v(src) : src)}&quot;);`;

// ---------- módulos da Clover ----------

function hero(D, h) {
  return `<section class="${K('~TextMediaModule_module-wrapper__Avf0a ~featureHero_hero__owzEe ~TextMediaModule_module-wrapper--padding-top-medium__7whLF')}"${sec(D, 0)}>`
    + `<div class="${K('~TextMediaModule_container__2oZhB ~featureHero_container__BHKWc ~TextMediaModule_container--text-left__K01Pc')}">`
    + `<div class="${K(`~EnhancedMedia_enhanced-media__BTHki ${FT} ~featureHero_media__QIJur ~TextMediaModule_image-wrapper__HRi1D`)}"${DUR}>${imagem(D, h.img, { prioridade: true })}</div>`
    + `<div class="${K(`${FT} ~TextMediaModule_text-wrapper__kAKfv ~featureHero_text__RmsX8 ~TextMediaModule_text-wrapper--left__da96Q`)}"${DUR}>`
    + (h.topo || '')
    + `<h1 class="${K('~TextMediaModule_title__lEdqc ~TextMediaModule_title--with-color__IDNN7')}">${e(h.h1)}</h1>`
    + `<div class="${K('~MarkdownWrapper_wrapper__g8p+g ~TextStack_blurb__hRy9T ~featureHero_blurb__3Jfqa')}"><p>${h.p}</p></div>`
    + botao(h.botao, { extra: ' ~TextMediaModule_cta-button__GN+AP' })
    + '</div></div></section>';
}

// grade de 4 colunas da Clover; `lista` troca as caixas por <ul>/<li> (a rota tem lista de verdade)
function grade(D, idx, g) {
  const caixa = g.lista ? 'ul' : 'div';
  const item = g.lista ? 'li' : 'div';
  const celulas = g.celulas.map((c) => {
    const corpo = c.texto == null ? '' : c.rico
      ? `<div class="${K('~RichBlurb_root__b7gl+ ~TextV2_modern-body__Q98aW ~RichBlurb_with-gap__Pmvup')}"><p class="${K('~RichBlurb_paragraph__lM8rJ')} rich-blurb-paragraph">${c.texto}</p></div>`
      : `<div class="${K('~MarkdownWrapper_wrapper__g8p+g')}"><p>${c.texto}</p></div>`;
    const titulo = c.titulo == null ? '' : `<${c.tagTitulo || 'h5'} class="t-subheading-1 ${K('~GridCell_title__J0Tk2')}">${c.titulo}</${c.tagTitulo || 'h5'}>`;
    return `<${item} class="${K(`${FT} ~GridModule_cell__e0j1h ~GridCell_grid-cell__feUhz`)}"${DUR}>`
      + `<div class="${K('~GridCell_image-wrapper__PrTD+')}">${imagem(D, c.icone, { classe: '~GridCell_image__Iard7' })}</div>${titulo}${corpo}</${item}>`;
  }).join('');
  const cabeca = g.titulo ? `<div class="${K('~GridModule_text-wrapper__9Xn5M')}"><h2 class="t-heading-1 ${K('~GridModule_title__3qNUh')}">${e(g.titulo)}</h2>${g.intro ? `<p class="mx-grade-intro">${g.intro}</p>` : ''}</div>` : '';
  return `<section class="${K('~GridModule_module-wrapper__l89hU')}${g.classe ? ' ' + g.classe : ''}"${g.fundo ? ` style="${g.fundo}"` : ''}${sec(D, idx)}>`
    + `<div class="${K(`~GridModule_grid-module__iR39y ~GridModule_grid-module--four-col__PyTIx ${FT}`)}"${DUR}>${cabeca}`
    + `<${caixa} class="${K('~GridModule_grid__pqXuP')}">${celulas}</${caixa}></div></section>`;
}

// rolagem controlada: coluna de imagens e coluna de tópicos; no celular as duas se intercalam (order = 2i e 2i+1)
function rolagem(D, r) {
  const imgs = r.itens.map((t, i) => `<div class="${K(`~Desktop_item-wrapper__Uat4g ~MediaWrapper_media-mask-wrapper__AmhS9${i === 0 ? ' ' + FT : ''}`)}" style="${i === 0 ? 'transition-duration: 600ms; ' : ''}--i: ${i};">`
    + `<div class="${K('~EnhancedMedia_enhanced-media__BTHki ~MediaWrapper_media-wrapper__alF3q ~EnhancedMedia_background-image__XtW4A')}">`
    + `<div class="${K('~MediaWrapper_media-wrapper__alF3q ~EnhancedMedia_background-image__XtW4A ~Background_background__BrHcT')}" role="img" aria-label="${e(t.img.alt)}" style="${fundo(D, t.img.src)}"></div></div></div>`).join('');
  const textos = r.itens.map((t, i) => `<div class="${K('~TextWrapper_text-wrapper__8VI-1 ~Desktop_item-wrapper__Uat4g')}" style="--i: ${i};">`
    + `<div class="${K('~TextBlock_text-block__Dcylu ~TextWrapper_text__-oZm0')}"><${t.tag || 'h2'} class="${K('~TextBlock_title__UL91W')}">${e(t.titulo)}</${t.tag || 'h2'}>`
    + `<div class="${K('~MarkdownWrapper_wrapper__g8p+g ~TextStack_blurb__hRy9T ~TextBlock_blurb__GLBNB')}">${t.miolo}</div>`
    + botao(t.botao, { contorno: true, extra: ' undefined' }) + '</div></div>').join('');
  return `<section class="${K('~ControlledScrollModule_controlled-scroll-wrapper__en59K')}"${sec(D, 2)}>`
    + `<h2 class="${K('~ControlledScrollModule_controlled-scroll__K6XH8')}">${e(r.titulo)}</h2>`
    + `<section class="${K('~Desktop_desktop__jqKWU')}"><div class="${K('~Desktop_col__aV7-a')}">${imgs}</div><div class="${K('~Desktop_col__aV7-a')}">${textos}</div></section></section>`;
}

// texto + mídia: lado 'esquerda' (texto à esquerda, como a 03), 'direita' (texto à direita, como a 06) ou 'centro' (a 10)
function textoMidia(D, idx, t) {
  const wrap = {
    esquerda: ['~TextMediaModule_module-wrapper--padding-top-medium__7whLF', '~TextMediaModule_container--text-left__K01Pc', '', '~TextMediaModule_text-wrapper--left__da96Q', ' ~TextMediaModule_cta-button__GN+AP', false],
    direita: ['~TextMediaModule_module-wrapper--padding-top-medium__7whLF', '~TextMediaModule_container--text-right__JtWh5', '', '~TextMediaModule_text-wrapper--right__OxXzk', ' undefined ~TextMediaModule_cta-button__GN+AP', true],
    centro: ['~TextMediaModule_module-wrapper--no-left-right-padding__yZr5H ~TextMediaModule_module-wrapper--margin-bottom-none__qJUxA ~TextMediaModule_module-wrapper--padding-top-medium__7whLF ~TextMediaModule_module-wrapper--padding-bottom-none__khVVG',
      '~TextMediaModule_container--center__0rcyw ~TextMediaModule_container--center--column__MyQ57 ~TextMediaModule_container--center--background-img__My449',
      ' ~TextMediaModule_image-wrapper--center__o2b6y', '~TextMediaModule_text-wrapper--center__Ayjuv', ' ~TextMediaModule_cta-button__GN+AP ~TextMediaModule_cta-button--center__VI7pd', false],
  }[t.lado];
  const blurb = t.rico
    ? `<div class="${K('~RichBlurb_root__b7gl+ ~TextV2_modern-body__Q98aW ~RichBlurb_with-gap__Pmvup')}">${t.miolo}</div>`
    : `<div class="${K('~MarkdownWrapper_wrapper__g8p+g ~TextStack_blurb__hRy9T')}">${t.miolo}</div>`;
  return `<section class="${K(`~TextMediaModule_module-wrapper__Avf0a ${wrap[0]}`)}${t.classe ? ' ' + t.classe : ''}"${t.fundo ? ` style="${t.fundo}"` : ''}${sec(D, idx)}>`
    + `<div class="${K(`~TextMediaModule_container__2oZhB ${wrap[1]}`)}">`
    + `<div class="${K(`~EnhancedMedia_enhanced-media__BTHki ${FT} ~TextMediaModule_image-wrapper__HRi1D${wrap[2]}`)}"${DUR}>${imagem(D, t.img)}</div>`
    + `<div class="${K(`${FT} ~TextMediaModule_text-wrapper__kAKfv ${wrap[3]}`)}"${DUR}>`
    + `<h2 class="${K('~TextMediaModule_title__lEdqc ~TextMediaModule_title--with-color__IDNN7')}">${e(t.titulo)}</h2>${blurb}`
    + botao(t.botao, { contorno: wrap[5], extra: wrap[4] }) + '</div></div></section>';
}

// texto flutuante sobre imagem de fundo (a 05 e a 07)
function flutuante(D, idx, f) {
  return `<div class="${K(`~FloatingTextModule_module-wrapper__874Sm ${FT}`)}${f.classe ? ' ' + f.classe : ''}"${DUR}${sec(D, idx)}>`
    + `<div class="${K('~FloatingTextModule_container__OC+bQ ~FloatingTextModule_container--right__62Bg6')}">`
    + `<div class="${K('~EnhancedMedia_enhanced-media__BTHki ~FloatingTextModule_media-wrapper__EzQDk ~EnhancedMedia_background-image__XtW4A')}">`
    + `<div class="${K('~FloatingTextModule_media-wrapper__EzQDk ~EnhancedMedia_background-image__XtW4A ~Background_background__BrHcT')}" style="${fundo(D, f.fundo)}" role="img" aria-label="${e(f.alt)}"></div></div>`
    + `<div class="${K(`~FloatingTextModule_text-wrapper__a0WZV ${FT}`)}"${DUR}><div class="${K('~TextBox_text-box__zqpB6')}">`
    + `<h2 class="${K('~TextBox_title__K06Ek')}">${e(f.titulo)}</h2>`
    + `<div class="${K('~MarkdownWrapper_wrapper__g8p+g ~TextStack_blurb__hRy9T ~TextBox_blurb__BZzSQ')}">${f.miolo}</div>`
    + botao(f.botao, { tam: 'small', contorno: true, extra: ' undefined btn undefined' }) + '</div></div></div></div>';
}

const SETA_FAQ = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="${P}TextWithArrow_icon__eo8M5"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>`;
const ICONE_FAQ = `<span class="${K('~FaqButtonAccordionIcon_accordion-icon__JodV+ ~FaqButtonAccordionIcon_variant__4aeLH')}"><span class="${K('~FaqButtonAccordionIcon_arrow-icon__dN+go')}"></span></span>`;
const resposta = (html) => `<div class="${K('~FaqButtonAccordion_body-container__qnvEB')}"><div class="${K('~RichBlurb_root__b7gl+ ~TextV2_modern-body__Q98aW ~FaqModule_faq-module__answer__wrNp8 ~FaqModule_rich-blurb__rpGwQ')}">${html}</div></div>`;

// FAQ: na origem, os botões da Clover (3 à vista); no produto, <details name> (abrir um fecha o outro) com 5 à vista
function faq(D, f) {
  const item = (q, i) => {
    const cls = K(`~FaqButtonAccordion_faq-module-item__LB569 ~FaqButtonAccordion_variant-arrow-icon__Zvsh+${i >= 2 ? ' ~FaqButtonAccordion_no-border-bottom__5MRhT' : ''}`);
    const pergunta = `<h3 class="${K('~TextV2_h5__cCblM ~FaqModule_faq-module__question__wU+ui')} t-subheading-2">${e(q.pergunta)}</h3>`;
    if (D.origem) {
      return `<div class="${cls}"><button aria-expanded="false" class="${K(`~FaqButtonAccordion_header__XX5i0${i >= 3 ? ' ~FaqButtonAccordion_hide-items__2jvWN' : ''}`)}" tabindex="0">`
        + ICONE_FAQ.replace(/<span class="([^"]*accordion-icon[^"]*)">/, '<div class="$1">').replace(/<\/span><\/span>$/, '</span></div>')
        + `${pergunta}</button><div class="${K('~FaqButtonAccordion_body__cMM0V')}" role="region"><div hidden="">${resposta(q.resposta)}</div></div></div>`;
    }
    return `<details class="${cls}${i >= f.aVista ? ' mx-faq-extra' : ''}" name="faq-${e(f.grupo)}"><summary class="${K('~FaqButtonAccordion_header__XX5i0')}">${ICONE_FAQ}${pergunta}</summary>`
      + `<div class="${K('~FaqButtonAccordion_body__cMM0V')}" role="region">${resposta(q.resposta)}</div></details>`;
  };
  const extras = D.origem ? 0 : Math.max(0, f.itens.length - f.aVista);
  const verMais = (D.origem || extras > 0)
    ? `<button class="${K(`~FaqModule_view-more-link__YPC7i t-button-small ${FT}`).replace(P + 't-button-small', 't-button-small')}" type="button"${DUR}${D.origem ? '' : ' data-mx-ver-mais aria-expanded="false"'}>`
      + `${e(f.verMais)}${D.origem ? '' : ' <span data-mx-conta></span>'}<span class="${K('~TextWithArrow_root__azywr ~TextWithArrow_light__Sz7KG ~TextWithArrow_medium__S5L+z ~TextWithArrow_caret-small__HQP6z ~FaqModule_arrow__nwN66')}">${SETA_FAQ}</span></button>`
    : '';
  const grade = (miolo, ft) => `<div class="MuiContainer-root jss1 MuiContainer-maxWidthXl"><div class="MuiGrid-root${ft ? ' ' + K(FT) : ''} MuiGrid-container MuiGrid-justify-content-xs-center"${ft ? DUR : ''}><div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-true MuiGrid-grid-lg-10 MuiGrid-grid-xl-12">${miolo}</div></div></div>`;
  return `<section class="${K('~FaqModule_faq-module__4co+c ~FaqModule_variant-arrow-icon__Pb2WJ')}" style="--selected-item-background-color: transparent;"${sec(D, 9)}>`
    + `<div class="${K('~FaqModule_faq-module-container__sAF6g')}">`
    + grade(`<h2 class="${K('~MarkdownWrapper_wrapper__g8p+g ~TextV2_h3__6oN5w ~TextV2_with-markdown__f3t2W ~FaqModule_faq-module__title__YNTns')}"><p>${e(f.titulo)}</p></h2>`, true)
    + grade(`<div class="${K(`~FaqModule_variant-arrow-icon--container__-GY10 ${FT}`)}"${DUR}><div class="${K('~FaqModule_faq-module__cells__5bNgf ~FaqModule_entry-limit-container__m8Itb')}">`
      + `<div class="faq9 ${K('~FaqButtonAccordion_faq-accordion__RdbPy')} undefined">${f.itens.map(item).join('')}</div>${verMais}</div></div>${f.depois || ''}`, false)
    + '</div></section>';
}

// ---------- modo origem: a Clover como ela é ----------

function paginaOrigem(ctx) {
  const D = { origem: true };
  const cel = (g) => g.celulas.map((c) => ({ icone: c.icone, titulo: e(c.titulo), texto: c.texto || null, rico: c.rico }));
  return [
    hero(D, { img: O.hero.img, h1: O.hero.h1, p: O.hero.p, botao: O.hero.botao }),
    grade(D, 1, { celulas: cel(O.grade1) }),
    rolagem(D, { titulo: O.rolagem.titulo, itens: O.rolagem.itens.map((t, i) => ({ titulo: t.titulo, miolo: `<ul>${t.lista}</ul>`, botao: t.botao, img: O.rolagem.imagens[i] })) }),
    textoMidia(D, 3, { lado: 'esquerda', fundo: O.texto3.fundo, img: O.texto3.img, titulo: O.texto3.titulo, miolo: `<p>${O.texto3.p}</p>`, botao: O.texto3.botao }),
    grade(D, 4, { titulo: O.grade4.titulo, celulas: cel(O.grade4) }),
    flutuante(D, 5, { fundo: O.flutua5.fundo, alt: O.flutua5.alt, titulo: O.flutua5.titulo, miolo: `<p>${O.flutua5.p}</p>`, botao: O.flutua5.botao }),
    textoMidia(D, 6, { lado: 'direita', img: O.texto6.img, titulo: O.texto6.titulo, miolo: `<p>${O.texto6.p}</p>`, botao: O.texto6.botao }),
    flutuante(D, 7, { fundo: O.flutua7.fundo, alt: O.flutua7.alt, titulo: O.flutua7.titulo, miolo: `<p>${O.flutua7.p}</p>`, botao: O.flutua7.botao }),
    grade(D, 8, { titulo: O.grade8.titulo, fundo: O.grade8.fundo, celulas: cel(O.grade8) }),
    faq(D, { titulo: O.faq.titulo, itens: O.faq.itens, verMais: O.faq.verMais }),
    textoMidia(D, 10, { lado: 'centro', fundo: O.fim.fundo, img: O.fim.img, titulo: O.fim.titulo, rico: true, miolo: `<p class="${P}RichBlurb_paragraph__lM8rJ rich-blurb-paragraph">${O.fim.p}</p>`, botao: O.fim.botao }),
  ].join('');
}

// ---------- modo produto: a rota do SoftPay nos blocos da Clover ----------

const svg = (miolo) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="#0C5C9E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${miolo}</svg>`);
// ícones de linha, no traço dos ícones da Clover, para o que o SoftPay NÃO faz
const LINHA = {
  balanca: svg('<path d="M24 8v32M14 40h20M10 14h28"/><path d="M14 14l-6 12a6 4 0 0 0 12 0zM34 14l-6 12a6 4 0 0 0 12 0z"/><circle cx="24" cy="10" r="2"/>'),
  pedido: svg('<rect x="6" y="14" width="22" height="16" rx="2"/><path d="M28 19h7l6 6v5H28"/><circle cx="14" cy="34" r="3.5"/><circle cx="34" cy="34" r="3.5"/><path d="M10 9h12"/>'),
  validade: svg('<rect x="8" y="11" width="32" height="29" rx="3"/><path d="M8 19h32M16 7v8M32 7v8"/><path d="M19 27l10 8M29 27l-10 8"/>'),
  entrega: svg('<path d="M24 6l16 7v18l-16 9-16-9V13z"/><path d="M8 13l16 8 16-8M24 21v19"/><path d="M15 9.5l16 7.5"/>'),
};
const RECURSO = (nome) => `/assets/recursos/${nome}.webp`;
const ICONES_PROBLEMAS = ['pdv-frente-de-caixa', 'controle-de-estoque', 'caderninho-de-fiado', 'caixa-e-sangria', 'curva-abc'];
const ICONES_PERGUNTAS = ['controle-de-estoque', 'caderninho-de-fiado', 'caixa-e-sangria', 'curva-abc', 'atacado-e-varejo', 'pdv-frente-de-caixa'];
const ICONES_NAO_FAZ = ['balanca', 'pedido', 'validade', 'entrega'];

// as telas de cada tópico de "O que muda": prints REAIS do SoftPay dentro das molduras da Mobile Simulator
const TELAS = [
  { arq: 'pdv-notebook', alt: 'Notebook com o PDV do SoftPay aberto numa venda, com a lista de produtos e o carrinho', botao: ['Conhecer o PDV', '/solucoes/sistema-pdv/'] },
  { arq: 'estoque-tablet', alt: 'Tablet com a tela de estoque do SoftPay: produtos por categoria, quantidade, custo e preço', botao: ['Controle de estoque', '/solucoes/sistema-de-estoque/'] },
  { arq: 'fiado-tablet', alt: 'Tablet com a tela de clientes do SoftPay, com o saldo de fiado de cada um', botao: ['Controle de fiado', '/solucoes/controle-de-fiado/'] },
  { arq: 'caixa-tablet', alt: 'Tablet em pé com o relatório financeiro do SoftPay: vendas do período por forma de pagamento', botao: ['Controle financeiro', '/solucoes/sistema-financeiro/'] },
  { arq: 'relatorio-imac', alt: 'Computador com o relatório financeiro do SoftPay e o gráfico das vendas por forma de pagamento', botao: ['Ver os planos', '/#pricing'] },
  { arq: 'fone-zap', alt: 'Celular com a conversa do bot do SoftPay no WhatsApp registrando a entrada de mercadoria', botao: ['Bot do WhatsApp', '/solucoes/bot-whatsapp/'] },
];

const partesHtml = (partes) => partes.map((p) => {
  if (p.tipo === 'p') return `<p>${p.texto}</p>`;
  if (p.tipo === 'h3') return `<h3>${e(p.texto)}</h3>`;
  if (p.tipo === 'ul' || p.tipo === 'ol') return `<${p.tipo}>${p.itens.map((i) => `<li>${i}</li>`).join('')}</${p.tipo}>`;
  if (p.tipo === 'nota') return nota(p);
  if (p.tipo === 'exemplo') return exemplo(p);
  if (p.tipo === 'tabela') return tabela(p);
  return '';
}).join('');
const nota = (p) => `<aside class="mx-nota"><p class="mx-nota-titulo">${e(p.titulo)}</p><p>${p.texto}</p></aside>`;
const exemplo = (p) => `<div class="mx-conta"><p class="mx-conta-titulo">${e(p.titulo)}</p><dl>`
  + p.linhas.map((l) => `<div class="mx-conta-linha${l.classe ? ' ' + l.classe.split(' ').map((c) => 'mx-' + c).join(' ') : ''}"><dt>${e(l.rotulo)}</dt><dd>${e(l.valor)}</dd></div>`).join('')
  + `</dl>${p.rodape ? `<p class="mx-conta-rodape">${p.rodape}</p>` : ''}</div>`;
const tabela = (p) => `<div class="mx-tabela"><table><thead><tr>${p.cabecalho.map((c) => `<th scope="col">${e(c)}</th>`).join('')}</tr></thead><tbody>`
  + p.linhas.map((l) => `<tr>${l.map((c, i) => `<td data-rotulo="${e(p.cabecalho[i] || '')}">${c}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';

function paginaProduto(D) {
  const B = D.base || '/moldes/clover-varejo';
  const pub = (arq, alt, w, h, extra = {}) => ({ src: `${B}/${arq}.webp`, menor: extra.semMenor ? '' : `${B}/${arq}-800.webp`, alt, w, h, ...extra });
  const cad = { texto: 'Testar grátis por 7 dias', href: D.links?.cadastro || 'https://app.softpaybr.com/cadastro' };
  const blocos = D.blocks || [];
  const [bA, bB, bC, bD, bE, bF, bG, ...resto] = blocos;
  const so = (b, tipo) => (b?.partes || []).filter((p) => p.tipo === tipo);

  const trilha = `<nav class="mx-trilha" aria-label="Trilha de navegação"><ol><li><a href="/">Início</a></li>`
    + (D.breadcrumbs || []).map(([nome, href]) => (href ? `<li><a href="${e(href)}">${e(nome)}</a></li>` : `<li aria-current="page">${e(nome)}</li>`)).join('') + '</ol></nav>';

  // C: pares h3 + p viram os tópicos da rolagem; a nota fecha o último (o do bot, que é dela)
  const pc = bC?.partes || [];
  const topicos = [];
  for (let i = 0; i < pc.length; i++) {
    if (pc[i].tipo === 'h3') topicos.push({ titulo: pc[i].texto, miolo: '' });
    else if (topicos.length) topicos[topicos.length - 1].miolo += partesHtml([pc[i]]);
  }
  const secoes = [
    hero(D, { topo: trilha, h1: D.h1, p: e(D.intro), botao: cad, img: pub('aparelhos-4', 'Computador, notebook, tablet e celular com telas reais do SoftPay: PDV, estoque e financeiro', 1640, 1240, { sizes: '(min-width: 1200px) 55vw, 100vw' }) }),
    bB && grade(D, 1, { titulo: bB.titulo, lista: true, classe: 'mx-g-problemas', celulas: so(bB, 'ul').flatMap((u) => u.itens).map((it, i) => ({ icone: { src: RECURSO(ICONES_PROBLEMAS[i % 5]), alt: '' }, texto: it })) }),
    bC && rolagem(D, { titulo: bC.titulo, itens: topicos.map((t, i) => { const T = TELAS[i % TELAS.length]; return { tag: 'h3', titulo: t.titulo, miolo: t.miolo, img: { src: `${B}/${T.arq}.webp`, alt: T.alt }, botao: { texto: T.botao[0], href: T.botao[1] } }; }) }),
    bA && textoMidia(D, 3, { lado: 'esquerda', classe: 'mx-tingida', titulo: bA.titulo, miolo: partesHtml(bA.partes), img: pub('casal-balcao', 'Casal de comerciantes no balcão do mercadinho conferindo as vendas no computador', 1600, 668, { semMenor: true, sizes: '(min-width: 1200px) 50vw, 100vw' }), botao: D.links?.wpp ? { texto: 'Tirar dúvidas no WhatsApp', href: D.links.wpp } : cad }),
    bF && grade(D, 4, { titulo: bF.titulo, lista: true, classe: 'mx-g-perguntas', celulas: so(bF, 'ul').flatMap((u) => u.itens).map((it, i) => ({ icone: { src: RECURSO(ICONES_PERGUNTAS[i % 6]), alt: '' }, titulo: it, tagTitulo: 'p', texto: null })) }),
    bE && flutuante(D, 5, { classe: 'mx-flutua-conta', fundo: `${B}/aparelhos-2.webp`, alt: 'Computador com o relatório financeiro do SoftPay e celular com o assistente de vendas', titulo: bE.titulo, miolo: partesHtml(bE.partes), botao: { texto: 'Calcular o lucro', href: '/guias/como-calcular-lucro-da-loja/' } }),
    bG && textoMidia(D, 6, { lado: 'direita', classe: 'mx-planos', titulo: bG.titulo, miolo: partesHtml(bG.partes), img: { src: '/assets/lojistas/celular-balcao.webp', alt: 'Celular no balcão da loja com o SoftPay aberto', w: 1600, h: 668 }, botao: { texto: 'Ver todos os planos', href: '/#pricing' } }),
    D.related?.length && flutuante(D, 7, { classe: 'mx-flutua-mais', fundo: `${B}/mercadinho-prateleira.webp`, alt: (D.figura && D.figura[1]) || 'Mercadinho com prateleiras de mercearia', titulo: 'Continue por aqui',
      miolo: `<ul class="mx-relacionados">${D.related.map(([t, href, d]) => `<li><a href="${e(href)}"><strong>${e(t)}</strong><span>${e(d || '')}</span></a></li>`).join('')}</ul>`,
      botao: { texto: 'Todos os segmentos', href: '/segmentos/' } }),
    bD && grade(D, 8, { titulo: bD.titulo, intro: so(bD, 'p').map((p) => p.texto).join(' '), lista: true, classe: 'mx-g-nao-faz', fundo: 'background-color: rgb(248, 248, 248);', celulas: so(bD, 'ul').flatMap((u) => u.itens).map((it, i) => ({ icone: { src: LINHA[ICONES_NAO_FAZ[i % 4]], alt: '' }, texto: it, rico: true })) }),
    // blocos a mais (rota futura com mais seções) não somem: entram como faixas de texto antes da FAQ
    ...resto.map((b, i) => textoMidia(D, 20 + i, { lado: 'esquerda', classe: 'mx-extra', titulo: b.titulo, miolo: partesHtml(b.partes), img: pub('aparelhos-2', '', 1448, 1086, { semMenor: true }) })),
    D.faq?.length && faq(D, { titulo: 'Perguntas frequentes', grupo: (D.slug || 'rota').split('/').pop(), aVista: 5, verMais: 'Ver mais perguntas',
      itens: D.faq.map(([q, a]) => ({ pergunta: q, resposta: `<p class="${P}RichBlurb_paragraph__lM8rJ rich-blurb-paragraph">${a}</p>` })),
      depois: D.mais?.length ? `<nav class="mx-mais" aria-label="Veja também"><h2 class="mx-mais-titulo">Veja também</h2><ul>${D.mais.map(([t, href]) => `<li><a href="${e(href)}">${e(t)}</a></li>`).join('')}</ul></nav>` : '' }),
    textoMidia(D, 10, { lado: 'centro', classe: 'mx-fim', fundo: 'background-color: rgb(248, 248, 248);', titulo: D.cta_title || 'Teste o SoftPay', rico: true,
      miolo: `<p class="${P}RichBlurb_paragraph__lM8rJ rich-blurb-paragraph">${e(D.cta_text || '')}</p>`, botao: cad,
      img: pub('fileira', 'Computador, notebook, tablet e celular lado a lado com telas reais do SoftPay', 2400, 620, { sizes: '(max-width: 699.98px) 195vw, 100vw' }) }),
  ];
  return secoes.filter(Boolean).join('');
}

const raiz = (miolo) => `<article class="${P}PageAssembly_page-assembly__aXcs6">${miolo}</article>`;

export function desenho(D) {
  return raiz(D.origem ? paginaOrigem(D) : paginaProduto(D));
}

export function render(ctx) {
  return raiz(ctx.modo === 'origem' ? paginaOrigem(ctx) : paginaProduto(ctx));
}
