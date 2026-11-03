// Extrai da captura renderizada (secoes-html) os textos, imagens e endereços da Clover para o origem.json.
// O modo 'origem' do molde monta a página com estes dados e a prova compara com a captura.
// uso: node ferramentas/extrair-origem.mjs  (grava ../origem.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CAP = join(homedir(), '.jarvis/visionx/clones/capturas/clover-varejo-geral/secoes-html');
const ler = (n) => readFileSync(join(CAP, n + '.html'), 'utf8').replace(/ data-[a-z-]+="[^"]*"/g, '').replace(/mAZF70It--/g, '').replace(/ i18n="[^"]*"/g, '');
const des = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const um = (re, s) => { const m = s.match(re); return m ? m[1] : ''; };
const todos = (re, s) => [...s.matchAll(re)];
const bg = (s) => des(um(/background-image: url\(&quot;([^&]+(?:&amp;[^&]+)*)&quot;\)/, s));
const botao = (s) => ({
  texto: um(/IyWS7">([^<]*)</, s),
  oculto: um(/visually-hidden">([^<]*)</, s),
  href: des(um(/href="([^"]+)"/, um(/(<a[^>]*Button_with-button-theme[^>]*>)/, s))),
});
const img = (s) => ({ src: des(um(/<img[^>]*src="([^"]+)"/, s)), alt: des(um(/<img[^>]*alt="([^"]*)"/, s)) });
const blurbP = (s) => um(/MarkdownWrapper_wrapper__g8p\+g[^"]*"><p>([\s\S]*?)<\/p><\/div>/, s);

const O = { lang: 'en' };
{ const s = ler('00'); O.hero = { img: img(s), h1: um(/<h1[^>]*>([^<]*)<\/h1>/, s), p: blurbP(s), botao: botao(s) }; }
const grade = (s) => ({
  titulo: um(/GridModule_title__3qNUh">([^<]*)</, s),
  fundo: um(/<section[^>]*style="([^"]*)"/, s),
  celulas: s.split('GridModule_cell__e0j1h').slice(1).map((c) => ({
    icone: img(c),
    titulo: um(/<h5[^>]*>([^<]*)<\/h5>/, c),
    texto: um(/<p[^>]*>([\s\S]*?)<\/p>/, c),
    rico: /RichBlurb_root/.test(c),
  })),
});
O.grade1 = grade(ler('01'));
O.grade4 = grade(ler('04'));
O.grade8 = grade(ler('08'));
{
  const s = ler('02');
  const [colImg, colTxt] = s.split('Desktop_col__aV7-a').slice(1);
  O.rolagem = {
    titulo: um(/ControlledScrollModule_controlled-scroll__K6XH8">([^<]*)</, s),
    itens: colTxt.split('TextWrapper_text-wrapper__8VI-1').slice(1).map((t) => ({
      titulo: um(/TextBlock_title__UL91W">([^<]*)</, t),
      lista: um(/<ul>([\s\S]*?)<\/ul>/, t),
      botao: botao(t),
    })),
    imagens: todos(/Background_background__BrHcT"([^>]*)>/g, colImg).map((m) => ({ src: bg(m[1]), alt: des(um(/aria-label="([^"]*)"/, m[1])) })),
  };
}
const textoMidia = (s) => ({
  fundo: um(/<section[^>]*style="([^"]*)"/, s),
  img: img(s),
  titulo: um(/<h2[^>]*>([^<]*)<\/h2>/, s),
  p: blurbP(s) || um(/rich-blurb-paragraph">([\s\S]*?)<\/p>/, s),
  botao: botao(s),
});
O.texto3 = textoMidia(ler('03'));
O.texto6 = textoMidia(ler('06'));
O.fim = textoMidia(ler('10'));
const flutuante = (s) => ({
  fundo: bg(s), alt: des(um(/aria-label="([^"]*)"/, s)),
  titulo: um(/TextBox_title__K06Ek">([^<]*)</, s),
  p: blurbP(s),
  botao: botao(s),
});
O.flutua5 = flutuante(ler('05'));
O.flutua7 = flutuante(ler('07'));
{
  const s = ler('09');
  O.faq = {
    titulo: um(/FaqModule_faq-module__title__YNTns"[^>]*><p>([^<]*)<\/p>/, s),
    itens: s.split('FaqButtonAccordion_faq-module-item__LB569').slice(1).map((c) => ({
      pergunta: um(/<h3[^>]*>([^<]*)<\/h3>/, c),
      resposta: um(/FaqModule_rich-blurb__rpGwQ">([\s\S]*?)<\/div><\/div><\/div>/, c),
    })),
    verMais: um(/FaqModule_view-more-link__YPC7i[^>]*>([^<]*)</, s),
  };
}
writeFileSync(new URL('../origem.json', import.meta.url), JSON.stringify(O, null, 1) + '\n');
const r = O.rolagem;
console.log('hero', !!O.hero.h1, '| grades', O.grade1.celulas.length, O.grade4.celulas.length, O.grade8.celulas.length,
  '| rolagem', r.itens.length, 'textos', r.imagens.length, 'imagens | faq', O.faq.itens.length, '| ver mais', O.faq.verMais);
