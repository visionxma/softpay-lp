// Molde nextar-bebidas: o corpo da página "loja de bebidas" do Nex (nextar.com.br/segmento/loja-de-bebidas, feita em
// Framer), clonado pela captura renderizada em 03/11/2026 (referência enviada pelo Raykkony). As mesmas peças montam
// as duas versões:
//   modo origem → textos e recortes da própria referência (origem.json + ativos/): é o que a prova compara com a captura;
//   modo rota   → o conteúdo de tools/conteudo/segmentos/loja-de-bebidas.json, sem tirar nenhum texto de busca.
// Ordem da referência (9 seções, o idx é a ordem das âncoras de ferramentas/secoes.mjs):
//   0 hero: texto à esquerda (título, texto, botão, "👉 planos a partir de") | aparelhos à direita; embaixo, "Recursos
//     principais" em 2 colunas de texto separadas por fio;
//   1 faixa lilás centrada: olho, título, texto e o print grande; 2 o mesmo em branco, com fio embaixo;
//   3 linha: texto com botão de contorno | imagem; 4 linha invertida: painel verde com a arte | texto (olho verde);
//   5 faixa creme: olho laranja, título grande e botão à esquerda | 3 recursos com ícone à direita;
//   6 FAQ num cartão escuro sobre a página preta; 7 depoimento (foto redonda | frase grande, nome, botão do vídeo);
//   8 cartão partido no meio (números grandes no azul-claro | "Fale com a gente" no azul), com o preto acabando na
//     metade dele.
// Inventário do que é de gente/empresa REAL da origem e como saiu (BRIEFING, passo 4):
//   - depoimento da Camila Yamada (Lojas Yavi) → depoimento VERDADEIRO do Neto, da RN Grifes, cliente SoftPay (o mesmo
//     da home, com o vídeo dele);
//   - números do Nex (50 mil lojas, 113 países, 23 anos) → o lado azul-claro do cartão vira os 3 planos do SoftPay
//     (preço grande + plano + para quem é), que é a tabela da rota; nenhum número do Nex nem inventado;
//   - "Teste 14 dias grátis" e "Planos a partir de R$39" → 7 dias grátis sem cartão e "a partir de R$ 69/mês" (plano
//     Comércio, o ponto de partida da tabela da rota);
//   - contato do Nex (suporte@nextar, "5 minutos") → WhatsApp, e-mail e central de perguntas do SoftPay, sem prazo;
//   - prints do Nex (catálogo, estoque, fornecedores, combos) → prints REAIS do SoftPay (publicar/tela-*.webp) e
//     fotos de comércio de verdade do acervo da casa.
// O CSS (molde.css) reproduz a composição da referência em `.mx-nextar-bebidas`; a roupa do SoftPay e as regras da casa
// que vencem a referência (hero de tela inteira, celular lado a lado sem trilho, FAQ 5 + ver mais) moram em
// `.page-molde.mx-nextar-bebidas`.
import { readFileSync } from 'node:fs';

const O = JSON.parse(readFileSync(new URL('./origem.json', import.meta.url), 'utf8'));

// índices das seções de conteúdo na captura (secoes-<L>.json, refeitos por ferramentas/secoes.mjs)
const IDX = { hero: 0, catalogo: 1, estoque: 2, fornecedores: 3, combos: 4, outros: 5, faq: 6, depo: 7, numeros: 8 };

export const meta = {
  id: 'nextar-bebidas',
  referencia: 'https://www.nextar.com.br/segmento/loja-de-bebidas',
  captura: '~/.jarvis/visionx/clones/capturas/nextar-bebidas',
  // o cabeçalho fixo do Nex (96 px no computador, 72 no celular) fica DENTRO da 1ª seção da captura; na página
  // vestida esse lugar é do cabeçalho do chassi
  topoDoChassi: { 1440: 96, 390: 72 },
  secoes: [
    { idx: IDX.hero, tipo: 'hero: texto | aparelhos + recursos em 2 colunas' },
    { idx: IDX.catalogo, tipo: 'faixa lilás centrada + print grande' },
    { idx: IDX.estoque, tipo: 'faixa centrada + print grande, fio embaixo' },
    { idx: IDX.fornecedores, tipo: 'linha: texto com botão | imagem' },
    { idx: IDX.combos, tipo: 'linha invertida: painel | texto' },
    { idx: IDX.outros, tipo: 'faixa creme: título | 3 recursos com ícone' },
    { idx: IDX.faq, tipo: 'FAQ em cartão escuro' },
    { idx: IDX.depo, tipo: 'depoimento: foto redonda | frase' },
    { idx: IDX.numeros, tipo: 'cartão partido: números | fale com a gente' },
  ],
};

const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sec = (D, k) => (D.origem ? ` data-mx-secao="${IDX[k]}"` : '');
const MAIS = '<svg class="mxn-faq__ico" viewBox="0 0 24 24" aria-hidden="true"><path class="mxn-faq__v" d="M12 5v14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>';
const SETA = '<svg class="mxn-botao__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
const ICO_ZAP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.1zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3z"/></svg>';
const ICO_MAIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3.2a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1 0 2.8L9.4 18.8 4 20l1.2-5.4z"/></svg>';
const ICO_AJUDA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM5.6 4.2l3 3-1.4 1.4-3-3zm12.8 0 1.4 1.4-3 3-1.4-1.4zM7.2 15.4l1.4 1.4-3 3-1.4-1.4zm9.6 0 3 3-1.4 1.4-3-3z"/></svg>';

// imagem: na origem é o recorte da captura (um por largura); na rota, o arquivo publicado com versão e srcset menor
function quadro(D, img, sizes = '100vw', classe = '') {
  if (!img) return '';
  if (img.ref) {
    return `<picture class="mxn-quadro ${classe}"><source media="(max-width: 600px)" srcset="../ativos/${img.ref}-390.png"><img src="../ativos/${img.ref}-1440.png" alt=""></picture>`;
  }
  const src = D.v(D.base + '/' + img.arq);
  const menor = img.menor ? ` srcset="${D.v(D.base + '/' + img.menor)} ${img.menorW || 800}w, ${src} ${img.w}w" sizes="${sizes}"` : '';
  return `<picture class="mxn-quadro ${classe}"><img src="${src}"${menor} alt="${e(img.alt)}" width="${img.w}" height="${img.h}" loading="${img.cedo ? 'eager' : 'lazy'}"${img.cedo ? ' fetchpriority="high"' : ''} decoding="async"></picture>`;
}
const botao = (b, extra = '') => `<a class="mxn-botao mxn-botao--${b.tipo || 'cheio'} ${extra}" href="${e(b.href || '#')}"${b.externo ? ' target="_blank" rel="noopener"' : ''}>${b.icone || ''}<span>${e(b.texto)}</span>${b.tipo === 'contorno' ? SETA : ''}</a>`;
const olho = (t, cor = '') => (t ? `<p class="mxn-olho${cor ? ' mxn-olho--' + cor : ''}">${e(t)}</p>` : '');

// ---------------------------------------------------------------------------------------- conteúdo das duas versões
function daOrigem() {
  const ref = (r) => ({ ref: r });
  const cta = { texto: O.topo.botao, href: '#', tipo: 'cheio' };
  const contorno = (t) => ({ texto: t, href: '#', tipo: 'contorno' });
  const [l1, l2, l3, l4] = O.linhas;
  const meio = Math.ceil(O.chips.itens.length / 2);
  return {
    hero: {
      trilha: '', h1: O.topo.h1, intro: `<p>${e(O.topo.intro)}</p>`, botoes: [cta],
      nota: { forte: O.topo.planos, texto: O.topo.planosNota, celular: O.topo.notaCelular }, img: ref('hero'),
      rotulo: O.chips.titulo, colunas: [O.chips.itens.slice(0, meio), O.chips.itens.slice(meio)].map((c) => c.map((t) => ({ texto: t }))),
    },
    vitrines: [
      { k: 'catalogo', classe: 'mxn-vitrine--lilas', olho: l1.olho, titulo: l1.titulo, corpo: `<p>${e(l1.texto)}</p>`, img: ref(l1.ref) },
      { k: 'estoque', classe: 'mxn-vitrine--fio mxn-vitrine--larga', olho: l2.olho, titulo: l2.titulo, corpo: `<p>${e(l2.texto)}</p>`, img: ref(l2.ref) },
    ],
    linhas: [
      { k: 'fornecedores', classe: 'mxn-linha--fio', olho: l3.olho, cor: '', titulo: l3.titulo, corpo: `<p>${e(l3.texto)}</p>`, botao: contorno(l3.botao), img: ref(l3.ref) },
      { k: 'combos', classe: 'mxn-linha--inversa mxn-linha--pequena', olho: l4.olho, cor: 'verde', titulo: l4.titulo, corpo: `<p>${e(l4.texto)}</p>`, botao: contorno(l4.botao), img: ref(l4.ref) },
    ],
    outros: { olho: O.outros.olho, titulo: O.outros.titulo, botao: contorno(O.outros.botao), itens: O.outros.itens.map((c) => ({ titulo: c.titulo, texto: e(c.texto), ico: ref(c.ref) })) },
    faq: { titulo: O.faq.titulo, itens: O.faq.itens, visiveis: 99 },
    depo: { frase: O.depoimento.frase, nome: O.depoimento.nome, onde: O.depoimento.onde, botao: O.depoimento.botao, foto: ref('depoimento'), video: '' },
    numeros: {
      claro: { titulo: '', sub: '', rotulos: null, itens: O.numeros.map(([n, t]) => ({ numero: n, rotulo: t, desc: '' })) },
      azul: { titulo: O.contato.titulo, sub: '', botoes: [], itens: O.contato.itens.map(([t, s], i) => ({ titulo: t, texto: s, href: '#', icone: [ICO_ZAP, ICO_MAIL, ICO_AJUDA][i] })) },
    },
    relacionados: null,
  };
}

// imagens da rota (fotos de comércio de verdade do acervo do SoftPay e prints reais do sistema, em publicar/)
const FOTO = (n, alt) => ({ arq: `foto-${n}.webp`, menor: `foto-${n}-800.webp`, w: 1600, h: 668, alt });
const TELA = (n, alt) => ({ arq: `tela-${n}.webp`, menor: `tela-${n}-800.webp`, w: 1400, h: 845, alt });
const ICONES = ['pdv-frente-de-caixa', 'atacado-e-varejo', 'controle-de-estoque', 'caderninho-de-fiado', 'curva-abc'];

const partes = (b, tipo) => (b ? b.partes.filter((p) => p.tipo === tipo) : []);
const lista = (b, classe) => { const u = partes(b, 'ul')[0]; return u ? `<ul class="${classe}">${u.itens.map((it) => `<li>${it}</li>`).join('')}</ul>` : ''; };
const P = (b) => partes(b, 'p').map((p) => `<p>${p.texto}</p>`).join('');

function daRota(D) {
  const bloco = (id) => (D.blocks || []).find((b) => b.id === id);
  const bRot = bloco('a-rotina-de-uma-loja-de-bebidas'), bProb = bloco('os-problemas-que-aparecem-sempre');
  const bMuda = bloco('o-que-muda-com-o-softpay'), bNao = bloco('o-que-o-softpay-nao-faz-numa-loja-de-bebidas');
  const bResp = bloco('perguntas-que-voce-passa-a-conseguir-responder'), bPlano = bloco('qual-plano-faz-sentido');
  const cadastro = { texto: 'Testar 7 dias grátis', href: D.links.cadastro, tipo: 'cheio' };
  const contorno = { texto: 'Testar 7 dias grátis', href: D.links.cadastro, tipo: 'contorno' };

  // o que muda com o SoftPay → os recursos com ícone da faixa creme (âncoras mxn-muda-N, alvo da lista do hero)
  const h3s = [], ps = [];
  for (const p of (bMuda ? bMuda.partes : [])) (p.tipo === 'h3' ? h3s : ps).push(p.texto);

  // qual plano faz sentido → o lado azul-claro do cartão: preço grande + plano + para quem é
  const tab = partes(bPlano, 'tabela')[0] || { cabecalho: [], linhas: [] };

  return {
    hero: {
      trilha: '<nav class="mxn-trilha" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span>'
        + (D.breadcrumbs || []).map((b) => (b[1] ? `<a href="${e(b[1])}">${e(b[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${e(b[0])}</span>`)).join('') + '</nav>',
      h1: D.h1, intro: `<p>${e(D.intro)}</p>`, botoes: [cadastro],
      nota: { forte: 'Planos a partir de R$ 69/mês', texto: '7 dias grátis, sem cartão de crédito.', celular: '' },
      img: { arq: 'aparelhos.webp', menor: 'aparelhos-800.webp', w: 1448, h: 1086, alt: 'Monitor com o caixa do SoftPay aberto e celular com o carrinho da venda', cedo: true },
      rotulo: 'Recursos principais para loja de bebidas:',
      colunas: [
        [{ texto: 'PDV rápido para o pico', href: '#mxn-muda-1' }, { texto: 'Atacado e varejo', href: '#mxn-muda-2' }, { texto: 'Estoque de alto giro', href: '#mxn-muda-3' }],
        [{ texto: 'Fiado sem caderno', href: '#mxn-muda-4' }, { texto: 'Curva ABC', href: '#mxn-muda-5' }, { texto: 'Planos a partir de R$ 69', href: '#mxn-planos' }],
      ],
    },
    vitrines: [
      { k: 'catalogo', classe: 'mxn-vitrine--lilas', olho: 'Sexta, sábado e o resto da semana', titulo: bRot ? bRot.titulo : '', corpo: P(bRot),
        img: TELA('pdv', 'Tela do PDV do SoftPay: busca de produto, grade de itens e o carrinho com o total da venda') },
      { k: 'estoque', classe: 'mxn-vitrine--fio', olho: 'Resposta na tela, não no caderno', titulo: bResp ? bResp.titulo : '', corpo: lista(bResp, 'mxn-perguntas'),
        img: TELA('estoque', 'Tela do Estoque do SoftPay com a lista de produtos, o custo e a quantidade de cada item') },
    ],
    linhas: [
      { k: 'fornecedores', classe: 'mxn-linha--fio', olho: 'Onde a margem escapa', cor: '', titulo: bProb ? bProb.titulo : '', corpo: lista(bProb, 'mxn-lista'), botao: contorno,
        img: FOTO('distribuidora', 'Comerciante conferindo no papel e no celular o estoque de engradados') },
      { k: 'combos', classe: 'mxn-linha--inversa mxn-linha--painel', olho: 'Combinado antes de começar', cor: 'verde', titulo: bNao ? bNao.titulo : '', corpo: lista(bNao, 'mxn-lista') + P(bNao), botao: contorno,
        img: { arq: 'tela-tablet-financeiro.webp', menor: 'tela-tablet-financeiro-600.webp', menorW: 600, w: 1268, h: 1690, alt: 'Financeiro do SoftPay no tablet: vendas por forma de pagamento (Dinheiro, PIX, Fiado, Crédito e Débito)' } },
    ],
    outros: {
      olho: 'Feito para o giro da loja de bebidas', titulo: bMuda ? bMuda.titulo : '', botao: contorno,
      itens: h3s.map((t, i) => ({ titulo: t, texto: ps[i] || '', id: `mxn-muda-${i + 1}`, ico: ICONES[i] ? { arq: `icone-${ICONES[i]}.webp`, w: 56, h: 56, alt: '' } : null })),
    },
    faq: { titulo: 'Perguntas frequentes', itens: D.faq || [], visiveis: 5 },
    depo: {
      frase: '“O fiado saiu do caderno. Hoje o cliente recebe o link e paga por Pix.”', nome: 'Neto', onde: 'RN Grifes · cliente SoftPay',
      botao: 'Veja o vídeo do depoimento', foto: { arq: 'depoimento-neto-rosto.webp', w: 440, h: 440, alt: 'Neto, dono da RN Grifes, cliente SoftPay' },
      video: '/assets/depoimentos/neto-rn-grifes.mp4', poster: D.v(D.base + '/depoimento-neto.webp'),
    },
    numeros: {
      claro: { titulo: bPlano ? bPlano.titulo : '', sub: P(bPlano), rotulos: tab.cabecalho, itens: tab.linhas.map((l) => ({ numero: l[1], rotulo: l[0], desc: l[2] })) },
      azul: {
        titulo: D.cta_title, sub: `<p>${e(D.cta_text)}</p>`, botoes: [{ ...cadastro, texto: 'Testar grátis', tipo: 'claro' }],
        itens: [
          { titulo: 'Chat e WhatsApp', texto: 'Suporte humano pelo WhatsApp, em todo o Brasil', href: D.links.wpp, externo: true, icone: ICO_ZAP },
          { titulo: 'E-mail', texto: 'Nosso e-mail é o suporte@softpaybr.com', href: 'mailto:suporte@softpaybr.com', icone: ICO_MAIL },
          { titulo: 'Central de perguntas', texto: 'Planos, nota fiscal, estoque e fiado', href: '/perguntas/', icone: ICO_AJUDA },
        ],
      },
    },
    relacionados: { titulo: 'Continue por aqui', itens: D.related || [], mais: D.mais || [] },
  };
}

// ---------------------------------------------------------------------------------------------------- peças
function hero(D, C) {
  const t = C.hero;
  const item = (c) => `<li>${c.href ? `<a href="${e(c.href)}">${e(c.texto)}</a>` : `<span>${e(c.texto)}</span>`}</li>`;
  return `<section class="mxn-hero"${sec(D, 'hero')}><div class="mxn-casca mxn-hero__grade">`
    + `<div class="mxn-hero__texto">${t.trilha}<h1 class="mxn-h1">${e(t.h1)}</h1><div class="mxn-hero__intro">${t.intro}</div>`
    + `<div class="mxn-hero__botoes">${t.botoes.map((b) => botao(b)).join('')}</div>`
    + `<div class="mxn-hero__nota"><p class="mxn-hero__planos"><span aria-hidden="true">👉</span> <strong>${e(t.nota.forte)}</strong></p><p class="mxn-hero__sem">${e(t.nota.texto)}</p>`
    + (t.nota.celular ? `<p class="mxn-hero__celular">${e(t.nota.celular)}</p>` : '') + `</div></div>`
    + `<div class="mxn-hero__arte">${quadro(D, t.img, '(min-width: 64rem) 602px, 100vw', 'mxn-hero__img')}</div>`
    + `<div class="mxn-hero__rec"><p class="mxn-hero__rotulo">${e(t.rotulo)}</p><div class="mxn-hero__cols">${t.colunas.map((c) => `<ul>${c.map(item).join('')}</ul>`).join('')}</div></div>`
    + `</div></section>`;
}

function vitrine(D, v) {
  return `<section class="mxn-vitrine ${v.classe}"${sec(D, v.k)}><div class="mxn-casca">`
    + `<div class="mxn-vitrine__cab mxn-rv">${olho(v.olho)}<h2 class="mxn-titulo">${e(v.titulo)}</h2><div class="mxn-vitrine__corpo">${v.corpo}</div></div>`
    + `<div class="mxn-vitrine__arte mxn-rv">${quadro(D, v.img, '(min-width: 76rem) 1216px, 100vw', 'mxn-vitrine__img')}</div>`
    + `</div></section>`;
}

function linha(D, l) {
  return `<section class="mxn-linha ${l.classe}"${sec(D, l.k)}><div class="mxn-casca mxn-linha__grade">`
    + `<div class="mxn-linha__texto mxn-rv">${olho(l.olho, l.cor)}<h2 class="mxn-titulo">${e(l.titulo)}</h2><div class="mxn-linha__corpo">${l.corpo}</div>`
    + (l.botao ? `<div class="mxn-linha__botao">${botao(l.botao)}</div>` : '') + `</div>`
    + `<div class="mxn-linha__arte mxn-rv">${quadro(D, l.img, '(min-width: 64rem) 592px, 100vw', 'mxn-linha__img')}</div>`
    + `</div></section>`;
}

function outros(D, C) {
  const K = C.outros;
  const ico = (i) => (i ? (i.ref ? quadro(D, i, '56px', 'mxn-recurso__ico') : `<img class="mxn-recurso__ico" src="${D.v(D.base + '/' + i.arq)}" alt="" width="56" height="56" loading="lazy" decoding="async">`) : '');
  return `<section class="mxn-outros"${sec(D, 'outros')}><div class="mxn-casca mxn-outros__grade">`
    + `<div class="mxn-outros__cab mxn-rv">${olho(K.olho, 'laranja')}<h2 class="mxn-titulo mxn-titulo--grande">${e(K.titulo)}</h2><div class="mxn-outros__botao">${botao(K.botao)}</div></div>`
    + `<ul class="mxn-outros__lista">${K.itens.map((c) => `<li class="mxn-recurso mxn-rv"${c.id ? ` id="${c.id}"` : ''}>${ico(c.ico)}<h3 class="mxn-recurso__titulo">${e(c.titulo)}</h3><p class="mxn-recurso__texto">${c.texto}</p></li>`).join('')}</ul>`
    + `</div></section>`;
}

function faq(D, C) {
  const F = C.faq;
  const n = F.itens.length;
  const resposta = (a) => (Array.isArray(a) ? a.map((p) => `<p>${p}</p>`).join('') : `<p>${a}</p>`);
  const item = ([q, a], i) => `<details class="mxn-faq__item${i >= F.visiveis ? ' mxn-faq__extra' : ''}" name="mxn-faq"${i === 0 ? ' open' : ''}><summary><h3 class="mxn-faq__q">${e(q)}</h3>${MAIS}</summary><div class="mxn-faq__a">${resposta(a)}</div></details>`;
  const extra = n - F.visiveis;
  return `<section class="mxn-faq-sec" id="perguntas"><div class="mxn-casca"><div class="mxn-faq__cartao"${sec(D, 'faq')}>`
    + `<h2 class="mxn-faq__titulo">${e(F.titulo)}</h2><div class="mxn-faq">${F.itens.map(item).join('')}</div>`
    + (extra > 0 ? `<div class="mxn-faq__mais"><button type="button" class="mxn-botao mxn-botao--escuro" data-mxn-faq-mais aria-expanded="false">Ver mais perguntas (+${extra})</button></div>` : '')
    + `</div></div></section>`;
}

function depo(D, C) {
  const K = C.depo;
  const video = K.video ? `<video class="mxn-depo__video" src="${e(K.video)}" poster="${e(K.poster)}" controls preload="none" playsinline hidden aria-label="Depoimento em vídeo de ${e(K.nome)}"></video>` : '';
  const acao = K.video
    ? `<button type="button" class="mxn-botao mxn-botao--branco mxn-depo__botao" data-mxn-video>${PLAY}<span>${e(K.botao)}</span></button>`
    : `<a class="mxn-botao mxn-botao--branco mxn-depo__botao" href="#"><span>${e(K.botao)}</span></a>`;
  return `<section class="mxn-depo"><div class="mxn-casca"><figure class="mxn-depo__caixa"${sec(D, 'depo')}>`
    + `<div class="mxn-depo__foto">${quadro(D, K.foto, '(min-width: 64rem) 592px, 205px', 'mxn-depo__img')}${video}</div>`
    + `<div class="mxn-depo__texto mxn-rv"><blockquote class="mxn-depo__frase"><p>${e(K.frase)}</p></blockquote>`
    + `<figcaption><p class="mxn-depo__nome">${e(K.nome)}</p><p class="mxn-depo__onde">${e(K.onde)}</p></figcaption>${acao}</div>`
    + `</figure></div></section>`;
}

function numeros(D, C) {
  const A = C.numeros.claro, B = C.numeros.azul;
  const r = A.rotulos || [];
  const sr = (t) => (t ? `<span class="mxn-sr">${e(t)}: </span>` : '');
  // "R$ 69/mês" fica inteiro num nó só: o portão de texto do vestir troca tag por espaço, e um <small> no "/mês"
  // virava "r$ 69 /mês" (texto de busca sumido)
  const valor = (n) => e(n);
  const item = (n, i) => `<li class="mxn-numero${i === 1 && !D.origem ? ' is-destaque' : ''}"${D.origem ? '' : ` data-plano="${i}"`}>`
    + `<p class="mxn-numero__valor">${sr(r[1])}${valor(n.numero)}</p><p class="mxn-numero__rotulo">${sr(r[0])}${e(n.rotulo)}</p>`
    + (n.desc ? `<p class="mxn-numero__desc">${sr(r[2])}${n.desc}</p>` : '') + `</li>`;
  // celular (página vestida): os 3 planos ficam lado a lado e o "para quem é" do plano tocado abre numa faixa da
  // largura toda, logo abaixo; o molde.js copia a descrição do escolhido para a faixa (sem JS, ela fica no cartão)
  const faixa = D.origem ? '' : `<div class="mxn-planos__faixa"><p class="mxn-planos__texto" aria-live="polite"></p></div>`;
  const contato = (c) => `<li class="mxn-contato__item"><a href="${e(c.href)}"${c.externo ? ' target="_blank" rel="noopener"' : ''}><span class="mxn-contato__ico">${c.icone}</span><span class="mxn-contato__titulo">${e(c.titulo)}</span><span class="mxn-contato__sub">${e(c.texto)}</span></a></li>`;
  return `<section class="mxn-numeros" id="mxn-planos"><div class="mxn-casca"><div class="mxn-numeros__cartao"${sec(D, 'numeros')}>`
    + `<div class="mxn-numeros__claro">`
    + (A.titulo ? `<div class="mxn-numeros__cab"><h2 class="mxn-numeros__h2">${e(A.titulo)}</h2></div>` : '')
    + `<ul class="mxn-numeros__lista">${A.itens.map(item).join('')}</ul>${faixa}`
    + (A.sub ? `<div class="mxn-numeros__sub">${A.sub}</div>` : '') + `</div>`
    + `<div class="mxn-numeros__azul"><h2 class="mxn-numeros__h2">${e(B.titulo)}</h2>`
    + (B.sub ? `<div class="mxn-numeros__sub">${B.sub}</div>` : '')
    + (B.botoes.length ? `<div class="mxn-numeros__botoes">${B.botoes.map((b) => botao(b)).join('')}</div>` : '')
    + `<ul class="mxn-contato">${B.itens.map(contato).join('')}</ul></div>`
    + `</div></div></section>`;
}

function relacionados(R) {
  if (!R) return '';
  return `<section class="mxn-rel-sec"><div class="mxn-casca"><nav class="mxn-rel" aria-label="${e(R.titulo)}"><h2 class="mxn-rel__titulo">${e(R.titulo)}</h2>`
    + `<ul class="mxn-rel__lista">${R.itens.map((x) => `<li><a href="${e(x[1])}"><strong>${e(x[0])}</strong><span>${e(x[2] || '')}</span></a></li>`).join('')}</ul>`
    + (R.mais.length ? `<h2 class="mxn-rel__titulo">Veja também</h2><ul class="mxn-rel__lista">${R.mais.map((m) => `<li><a href="${e(m[1])}"><strong>${e(m[0])}</strong></a></li>`).join('')}</ul>` : '')
    + `</nav></div></section>`;
}

export function desenho(D) {
  const C = D.origem ? daOrigem(D) : daRota(D);
  return `<div class="mxn${D.origem ? ' mxn--origem' : ''}">`
    + hero(D, C) + C.vitrines.map((v) => vitrine(D, v)).join('') + C.linhas.map((l) => linha(D, l)).join('') + outros(D, C)
    + `<div class="mxn-noite">${faq(D, C)}${depo(D, C)}</div>` + numeros(D, C) + relacionados(C.relacionados)
    + '</div>';
}

// a prova da casa (SITE-VISIONX/gerador/provar-molde.mjs) chama render({...origem, modo: 'origem'})
export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem', links: ctx.links || { app: '#', cadastro: '#', wpp: '#' }, v: ctx.v || ((x) => x), base: ctx.base || '.' });
}
