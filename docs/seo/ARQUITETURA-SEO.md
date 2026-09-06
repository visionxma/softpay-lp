# Arquitetura de SEO — SoftPay

Atualizado em 2026-09-06. Domínio: `https://site.softpaybr.com`

## Estrutura publicada

```text
/                                          Home — página pilar comercial
│
├── /sistema-de-gestao-para-pequenos-negocios/   Pilar informacional
│
├── /segmentos/                            Índice
│   ├── /mercadinho/
│   ├── /loja-de-roupas/
│   ├── /loja-de-variedades/
│   ├── /papelaria/
│   ├── /farmacia/
│   ├── /distribuidora/
│   └── /pequeno-comercio/
│
├── /solucoes/                             Índice
│   ├── /sistema-de-estoque/
│   ├── /sistema-pdv/
│   ├── /controle-de-fiado/
│   ├── /sistema-financeiro/
│   ├── /nfe/
│   ├── /nfce/
│   ├── /loja-online/
│   ├── /controle-de-clientes/
│   └── /multiplas-lojas/
│
├── /guias/                                Índice
│   ├── /como-controlar-estoque/
│   ├── /como-controlar-caixa-da-loja/
│   ├── /como-controlar-fiado/
│   ├── /como-calcular-lucro-da-loja/
│   ├── /como-calcular-margem-de-lucro/
│   ├── /como-organizar-uma-loja/
│   └── /como-sair-do-caderno/
│
├── /perguntas/                            Índice
│   ├── /quanto-custa-um-sistema-para-loja/
│   ├── /loja-pequena-precisa-de-sistema/
│   ├── /caderno-ou-sistema/
│   ├── /excel-ou-sistema-de-gestao/
│   ├── /qual-sistema-para-mercadinho/
│   ├── /sistema-de-gestao-e-seguro/
│   ├── /posso-usar-o-softpay-no-celular/
│   ├── /posso-usar-em-varios-dispositivos/
│   ├── /posso-migrar-de-outro-sistema/
│   ├── /e-dificil-aprender/
│   ├── /preciso-instalar/
│   ├── /tem-suporte-humano/
│   └── /funciona-no-brasil-inteiro/
│
├── /sobre/          /contato/
└── /termos  /privacidade  /reembolso  +  404
```

**48 páginas HTML.** 43 geradas por `tools/build.py`, mais home, três páginas
legais e o 404.

## Decisões e por quê

**A home é a página pilar comercial, na raiz.** O briefing (§2) determina a raiz,
não `/lp/`. O redirect 301 de `/lp/` → `/` está em `public/_redirects`.

**Dois pilares, não um.** A home captura intenção comercial; a
`/sistema-de-gestao-para-pequenos-negocios/` captura intenção informacional
("o que é", "preciso?"). Separá-los evita que uma página tente ranquear para
duas intenções e não consiga nenhuma.

**Índices de cluster são páginas reais**, não redirecionamentos. Distribuem
autoridade para as folhas e capturam termos genéricos do cluster.

**URLs sem `.html` e com barra final.** O `html_handling: auto-trailing-slash`
do Cloudflare serve `/termos` a partir de `termos.html` e canonicaliza no
sentido `.html` → limpo. **Nunca crie a regra inversa no `_redirects`** — gera
loop infinito (já aconteceu uma vez; ver `CHANGELOG-SEO.md`).

**Farmácia foi mantida com ressalva explícita.** O SoftPay não cobre SNGPC.
A página diz isso em destaque. Prender um cliente que precisa de SNGPC seria
prejuízo dos dois lados.

## Páginas não criadas — e por quê

| Item do briefing | Situação |
|---|---|
| `/inteligencia/` (§14) | **Bloqueado.** Depende de confirmar se o produto gera recomendações ou apenas exibe indicadores. Ver `[VALIDAR]` no `CHANGELOG-SEO.md` |
| Comparativos com concorrentes (§31) | **Adiado.** O briefing exige pesquisa real antes; e comparar sem testar o concorrente produziria conteúdo impreciso |
| Calculadoras (§39) | **Adiado.** São ferramentas, não conteúdo — entram depois que o conteúdo provar tração |
| Guias de "produtos encalhados", "o que comprar" | Candidatos à próxima rodada, ver `ROADMAP-SEO.md` |

## Padrão técnico de cada página

Gerado por `tools/template.py`, idêntico em todas as 43 páginas internas:

- `title` e `meta description` únicos (verificado: zero duplicatas)
- `H1` único por página
- `canonical` absoluto
- Open Graph + X Card
- JSON-LD: `WebPage` + `BreadcrumbList` (+ `FAQPage` quando há FAQ visível)
- Breadcrumbs visíveis, batendo com o schema
- Âncora automática em toda seção (`tools/blocks.py: slug()`)
- Bloco de links relacionados
- CTA para o teste grátis

O conteúdo textual de cada página é escrito individualmente em
`tools/c_*.py`. O template padroniza a estrutura, **não o texto** — nenhuma
página é "find and replace" de outra, como o §10 exige.
