# Mapa de Interlinks — SoftPay

Atualizado automaticamente. **Gerado a partir dos links reais das páginas**, não
de um plano no papel — se a tabela mostra um link, ele existe no HTML.

Regenere com `python3 tools/mapa_interlinks.py` sempre que adicionar páginas ou
mudar links, para o mapa não virar ficção.

## Fluxo desenhado

```text
Home  →  Segmentos  →  Soluções  →  Guias  →  Perguntas  →  Home
  ↕                        ↕            ↕
  └──────  Página pilar  ──┴────────────┘
```

Cada página termina com um bloco "Continue por aqui" com 3 destinos escolhidos
por relevância, e traz links contextuais dentro do texto.

## Cobertura

| Métrica | Valor |
|---|---|
| Páginas | 48 |
| Links internos (com âncora) | 1219 |
| Links contextuais no corpo | 359 |
| Páginas órfãs | 0 |

> O `/404` é excluído da checagem de órfãs de propósito: página de erro não
> deve receber link.

## Páginas mais linkadas

| Página | Links de entrada |
|---|---|
| `/` | 47 |
| `/termos` | 44 |
| `/privacidade` | 44 |
| `/reembolso` | 44 |
| `/segmentos/` | 43 |
| `/solucoes/` | 43 |
| `/guias/` | 43 |
| `/sobre/` | 43 |
| `/perguntas/` | 43 |
| `/solucoes/sistema-pdv/` | 43 |
| `/solucoes/controle-de-fiado/` | 43 |
| `/solucoes/loja-online/` | 43 |

## Links contextuais

| Origem | Destino | Âncora |
|---|---|---|
| `/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucro da lojaFaturamento, CMV, lucro bruto e resultado |
| `/` | `/guias/como-controlar-estoque/` | Como controlar o estoqueInventário, custo, baixa automática e curva AB |
| `/` | `/guias/como-controlar-fiado/` | Como controlar o fiadoRegistro por cliente, prazo e cobrança |
| `/` | `/perguntas/` | Perguntas frequentes |
| `/` | `/perguntas/` | perguntas frequentes |
| `/` | `/perguntas/caderno-ou-sistema/` | Caderno ou sistema?Comparação honesta, com os prós do caderno |
| `/` | `/perguntas/quanto-custa-um-sistema-para-loja/` | Quanto custa um sistema?Preços e o que checar antes de assinar |
| `/` | `/privacidade` | Política de Privacidade |
| `/` | `/reembolso` | Política de Reembolso |
| `/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é um sistema de gestãoO guia completo: para quem serve, quanto c |
| `/` | `/solucoes/controle-de-fiado/` | Ver como funciona o controle de fiado → |
| `/404` | `/` | Ir para a página inicial |
| `/contato/` | `/perguntas/` | PerguntasDúvidas frequentes |
| `/contato/` | `/perguntas/tem-suporte-humano/` | Suporte humanoComo funciona |
| `/contato/` | `/privacidade` | Política de Privacidade |
| `/contato/` | `/reembolso` | Política de Reembolso |
| `/contato/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/contato/` | `/sobre/` | Sobre o SoftPayQuem está por trás |
| `/contato/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucro de uma lojaResposta curta: lucro bruto é o fatur |
| `/guias/` | `/guias/como-calcular-margem-de-lucro/` | Como calcular a margem de lucroResposta curta: margem é o lucro dividi |
| `/guias/` | `/guias/como-controlar-caixa-da-loja/` | Como controlar o caixa de uma lojaResposta curta: registre toda entrad |
| `/guias/` | `/guias/como-controlar-estoque/` | Como controlar o estoque de uma lojaResposta curta: registre o que ent |
| `/guias/` | `/guias/como-controlar-fiado/` | Como controlar vendas fiadasResposta curta: registre cada venda fiada  |
| `/guias/` | `/guias/como-organizar-uma-loja/` | Como organizar uma lojaResposta curta: organize uma coisa de cada vez, |
| `/guias/` | `/guias/como-sair-do-caderno/` | Como sair do cadernoResposta curta: não transcreva o caderno inteiro |
| `/guias/` | `/perguntas/` | PerguntasDúvidas antes de contratar |
| `/guias/` | `/privacidade` | Política de Privacidade |
| `/guias/` | `/reembolso` | Política de Reembolso |
| `/guias/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestãoGuia completo |
| `/guias/` | `/solucoes/` | SoluçõesComo o SoftPay ajuda |
| `/guias/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/como-calcular-lucro-da-loja/` | `/guias/como-calcular-margem-de-lucro/` | Como calcular margemFormação de preço |
| `/guias/como-calcular-lucro-da-loja/` | `/guias/como-controlar-estoque/` | Como controlar estoqueDe onde vem o custo |
| `/guias/como-calcular-lucro-da-loja/` | `/privacidade` | Política de Privacidade |
| `/guias/como-calcular-lucro-da-loja/` | `/reembolso` | Política de Reembolso |
| `/guias/como-calcular-lucro-da-loja/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/como-calcular-lucro-da-loja/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/como-calcular-lucro-da-loja/` | `/solucoes/sistema-financeiro/` | Sistema financeiroCaixa e resultado |
| `/guias/como-calcular-margem-de-lucro/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular lucroA conta completa |
| `/guias/como-calcular-margem-de-lucro/` | `/privacidade` | Política de Privacidade |
| `/guias/como-calcular-margem-de-lucro/` | `/reembolso` | Política de Reembolso |
| `/guias/como-calcular-margem-de-lucro/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/como-calcular-margem-de-lucro/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/como-calcular-margem-de-lucro/` | `/solucoes/sistema-de-estoque/` | Controle de estoqueCusto por produto |
| `/guias/como-calcular-margem-de-lucro/` | `/solucoes/sistema-financeiro/` | Sistema financeiroResultado do período |
| `/guias/como-controlar-caixa-da-loja/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular lucroCaixa não é lucro |
| `/guias/como-controlar-caixa-da-loja/` | `/guias/como-calcular-lucro-da-loja/` | como calcular o lucro da loja |
| `/guias/como-controlar-caixa-da-loja/` | `/privacidade` | Política de Privacidade |
| `/guias/como-controlar-caixa-da-loja/` | `/reembolso` | Política de Reembolso |
| `/guias/como-controlar-caixa-da-loja/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/como-controlar-caixa-da-loja/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/como-controlar-caixa-da-loja/` | `/solucoes/sistema-financeiro/` | Sistema financeiroCaixa e resultado |
| `/guias/como-controlar-caixa-da-loja/` | `/solucoes/sistema-pdv/` | Sistema PDVOnde a venda é registrada |
| `/guias/como-controlar-estoque/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular lucroO custo entra aqui |
| `/guias/como-controlar-estoque/` | `/guias/como-sair-do-caderno/` | Como sair do cadernoA migração completa |
| `/guias/como-controlar-estoque/` | `/privacidade` | Política de Privacidade |
| `/guias/como-controlar-estoque/` | `/reembolso` | Política de Reembolso |
| `/guias/como-controlar-estoque/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/como-controlar-estoque/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/como-controlar-estoque/` | `/solucoes/sistema-de-estoque/` | Controle de estoqueComo funciona no SoftPay |
| `/guias/como-controlar-fiado/` | `/guias/como-sair-do-caderno/` | Como sair do cadernoMigração completa |
| `/guias/como-controlar-fiado/` | `/privacidade` | Política de Privacidade |
| `/guias/como-controlar-fiado/` | `/reembolso` | Política de Reembolso |
| `/guias/como-controlar-fiado/` | `/segmentos/mercadinho/` | MercadinhoO fiado do bairro |
| `/guias/como-controlar-fiado/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/como-controlar-fiado/` | `/solucoes/controle-de-fiado/` | Controle de fiadoComo funciona no SoftPay |
| `/guias/como-controlar-fiado/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/como-organizar-uma-loja/` | `/guias/como-controlar-caixa-da-loja/` | Como controlar o caixaRotina diária |
| `/guias/como-organizar-uma-loja/` | `/guias/como-controlar-estoque/` | Como controlar estoqueEtapa do estoque |
| `/guias/como-organizar-uma-loja/` | `/privacidade` | Política de Privacidade |
| `/guias/como-organizar-uma-loja/` | `/reembolso` | Política de Reembolso |
| `/guias/como-organizar-uma-loja/` | `/segmentos/pequeno-comercio/` | Pequeno comércioPara lojas pequenas |
| `/guias/como-organizar-uma-loja/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/como-organizar-uma-loja/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/como-sair-do-caderno/` | `/guias/como-controlar-fiado/` | Como controlar fiadoLevar o fiado junto |
| `/guias/como-sair-do-caderno/` | `/guias/como-organizar-uma-loja/` | Como organizar uma lojaO roteiro completo |
| `/guias/como-sair-do-caderno/` | `/perguntas/caderno-ou-sistema/` | Caderno ou sistema?A comparação |
| `/guias/como-sair-do-caderno/` | `/privacidade` | Política de Privacidade |

## Páginas órfãs

Nenhuma. Toda página tem pelo menos um link de entrada.
