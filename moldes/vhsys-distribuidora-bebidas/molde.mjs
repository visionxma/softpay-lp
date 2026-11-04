// Molde vhsys-distribuidora-bebidas: o corpo da página "sistema ERP para distribuidora de bebidas" do vhsys
// (vhsys.com.br/segmentos/sistema-erp-para-distribuidora-de-bebidas/, feita em Elementor), clonado pela captura
// renderizada em 03/11/2026 (referência enviada pelo Raykkony). As mesmas peças montam as duas versões:
//   modo origem → textos e recortes da própria referência (origem.json + ativos/): é o que a prova compara com a captura;
//   modo rota   → o conteúdo de tools/conteudo/segmentos/distribuidora.json, sem tirar nenhum texto de busca.
// Ordem da referência (o idx é a ordem das âncoras de ferramentas/secoes.mjs; 15 seções de conteúdo):
//   0 hero azul-noite: texto à esquerda | foto com cartões flutuantes à direita; embaixo, fileira de pílulas;
//   1 cabeçalho centrado (selo, título, texto) + 2 cartões brancos em linha (texto com lista de checagem | foto),
//     o segundo invertido;
//   2 cartão branco: título centrado com destaque verde, fileira de abas, ladrilhos (ícone ao lado do texto);
//   3 painel azul-noite: título e texto brancos + 6 cartões brancos (ícone escuro, título, texto) em 3 × 2;
//   4 cartão branco: selo, título, texto + 3 cartões azul-claros com ícone redondo (carrossel com setas);
//   5 faixa "Planos e preços" (na captura a tabela não carregou: só o título);
//   6 cartão azul-noite: título e botão | vídeo; 7 cartão azul-noite: selo, título, lista e botão | aparelhos;
//   8 Hub (venda em vários canais), 9 suporte com fotos e notas, 10 cartão: texto | grade 3 × 3 de integrações,
//   11 números do vhsys, 12 depoimentos, 13 blog, 14 FAQ (título e apoio | sanfona).
// Inventário do que é de gente/empresa REAL da origem e como saiu (BRIEFING, passo 4):
//   - depoimentos (Ramilto Junior/M. Decor, Guilherme Ratke/Tempero do Jota, Alexandre Luiz/Primatec, Edgar Junior/
//     A Exclusiva Móveis, Camila Werneck/JK Motors) → seção 12 OMITIDA: o SoftPay não tem depoimento de distribuidora;
//   - números do vhsys (+36 milhões de notas, +90 bilhões, +100 integrações) → seção 11 OMITIDA, nada inventado;
//   - "Equipe premiada" e as notas Google 4,4 / Reclame Aqui 8,6 / Capterra 5,0, fotos de atendentes → seção 9
//     OMITIDA; o contato verdadeiro do SoftPay (WhatsApp) vai no apoio do FAQ, no lugar do 0800 do vhsys;
//   - "Controle de lotes e validade" (cartão 2 da seção 1) → NÃO vira recurso do SoftPay: a rota diz que validade e
//     lote não estão confirmados; o cartão leva "O que o SoftPay não faz numa distribuidora";
//   - vhsys Hub (loja virtual, e-commerce) → seção 8 OMITIDA; Store (9 categorias de integração) → a grade leva as
//     páginas relacionadas do SoftPay; blog do vhsys → seção 13 OMITIDA (os relacionados já estão na 10);
//   - vídeo "O segredo das distribuidoras que crescem" (pessoa do vhsys) → print REAL do PDV do SoftPay;
//   - foto do homem no bar com cartões "R$ 2.480,00" e "Cerveja Lager +12 unidades" → foto de distribuidora do
//     acervo da casa + chamadas com frases da rota (sem valor inventado); a etiqueta de preços varejo/atacado da
//     Coca-Cola → recorte do print real do Estoque do SoftPay (Brahma Chopp 350 ml, custo e varejo da demonstração);
//   - "Teste grátis", 0800 e "Planos e preços" → 7 dias grátis sem cartão, WhatsApp, tabela de planos da rota.
// O CSS (molde.css) reproduz a composição da referência em `.mx-vhsys-distribuidora-bebidas`; a roupa do SoftPay e as
// regras da casa que vencem a referência (hero de tela inteira, celular lado a lado sem trilho, planos 3 lado a lado
// com a faixa do tocado, FAQ 5 + ver mais) moram em `.page-molde.mx-vhsys-distribuidora-bebidas`.
import { readFileSync } from 'node:fs';

const O = JSON.parse(readFileSync(new URL('./origem.json', import.meta.url), 'utf8'));

// índices das seções de conteúdo na captura (secoes-<L>.json, refeitos por ferramentas/secoes.mjs)
const IDX = { hero: 0, tudo: 1, recursos: 2, gestao: 3, pdv: 4, planos: 5, pratica: 6, palma: 7, canais: 8, suporte: 9, conecte: 10, milhao: 11, opiniao: 12, blog: 13, faq: 14 };

export const meta = {
  id: 'vhsys-distribuidora-bebidas',
  referencia: 'https://www.vhsys.com.br/segmentos/sistema-erp-para-distribuidora-de-bebidas/',
  captura: '~/.jarvis/visionx/clones/capturas/vhsys-distribuidora-bebidas',
  // faixa da Black Friday + menu do vhsys (dentro da 1ª seção da captura); na página vestida é o lugar do chassi
  topoDoChassi: { 1440: 0, 390: 0 },
  secoes: [
    { idx: IDX.hero, tipo: 'hero azul-noite: texto | foto com cartões + pílulas' },
    { idx: IDX.tudo, tipo: 'cabeçalho centrado + 2 cartões em linha (lista | foto)' },
    { idx: IDX.recursos, tipo: 'cartão: título, abas e ladrilhos com ícone' },
    { idx: IDX.gestao, tipo: 'painel azul-noite com 6 cartões brancos' },
    { idx: IDX.pdv, tipo: 'cartão: selo, título e 3 cartões com ícone redondo' },
    { idx: IDX.planos, tipo: 'planos e preços' },
    { idx: IDX.pratica, tipo: 'cartão azul-noite: título e botão | mídia' },
    { idx: IDX.palma, tipo: 'cartão azul-noite: lista e botão | aparelhos' },
    { idx: IDX.canais, tipo: 'vhsys Hub (loja virtual)', omitida: 'produto do vhsys (loja virtual e e-commerce) sem equivalente confirmado no conteúdo da rota' },
    { idx: IDX.suporte, tipo: 'suporte com fotos e notas', omitida: 'fotos de atendentes do vhsys, "Equipe premiada" e notas Google/Reclame Aqui/Capterra são do vhsys; o contato verdadeiro do SoftPay foi para o apoio do FAQ' },
    { idx: IDX.conecte, tipo: 'cartão: texto | grade de ladrilhos' },
    { idx: IDX.milhao, tipo: 'números do vhsys', omitida: 'números do vhsys (notas emitidas, bilhões movimentados, integrações); o SoftPay não publica número equivalente' },
    { idx: IDX.opiniao, tipo: 'depoimentos', omitida: 'depoimentos de clientes reais do vhsys; o SoftPay não tem depoimento de distribuidora' },
    { idx: IDX.blog, tipo: 'blog', omitida: 'artigos do blog do vhsys; os relacionados do SoftPay estão na grade da seção 10' },
    { idx: IDX.faq, tipo: 'FAQ: título e apoio | sanfona' },
  ],
};

const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sec = (D, k) => (D.origem ? ` data-mx-secao="${IDX[k]}"` : '');

// ícones (traço 2, 24 × 24): desenhados para o molde, no lugar dos ícones do vhsys
const I = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICO = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m7 12.4 3.2 3.1L17 8.8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  nao: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m8.5 8.5 7 7m0-7-7 7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
  barras: I('<path d="M4 6v12M8 6v12M11 6v12M15 6v12M18 6v12M20 6v12"/>'),
  caixa: I('<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M8 9V5h8v4M8 14h8"/>'),
  nota: I('<path d="M6 3h9l3 3v15H6z"/><path d="M9 9h6M9 13h6M9 17h4"/>'),
  troca: I('<path d="M4 9h13l-3-3M20 15H7l3 3"/>'),
  pedido: I('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="m9 12 2 2 4-4"/>'),
  etiqueta: I('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>'),
  lapis: I('<path d="m4 20 1-5L16 4l4 4L9 19z"/><path d="M14 6l4 4"/>'),
  relogio: I('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>'),
  escudo: I('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>'),
  cubo: I('<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>'),
  grafico: I('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>'),
  sobe: I('<path d="M4 20h16M7 16v-4M11 16V9M15 16v-6M19 16V5"/>'),
  agenda: I('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>'),
  usuario: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
  robo: I('<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>'),
  fone: I('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/>'),
  moeda: I('<circle cx="12" cy="12" r="9"/><path d="M15 9h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9M12 6v2M12 16v2"/>'),
  calc: I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>'),
  caminhao: I('<path d="M2 6h11v10H2zM13 10h5l3 3v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  tarefa: I('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8 12 3 3 5-6"/>'),
  credito: I('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="M12 8v8M9.5 10.5h4a1.5 1.5 0 0 1 0 3h-3"/>'),
  codigo: I('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>'),
  zap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A9.9 9.9 0 1 0 12 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.1zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3z"/></svg>',
  mais: '<svg class="mxv-faq__ico" viewBox="0 0 24 24" aria-hidden="true"><path class="mxv-faq__v" d="M12 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  esq: I('<path d="m15 6-6 6 6 6"/>'),
  dir: I('<path d="m9 6 6 6-6 6"/>'),
  pilula: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="m7.5 12.3 3 2.9 6-6.2" fill="none" stroke="var(--v-noite)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
};

// imagem: na origem é o recorte da captura (um por largura); na rota, o arquivo publicado com versão e srcset menor
function quadro(D, img, sizes = '100vw', classe = '') {
  if (!img) return '';
  if (img.ref) {
    return `<picture class="mxv-quadro ${classe}"><source media="(max-width: 600px)" srcset="../ativos/${img.ref}-390.png"><img src="../ativos/${img.ref}-1440.png" alt=""></picture>`;
  }
  const src = D.v(D.base + '/' + img.arq);
  const menor = img.menor ? ` srcset="${D.v(D.base + '/' + img.menor)} ${img.menorW || 600}w, ${src} ${img.w}w" sizes="${sizes}"` : '';
  return `<picture class="mxv-quadro ${classe}"><img src="${src}"${menor} alt="${e(img.alt)}" width="${img.w}" height="${img.h}" loading="${img.cedo ? 'eager' : 'lazy'}"${img.cedo ? ' fetchpriority="high"' : ''} decoding="async"></picture>`;
}
const botao = (b, extra = '') => `<a class="mxv-botao mxv-botao--${b.tipo || 'cheio'} ${extra}" href="${e(b.href || '#')}"${b.externo ? ' target="_blank" rel="noopener"' : ''}>${b.icone || ''}<span>${e(b.texto)}</span></a>`;
const selo = (t) => (t ? `<p class="mxv-selo"><span class="mxv-selo__ico" aria-hidden="true"></span><span>${t}</span></p>` : '');
const checks = (itens, nao = false) => `<ul class="mxv-checks${nao ? ' mxv-checks--nao' : ''}">${itens.map((t) => `<li>${nao ? ICO.nao : ICO.check}<span>${t}</span></li>`).join('')}</ul>`;

// ---------------------------------------------------------------------------------------- conteúdo das duas versões
function daOrigem() {
  const ref = (r) => ({ ref: r });
  const cta = (t) => ({ texto: t, href: '#', tipo: 'cheio' });
  const ICR = [ICO.barras, ICO.caixa, ICO.nota, ICO.troca, ICO.pedido, ICO.etiqueta, ICO.lapis];
  const ICG = [ICO.relogio, ICO.escudo, ICO.cubo, ICO.grafico, ICO.sobe, ICO.agenda];
  const ICC = [ICO.usuario, ICO.robo, ICO.fone, ICO.moeda, ICO.calc, ICO.caminhao, ICO.tarefa, ICO.credito, ICO.codigo];
  return {
    hero: {
      trilha: '', h1: `${e(O.hero.h1a)} <span class="mxv-verde">${e(O.hero.h1b)}</span>`, intro: `<p>${O.hero.intro}</p>`,
      botoes: [cta(O.hero.botao)], nota: O.hero.nota, img: ref('hero'), chamadas: [],
      pilulas: O.hero.pilulas.map((t) => ({ texto: t })),
    },
    tudo: {
      selo: e(O.tudo.selo), titulo: e(O.tudo.titulo), corpo: `<p>${e(O.tudo.texto)}</p>`,
      cartoes: O.tudo.cartoes.map((c) => ({ titulo: c.titulo, corpo: checks(c.itens), img: ref(c.ref) })),
    },
    recursos: {
      titulo: `${e(O.recursos.titulo)} <span class="mxv-verde">${e(O.recursos.destaque)}</span>`,
      abas: O.recursos.abas.map((t) => ({ texto: t })),
      itens: O.recursos.itens.map((t, i) => ({ titulo: '', texto: t, ico: ICR[i], cats: '' })),
    },
    gestao: { titulo: e(O.gestao.titulo), corpo: `<p>${O.gestao.texto}</p>`, itens: O.gestao.itens.map(([t, p], i) => ({ titulo: t, texto: p, ico: ICG[i] })) },
    pdv: { selo: e(O.pdv.selo), titulo: O.pdv.titulo, corpo: `<p>${O.pdv.texto}</p>`, itens: O.pdv.itens.map(([t, p], i) => ({ titulo: t, texto: e(p), ico: [ICO.caixa, ICO.nota, ICO.cubo][i] })), setas: true, nota: null },
    planos: { titulo: O.planos.titulo, itens: [], rotulos: [], faixa: null, sub: '' },
    pratica: { titulo: O.pratica.titulo, corpo: '', botoes: [cta(O.pratica.botao)], img: ref(O.pratica.ref) },
    palma: { selo: e(O.palma.selo), titulo: e(O.palma.titulo), corpo: `<p>${e(O.palma.texto)}</p>` + checks(O.palma.itens), botoes: [cta(O.palma.botao)], img: ref(O.palma.ref) },
    conecte: { selo: e(O.conecte.selo), titulo: e(O.conecte.titulo), corpo: `<p>${O.conecte.texto}</p>`, itens: O.conecte.itens.map((t, i) => ({ titulo: t, texto: '', href: '', ico: ICC[i] })) },
    faq: { titulo: O.faq.titulo, apoio: O.faq.apoio, itens: O.faq.itens, visiveis: 99 },
  };
}

// imagens da rota (fotos de comércio de verdade do acervo do SoftPay e prints reais do sistema, em publicar/)
const FOTO = (n, alt, w = 940, h = 666) => ({ arq: `foto-${n}.webp`, menor: `foto-${n}-600.webp`, menorW: 600, w, h, alt });

const partes = (b, tipo) => (b ? b.partes.filter((p) => p.tipo === tipo) : []);
const P = (b) => partes(b, 'p').map((p) => `<p>${p.texto}</p>`).join('');
const nota = (n) => (n ? `<aside class="mxv-nota"><p class="mxv-nota__titulo">${e(n.titulo)}</p><p>${n.texto}</p></aside>` : '');

function daRota(D) {
  const bloco = (id) => (D.blocks || []).find((b) => b.id === id);
  const bVol = bloco('volume-alto-deixa-pouco-espaco-para-erro'), bProb = bloco('os-problemas-que-aparecem-sempre');
  const bMuda = bloco('o-que-muda-com-o-softpay'), bTipos = bloco('bebidas-alimentos-ou-produtos-em-geral');
  const bNao = bloco('o-que-o-softpay-nao-faz-numa-distribuidora'), bPed = bloco('um-pedido-de-revendedor-do-comeco-ao-fim');
  const bResp = bloco('perguntas-que-voce-passa-a-conseguir-responder'), bPlano = bloco('qual-plano-faz-sentido');
  const cadastro = { texto: 'Testar 7 dias grátis', href: D.links.cadastro, tipo: 'cheio' };
  const zap = { texto: 'WhatsApp', href: D.links.wpp, tipo: 'contorno', externo: true, icone: ICO.zap };

  // h1 inteiro num <h1>, com a última palavra no destaque verde (o portão compara o texto sem as tags)
  const h1 = String(D.h1 || '');
  const corte = h1.lastIndexOf(' ');
  const h1Html = corte > 0 ? `${e(h1.slice(0, corte))} <span class="mxv-verde">${e(h1.slice(corte + 1))}</span>` : e(h1);

  // o que muda com o SoftPay → ladrilhos com ícone; as abas acendem os ladrilhos do assunto (nenhum some)
  const h3s = [], ps = [];
  for (const p of (bMuda ? bMuda.partes : [])) (p.tipo === 'h3' ? h3s : ps).push(p.texto);
  const ICR = [ICO.cubo, ICO.etiqueta, ICO.nota, ICO.pedido, ICO.usuario, ICO.grafico, ICO.fone, ICO.zap];
  const CATS = ['estoque', 'vendas', 'fiscal', 'fiscal estoque', 'vendas clientes', 'estoque', 'equipe', 'estoque equipe'];
  const ultima = (t) => { const i = String(t).lastIndexOf(' '); return i > 0 ? `${e(t.slice(0, i))} <span class="mxv-verde">${e(t.slice(i + 1))}</span>` : e(t); };

  // bebidas, alimentos ou produtos em geral → os 3 cartões com ícone redondo
  const tH3 = [], tP = [];
  let tIntro = '';
  for (const p of (bTipos ? bTipos.partes : [])) {
    if (p.tipo === 'h3') tH3.push(p.texto);
    else if (p.tipo === 'p') { if (tH3.length) tP.push(p.texto); else tIntro += `<p>${p.texto}</p>`; }
  }

  // um pedido de revendedor → passos numerados no cartão escuro
  const pedOl = partes(bPed, 'ol')[0];
  const pedPs = partes(bPed, 'p');
  const pedCorpo = (pedPs[0] ? `<p>${pedPs[0].texto}</p>` : '')
    + (pedOl ? `<ol class="mxv-passos">${pedOl.itens.map((t) => `<li>${t}</li>`).join('')}</ol>` : '')
    + pedPs.slice(1).map((p) => `<p>${p.texto}</p>`).join('') + nota(partes(bPed, 'nota')[0]);

  const tab = partes(bPlano, 'tabela')[0] || { cabecalho: [], linhas: [] };
  // o recomendado (ERP Completo, "o plano da distribuidora") no MEIO; o Nota Fiscal (sem PDV nem estoque) vira faixa
  const linha = (nome) => tab.linhas.find((l) => l[0] === nome);
  const grade = ['Comércio', 'ERP Completo', 'Loja'].map(linha).filter(Boolean);
  const fora = tab.linhas.filter((l) => !grade.includes(l));

  const RELI = { '/solucoes/nfe/': ICO.nota, '/solucoes/sistema-de-estoque/': ICO.cubo, '/solucoes/multiplas-lojas/': ICO.caixa, '/solucoes/bot-whatsapp/': ICO.zap, '/solucoes/controle-de-clientes/': ICO.usuario };

  return {
    hero: {
      trilha: '<nav class="mxv-trilha" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span>'
        + (D.breadcrumbs || []).map((b) => (b[1] ? `<a href="${e(b[1])}">${e(b[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${e(b[0])}</span>`)).join('') + '</nav>',
      h1: h1Html, intro: `<p>${e(D.intro)}</p>`, botoes: [cadastro, zap],
      nota: 'Cadastro em minutos: <strong>7 dias grátis</strong>, sem cartão de crédito.',
      img: { ...FOTO('distribuidora', (D.figura && D.figura[1]) || 'Funcionário de distribuidora de bebidas conferindo o estoque pelo celular entre engradados'), cedo: true },
      chamadas: [
        { titulo: 'Venda no atacado', texto: 'preço já no cadastro', ico: ICO.etiqueta },
        { titulo: 'Estoque atualizado', texto: 'baixa na hora da venda', ico: ICO.cubo },
      ],
      pilulas: (D.related || []).map((r) => ({ texto: r[0], href: r[1] })),
    },
    tudo: {
      selo: 'SoftPay', titulo: e(bVol ? bVol.titulo : ''), corpo: P(bVol),
      cartoes: [
        { titulo: bProb ? bProb.titulo : '', corpo: checks(partes(bProb, 'ul')[0]?.itens || []),
          img: FOTO('loja-de-bebidas', 'Comerciante tirando uma garrafa do engradado vermelho ao lado das geladeiras de bebidas'),
          etiqueta: { arq: 'cartao-brahma.webp', w: 324, h: 170, alt: 'Cartão do produto Brahma Chopp 350 ml no Estoque do SoftPay: 88 unidades, custo R$ 2,00 e varejo R$ 5,00' } },
        { titulo: bNao ? bNao.titulo : '', corpo: P(bNao) + checks(partes(bNao, 'ul')[0]?.itens || [], true),
          img: FOTO('comerciante', 'Dono de depósito de bebidas entre as prateleiras e as geladeiras da loja', 1000, 760) },
      ],
    },
    recursos: {
      titulo: ultima(bMuda ? bMuda.titulo : ''),
      abas: [{ texto: 'Tudo', cat: '' }, { texto: 'Estoque', cat: 'estoque' }, { texto: 'Vendas', cat: 'vendas' }, { texto: 'Nota fiscal', cat: 'fiscal' }, { texto: 'Clientes', cat: 'clientes' }, { texto: 'Equipe', cat: 'equipe' }],
      itens: h3s.map((t, i) => ({ titulo: t, texto: ps[i] || '', ico: ICR[i] || ICO.check, cats: CATS[i] || '' })),
    },
    gestao: {
      titulo: e(bResp ? bResp.titulo : ''), corpo: '<p>Sem abrir planilha nem esperar o inventário do fim do mês.</p>',
      itens: (partes(bResp, 'ul')[0]?.itens || []).map((t, i) => ({ titulo: '', texto: t, ico: [ICO.cubo, ICO.moeda, ICO.usuario, ICO.grafico, ICO.calc, ICO.etiqueta][i] || ICO.check })),
    },
    pdv: {
      selo: 'Por tipo de distribuidora', titulo: e(bTipos ? bTipos.titulo : ''), corpo: tIntro,
      itens: tH3.map((t, i) => ({ titulo: t, texto: tP[i] || '', ico: [ICO.caixa, ICO.cubo, ICO.etiqueta][i] || ICO.check })),
      setas: false, nota: partes(bTipos, 'nota')[0] || null,
    },
    planos: {
      titulo: bPlano ? bPlano.titulo : '', rotulos: tab.cabecalho,
      itens: grade.map((l) => ({ nome: l[0], preco: l[1], desc: l[2], destaque: l[0] === 'ERP Completo' })),
      faixa: fora.map((l) => ({ nome: l[0], preco: l[1], desc: l[2] })), sub: P(bPlano), botao: cadastro,
    },
    pratica: {
      titulo: e(bPed ? bPed.titulo : ''), corpo: pedCorpo, botoes: [cadastro],
      img: { arq: 'tela-pdv.webp', menor: 'tela-pdv-800.webp', menorW: 800, w: 1400, h: 845, alt: 'Tela do PDV do SoftPay: busca de produto, grade de itens e o carrinho com o total da venda' },
    },
    palma: {
      selo: '7 dias grátis', titulo: e(D.cta_title), corpo: `<p>${e(D.cta_text)}</p>`
        + checks(['Acesso pelo navegador, no computador ou no celular', 'Sem cartão de crédito para começar o teste', 'Suporte de gente pelo WhatsApp']),
      botoes: [cadastro, zap],
      img: { arq: 'aparelhos.webp', menor: 'aparelhos-800.webp', menorW: 800, w: 1448, h: 1086, alt: 'Monitor com o caixa do SoftPay aberto e celular com o carrinho da venda' },
    },
    conecte: {
      selo: 'SoftPay', titulo: 'Continue por aqui', corpo: '<p>Cada recurso da distribuidora tem uma página com o detalhe de como funciona no SoftPay.</p>',
      itens: (D.related || []).map((r) => ({ titulo: r[0], texto: r[2] || '', href: r[1], ico: RELI[r[1]] || ICO.caixa })),
      mais: D.mais || [],
    },
    faq: {
      titulo: 'Perguntas frequentes', itens: D.faq || [], visiveis: 5,
      apoio: `Ainda ficou alguma dúvida? Fale com a gente pelo <a href="${e(D.links.wpp)}" target="_blank" rel="noopener">WhatsApp</a>.`,
    },
  };
}

// ---------------------------------------------------------------------------------------------------- peças
function hero(D, C) {
  const t = C.hero;
  const chamada = (c, i) => `<div class="mxv-chamada mxv-chamada--${i + 1}" aria-hidden="true"><span class="mxv-chamada__ico">${c.ico}</span><span class="mxv-chamada__titulo">${e(c.titulo)}</span><span class="mxv-chamada__texto">${e(c.texto)}</span></div>`;
  const pilula = (p) => (p.href ? `<li><a class="mxv-pilula" href="${e(p.href)}">${ICO.pilula}<span>${e(p.texto)}</span></a></li>` : `<li><span class="mxv-pilula">${ICO.pilula}<span>${e(p.texto)}</span></span></li>`);
  return `<section class="mxv-hero"${sec(D, 'hero')}><div class="mxv-casca mxv-hero__grade">`
    + `<div class="mxv-hero__texto">${t.trilha}<h1 class="mxv-h1">${t.h1}</h1><div class="mxv-hero__intro">${t.intro}</div>`
    + `<div class="mxv-hero__botoes">${t.botoes.map((b) => botao(b)).join('')}</div><p class="mxv-hero__nota">${t.nota}</p></div>`
    + `<div class="mxv-hero__arte">${quadro(D, t.img, '(min-width: 64rem) and (min-aspect-ratio: 6/5) 545px, 92vw', 'mxv-hero__img')}${t.chamadas.map(chamada).join('')}</div>`
    + `</div><div class="mxv-casca"><ul class="mxv-pilulas">${t.pilulas.map(pilula).join('')}</ul></div></section>`;
}

function tudo(D, C) {
  const K = C.tudo;
  const cartao = (c, i) => `<article class="mxv-cartao mxv-linha${i % 2 ? ' mxv-linha--inversa' : ''} mxv-rv">`
    + `<div class="mxv-linha__texto"><h3 class="mxv-linha__titulo">${e(c.titulo)}</h3><div class="mxv-linha__corpo">${c.corpo}</div></div>`
    + `<div class="mxv-linha__arte">${quadro(D, c.img, '(min-width: 64rem) 480px, 92vw', 'mxv-linha__img')}`
    + (c.etiqueta ? `<img class="mxv-etiqueta" src="${D.v(D.base + '/' + c.etiqueta.arq)}" alt="${e(c.etiqueta.alt)}" width="${c.etiqueta.w}" height="${c.etiqueta.h}" loading="lazy" decoding="async">` : '')
    + `</div></article>`;
  return `<section class="mxv-tudo"${sec(D, 'tudo')}><div class="mxv-casca">`
    + `<div class="mxv-cab mxv-rv">${selo(K.selo)}<h2 class="mxv-titulo">${K.titulo}</h2><div class="mxv-cab__corpo">${K.corpo}</div></div>`
    + `<div class="mxv-tudo__cartoes">${K.cartoes.map(cartao).join('')}</div></div></section>`;
}

function recursos(D, C) {
  const K = C.recursos;
  const aba = (a, i) => `<li><button type="button" class="mxv-aba${i === 0 ? ' is-ativa' : ''}"${a.cat !== undefined ? ` data-mxv-aba="${e(a.cat)}"` : ''} aria-pressed="${i === 0 ? 'true' : 'false'}">${ICO.check}<span>${e(a.texto)}</span></button></li>`;
  const item = (c) => `<li class="mxv-ladrilho mxv-rv"${c.cats ? ` data-mxv-cat="${e(c.cats)}"` : ''}><span class="mxv-ladrilho__ico">${c.ico}</span><div class="mxv-ladrilho__texto">`
    + (c.titulo ? `<h3 class="mxv-ladrilho__titulo">${e(c.titulo)}</h3>` : '') + `<p>${c.texto}</p></div></li>`;
  return `<section class="mxv-recursos"${sec(D, 'recursos')}><div class="mxv-casca"><div class="mxv-cartao mxv-recursos__cartao">`
    + `<h2 class="mxv-titulo mxv-titulo--centro">${K.titulo}</h2><ul class="mxv-abas">${K.abas.map(aba).join('')}</ul>`
    + `<ul class="mxv-ladrilhos">${K.itens.map(item).join('')}</ul></div></div></section>`;
}

function gestao(D, C) {
  const K = C.gestao;
  const item = (c) => `<li class="mxv-beneficio mxv-rv"><span class="mxv-beneficio__ico">${c.ico}</span>`
    + (c.titulo ? `<h3 class="mxv-beneficio__titulo">${e(c.titulo)}</h3><p>${c.texto}</p>` : `<p class="mxv-beneficio__titulo">${c.texto}</p>`) + `</li>`;
  return `<section class="mxv-gestao"${sec(D, 'gestao')}><div class="mxv-casca"><div class="mxv-painel">`
    + `<div class="mxv-painel__cab mxv-rv"><h2 class="mxv-titulo mxv-titulo--centro">${K.titulo}</h2><div class="mxv-painel__corpo">${K.corpo}</div></div>`
    + `<ul class="mxv-beneficios">${K.itens.map(item).join('')}</ul></div></div></section>`;
}

function pdv(D, C) {
  const K = C.pdv;
  const item = (c) => `<li class="mxv-modulo mxv-rv"><span class="mxv-modulo__ico">${c.ico}</span><h3 class="mxv-modulo__titulo">${e(c.titulo)}</h3><p>${c.texto}</p></li>`;
  return `<section class="mxv-pdv"${sec(D, 'pdv')}><div class="mxv-casca"><div class="mxv-cartao mxv-pdv__cartao">`
    + `<div class="mxv-cab mxv-rv">${selo(K.selo)}<h2 class="mxv-titulo">${K.titulo}</h2><div class="mxv-cab__corpo">${K.corpo}</div></div>`
    + `<ul class="mxv-modulos">${K.itens.map(item).join('')}</ul>`
    + (K.setas ? `<div class="mxv-setas" aria-hidden="true"><span class="mxv-seta">${ICO.esq}</span><span class="mxv-seta mxv-seta--ativa">${ICO.dir}</span></div>` : '')
    + (K.nota ? nota(K.nota) : '') + `</div></div></section>`;
}

function planos(D, C) {
  const K = C.planos;
  const r = K.rotulos || [];
  const sr = (t) => (t ? `<span class="mxv-sr">${e(t)}: </span>` : '');
  // "R$ 69/mês" fica inteiro num nó só: o portão de texto do vestir troca tag por espaço
  const plano = (p, i) => `<li class="mxv-plano${p.destaque ? ' is-destaque' : ''}" data-plano="${i}">`
    + (p.destaque ? `<p class="mxv-plano__selo">Mais escolhido</p>` : '')
    + `<p class="mxv-plano__nome">${sr(r[0])}${e(p.nome)}</p><p class="mxv-plano__preco">${sr(r[1])}${e(p.preco)}</p>`
    + `<p class="mxv-plano__desc">${sr(r[2])}${p.desc}</p>${botao({ ...K.botao, texto: 'Testar grátis', tipo: p.destaque ? 'cheio' : 'contorno' }, 'mxv-plano__botao')}</li>`;
  const faixa = (p) => `<div class="mxv-plano-faixa"><p class="mxv-plano-faixa__nome">${sr(r[0])}${e(p.nome)} <span class="mxv-plano-faixa__preco">${sr(r[1])}${e(p.preco)}</span></p><p class="mxv-plano-faixa__desc">${sr(r[2])}${p.desc}</p></div>`;
  return `<section class="mxv-planos" id="mxv-planos"${sec(D, 'planos')}><div class="mxv-casca">`
    + `<h2 class="mxv-titulo mxv-titulo--centro mxv-planos__titulo">${e(K.titulo)}</h2>`
    + (K.itens.length
      ? `<ul class="mxv-planos__grade">${K.itens.map(plano).join('')}</ul><div class="mxv-planos__aberto"><p class="mxv-planos__texto" aria-live="polite"></p></div>`
        + (K.faixa || []).map(faixa).join('') + (K.sub ? `<div class="mxv-planos__sub">${K.sub}</div>` : '')
      : `<span class="mxv-planos__ponto" aria-hidden="true"></span>`)
    + `</div></section>`;
}

function escuro(D, k, K, classe) {
  return `<section class="mxv-escuro-sec mxv-escuro-sec--${k}"${sec(D, k)}><div class="mxv-casca"><div class="mxv-escuro ${classe}">`
    + `<div class="mxv-escuro__texto mxv-rv">${selo(K.selo)}<h2 class="mxv-titulo">${K.titulo}</h2>`
    + (K.corpo ? `<div class="mxv-escuro__corpo">${K.corpo}</div>` : '')
    + `<div class="mxv-escuro__botoes">${K.botoes.map((b) => botao(b)).join('')}</div></div>`
    + `<div class="mxv-escuro__arte mxv-rv">${quadro(D, K.img, '(min-width: 64rem) 520px, 92vw', 'mxv-escuro__img')}</div>`
    + `</div></div></section>`;
}

function conecte(D, C) {
  const K = C.conecte;
  const item = (c) => {
    const dentro = `<span class="mxv-integra__ico">${c.ico}</span><span class="mxv-integra__titulo">${e(c.titulo)}</span>${c.texto ? `<span class="mxv-integra__texto">${e(c.texto)}</span>` : ''}`;
    return `<li class="mxv-integra mxv-rv">${c.href ? `<a href="${e(c.href)}">${dentro}</a>` : `<div>${dentro}</div>`}</li>`;
  };
  return `<section class="mxv-conecte"${sec(D, 'conecte')}><div class="mxv-casca"><div class="mxv-cartao mxv-conecte__cartao">`
    + `<div class="mxv-conecte__texto mxv-rv">${selo(K.selo)}<h2 class="mxv-titulo">${e(K.titulo)}</h2><div class="mxv-cab__corpo">${K.corpo}</div></div>`
    + `<ul class="mxv-integras">${K.itens.map(item).join('')}</ul>`
    + ((K.mais || []).length ? `<ul class="mxv-mais">${K.mais.map((m) => `<li><a href="${e(m[1])}">${e(m[0])}</a></li>`).join('')}</ul>` : '')
    + `</div></div></section>`;
}

function faq(D, C) {
  const F = C.faq;
  const n = F.itens.length;
  const resposta = (a) => (Array.isArray(a) ? a.map((p) => `<p>${p}</p>`).join('') : a ? `<p>${a}</p>` : '');
  const item = ([q, a], i) => `<details class="mxv-faq__item${i >= F.visiveis ? ' mxv-faq__extra' : ''}" name="mxv-faq"${i === 0 ? ' open' : ''}><summary><h3 class="mxv-faq__q">${e(q)}</h3>${ICO.mais}</summary><div class="mxv-faq__a">${resposta(a)}</div></details>`;
  const extra = n - F.visiveis;
  return `<section class="mxv-faq-sec" id="perguntas"${sec(D, 'faq')}><div class="mxv-casca"><div class="mxv-cartao mxv-faq__cartao">`
    + `<div class="mxv-faq__cab"><h2 class="mxv-titulo">${e(F.titulo)}</h2><p class="mxv-faq__apoio">${F.apoio}</p></div>`
    + `<div class="mxv-faq__col"><div class="mxv-faq">${F.itens.map(item).join('')}</div>`
    + (extra > 0 ? `<div class="mxv-faq__mais"><button type="button" class="mxv-botao mxv-botao--contorno" data-mxv-faq-mais aria-expanded="false">Ver mais perguntas (+${extra})</button></div>` : '')
    + `</div></div></div></section>`;
}

export function desenho(D) {
  const C = D.origem ? daOrigem(D) : daRota(D);
  return `<div class="mxv${D.origem ? ' mxv--origem' : ''}">`
    + hero(D, C) + tudo(D, C) + recursos(D, C) + gestao(D, C) + pdv(D, C) + planos(D, C)
    + escuro(D, 'pratica', C.pratica, 'mxv-escuro--pratica') + escuro(D, 'palma', C.palma, 'mxv-escuro--palma')
    + conecte(D, C) + faq(D, C)
    + '</div>';
}

// a prova da casa (SITE-VISIONX/gerador/provar-molde.mjs) chama render({...origem, modo: 'origem'})
export function render(ctx) {
  return desenho({ ...ctx, origem: ctx.modo === 'origem', links: ctx.links || { app: '#', cadastro: '#', wpp: '#' }, v: ctx.v || ((x) => x), base: ctx.base || '.' });
}
