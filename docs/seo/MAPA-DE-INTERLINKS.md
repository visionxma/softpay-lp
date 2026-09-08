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
| Páginas | 66 |
| Links internos (com âncora) | 1845 |
| Links contextuais no corpo | 622 |
| Páginas órfãs | 0 |

> O `/404` é excluído da checagem de órfãs de propósito: página de erro não
> deve receber link.

## Páginas mais linkadas

| Página | Links de entrada |
|---|---|
| `/` | 65 |
| `/termos` | 62 |
| `/privacidade` | 62 |
| `/reembolso` | 62 |
| `/segmentos/` | 61 |
| `/solucoes/` | 61 |
| `/guias/` | 61 |
| `/sobre/` | 61 |
| `/perguntas/` | 61 |
| `/solucoes/sistema-pdv/` | 61 |
| `/solucoes/controle-de-fiado/` | 61 |
| `/solucoes/loja-online/` | 61 |

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
| `/contato/` | `/perguntas/` | PerguntasDúvidas frequentes |
| `/contato/` | `/perguntas/tem-suporte-humano/` | Suporte humanoComo funciona |
| `/contato/` | `/privacidade` | Política de Privacidade |
| `/contato/` | `/reembolso` | Política de Reembolso |
| `/contato/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/contato/` | `/sobre/` | Sobre o SoftPayQuem está por trás |
| `/contato/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/` | `/guias/checklist-reforma-tributaria-2027/` | Checklist da reforma tributária até janeiro de 2027Seis passos, em ord |
| `/guias/` | `/guias/como-calcular-lucro-da-loja/` | Como calcular o lucro de uma lojaResposta curta: lucro bruto é o fatur |
| `/guias/` | `/guias/como-calcular-margem-de-lucro/` | Como calcular a margem de lucroResposta curta: margem é o lucro dividi |
| `/guias/` | `/guias/como-controlar-caixa-da-loja/` | Como controlar o caixa de uma lojaResposta curta: registre toda entrad |
| `/guias/` | `/guias/como-controlar-estoque/` | Como controlar o estoque de uma lojaResposta curta: registre o que ent |
| `/guias/` | `/guias/como-controlar-fiado/` | Como controlar vendas fiadasResposta curta: registre cada venda fiada  |
| `/guias/` | `/guias/como-escolher-sistema-de-gestao/` | Como escolher um sistema de gestãoA maioria das escolhas ruins tem a m |
| `/guias/` | `/guias/como-organizar-uma-loja/` | Como organizar uma lojaResposta curta: organize uma coisa de cada vez, |
| `/guias/` | `/guias/como-sair-do-caderno/` | Como sair do cadernoResposta curta: não transcreva o caderno inteiro |
| `/guias/` | `/guias/meu-sistema-precisa-mudar-reforma-tributaria/` | Meu sistema precisa mudar por causa da reforma tributária?Resposta cur |
| `/guias/` | `/guias/nfe-nfce-o-que-e/` | NF-e e NFC-e: qual a diferençaA diferença é o cliente |
| `/guias/` | `/guias/quanto-custa-um-sistema-de-gestao/` | Quanto custa um sistema de gestão para comércioA faixa de mercado para |
| `/guias/` | `/guias/reforma-tributaria-comercio/` | Reforma tributária no comércio: o que muda e quandoDuas datas resolvem |
| `/guias/` | `/guias/reforma-tributaria-mei/` | Reforma tributária e o MEIA mudança mais concreta para o MEI tem data: |
| `/guias/` | `/guias/vale-a-pena-ter-sistema-de-gestao/` | Vale a pena ter um sistema de gestão na loja?Resposta curta e honesta: |
| `/guias/` | `/perguntas/` | PerguntasDúvidas antes de contratar |
| `/guias/` | `/privacidade` | Política de Privacidade |
| `/guias/` | `/reembolso` | Política de Reembolso |
| `/guias/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestãoGuia completo |
| `/guias/` | `/solucoes/` | SoluçõesComo o SoftPay ajuda |
| `/guias/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
| `/guias/checklist-reforma-tributaria-2027/` | `/guias/como-controlar-estoque/` | Como controlar estoqueO cadastro de produtos |
| `/guias/checklist-reforma-tributaria-2027/` | `/guias/como-sair-do-caderno/` | Como sair do cadernoSair do papel |
| `/guias/checklist-reforma-tributaria-2027/` | `/guias/meu-sistema-precisa-mudar-reforma-tributaria/` | Meu sistema precisa mudar?As perguntas ao fornecedor |
| `/guias/checklist-reforma-tributaria-2027/` | `/guias/meu-sistema-precisa-mudar-reforma-tributaria/` | meu sistema precisa mudar? |
| `/guias/checklist-reforma-tributaria-2027/` | `/guias/nfe-nfce-o-que-e/` | O que é NF-e e NFC-eA diferença entre as duas |
| `/guias/checklist-reforma-tributaria-2027/` | `/guias/reforma-tributaria-comercio/` | Reforma tributária no comércioAs datas e o que muda |
| `/guias/checklist-reforma-tributaria-2027/` | `/guias/reforma-tributaria-mei/` | Reforma tributária e o MEIA obrigação de 2027 |
| `/guias/checklist-reforma-tributaria-2027/` | `/privacidade` | Política de Privacidade |
| `/guias/checklist-reforma-tributaria-2027/` | `/reembolso` | Política de Reembolso |
| `/guias/checklist-reforma-tributaria-2027/` | `/sistema-de-gestao-para-pequenos-negocios/` | O que é sistema de gestão |
| `/guias/checklist-reforma-tributaria-2027/` | `/solucoes/sistema-de-estoque/` | Controle de estoque |
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

## Páginas órfãs

Nenhuma. Toda página tem pelo menos um link de entrada.
