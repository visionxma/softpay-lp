// Molde lightspeed-estoque: o corpo da página de gestão de estoque da Lightspeed Retail
// (lightspeedhq.com/pos/retail/inventory-management), clonado pela captura renderizada em 03/11/2026, para a rota
// /solucoes/sistema-de-estoque/. As mesmas peças montam as duas versões:
//   modo origem  → textos e imagens da própria referência (origem.json, tirado de secoes-html por
//                  ferramentas/extrair-origem.py): é o que a prova compara com a captura;
//   modo produto → o conteúdo da rota do SoftPay (tools/conteudo/solucoes/sistema-de-estoque.json), sem tirar
//                  nenhum texto de busca, e fatos da home (public/index.html) onde a rota não cobre o bloco.
// A marcação é a da referência (hero-united, cartões de número, desc-with-icons, half-width-module, carrossel de
// cartões, leadform, module-faq) com as classes do Tailwind dela; o CSS escopado (molde.css) faz tamanho, espaço e
// composição. O que é só do produto (hero de tela inteira, planos, valores do exemplo, grades do celular, trilho do
// carrossel, formulário que abre o WhatsApp, FAQ com "ver mais") leva a classe lv-* e mora em acabamento.css.
// Irmão de lightspeed-varejo (mesma referência): as peças comuns seguem o mesmo desenho.
import { readFileSync } from 'node:fs';

const O = JSON.parse(readFileSync(new URL('./origem.json', import.meta.url), 'utf8'));

export const meta = {
  id: 'lightspeed-estoque',
  referencia: 'https://www.lightspeedhq.com/pos/retail/inventory-management/',
  captura: '~/.jarvis/visionx/clones/capturas/lightspeed-estoque',
  // o cabeçalho e a barra de produto da Lightspeed ficam fora do <main> (a seção 0 começa em y=120/115)
  topoDoChassi: { 1440: 0, 390: 0 },
  classeRaiz: 'mx-vestido',
  secoes: [
    { idx: 0, tipo: 'hero dividido: texto + foto em caixa arredondada' },
    { idx: 1, tipo: 'três cartões de número' },
    { idx: 2, tipo: 'nove cartões com imagem larga, em três fileiras' },
    { idx: 3, tipo: 'quatro cartões com imagem e botão central' },
    { idx: 4, tipo: 'meia largura com lista de checagem (imagem à direita)' },
    { idx: 5, tipo: 'meia largura com lista de checagem (imagem à esquerda)' },
    { idx: 6, tipo: 'faixa de selos de avaliação', omitida: 'selos de avaliação de sites de terceiros (G2, Capterra) dados à Lightspeed; o SoftPay não tem nota equivalente publicada e nota não se inventa' },
    { idx: 7, tipo: 'meia largura com subtítulos em negrito (imagem à direita)' },
    { idx: 8, tipo: 'meia largura com lista de checagem (imagem à esquerda)' },
    { idx: 9, tipo: 'meia largura com lista de checagem (imagem à direita)' },
    { idx: 10, tipo: 'quatro passos com ícone' },
    { idx: 11, tipo: 'meia largura com lista de checagem (imagem à esquerda)' },
    { idx: 12, tipo: 'logos de clientes', omitida: 'logos de lojas reais clientes da Lightspeed; nada de cliente inventado' },
    { idx: 13, tipo: 'meia largura com lista de checagem (imagem à direita)' },
    { idx: 14, tipo: 'carrossel de cartões com setas' },
    { idx: 15, tipo: 'formulário de teste grátis' },
    { idx: 16, tipo: 'perguntas frequentes' },
    { idx: 17, tipo: 'notas legais', omitida: 'avisos legais da Lightspeed (marca registrada, GTV, Insights); o conteúdo da rota não tem nota de rodapé' },
    { idx: 18, tipo: 'notas de rodapé dos números', omitida: 'fontes dos números da Lightspeed (relatório anual e trimestral); os números saíram com a seção 1 trocada pelos planos' },
  ],
};

// ---------- pequenas peças ----------
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sec = (M, idx) => (M.origem ? ` data-mx-secao="${idx}"` : '');
const lv = (M, c) => (M.origem ? '' : ' ' + c);
const anima = (M) => (M.origem ? '' : ' data-lv-anima=""');
const SETA = '<span class="gb-button-jumpoff__arrow"><svg viewBox="0 0 13.6 22" aria-hidden="true" focusable="false"><path d="M2.5,22a2.49,2.49,0,0,1-1.77-.73,2.52,2.52,0,0,1,0-3.54L7.56,10.9.93,4.27A2.5,2.5,0,0,1,4.47.73l8.4,8.4a2.52,2.52,0,0,1,0,3.54l-8.6,8.6A2.49,2.49,0,0,1,2.5,22Z"></path></svg></span>';

const img = (i, cls, extra = '') =>
  `<img class="${cls}" src="${e(i.src)}"${i.srcset ? ` srcset="${e(i.srcset)}" sizes="${e(i.sizes)}"` : ''} width="${i.w}" height="${i.h}" alt="${e(i.alt || '')}"${extra}>`;

// A última palavra vai presa à seta (.lv-junto, sem quebra): no celular o rótulo quebra antes dela.
const jumpoff = (l, cls = '') => {
  const t = String(l.texto).trim();
  const i = t.lastIndexOf(' ');
  const ini = i < 0 ? '' : t.slice(0, i + 1);
  const fim = i < 0 ? t : t.slice(i + 1);
  return `<a class="gb-button-jumpoff gb-button-jumpoff--left${cls}" href="${e(l.href)}"${l.alvo ? ` target="${l.alvo}" rel="noopener"` : ''}> ${ini}<span class="lv-junto">${fim}${SETA}</span></a>`;
};

const botao = (b, tipo, lado, extra = '') => {
  const k = `gb-button-cta-featured-${tipo}`;
  return `<a class="${k} ${k}--on-${b.fundo || 'light'} ${k}--flexible ${k}--${lado} ${extra}" href="${e(b.href)}"${b.alvo ? ` target="${b.alvo}" rel="noopener"` : ''}> ${b.texto} </a>`;
};

// "<strong>Lead.</strong> resto" → [lead, resto]
function partir(item) {
  const m = String(item).match(/^\s*<strong>([\s\S]*?)<\/strong>([\s\S]*)$/);
  return m ? [m[1], m[2].trim()] : [item, ''];
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
  return `<div class="hero-section${lv(M, 'lv-hero')}"${sec(M, 0)}><div class="tw:max-w-full"><section class=" hero-united tw:bg-module-primary tw:text-primary tw:relative no-spacing gb-background-image " data-module-content-width="full" data-hero-section=""><div class="container "><div class="row"><div class="tw:tab:flex tw:tab:items-center">`
    + `<div class=" tw:lap-s:flex tw:lap-s:justify-center tw:lap-s:flex-col tw:lap-s:min-h-[462px] col-xs-12 col-md-6 tw:tab:pr-12 tw:lap-s:items-start tw:pt-9 tw:pb-0 tw:tab:py-20"${anima(M)}>`
    + `<header class="hero-united__text-content__header">${cabeca}<p class=" tw:mb-0 tw:w-full tw:text-center tw:mob-l:text-left tw:last:mb-0" data-footnote=""> ${H.intro} </p></header>`
    + `<div class=" hero-united__cta-buttons hero-united__cta-buttons--light tw:pt-6"><div class="gb-button-container gb-button-container--left${lv(M, 'lv-par')}">${botao(b1, 'primary', 'left')}${botao(b2, 'secondary', 'left')}</div></div></div>`
    + `<div class=" hero-united__media col-xs-12 col-md-6 tw:my-9 tw:lap-s:my-20"${anima(M)}><div class="tw:rounded-xl tw:overflow-hidden tw:des:max-h-[462px] tw:flex${lv(M, 'lv-hero-midia')}">${img(H.img, 'tw:object-cover tw:w-full tw:h-auto ', ' fetchpriority="high" decoding="async"')}</div></div>`
    + `</div></div></div></section></div></div>`;
}

// ---------- 1 · três cartões de número (no produto: os planos, um cartão por linha da tabela) ----------
function numeros(M) {
  const N = M.numeros;
  const alto = (c) => (c.minh ? ` data-element-reset-height="" style="min-height: ${c.minh}px;"` : '');
  const cartao = (c) => `<section class=" tw:h-full tw:tab-s:max-w-[394px] tw:flex tw:flex-col tw:items-start tw:border-1 tw:border-solid tw:border-tertiary tw:rounded-xl tw:bg-surface-primary tw:text-primary tw:gap-4 tw:tab-s:gap-20 tw:p-6 tw:mob-sp:px-12 tw:mob-sp:py-7 tw:tab-s:p-7 ${M.origem ? '' : c.destaque ? 'lv-plano lv-plano--destaque' : 'lv-plano'}"${anima(M)}>`
    + (c.nome ? `<div class="lv-plano-topo">${c.selo ? `<p class="lv-plano-selo">${c.selo}</p>` : ''}<p class="lv-plano-nome"><span>Plano</span> ${c.nome}</p>` : '')
    + `<h3 class=" gb-h1 tw:mob-sp:text-[2.625rem] tw:tab-s:text-[2.875rem] tw:mb-0 "${alto(c)}> ${c.valor} </h3>`
    + (c.nome ? '</div>' : '')
    + `<p class=" gb-p1 tw:mb-0 tw:mob-sp:text-[1.063rem] tw:tab-s:text-lg " data-footnote=""> ${c.texto} </p></section>`;
  const cabeca = N.titulo
    ? `<header class="module-header"><div class="container"><div class="row"><div class="col-xs-12"><h2 class="text-center gb-text-color-- gb-h3 module-title tw:mb-8 tw:tab-s:mb-9 "> ${N.titulo} </h2></div></div></div></header>`
    : '';
  const fecho = N.fecho ? `<p class="text-center lv-planos-fecho">${N.fecho}</p>` : '';
  return `<div class="tw:max-w-full"${sec(M, 1)}${N.id ? ` id="${N.id}"` : ''}><section class=" tw:pt-12 tw:pb-12 tw:mob-sp:pt-15 tw:mob-sp:pb-15 tw:bg-module-primary tw:text-primary no_spacing gb-background-image${lv(M, 'lv-planos')}" data-module-content-width="full">${cabeca}`
    + `<div class="container "><div class="row"><div class="col-xs-12"><div class=" tw:grid tw:gap-y-3.5 tw:mob-l:gap-y-5 tw:tab-s:gap-y-6 tw:tab-s:gap-x-6 tw:justify-center tw:tab-s:auto-rows-fr tw:grid-cols-1 tw:tab-s:grid-cols-[repeat(3,1fr)] " data-block-reset-height="">${N.cartoes.map(cartao).join('')}</div>${fecho}</div></div></div></section></div>`;
}

// ---------- 2, 3, 10 · cartões com imagem ou ícone ----------
function cartoes(M, idx, X) {
  const cartao = (c) => `<div class="col-xs-12 ${c.col || X.col || 'col-md-4'} tw:last:[&amp;&gt;[data-desc-with-icons-card]]:mb-4${lv(M, c.extra ? 'lv-col lv-extra-celular' : 'lv-col')}"><div data-desc-with-icons-card="" class=" careers__hiring__desc-with-icons__card html-module-override--desc-with-icons-card tw:flex tw:flex-col tw:relative tw:h-full tw:text-center tw:mt-4 tw:mx-auto tw:tab-s:m-0 tw:bg-transparent tw:py-0 ${M.origem ? '' : 'lv-cartao'}"${anima(M)}>`
    + `<div class="html-module-override--desc-with-icons-image-wrapper tw:w-full ${lv(M, 'lv-cartao-midia')}">${c.midia}</div>`
    + `<div class=" override-desc-with-icons-card-content tw:flex tw:flex-col tw:grow tw:*:last:mb-0 tw:text-center "><div data-element-reset-height=""${M.origem && c.minh ? ` style="--lv-minh: ${c.minh}px;"` : ''}>`
    // a altura igual entre cartões é o script da Lightspeed medindo a fileira; abaixo de 960 px (um cartão por
    // linha) ele a zera. A captura guardou a de 1440: ela vai numa variável e origem.css só a aplica de 960 para cima
    + (c.titulo ? `<h3 data-desc-with-icons-card-title="" class=" override-desc-with-icons-card-title gb-text-color--darkest gb-h4 tw:mb-3 tw:mob-l:mb-4.5 "> ${c.titulo} </h3>` : '')
    + (c.texto ? `<p data-desc-with-icons-card-paragraph="" class="gb-text-color--darkest tw:m-0 tw:tab-s:mb-[22.5px]"> ${c.texto} </p>` : '')
    + `</div></div></div></div>`;
  const linhas = X.linhas.map((l) => `<div class=" override-desc-with-icons-card-container row tw:mb-12 tw:last-of-type:mb-0 tw:mob-l:flex tw:mob-l:flex-wrap tw:mob-l:justify-center${lv(M, 'lv-linha')}" data-block-reset-height="">${l.map(cartao).join('')}</div>`).join('');
  const antes = X.antes || '';
  const fim = X.botao ? `<div class="gb-button-container gb-button-container--center${lv(M, 'lv-centro')}"><a class="gb-button-cta-regular gb-button-cta-regular--on-light gb-button-cta-regular--flexible gb-button-cta-regular--center gb-button-cta-regular--center-mobile " href="${e(X.botao.href)}"> ${X.botao.texto} </a></div>` : '';
  return `<div class="tw:max-w-full"${sec(M, idx)}${X.id ? ` id="${X.id}"` : ''}><section class=" desc-with-icons desc-with-icons--bg-type-transparent tw:bg-transparent gb-background-color--transparent gb-section-spacing gb-background-image${lv(M, X.classe || 'lv-icones')}" data-desc-with-icon="" data-module-content-width="full">`
    + `<header class="module-header"><div class="container"><div class="row"><div class="col-xs-12"><h2 class="text-center gb-text-color-- gb-h2 module-title "> ${X.titulo} </h2>${X.subtitulo ? `<p class="text-center gb-text-color-- module-subtitle"> ${X.subtitulo} </p>` : ''}</div></div></div></header>`
    + `<div class="container "><div class="row"><div class="col-xs-12">${antes}${linhas}${X.depois || ''}${fim}</div></div></div></section></div>`;
}

// ---------- 4, 5, 7, 8, 9, 11, 13 · meia largura ----------
// O CSS da Lightspeed esconde [data-animation-container-el] até o GSAP dela escrever "opacity: 1; visibility:
// inherit" no próprio elemento; o molde já nasce nesse estado final, o da captura.
function meia(M, idx, X) {
  const modulo = X.bullets ? 'half-width-module-with-bullets' : 'half-width-module';
  const link = X.link ? `<div class="gb-button-container gb-button-container--left gb-button-container--left-mobile ">${jumpoff(X.link, ' tw:text-primary tw:fill-icon-primary')}</div>` : '';
  return `<div class="tw:max-w-full"${sec(M, idx)}${X.id ? ` id="${X.id}"` : ''}><section class=" tw:group tw:py-9 tw:tab-s:py-12 tw:lap-s:py-15 ${modulo} tw:bg-module-primary gb-section-spacing gb-background-image--min-height gb-background-image${lv(M, 'lv-meia')}" data-animation-container-el="" data-module-content-width="half" data-module-content-alignment="${X.alinhamento}" style="opacity: 1; visibility: inherit;"><div class="container "><div class="row"><div class="col-xs-12"><section data-load-animation="staggered-slide-up" class=" content-container tw:flex tw:flex-col-reverse tw:gap-0 tw:tab:gap-9 tw:lap-s:gap-15 tw:group-data-[module-content-alignment=right]:tab:flex-row-reverse tw:group-data-[module-content-alignment=left]:tab:flex-row ">`
    + `<div data-cypress-animated-section="" class=" tw:w-full tw:tab:w-1/2 tw:flex tw:text-left tw:gap-8 tw:lap-s:gap-[84px] tw:items-center "${anima(M)}><div class="tw:text-primary tw:w-full">${X.texto}${link}</div></div>`
    + `<div data-cypress-animated-section="" class=" tw:flex tw:justify-center tw:w-full tw:tab:w-1/2 tw:items-center "${anima(M)}><figure class="tw:my-4 tw:tab:my-0 tw:w-full${lv(M, 'lv-figura')}">${X.figura}</figure></div>`
    + `</section></div></div></div></section></div>`;
}
const FOTO_MEIA = 'tw:block tw:w-full tw:h-auto tw:mx-auto tw:mb-3 tw:mob:mb-6 tw:tab:mb-0 tw:rounded-md';
const LISTA_CHECK = ' gb-list--unordered gb-list--unordered--dividers tw:pt-3 tw:pb-0 tw:relative tw:w-[calc(100%+24px)] ';
const ITEM_CHECK = 'tw:max-w-full tw:before:bg-[image:var(--black-checkmark-svg)]';
const listaCheck = (itens, extra = '') => `<ul class="${LISTA_CHECK}${extra}">${itens.map((i) => `<li data-half-width-bullet-list-item="" class="${ITEM_CHECK}"> ${i} </li>`).join('')}</ul>`;

// ---------- 14 · carrossel de cartões ----------
const SETA_ESQ = '<svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true" focusable="false"><path class="tw:fill-icon-primary tw:group-active:fill-icon-inverse-primary" d="M16.6978 7.27246L2.23989 7.27246L2.23989 5.38387L16.6978 5.38387L16.6978 7.27246Z"></path><path class="tw:fill-icon-primary tw:group-active:fill-icon-inverse-primary" d="M6.2487 0.000131491L7.55518 1.32294L2.61082 6.32819L7.55518 11.3334L6.2487 12.6562L-0.000359943 6.32817L6.2487 0.000131491Z"></path></svg>';
const SETA_DIR = '<svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true" focusable="false"><path class="tw:fill-icon-primary tw:group-active:fill-icon-inverse-primary" d="M0 5.38379H14.6386V7.27238H0V5.38379Z"></path><path class="tw:fill-icon-primary tw:group-active:fill-icon-inverse-primary" d="M10.5796 12.6561L9.25684 11.3333L14.263 6.32806L9.25684 1.3228L10.5796 0L16.9068 6.32808L10.5796 12.6561Z"></path></svg>';
const BOTAO_CARROSSEL = 'tw:group tw:w-[105px] tw:mob-l:w-20 tw:flex tw:justify-center tw:items-center tw:border tw:border-solid tw:border-tertiary tw:rounded-md tw:py-3 tw:px-1 tw:transition-[border-color] tw:duration-100 tw:hover:border-primary tw:active:bg-surface-inverse-primary tw:[.swiper-button-disabled]:bg-transparent tw:[.swiper-button-disabled]:hover:border-tertiary tw:[.swiper-button-disabled]:**:fill-icon-tertiary';
function carrossel(M) {
  const C = M.carrossel;
  const slide = (s, k, l) => `<li class="tw:list-none tw:border tw:border-solid tw:border-tertiary tw:rounded-md tw:px-4 tw:mob-l:px-6 tw:pt-5 tw:mob-l:pt-6 tw:pb-10 tw:mob-l:pb-12 tw:h-auto tw:grid tw:grid-cols-1 tw:auto-rows-[max-content_max-content_max-content_1fr] swiper-slide${lv(M, 'lv-slide')}" role="group" aria-roledescription="slide" aria-label="${k + 1} / ${l.length}"${M.origem ? ' style="width: 384px; margin-right: 24px;"' : ''}>`
    + img(s.img, 'tw:rounded-md tw:w-full tw:h-auto tw:block tw:mb-6 lazyloaded', ' loading="lazy" decoding="async"')
    + `<h3 class="tw:mb-4 tw:mob-l:mb-5 tw:last:mb-0">${s.titulo}</h3><p class="gb-p2 tw:mb-7 tw:mob-l:mb-8 tw:last:mb-0"> ${s.texto} </p>`
    + `<div class="gb-button-container gb-button-container--left tw:my-0 tw:self-end gb-button-container--left-mobile tw:mb-0">${jumpoff(s.link, ' tw:my-0 tw:self-end tw:text-primary tw:[&amp;_svg_path]:fill-icon-primary')}</div></li>`;
  // na origem o swiper já rodou: a seta de voltar nasce desligada, como na captura
  const prev = M.origem ? ' swiper-button-disabled" disabled="" tabindex="-1" aria-disabled="true' : '" disabled="" data-lv-volta="';
  return `<div class="tw:max-w-full"${sec(M, 14)}${C.id ? ` id="${C.id}"` : ''}><section data-flexible-card-carousel="container" data-flexible-card-carousel-desktop-count="3" class="flexible-card-carousel container tw:py-12 tw:mob:py-15 tw:flex tw:flex-col swiper-container swiper-initialized swiper-horizontal swiper-watch-progress${lv(M, 'lv-carrossel')}" role="region" aria-label="${e(C.aria)}">`
    + `<div class="tw:mb-8 tw:tab:mb-0 tw:tab:flex tw:tab:items-end tw:tab:gap-12"><h2 class="tw:mb-0 tw:tab:w-1/2 tw:tab:min-w-[175px]"> ${C.titulo} </h2>${C.subtitulo ? `<p class="lv-carrossel-sub">${C.subtitulo}</p>` : ''}</div>`
    + `<div class=" tw:tab:mb-9 tw:flex tw:w-full tw:justify-start tw:mob-l:justify-end tw:gap-3 tw:mob-l:gap-6 tw:order-last tw:tab:order-none tw:pr-0 tw:mob-l:pr-9 tw:tab:pr-0 ${lv(M, 'lv-setas')}">`
    + `<button class="${BOTAO_CARROSSEL}${prev}" type="button" data-flexible-card-carousel="prev-button" aria-label="${M.origem ? 'Previous slide' : 'Cartões anteriores'}">${SETA_ESQ}</button>`
    + `<button class="${BOTAO_CARROSSEL}" type="button" data-flexible-card-carousel="next-button" aria-label="${M.origem ? 'Next slide' : 'Próximos cartões'}"${M.origem ? ' tabindex="0" aria-disabled="false"' : ' data-lv-segue=""'}>${SETA_DIR}</button></div>`
    + `<ul data-flexible-card-carousel="slider" class="tw:mb-10 tw:tab:mb-0 swiper-wrapper${lv(M, 'lv-trilho')}"${M.origem ? ' aria-live="polite"' : ' tabindex="0" aria-label="' + e(C.titulo) + '"'}>${C.slides.map(slide).join('')}</ul>`
    + `</section></div>`;
}

// ---------- 15 · formulário ----------
function formulario(M) {
  const F = M.form;
  const corpo = M.origem
    ? `<form class="${F.atributos.class}" style="${F.atributos.style}">${F.miolo}</form>`
    : F.html;
  return `<div class="tw:max-w-full"${sec(M, 15)}${F.id ? ` id="${F.id}"` : ''}><section class=" leadform leadform__background-color--light tw:bg-surface-primary gb-section-spacing gb-background-image${lv(M, 'lv-form')}" data-module-content-width="full"><div class="container--full"><div class="row"><div class="col-xs-12">`
    + `<section class="leadform-standard " data-form="form-section"><div class="leadform__wrapper"><div class="text-center leadform__header "><div class="row"><div class="col-xs-12 col-sm-8 leadform__title-block"><h2 class="leadform__title leadform__title--dark">${F.titulo}</h2><p class="leadform__subtitle leadform__title--dark">${F.subtitulo}</p></div></div></div>`
    + `<div class="leadform__form-wrapper leadform__form-wrapper--standard col-xs-12">${corpo}</div></div></section>`
    + `</div></div></div></section></div>`;
}

// ---------- 16 · perguntas frequentes ----------
function faq(M) {
  const item = ([q, a], i) => `<details class=" gb-ui-dropdown-icon tw:border tw:border-solid tw:border-tertiary tw:rounded-md tw:mb-6 tw:relative tw:select-none ${!M.origem && i >= 5 ? 'lv-faq-extra' : ''}"${M.origem && i === 0 ? ' open=""' : ''} data-js="accordion"${M.origem ? '' : ' name="faq-estoque"'}>`
    + `<summary class="tw:cursor-pointer tw:font-lsMedium tw:pt-4.5 tw:pr-18 tw:pb-4.5 tw:pl-6"><h3 class="gb-h4 gb-no-margin-bottom">${q}</h3></summary>`
    + `<div class=" tw:mb-0 tw:mt-4.5 tw:text-primary tw:pt-4.5 tw:pr-18 tw:pb-4.5 tw:pl-6 tw:[&amp;_li]:list-disc " data-accordion="content">${M.origem ? a : `<p>${a}</p>`}</div></details>`;
  const mais = M.origem || M.faq.length <= 5 ? '' : '<div class="lv-faq-mais-caixa"><button type="button" class="lv-faq-mais" data-lv-faq-mais="" hidden></button></div>';
  return `<div class="tw:max-w-full"${sec(M, 16)}${M.origem ? '' : ' id="perguntas-frequentes"'}><section class=" module-faq gb-section-spacing gb-background-image${lv(M, 'lv-faq')}" data-module-content-width="full">`
    + `<header class="module-header"><div class="container"><div class="row"><div class="col-xs-12"><h2 class="text-center gb-text-color-- gb-h2 module-title "> ${M.faqTitulo} </h2></div></div></div></header>`
    + `<div class="container "><div class="row"><div class="col-xs-12 col-md-10 col-md-centered"><div${M.origem ? '' : ' class="lv-faq-lista"'}>${M.faq.map(item).join('')}</div>${mais}</div></div></div></section></div>`;
}

// ---------- modelo: origem ----------
function deOrigem() {
  const fotoMeia = (i) => img(i, FOTO_MEIA + ' lazyloaded', ' loading="lazy" decoding="async"');
  const midia = (c) => (c.svg
    ? `<div data-desc-with-icons-visual-icon="" class=" tw:mb-6 tw:relative tw:h-10 tw:w-10 tw:mx-auto tw:fill-icon-primary tw:text-primary tw:*:fill-current tw:*:block ">${c.svg}</div>`
    : img(c.img, 'tw:block tw:max-w-full tw:h-auto tw:mb-6 tw:mx-auto lazyloaded', ' data-desc-with-icons-image=""'));
  const grade = (G) => ({ titulo: G.titulo, subtitulo: G.subtitulo, botao: G.botao, linhas: G.linhas.map((l) => l.map((c) => ({ ...c, midia: midia(c) }))) });
  const meias = {};
  for (const [k, m] of Object.entries(O.meias)) meias[k] = { ...m, figura: fotoMeia(m.img) };
  return {
    origem: true,
    hero: O.hero,
    numeros: { cartoes: O.numeros },
    grade2: grade(O.grade2), grade3: grade(O.grade3), grade10: grade(O.grade10),
    meias,
    carrossel: O.carrossel,
    form: O.form,
    faqTitulo: 'Frequently asked questions',
    faq: O.faq,
  };
}

// ---------- ícones dos cinco sinais de descontrole (traço, no lugar dos ícones de passo da Lightspeed) ----------
const ICONE = (d) => `<svg class="gb-icon lv-traco" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
const ICONES = [
  // caixa vazia com interrogação: prometeu o que não tem
  ICONE('<path d="M8 17 24 9l16 8v16l-16 8-16-8z"/><path d="M8 17l16 8 16-8M24 25v16"/><path d="M21 31.5a3 3 0 1 1 4.2 2.7c-.8.4-1.2 1-1.2 1.8"/><path d="M24 39.6h.01"/>'),
  // duas caixas: comprou o que já estava lá
  ICONE('<rect x="6" y="20" width="18" height="18" rx="2"/><rect x="24" y="20" width="18" height="18" rx="2"/><path d="M15 20v6M33 20v6"/><path d="M17 12h14M27 8l4 4-4 4"/>'),
  // relógio sobre a prateleira: encalhe
  ICONE('<circle cx="24" cy="19" r="11"/><path d="M24 13v6l4 3"/><path d="M6 38h36M10 38v-4M38 38v-4"/>'),
  // percentual: margem média
  ICONE('<path d="M36 12 12 36"/><circle cx="15" cy="15" r="4.5"/><circle cx="33" cy="33" r="4.5"/>'),
  // tela com alerta: ninguém confia no número
  ICONE('<rect x="6" y="9" width="36" height="24" rx="3"/><path d="M18 40h12M24 33v7"/><path d="M24 15v8M24 27.5h.01"/>'),
];

// ---------- modelo: produto (o conteúdo da rota) ----------
function daRota(D) {
  const arq = (n) => D.v(`${D.base}/${n}`);
  // foto composta com a versão menor ao lado, sempre no arquivo <nome>-800.webp; `menor` é a largura REAL dele
  // (as vitrines têm 960 px e a menor, 480: o nome do arquivo não muda, só o descritor do srcset)
  const foto = (nome, w, h, alt, sizes, menor = 800) => ({
    src: arq(`${nome}.webp`), srcset: `${arq(`${nome}-800.webp`)} ${menor}w, ${arq(`${nome}.webp`)} ${w}w`, sizes, w, h, alt,
  });
  const bloco = (id) => (D.blocks || []).find((b) => b.id === id) || { titulo: '', partes: [] };
  const partes = (b, tipo) => b.partes.filter((p) => p.tipo === tipo);
  const L = D.links;
  const cadastro = { texto: 'Testar grátis', href: L.cadastro };
  const fotoMeia = (nome, alt) => img(foto(nome, 1460, 1020, alt, '(min-width: 768px) 50vw, 100vw'), FOTO_MEIA, ' loading="lazy" decoding="async"');

  // 1 · planos → cartões de número (um cartão por linha da tabela, o Loja no meio com o selo da home)
  const bPl = bloco('em-qual-plano-esta-cada-parte');
  const tab = partes(bPl, 'tabela')[0];
  const colUso = tab.cabecalho[2];
  const porNome = Object.fromEntries(tab.linhas.map((l) => [l[0], l]));
  const ordem = ['Comércio', 'Loja', 'ERP Completo'].map((n) => porNome[n]).filter(Boolean);
  const planos = (ordem.length === 3 ? ordem : tab.linhas).map(([nome, preco, uso]) => ({
    nome, valor: preco, texto: `<b class="lv-rot">${colUso}</b> ${uso}`,
    destaque: nome === 'Loja', selo: nome === 'Loja' ? 'Mais popular' : '',
  }));

  // 2 · como o SoftPay resolve → seis cartões com cena (foto da loja + recorte do print real)
  const bRes = bloco('como-o-softpay-resolve');
  const h3s = partes(bRes, 'h3');
  const ps = partes(bRes, 'p');
  const cenas = [
    ['card-baixa', 'Celular no balcão com a venda do PDV do SoftPay'],
    ['card-custo', 'Casal de comerciantes, com o custo e o preço de um produto no SoftPay'],
    ['card-variacoes', 'Loja de roupas, com uma calça cadastrada por tamanho no SoftPay'],
    ['card-abc', 'Cosméticos na prateleira, com o faturamento do mês no SoftPay'],
    ['card-atacado', 'Distribuidora de bebidas, com o saldo de um produto no SoftPay'],
    ['card-whatsapp', 'Mercadinho, com a conversa do bot do WhatsApp do SoftPay'],
  ];
  const resolve = h3s.map((h, k) => {
    const [nome, alt] = cenas[k] || cenas[0];
    // no celular os quatro primeiros ficam à vista e os outros abrem no "ver mais" (lista longa: doutrina, passo 2)
    return { titulo: h.texto, texto: (ps[k] || {}).texto || '', extra: k >= 4, midia: img(foto(nome, 1460, 605, alt, '(min-width: 960px) 33vw, 100vw'), 'tw:block tw:max-w-full tw:h-auto tw:mb-6 tw:mx-auto lv-cena', ' loading="lazy" decoding="async"') };
  });

  // 3 · quanto dinheiro está parado → quatro cartões com o valor de cada linha do exemplo
  const bVal = bloco('quanto-dinheiro-esta-parado-na-pratica');
  const ex = partes(bVal, 'exemplo')[0];
  const valores = ex.linhas.map((l) => {
    const tipo = /result/.test(l.classe) ? ' lv-valor--total' : /minus/.test(l.classe) ? ' lv-valor--parado' : '';
    return { col: 'col-md-3', texto: e(l.rotulo), midia: `<p class="lv-valor${tipo}"><span class="lv-valor-n">${e(l.valor)}</span></p>` };
  });

  // 10 · como o descontrole aparece → cinco sinais com ícone
  const bSin = bloco('como-o-descontrole-aparece-na-sua-loja');
  const sinais = partes(bSin, 'ul')[0].itens.map((i, k) => {
    const [t, x] = partir(i);
    return { col: 'col-md-3', titulo: t, texto: x, midia: `<div data-desc-with-icons-visual-icon="" class=" tw:mb-6 tw:relative tw:h-10 tw:w-10 tw:mx-auto tw:fill-icon-primary tw:text-primary tw:*:fill-current tw:*:block lv-icone">${ICONES[k % ICONES.length]}</div>` };
  });

  // meias
  const bLim = bloco('o-que-o-controle-de-estoque-nao-faz');
  const limites = partes(bLim, 'ul')[0].itens.map((i) => { const [t, x] = partir(i); return `<b>${t}</b> ${x}`; });
  const bProb = bloco('o-problema');
  const bResp = bloco('o-que-voce-passa-a-conseguir-responder');
  const h2 = (t) => `<h2 class="gb-h2"> ${t} </h2>`;
  const meias = {
    4: {
      id: bLim.id, alinhamento: 'right', bullets: true,
      texto: `${h2(bLim.titulo)}<p> ${partes(bLim, 'p')[0].texto} </p>${listaCheck(limites, 'lv-limites')}`,
      link: { texto: 'Tirar dúvida no WhatsApp', href: L.wpp, alvo: '_blank' },
      figura: fotoMeia('meia-limites', 'Mercadinho, com os botões de etiquetas em lote e de novo produto do SoftPay'),
    },
    // fatos da home (painel "O estoque bate com a prateleira")
    5: {
      id: 'o-estoque-bate-com-a-prateleira', alinhamento: 'left', bullets: true,
      texto: `${h2('O estoque bate com a prateleira')}<p> Entrada, saída, custo e preço de venda por produto, com variação de tamanho e cor quando a loja precisa. A curva ABC mostra quais itens realmente sustentam o faturamento. </p>${listaCheck(['Aviso de item acabando', 'Custo e margem por produto', 'Curva ABC: o que gira e o que empata dinheiro'])}`,
      link: cadastro,
      figura: fotoMeia('meia-prateleira', 'Loja de calçados, com dois produtos e o saldo de cada um no SoftPay'),
    },
    7: {
      id: bProb.id, alinhamento: 'right', bullets: false,
      texto: `${h2(bProb.titulo)}${partes(bProb, 'p').map((p) => `<p> ${p.texto} </p>`).join('')}`,
      link: cadastro,
      figura: fotoMeia('meia-problema', 'Lojista conferindo as araras de roupa, com o alerta de estoque baixo do SoftPay'),
    },
    8: {
      id: bResp.id, alinhamento: 'left', bullets: true,
      texto: `${h2(bResp.titulo)}${listaCheck(partes(bResp, 'ul')[0].itens)}`,
      link: { texto: 'Ler o guia de controle de estoque', href: '/guias/como-controlar-estoque/' },
      figura: fotoMeia('meia-respostas', 'Dono de loja com o relatório de faturamento do SoftPay'),
    },
    // fatos da home (painel do PDV)
    9: {
      id: 'a-venda-que-alimenta-o-estoque', alinhamento: 'right', bullets: true,
      texto: `${h2('Venda rápida, caixa fechado sem susto')}<p> Leitor de código de barras, busca por nome, desconto e finalização em uma tela. No fim do dia o caixa fecha com sangria, suprimento e o que entrou por cada forma de pagamento. </p>${listaCheck(['Cada venda baixa o estoque na hora', 'Dinheiro, Pix, cartão, fiado e misto', 'Funciona no computador do balcão e no celular'])}`,
      link: { texto: 'Ver o sistema PDV', href: '/solucoes/sistema-pdv/' },
      figura: fotoMeia('meia-pdv', 'PDV do SoftPay aberto no notebook, com o total da venda'),
    },
    // fatos da home (painel da loja online)
    11: {
      id: 'o-mesmo-estoque-na-loja-online', alinhamento: 'left', bullets: true,
      texto: `${h2('Sua vitrine na internet, com o estoque que já existe')}<p> A loja online usa o catálogo que você já cadastrou: o mesmo produto, o mesmo preço, o mesmo saldo. O cliente paga por Pix e a confirmação chega sozinha, sem você conferir extrato. </p>${listaCheck(['Catálogo e loja saem do mesmo cadastro', 'Pix com confirmação automática', 'Cupom e programa de fidelidade'])}`,
      link: { texto: 'Ver a loja online', href: '/solucoes/loja-online/' },
      figura: fotoMeia('meia-loja-online', 'Celular no balcão, com o catálogo online e o QR Code do SoftPay'),
    },
    // fatos da home (painel do bot do WhatsApp)
    13: {
      id: 'entrada-e-venda-pelo-whatsapp', alinhamento: 'right', bullets: true,
      texto: `${h2('Registre a venda falando no WhatsApp')}<p> Mande um áudio ou uma mensagem dizendo o que vendeu. O SoftPay entende, registra a venda, baixa o estoque e responde confirmando, sem você largar o balcão para abrir o sistema. </p>${listaCheck(['Funciona por texto ou áudio', 'Consulta preço e saldo na hora', 'Disponível a partir do plano Loja'])}`,
      link: { texto: 'Ver o bot do WhatsApp', href: '/solucoes/bot-whatsapp/' },
      figura: fotoMeia('meia-whatsapp', 'Celular com a conversa do bot do WhatsApp do SoftPay e o saldo de um produto'),
    },
  };

  // 14 · related → carrossel
  const vitrines = {
    '/guias/como-controlar-estoque/': ['vit-guia', 'Controle de estoque do SoftPay aberto no tablet'],
    '/solucoes/sistema-pdv/': ['vit-pdv', 'PDV do SoftPay aberto no notebook'],
    '/solucoes/bot-whatsapp/': ['vit-bot', 'Bot do WhatsApp do SoftPay aberto no celular'],
    '/segmentos/loja-de-roupas/': ['vit-roupas', 'Loja de roupas com as araras arrumadas'],
    '/segmentos/loja-de-variedades/': ['vit-variedades', 'Loja de variedades com as prateleiras cheias'],
    '/segmentos/distribuidora/': ['vit-distribuidora', 'Depósito de uma distribuidora de bebidas'],
  };
  const slides = (D.related || []).map((r, k) => {
    const [t, h, d] = Array.isArray(r) ? r : [r.titulo, r.href, r.desc];
    const [nome, alt] = vitrines[h] || Object.values(vitrines)[k % 6];
    return { titulo: t, texto: d || '', link: { texto: `Ver ${t.charAt(0).toLowerCase()}${t.slice(1)}`, href: h }, img: foto(nome, 960, 600, alt, '(min-width: 960px) 30vw, 50vw', 480) };
  });

  // 15 · formulário → mensagem do WhatsApp (nada é gravado; sem JS abre o WhatsApp com a mensagem padrão)
  const campo = (id, rotulo, tipo, extra = '') => `<div class="gb-form__field gb-form__field-${id}" data-formfield="ls-form-field"><input class="gb-form__field-text" type="${tipo}" id="lv-form-${id}" placeholder="${e(rotulo)}" data-lv-campo="${id}"${extra}><label class="gb-form__field-label" for="lv-form-${id}">${rotulo}</label><div class="gb-form__field-background"></div></div>`;
  const tipos = ['Loja de roupas e calçados', 'Loja de variedades', 'Mercadinho', 'Distribuidora', 'Cosméticos e perfumaria', 'Outro tipo de loja'];
  const formHtml = `<form class="gb-form lv-form-campos" action="https://wa.me/5599984304630" method="get" target="_blank" rel="noopener" data-lv-form="">`
    + campo('nome', 'Seu nome', 'text', ' autocomplete="name"')
    + campo('loja', 'Nome da loja', 'text', ' autocomplete="organization"')
    // "WhatsApp (DDD)" mede 141 px e o campo de meia largura em 360 tem 130 livres: o rótulo fica curto
    + campo('zap', 'WhatsApp', 'tel', ' autocomplete="tel" inputmode="tel"')
    + `<div class="gb-form__field gb-form__field-business_type" data-formfield="ls-form-field"><select class="gb-form__field-text" id="lv-form-tipo" data-lv-campo="tipo" aria-label="Tipo de loja"><option value="">Tipo de loja</option>${tipos.map((t) => `<option>${t}</option>`).join('')}</select></div>`
    + '<input type="hidden" name="text" value="Olá! Quero ver como o controle de estoque do SoftPay funciona na minha loja.">'
    + '<div class="gb-button-container gb-button-container--center"><button class="gb-button-cta-form gb-button-cta-form--on-light gb-button-cta-form--center" type="submit"> Chamar no WhatsApp </button></div>'
    + `<div class="gb-form__disclaimer form-subtext text-center"><p class="gb-form__disclaimer__text gb-form__disclaimer__text--dark"><a class="gb-form__disclaimer__text-link gb-form__disclaimer__text-link--dark lv-form-teste" href="${e(L.cadastro)}">Prefere testar? 7 dias grátis, sem cartão</a></p></div>`
    + '<div class="gb-form__disclaimer form-subtext text-center"><p class="gb-form__disclaimer__text gb-form__disclaimer__text--dark"> Seus dados vão só na mensagem do WhatsApp, para a equipe responder. Consulte a <a class="gb-form__disclaimer__text-link gb-form__disclaimer__text-link--dark" href="/privacidade.html">Política de Privacidade</a>. </p></div>'
    + '</form>';

  const trilha = (D.breadcrumbs || []).map(([t, h], k, l) => (h ? `<a href="${e(h)}">${t}</a>` : `<span aria-current="page">${t}</span>`) + (k < l.length - 1 ? '<span class="lv-trilha-sep" aria-hidden="true">/</span>' : '')).join('');

  return {
    origem: false,
    hero: {
      trilha, titulo: D.h1, intro: D.intro,
      botoes: [cadastro, { texto: 'WhatsApp', href: L.wpp, alvo: '_blank' }],
      img: foto('hero-estoque', 1520, 1141, (D.figura && D.figura[1]) || 'Lojista organizando produtos na prateleira da loja', '(min-width: 960px) 50vw, 100vw'),
    },
    numeros: { id: bPl.id, titulo: bPl.titulo, cartoes: planos, fecho: (partes(bPl, 'p')[0] || {}).texto || '' },
    grade2: {
      id: bRes.id, titulo: bRes.titulo, classe: 'lv-resolve', linhas: [resolve.slice(0, 3), resolve.slice(3)],
      depois: resolve.length > 4 ? '<div class="lv-mais-caixa"><button type="button" class="lv-ver-mais" data-lv-ver-mais="" hidden></button></div>' : '',
    },
    grade3: {
      id: bVal.id, titulo: bVal.titulo, subtitulo: partes(bVal, 'p')[0].texto, classe: 'lv-valores',
      antes: `<h3 class="lv-exemplo-titulo">${ex.titulo}</h3>`,
      linhas: [valores],
      depois: `<p class="lv-exemplo-rodape">${ex.rodape}</p>`,
      botao: cadastro,
    },
    grade10: { id: bSin.id, titulo: bSin.titulo, classe: 'lv-sinais', linhas: [sinais] },
    meias,
    carrossel: { id: 'continue-por-aqui', titulo: 'Continue por aqui', aria: 'Continue por aqui', subtitulo: 'O guia do método, o caixa que alimenta o estoque, o bot do WhatsApp e os segmentos que mais dependem de estoque.', slides },
    form: { id: 'falar-com-a-equipe', titulo: D.cta_title, subtitulo: D.cta_text, html: formHtml },
    faqTitulo: 'Perguntas frequentes',
    faq: D.faq || [],
  };
}

// ---------- montagem ----------
function montar(M) {
  const m = (k) => meia(M, Number(k), M.meias[k]);
  return [
    hero(M),
    numeros(M),
    cartoes(M, 2, M.grade2),
    cartoes(M, 3, M.grade3),
    m(4),
    m(5),
    m(7),
    m(8),
    m(9),
    cartoes(M, 10, M.grade10),
    m(11),
    m(13),
    carrossel(M),
    formulario(M),
    faq(M),
  ].join('\n');
}

export function desenho(D) {
  if (D.origem) return montar(deOrigem());
  return montar(daRota(D));
}

export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem' });
}
