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
| Páginas | 77 |
| Links internos (com âncora) | 2314 |
| Links contextuais no corpo | 740 |
| Páginas órfãs | 0 |

> O `/404` é excluído da checagem de órfãs de propósito: página de erro não
> deve receber link.

## Páginas mais linkadas

| Página | Links de entrada |
|---|---|
| `/` | 76 |
| `/termos` | 73 |
| `/privacidade` | 73 |
| `/reembolso` | 73 |
| `/segmentos/` | 72 |
| `/solucoes/` | 72 |
| `/guias/` | 72 |
| `/segmentos/loja-de-roupas/` | 72 |
| `/solucoes/sistema-pdv/` | 72 |
| `/solucoes/controle-de-fiado/` | 72 |
| `/solucoes/loja-online/` | 72 |
| `/segmentos/mercadinho/` | 72 |

## Links contextuais

| Origem | Destino | Âncora |
|---|---|---|
| `/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucro da lojaFaturamento, CMV, lucro bruto e resultado |
| `/` | `/guias/como-controlar-estoque/` | Como controlar o estoqueInventário, custo, baixa automática e curva AB |
| `/` | `/guias/como-controlar-fiado/` | Como controlar o fiadoRegistro por cliente, prazo e cobrança |
| `/` | `/perguntas/` | Perguntas frequentes |
| `/` | `/perguntas/` | perguntas frequentes |
| `/` | `/perguntas/caderno-ou-sistema/` | Caderno ou sistema?Comparação honesta, com os prós do caderno |
| `/` | `/perguntas/funciona-no-brasil-inteiro/` | Como funciona o atendimento nacional |
| `/` | `/perguntas/quanto-custa-um-sistema-para-loja/` | Quanto custa um sistema?Preços e o que checar antes de assinar |
| `/` | `/privacidade` | Política de Privacidade |
| `/` | `/reembolso` | Política de Reembolso |
| `/` | `/segmentos/distribuidora/` | Distribuidora
                    Volume alto, preço de atacado e nota |
| `/` | `/segmentos/farmacia/` | Farmácia
                    A gestão comercial do balcão. Não substit |
| `/` | `/segmentos/loja-de-roupas/` | Loja de roupas
                    Grade de tamanho e cor sem virar ba |
| `/` | `/segmentos/loja-de-variedades/` | Loja de variedades
                    Centenas de itens baratos — sai |
| `/` | `/segmentos/mercadinho/` | Mercadinho
                    Muitos itens, giro rápido e o fiado dos |
| `/` | `/segmentos/papelaria/` | Papelaria
                    Varejo, atacado e o pico da volta às aul |
| `/` | `/segmentos/pequeno-comercio/` | Pequeno comércio em geral
                    Loja com uma ou duas pes |
| `/` | `/segmentos/pequeno-comercio/` | Ver como funciona numa loja pequena |
| `/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é um sistema de gestãoO guia completo: para quem serve, quanto c |
| `/` | `/solucoes/` | Ver todos os recursos |
| `/` | `/solucoes/bot-whatsapp/` | Novo
                        Registre a venda falando no WhatsApp
     |
| `/` | `/solucoes/bot-whatsapp/` | Registre falando no WhatsAppA venda entra no sistema com o cliente ain |
| `/` | `/solucoes/bot-whatsapp/` | Ver como funciona o bot do WhatsApp → |
| `/` | `/solucoes/controle-de-fiado/` | Ver como funciona o controle de fiado → |
| `/404` | `/` | Ir para a página inicial |
| `/blog/` | `/blog/como-organizar-vitrine-de-loja/` | Como organizar a vitrine de uma loja pequenaA vitrine é o único vended |
| `/blog/` | `/blog/como-precificar-produto/` | Como precificar um produto na lojaO erro mais comum na precificação nã |
| `/blog/` | `/blog/fluxo-de-caixa-loja-pequena/` | Fluxo de caixa para loja pequenaDá para vender bem e não ter dinheiro  |
| `/blog/` | `/blog/perda-de-estoque-validade/` | Perda de estoque por validadeProduto vencido é prejuízo dobrado: você  |
| `/blog/` | `/blog/produtos-parados-no-estoque/` | Produtos parados no estoqueProduto parado não é neutro: é dinheiro que |
| `/blog/` | `/blog/troca-e-devolucao-na-loja/` | Troca e devolução na lojaBoa parte dos conflitos de troca vem de uma c |
| `/blog/` | `/guias/` | GuiasMétodo passo a passo |
| `/blog/` | `/perguntas/` | PerguntasDúvidas antes de contratar |
| `/blog/` | `/privacidade` | Política de Privacidade |
| `/blog/` | `/reembolso` | Política de Reembolso |
| `/blog/` | `/segmentos/` | SegmentosPelo seu tipo de loja |
| `/blog/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/blog/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/blog/como-organizar-vitrine-de-loja/` | `/blog/como-precificar-produto/` | Como precificarO preço que aparece |
| `/blog/como-organizar-vitrine-de-loja/` | `/blog/produtos-parados-no-estoque/` | Produtos paradosO que não vai na vitrine |
| `/blog/como-organizar-vitrine-de-loja/` | `/blog/produtos-parados-no-estoque/` | produtos parados no estoque |
| `/blog/como-organizar-vitrine-de-loja/` | `/guias/como-organizar-uma-loja/` | Como organizar uma lojaO roteiro completo |
| `/blog/como-organizar-vitrine-de-loja/` | `/privacidade` | Política de Privacidade |
| `/blog/como-organizar-vitrine-de-loja/` | `/reembolso` | Política de Reembolso |
| `/blog/como-organizar-vitrine-de-loja/` | `/segmentos/loja-de-calcados/` | Loja de calçadosExposição por modelo |
| `/blog/como-organizar-vitrine-de-loja/` | `/segmentos/loja-de-joias/` | Loja de joiasVitrine como argumento |
| `/blog/como-organizar-vitrine-de-loja/` | `/segmentos/loja-de-roupas/` | Loja de roupasVitrine é decisiva |
| `/blog/como-organizar-vitrine-de-loja/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/blog/como-organizar-vitrine-de-loja/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/blog/como-precificar-produto/` | `/blog/perda-de-estoque-validade/` | Perda de estoqueO custo que some da conta |
| `/blog/como-precificar-produto/` | `/blog/produtos-parados-no-estoque/` | Produtos paradosDinheiro na prateleira |
| `/blog/como-precificar-produto/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucro da lojaDo faturamento ao que sobra |
| `/blog/como-precificar-produto/` | `/guias/como-calcular-margem-de-lucro/` | Como calcular margem de lucroO método completo |
| `/blog/como-precificar-produto/` | `/guias/como-calcular-margem-de-lucro/` | como calcular margem de lucro |
| `/blog/como-precificar-produto/` | `/guias/como-controlar-estoque/` | Como controlar estoqueO passo a passo |
| `/blog/como-precificar-produto/` | `/privacidade` | Política de Privacidade |
| `/blog/como-precificar-produto/` | `/reembolso` | Política de Reembolso |
| `/blog/como-precificar-produto/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/blog/como-precificar-produto/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/blog/como-precificar-produto/` | `/solucoes/sistema-de-estoque/` | Controle de estoqueCusto e curva ABC |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/blog/como-precificar-produto/` | Como precificarA taxa do cartão no preço |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/blog/produtos-parados-no-estoque/` | Produtos paradosEstoque que virou caixa preso |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucroDo faturamento ao que sobra |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-controlar-caixa-da-loja/` | Como controlar caixa da lojaO fechamento diário |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-controlar-caixa-da-loja/` | como controlar o caixa da loja |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-controlar-fiado/` | Como controlar fiadoO dinheiro que já é seu |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/privacidade` | Política de Privacidade |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/reembolso` | Política de Reembolso |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/solucoes/sistema-financeiro/` | Sistema financeiroO recurso no SoftPay |
| `/blog/perda-de-estoque-validade/` | `/blog/como-precificar-produto/` | Como precificarA perda entra no custo |
| `/blog/perda-de-estoque-validade/` | `/blog/produtos-parados-no-estoque/` | Produtos parados no estoqueDinheiro preso na prateleira |
| `/blog/perda-de-estoque-validade/` | `/guias/como-controlar-estoque/` | Como controlar estoqueO passo a passo |
| `/blog/perda-de-estoque-validade/` | `/privacidade` | Política de Privacidade |
| `/blog/perda-de-estoque-validade/` | `/reembolso` | Política de Reembolso |
| `/blog/perda-de-estoque-validade/` | `/segmentos/farmacia/` | FarmáciaOutro caso de validade curta |
| `/blog/perda-de-estoque-validade/` | `/segmentos/mercadinho/` | MercadinhoOnde a validade mais pesa |
| `/blog/perda-de-estoque-validade/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/blog/perda-de-estoque-validade/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |

## Páginas órfãs

Nenhuma. Toda página tem pelo menos um link de entrada.
