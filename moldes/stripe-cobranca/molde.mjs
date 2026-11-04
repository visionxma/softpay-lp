// Molde stripe-cobranca: o corpo da página do Stripe Invoicing (stripe.com/invoicing), clonado pela captura
// renderizada (~/.jarvis/visionx/clones/capturas/stripe-cobranca, 1440 e 390) em 04/11/2026, para a rota
// /solucoes/controle-de-fiado/.
//
// A ordem, a composição e a escala são as da Stripe: hero em duas colunas (título grande, texto, dois botões à
// esquerda; a tela do produto numa moldura escura à direita) cortada pela faixa diagonal de cor; quatro colunas
// com ícone e régua de destaque; "como funciona" com passos numerados em fileira e linhas texto + imagem; a
// seção clara com o quadro comparativo e o cartão de análise; o bloco escuro; "recursos inclusos" em colunas
// com lista de checagem; três cartões de leitura; e a faixa final com a chamada à esquerda e dois links à direita.
//
// O que é de gente/empresa real da Stripe sai (logos de clientes, relatos da Slack, Figma e Hero Health, logos
// de ERPs parceiros, números da Stripe como "87% das faturas"). Os blocos recebem o conteúdo da rota e os fatos
// do SoftPay que estão no JSON da rota. Nenhum texto de busca sai (portão de texto do vestir.mjs). Telas do
// produto: prints reais de public/assets/sistema (a tela Clientes › Fiado e a Financeiro).
//
// Não há modo origem nesta versão (teto de 45 min do BRIEFING): D.origem desenha a rota.

export const meta = {
  id: 'stripe-cobranca',
  referencia: 'https://stripe.com/invoicing',
  captura: '~/.jarvis/visionx/clones/capturas/stripe-cobranca',
  topoDoChassi: { 1440: 0, 390: 0 },
  classeRaiz: 'mx-sc',
  secoes: [
    { idx: 0, tipo: 'cabeçalho da Stripe', omitida: 'o cabeçalho é do chassi (nav com data-topo)' },
    { idx: 1, tipo: 'sub-navegação do Billing', omitida: 'menu de produto da Stripe; a trilha Soluções › Controle de fiado ocupa o lugar' },
    { idx: 2, tipo: 'hero: título, texto, dois botões e a tela do produto em moldura escura, cortada pela faixa diagonal de cor' },
    { idx: 3, tipo: 'quatro colunas com ícone, régua de destaque, título e texto' },
    { idx: 4, tipo: 'faixa de logos de clientes', omitida: 'logos de empresas reais clientes da Stripe; cliente não se inventa' },
    { idx: 5, tipo: 'como funciona: passos numerados em fileira + linhas texto/imagem com lista de checagem + tela larga do painel' },
    { idx: 6, tipo: 'seção clara: título, texto e botão + quadro comparativo com legenda ao lado + cartão de análise (logos de ERPs parceiros saem)' },
    { idx: 7, tipo: 'bloco escuro (no original, "para desenvolvedores": vira o que o controle de fiado não faz)' },
    { idx: 8, tipo: 'recursos inclusos: título grande e colunas com lista de checagem' },
    { idx: 9, tipo: 'três cartões de leitura (no original, relatos de clientes: viram as páginas relacionadas do SoftPay)' },
    { idx: 10, tipo: 'faixa final: chamada com dois botões à esquerda e dois links com ícone à direita' },
    { idx: 11, tipo: 'rodapé da Stripe', omitida: 'o rodapé é do chassi' },
  ],
};

// ---------- pequenas peças ----------
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const anima = ' data-sc-anima=""';

function partir(item) {
  const m = String(item).match(/^\s*<strong>([\s\S]*?)<\/strong>([\s\S]*)$/);
  return m ? [m[1], m[2].trim()] : [item, ''];
}

const SETA = '<svg class="sc-seta" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M3.5 2 6.5 5l-3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK = '<span class="sc-check" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="m4.5 8.2 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const XIS = '<span class="sc-xis" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="m5 5 6 6M11 5l-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>';
const MAIS = '<span class="sc-faq-sinal" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>';

// Ícones em duas camadas (claro atrás, forte na frente), como os da Stripe, nas cores do SoftPay.
const ICONES = [
  '<svg viewBox="0 0 40 36" aria-hidden="true" focusable="false"><path d="M2 2h14v32H2z" fill="#9FD0F3"/><path d="M10 2 36 18 10 34z" fill="#0C5C9E"/><path d="M10 10 22 18 10 26z" fill="#40A5E7"/></svg>',
  '<svg viewBox="0 0 40 36" aria-hidden="true" focusable="false"><rect x="2" y="4" width="22" height="30" rx="3" fill="#9FD0F3"/><path d="M7 12h12M7 17h12M7 22h8" stroke="#0C5C9E" stroke-width="2.2" stroke-linecap="round"/><circle cx="29" cy="9" r="8" fill="#0C5C9E"/><path d="m25.5 9 2.4 2.4 4.6-4.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  '<svg viewBox="0 0 40 36" aria-hidden="true" focusable="false"><path d="M4 10 18 3l14 7-14 7z" fill="#9FD0F3"/><path d="M18 17v16L4 26V10z" fill="#40A5E7"/><path d="M18 17v16l14-7V10z" fill="#0C5C9E"/></svg>',
  '<svg viewBox="0 0 40 36" aria-hidden="true" focusable="false"><path d="M2 34 14 20l8 6L36 4v30z" fill="#0C5C9E"/><path d="M14 20 22 26 30 14l6-10v12L22 30z" fill="#40A5E7"/></svg>',
];

function img(D, arq, alt, w, h, extra = '') {
  return `<img src="${D.v(`${D.base}/${arq}`)}" width="${w}" height="${h}" alt="${e(alt)}" loading="lazy" decoding="async"${extra}>`;
}
function imgResp(D, arq, arq800, alt, w, h, sizes, extra = '') {
  return `<img src="${D.v(`${D.base}/${arq}`)}" srcset="${D.v(`${D.base}/${arq800}`)} 800w, ${D.v(`${D.base}/${arq}`)} ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${e(alt)}"${extra}>`;
}

function botoes(D, rotulo = 'Teste grátis') {
  return `<div class="sc-botoes">`
    + `<a class="sc-btn sc-btn--cheio" href="${e(D.links.cadastro)}">${rotulo}${SETA}</a>`
    + `<a class="sc-btn sc-btn--link" href="${e(D.links.wpp)}" target="_blank" rel="noopener">WhatsApp${SETA}</a>`
    + `</div>`;
}

// ---------- conteúdo da rota, por bloco ----------
function blocos(D) {
  const B = {};
  for (const b of D.blocks || []) B[b.id] = b;
  const ps = (b) => (b?.partes || []).filter((p) => p.tipo === 'p').map((p) => p.texto);
  const lista = (b) => (b?.partes || []).find((p) => p.tipo === 'ul' || p.tipo === 'ol')?.itens || [];
  const parte = (b, t) => (b?.partes || []).find((p) => p.tipo === t);
  const pares = (b) => {
    const out = []; let h = null;
    for (const p of b?.partes || []) {
      if (p.tipo === 'h3') h = p.texto;
      else if (p.tipo === 'p' && h) { out.push([h, p.texto]); h = null; }
    }
    return out;
  };
  return { B, ps, lista, parte, pares };
}

// ---------- seções ----------
function hero(D) {
  const trilha = (D.breadcrumbs || []).map(([t, h]) => h
    ? `<a href="${e(h)}">${e(t)}</a><span class="sc-trilha-sep" aria-hidden="true">/</span>`
    : `<span aria-current="page">${e(t)}</span>`).join('');
  return `<section class="sc-hero" data-sc-secao="2">`
    + `<div class="sc-caixa sc-hero-grade">`
    + `<div class="sc-hero-texto"${anima}>`
    + `<nav class="sc-trilha" aria-label="Trilha de navegação">${trilha}</nav>`
    + `<h1 class="sc-t1">${D.h1}</h1>`
    + `<p class="sc-hero-intro">${D.intro}</p>`
    + botoes(D)
    + `<p class="sc-entrar">Já usa o SoftPay? <a href="${e(D.links.app)}">Entrar no sistema</a></p>`
    + `</div>`
    + `<figure class="sc-hero-tela"${anima}>`
    + `<div class="sc-moldura">`
    + imgResp(D, 'clientes.webp', 'clientes-800.webp', 'Tela Clientes do SoftPay na aba Fiado: total a receber, clientes com débito e saldo de cada um', 1400, 845, '(min-width: 64rem) 40vw, 92vw', ' fetchpriority="high" decoding="async"')
    + `</div>`
    + `</figure>`
    + `</div>`
    + `</section>`;
}

function problema(D, C) {
  const b = C.B['o-problema'];
  const titulos = ['O caderno', 'O fiado é parte do negócio', 'O efeito silencioso', 'O desconforto de cobrar'];
  const cols = C.ps(b).map((p, i) => `<div class="sc-col"${anima}>`
    + `<span class="sc-icone">${ICONES[i % 4]}</span>`
    + `<h3 class="sc-col-titulo">${titulos[i] || ''}</h3>`
    + `<p>${p}</p></div>`).join('');
  return `<section class="sc-sec sc-sec--branca sc-colunas-sec" id="${e(b?.id || 'o-problema')}" data-sc-secao="3">`
    + `<div class="sc-caixa">`
    + `<h2 class="sc-sobre">${e(b?.titulo || 'O problema')}</h2>`
    + `<div class="sc-quatro">${cols}</div>`
    + `</div></section>`;
}

function comoFunciona(D, C) {
  const res = C.B['como-o-softpay-resolve'];
  const apar = C.B['como-isso-aparece-na-sua-loja'];
  const buraco = C.B['o-tamanho-do-buraco-quando-ele-fica-visivel'];
  const ex = C.parte(buraco, 'exemplo');
  const passos = C.pares(res).map(([h, p], i) => `<li class="sc-passo"${anima}>`
    + `<span class="sc-num" aria-hidden="true">${i + 1}</span>`
    + `<h3 class="sc-col-titulo">${h}</h3><p>${p}</p></li>`).join('');
  const itens = C.lista(apar).map((it) => { const [t, r] = partir(it); return `<li>${CHECK}<span><strong>${t}</strong> ${r}</span></li>`; }).join('');
  const linhas = (ex?.linhas || []).map((l, i) => `<li class="sc-ex-linha${/result/.test(l.classe) ? ' sc-ex-linha--total' : ''}">`
    + `<span class="sc-ponto sc-ponto--${i}" aria-hidden="true"></span><span class="sc-ex-rot">${l.rotulo}</span><span class="sc-ex-val">${l.valor}</span></li>`).join('');
  return `<section class="sc-sec sc-sec--branca sc-funciona" id="${e(res?.id)}" data-sc-secao="5">`
    + `<div class="sc-caixa">`
    + `<p class="sc-sobre">Como funciona</p>`
    + `<h2 class="sc-t2">${e(res?.titulo)}</h2>`
    + `<ol class="sc-passos">${passos}</ol>`
    // linha 1: texto com lista de checagem + foto
    + `<div class="sc-linha" id="${e(apar?.id)}">`
    + `<div class="sc-linha-texto"${anima}><h2 class="sc-t3">${e(apar?.titulo)}</h2>`
    + `<p class="sc-lista-rotulo">Cada sinal de que o caderno já não dá conta</p>`
    + `<ul class="sc-checks">${itens}</ul>`
    + `<a class="sc-btn sc-btn--cheio sc-btn--p" href="${e(D.links.cadastro)}">Experimente${SETA}</a></div>`
    + `<figure class="sc-linha-midia sc-foto"${anima}>${img(D, 'casal-comerciantes.webp', 'Casal de comerciantes conferindo as contas no computador da loja', 1600, 668)}</figure>`
    + `</div>`
    // linha 2: o exemplo do caderno no cartão de análise + texto
    + `<div class="sc-linha sc-linha--inv" id="${e(buraco?.id)}">`
    + `<div class="sc-linha-texto"${anima}><h2 class="sc-t3">${e(buraco?.titulo)}</h2>`
    + C.ps(buraco).map((p) => `<p>${p}</p>`).join('')
    + `</div>`
    + `<div class="sc-linha-midia"${anima}><div class="sc-cartao sc-analise">`
    + `<p class="sc-analise-titulo">${e(ex?.titulo)}</p>`
    + `<div class="sc-barra" aria-hidden="true"><span></span><span></span><span></span></div>`
    + `<ul class="sc-ex">${linhas}</ul>`
    + (ex?.rodape ? `<p class="sc-ex-rodape">${ex.rodape}</p>` : '')
    + `</div></div>`
    + `</div>`
    // tela larga do painel
    + `<figure class="sc-painel"${anima}><div class="sc-painel-moldura">`
    + imgResp(D, 'financeiro.webp', 'financeiro-800.webp', 'Tela Financeiro do SoftPay com entradas, saídas e valores a receber', 1400, 845, '(min-width: 64rem) 72rem, 94vw', ' loading="lazy" decoding="async"')
    + `</div><figcaption>A venda fiada aparece como valor a receber no Financeiro.</figcaption></figure>`
    + `</div></section>`;
}

function planos(D, C) {
  const b = C.B['em-qual-plano-esta'];
  const t = C.parte(b, 'tabela');
  const cab = t?.cabecalho || [];
  const corpo = (t?.linhas || []).map((l, i) => `<tr${i === 1 ? ' class="sc-tab-destaque"' : ''}>`
    + l.map((c, j) => `<td data-rotulo="${e(cab[j] || '')}">${j === 2 ? CHECK : ''}<span>${c}</span></td>`).join('') + `</tr>`).join('');
  return `<section class="sc-sec sc-sec--clara sc-planos" id="${e(b?.id)}" data-sc-secao="6">`
    + `<div class="sc-caixa">`
    + `<div class="sc-planos-topo"${anima}><p class="sc-sobre">Planos</p><h2 class="sc-t2">${e(b?.titulo)}</h2>`
    + C.ps(b).map((p) => `<p class="sc-sub">${p}</p>`).join('')
    + `<a class="sc-btn sc-btn--cheio sc-btn--p" href="${e(D.links.cadastro)}">Crie uma conta${SETA}</a></div>`
    + `<div class="sc-tabela-linha">`
    + `<div class="sc-tabela-legenda"${anima}><h3 class="sc-col-titulo">O caderninho digital em todos</h3><p>O saldo e o histórico por cliente estão desde o Comércio. A cobrança por link de Pix no WhatsApp entra a partir do Loja.</p></div>`
    + `<div class="sc-cartao sc-tabela-box"${anima}><table class="sc-tabela"><thead><tr>${cab.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${corpo}</tbody></table></div>`
    + `</div>`
    + `</div></section>`;
}

function naoFaz(D, C) {
  const b = C.B['o-que-o-controle-de-fiado-nao-faz'];
  const itens = C.lista(b).map((it) => { const [t, r] = partir(it); return `<li${anima}>${XIS}<div><h3 class="sc-col-titulo">${t}</h3><p>${r}</p></div></li>`; }).join('');
  return `<section class="sc-sec sc-escuro" id="${e(b?.id)}" data-sc-secao="7">`
    + `<div class="sc-caixa">`
    + `<p class="sc-sobre">Com transparência</p>`
    + `<h2 class="sc-t2">${e(b?.titulo)}</h2>`
    + C.ps(b).map((p) => `<p class="sc-sub">${p}</p>`).join('')
    + `<ul class="sc-nao">${itens}</ul>`
    + `</div></section>`;
}

function respostas(D, C) {
  const b = C.B['o-que-voce-passa-a-conseguir-responder'];
  const it = C.lista(b);
  const grupos = [['O total', it.slice(0, 2)], ['As dívidas', it.slice(2, 4)], ['A decisão', it.slice(4, 6)]];
  return `<section class="sc-sec sc-sec--clara sc-recursos" id="${e(b?.id)}" data-sc-secao="8">`
    + `<div class="sc-caixa">`
    + `<p class="sc-sobre">Recursos inclusos</p>`
    + `<h2 class="sc-t2 sc-t2--largo">${e(b?.titulo)}</h2>`
    + `<div class="sc-tres">`
    + grupos.map(([t, l]) => `<div class="sc-col"${anima}><h3 class="sc-col-titulo">${t}</h3><ul class="sc-checks sc-checks--leve">${l.map((x) => `<li>${CHECK}<span>${x}</span></li>`).join('')}</ul></div>`).join('')
    + `</div></div></section>`;
}

function leituras(D) {
  const rel = D.related || [];
  return `<section class="sc-sec sc-sec--branca sc-leituras" data-sc-secao="9">`
    + `<div class="sc-caixa">`
    + `<h2 class="sc-t3">Continue por aqui</h2>`
    + `<div class="sc-cartoes">`
    + rel.map(([t, h, s]) => `<a class="sc-leitura" href="${e(h)}"${anima}><span class="sc-leitura-rot">${e(s || '')}</span><span class="sc-leitura-tit">${e(t)}</span><span class="sc-leitura-link">Saiba mais${SETA}</span></a>`).join('')
    + `</div></div></section>`;
}

function faq(D) {
  const itens = (D.faq || []).map(([q, a], i) => `<details class="sc-faq-item" name="faq-fiado"${i >= 6 ? ' data-sc-faq-extra=""' : ''}>`
    + `<summary><span>${q}</span>${MAIS}</summary><div class="sc-faq-resp"><p>${a}</p></div></details>`).join('');
  return `<section class="sc-sec sc-sec--clara sc-faq" id="perguntas" data-sc-secao="faq">`
    + `<div class="sc-caixa">`
    + `<p class="sc-sobre">Dúvidas</p><h2 class="sc-t2">Perguntas frequentes</h2>`
    + `<div class="sc-faq-grade">${itens}</div>`
    + `<div class="sc-faq-mais"><button type="button" class="sc-btn sc-btn--contorno" data-sc-faq-mais hidden>Ver mais perguntas</button></div>`
    + `</div></section>`;
}

function fim(D) {
  const rel = D.related || [];
  const links = [rel[0], rel[3]].filter(Boolean);
  return `<section class="sc-sec sc-sec--clara sc-fim" data-sc-secao="10">`
    + `<div class="sc-caixa sc-fim-grade">`
    + `<div class="sc-fim-texto"${anima}><h2 class="sc-t3">${e(D.cta_title)}</h2><p>${D.cta_text}</p>${botoes(D, 'Comece agora')}</div>`
    + links.map(([t, h, s], i) => `<div class="sc-col"${anima}><span class="sc-icone">${ICONES[i === 0 ? 0 : 1]}</span><h3 class="sc-col-titulo">${e(t)}</h3><p>${e(s || '')}</p><a class="sc-link" href="${e(h)}">Saiba mais${SETA}</a></div>`).join('')
    + `</div></section>`;
}

export function desenho(D) {
  const C = blocos(D);
  return `<div class="sc-raiz">`
    + hero(D)
    + problema(D, C)
    + comoFunciona(D, C)
    + planos(D, C)
    + naoFaz(D, C)
    + respostas(D, C)
    + leituras(D)
    + faq(D)
    + fim(D)
    + `</div>`;
}

export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem' });
}
