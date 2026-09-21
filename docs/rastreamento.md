# Rastreamento da LP — o que o site publica e o que o GTM faz com isso

Atualizado em 21/09/2026.

## Quem faz o quê

| Camada | Onde | Responsável |
|---|---|---|
| Container GTM-MCJHLF3Q | `<head>` e `<body>` das 77 páginas | site (VisionX) |
| Pixel da Meta (`26424939163836170` e `1476552610693219`) | `<head>` das 77 páginas | site (VisionX) |
| Eventos de clique no `dataLayer` | `public/rastreio.js` | site (VisionX) |
| Tags, acionadores e variáveis | painel do GTM | gestor de tráfego (Érick) |

**O site não dispara `fbq('track', ...)` de conversão.** Só empurra o evento para
o `dataLayer`. Se a página disparasse e o GTM disparasse de novo, a mesma
conversão contaria duas vezes e a campanha otimizaria por um número inflado.
A única chamada `fbq` que existe é o `PageView` do carregamento.

## Eventos publicados

Todos chegam ao `dataLayer` no momento do clique, antes de a navegação começar.

| `event` | Quando acontece |
|---|---|
| `cta_teste_gratis` | clique em qualquer botão que leva ao cadastro do trial (`www.softpaybr.com/auth`) |
| `clique_entrar` | clique em "Entrar" — é login de quem já é cliente, **não** é conversão |
| `clique_whatsapp` | clique em qualquer link de WhatsApp (botão, bolha flutuante, rodapé) |
| `clique_email` | clique em `mailto:suporte@softpaybr.com` |

Campos que vão junto em todos eles:

| Campo | Exemplo | Para que serve |
|---|---|---|
| `cta_texto` | `Testar grátis` | qual botão foi clicado |
| `cta_local` | `planos`, `menu`, `rodape`, `cta-final`, `cta-flutuante`, `barra-fixa`, `bolha-whatsapp`, `menu-celular` | onde na página |
| `cta_plano` | `Loja` | só quando o botão está dentro de um cartão de plano (`Comércio`, `Loja`, `ERP Completo`, `Nota Fiscal`) |
| `cta_destino` | `https://www.softpaybr.com/auth` | o link de saída |
| `pagina` | `/solucoes/sistema-pdv/` | qual das 77 páginas |

### Como montar no GTM

1. **Variáveis** → nova → Variável da camada de dados → nome da variável
   `cta_local` (e repita para `cta_texto`, `cta_plano`, `cta_destino`, `pagina`).
2. **Acionador** → Evento personalizado → nome do evento `cta_teste_gratis`.
3. **Tag** → Meta Pixel (evento personalizado ou `InitiateCheckout`/`StartTrial`)
   → parâmetros com as variáveis acima → acionador do passo 2.

Repita para `clique_whatsapp` (costuma ser `Contact` ou `Lead`).

## A origem da visita viaja junto

A LP está em `site.softpaybr.com` e o cadastro em `www.softpaybr.com` — domínios
diferentes para o navegador. Sem repassar os parâmetros na própria URL, o
cadastro chegaria como tráfego direto e a campanha perderia o crédito.

`rastreio.js` copia `utm_*`, `fbclid`, `gclid`, `ttclid`, `msclkid` e `ref` da URL
atual para todos os links que apontam para o aplicativo, no carregamento da
página — então vale também para quem abre em nova aba ou copia o link.

Exemplo: quem entra por
`site.softpaybr.com/?utm_source=meta&utm_campaign=trial7&fbclid=ABC` sai para
`www.softpaybr.com/auth?utm_source=meta&utm_campaign=trial7&fbclid=ABC`.

## O que ainda não existe

- **Não há formulário de contato na LP.** O contato é WhatsApp e e-mail; é por
  isso que não existe evento de envio de formulário.
- **A conversão final (conta criada, assinatura paga) acontece no aplicativo**,
  fora deste repositório. Quem marca isso é o pixel instalado em
  `www.softpaybr.com`.

## Como conferir sem sujar o relatório

`tools/` não tem script para isso; a prova roda por fora, com o servidor local:

```bash
cd public && python3 -m http.server 8391
```

e um navegador que **aborte** as chamadas de coleta (`facebook.com/tr`,
`google-analytics.com`, `/g/collect`) antes de clicar. Sem isso, cada teste vira
um pageview e uma conversão falsa nos relatórios do gestor de tráfego.
