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

O sitemap tem **53 URLs** e vive em `https://site.softpaybr.com/sitemap.xml`.
Conferido em 2026-09-07: HTTP 200, XML válido, `application/xml`.

## 4. Solicitar indexação das prioritárias

Use **Inspeção de URL** → *Solicitar indexação* para acelerar as principais.
Não faça isso para as 53 de uma vez; comece por estas — as cinco páginas
novas primeiro, porque nunca foram rastreadas:

```
https://site.softpaybr.com/segmentos/loja-de-joias/
https://site.softpaybr.com/segmentos/empresas-com-filiais/
https://site.softpaybr.com/segmentos/loja-de-celulares-e-acessorios/
https://site.softpaybr.com/segmentos/loja-de-autopecas/
https://site.softpaybr.com/segmentos/materiais-de-construcao/
https://site.softpaybr.com/
https://site.softpaybr.com/segmentos/
https://site.softpaybr.com/sistema-de-gestao-para-pequenos-negocios/
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


## 9. Atenção: existem dois sites no mesmo domínio

Levantado em 2026-09-07, e isso muda a leitura de tudo que aparecer no
Search Console.

| Host | O que é | Título |
|---|---|---|
| `www.softpaybr.com` | Aplicação SPA, renderizada por JS | SoftPay — PDV, Estoque e Vendas para o seu Negócio |
| `site.softpaybr.com` | **Esta landing page** | Sistema de Gestão para Pequenos Negócios \| SoftPay |

O apex `softpaybr.com` redireciona para `www`. Os dois hosts disputam as
mesmas consultas de marca e de produto — a description do `www` cita "PDV,
controle de estoque, PIX, fiado, relatórios e Curva ABC", que é exatamente o
vocabulário desta landing.

É por isso que a propriedade deve ser do tipo **Domínio**: ela mostra os dois
lado a lado e revela qual o Google escolheu.

### Problemas encontrados no `www`

Não estão neste repositório — quem cuida daquele site precisa corrigir:

1. **O redirect do apex é 307, não 301.** Um 307 é temporário e diz ao Google
   para *não* consolidar os sinais entre `softpaybr.com` e `www`. Para SEO
   deveria ser 301 permanente.
2. **O sitemap do `www` lista outro domínio.** Ele inclui URLs de
   `softpayco.com` (`/planes-info`, `/contacto`). Sitemap só pode conter URLs
   do próprio host — o Google ignora as demais e registra o erro.
3. **O `/auth` está no sitemap.** Página de login não deve ser indexada.
4. **O sitemap do `www` lista URLs do apex**, que redirecionam. Google trata
   redirect dentro de sitemap como erro leve.
5. **Sem `h1` no HTML servido.** Sendo SPA, o conteúdo depende de JS. O Google
   renderiza, mas com atraso e menos confiança que HTML pronto.

### O que decidir

Qual host deve ser a porta de entrada da marca na busca. Enquanto os dois
competirem, o Google divide autoridade entre eles e nenhum sobe tanto quanto
poderia. As saídas usuais:

- **Manter os dois com papéis distintos:** `www` como aplicação (com `noindex`
  em `/auth` e afins) e `site` como o conteúdo que busca tráfego.
- **Consolidar:** mover a landing para o apex e deixar a aplicação num
  subdomínio tipo `app.softpaybr.com`. É o arranjo mais comum, e o que mais
  concentra autoridade — mas exige redirecionar tudo com 301.

Não dá para decidir isso sem os dados do Search Console. É mais um motivo
para configurá-lo antes de qualquer coisa.

## Registro

| Data | Evento |
|---|---|
| 2026-09-06 | Documento criado. Search Console ainda **não** configurado |
| 2026-09-07 | Pré-requisitos conferidos: robots.txt libera, sitemap 200 com 53 URLs, DNS na Cloudflare. Descobertos os dois sites no mesmo domínio (seção 9) |
