# Google Search Console — SoftPay

**Situação: não configurado.** Nenhuma propriedade do Search Console foi
detectada no site. Sem ele não existe dado real de busca — só hipótese.

Este é o item de maior retorno pendente: ele transforma o `MAPA-DE-KEYWORDS.md`
de suposição em plano baseado em dado, sem custo nenhum.

## 1. Criar a propriedade

Acesse [search.google.com/search-console](https://search.google.com/search-console)
e crie uma propriedade do tipo **Domínio** (não "Prefixo do URL"), informando
`softpaybr.com`. A propriedade de domínio cobre `site.`, `www.` e qualquer
subdomínio de uma vez.

## 2. Verificar por DNS

O Google vai pedir um registro `TXT`. Como o domínio já está na Cloudflare:

1. Copie o valor `google-site-verification=…` que o Search Console mostrar
2. Cloudflare → zona `softpaybr.com` → **DNS** → **Add record**
3. Type `TXT`, Name `@`, Content: o valor copiado
4. Salve e clique em **Verificar** no Search Console

A propagação costuma levar minutos.

> Alternativa: se preferir verificar por arquivo HTML, coloque o arquivo em
> `public/` que ele passa a ser servido na raiz. A verificação por DNS é
> melhor porque cobre todos os subdomínios.

## 3. Enviar o sitemap

Search Console → **Sitemaps** → informe `sitemap.xml` → Enviar.

O sitemap tem **47 URLs** e vive em `https://site.softpaybr.com/sitemap.xml`.

## 4. Solicitar indexação das prioritárias

Use **Inspeção de URL** → *Solicitar indexação* para acelerar as principais.
Não faça isso para as 47 de uma vez; comece por estas:

```
https://site.softpaybr.com/
https://site.softpaybr.com/sistema-de-gestao-para-pequenos-negocios/
https://site.softpaybr.com/segmentos/mercadinho/
https://site.softpaybr.com/segmentos/loja-de-roupas/
https://site.softpaybr.com/solucoes/controle-de-fiado/
https://site.softpaybr.com/guias/como-calcular-lucro-da-loja/
```

## 5. O que acompanhar

| Relatório | O que olhar | Com que frequência |
|---|---|---|
| Desempenho | Impressões, cliques, CTR, posição média | Semanal |
| Desempenho → Consultas | Termos reais que trazem gente | Semanal |
| Desempenho → Páginas | Quais páginas performam | Quinzenal |
| Cobertura / Indexação | Páginas indexadas vs. excluídas | Quinzenal |
| Core Web Vitals | LCP, INP, CLS em campo | Mensal |
| Melhorias → Perguntas frequentes | Se o `FAQPage` foi reconhecido | Mensal |

## 6. Como usar isso para corrigir o mapa de keywords

Depois de **60 a 90 dias** com dados acumulados:

1. Exporte **Consultas** do relatório de Desempenho
2. Procure termos com **muitas impressões e posição entre 5 e 20** — são
   páginas que já ranqueiam e estão a um ajuste de subir
3. Procure termos com **impressão e CTR baixo** — normalmente é `title` ou
   `meta description` fracos, não conteúdo ruim
4. Procure termos que trazem tráfego **sem ter página dedicada** — são
   candidatos a página nova, agora com evidência
5. Substitua as prioridades do `MAPA-DE-KEYWORDS.md` por esses dados

Esse ciclo é o que separa SEO baseado em dado de SEO baseado em achismo.

## 7. Bing Webmaster Tools

Vale cadastrar também em [bing.com/webmasters](https://www.bing.com/webmasters).
É rápido (importa direto do Search Console) e o Bing alimenta buscas de
assistentes de IA.

## 8. Analytics

Hoje o site tem **Meta Pixel** (dois IDs) com eventos `PageView`, `ViewContent`
e rastreamento de clique em CTA e WhatsApp no `script.js`.

**Não há Google Analytics.** Se quiser medir as conversões do §43 do briefing
— clique no CTA, início do teste, cadastro, WhatsApp —, será preciso instalar
GA4 ou equivalente. Isso não foi feito porque envolve decisão de privacidade e
consentimento que cabe a você.

## Registro

| Data | Evento |
|---|---|
| 2026-09-06 | Documento criado. Search Console ainda **não** configurado |
