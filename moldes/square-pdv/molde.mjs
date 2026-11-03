// Molde square-pdv: o corpo da página Point of Sale da Square (squareup.com/us/en/point-of-sale), clonado pela
// captura renderizada em 03/11/2026. As mesmas peças montam as duas versões:
//   modo origem → textos e recortes da própria referência (origem.json + ativos/): é o que a prova compara com a captura;
//   modo rota   → o conteúdo de tools/conteudo/solucoes/sistema-pdv.json, sem tirar nenhum texto de busca.
// Ordem da referência: hero (olho, título, dois botões, cartão grande de vídeo) → palco preso à rolagem (o cartão cresce,
// borra e a manchete acende palavra por palavra) → modos com abas em pílula + cartão escuro → linhas com divisória
// (foto à esquerda, título e texto à direita) → carrossel de aparelhos → carrossel de cartões cinza → preços (3 cartões,
// o do meio com selo, + cartão largo) → FAQ em acordeão → chamada final → notas de rodapé em duas colunas.
// O CSS (molde.css) reproduz a composição da referência em `.mx-square-pdv`; a roupa do SoftPay e as regras da casa que
// vencem a referência (hero de tela inteira, celular sem trilho, planos lado a lado) moram em `.page-molde.mx-square-pdv`.
import { readFileSync } from 'node:fs';

const O = JSON.parse(readFileSync(new URL('./origem.json', import.meta.url), 'utf8'));

export const meta = {
  id: 'square-pdv',
  referencia: 'https://squareup.com/us/en/point-of-sale',
  captura: '~/.jarvis/visionx/clones/capturas/square-pdv',
  // a 1ª seção de conteúdo da captura (idx 1) já começa abaixo da hero de texto, no cartão de vídeo: não há menu
  // da referência dentro dela para descontar
  topoDoChassi: { 1440: 0, 390: 0 },
  secoes: [
    { idx: 1, tipo: 'palco preso à rolagem + modos com abas' },
    { idx: 2, tipo: 'linhas com foto e divisória' },
    { idx: 3, tipo: 'carrossel de aparelhos' },
    { idx: 4, tipo: 'carrossel de cartões' },
    { idx: 5, tipo: 'preços: 3 cartões + cartão largo' },
    { idx: 6, tipo: 'FAQ em acordeão' },
    { idx: 8, tipo: 'notas de rodapé em duas colunas' },
  ],
};

const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sec = (D, idx) => (D.origem ? ` data-mx-secao="${idx}"` : '');
const MAIS = '<svg class="mxq-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
const CHECK = '<svg class="mxq-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
const SETA_E = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5m6-7l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
const SETA_D = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-7l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
const CARRINHO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="9" cy="19" r="1.6" fill="currentColor"/><circle cx="17" cy="19" r="1.6" fill="currentColor"/></svg>';
const semTags = (h) => String(h).replace(/<[^>]+>/g, '').trim();

// imagem: na origem é o recorte da captura (um por largura); na rota, o arquivo publicado com versão e srcset de 800px
function quadro(D, img, sizes = '100vw', classe = '') {
  if (!img) return '';
  if (img.ref) {
    return `<picture class="mxq-quadro ${classe}"><source media="(max-width: 600px)" srcset="../ativos/${img.ref}-390.png"><img src="../ativos/${img.ref}-1440.png" alt=""></picture>`;
  }
  const src = D.v(D.base + '/' + img.arq);
  const menor = img.menor ? ` srcset="${D.v(D.base + '/' + img.menor)} ${img.menorW || 800}w, ${src} ${img.w}w" sizes="${sizes}"` : '';
  return `<picture class="mxq-quadro ${classe}${img.h > img.w ? ' is-retrato' : ''}"><img src="${src}"${menor} alt="${e(img.alt)}" width="${img.w}" height="${img.h}" loading="${img.cedo ? 'eager' : 'lazy'}"${img.cedo ? ' fetchpriority="high"' : ''} decoding="async"></picture>`;
}
const botao = (b, extra = '') => `<a class="mxq-botao mxq-botao--${b.tipo || 'cheio'} ${extra}" href="${e(b.href || '#')}"${b.externo ? ' target="_blank" rel="noopener"' : ''}>${e(b.texto)}</a>`;
const linkSublinhado = (l) => (l ? `<a class="mxq-link" href="${e(l.href || '#')}">${e(l.texto)}${l.mais ? MAIS : ''}</a>` : '');

// ---------------------------------------------------------------------------------------- conteúdo das duas versões
function daOrigem(D) {
  const ref = (r) => (r ? { ref: r } : null);
  return {
    topo: { olho: e(O.topo.olho), h1: O.topo.h1, intro: '', botoes: O.topo.botoes },
    hero: { ref: 'hero' },
    palco: { manchete: O.palco.manchete, rotulo: '', extras: [] },
    modos: {
      titulo: O.modos.titulo,
      abas: O.modos.abas.map((a) => ({ rotulo: a.rotulo, html: a.texto, listaTitulo: a.listaTitulo, lista: a.lista, link: { texto: a.link, href: '#' }, img: null, print: null })),
    },
    linhas: { titulo: O.linhas.titulo, itens: O.linhas.itens.map((l) => ({ titulo: l.titulo, html: `<p>${e(l.texto)}</p>`, img: ref(l.ref), link: { texto: 'Learn more', href: '#', mais: true } })) },
    carrossel: { titulo: O.carrossel.titulo, sub: '', lista: 'ul', itens: O.carrossel.itens.map((c) => ({ titulo: c.titulo, html: e(c.texto), link: { texto: c.link, href: '#' }, img: ref(c.ref) })), nota: null },
    cartoes: { titulo: O.cartoes.titulo, itens: O.cartoes.itens.map((c) => ({ icone: CARRINHO, titulo: c.titulo, texto: c.texto, link: { texto: c.link, href: '#' }, img: ref(c.ref) })) },
    precos: {
      titulo: O.precos.titulo, sub: `<p>${e(O.precos.sub)}</p>`, botao: { texto: O.precos.botao, href: '#', tipo: 'contorno' }, rotuloDesc: '',
      planos: O.precos.planos.map((p, i) => ({ nome: p.nome, selo: p.selo || '', desc: e(p.desc), preco: p.preco, unidade: p.unidade, botao: { texto: p.botao, href: '#', tipo: i === 1 ? 'cheio' : 'contorno' }, destaque: i === 1 })),
      largo: { rotulo: O.precos.largo.rotulo, titulo: O.precos.largo.titulo, botao: { texto: O.precos.largo.botao, href: '#', tipo: 'cheio' }, html: `<p>${e(O.precos.largo.texto)}</p>` },
      rotulos: null,
    },
    faq: { titulo: O.faq.titulo, itens: O.faq.itens, visiveis: 99 },
    cta: { titulo: O.cta.titulo, texto: '', botoes: O.cta.botoes },
    notas: { colunas: O.notas.colunas },
  };
}

// imagens da rota (fotos de comércio de verdade do acervo do SoftPay e prints reais do sistema, em publicar/)
const FOTO = (n, alt, cedo) => ({ arq: `foto-${n}.webp`, menor: `foto-${n}-800.webp`, w: 1600, h: 668, alt, cedo });
const PRINT = (n, alt, w = 1400, h = 845, menor = true) => ({ arq: `print-${n}.webp`, menor: menor ? `print-${n}-800.webp` : '', w, h, alt });
const PRINTS = {
  pdv: PRINT('pdv', 'Tela do PDV do SoftPay: busca de produto, grade de itens e o carrinho com o total da venda'),
  estoque: PRINT('estoque', 'Tela do Estoque do SoftPay com a lista de produtos e as quantidades'),
  financeiro: PRINT('financeiro', 'Tela do Financeiro do SoftPay com entradas, saídas e resultado'),
  clientes: PRINT('clientes', 'Tela de Clientes do SoftPay com a lista de clientes cadastrados'),
  pagamentos: { arq: 'print-tablet-financeiro.webp', menor: '', w: 1268, h: 1690, alt: 'Financeiro do SoftPay: vendas por forma de pagamento (Dinheiro, PIX, Fiado, Crédito e Débito)' },
  carrinho: { arq: 'print-celular-carrinho.webp', menor: '', w: 690, h: 1498, alt: 'PDV do SoftPay aberto no navegador do celular, com o carrinho da venda' },
  pdvCelular: { arq: 'print-pdv-celular.webp', menor: '', w: 900, h: 786, alt: 'Carrinho do PDV do SoftPay com os itens e o total' },
};
const APARELHO = {
  desktop: { arq: 'aparelho-desktop.webp', menor: 'aparelho-desktop-900.webp', menorW: 900, w: 1500, h: 1381, alt: 'Monitor com o PDV do SoftPay aberto no navegador' },
  monitorCelular: { arq: 'aparelho-monitor-celular.webp', menor: 'aparelho-monitor-celular-800.webp', w: 1448, h: 1086, alt: 'Monitor com o caixa do SoftPay e celular com o carrinho da venda' },
  quatro: { arq: 'aparelho-quatro.webp', menor: 'aparelho-quatro-800.webp', w: 1774, h: 887, alt: 'O SoftPay no monitor, no notebook, no tablet e no celular' },
  celular: { arq: 'aparelho-celular.webp', menor: 'aparelho-celular-800.webp', w: 1200, h: 1500, alt: 'Celular com o painel do SoftPay aberto' },
};

const partes = (b, tipo) => (b ? b.partes.filter((p) => p.tipo === tipo) : []);

function daRota(D) {
  const bloco = (id) => (D.blocks || []).find((b) => b.id === id);
  const bProb = bloco('o-problema'), bSint = bloco('como-isso-aparece-na-sua-loja'), bRes = bloco('como-o-softpay-resolve');
  const bNao = bloco('o-que-o-pdv-nao-faz'), bDia = bloco('um-dia-no-balcao-do-jeito-que-acontece');
  const bResp = bloco('o-que-voce-passa-a-conseguir-responder'), bPlano = bloco('em-qual-plano-esta');
  const rel = (href) => { const r = (D.related || []).find((x) => x[1] === href); return r ? { texto: r[0], href: r[1] } : null; };
  const cadastro = { texto: 'Testar grátis', href: D.links.cadastro, tipo: 'cheio' };
  const wpp = { texto: 'WhatsApp', href: D.links.wpp, tipo: 'contorno', externo: true };

  // o problema → palco: o 1º parágrafo é a manchete; os outros três descem embaixo dela
  const pProb = partes(bProb, 'p').map((p) => p.texto);
  // como isso aparece → abas: cada sintoma é uma aba; o rótulo da pílula é o trecho em negrito
  const sintomas = (partes(bSint, 'ul')[0] || { itens: [] }).itens;
  const tituloResolve = partes(bRes, 'h3').map((h) => h.texto);
  const muda = [[0, 3, 2], [0, 1], [0, 1], [3, 2], [4]];
  const fotosSint = [
    FOTO('casal-comerciantes', 'Casal de comerciantes conferindo o caixa no computador do balcão'),
    FOTO('loja-de-variedades', 'Comerciante conferindo a prateleira da loja de variedades'),
    FOTO('loja-de-bebidas', 'Comerciante conferindo um produto no engradado da loja'),
    FOTO('celular-balcao', 'Mãos com o celular no balcão, ao lado da maquininha de cartão'),
    FOTO('distribuidora', 'Comerciante anotando no papel no meio do estoque'),
  ];
  const printsSint = [PRINTS.financeiro, PRINTS.estoque, PRINTS.pdv, PRINTS.pagamentos, PRINTS.clientes];
  const linksSint = ['/guias/como-controlar-caixa-da-loja/', '/solucoes/sistema-de-estoque/', null, '/solucoes/sistema-financeiro/', '/solucoes/controle-de-fiado/'];
  const abas = sintomas.map((html, i) => ({
    rotulo: semTags((html.match(/<strong>(.*?)<\/strong>/) || [, html])[1]).replace(/\.$/, ''),
    html,
    listaTitulo: 'O que muda com o SoftPay:',
    lista: (muda[i] || []).map((k) => tituloResolve[k]).filter(Boolean),
    link: linksSint[i] ? rel(linksSint[i]) : { texto: 'Testar no seu balcão', href: D.links.cadastro },
    img: fotosSint[i] || null,
    print: printsSint[i] || null,
  }));

  // como o SoftPay resolve → linhas com print real
  const h3s = [], ps = [];
  for (const p of (bRes ? bRes.partes : [])) (p.tipo === 'h3' ? h3s : ps).push(p.texto);
  const printsRes = [PRINTS.pdv, PRINTS.estoque, PRINTS.financeiro, PRINTS.pagamentos, PRINTS.clientes, PRINTS.carrinho];
  const linksRes = [null, '/solucoes/sistema-de-estoque/', '/guias/como-controlar-caixa-da-loja/', '/solucoes/sistema-financeiro/', null, null];
  const linhas = h3s.map((t, i) => ({ titulo: t, html: `<p>${ps[i] || ''}</p>`, img: printsRes[i], link: linksRes[i] ? { ...rel(linksRes[i]), mais: true } : null }));

  // um dia no balcão → carrossel de aparelhos; os passos são a lista
  const passos = (partes(bDia, 'ol')[0] || { itens: [] }).itens;
  const artes = [APARELHO.desktop, APARELHO.monitorCelular, PRINTS.pdvCelular, APARELHO.celular, PRINTS.pagamentos, APARELHO.quatro];
  const notaDia = partes(bDia, 'nota')[0];

  // o que você passa a responder → cartões com ícone e print
  const perguntas = (partes(bResp, 'ul')[0] || { itens: [] }).itens;
  const icones = ['caixa-e-sangria', 'pdv-frente-de-caixa', 'controle-de-estoque', 'caderninho-de-fiado', 'curva-abc', 'clientes-e-crm'];
  const printsResp = [PRINTS.pagamentos, PRINTS.financeiro, PRINTS.estoque, PRINTS.clientes, PRINTS.financeiro, PRINTS.pdv];

  // em qual plano está → preços
  const tab = partes(bPlano, 'tabela')[0] || { cabecalho: [], linhas: [] };
  const pPlano = partes(bPlano, 'p').map((p) => `<p>${p.texto}</p>`).join('');
  const linhasPlano = tab.linhas;
  const tres = linhasPlano.filter((l) => !/^Nota Fiscal/i.test(l[0])).slice(0, 3);
  const largo = linhasPlano.find((l) => /^Nota Fiscal/i.test(l[0]));

  const nao = bNao || { partes: [] };
  return {
    topo: {
      olho: '<nav class="mxq-trilha" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span>'
        + (D.breadcrumbs || []).map((b) => (b[1] ? `<a href="${e(b[1])}">${e(b[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${e(b[0])}</span>`)).join('') + '</nav>',
      h1: D.h1, intro: D.intro, botoes: [wpp, cadastro],
    },
    hero: FOTO('mercadinho', (D.figura && D.figura[1]) || 'Lojista no balcão do mercadinho', true),
    palco: { rotulo: bProb ? bProb.titulo : '', manchete: pProb[0] || '', extras: pProb.slice(1) },
    modos: { titulo: bSint ? bSint.titulo : '', abas },
    linhas: { titulo: bRes ? bRes.titulo : '', itens: linhas },
    carrossel: {
      titulo: bDia ? bDia.titulo : '', sub: partes(bDia, 'p').map((p) => `<p>${p.texto}</p>`).join(''), lista: 'ol',
      itens: passos.map((t, i) => ({ titulo: `Passo ${i + 1} de ${passos.length}`, html: t, link: null, img: artes[i] })),
      nota: notaDia ? { titulo: notaDia.titulo, texto: notaDia.texto } : null,
    },
    cartoes: { titulo: bResp ? bResp.titulo : '', itens: perguntas.map((q, i) => ({ iconeImg: `icone-${icones[i % icones.length]}.webp`, titulo: q, texto: '', link: null, img: printsResp[i] })) },
    precos: {
      titulo: bPlano ? bPlano.titulo : '', sub: pPlano, botao: { texto: 'Ver planos completos', href: '/#pricing', tipo: 'contorno' },
      rotulos: tab.cabecalho,
      planos: tres.map((l, i) => ({ nome: l[0], selo: i === 1 ? 'Mais popular' : '', desc: l[2], preco: l[1], unidade: '7 dias grátis, sem cartão', botao: { ...cadastro, tipo: i === 1 ? 'cheio' : 'contorno' }, destaque: i === 1 })),
      largo: largo ? { rotulo: largo[0], titulo: largo[1], botao: cadastro, html: `<p>${largo[2]}</p>` } : null,
    },
    faq: { titulo: 'Perguntas frequentes', itens: D.faq || [], visiveis: 5 },
    cta: { titulo: D.cta_title, texto: D.cta_text, botoes: [wpp, cadastro] },
    notas: {
      colunas: [
        `<h2 class="mxq-notas__titulo">${e(nao.titulo || '')}</h2>` + nao.partes.map((p) => (p.tipo === 'p' ? `<p>${p.texto}</p>` : p.tipo === 'ul' ? `<ul class="mxq-notas__lista">${p.itens.map((it) => `<li>${it}</li>`).join('')}</ul>` : '')).join(''),
        '<h2 class="mxq-notas__titulo">Continue por aqui</h2><ul class="mxq-notas__links">'
          + (D.related || []).map((r) => `<li><a href="${e(r[1])}"><strong>${e(r[0])}</strong><span>${e(r[2] || '')}</span></a></li>`).join('')
          + '</ul>'
          + ((D.mais || []).length ? '<h2 class="mxq-notas__titulo">Veja também</h2><ul class="mxq-notas__links">' + D.mais.map((m) => `<li><a href="${e(m[1])}"><strong>${e(m[0])}</strong></a></li>`).join('') + '</ul>' : ''),
      ],
    },
  };
}

// ---------------------------------------------------------------------------------------------------- peças
function topo(D, C) {
  const t = C.topo;
  return `<header class="mxq-topo"><div class="mxq-topo__texto">`
    + (D.origem ? `<p class="mxq-olho">${t.olho}</p>` : `<div class="mxq-olho">${t.olho}</div>`)
    + `<h1 class="mxq-h1">${e(t.h1)}</h1>`
    + (t.intro ? `<p class="mxq-intro">${e(t.intro)}</p>` : '')
    + `<div class="mxq-botoes">${t.botoes.map((b) => botao(b)).join('')}</div></div></header>`;
}

function palco(D, C) {
  const p = C.palco;
  const palavras = p.manchete.split(/\s+/).filter(Boolean);
  const manchete = palavras.map((w, i) => `<span class="mxq-palavra" style="--i:${i};--n:${palavras.length}">${e(w)}</span>`).join(' ');
  const modos = C.modos;
  const abas = modos.abas.map((a, i) => `<button type="button" class="mxq-aba${i === 0 ? ' is-ativa' : ''}" role="tab" id="mxq-aba-${i}" aria-controls="mxq-modo-${i}" aria-selected="${i === 0}">${e(a.rotulo)}</button>`).join('');
  const paineis = modos.abas.map((a, i) => `<li class="mxq-modo${i === 0 ? ' is-ativo' : ''}" id="mxq-modo-${i}" role="tabpanel" aria-labelledby="mxq-aba-${i}">`
    + `<p class="mxq-modo__texto">${a.html}</p>`
    + (a.lista && a.lista.length ? `<p class="mxq-modo__lista-titulo">${e(a.listaTitulo)}</p><ul class="mxq-modo__lista">${a.lista.map((x) => `<li>${CHECK}<span>${e(x)}</span></li>`).join('')}</ul>` : '')
    + (a.link ? linkSublinhado(a.link) : '')
    + `</li>`).join('');
  const midias = modos.abas.map((a, i) => (a.img ? `<div class="mxq-modos__midia${i === 0 ? ' is-ativa' : ''}" data-modo="${i}">${quadro(D, a.img, '(min-width: 64rem) 48vw, 100vw', 'mxq-modos__foto')}${a.print ? quadro(D, a.print, '(min-width: 64rem) 30vw, 70vw', 'mxq-modos__print') : ''}</div>` : '')).join('');
  return `<section class="mxq-s1"${sec(D, 1)}>`
    + `<div class="mxq-palco"><div class="mxq-palco__fixo"><div class="mxq-palco__cartao">`
    + quadro(D, C.hero, '100vw', 'mxq-palco__foto')
    // desfoque da página vestida: camada vazia com backdrop-filter sobre a foto nítida (nada passa da borda do cartão,
    // sem segunda cópia da foto e sem scale para esconder a orla do blur)
    + (D.origem ? '' : `<div class="mxq-palco__foto mxq-palco__foto--borrada" aria-hidden="true"></div>`)
    + `<div class="mxq-palco__veu" aria-hidden="true"></div>`
    + `<div class="mxq-palco__texto">${p.rotulo ? `<h2 class="mxq-palco__rotulo">${e(p.rotulo)}</h2>` : ''}<p class="mxq-palco__manchete">${manchete}</p>`
    + `</div></div></div></div>`
    // o resto do problema desce para baixo do palco: dentro do cartão não cabia no celular (≈760 px de texto em 744)
    + (p.extras.length ? `<div class="mxq-palco__extras mxq-casca">${p.extras.map((x) => `<p class="mxq-rv">${e(x)}</p>`).join('')}</div>` : '')
    + `<div class="mxq-modos mxq-casca"><div class="mxq-modos__col">`
    + (D.origem ? `<p class="mxq-modos__titulo">${e(modos.titulo)}</p>` : `<h2 class="mxq-modos__titulo">${e(modos.titulo)}</h2>`)
    + `<div class="mxq-abas" role="tablist" aria-label="${e(modos.titulo)}">${abas}</div>`
    + `<ul class="mxq-modos__paineis">${paineis}</ul></div>`
    + `<div class="mxq-modos__cartao">${midias}</div></div>`
    // barra de ações do celular da Square (Get started + Contact sales, presa à tela enquanto o palco passa). Na página
    // vestida quem faz esse papel é o par fixo do chassi (.float-cta "Começar grátis" + .whatsapp-float), então só a
    // origem desenha a barra
    + (D.origem ? `<div class="mxq-acoes">${C.topo.botoes.map((b) => botao(b, 'mxq-acoes__botao')).join('')}</div>` : '')
    + `</section>`;
}

function linhas(D, C) {
  const L = C.linhas;
  return `<section class="mxq-s2 mxq-casca"${sec(D, 2)}><h2 class="mxq-titulo mxq-titulo--serif mxq-rv">${e(L.titulo)}</h2><div class="mxq-linhas">`
    + L.itens.map((it) => `<article class="mxq-linha mxq-rv">${quadro(D, it.img, '(min-width: 64rem) 27vw, 100vw', 'mxq-linha__foto')}<div class="mxq-linha__texto"><h3 class="mxq-linha__titulo">${e(it.titulo)}</h3>${it.html}${linkSublinhado(it.link)}</div></article>`).join('')
    + `</div></section>`;
}

function carrossel(D, C) {
  const K = C.carrossel;
  const T = K.lista;
  return `<section class="mxq-s3"${sec(D, 3)} data-mxq-carrossel><div class="mxq-casca"><h2 class="mxq-titulo mxq-titulo--serif mxq-titulo--centro mxq-rv">${e(K.titulo)}</h2>${K.sub ? `<div class="mxq-s3__sub">${K.sub}</div>` : ''}</div>`
    + `<div class="mxq-carro"><${T} class="mxq-carro__trilho">`
    + K.itens.map((it, i) => `<li class="mxq-carro__item${i === 0 ? ' is-ativo' : ''}">${quadro(D, it.img, '(min-width: 64rem) 50vw, 45vw', 'mxq-carro__img')}<div class="mxq-carro__legenda"><p class="mxq-carro__nome">${e(it.titulo)}</p><p class="mxq-carro__texto">${it.html}</p>${linkSublinhado(it.link)}</div></li>`).join('')
    + `</${T}><div class="mxq-setas"><button type="button" class="mxq-seta" data-dir="-1" aria-label="Anterior">${SETA_E}</button><button type="button" class="mxq-seta" data-dir="1" aria-label="Próximo">${SETA_D}</button></div></div>`
    + (K.nota ? `<aside class="mxq-casca mxq-nota"><p class="mxq-nota__titulo">${e(K.nota.titulo)}</p><p class="mxq-nota__texto">${e(K.nota.texto)}</p></aside>` : '')
    + `</section>`;
}

function cartoes(D, C) {
  const K = C.cartoes;
  return `<section class="mxq-s4"${sec(D, 4)} data-mxq-cartoes><div class="mxq-casca mxq-s4__cab"><h2 class="mxq-titulo mxq-titulo--serif mxq-s4__titulo mxq-rv">${e(K.titulo)}</h2><div class="mxq-setas mxq-setas--topo"><button type="button" class="mxq-seta" data-dir="-1" aria-label="Anterior">${SETA_E}</button><button type="button" class="mxq-seta" data-dir="1" aria-label="Próximo">${SETA_D}</button></div></div>`
    + `<ul class="mxq-cartoes">`
    + K.itens.map((it) => `<li class="mxq-cartao"><div class="mxq-cartao__texto">`
      + (it.iconeImg ? `<img class="mxq-cartao__icone" src="${D.v(D.base + '/' + it.iconeImg)}" alt="" width="56" height="56" loading="lazy">` : `<span class="mxq-cartao__icone">${it.icone}</span>`)
      + `<p class="mxq-cartao__titulo">${e(it.titulo)}</p>${it.texto ? `<p class="mxq-cartao__corpo">${e(it.texto)}</p>` : ''}${linkSublinhado(it.link)}</div>`
      + quadro(D, it.img, '(min-width: 64rem) 40vw, 45vw', 'mxq-cartao__img') + `</li>`).join('')
    + `</ul><div class="mxq-casca mxq-setas-base"><div class="mxq-setas"><button type="button" class="mxq-seta" data-dir="-1" aria-label="Anterior">${SETA_E}</button><button type="button" class="mxq-seta" data-dir="1" aria-label="Próximo">${SETA_D}</button></div></div></section>`;
}

function precos(D, C) {
  const P = C.precos;
  const r = P.rotulos || [];
  const sr = (t) => (t ? `<span class="mxq-sr">${e(t)}: </span>` : '');
  const plano = (p, i) => `<article class="mxq-plano${p.destaque ? ' mxq-plano--destaque' : ''}"${D.origem ? '' : ` data-plano="${i}"`}>`
    + `<div class="mxq-plano__cab"><h3 class="mxq-plano__nome">${sr(r[0])}${e(p.nome)}</h3>${p.selo ? `<span class="mxq-plano__selo">${e(p.selo)}</span>` : ''}</div>`
    + `<div class="mxq-plano__desc">${r[2] ? `<p class="mxq-plano__rotulo">${e(r[2])}</p>` : ''}<p>${p.desc}</p></div>`
    + `<hr class="mxq-plano__linha"><p class="mxq-plano__preco">${sr(r[1])}${e(p.preco)}</p><p class="mxq-plano__unidade">${e(p.unidade)}</p>`
    + botao(p.botao, 'mxq-plano__botao') + `</article>`;
  const L = P.largo;
  // celular (página vestida): os 3 cartões ficam lado a lado e o que o plano tocado inclui abre numa faixa da largura
  // toda, logo abaixo; o molde.js copia a descrição do cartão escolhido para a faixa (sem JS, ela fica no cartão)
  const faixa = D.origem ? '' : `<div class="mxq-planos__faixa"><div class="mxq-planos__escolha" role="group" aria-label="Ver o que cada plano inclui">${P.planos.map((p, i) => `<button type="button" class="mxq-planos__opcao${p.destaque ? ' is-ativo' : ''}" data-plano="${i}" aria-pressed="${!!p.destaque}">${e(p.nome)}</button>`).join('')}</div><div class="mxq-planos__texto" aria-live="polite"></div></div>`;
  return `<section class="mxq-s5"${sec(D, 5)}><div class="mxq-casca">`
    + `<h2 class="mxq-s5__titulo mxq-rv">${e(P.titulo)}</h2><div class="mxq-s5__sub">${P.sub}</div>${botao(P.botao, 'mxq-s5__mais')}`
    + `<div class="mxq-planos">${P.planos.map(plano).join('')}</div>${faixa}`
    + (L ? `<article class="mxq-largo"><div class="mxq-largo__esq"><p class="mxq-largo__rotulo">${sr(r[0])}${e(L.rotulo)}</p><p class="mxq-largo__titulo">${sr(r[1])}${e(L.titulo)}</p>${botao(L.botao)}</div><div class="mxq-largo__texto">${L.html}</div></article>` : '')
    + `</div></section>`;
}

function faq(D, C) {
  const F = C.faq;
  const n = F.itens.length;
  const item = ([q, a], i) => `<details class="mxq-faq__item${i >= F.visiveis ? ' mxq-faq__extra' : ''}" name="mxq-faq"><summary><h3 class="mxq-faq__q">${e(q)}</h3>${MAIS}</summary><div class="mxq-faq__a"><p>${e(a)}</p></div></details>`;
  const extra = n - F.visiveis;
  return `<section class="mxq-s6 mxq-casca"${sec(D, 6)} id="perguntas"><h2 class="mxq-faq__titulo mxq-rv">${e(F.titulo)}</h2><div class="mxq-faq">${F.itens.map(item).join('')}</div>`
    + (extra > 0 ? `<div class="mxq-faq__mais"><button type="button" class="mxq-botao mxq-botao--contorno" data-mxq-faq-mais aria-expanded="false">Ver mais perguntas (+${extra})</button></div>` : '')
    + `</section>`;
}

function cta(D, C) {
  const K = C.cta;
  return `<section class="mxq-s7 mxq-casca"><div class="mxq-s7__texto"><h2 class="mxq-titulo mxq-titulo--serif mxq-s7__titulo mxq-rv">${e(K.titulo)}</h2>${K.texto ? `<p class="mxq-s7__corpo">${e(K.texto)}</p>` : ''}</div><div class="mxq-botoes mxq-s7__botoes">${K.botoes.map((b) => botao(b)).join('')}</div></section>`;
}

function notas(D, C) {
  return `<section class="mxq-s8"${sec(D, 8)}><div class="mxq-casca mxq-notas">${C.notas.colunas.map((c) => `<div class="mxq-notas__col">${c}</div>`).join('')}</div></section>`;
}

export function desenho(D) {
  const C = D.origem ? daOrigem(D) : daRota(D);
  return `<div class="mxq${D.origem ? ' mxq--origem' : ''}">` + topo(D, C) + palco(D, C) + linhas(D, C) + carrossel(D, C) + cartoes(D, C) + precos(D, C) + faq(D, C) + cta(D, C) + notas(D, C) + '</div>';
}

// a prova da casa (SITE-VISIONX/gerador/provar-molde.mjs) chama render({...origem, modo: 'origem'})
export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem', links: ctx.links || { app: '#', cadastro: '#', wpp: '#' }, v: ctx.v || ((x) => x), base: ctx.base || '.' });
}
