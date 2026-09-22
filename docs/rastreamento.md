# Rastreamento da LP — contrato com o gestor de tráfego

Atualizado em 21/09/2026. Container **GTM-MCJHLF3Q**.

## Quem faz o quê

| Camada | Onde | Responsável |
|---|---|---|
| Container GTM, Pixel da Meta, GA4 `G-5P7CFMLD2Q` | `<head>` das 77 páginas / painel do GTM | site + gestor |
| Eventos de comportamento no `dataLayer` | `public/rastreio.js` | site (VisionX) |
| Tags, acionadores, variáveis, públicos | painel do GTM | gestor de tráfego |
| Evento de conta criada e assinatura paga | `www.softpaybr.com` | aplicativo |

**O site não dispara `fbq('track', …)` de conversão.** Só empurra o evento para
o `dataLayer`. Se a página disparasse e o GTM disparasse de novo, a mesma
conversão contaria duas vezes e a campanha otimizaria por um número inflado.
A única `fbq` que existe é o `PageView` do carregamento.

## Os oito eventos

| `event` | `meta_evento` | Quando dispara |
|---|---|---|
| `cta_teste_gratis` | `InitiateCheckout` | clique em botão que leva ao cadastro (`www.softpaybr.com/auth`), inclusive com o botão do meio (abrir em nova aba) |
| `clique_whatsapp` | `Contact` | clique em qualquer link de WhatsApp |
| `clique_email` | `Contact` | clique em `mailto:suporte@softpaybr.com` |
| `envio_formulario` | `Lead` | envio do “Fale agora” em `/contato/`; traz `form_negocio` e `form_com_duvida` |
| `clique_entrar` | — | clique em "Entrar". É login de cliente, **não é conversão** |
| `viu_planos` | `ViewContent` | a tabela de preço ficou 50% visível por 1 segundo |
| `visita_qualificada` | `Lead` | 30 segundos **de aba à vista** na página **e** metade dela rolada. Não dispara em página legal nem no 404 |
| `leu_conteudo` | `ViewContent` | 15 segundos **e** um quarto rolado, em página de conteúdo |

### Campos que vão em todos

| Campo | Exemplo | Para que serve |
|---|---|---|
| `meta_evento` | `InitiateCheckout` | o nome do evento padrão da Meta — leia daqui e monte **uma tag só** |
| `event_id` | `a3f1…` | identificador único, para deduplicar com a Conversions API |
| `pagina` | `/solucoes/sistema-pdv/` | qual das 77 páginas |
| `pagina_tipo` | `solucoes-interna` | `home`, `segmentos`, `solucoes-interna`, `blog`, `legal`… |
| `origem` | `meta`, `google-ads`, `direto`, `google.com` | de onde a visita veio, sem depender do relatório |
| `profundidade_pct` | `78` | quanto da página já tinha sido rolado no momento do evento |
| `segundos_na_pagina` | `42` | quanto tempo até o evento |

### Campos dos eventos de clique

`cta_texto`, `cta_local` (`planos`, `menu`, `rodape`, `cta-final`,
`cta-flutuante`, `barra-fixa`, `bolha-whatsapp`, `menu-celular`),
`cta_destino` e, dentro de um cartão de plano, `cta_plano`
(`Comércio`, `Loja`, `ERP Completo`, `Nota Fiscal`).

## Por que existem eventos de meio de funil

A Meta precisa de **aproximadamente 50 eventos de otimização em 7 dias, por
conjunto de anúncios**, para o conjunto sair da fase de aprendizado; abaixo
disso ele fica em "aprendizado limitado" e a entrega não estabiliza.

O SoftPay fazia **2 cadastros no dia 16/09** — cerca de 14 por semana. Otimizar
pelo cadastro mantém a campanha em aprendizado limitado indefinidamente, por
aritmética, não por qualidade do anúncio.

A saída conhecida é otimizar por um evento mais alto no funil, com mais volume.
O risco também é conhecido: evento fraco ensina o algoritmo a buscar quem faz o
evento fraco e nunca compra. Por isso os três intermediários daqui exigem
**intenção**, não presença:

- `cta_teste_gratis` é o clique no botão do cadastro — o passo imediatamente
  anterior à conversão real, com volume maior porque inclui quem desiste no
  formulário. É o equivalente ao `InitiateCheckout` do comércio eletrônico.
- `visita_qualificada` exige 30 segundos **e** metade da página.
- `viu_planos` exige a tabela de preço na tela por 1 segundo inteiro.

Três armadilhas desarmadas, para quem for mexer nisto depois:

- **O relógio só corre com a aba à vista.** Aba aberta em segundo plano
  acumularia os 30 segundos sozinha, e "qualificada" passaria a significar
  presença em vez de atenção — exatamente o que faz um evento intermediário
  ensinar o algoritmo a buscar quem não compra.
- **Voltar pelo navegador zera o relógio** (`pageshow` com `persisted`): quem foi
  ao cadastro e voltou apareceria com minutos de leitura que não existiram.
- **`viu_planos` mede a TELA, não a seção.** `intersectionRatio >= 0.5` é a razão
  da seção, e a seção de planos é mais alta que a tela do celular: medido em
  21/09/2026, a razão máxima possível era 0,59 em 360px. Uma linha a mais num
  cartão de plano e o evento pararia de disparar sem ninguém perceber.

**Recomendação:** subir a campanha otimizando por `InitiateCheckout`
(`cta_teste_gratis`) enquanto o volume de cadastro não chegar a 50 por semana, e
trocar para o cadastro quando chegar.

Fontes: [adlibrary.com/posts/meta-ads-learning-phase-50-events-guide](https://adlibrary.com/posts/meta-ads-learning-phase-50-events-guide)
(o que conta para o limite: pixel, CAPI e conversões modeladas, no nível do
conjunto de anúncios) ·
[cometly.com/post/facebook-ads-learning-phase-optimization](https://www.cometly.com/post/facebook-ads-learning-phase-optimization)
("otimizar por evento raro" como causa de aprendizado limitado) ·
[pigeondigital.com/insight/facebook-ads-learning-phase-50-conversions-rule-2026](https://www.pigeondigital.com/insight/facebook-ads-learning-phase-50-conversions-rule-2026)
(o alerta contrário: evento fraco ensina o algoritmo a achar o público errado).

## Montar no GTM — uma tag, não sete

1. **Variáveis** → nova → *Variável da camada de dados*, uma para cada:
   `meta_evento`, `event_id`, `pagina`, `pagina_tipo`, `origem`,
   `profundidade_pct`, `segundos_na_pagina`, `cta_local`, `cta_plano`,
   `cta_texto`, `cta_destino`.
2. **Acionador** → *Evento personalizado* → nome do evento com a expressão
   regular ligada: `cta_teste_gratis|clique_whatsapp|clique_email|envio_formulario|viu_planos|visita_qualificada|leu_conteudo`.
3. **Tag** → *Meta Pixel — evento personalizado* →
   - nome do evento: `{{DLV - meta_evento}}`
   - `eventID`: `{{DLV - event_id}}`
   - parâmetros: os que interessarem da lista acima
   - acionador: o do passo 2.

`clique_entrar` fica de fora de propósito: é cliente entrando na conta.

### Rolagem e tempo você já tem de graça

Não duplicamos o que o GTM faz nativamente: use os acionadores embutidos de
**profundidade de rolagem** e **temporizador**. `visita_qualificada` existe
porque combina os dois **com** um `meta_evento` pronto — não para substituí-los.

## Quando ligarem a Conversions API

Todo evento já sai com `event_id`. Quando o servidor mandar o mesmo evento, use
o mesmo valor no `event_id` do lado do servidor e no `eventID` do pixel: a Meta
deduplica pelo par (`event_name`, `event_id`) e a conversão conta uma vez só.

Fontes: [developers.facebook.com — Handling Duplicate Pixel and Conversions API Events](https://developers.facebook.com/documentation/ads-commerce/conversions-api/deduplicate-pixel-and-server-events)
(o `eventID` do pixel precisa bater com o `event_id` da API, e o `event` com o
`event_name`) ·
[chatterbuzzmedia.com/blog/meta-conversions-api-guide](https://www.chatterbuzzmedia.com/blog/meta-conversions-api-guide)
(setup only-pixel perde mais da metade das conversões; dedup obrigatória ao
rodar os dois juntos).

## O funil entre os dois domínios

**Medido no ar em 21/09/2026**, com a coleta abortada:

| URL do aplicativo | pixels que carregam |
|---|---|
| `/auth` | `1476552610693219` |
| `/auth?ref=alexandrehen_cf9e` | `1476552610693219`, `26424939163836170` |
| `/auth?utm_source=meta&fbclid=…` | `1476552610693219` |

O aplicativo **já dispara** `CompleteRegistration` e `StartTrial` no cadastro,
com Advanced Matching, e o StartTrial sai pelos dois lados com o mesmo
`event_id` (navegador e Conversions API). Isso está certo e existe desde antes.

O que faltava era o **pixel da campanha** (`26424939163836170`) estar presente na
hora do cadastro: ele só armava com o `ref` de um link específico, e a LP mandava
todo mundo para `/auth` sem marca nenhuma. Na prática, a campanha via o clique
aqui e nunca o cadastro lá.

**Como ficou:** a LP marca a saída dos botões de cadastro com `sp_lp=1`, e o
aplicativo tem a entrada correspondente na tabela de pixels de link. "Entrar"
sai sem a marca — é cliente voltando para a conta, não é aquisição.

### `ref` e `utm_campaign` NÃO viajam daqui. Nunca.

No aplicativo, `?ref=` é o código da Plataforma de Parceiros: vira
`accounts.affiliate_ref` no cadastro e **paga comissão em dinheiro**. E
`utm_campaign` é o substituto documentado dele (`src/lib/partnerTracking.ts`,
"doc 03 §2.2"). Repassar o nome da campanha faria todo cadastro vindo de anúncio
nascer atribuído a um afiliado que não existe — e conta que nasce com
`affiliate_ref` fica de fora do programa Indique e Ganhe.

Viajam: `utm_source`, `utm_medium`, `utm_content`, `utm_term`, `utm_id`,
`utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`, `fbclid`,
`gclid`, `wbraid`, `gbraid`, `ttclid` e `msclkid`.

## A origem da visita viaja junto

`rastreio.js` copia `utm_*`, `fbclid`, `gclid`, `ttclid`, `msclkid` e `ref` da
URL atual para todos os links que apontam para o aplicativo, no carregamento.

**Medido em 21/09/2026:** os cookies `_fbp` e `_fbc` são gravados em
`.softpaybr.com` — domínio pai. Ou seja, `www.softpaybr.com` **já enxerga** os
identificadores da Meta criados na LP, e a atribuição entre LP e cadastro não
depende do repasse na URL. O repasse continua valendo para GA4, Google Ads e
para qualquer relatório que leia `utm_*`.

## O que falta, e de quem depende

1. **Merge do PR no aplicativo** (`visionxma/softpay`, branch
   `rastreio/pixel-da-campanha-na-lp`). Sem ele, o `sp_lp=1` que a LP já manda
   não arma nada do outro lado e o funil continua cortado.
2. **GA4 e GTM não existem no aplicativo** — medido: `dataLayer` inexistente,
   nenhum contêiner. O funil do GA4 morre na fronteira dos domínios.
   **Depende dos sócios.**
3. **Consentimento (LGPD).** Está pronto e desligado —
   `window.SOFTPAY_CONSENTIMENTO` no `<head>`. Ligar reduz a conversão
   atribuída: quem recusar sai da atribuição. **Decisão dos sócios + gestor.**
4. **Mapa de calor: no ar.** Microsoft Clarity, projeto `ym1ookdh28`, conta
   `visionxma@gmail.com`. Carrega **só depois do aceite de cookies** — gravação
   de sessão é cookie não essencial. Numa home de **19,3 telas no celular** é o
   que responde onde o tráfego pago para de rolar.

## Como conferir sem sujar o relatório

```bash
cd public && python3 -m http.server 8391
```

E um navegador que **aborte** `facebook.com/tr`, `google-analytics.com` e
`/g/collect` antes de clicar. Sem isso, cada teste vira um pageview e uma
conversão falsa nos relatórios de quem está pagando o anúncio.

## Referências medidas (21/09/2026)

Seis sites do nicho, abertos e inspecionados para saber o que eles publicam no
`dataLayer` no clique do CTA:

| Site | Contêineres | Evento no clique do CTA |
|---|---|---|
| Bling | GTM + 2× Google Ads + GA4 + Pixel + Clarity | `gtm.timer` — nenhum evento nomeado |
| Nextar | GTM + Google Ads + GA4 + TikTok + Clarity + Hotjar | `gtm.click`, `gtm.linkClick` — automático, sem contexto |
| Kyte | só `gtag` | nada |
| RD Station | — | nada |
| Stone | — | nada |
| Conta Azul | — | nada |

**Nenhuma das seis publica evento nomeado de negócio no clique.** As duas mais
maduras dependem do evento automático do GTM, que não diz qual plano, qual
seção nem qual página. É a distância que este arquivo existe para manter.
