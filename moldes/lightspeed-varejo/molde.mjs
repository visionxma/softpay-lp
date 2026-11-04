// Molde lightspeed-varejo: o corpo da página Retail POS da Lightspeed (lightspeedhq.com/pos/retail), clonado pela
// captura renderizada em 03/11/2026. As mesmas peças montam as duas versões:
//   modo origem  → textos e imagens da própria referência (origem.json): é o que a prova compara com a captura;
//   modo produto → o conteúdo da rota do SoftPay (tools/conteudo/<slug>.json), sem tirar nenhum texto de busca.
// A marcação é a da referência (hero-united, cartões de número, full-width-module, half-width-module,
// desc-with-icons, module-faq, footnote-section) com as classes do Tailwind dela; o CSS escopado (molde.css) faz
// tamanho, espaço e composição. O que é só do produto (hero de tela inteira, cenas com print real, ladrilhos de
// "continue por aqui", grades do celular, FAQ com "ver mais") leva a classe lv-* e mora em acabamento.css.
import { readFileSync } from 'node:fs';

const O = JSON.parse(readFileSync(new URL('./origem.json', import.meta.url), 'utf8'));

export const meta = {
  id: 'lightspeed-varejo',
  referencia: 'https://www.lightspeedhq.com/pos/retail/',
  captura: '~/.jarvis/visionx/clones/capturas/lightspeed-varejo',
  // o cabeçalho e a barra de produto da Lightspeed ficam fora do <main> (a seção 0 começa em y=120/115),
  // então nada da 1ª seção é lugar do cabeçalho do chassi
  topoDoChassi: { 1440: 0, 390: 0 },
  // a página vestida ganha .mx-vestido no <main>: o acabamento do SoftPay vale só nela, nunca na prova
  classeRaiz: 'mx-vestido',
  secoes: [
    { idx: 0, tipo: 'hero dividido: texto + foto em caixa arredondada' },
    { idx: 1, tipo: 'três cartões de número' },
    { idx: 2, tipo: 'faixa escura com botão e imagem larga' },
    { idx: 3, tipo: 'meia largura com pílula (imagem à esquerda)' },
    { idx: 4, tipo: 'cartões com ícone e lista' },
    { idx: 5, tipo: 'logos de clientes', omitida: 'logos de empresas reais clientes da referência; nada de cliente inventado' },
    { idx: 6, tipo: 'seis cartões com ilustração' },
    { idx: 7, tipo: 'meia largura (imagem à direita)' },
    { idx: 8, tipo: 'meia largura com grade de integrações' },
    { idx: 9, tipo: 'meia largura com lista de checagem' },
    { idx: 10, tipo: 'faixa de chamada' },
    { idx: 11, tipo: 'perguntas frequentes' },
    { idx: 12, tipo: 'notas de rodapé' },
  ],
};

// ---------- pequenas peças ----------
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sec = (M, idx) => (M.origem ? ` data-mx-secao="${idx}"` : '');
const lv = (M, c) => (M.origem ? '' : ' ' + c);
const anima = (M) => (M.origem ? '' : ' data-lv-anima=""');
const SETA = '<span class="gb-button-jumpoff__arrow"><svg viewBox="0 0 13.6 22" aria-hidden="true" focusable="false"><path d="M2.5,22a2.49,2.49,0,0,1-1.77-.73,2.52,2.52,0,0,1,0-3.54L7.56,10.9.93,4.27A2.5,2.5,0,0,1,4.47.73l8.4,8.4a2.52,2.52,0,0,1,0,3.54l-8.6,8.6A2.49,2.49,0,0,1,2.5,22Z"></path></svg></span>';
const PINO = '<svg viewBox="0 0 24 32" aria-hidden="true" focusable="false"><path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0Z"/><circle cx="12" cy="11.5" r="4.6"/></svg>';

const img = (i, cls, extra = '') =>
  `<img class="${cls}" src="${e(i.src)}"${i.srcset ? ` srcset="${e(i.srcset)}" sizes="${e(i.sizes)}"` : ''} width="${i.w}" height="${i.h}" alt="${e(i.alt || '')}"${extra}>`;

// A última palavra vai presa à seta (.lv-junto, sem quebra): no celular o rótulo quebra antes dela, nunca deixa a
// seta sozinha numa linha.
const jumpoff = (l, cls = '') => {
  const t = String(l.texto).trim();
  const i = t.lastIndexOf(' ');
  const ini = i < 0 ? '' : t.slice(0, i + 1);
  const fim = i < 0 ? t : t.slice(i + 1);
  return `<a class="gb-button-jumpoff gb-button-jumpoff--left${cls}" href="${e(l.href)}"> ${ini}<span class="lv-junto">${fim}${SETA}</span></a>`;
};

const botao = (b, tipo, lado, extra = '') => {
  const k = `gb-button-cta-featured-${tipo}`;
  return `<a class="${k} ${k}--on-${b.fundo || 'light'} ${k}--flexible ${k}--${lado} ${extra}" href="${e(b.href)}"${b.alvo ? ` target="${b.alvo}" rel="noopener"` : ''}> ${b.texto} </a>`;
};

// "<strong>Lead.</strong> resto" → [lead, resto]; se o resto começa com pontuação, a 1ª frase sobe para o título
// (com fronteira de tag no mesmo lugar, para o texto plano da rota sair idêntico)
function partir(item) {
  const m = String(item).match(/^\s*<strong>([\s\S]*?)<\/strong>([\s\S]*)$/);
  if (!m) return [item, ''];
  let lead = m[1];
  let resto = m[2].trim();
  if (/^[,;:]/.test(resto)) {
    const fim = resto.search(/\.\s/);
    const corte = fim >= 0 ? fim + 1 : resto.length;
    lead = `<span>${lead}</span>${resto.slice(0, corte)}`;
    resto = resto.slice(corte).trim();
  }
  return [lead, resto];
}

// ---------- 0 · hero ----------
function hero(M) {
  const H = M.hero;
  const pre = 'hero-united__text-content__header__preheader gb-preheader tw:text-primary tw:font-lsBold tw:mb-4.5 tw:uppercase tw:mob-l:mb-6 tw:text-center tw:mob-l:text-left tw:last:mb-0';
  const grande = 'gb-h1 tw:mb-0 tw:text-center tw:-ml-0.5 tw:mob-l:text-left tw:last:mb-0';
  const cabeca = M.origem
    ? `<hgroup class=" tw:p-0 tw:mb-6 tw:mob-l:mb-9"><h1 class=" ${pre}"> ${H.pre} </h1><p class=" ${grande}"> ${H.titulo} </p></hgroup>`
    : `<nav class=" ${pre} lv-trilha" aria-label="Trilha de navegação">${H.trilha}</nav><hgroup class=" tw:p-0 tw:mb-6 tw:mob-l:mb-9"><h1 class=" ${grande}">${H.titulo}</h1></hgroup>`;
  const [b1, b2] = H.botoes;
  return `<div class="hero-section${lv(M, 'lv-hero')}"${sec(M, 0)}><div class="tw:max-w-full"><section class=" hero-united tw:bg-module-secondary tw:text-primary tw:relative no-spacing gb-background-image " data-module-content-width="full" data-hero-section=""><div class="container "><div class="row"><div class="tw:tab:flex tw:tab:items-center">`
    + `<div class=" tw:lap-s:flex tw:lap-s:justify-center tw:lap-s:flex-col tw:lap-s:min-h-[462px] col-xs-12 col-md-6 tw:tab:pr-12 tw:lap-s:items-start tw:pt-9 tw:pb-0 tw:tab:py-20"${anima(M)}>`
    + `<header class="hero-united__text-content__header">${cabeca}<p class=" tw:mb-0 tw:w-full tw:text-center tw:mob-l:text-left tw:last:mb-0"> ${H.intro} </p></header>`
    + `<div class=" hero-united__cta-buttons hero-united__cta-buttons--light tw:pt-6"><div class="gb-button-container gb-button-container--left${lv(M, 'lv-par')}">${botao(b1, 'primary', 'left')}${botao(b2, 'secondary', 'left')}</div></div></div>`
    + `<div class=" hero-united__media col-xs-12 col-md-6 tw:my-9 tw:lap-s:my-20"${anima(M)}><div class="tw:rounded-xl tw:overflow-hidden tw:des:max-h-[462px] tw:flex${lv(M, 'lv-hero-midia')}">${img(H.img, 'tw:object-cover tw:w-full tw:h-auto ', ' fetchpriority="high" decoding="async"')}</div></div>`
    + `</div></div></div></section></div></div>`;
}

// ---------- 1 · três cartões de número (no produto: os planos, um cartão por linha da tabela) ----------
function numeros(M) {
  const N = M.numeros;
  const cartao = (c) => `<section class=" tw:h-full tw:tab-s:max-w-[394px] tw:flex tw:flex-col tw:items-start tw:border-1 tw:border-solid tw:border-tertiary tw:rounded-xl tw:bg-surface-primary tw:text-primary tw:gap-4 tw:tab-s:gap-20 tw:p-6 tw:mob-sp:px-12 tw:mob-sp:py-7 tw:tab-s:p-7 ${c.destaque ? 'lv-plano lv-plano--destaque' : M.origem ? '' : 'lv-plano'}"${anima(M)}>`
    + (c.nome ? `<div class="lv-plano-topo">${c.selo ? `<p class="lv-plano-selo">${c.selo}</p>` : ''}<p class="lv-plano-nome"><span>Plano</span> ${c.nome}</p>` : '')
    + `<h3 class=" gb-h1 tw:mob-sp:text-[2.625rem] tw:tab-s:text-[2.875rem] tw:mb-0 "> ${c.valor} </h3>`
    + (c.nome ? '</div>' : '')
    + `<p class=" gb-p1 tw:mb-0 tw:mob-sp:text-[1.063rem] tw:tab-s:text-lg "> ${c.texto} </p></section>`;
  return `<div class="tw:max-w-full"${sec(M, 1)}${N.id ? ` id="${N.id}"` : ''}><section class=" tw:pt-12 tw:pb-12 tw:mob-sp:pt-15 tw:mob-sp:pb-15 tw:bg-module-primary tw:text-primary no_spacing gb-background-image${lv(M, 'lv-planos')}" data-module-content-width="full">`
    + `<header class="module-header"><div class="container"><div class="row"><div class="col-xs-12"><h2 class="text-center gb-text-color-- gb-h3 module-title gb-h3 tw:mob-sp:text-[1.938rem] tw:tab-s:text-[2.125rem] tw:mb-8 tw:tab-s:mb-9 "> ${N.titulo} </h2>${N.subtitulo ? `<p class="text-center module-subtitle lv-planos-sub">${N.subtitulo}</p>` : ''}</div></div></div></header>`
    + `<div class="container "><div class="row"><div class="col-xs-12"><div class=" tw:grid tw:gap-y-3.5 tw:mob-l:gap-y-5 tw:tab-s:gap-y-6 tw:tab-s:gap-x-6 tw:justify-center tw:tab-s:auto-rows-fr tw:grid-cols-1 tw:tab-s:grid-cols-[repeat(3,1fr)] ">${N.cartoes.map(cartao).join('')}</div></div></div></div></section></div>`;
}

// ---------- 2 · faixa escura ----------
function escuro(M) {
  const X = M.escuro;
  return `<div class="tw:max-w-full"${sec(M, 2)}${X.id ? ` id="${X.id}"` : ''}><section class=" full-width-module tw:bg-module-inverse-primary tw:pt-12 tw:tab-s:pt-15 tw:pb-12 tw:tab-s:pb-20 gb-background-image${lv(M, 'lv-escuro')}" data-module-content-width="full"><div class="container "><div class="row"><div class="col-xs-12 override-full-width-module-content-wrapper html-module-override--full-width-module-content-wrapper tw:z-10 tw:my-0 ">`
    + `<div class="col-xs-12 col-md-10 col-md-pull-1 col-md-push-1 tw:mb-3"${anima(M)}><h2 class=" override-full-width-module-title tw:text-inverse-primary gb-h2 tw:text-center tw:mb-9 "> ${X.titulo} </h2>`
    + X.textos.map((t) => `<p class=" override-full-width-module-subtext tw:text-inverse-primary gb-p1 tw:text-center tw:mb-6 "> ${t} </p>`).join('')
    + `<div class="gb-button-container gb-button-container--center __parent ">${botao({ ...X.botao, fundo: 'dark' }, 'primary', 'center')}</div></div>`
    + `<div class="col-xs-12 tw:p-0"${anima(M)}>${img(X.imgCel, 'tw:block tw:tab-s:hidden tw:w-full tw:h-auto tw:rounded-md tw:tab-s:rounded-xl tw:p-0 tw:m-0', ' loading="lazy" decoding="async"')}${img(X.imgPc, 'tw:hidden tw:tab-s:block tw:w-full tw:h-auto tw:rounded-md tw:tab-s:rounded-xl tw:p-0 tw:m-0', ' loading="lazy" decoding="async"')}</div>`
    + `</div></div></div></section></div>`;
}

// ---------- 3, 7, 8, 9 · meia largura ----------
// O CSS da Lightspeed esconde [data-animation-container-el] (visibility:hidden) até o GSAP dela terminar e escrever
// "opacity: 1; visibility: inherit" no próprio elemento; o molde já nasce nesse estado final, o da captura.
function meia(M, idx, X, { alinhamento, bullets = false, duplo = false }) {
  const modulo = bullets ? 'half-width-module-with-bullets' : 'half-width-module';
  const miolo = `<section class=" tw:group tw:py-9 tw:tab-s:py-12 tw:lap-s:py-15 ${modulo} tw:bg-module-primary gb-section-spacing gb-background-image--min-height gb-background-image${lv(M, 'lv-meia')}" data-animation-container-el="" style="opacity: 1; visibility: inherit;" data-module-content-width="half" data-module-content-alignment="${alinhamento}"><div class="container "><div class="row"><div class="col-xs-12"><section data-load-animation="staggered-slide-up" class=" content-container tw:flex tw:flex-col-reverse tw:gap-0 tw:tab:gap-9 tw:lap-s:gap-15 tw:group-data-[module-content-alignment=right]:tab:flex-row-reverse tw:group-data-[module-content-alignment=left]:tab:flex-row ">`
    + `<div data-cypress-animated-section="" class=" tw:w-full tw:tab:w-1/2 tw:flex tw:text-left tw:gap-8 tw:lap-s:gap-[84px] tw:items-center "${anima(M)}><div class="tw:text-primary tw:w-full">${X.texto}</div></div>`
    + `<div data-cypress-animated-section="" class=" tw:flex tw:justify-center tw:w-full tw:tab:w-1/2 tw:items-center "${anima(M)}><figure class="tw:my-4 tw:tab:my-0 tw:w-full${lv(M, 'lv-figura')}">${X.figura}</figure></div>`
    + `</section></div></div></div></section>`;
  const id = X.id ? ` id="${X.id}"` : '';
  return duplo ? `<div class="tw:max-w-full"${sec(M, idx)}${id}><div class="tw:max-w-full">${miolo}</div></div>` : `<div class="tw:max-w-full"${sec(M, idx)}${id}>${miolo}</div>`;
}
const FOTO_MEIA = 'tw:block tw:w-full tw:h-auto tw:mx-auto tw:mb-3 tw:mob:mb-6 tw:tab:mb-0 tw:rounded-md';
const LISTA_CHECK = ' gb-list--unordered gb-list--unordered--dividers tw:pt-3 tw:pb-0 tw:relative tw:w-[calc(100%+24px)] ';
const ITEM_CHECK = 'tw:max-w-full tw:before:bg-[image:var(--black-checkmark-svg)]';
const listaCheck = (itens, extra = '') => `<ul class="${LISTA_CHECK}${extra}">${itens.map((i) => `<li data-half-width-bullet-list-item="" class="${ITEM_CHECK}"> ${i} </li>`).join('')}</ul>`;

// ---------- 4, 6 · cartões com ícone/ilustração ----------
function cartoes(M, idx, X) {
  const cartao = (c) => `<div class="col-xs-12 ${X.col || 'col-md-4'} tw:last:[&amp;&gt;[data-desc-with-icons-card]]:mb-4${lv(M, 'lv-col')}"><div data-desc-with-icons-card="" class=" careers__hiring__desc-with-icons__card html-module-override--desc-with-icons-card tw:flex tw:flex-col tw:relative tw:h-full tw:text-center tw:mt-4 tw:mx-auto tw:tab-s:m-0 tw:bg-transparent tw:py-0 ${M.origem ? '' : 'lv-cartao'}"${anima(M)}>`
    + `<div class="html-module-override--desc-with-icons-image-wrapper tw:w-full tw:self-start${lv(M, 'lv-cartao-midia')}">${c.midia}</div>`
    + `<div class=" override-desc-with-icons-card-content tw:flex tw:flex-col tw:grow tw:*:last:mb-0 tw:text-left "><div data-element-reset-height=""><h3 data-desc-with-icons-card-title="" class=" override-desc-with-icons-card-title gb-text-color--darkest gb-h4 tw:mb-3 tw:mob-l:mb-4.5 "> ${c.titulo} </h3>`
    + (c.texto ? `<p data-desc-with-icons-card-paragraph="" class="gb-text-color--darkest tw:m-0 tw:tab-s:mb-[22.5px]"> ${c.texto} </p>` : '')
    + (c.itens ? `<ul class="gb-list--unordered gb-list--unordered--dividers">${c.itens.map((i) => `<li class="gb-text-color--darkest tw:before:bg-[image:var(--black-checkmark-svg)] gb-p2 tw:max-w-full">${i}</li>`).join('')}</ul>` : '')
    + `</div>${c.link ? jumpoff(c.link) : ''}</div></div></div>`;
  const linhas = X.linhas.map((l) => `<div class=" override-desc-with-icons-card-container row tw:mb-12 tw:last-of-type:mb-0 tw:mob-l:flex tw:mob-l:flex-wrap tw:mob-l:justify-center${lv(M, 'lv-linha')}" data-block-reset-height="">${l.map(cartao).join('')}</div>`).join('');
  return `<div class="tw:max-w-full"${sec(M, idx)}${X.id ? ` id="${X.id}"` : ''}><section class=" desc-with-icons desc-with-icons--bg-type-transparent tw:bg-transparent gb-background-color--transparent gb-section-spacing gb-background-image${lv(M, X.classe || 'lv-icones')}" data-desc-with-icon="" data-module-content-width="full">`
    + `<header class="module-header"><div class="container"><div class="row"><div class="col-xs-12"><h2 class="text-center gb-text-color-- gb-h2 module-title "> ${X.titulo} </h2>${X.subtitulo ? `<p class="text-center gb-text-color-- module-subtitle"> ${X.subtitulo} </p>` : ''}</div></div></div></header>`
    + `<div class="container "><div class="row"><div class="col-xs-12">${linhas}${X.fecho ? `<p class="text-center gb-text-color-- module-subtitle lv-fecho"> ${X.fecho} </p>` : ''}</div></div></div></section></div>`;
}

// ---------- 10 · faixa de chamada ----------
function chamada(M) {
  const X = M.chamada;
  return `<div class="tw:max-w-full"${sec(M, 10)}><div class="tw:max-w-full"><section class=" full-width-module tw:bg-module-secondary gb-section-spacing gb-background-image${lv(M, 'lv-chamada')}" data-module-content-width="full"><div class="container "><div class="row"><div class="col-xs-12 override-full-width-module-content-wrapper html-module-override--full-width-module-content-wrapper tw:z-10 tw:my-0 "><div class="col-xs-12 col-md-10 col-md-pull-1 col-md-push-1 "${anima(M)}>`
    + `<h2 class=" override-full-width-module-title tw:text-primary gb- tw:text-center "> ${X.titulo} </h2><p class=" override-full-width-module-subtext tw:text-primary gb- tw:text-center "> ${X.texto} </p>`
    + `<div class="gb-button-container gb-button-container--center __parent tw:mb-0">${botao(X.botao, 'primary', 'center', 'tw:mb-0')}</div></div></div></div></div></section></div></div>`;
}

// ---------- 11 · perguntas frequentes ----------
function faq(M) {
  const tag = M.origem ? 'h2' : 'h3';
  const item = ([q, a], i) => `<details class=" gb-ui-dropdown-icon tw:border tw:border-solid tw:border-tertiary tw:rounded-md tw:mb-6 tw:relative tw:select-none ${!M.origem && i >= 5 ? 'lv-faq-extra' : ''}" data-js="accordion"${M.origem ? '' : ' name="faq-filiais"'}>`
    + `<summary class="tw:cursor-pointer tw:font-lsMedium tw:pt-4.5 tw:pr-18 tw:pb-4.5 tw:pl-6"><${tag} class="gb-h4 gb-no-margin-bottom">${q}</${tag}></summary>`
    + `<div class=" tw:mb-0 tw:mt-4.5 tw:text-primary tw:pt-4.5 tw:pr-18 tw:pb-4.5 tw:pl-6 " data-accordion="content"><p>${a}</p></div></details>`;
  const cabeca = M.origem ? '' : `<header class="module-header"><div class="container"><div class="row"><div class="col-xs-12"><h2 class="text-center gb-text-color-- gb-h2 module-title "> Perguntas frequentes </h2></div></div></div></header>`;
  const mais = M.origem || M.faq.length <= 5 ? '' : '<div class="lv-faq-mais-caixa"><button type="button" class="lv-faq-mais" data-lv-faq-mais="" hidden></button></div>';
  return `<div class="tw:max-w-full"${sec(M, 11)}${M.origem ? '' : ' id="perguntas-frequentes"'}><section class=" module-faq gb-section-spacing gb-background-image${lv(M, 'lv-faq')}" data-module-content-width="full">${cabeca}<div class="container "><div class="row"><div class="col-xs-12 col-md-10 col-md-centered"><div${M.origem ? '' : ' class="lv-faq-lista" data-lv-faq=""'}>${M.faq.map(item).join('')}</div>${mais}</div></div></div></section></div>`;
}

// ---------- 12 · notas de rodapé (no produto: "veja também") ----------
function notas(M) {
  if (M.origem) {
    return `<section class="footnote-section tw:py-6 tw:px-0 gb-section-spacing gb-background-image" data-footnote-section="" data-module-content-width="full"${sec(M, 12)}><div class="container "><div class="row"><div class="col-xs-12"><ol class="tw:mb-0 tw:list-outside tw:list-asterisk" data-footnote-section-list="" aria-hidden="true">${M.notas.map((n) => `<li class="tw:text-xs tw:**:text-xs tw:p-0"><p class="tw:mb-0 tw:*:mb-0" data-footnote-text="">${n}</p></li>`).join('')}</ol></div></div></div></section>`;
  }
  return `<section class="footnote-section tw:py-6 tw:px-0 gb-section-spacing gb-background-image lv-mais" data-module-content-width="full" aria-labelledby="veja-tambem"><div class="container "><div class="row"><div class="col-xs-12"><h2 class="lv-mais-titulo" id="veja-tambem">Veja também</h2><ul class="tw:mb-0 lv-mais-lista">${M.mais.map(([t, h]) => `<li class="tw:p-0"><a href="${e(h)}">${t}</a></li>`).join('')}</ul></div></div></div></section>`;
}

// ---------- modelo: origem ----------
function deOrigem() {
  const fotoMeia = (i) => img(i, FOTO_MEIA + ' lazyloaded', ' loading="lazy" decoding="async"');
  const a = O.atacado;
  const corpoAtacado = `<p> ${a.abertura}${a.itens.map(([t, x]) => `<br class="tw:hidden tw:mob-l:inline"><br class="tw:hidden tw:mob-l:inline"><b>${t}</b><br class="tw:hidden tw:mob-l:inline"> ${x}`).join(' ')} </p>`;
  return {
    origem: true,
    hero: { ...O.hero, botoes: O.hero.botoes },
    numeros: O.numeros,
    escuro: O.escuro,
    atacado: {
      texto: `<h2 class=" tw:text-primary gb-preheader tw:font-lsBold tw:uppercase tw:inline-block tw:px-3.5 tw:py-1.5 tw:mb-6 tw:tab-s:mb-9 tw:rounded-[12px] tw:bg-surface-secondary "> ${a.pilula} </h2><p class="gb-h2"> ${a.titulo} </p>${corpoAtacado}`,
      figura: fotoMeia(a.img),
    },
    beneficios: {
      titulo: O.beneficios.titulo, subtitulo: O.beneficios.subtitulo,
      linhas: [O.beneficios.cartoes.map((c) => ({ ...c, midia: img(c.img, 'tw:block tw:max-w-full tw:h-auto tw:mb-6 tw:mr-3 lazyloaded', ' data-desc-with-icons-image=""') }))],
    },
    recursos: {
      titulo: O.recursos.titulo,
      linhas: [O.recursos.cartoes.slice(0, 3), O.recursos.cartoes.slice(3)].map((l) => l.map((c) => ({ ...c, midia: img(c.img, 'tw:block tw:max-w-full tw:h-auto tw:mb-6 tw:mr-3 lazyloaded', ' data-desc-with-icons-image=""') }))),
    },
    multiloja: {
      texto: `<h2 class="gb-h2"> ${O.multiloja.titulo} </h2><p> ${O.multiloja.texto} </p><div class="gb-button-container gb-button-container--left gb-button-container--left-mobile ">${jumpoff(O.multiloja.link, ' tw:text-primary tw:fill-icon-primary')}</div>`,
      figura: fotoMeia(O.multiloja.img),
    },
    integracoes: {
      texto: `<h2 class="gb-h2"> ${O.integracoes.titulo} </h2><p> ${O.integracoes.texto} </p><div class="gb-button-container gb-button-container--left gb-button-container--left-mobile ">${jumpoff(O.integracoes.link, ' tw:text-primary tw:fill-icon-primary')}</div>`,
      figura: fotoMeia(O.integracoes.img),
    },
    troca: {
      texto: `<h2 class="gb-h2"> ${O.troca.titulo} </h2><p> ${O.troca.texto} </p>${listaCheck(O.troca.itens)}`,
      figura: fotoMeia(O.troca.img),
    },
    chamada: O.chamada,
    faq: O.faq,
    notas: O.notas,
  };
}

// ---------- modelo: produto (o conteúdo da rota) ----------
function daRota(D) {
  const arq = (n) => D.v(`${D.base}/${n}`);
  // foto/print com versão de 800px ao lado (<nome>-800.webp)
  const foto = (nome, w, h, alt, sizes) => ({
    src: arq(`${nome}.webp`), srcset: `${arq(`${nome}-800.webp`)} 800w, ${arq(`${nome}.webp`)} ${w}w`, sizes, w, h, alt,
  });
  const so = (nome, w, h, alt = '') => ({ src: arq(`${nome}.webp`), w, h, alt });
  const bloco = (id) => (D.blocks || []).find((b) => b.id === id) || { titulo: '', partes: [] };
  const partes = (b, tipo) => b.partes.filter((p) => p.tipo === tipo);
  const L = D.links;
  const cadastro = { texto: 'Testar grátis', href: L.cadastro };

  // B7 · planos → cartões de número (um cartão por linha da tabela, com o nome da coluna em cada valor)
  const b7 = bloco('qual-plano-faz-sentido');
  const tab = partes(b7, 'tabela')[0];
  const [, , colUso] = tab.cabecalho;
  const pComercio = partes(b7, 'p')[0];
  const valorComercio = (pComercio.texto.match(/R\$\s?\d+\/mês/) || ['R$ 69/mês'])[0];
  const linhaCartao = ([nome, preco, uso]) => ({ nome, valor: preco, texto: `<b class="lv-rot">${colUso}</b> ${uso}`, destaque: /ERP/i.test(nome), selo: /ERP/i.test(nome) ? 'Mais usuários' : '' });
  const cartoesPlano = tab.linhas.map(linhaCartao);
  // ordem do cartão: Loja · ERP Completo (no meio, em destaque) · Comércio
  cartoesPlano.push({ nome: 'Comércio', valor: valorComercio, texto: pComercio.texto });

  // B1 · faixa escura
  const b1 = bloco('o-que-muda-quando-existe-a-segunda-loja');
  const altFig = (D.figura && D.figura[1]) || '';

  // B2 · meia largura com pílula
  const b2 = bloco('os-problemas-que-aparecem-sempre');
  const itens2 = partes(b2, 'ul')[0].itens.map((i) => { const [t, x] = partir(i); return `<li><b>${t}</b><br> ${x}</li>`; }).join('');
  const atacado = {
    id: b2.id,
    texto: `<p class=" tw:text-primary gb-preheader tw:font-lsBold tw:uppercase tw:inline-block tw:px-3.5 tw:py-1.5 tw:mb-6 tw:tab-s:mb-9 tw:rounded-[12px] tw:bg-surface-secondary lv-pilula"> Rotina de quem tem filiais </p><h2 class="gb-h2"> ${b2.titulo} </h2><ul class="lv-lista-b">${itens2}</ul>`,
    figura: img(foto('problemas-roupas', 954, 668, 'Lojista conferindo as araras de roupa com um tablet', '(min-width: 768px) 50vw, 100vw'), FOTO_MEIA, ' loading="lazy" decoding="async"')
      + `<img class="lv-flutua" src="${arq('recorte-estoque.webp')}" width="330" height="172" alt="Alerta de estoque baixo no SoftPay" loading="lazy" decoding="async">`,
  };

  // B5 · cartões com ícone (o que o SoftPay não é)
  const b5 = bloco('o-que-o-softpay-nao-e');
  const [p5a, p5b] = partes(b5, 'p');
  const icones5 = ['nfe-e-nfce', 'clientes-e-crm', 'cupons-e-fidelidade', 'backup-automatico'];
  const beneficios = {
    id: b5.id, col: 'col-md-3', titulo: b5.titulo, subtitulo: p5a.texto, fecho: p5b && p5b.texto,
    linhas: [partes(b5, 'ul')[0].itens.map((i, k) => {
      const [t, x] = partir(i);
      return { titulo: t, texto: x, midia: `<span class="lv-icone-faixa"><img src="${arq(`ic-${icones5[k]}.webp`)}" width="256" height="256" alt="" loading="lazy" decoding="async"></span>` };
    })],
  };

  // B3 · seis cartões com cena (print real do SoftPay + ícone 3D da casa)
  const b3 = bloco('como-o-softpay-se-encaixa');
  const h3s = partes(b3, 'h3');
  const ps3 = partes(b3, 'p');
  const cenas = [
    { print: so('print-estoque', 800, 483, 'Tela de estoque do SoftPay'), icone: 'filiais', link: { texto: 'Ver múltiplas lojas', href: '/solucoes/multiplas-lojas/' } },
    { print: so('print-pdv', 800, 483, 'Frente de caixa do SoftPay com o operador identificado'), icone: 'acesso-por-funcionario', link: { texto: 'Ver o multi-login', href: '/solucoes/multiplas-lojas/' } },
    { print: so('print-celular', 460, 998, 'Venda pelo celular no SoftPay'), icone: 'loja-online-com-pix', celular: true, link: { texto: 'Ver o PDV no celular', href: '/solucoes/sistema-pdv/' } },
    { print: so('print-catalogo', 800, 483, 'Catálogo de produtos do SoftPay'), icone: 'atacado-e-varejo', link: { texto: 'Ver o controle de estoque', href: '/solucoes/sistema-de-estoque/' } },
    { print: so('print-financeiro', 800, 483, 'Relatório financeiro do SoftPay'), icone: 'curva-abc', link: { texto: 'Ver o sistema financeiro', href: '/solucoes/sistema-financeiro/' } },
    { print: so('recorte-fiado', 332, 120, 'Total de fiado registrado no SoftPay'), icone: 'venda-pelo-whatsapp', recorte: true, link: { texto: 'Ver o bot do WhatsApp', href: '/solucoes/bot-whatsapp/' } },
  ];
  const cartoes3 = h3s.map((h, k) => {
    const c = cenas[k] || cenas[0];
    const tipo = c.celular ? ' lv-cena--celular' : c.recorte ? ' lv-cena--recorte' : '';
    return {
      titulo: h.texto, texto: (ps3[k] || {}).texto || '', link: c.link,
      midia: `<span class="lv-cena${tipo}"><span class="lv-cena-tela">${img(c.print, 'lv-cena-print', ' loading="lazy" decoding="async"')}</span><img class="lv-cena-icone" src="${arq(`ic-${c.icone}.webp`)}" width="256" height="256" alt="" loading="lazy" decoding="async"></span>`,
    };
  });
  const recursos = { id: b3.id, titulo: b3.titulo, classe: 'lv-cenas', linhas: [cartoes3.slice(0, 3), cartoes3.slice(3)] };

  // B6 · meia largura (imagem à direita), com os dois pontos marcados na foto
  const b6 = bloco('segmento-e-recurso-qual-pagina-ler');
  const [p6a, p6b] = partes(b6, 'p');
  const multiloja = {
    id: b6.id,
    texto: `<h2 class="gb-h2"> ${b6.titulo} </h2><p> ${p6a.texto} </p><ul class="gb-list--unordered gb-list--unordered--dividers lv-lista-div">${partes(b6, 'ul')[0].itens.map((i) => `<li class="tw:max-w-full">${i}</li>`).join('')}</ul><p> ${p6b.texto} </p><div class="gb-button-container gb-button-container--left gb-button-container--left-mobile ">${jumpoff({ texto: 'Ver múltiplas lojas e filiais', href: '/solucoes/multiplas-lojas/' }, ' tw:text-primary tw:fill-icon-primary')}</div>`,
    figura: img(foto('multilojas-calcados', 954, 668, 'Vendedor conferindo um par de tênis no estoque da loja', '(min-width: 768px) 50vw, 100vw'), FOTO_MEIA, ' loading="lazy" decoding="async"')
      + `<span class="lv-pinos" aria-hidden="true"><span class="lv-pino lv-pino--1">${PINO}<span>Loja 1</span></span><span class="lv-pino lv-pino--2">${PINO}<span>Loja 2</span></span></span>`,
  };

  // related → meia largura com grade de ladrilhos (no lugar da grade de logos de integração)
  const ladrilhos = (D.related || []).map((r, k) => {
    const [t, h, d] = Array.isArray(r) ? r : [r.titulo, r.href, r.desc];
    return `<a class="lv-ladrilho lv-ladrilho--${(k % 6) + 1}" href="${e(h)}"><span class="lv-ladrilho-t">${t}</span>${d ? `<span class="lv-ladrilho-d">${d}</span>` : ''}</a>`;
  }).join('');
  const integracoes = {
    id: 'continue-por-aqui',
    texto: `<h2 class="gb-h2"> Continue por aqui </h2><p> Seis páginas que seguem o assunto: o recurso de filiais por dentro, o estoque, o caixa do conjunto, o bot do WhatsApp e os segmentos vizinhos. </p><div class="gb-button-container gb-button-container--left gb-button-container--left-mobile ">${jumpoff({ texto: 'Ver todos os segmentos', href: '/segmentos/' }, ' tw:text-primary tw:fill-icon-primary')}</div>`,
    figura: `<div class="lv-ladrilhos">${ladrilhos}</div>`,
  };

  // B4 · meia largura com lista de checagem + nota
  const b4 = bloco('o-que-precisa-ser-confirmado-antes-de-contratar');
  const nota = partes(b4, 'nota')[0];
  const troca = {
    id: b4.id,
    texto: `<h2 class="gb-h2"> ${b4.titulo} </h2><p> ${partes(b4, 'p')[0].texto} </p>${listaCheck(partes(b4, 'ul')[0].itens, 'lv-check')}`
      + (nota ? `<aside class="lv-nota"><p class="lv-nota-t">${nota.titulo}</p><p>${nota.texto}</p></aside>` : ''),
    figura: img(foto('suporte-casal', 956, 668, 'Casal de comerciantes conferindo o sistema no caixa da loja', '(min-width: 768px) 50vw, 100vw'), FOTO_MEIA, ' loading="lazy" decoding="async"'),
  };

  const trilha = (D.breadcrumbs || []).map(([t, h], k, l) => (h ? `<a href="${e(h)}">${t}</a>` : `<span aria-current="page">${t}</span>`) + (k < l.length - 1 ? '<span class="lv-trilha-sep" aria-hidden="true">/</span>' : '')).join('');

  return {
    origem: false,
    hero: {
      trilha, titulo: D.h1, intro: D.intro,
      botoes: [cadastro, { texto: 'WhatsApp', href: L.wpp, alvo: '_blank' }],
      img: foto('hero-aparelhos', 1448, 1086, 'SoftPay aberto no computador, no notebook, no tablet e no celular', '(min-width: 960px) 50vw, 100vw'),
    },
    numeros: { id: b7.id, titulo: b7.titulo, subtitulo: `${tab.cabecalho[0]}, ${tab.cabecalho[1].toLowerCase()} e o uso de cada um`, cartoes: [cartoesPlano[0], cartoesPlano[1], cartoesPlano[2]] },
    escuro: {
      id: b1.id, titulo: b1.titulo, textos: partes(b1, 'p').map((p) => p.texto),
      botao: { texto: 'Criar conta grátis', href: L.cadastro },
      imgCel: foto('faixa-filiais-alto', 1168, 668, altFig, '100vw'),
      imgPc: foto('faixa-filiais-largo', 1600, 590, altFig, '(min-width: 1470px) 1390px, 100vw'),
    },
    atacado, beneficios, recursos, multiloja, integracoes, troca,
    chamada: { titulo: D.cta_title, texto: D.cta_text, botao: cadastro },
    faq: D.faq || [],
    mais: D.mais || [],
  };
}

// ---------- montagem ----------
function montar(M) {
  return [
    hero(M),
    numeros(M),
    escuro(M),
    meia(M, 3, M.atacado, { alinhamento: 'right' }),
    cartoes(M, 4, M.beneficios),
    cartoes(M, 6, M.recursos),
    meia(M, 7, M.multiloja, { alinhamento: 'left' }),
    meia(M, 8, M.integracoes, { alinhamento: 'right' }),
    meia(M, 9, M.troca, { alinhamento: 'left', bullets: true, duplo: true }),
    chamada(M),
    faq(M),
    notas(M),
  ].join('\n');
}

export function desenho(D) {
  if (D.origem) return montar(deOrigem());
  return montar(daRota(D));
}

export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem' });
}
