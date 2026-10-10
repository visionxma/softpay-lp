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
| Páginas | 81 |
| Links internos (com âncora) | 3073 |
| Links contextuais no corpo | 641 |
| Páginas órfãs | 4 |

> O `/404` é excluído da checagem de órfãs de propósito: página de erro não
> deve receber link.

## Páginas mais linkadas

| Página | Links de entrada |
|---|---|
| `/` | 78 |
| `/termos.html` | 76 |
| `/privacidade.html` | 76 |
| `/segmentos/loja-de-roupas/` | 75 |
| `/segmentos/mercadinho/` | 75 |
| `/blog/` | 74 |
| `/perguntas/` | 74 |
| `/solucoes/controle-de-fiado/` | 74 |
| `/solucoes/loja-online/` | 74 |
| `/segmentos/farmacia/` | 74 |
| `/sobre/` | 74 |
| `/contato/` | 74 |

## Links contextuais

| Origem | Destino | Âncora |
|---|---|---|
| `/` | `/perguntas/funciona-no-brasil-inteiro/` | Como funciona o atendimento nacional |
| `/` | `/perguntas/sistema-de-gestao-e-seguro/` | Ver como os dados ficam seguros |
| `/` | `/segmentos/distribuidora/` | Naldo Bebidas · cliente
                    
                        D |
| `/` | `/segmentos/farmacia/` | Farmácia
                        Ver o sistema |
| `/` | `/segmentos/loja-de-celulares-e-acessorios/` | Gabriel Landim · cliente
                    
                         |
| `/` | `/segmentos/loja-de-roupas/` | RN Grifes · cliente
                    
                        Loja  |
| `/` | `/segmentos/loja-de-variedades/` | Variedades
                        Ver o sistema |
| `/` | `/segmentos/papelaria/` | Papelaria
                        Ver o sistema |
| `/` | `/solucoes/bot-whatsapp/` | Ver o bot do WhatsApp |
| `/` | `/solucoes/controle-de-clientes/` | Ver o controle de clientes |
| `/` | `/solucoes/controle-de-fiado/` | Ver o controle de fiado |
| `/` | `/solucoes/multiplas-lojas/` | Ver múltiplas lojas |
| `/` | `/solucoes/nfce/` | Ver a emissão de nota |
| `/` | `/solucoes/nfe/` | Ver a emissão de nota |
| `/` | `/solucoes/sistema-de-estoque/` | Ver o controle de estoque |
| `/` | `/solucoes/sistema-pdv/` | Ver como funciona o PDV |
| `/` | `/solucoes/sistema-pdv/` | Ver o PDV por inteiro |
| `/404` | `/` | Ir para a página inicial |
| `/blog/` | `/blog/como-organizar-vitrine-de-loja/` | Como organizar a vitrine de uma loja pequenaA vitrine é o único vended |
| `/blog/` | `/blog/como-precificar-produto/` | Como precificar um produto na lojaO erro mais comum na precificação nã |
| `/blog/` | `/blog/fluxo-de-caixa-loja-pequena/` | Fluxo de caixa para loja pequenaDá para vender bem e não ter dinheiro  |
| `/blog/` | `/blog/perda-de-estoque-validade/` | Perda de estoque por validadeProduto vencido é prejuízo dobrado: você  |
| `/blog/` | `/blog/produtos-parados-no-estoque/` | Produtos parados no estoqueProduto parado não é neutro: é dinheiro que |
| `/blog/` | `/blog/troca-e-devolucao-na-loja/` | Troca e devolução na lojaBoa parte dos conflitos de troca vem de uma c |
| `/blog/` | `/guias/` | GuiasMétodo passo a passo |
| `/blog/` | `/perguntas/` | PerguntasDúvidas antes de contratar |
| `/blog/` | `/segmentos/` | SegmentosPelo seu tipo de loja |
| `/blog/como-organizar-vitrine-de-loja/` | `/blog/como-precificar-produto/` | Como precificarO preço que aparece |
| `/blog/como-organizar-vitrine-de-loja/` | `/blog/produtos-parados-no-estoque/` | Produtos paradosO que não vai na vitrine |
| `/blog/como-organizar-vitrine-de-loja/` | `/blog/produtos-parados-no-estoque/` | produtos parados no estoque |
| `/blog/como-organizar-vitrine-de-loja/` | `/guias/como-organizar-uma-loja/` | Como organizar uma lojaO roteiro completo |
| `/blog/como-organizar-vitrine-de-loja/` | `/segmentos/loja-de-calcados/` | Loja de calçadosExposição por modelo |
| `/blog/como-organizar-vitrine-de-loja/` | `/segmentos/loja-de-joias/` | Loja de joiasVitrine como argumento |
| `/blog/como-organizar-vitrine-de-loja/` | `/segmentos/loja-de-roupas/` | Loja de roupasVitrine é decisiva |
| `/blog/como-precificar-produto/` | `/blog/perda-de-estoque-validade/` | Perda de estoqueO custo que some da conta |
| `/blog/como-precificar-produto/` | `/blog/produtos-parados-no-estoque/` | Produtos paradosDinheiro na prateleira |
| `/blog/como-precificar-produto/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucro da lojaDo faturamento ao que sobra |
| `/blog/como-precificar-produto/` | `/guias/como-calcular-margem-de-lucro/` | Como calcular margem de lucroO método completo |
| `/blog/como-precificar-produto/` | `/guias/como-calcular-margem-de-lucro/` | como calcular margem de lucro |
| `/blog/como-precificar-produto/` | `/guias/como-controlar-estoque/` | Como controlar estoqueO passo a passo |
| `/blog/como-precificar-produto/` | `/solucoes/sistema-de-estoque/` | Controle de estoqueCusto e curva ABC |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/blog/como-precificar-produto/` | Como precificarA taxa do cartão no preço |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/blog/produtos-parados-no-estoque/` | Produtos paradosEstoque que virou caixa preso |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucroDo faturamento ao que sobra |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-controlar-caixa-da-loja/` | Como controlar caixa da lojaO fechamento diário |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-controlar-caixa-da-loja/` | como controlar o caixa da loja |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/guias/como-controlar-fiado/` | Como controlar fiadoO dinheiro que já é seu |
| `/blog/fluxo-de-caixa-loja-pequena/` | `/solucoes/sistema-financeiro/` | Sistema financeiroO recurso no SoftPay |
| `/blog/perda-de-estoque-validade/` | `/blog/como-precificar-produto/` | Como precificarA perda entra no custo |
| `/blog/perda-de-estoque-validade/` | `/blog/produtos-parados-no-estoque/` | Produtos parados no estoqueDinheiro preso na prateleira |
| `/blog/perda-de-estoque-validade/` | `/guias/como-controlar-estoque/` | Como controlar estoqueO passo a passo |
| `/blog/perda-de-estoque-validade/` | `/segmentos/farmacia/` | FarmáciaOutro caso de validade curta |
| `/blog/perda-de-estoque-validade/` | `/segmentos/mercadinho/` | MercadinhoOnde a validade mais pesa |
| `/blog/perda-de-estoque-validade/` | `/solucoes/sistema-de-estoque/` | Controle de estoqueO recurso no SoftPay |
| `/blog/produtos-parados-no-estoque/` | `/blog/como-precificar-produto/` | Como precificarRemarcar sem perder margem |
| `/blog/produtos-parados-no-estoque/` | `/blog/perda-de-estoque-validade/` | Perda de estoqueQuando o parado vence |
| `/blog/produtos-parados-no-estoque/` | `/guias/como-controlar-estoque/` | Como controlar estoqueO método completo |
| `/blog/produtos-parados-no-estoque/` | `/guias/como-controlar-estoque/` | como controlar estoque |
| `/blog/produtos-parados-no-estoque/` | `/segmentos/loja-de-roupas/` | Loja de roupasOnde a coleção encalha |
| `/blog/produtos-parados-no-estoque/` | `/segmentos/loja-de-variedades/` | Loja de variedadesMuitos itens, muito encalhe |
| `/blog/produtos-parados-no-estoque/` | `/solucoes/sistema-de-estoque/` | Controle de estoqueCurva ABC no SoftPay |
| `/blog/troca-e-devolucao-na-loja/` | `/blog/produtos-parados-no-estoque/` | Produtos paradosO que volta e não sai |
| `/blog/troca-e-devolucao-na-loja/` | `/guias/como-controlar-estoque/` | Como controlar estoqueEntradas e saídas |
| `/blog/troca-e-devolucao-na-loja/` | `/segmentos/loja-de-calcados/` | Loja de calçadosTroca de numeração |
| `/blog/troca-e-devolucao-na-loja/` | `/segmentos/loja-de-roupas/` | Loja de roupasOnde a troca é rotina |
| `/blog/troca-e-devolucao-na-loja/` | `/solucoes/controle-de-clientes/` | Controle de clientesHistórico como comprovante |
| `/blog/troca-e-devolucao-na-loja/` | `/solucoes/sistema-pdv/` | Sistema PDVRegistro da venda |
| `/campanha/gestao/` | `/perguntas/` | Perguntas frequentes |
| `/campanha/gestao/` | `/perguntas/` | Perguntas frequentesRespostas sobre planos, teste e uso |
| `/campanha/gestao/` | `/segmentos/cosmeticos-e-perfumaria/` | Cosméticos e perfumaria |
| `/campanha/gestao/` | `/segmentos/empresas-com-filiais/` | Empresas com filiais |
| `/campanha/gestao/` | `/segmentos/loja-de-celulares-e-acessorios/` | Celulares e acessórios |
| `/campanha/gestao/` | `/segmentos/materiais-de-construcao/` | Materiais de construção |
| `/campanha/gestao/` | `/segmentos/materiais-de-construcao/` | Material de Construção |
| `/campanha/gestao/` | `/segmentos/materiais-de-construcao/` | Materialde Construção |
| `/campanha/gestao/` | `/segmentos/pequeno-comercio/` | Pequeno comércio e MEI |
| `/campanha/gestao/` | `/solucoes/bot-whatsapp/` | Venda pelo WhatsApp |
| `/campanha/gestao/` | `/solucoes/controle-de-clientes/` | Cadastro de clientes |
| `/campanha/gestao/` | `/solucoes/controle-de-fiado/` | Caderninho de fiado |
| `/campanha/gestao/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |

## Páginas órfãs

- `/campanha/gestao/`
- `/campanha/pdv/`
- `/campanha/teste-gratis/`
- `/medicao/`
