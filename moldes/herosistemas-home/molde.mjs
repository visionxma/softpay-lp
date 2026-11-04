// Molde herosistemas-home: o corpo da home da Hero Sistemas (herosistemas.com.br, feita em Elementor), clonado pela
// captura renderizada em 03/11/2026 (referência enviada pelo Raykkony). As mesmas peças montam as duas versões:
//   modo origem → textos e recortes da própria referência (origem.json + ativos/): é o que a prova compara com a captura;
//   modo rota   → o conteúdo de tools/conteudo/sistema-de-gestao-para-pequenos-negocios.json, sem tirar nenhum texto
//                 de busca.
// Ordem da referência (o idx é a posição na lista SECOES de ferramentas/secoes.mjs; 0 é o cabeçalho e 10 o rodapé,
// que são do chassi):
//   1 hero: título em dois tons, texto, 5 itens com check e a prova com avatares | cartão de formulário à direita;
//   2 faixa clara: título azul centrado + esteira infinita de logos;
//   3 vídeo grande sobre a costura branco/azul; no azul, título branco, 5 diferenciais numerados (3 + 2), botão-pílula
//     de contorno com a seta num círculo, "HERO" esmaecido ao fundo e um chanfro branco com o ícone de mouse embaixo;
//   4 "situações": título em dois tons com botão à direita, 6 cartões com alerta vermelho em 2 colunas; depois
//     "soluções": pílula, título centrado, 6 cartões com check azul em 2 colunas;
//   5 depoimentos em 3 colunas desencontradas (foto redonda sobre a borda, nome azul, cidade, print do WhatsApp);
//   6 app: degradê índigo, pílula, título em dois tons, texto, 3 pílulas com check, selos das lojas | celular;
//   7 planos: 3 cartões com preço, linha de desconto e lista de 21 recursos com check/x, aba "Mais popular" no 3º;
//   8 FAQ: azul-marinho, chanfro em cima, pílula, título e 15 sanfonas brancas com seta;
//   9 cartão azul-marinho com logo, título e texto | cartão branco de formulário que sobe por cima.
// Inventário do que é de gente/empresa REAL da origem e como saiu (BRIEFING, passo 4):
//   - logos de iFood, Zé Delivery, 99Food e Anota Aí (integrações da Hero) → a esteira vira as 11 funções do sistema
//     (ícones 3D do acervo do SoftPay), cada uma ligada ao cartão que a explica;
//   - "Mais de 300 deliveries já usam a Hero" e os avatares → os 4 ícones das funções + a faixa de preço real
//     ("Planos de R$ 65 a R$ 109 por mês"), sem número de clientes;
//   - depoimentos de Mizael, Francisco, Leo, Felipe, Bianca e Renan, com os prints de WhatsApp → OMITIDOS (gente
//     real da Hero); o lugar vira "Para quem serve": os 7 segmentos da rota, com retrato de lojista do acervo da casa
//     e um print REAL do SoftPay em cada cartão;
//   - preços da Hero (R$ 187,90 a R$ 367,90) e os "15% de desconto no plano anual" → os planos e preços de
//     public/index.html (Comércio R$ 69, Loja R$ 89, ERP Completo R$ 109 e a faixa Nota Fiscal R$ 65), sem desconto;
//   - app Hero Admin e os selos da App Store e do Google Play → o SoftPay roda no navegador (sem selo de loja): o
//     celular mostra um print real do sistema;
//   - "em poucos dias", "grupo de WhatsApp exclusivo", TEF com parceiros → saem com o FAQ da Hero; vale o FAQ da rota;
//   - formulário de demonstração com e-mail → o mesmo cartão leva ao WhatsApp do SoftPay (nome, loja e WhatsApp
//     vão na mensagem; nada é gravado);
//   - vídeo do YouTube da Hero → o vídeo do SoftPay rodando (assets/hero/ritmo-paisagem.mp4), mudo, só à vista;
//   - contato da Hero (e-mail, Instagram) → é do rodapé, que é do chassi.
// O CSS (molde.css) reproduz a composição da referência em `.mx-herosistemas-home`; a roupa do SoftPay e as regras
// da casa que vencem a referência (hero de tela inteira, celular lado a lado sem trilho, planos com o destaque no meio,
// FAQ 5 + ver mais) moram em `.page-molde.mx-herosistemas-home`.
import { readFileSync } from 'node:fs';

const O = JSON.parse(readFileSync(new URL('./origem.json', import.meta.url), 'utf8'));

// índices das seções de conteúdo na captura (secoes-<L>.json, refeitos por ferramentas/secoes.mjs)
const IDX = { hero: 1, integra: 2, video: 3, sit: 4, depo: 5, app: 6, planos: 7, faq: 8, consultor: 9 };

export const meta = {
  id: 'herosistemas-home',
  referencia: 'https://herosistemas.com.br/',
  captura: '~/.jarvis/visionx/clones/capturas/herosistemas-home',
  // o menu em cápsula da Hero flutua DENTRO da 1ª seção de conteúdo; na página vestida esse lugar é do chassi
  topoDoChassi: { 1440: 130, 390: 63 },
  secoes: [
    { idx: IDX.hero, tipo: 'hero: título em dois tons, checks e prova | cartão de formulário' },
    { idx: IDX.integra, tipo: 'faixa clara: título azul + esteira infinita' },
    { idx: IDX.video, tipo: 'vídeo sobre a costura + diferenciais numerados no azul' },
    { idx: IDX.sit, tipo: 'cartões com alerta + cartões com check, 2 colunas' },
    { idx: IDX.depo, tipo: 'cartões em 3 colunas desencontradas (depoimentos omitidos → segmentos)' },
    { idx: IDX.app, tipo: 'degradê índigo: texto e pílulas | celular' },
    { idx: IDX.planos, tipo: '3 planos com lista check/x' },
    { idx: IDX.faq, tipo: 'FAQ em sanfonas brancas no azul-marinho' },
    { idx: IDX.consultor, tipo: 'cartão marinho | cartão de formulário' },
  ],
};

const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sec = (D, k) => (D.origem ? ` data-mx-secao="${IDX[k]}"` : '');
const azul = (a, b, c = '') => `${e(a)}<span class="mxh-azul">${e(b)}</span>${e(c)}`;

const CHECK = '<svg class="mxh-ico-check" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor"/><path d="m5.6 10.3 2.9 2.9 5.9-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const XIS = '<svg class="mxh-ico-x" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="currentColor"/><path d="m6.6 6.6 6.8 6.8m0-6.8-6.8 6.8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
const VISTO = '<svg class="mxh-ico-visto" viewBox="0 0 32 28" aria-hidden="true"><path d="M1.5 13.2 11 23.4 30.5 2.6c-8.2 3.8-14 9.8-19.3 16.3L6.4 11.6z" fill="currentColor"/></svg>';
const ALERTA = '<svg class="mxh-ico-alerta" viewBox="0 0 32 28" aria-hidden="true"><path d="M14.2 1.3a2.1 2.1 0 0 1 3.6 0l13.9 23.6a2.1 2.1 0 0 1-1.8 3.1H2.1A2.1 2.1 0 0 1 .3 24.9z" fill="currentColor"/><path d="M16 8.6v9" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><circle cx="16" cy="22.4" r="1.9" fill="#fff"/></svg>';
const SETA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
const SETA_BAIXO = '<svg class="mxh-faq__seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
const MOUSE = '<svg viewBox="0 0 16 24" aria-hidden="true"><rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M8 5.5v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const ZAP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.1zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3z"/></svg>';

// imagem: na origem é o recorte da captura (um por largura); na rota, o arquivo publicado com versão e srcset menor
function quadro(D, img, sizes = '100vw', classe = '') {
  if (!img) return '';
  if (img.ref) {
    return `<picture class="mxh-quadro ${classe}"><source media="(max-width: 600px)" srcset="../ativos/${img.ref}-390.png"><img src="../ativos/${img.ref}-1440.png" alt=""></picture>`;
  }
  const src = D.v(D.base + '/' + img.arq);
  const menor = img.menor ? ` srcset="${D.v(D.base + '/' + img.menor)} ${img.menorW || 800}w, ${src} ${img.w}w" sizes="${sizes}"` : '';
  return `<picture class="mxh-quadro ${classe}"><img src="${src}"${menor} alt="${e(img.alt)}" width="${img.w}" height="${img.h}" loading="${img.cedo ? 'eager' : 'lazy'}"${img.cedo ? ' fetchpriority="high"' : ''} decoding="async"></picture>`;
}
// botão-pílula da Hero: contorno claro, texto e a seta num círculo
const pilula = (b, extra = '') => `<a class="mxh-pilbotao ${extra}" href="${e(b.href || '#')}"${b.externo ? ' target="_blank" rel="noopener"' : ''}><span>${e(b.texto)}</span><span class="mxh-pilbotao__seta">${SETA}</span></a>`;
const olho = (t, extra = '') => (t ? `<p class="mxh-olho ${extra}">${e(t)}</p>` : '');
// letra-d'água: a palavra repetida numa fileira que passa das bordas (na Hero, "HERO" em Space Ranger de 745 px)
const marca = (t, extra = '') => `<p class="mxh-marca ${extra}" aria-hidden="true">${`<span>${e(t)}</span>`.repeat(4)}</p>`;
// chanfro: a "campânula" que desce da seção de cima sobre a de baixo, com o ícone de mouse dentro
const chanfro = (extra = '') => `<div class="mxh-chanfro ${extra}" aria-hidden="true"><svg class="mxh-chanfro__forma" viewBox="0 0 167 42" preserveAspectRatio="none"><path d="M0 0C30 0 40 6 55 22C66 34 72 40 83.5 40C95 40 101 34 112 22C127 6 137 0 167 0Z" fill="currentColor"/></svg>${MOUSE}</div>`;

// ---------------------------------------------------------------------------------------- conteúdo das duas versões
function daOrigem() {
  const ref = (r) => ({ ref: r });
  const P = O.planos;
  return {
    hero: {
      trilha: '', h1: [O.hero.h1Azul, O.hero.h1Resto], intro: `<p>${O.hero.intro}</p>`,
      checks: O.hero.checks.map((t) => ({ texto: t })),
      prova: { img: ref('hero-avatares'), icones: null, texto: O.hero.prova },
    },
    form: {
      titulo: [O.form.tituloA, O.form.tituloAzul], texto: O.form.texto, campos: O.form.campos, botao: O.form.botao,
      aviso: e(O.form.aviso), acao: '#', link: null,
    },
    integra: { titulo: O.integracoes.titulo, corpo: '', esteira: ref('logos') },
    video: {
      img: ref('video'), titulo: O.diferenciais.titulo, intro: '', sub: '',
      itens: O.diferenciais.itens.map((t) => ({ html: t })), nota: '', botao: { texto: O.diferenciais.botao, href: '#' }, marca: O.diferenciais.fundo,
    },
    sit: {
      titulo: [O.situacoes.tituloA, O.situacoes.tituloAzul], botao: { texto: O.situacoes.botao, href: '#' },
      itens: O.situacoes.itens.map(([t, x]) => ({ titulo: t, texto: e(x) })), nota: null,
    },
    sol: {
      olho: O.solucoes.pilula, titulo: [O.solucoes.tituloA, O.solucoes.tituloAzul],
      itens: O.solucoes.itens.map(([t, x]) => ({ titulo: t, texto: e(x) })), chamada: null,
    },
    depo: {
      olho: O.depoimentos.pilula, titulo: [O.depoimentos.tituloA, O.depoimentos.tituloAzul, O.depoimentos.tituloB], intro: '',
      itens: O.depoimentos.itens.map(([n, c], i) => ({ titulo: n, texto: c, foto: ref(`depo-${i + 1}-foto`), print: ref(`depo-${i + 1}-print`) })),
    },
    app: {
      olho: O.app.pilula, titulo: [O.app.tituloA, O.app.tituloB], corpo: `<p>${e(O.app.texto)}</p>`,
      pilulas: O.app.pilulas.map((t) => ({ titulo: t })), lojas: ref('app-lojas'), botoes: null, nota: O.app.nota, img: ref('app-celular'),
    },
    planos: {
      olho: P.pilula, titulo: [P.tituloA, P.tituloAzul], intro: '', selo: `🔥 ${P.selo}`,
      itens: P.itens.map((p) => ({
        nome: p.nome, preco: p.preco, ciclo: p.ciclo, desc: P.desconto, destaque: !!p.destaque,
        lista: P.recursos.map((r, k) => ({ texto: r, sim: k < p.inclui })), botao: { texto: P.botao, href: '#' },
      })),
      rotulos: null, nf: null, rodape: '',
    },
    faq: { olho: O.faq.pilula, titulo: O.faq.titulo, itens: O.faq.itens, visiveis: 99, marca: O.diferenciais.fundo },
    consultor: { logo: ref('cta-logo'), titulo: O.consultor.titulo, corpo: `<p>${e(O.consultor.texto)}</p>`, form: null },
    relacionados: null,
  };
}

// imagens da rota (retratos de lojista e prints reais do sistema, do acervo do SoftPay, em publicar/)
const TELA = (n, alt) => ({ arq: `tela-${n}.webp`, menor: `tela-${n}-800.webp`, w: 1400, h: 845, alt });
const SEG = (n, alt) => ({ arq: `seg-${n}.webp`, w: 192, h: 192, alt });
const ICONE = (n) => ({ arq: `icone-${n}.webp`, w: 112, h: 112, alt: '' });
// as 11 funções de "O que um sistema de gestão resolve", na ordem dos h3, com o ícone 3D de cada uma
const ICONES = ['controle-de-estoque', 'pdv-frente-de-caixa', 'caixa-e-sangria', 'caderninho-de-fiado', 'clientes-e-crm', 'nfe-e-nfce',
  'loja-online-com-pix', 'filiais', 'acesso-por-funcionario', 'backup-automatico', 'venda-pelo-whatsapp'];
// o print real que acompanha cada segmento (mesma ordem dos cartões de "Para quem serve")
const PRINTS = [
  TELA('pdv', 'Frente de caixa do SoftPay: busca de produto, grade de itens e o carrinho com o total'),
  TELA('catalogo', 'Catálogo do SoftPay com os produtos, as fotos e o preço de cada um'),
  TELA('estoque', 'Estoque do SoftPay com a lista de produtos, o custo e a quantidade de cada item'),
  { arq: 'tela-pdv-celular.webp', menor: 'tela-pdv-celular-600.webp', menorW: 600, w: 900, h: 786, alt: 'Frente de caixa do SoftPay aberta no celular' },
  TELA('clientes', 'Cadastro de clientes do SoftPay, ligado às vendas e ao fiado'),
  TELA('financeiro', 'Financeiro do SoftPay com as vendas por forma de pagamento'),
  { arq: 'tela-celular-carrinho.webp', menor: 'tela-celular-carrinho-400.webp', menorW: 400, w: 690, h: 1498, alt: 'Carrinho da venda no SoftPay pelo celular' },
];
const SEGS = ['mercadinho', 'loja-de-roupas', 'loja-de-variedades', 'papelaria', 'farmacia', 'distribuidora', 'pequeno-comercio'];
const ALT_SEG = ['Dona de mercadinho entre as prateleiras', 'Dona de loja de roupas no balcão', 'Dona de loja de variedades no corredor',
  'Dona de papelaria arrumando a vitrine', 'Farmacêutica no balcão da farmácia', 'Dono de distribuidora entre os engradados', 'Casal dono de um pequeno comércio'];

// planos de public/index.html (Comércio, Loja e ERP Completo na grade; Nota Fiscal na faixa abaixo)
const RECURSOS = ['PDV e caixa completo', 'Caderninho de fiado', 'Estoque essencial', 'Fiado que cobra sozinho (link Pix)',
  'Loja online com Pix automático', 'Estoque avançado e curva ABC', 'Venda pelo WhatsApp', 'Emissão de NFC-e e NF-e', 'Equipe ampliada'];
const INCLUI = { 'Comércio': 3, 'Loja': 7, 'ERP Completo': 9 };

const partes = (b, tipo) => (b ? b.partes.filter((p) => p.tipo === tipo) : []);

function daRota(D) {
  const bloco = (id) => (D.blocks || []).find((b) => b.id === id) || { titulo: '', partes: [] };
  const bQue = bloco('o-que-e-um-sistema-de-gestao'), bQuem = bloco('para-quem-serve'), bPrecisa = bloco('minha-loja-pequena-precisa-de-um');
  const bCusta = bloco('quanto-custa'), bResolve = bloco('o-que-um-sistema-de-gestao-resolve'), bLucro = bloco('lucro-e-margem-a-parte-que-decide-o-negocio');
  const bCaderno = bloco('caderno-excel-ou-sistema'), bEscolher = bloco('como-escolher-sem-errar');
  const cadastro = (texto = 'Testar 7 dias grátis') => ({ texto, href: D.links.cadastro });

  // o que um sistema de gestão resolve → 11 pares h3 + p (âncoras mxh-resolve-N, alvo da esteira e dos checks)
  const resolve = [];
  for (const p of bResolve.partes) {
    if (p.tipo === 'h3') resolve.push({ titulo: p.texto, texto: '' });
    else if (p.tipo === 'p' && resolve.length) resolve[resolve.length - 1].texto += (resolve[resolve.length - 1].texto ? ' ' : '') + p.texto;
  }
  // o que é um sistema de gestão → 2 parágrafos | o h3 da diferença e o parágrafo dele
  const qp = bQue.partes;
  const iH3 = qp.findIndex((p) => p.tipo === 'h3');
  const antes = (iH3 < 0 ? qp : qp.slice(0, iH3)).filter((p) => p.tipo === 'p');
  const depois = iH3 < 0 ? [] : qp.slice(iH3 + 1).filter((p) => p.tipo === 'p');
  const quem = partes(bQuem, 'cards')[0] || { itens: [] };
  const ex = partes(bLucro, 'exemplo')[0] || { titulo: '', linhas: [], rodape: '' };
  const tab = partes(bCusta, 'tabela')[0] || { cabecalho: [], linhas: [] };
  const custaP = partes(bCusta, 'p');
  const ol = partes(bEscolher, 'ol')[0] || { itens: [] };
  const nota = partes(bEscolher, 'nota')[0] || null;
  const cad = partes(bCaderno, 'cards')[0] || { itens: [] };
  const linhaDe = (nome) => tab.linhas.find((l) => l[0] === nome) || [nome, '', ''];
  const [h1a, ...h1b] = String(D.h1).split(' para ');

  return {
    hero: {
      trilha: '<nav class="mxh-trilha" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span>'
        + (D.breadcrumbs || []).map((b) => (b[1] ? `<a href="${e(b[1])}">${e(b[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${e(b[0])}</span>`)).join('') + '</nav>',
      h1: h1b.length ? [h1a, ' para ' + h1b.join(' para ')] : [D.h1, ''], intro: `<p>${e(D.intro)}</p>`,
      checks: [
        { texto: 'Estoque e vendas no mesmo sistema', href: '#mxh-resolve-1' },
        { texto: 'Caixa conferido no fim do dia', href: '#mxh-resolve-3' },
        { texto: 'Fiado sem caderno, com saldo por cliente', href: '#mxh-resolve-4' },
        { texto: 'Loja online com Pix automático', href: '#mxh-resolve-7' },
        { texto: 'No computador, no celular e no tablet', href: '#mxh-resolve-9' },
      ],
      prova: { img: null, icones: ['controle-de-estoque', 'pdv-frente-de-caixa', 'caderninho-de-fiado', 'loja-online-com-pix'].map(ICONE), texto: 'Planos de R$ 65 a R$ 109 por mês · 7 dias grátis, sem cartão' },
    },
    form: {
      titulo: ['Veja como o SoftPay pode ', 'funcionar na sua loja'], texto: 'Sem compromisso. Uma pessoa da equipe responde pelo WhatsApp.',
      campos: ['Nome', 'Nome da sua loja', 'WhatsApp com DDD'], botao: 'Chamar no WhatsApp →',
      aviso: 'Seus dados vão só na mensagem do WhatsApp, para a equipe responder. Consulte a <a href="/privacidade.html">Política de Privacidade</a>.',
      acao: 'https://wa.me/5599984304630', link: cadastro('Prefere testar? 7 dias grátis, sem cartão'),
    },
    integra: {
      titulo: bQue.titulo,
      corpo: `<div class="mxh-integra__corpo"><div class="mxh-integra__col">${antes.map((p) => `<p>${p.texto}</p>`).join('')}</div>`
        + `<div class="mxh-integra__col mxh-integra__dif">${iH3 >= 0 ? `<h3 class="mxh-integra__h3">${e(qp[iH3].texto)}</h3>` : ''}${depois.map((p) => `<p>${p.texto}</p>`).join('')}</div></div>`,
      esteira: resolve.map((r, i) => ({ texto: r.titulo, href: `#mxh-resolve-${i + 1}`, ico: ICONE(ICONES[i] || ICONES[0]) })),
    },
    video: {
      img: null, video: '/assets/hero/ritmo-paisagem.mp4', poster: D.v(D.base + '/video-capa.webp'),
      titulo: bLucro.titulo, intro: partes(bLucro, 'p').map((p) => `<p>${p.texto}</p>`).join(''), sub: ex.titulo,
      itens: ex.linhas.map((l) => ({ rotulo: l.rotulo, valor: l.valor, classe: l.classe })), nota: ex.rodape,
      botao: cadastro(), marca: 'SOFTPAY',
    },
    sit: {
      titulo: bEscolher.titulo.endsWith('sem errar') ? [bEscolher.titulo.slice(0, -'sem errar'.length), 'sem errar'] : [bEscolher.titulo, ''],
      botao: cadastro('Testar com os meus produtos'), ordenada: true,
      itens: ol.itens.map((t) => ({ titulo: t, texto: '' })), nota,
    },
    sol: {
      olho: 'O que resolve', titulo: bResolve.titulo.startsWith('O que um sistema de gestão') ? ['O que um sistema de gestão ', bResolve.titulo.slice('O que um sistema de gestão '.length)] : [bResolve.titulo, ''],
      itens: resolve.map((r, i) => ({ ...r, id: `mxh-resolve-${i + 1}` })),
      chamada: { titulo: 'Veja tudo isso com a sua loja', texto: '7 dias grátis, sem cartão de crédito.', botao: cadastro() },
    },
    depo: {
      olho: 'Segmentos', titulo: ['Para ', 'quem serve', ''], intro: partes(bQuem, 'p').map((p) => `<p>${p.texto}</p>`).join(''),
      itens: quem.itens.map((c, i) => ({ titulo: c.titulo, href: c.href, texto: c.texto, foto: SEG(SEGS[i] || SEGS[6], ALT_SEG[i] || ''), print: PRINTS[i] || PRINTS[0] })),
    },
    app: {
      olho: 'Na prática', titulo: bCaderno.titulo.endsWith('ou sistema') ? [bCaderno.titulo.slice(0, -'ou sistema'.length), 'ou sistema'] : [bCaderno.titulo, ''],
      corpo: partes(bCaderno, 'p').map((p) => `<p>${p.texto}</p>`).join(''),
      pilulas: cad.itens.map((c) => ({ titulo: c.titulo, texto: c.texto, href: c.href })),
      lojas: null, botoes: [cadastro(), { texto: 'WhatsApp', href: D.links.wpp, externo: true, zap: true }],
      nota: 'Roda no navegador: computador, celular e tablet, sem instalar aplicativo.',
      img: { arq: 'celular.webp', menor: 'celular-600.webp', menorW: 600, w: 1200, h: 1500, alt: 'Celular com o SoftPay aberto mostrando a venda no caixa' },
    },
    planos: {
      olho: 'Planos', titulo: bCusta.titulo.startsWith('Quanto ') ? ['Quanto ', bCusta.titulo.slice('Quanto '.length)] : [bCusta.titulo, ''],
      intro: custaP[0] ? `<p>${custaP[0].texto}</p>` : '', selo: 'Mais popular', rotulos: tab.cabecalho,
      itens: ['Comércio', 'Loja', 'ERP Completo'].map((nome) => {
        const l = linhaDe(nome);
        return { nome, preco: l[1], ciclo: '', desc: l[2], destaque: nome === 'Loja', lista: RECURSOS.map((r, k) => ({ texto: r, sim: k < INCLUI[nome] })), botao: cadastro('Testar grátis') };
      }),
      nf: (() => { const l = linhaDe('Nota Fiscal'); return { nome: l[0], preco: l[1], desc: l[2], botao: cadastro('Testar grátis') }; })(),
      rodape: custaP.slice(1).map((p) => `<p>${p.texto}</p>`).join('') + '<p class="mxh-planos__garantia">Sem cartão de crédito, cancele quando quiser e conte com ajuda para configurar no WhatsApp.</p>',
    },
    faq: { olho: 'FAQ', titulo: 'Perguntas frequentes', itens: D.faq || [], visiveis: 5, marca: 'SOFTPAY' },
    consultor: {
      logo: { arq: 'logo-claro.png', w: 232, h: 84, alt: 'SoftPay' }, titulo: bPrecisa.titulo,
      corpo: partes(bPrecisa, 'p').map((p) => `<p>${p.texto}</p>`).join(''),
      form: {
        titulo: [D.cta_title || '', ''], texto: D.cta_text || '', campos: ['Nome', 'Nome da sua loja', 'WhatsApp com DDD'], botao: 'Chamar no WhatsApp →',
        aviso: 'Seus dados vão só na mensagem do WhatsApp, para a equipe responder. Consulte a <a href="/privacidade.html">Política de Privacidade</a>.',
        acao: 'https://wa.me/5599984304630', link: cadastro('Prefere testar? 7 dias grátis, sem cartão'),
      },
    },
    relacionados: { titulo: 'Continue por aqui', itens: D.related || [], mais: D.mais || [] },
  };
}

// ---------------------------------------------------------------------------------------------------- peças
function formulario(D, F, nivel = 'h2', id = 'h') {
  const ac = { Nome: 'name', 'WhatsApp com DDD': 'tel', 'E-mail': 'email' };
  const tipo = { 'WhatsApp com DDD': 'tel', 'E-mail': 'email' };
  const campo = (c, i) => `<label class="mxh-campo"><span class="mxh-sr">${e(c)}</span><input class="mxh-campo__in" type="${tipo[c] || 'text'}" placeholder="${e(c)}"`
    + `${ac[c] ? ` autocomplete="${ac[c]}"` : ''}${tipo[c] === 'tel' ? ' inputmode="tel"' : ''} data-campo="${i}" id="mxh-${id}-${i}"></label>`;
  const rota = !D.origem;
  return `<form class="mxh-form" action="${e(F.acao)}" method="get"${rota ? ' target="_blank" rel="noopener" data-mxh-form' : ''}>`
    + `<${nivel} class="mxh-form__titulo">${azul(F.titulo[0], F.titulo[1])}</${nivel}><p class="mxh-form__texto">${e(F.texto)}</p>`
    + `<div class="mxh-form__campos">${F.campos.map(campo).join('')}</div>`
    + (rota ? '<input type="hidden" name="text" value="Olá! Quero ver como o SoftPay funciona na minha loja.">' : '')
    + `<button class="mxh-form__botao" type="submit">${e(F.botao)}</button>`
    + (F.link ? `<a class="mxh-form__link" href="${e(F.link.href)}">${e(F.link.texto)}</a>` : '')
    + `<p class="mxh-form__aviso">${F.aviso}</p></form>`;
}

function hero(D, C) {
  const t = C.hero;
  const item = (c) => `<li>${CHECK}${c.href ? `<a href="${e(c.href)}">${e(c.texto)}</a>` : `<span>${e(c.texto)}</span>`}</li>`;
  const marcas = t.prova.img ? quadro(D, t.prova.img, '120px', 'mxh-prova__img')
    : `<span class="mxh-prova__icones">${t.prova.icones.map((i) => `<img src="${D.v(D.base + '/' + i.arq)}" alt="" width="56" height="56" decoding="async">`).join('')}</span>`;
  return `<section class="mxh-hero"${sec(D, 'hero')}><div class="mxh-casca mxh-hero__grade">`
    + `<div class="mxh-hero__texto">${t.trilha}<h1 class="mxh-h1">${azul('', t.h1[0], t.h1[1])}</h1><div class="mxh-hero__intro">${t.intro}</div>`
    + `<ul class="mxh-checks">${t.checks.map(item).join('')}</ul>`
    + `<div class="mxh-prova">${marcas}<p class="mxh-prova__texto">${e(t.prova.texto)}</p></div></div>`
    + `<div class="mxh-hero__form">${formulario(D, C.form, 'h2', 'h')}</div>`
    + `</div></section>`;
}

function integra(D, C) {
  const I = C.integra;
  let fila;
  if (I.esteira.ref) fila = quadro(D, I.esteira, '100vw', 'mxh-esteira__img');
  else {
    const li = (x, copia) => `<li><a href="${e(x.href)}"${copia ? ' tabindex="-1"' : ''}><img src="${D.v(D.base + '/' + x.ico.arq)}" alt="" width="44" height="44" loading="lazy" decoding="async"><span>${e(x.texto)}</span></a></li>`;
    fila = `<div class="mxh-esteira__trilho"><ul class="mxh-esteira__fila">${I.esteira.map((x) => li(x, false)).join('')}</ul>`
      + `<ul class="mxh-esteira__fila mxh-esteira__copia" aria-hidden="true">${I.esteira.map((x) => li(x, true)).join('')}</ul></div>`;
  }
  return `<section class="mxh-integra"${sec(D, 'integra')}><div class="mxh-casca"><h2 class="mxh-integra__titulo mxh-rv">${e(I.titulo)}</h2>${I.corpo}</div>`
    + `<div class="mxh-esteira">${fila}</div></section>`;
}

function video(D, C) {
  const V = C.video;
  const midia = V.img ? quadro(D, V.img, '(min-width: 76rem) 1216px, 100vw', 'mxh-video__img')
    : `<video class="mxh-video__v" muted loop playsinline preload="none" poster="${e(V.poster)}" data-mxh-video aria-label="O SoftPay em uso: venda no caixa, estoque e financeiro"><source src="${e(V.video)}" type="video/mp4"></video>`;
  const num = (i) => String(i + 1).padStart(2, '0');
  const item = (x, i) => (x.html !== undefined
    ? `<li class="mxh-dif__item mxh-rv"><span class="mxh-dif__num">${num(i)}</span><p class="mxh-dif__txt">${x.html}</p></li>`
    : `<li class="mxh-dif__item mxh-rv${String(x.classe || '').split(' ').filter(Boolean).map((c) => ' mxh-dif__item--' + c).join('')}"><span class="mxh-dif__num">${num(i)}</span>`
      + `<p class="mxh-dif__txt"><strong>${e(x.rotulo)}</strong> <span class="mxh-dif__valor">${e(x.valor)}</span></p></li>`);
  return `<section class="mxh-video"${sec(D, 'video')}><div class="mxh-casca">`
    + `<div class="mxh-video__quadro">${midia}</div>`
    + `<div class="mxh-dif"><h2 class="mxh-dif__titulo mxh-rv">${e(V.titulo)}</h2>`
    + (V.intro ? `<div class="mxh-dif__intro mxh-rv">${V.intro}</div>` : '')
    + (V.sub ? `<h3 class="mxh-dif__sub mxh-rv">${e(V.sub)}</h3>` : '')
    + `<ol class="mxh-dif__lista">${V.itens.map(item).join('')}</ol>`
    + (V.nota ? `<p class="mxh-dif__nota">${V.nota}</p>` : '')
    + `<div class="mxh-dif__acao">${pilula(V.botao, 'mxh-pilbotao--claro')}</div></div></div>`
    + `${marca(V.marca)}</section>`;
}

function situacoes(D, C) {
  const S = C.sit, L = C.sol;
  const cartao = (ico) => (c) => `<li class="mxh-cartao mxh-rv"${c.id ? ` id="${c.id}"` : ''}>${ico}<h3 class="mxh-cartao__titulo">${e(c.titulo)}</h3>`
    + (c.texto ? `<p class="mxh-cartao__texto">${c.texto}</p>` : '') + `</li>`;
  const tagSit = S.ordenada ? 'ol' : 'ul';
  const chamada = L.chamada ? `<li class="mxh-cartao mxh-cartao--chamada mxh-rv"><p class="mxh-cartao__titulo">${e(L.chamada.titulo)}</p><p class="mxh-cartao__texto">${e(L.chamada.texto)}</p>${pilula(L.chamada.botao, 'mxh-pilbotao--cheio')}</li>` : '';
  return `<section class="mxh-sit"${sec(D, 'sit')}>${chanfro()}<div class="mxh-casca">`
    + `<div class="mxh-sit__cab mxh-rv"><h2 class="mxh-titulo">${azul(S.titulo[0], S.titulo[1])}</h2>${pilula(S.botao, 'mxh-pilbotao--cheio')}</div>`
    + `<${tagSit} class="mxh-sit__lista">${S.itens.map(cartao(ALERTA)).join('')}</${tagSit}>`
    + (S.nota ? `<aside class="mxh-sit__nota mxh-rv"><h3 class="mxh-sit__nota-titulo">${e(S.nota.titulo)}</h3><p>${S.nota.texto}</p></aside>` : '')
    + `<div class="mxh-sol">${olho(L.olho, 'mxh-rv')}<h2 class="mxh-titulo mxh-titulo--centro mxh-rv">${azul(L.titulo[0], L.titulo[1])}</h2>`
    + `<ul class="mxh-sol__lista">${L.itens.map(cartao(VISTO)).join('')}${chamada}</ul></div>`
    + `</div></section>`;
}

function depoimentos(D, C) {
  const K = C.depo;
  const n = K.itens.length;
  const cartao = (c, i) => `<article class="mxh-depo__cartao mxh-rv" style="--o:${i}">`
    + `<div class="mxh-depo__foto">${quadro(D, c.foto, '96px', 'mxh-depo__img')}</div>`
    + `<h3 class="mxh-depo__nome">${c.href ? `<a href="${e(c.href)}">${e(c.titulo)}</a>` : e(c.titulo)}</h3><p class="mxh-depo__onde">${e(c.texto)}</p>`
    + `<div class="mxh-depo__print">${quadro(D, c.print, '(min-width: 64rem) 300px, 45vw', 'mxh-depo__tela')}</div></article>`;
  // 3 colunas desencontradas, como na referência: o cartão i vai para a coluna i % 3
  const cols = [0, 1, 2].map((k) => K.itens.map((c, i) => [c, i]).filter(([, i]) => i % 3 === k));
  return `<section class="mxh-depo"${sec(D, 'depo')}><div class="mxh-casca">${olho(K.olho, 'mxh-rv')}`
    + `<h2 class="mxh-titulo mxh-titulo--centro mxh-rv">${azul(K.titulo[0], K.titulo[1], K.titulo[2])}</h2>`
    + (K.intro ? `<div class="mxh-depo__intro mxh-rv">${K.intro}</div>` : '')
    + `<div class="mxh-depo__grade" data-n="${n}">${cols.map((c) => `<div class="mxh-depo__col">${c.map(([x, i]) => cartao(x, i)).join('')}</div>`).join('')}</div>`
    + `</div></section>`;
}

function app(D, C) {
  const A = C.app;
  const pil = (p) => `<li class="mxh-app__pil">${CHECK}${p.href ? `<a href="${e(p.href)}"><strong>${e(p.titulo)}</strong>${p.texto ? `<span>${e(p.texto)}</span>` : ''}</a>` : `<span><strong>${e(p.titulo)}</strong></span>`}</li>`;
  const botao = (b) => `<a class="mxh-app__botao${b.zap ? ' mxh-app__botao--zap' : ''}" href="${e(b.href)}"${b.externo ? ' target="_blank" rel="noopener"' : ''}>${b.zap ? ZAP : ''}<span>${e(b.texto)}</span></a>`;
  return `<section class="mxh-app"${sec(D, 'app')}><div class="mxh-casca mxh-app__grade">`
    + `<div class="mxh-app__texto mxh-rv">${olho(A.olho, 'mxh-olho--escuro')}<h2 class="mxh-app__titulo">${e(A.titulo[0])} <span class="mxh-lilas">${e(A.titulo[1])}</span></h2>`
    + `<div class="mxh-app__corpo">${A.corpo}</div><ul class="mxh-app__pilulas">${A.pilulas.map(pil).join('')}</ul>`
    + (A.lojas ? `<div class="mxh-app__lojas">${quadro(D, A.lojas, '190px', 'mxh-app__selos')}</div>` : '')
    + (A.botoes ? `<div class="mxh-app__botoes">${A.botoes.map(botao).join('')}</div>` : '')
    + `<p class="mxh-app__nota">${e(A.nota)}</p></div>`
    + `<div class="mxh-app__arte mxh-rv">${quadro(D, A.img, '(min-width: 64rem) 420px, 60vw', 'mxh-app__img')}</div>`
    + `</div></section>`;
}

function planos(D, C) {
  const P = C.planos;
  const r = P.rotulos || [];
  const sr = (t) => (t ? `<span class="mxh-sr">${e(t)}: </span>` : '');
  // "R$ 69/mês" fica inteiro num nó só: o portão de texto do vestir troca tag por espaço
  const preco = (p) => (p.ciclo ? `${e(p.preco)}<span class="mxh-plano__ciclo">${e(p.ciclo)}</span>` : `${sr(r[1])}${e(p.preco)}`);
  const item = (p, i) => `<li class="mxh-plano${p.destaque ? ' is-destaque' : ''}"${D.origem ? '' : ` data-plano="${i}"`}>`
    + (p.destaque ? `<p class="mxh-plano__aba">${e(P.selo)}</p>` : '')
    + `<h3 class="mxh-plano__nome">${sr(r[0])}${e(p.nome)}</h3><p class="mxh-plano__preco">${preco(p)}</p>`
    + `<p class="mxh-plano__desc">${sr(r[2])}${e(p.desc)}</p>`
    + `<ul class="mxh-plano__lista">${p.lista.map((x) => `<li class="${x.sim ? 'is-sim' : 'is-nao'}">${x.sim ? CHECK : XIS}<span>${x.sim ? '' : '<span class="mxh-sr">Não inclui: </span>'}${e(x.texto)}</span></li>`).join('')}</ul>`
    + `<a class="mxh-plano__botao" href="${e(p.botao.href)}">${e(p.botao.texto)}</a></li>`;
  // celular (página vestida): os 3 planos lado a lado e a lista do plano tocado numa faixa da largura toda, logo
  // abaixo; o molde.js copia a lista do escolhido para a faixa (sem JS, ela fica no cartão)
  const faixa = D.origem ? '' : `<div class="mxh-planos__faixa"><p class="mxh-planos__faixa-nome" aria-live="polite"></p><ul class="mxh-planos__faixa-lista"></ul></div>`;
  const nf = P.nf ? `<div class="mxh-nf mxh-rv"><div class="mxh-nf__texto"><h3 class="mxh-nf__nome">${sr(r[0])}${e(P.nf.nome)}</h3><p class="mxh-nf__desc">${sr(r[2])}${e(P.nf.desc)}</p></div>`
    + `<p class="mxh-nf__preco">${sr(r[1])}${e(P.nf.preco)}</p><a class="mxh-plano__botao" href="${e(P.nf.botao.href)}">${e(P.nf.botao.texto)}</a></div>` : '';
  return `<section class="mxh-planos" id="mxh-planos"${sec(D, 'planos')}><div class="mxh-casca">${olho(P.olho, 'mxh-rv')}`
    + `<h2 class="mxh-titulo mxh-titulo--centro mxh-rv">${azul(P.titulo[0], P.titulo[1])}</h2>`
    + (P.intro ? `<div class="mxh-planos__intro mxh-rv">${P.intro}</div>` : '')
    + `<ul class="mxh-planos__grade">${P.itens.map(item).join('')}</ul>${faixa}${nf}`
    + (P.rodape ? `<div class="mxh-planos__rodape">${P.rodape}</div>` : '')
    + `</div></section>`;
}

function faq(D, C) {
  const F = C.faq;
  const n = F.itens.length;
  const resposta = (a) => (Array.isArray(a) ? a.map((p) => `<p>${p}</p>`).join('') : `<p>${a}</p>`);
  const item = ([q, a], i) => `<details class="mxh-faq__item${i >= F.visiveis ? ' mxh-faq__extra' : ''}" name="mxh-faq"><summary><h3 class="mxh-faq__q">${e(q)}</h3>${SETA_BAIXO}</summary><div class="mxh-faq__a">${resposta(a)}</div></details>`;
  const extra = n - F.visiveis;
  return `<section class="mxh-faq" id="perguntas"${sec(D, 'faq')}>${chanfro('mxh-chanfro--claro')}`
    + `<div class="mxh-casca mxh-faq__casca">${olho(F.olho, 'mxh-olho--escuro')}<h2 class="mxh-faq__titulo">${e(F.titulo)}</h2>`
    + `<div class="mxh-faq__lista">${F.itens.map(item).join('')}</div>`
    + (extra > 0 ? `<div class="mxh-faq__mais"><button type="button" class="mxh-pilbotao mxh-pilbotao--claro mxh-faq__botao" data-mxh-faq-mais aria-expanded="false">Ver mais perguntas (+${extra})</button></div>` : '')
    + `</div>${marca(F.marca, 'mxh-marca--faq')}</section>`;
}

function consultor(D, C) {
  const K = C.consultor;
  const form = K.form || C.form;
  const logo = K.logo.ref ? quadro(D, K.logo, '200px', 'mxh-consultor__logo')
    : `<img class="mxh-consultor__logo" src="${D.v(D.base + '/' + K.logo.arq)}" alt="${e(K.logo.alt)}" width="${K.logo.w}" height="${K.logo.h}" loading="lazy" decoding="async">`;
  return `<section class="mxh-consultor"${sec(D, 'consultor')}><div class="mxh-casca"><div class="mxh-consultor__cartao">`
    + `<div class="mxh-consultor__texto mxh-rv">${logo}<h2 class="mxh-consultor__titulo">${e(K.titulo)}</h2><div class="mxh-consultor__corpo">${K.corpo}</div></div>`
    + `<div class="mxh-consultor__form">${formulario(D, form, D.origem ? 'h2' : 'h3', 'c')}</div>`
    + `</div></div></section>`;
}

function relacionados(R) {
  if (!R) return '';
  return `<section class="mxh-rel-sec"><div class="mxh-casca"><nav class="mxh-rel" aria-label="${e(R.titulo)}"><h2 class="mxh-rel__titulo">${e(R.titulo)}</h2>`
    + `<ul class="mxh-rel__lista">${R.itens.map((x) => `<li><a href="${e(x[1])}"><strong>${e(x[0])}</strong><span>${e(x[2] || '')}</span>${SETA}</a></li>`).join('')}</ul>`
    + (R.mais.length ? `<h2 class="mxh-rel__titulo">Veja também</h2><ul class="mxh-rel__lista">${R.mais.map((m) => `<li><a href="${e(m[1])}"><strong>${e(m[0])}</strong>${SETA}</a></li>`).join('')}</ul>` : '')
    + `</nav></div></section>`;
}

export function desenho(D) {
  const C = D.origem ? daOrigem(D) : daRota(D);
  return `<div class="mxh${D.origem ? ' mxh--origem' : ''}">`
    + hero(D, C) + integra(D, C) + video(D, C) + situacoes(D, C) + depoimentos(D, C) + app(D, C) + planos(D, C) + faq(D, C)
    + consultor(D, C) + relacionados(C.relacionados)
    + '</div>';
}

// a prova da casa (SITE-VISIONX/gerador/provar-molde.mjs) chama render({...origem, modo: 'origem'})
export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem', links: ctx.links || { app: '#', cadastro: '#', wpp: '#' }, v: ctx.v || ((x) => x), base: ctx.base || '.' });
}
