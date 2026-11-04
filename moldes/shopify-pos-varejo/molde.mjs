// Molde shopify-pos-varejo: o corpo da página de PDV para varejo da Shopify (shopify.com/pos/retail-pos),
// clonado pela captura renderizada (~/.jarvis/visionx/clones/capturas/shopify-pos-varejo, 1440 e 390) em
// 04/11/2026, para a rota /segmentos/loja-de-roupas/.
//
// A ordem, a composição e a escala são as da Shopify: hero com o título centrado e a foto da loja de ponta a
// ponta embaixo; "experiências" com três colunas de régua em cima e a frase grande; foto larga com abas em
// fileira; recursos com o cartão do sistema à esquerda e abas verticais à direita; estoque com seis colunas de
// régua e foto com o cartão flutuando; "online" com as peças sobrepostas e três recursos; três colunas com
// ícone; faixa dividida (foto + painel de cor); bloco escuro com lista de réguas, cartões de leitura, perguntas
// frequentes e a faixa final de cor com dois botões.
//
// O que é de gente/empresa real da Shopify sai (logos de clientes, depoimento da Gymshark, apps de terceiros
// Marsello/Gusto/Zapiet, entrevista da Mejuri): os blocos recebem o conteúdo da rota e fatos do SoftPay que
// estão no JSON da rota. Nenhum texto de busca sai (portão de texto do vestir.mjs).
//
// Não há modo origem nesta versão: a geração de imagem estava fora do ar (Hugging Face 402, Codex no limite)
// e o teto de 45 min do BRIEFING não comporta a prova seção a seção (provar-molde). D.origem desenha a rota.

export const meta = {
  id: 'shopify-pos-varejo',
  referencia: 'https://www.shopify.com/pos/retail',
  captura: '~/.jarvis/visionx/clones/capturas/shopify-pos-varejo',
  // o cabeçalho e a barra de produto da Shopify ficam fora do <main>; o cabeçalho do chassi é fixo
  topoDoChassi: { 1440: 0, 390: 0 },
  classeRaiz: 'mx-sh',
  secoes: [
    { idx: 0, tipo: 'hero: sobretítulo, título centrado, dois botões, linha de entrar e a foto da loja de ponta a ponta' },
    { idx: 1, tipo: 'faixa de logos de clientes', omitida: 'logos de marcas reais clientes da Shopify (KOTN, Parachute, alo, Mejuri, gorjana); cliente não se inventa' },
    { idx: 2, tipo: 'três colunas com régua em cima + frase grande (no original, depoimento da Gymshark: sai o depoimento, fica a frase do conteúdo da rota, sem autor)' },
    { idx: 3, tipo: 'foto larga + abas em fileira (régua de destaque na ativa)' },
    { idx: 4, tipo: 'cartão do sistema com brilho à esquerda + três abas verticais à direita' },
    { idx: 5, tipo: 'seis colunas com régua + foto com cartão flutuando; e peças sobrepostas + três recursos e link' },
    { idx: 6, tipo: 'três colunas com ícone e link (no original, apps de terceiros: viram os três planos do SoftPay)' },
    { idx: 7, tipo: 'faixa dividida: foto + painel de cor com título, texto e botão' },
    { idx: 8, tipo: 'bloco escuro: título e texto à esquerda, lista com réguas à direita' },
    { idx: 9, tipo: 'cartões de leitura com foto, título, texto e link (no original, entrevista da Mejuri e guias da Shopify: viram as páginas relacionadas do SoftPay)' },
    { idx: 10, tipo: 'perguntas frequentes em sanfona' },
    { idx: 11, tipo: 'faixa final de cor com título e dois botões' },
  ],
};

// ---------- pequenas peças ----------
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sem = (s) => String(s ?? '').replace(/<[^>]+>/g, '');
const anima = ' data-sh-anima=""';

function partir(item) {
  const m = String(item).match(/^\s*<strong>([\s\S]*?)<\/strong>([\s\S]*)$/);
  return m ? [m[1], m[2].trim()] : [item, ''];
}

const SETA = '<svg class="sh-seta" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const MAIS = '<span class="sh-faq-sinal" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>';

function img(D, arq, alt, w, h, extra = '') {
  return `<img src="${D.v(`${D.base}/${arq}`)}" width="${w}" height="${h}" alt="${e(alt)}" loading="lazy" decoding="async"${extra}>`;
}
function imgResp(D, arq, arq800, alt, w, h, sizes, extra = '') {
  return `<img src="${D.v(`${D.base}/${arq}`)}" srcset="${D.v(`${D.base}/${arq800}`)} 800w, ${D.v(`${D.base}/${arq}`)} ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${e(alt)}"${extra}>`;
}

function botoes(D, claro = false) {
  return `<div class="sh-botoes${claro ? ' sh-botoes--claro' : ''}">`
    + `<a class="sh-btn sh-btn--cheio" href="${e(D.links.cadastro)}">Teste grátis</a>`
    + `<a class="sh-btn sh-btn--contorno" href="${e(D.links.wpp)}" target="_blank" rel="noopener">WhatsApp</a>`
    + `</div>`
    + `<p class="sh-entrar">Já usa o SoftPay? <a href="${e(D.links.app)}">Entrar no sistema</a></p>`;
}

// ---------- conteúdo da rota, por bloco ----------
function blocos(D) {
  const B = {};
  for (const b of D.blocks || []) B[b.id] = b;
  const ps = (b) => (b?.partes || []).filter((p) => p.tipo === 'p').map((p) => p.texto);
  const lista = (b, t) => (b?.partes || []).find((p) => p.tipo === t)?.itens || [];
  const pares = (b) => {
    const out = []; let h = null;
    for (const p of b?.partes || []) {
      if (p.tipo === 'h3') h = p.texto;
      else if (p.tipo === 'p' && h) { out.push([h, p.texto]); h = null; }
    }
    return out;
  };
  return { B, ps, lista, pares };
}

// ---------- 0 · hero ----------
function hero(D) {
  const trilha = (D.breadcrumbs || []).map(([nome, href]) => (href
    ? `<a href="${e(href)}">${nome}</a><span class="sh-trilha-sep" aria-hidden="true">/</span>`
    : `<span aria-current="page">${nome}</span>`)).join('');
  const [alt] = [(D.figura && D.figura[1]) || 'Lojista numa loja de roupas com um tablet na mão'];
  return `<section class="sh-hero" data-sh-secao="0">`
    + `<div class="sh-hero-texto"${anima}>`
    + `<nav class="sh-eyebrow sh-trilha" aria-label="Trilha de navegação">${trilha}</nav>`
    + `<h1 class="sh-t1">${D.h1}</h1>`
    + `<p class="sh-hero-intro">${D.intro}</p>`
    + botoes(D)
    + `</div>`
    + `<div class="sh-hero-foto">${imgResp(D, 'hero-loja.webp', 'hero-loja-800.webp', alt, 1600, 668, '100vw', ' fetchpriority="high" decoding="async"')}</div>`
    + `</section>`;
}

// ---------- 2 · experiências: três colunas com régua + frase grande ----------
function experiencias(D, C) {
  const b = C.B['a-rotina-de-quem-vende-moda'];
  const [p1, p2, p3, p4] = C.ps(b);
  const col = (t, p) => `<div class="sh-regua"${anima}><h3 class="sh-t5">${t}</h3><p>${p}</p></div>`;
  return `<section class="sh-sec sh-sec--claro" id="${b.id}" data-sh-secao="2"><div class="sh-caixa">`
    + `<header class="sh-cabeca"${anima}><p class="sh-eyebrow">Loja de moda</p><h2 class="sh-t2">${b.titulo}</h2><p class="sh-sub">${p1}</p></header>`
    + `<div class="sh-tres">${col('Uma combinação, não um produto', p2)}${col('A pergunta do provador', p3)}${col('O calendário da moda', p4)}</div>`
    + `<p class="sh-frase"${anima}>Você não vende <em>um produto</em>, vende uma <strong>combinação</strong>: tamanho, cor e saldo de cada uma.</p>`
    + `</div></section>`;
}

// ---------- 3 · foto larga + abas em fileira ----------
function problemas(D, C) {
  const b = C.B['os-problemas-que-aparecem-sempre'];
  const itens = C.lista(b, 'ul');
  const aba = (it, i) => {
    const [t, r] = partir(it);
    return `<li class="sh-aba${i === 0 ? ' is-ativa' : ''}" data-sh-aba=""><p class="sh-aba-titulo"><strong>${t}</strong></p><p class="sh-aba-texto">${r}</p></li>`;
  };
  return `<section class="sh-sec sh-sec--claro" id="${b.id}" data-sh-secao="3"><div class="sh-caixa">`
    + `<header class="sh-cabeca"${anima}><p class="sh-eyebrow">No balcão</p><h2 class="sh-t3">${b.titulo}</h2></header>`
    + `<figure class="sh-foto-larga"${anima}>${imgResp(D, 'pagamento-pix.webp', 'pagamento-pix-800.webp', 'Cliente pagando com Pix no balcão da loja, com o QR Code da loja aberto no SoftPay', 1460, 1020, '(min-width: 1440px) 1260px, 92vw')}</figure>`
    + `<ul class="sh-abas" data-sh-abas="">${itens.map(aba).join('')}</ul>`
    + `</div></section>`;
}

// ---------- 4 · cartão do sistema + abas verticais ----------
function recursos(D, C) {
  const b = C.B['como-o-softpay-resolve'];
  const pares = C.pares(b).slice(0, 3);
  const aba = ([t, p], i) => `<div class="sh-vaba${i === 0 ? ' is-ativa' : ''}" data-sh-aba=""><h3 class="sh-t5">${t}</h3><p>${p}</p></div>`;
  return `<section class="sh-sec sh-sec--claro" id="${b.id}" data-sh-secao="4"><div class="sh-caixa">`
    + `<header class="sh-cabeca"${anima}><p class="sh-eyebrow">Recursos para moda</p><h2 class="sh-t2">${b.titulo}</h2><p class="sh-sub">Estoque por tamanho e cor, curva ABC e margem por peça, no computador e no celular.</p></header>`
    + `<div class="sh-par sh-par--recursos">`
    + `<div class="sh-palco"${anima}><span class="sh-brilho" aria-hidden="true"></span>`
    + `<div class="sh-palco-peca">${img(D, 'estoque-tablet.webp', 'Tela de Controle de Estoque do SoftPay num tablet, com o saldo de cada produto', 1200, 866)}`
    + `<span class="sh-flutua sh-flutua--a">${img(D, 'recorte-estoque.webp', 'Cartão de produto do SoftPay com o alerta de estoque baixo', 330, 172)}</span></div></div>`
    + `<div class="sh-vabas" data-sh-abas="">${pares.map(aba).join('')}</div>`
    + `</div></div></section>`;
}

// ---------- 5a · seis colunas com régua + foto com cartão flutuando ----------
function perguntas(D, C) {
  const b = C.B['perguntas-que-voce-passa-a-conseguir-responder'];
  const itens = C.lista(b, 'ul');
  return `<section class="sh-sec sh-sec--claro" id="${b.id}" data-sh-secao="5"><div class="sh-caixa">`
    + `<header class="sh-cabeca"${anima}><p class="sh-eyebrow">Estoque e vendas</p><h2 class="sh-t3">${b.titulo}</h2></header>`
    + `<ul class="sh-seis">${itens.map((t) => `<li class="sh-regua sh-regua--curta"${anima}><p class="sh-t5">${t}</p></li>`).join('')}</ul>`
    + `<figure class="sh-foto-larga sh-foto-larga--baixa"${anima}>${img(D, 'balcao.webp', 'Comerciantes conferindo as vendas no computador do balcão', 1600, 668)}`
    + `<span class="sh-flutua sh-flutua--b">${img(D, 'recorte-estoque.webp', 'Cartão de produto do SoftPay com o saldo em estoque', 330, 172)}</span></figure>`
    + `</div></section>`;
}

// ---------- 5b · peças sobrepostas + três recursos ----------
function online(D, C) {
  const b = C.B['como-o-softpay-resolve'];
  const pares = C.pares(b).slice(3);
  return `<section class="sh-sec sh-sec--claro sh-sec--colada" data-sh-secao="5b"><div class="sh-caixa">`
    + `<header class="sh-cabeca"${anima}><p class="sh-eyebrow">Além do balcão</p><h2 class="sh-t2">A cliente, a loja online e o WhatsApp no mesmo cadastro</h2></header>`
    + `<div class="sh-par sh-par--online">`
    + `<div class="sh-palco sh-palco--online"${anima}><span class="sh-brilho" aria-hidden="true"></span>`
    + `<div class="sh-online-pecas"><span class="sh-online-catalogo">${img(D, 'catalogo-800.webp', 'Catálogo de produtos do SoftPay', 800, 483)}</span>`
    + `<span class="sh-online-celular">${img(D, 'celular-carrinho.webp', 'Carrinho da loja online do SoftPay no celular', 690, 1498)}</span></div></div>`
    + `<div class="sh-lista-rec">${pares.map(([t, p]) => `<div class="sh-rec"${anima}><h3 class="sh-t5">${t}</h3><p>${p}</p></div>`).join('')}`
    + `<a class="sh-link" href="/solucoes/loja-online/">Conhecer a loja online${SETA}</a></div>`
    + `</div></div></section>`;
}

// ---------- 6 · três colunas com ícone: os planos ----------
function planos(D, C) {
  const b = C.B['qual-plano-faz-sentido'];
  const tab = (b.partes || []).find((p) => p.tipo === 'tabela');
  const nota = C.ps(b)[0] || '';
  const [hPlano, hPreco, hPara] = tab.cabecalho;
  const icones = ['ic-comercio.webp', 'ic-loja.webp', 'ic-erp.webp'];
  const col = ([nome, preco, para], i) => `<div class="sh-plano${i === 1 ? ' sh-plano--meio' : ''}" style="--i:${i + 1}"${anima}>`
    + `<span class="sh-plano-ic">${img(D, icones[i] || icones[0], '', 112, 112)}</span>`
    + `<p class="sh-plano-nome"><span class="sh-rotulo">${hPlano}</span> <strong class="sh-t5">${nome}</strong></p>`
    + `<p class="sh-plano-preco"><span class="sh-rotulo">${hPreco}</span> ${preco}</p>`
    + `<p class="sh-plano-para" data-plano="${e(sem(nome))}"><span class="sh-rotulo">${hPara}</span> ${para}</p>`
    + `<a class="sh-link sh-plano-link" href="${e(D.links.cadastro)}">Testar<span class="sh-so-largo"> o ${sem(nome)}</span>${SETA}</a>`
    + `</div>`;
  return `<section class="sh-sec sh-sec--branco" id="${b.id}" data-sh-secao="6"><div class="sh-caixa">`
    + `<header class="sh-cabeca"${anima}><p class="sh-eyebrow">Planos</p><h2 class="sh-t3">${b.titulo}</h2><p class="sh-sub">${nota}</p></header>`
    + `<div class="sh-planos">${tab.linhas.map(col).join('')}</div>`
    + `</div></section>`;
}

// ---------- 7 · faixa dividida ----------
function faixa(D) {
  return `<section class="sh-sec sh-sec--branco sh-sec--faixa" data-sh-secao="7"><div class="sh-caixa">`
    + `<div class="sh-faixa"${anima}>`
    + `<div class="sh-faixa-foto">${img(D, 'tablet-financeiro.webp', 'Relatório financeiro do SoftPay num tablet, com as vendas por forma de pagamento', 1268, 1690)}</div>`
    + `<div class="sh-faixa-painel"><h2 class="sh-t3">Veja o SoftPay por dentro, com a sua loja</h2>`
    + `<p>Abre no navegador do celular e do computador, sem instalar nada. Teste 7 dias grátis, sem cartão.</p>`
    + `<a class="sh-btn sh-btn--contorno-claro" href="${e(D.links.cadastro)}">Criar conta grátis</a></div>`
    + `</div></div></section>`;
}

// ---------- 8 · bloco escuro: um dia comum ----------
function dia(D, C) {
  const b = C.B['um-dia-comum-do-jeito-que-acontece'];
  const ps = C.ps(b);
  const ol = C.lista(b, 'ol');
  const nota = (b.partes || []).find((p) => p.tipo === 'nota');
  return `<section class="sh-sec sh-sec--escuro sh-sec--dia" id="${b.id}" data-sh-secao="8"><div class="sh-caixa sh-par sh-par--dia">`
    + `<div class="sh-dia-texto"${anima}><h2 class="sh-t2">${b.titulo}</h2><p class="sh-sub">${ps[0] || ''}</p>`
    + (ps[1] ? `<p class="sh-dia-fecho">${ps[1]}</p>` : '')
    + (nota ? `<aside class="sh-nota"><p class="sh-nota-titulo">${nota.titulo}</p><p>${nota.texto}</p></aside>` : '')
    + `</div>`
    + `<ol class="sh-reguas">${ol.map((t, i) => `<li${anima}><span class="sh-num">${i + 1}</span><span>${t}</span></li>`).join('')}</ol>`
    + `</div></section>`;
}

// ---------- 9 · cartões de leitura + veja também ----------
const FOTO_REL = {
  '/solucoes/sistema-de-estoque/': ['rel-estoque.webp', 800, 483, 'Tela de Controle de Estoque do SoftPay'],
  '/solucoes/loja-online/': ['catalogo-800.webp', 800, 483, 'Catálogo de produtos do SoftPay'],
  '/solucoes/controle-de-clientes/': ['rel-clientes.webp', 800, 483, 'Tela de clientes do SoftPay'],
  '/solucoes/bot-whatsapp/': ['rel-whatsapp.webp', 590, 1142, 'Conversa com o assistente de vendas do SoftPay no WhatsApp'],
  '/guias/como-controlar-estoque/': ['rel-guia.webp', 800, 334, 'Casal de comerciantes no balcão da loja'],
  '/segmentos/loja-de-variedades/': ['rel-variedades.webp', 800, 334, 'Loja de variedades'],
};
function leituras(D) {
  const rel = D.related || [];
  const cartao = ([nome, href, desc]) => {
    const f = FOTO_REL[href];
    return `<article class="sh-leitura"${anima}>`
      + (f ? `<div class="sh-leitura-foto${f[2] > f[1] ? ' sh-leitura-foto--alta' : ''}">${img(D, f[0], f[3], f[1], f[2])}</div>` : '')
      + `<h3 class="sh-t5"><a href="${e(href)}">${nome}</a></h3><p>${desc}</p>`
      + `<span class="sh-link" aria-hidden="true">Ler agora${SETA}</span></article>`;
  };
  const mais = (D.mais || []).map(([t, h]) => `<li><a href="${e(h)}">${t}</a></li>`).join('');
  return `<section class="sh-sec sh-sec--escuro" data-sh-secao="9"><div class="sh-caixa">`
    + `<header class="sh-cabeca"${anima}><h2 class="sh-t2">Continue por aqui</h2><p class="sh-sub">Guias, recursos e outros segmentos para a loja de moda.</p></header>`
    + `<div class="sh-leituras">${rel.map(cartao).join('')}</div>`
    + (mais ? `<nav class="sh-mais" aria-labelledby="veja-tambem"><h2 class="sh-t5" id="veja-tambem">Veja também</h2><ul>${mais}</ul></nav>` : '')
    + `</div></section>`;
}

// ---------- 10 · perguntas frequentes ----------
function faq(D) {
  const it = (D.faq || []).map(([q, a], i) => `<details class="sh-faq-item" name="sh-faq"${i >= 5 ? ' data-sh-extra=""' : ''}><summary><span>${q}</span>${MAIS}</summary><div class="sh-faq-resp"><p>${a}</p></div></details>`).join('');
  const extras = Math.max(0, (D.faq || []).length - 5);
  return `<section class="sh-sec sh-sec--escuro sh-sec--faq" id="perguntas-frequentes" data-sh-secao="10"><div class="sh-caixa">`
    + `<h2 class="sh-t2"${anima}>Perguntas frequentes</h2>`
    + `<div class="sh-faq">${it}</div>`
    + (extras ? `<div class="sh-faq-mais"><button type="button" class="sh-btn sh-btn--contorno-claro" data-sh-faq-mais="">Ver mais perguntas (+<span data-sh-faq-n="">${extras}</span>)</button></div>` : '')
    + `</div></section>`;
}

// ---------- 11 · faixa final ----------
function fim(D) {
  return `<section class="sh-sec sh-fim" data-sh-secao="11"><div class="sh-caixa sh-fim-caixa"${anima}>`
    + `<h2 class="sh-t2">${D.cta_title || 'Teste o SoftPay na sua loja'}</h2>`
    + (D.cta_text ? `<p class="sh-sub">${D.cta_text}</p>` : '')
    + botoes(D, true)
    + `</div></section>`;
}

export function desenho(D) {
  const C = blocos(D);
  return `<div class="sh-raiz">`
    + hero(D)
    + experiencias(D, C)
    + problemas(D, C)
    + recursos(D, C)
    + perguntas(D, C)
    + online(D, C)
    + planos(D, C)
    + faixa(D)
    + `<div class="sh-escuro">${dia(D, C)}${leituras(D)}${faq(D)}</div>`
    + fim(D)
    + `</div>`;
}

export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem' });
}
