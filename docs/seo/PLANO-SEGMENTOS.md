# Plano de expansão das landing pages de segmento

Auditoria e planejamento feitos em 2026-09-06. **Ainda não implementado** —
este documento existe para o trabalho não precisar ser refeito.

---

## 1. Auditoria — o que existe hoje

**49 páginas publicadas.**

| Área | Qtd | URLs |
|---|---|---|
| `/segmentos/` | 7 | mercadinho, loja-de-roupas, loja-de-variedades, papelaria, farmacia, distribuidora, pequeno-comercio |
| `/solucoes/` | 10 | sistema-pdv, sistema-de-estoque, controle-de-fiado, sistema-financeiro, controle-de-clientes, loja-online, bot-whatsapp, multiplas-lojas, nfe, nfce |
| `/guias/` | 7 | como-controlar-estoque, como-controlar-caixa-da-loja, como-controlar-fiado, como-calcular-lucro-da-loja, como-calcular-margem-de-lucro, como-organizar-uma-loja, como-sair-do-caderno |
| `/perguntas/` | 13 | quanto-custa, loja-pequena-precisa, caderno-ou-sistema, excel-ou-sistema, qual-sistema-para-mercadinho, e-seguro, celular, varios-dispositivos, migrar, e-dificil-aprender, preciso-instalar, suporte-humano, brasil-inteiro |
| Outras | 12 | pilar, sobre, contato, 4 índices, 3 legais, home, 404 |

### Estado dos 7 segmentos

| Segmento | Title (chars) | FAQ | Blocos | Figura |
|---|---|---|---|---|
| mercadinho | 55 | 5 | 4 | sim |
| loja-de-roupas | 47 | 5 | 3 | sim |
| loja-de-variedades | 49 | 5 | 3 | sim |
| papelaria | 56 | 5 | 3 | sim |
| farmacia | 55 | 5 | **2** | sim |
| distribuidora | 52 | 5 | 3 | sim |
| pequeno-comercio | 54 | 5 | 3 | sim |

Todos têm title único, H1 único, canonical próprio, `WebPage` +
`BreadcrumbList` + `FAQPage`, imagem própria e 3 links relacionados.
**Zero duplicatas** de title, description ou H1 no site — verificado por
`tools/verifica.py`.

### Problemas encontrados

1. **Conteúdo raso frente ao briefing.** 2 a 4 blocos e exatamente 5 perguntas
   por página. Falta: exemplo realista de uso no cotidiano, "perguntas que o
   sistema ajuda a responder" e planos adequados ao perfil.
2. **Farmácia com apenas 2 blocos** — a mais fraca do conjunto.
3. **Nenhum segmento cita o bot do WhatsApp.** As páginas foram escritas antes
   de ele existir, e ele é o recurso mais diferenciado do produto hoje.
4. **A página central `/segmentos/`** é só uma grade de links com uma frase por
   card. Deveria explicar para quais negócios o SoftPay é indicado.
5. **Uniformidade excessiva**: mesma contagem de FAQ e mesma estrutura em todas.
   Não é conteúdo duplicado, mas é padronizado demais.

### Canibalização

| Caso | Decisão |
|---|---|
| `mei-e-pequeno-comercio` pedido vs `/segmentos/pequeno-comercio/` existente | **Preservar a URL atual** e ampliar o conteúdo para cobrir MEI |
| `empresas-com-filiais` vs `/solucoes/multiplas-lojas/` | Separar por eixo: a solução descreve **o recurso**, o segmento descreve **quem é a empresa e sua rotina**. Exige link cruzado explícito |
| `distribuidora` | URL única, com bebidas/alimentos/outros em seções internas. Sem páginas separadas |

---

## 2. Tabela de planejamento

| Página | URL | Keyword principal | Intenção | Diferencial | Status | Ação |
|---|---|---|---|---|---|---|
| Loja de roupas | `/segmentos/loja-de-roupas/` | sistema para loja de roupas | comercial | Grade tamanho/cor, coleção, peça parada | Existe | **Aprimorar (piloto)** |
| Mercadinho | `/segmentos/mercadinho/` | sistema para mercadinho | comercial | Giro rápido, fiado de bairro, caixa | Existe | Aprimorar |
| Distribuidora | `/segmentos/distribuidora/` | sistema para distribuidora | comercial | Volume, atacado/varejo, NF-e; seções bebidas e alimentos | Existe | Aprimorar |
| Celulares | `/segmentos/loja-de-celulares-e-acessorios/` | sistema para loja de celulares | comercial | Aparelho vs. acessório, margem por categoria | Novo | Criar |
| Autopeças | `/segmentos/loja-de-autopecas/` | sistema para autopeças | comercial | Catálogo amplo, localizar peça, baixo giro | Novo | Criar |
| Mat. construção | `/segmentos/materiais-de-construcao/` | sistema para loja de material de construção | comercial | Atacado/varejo, venda grande, fiado de obra | Novo | Criar |
| Joias | `/segmentos/loja-de-joias/` | sistema para joalheria | comercial | Peça de alto valor, custo, cliente recorrente | Novo | Criar (P2) |
| MEI e pequeno comércio | `/segmentos/pequeno-comercio/` | sistema para MEI | comercial | Simplicidade, preço, saída do caderno | Existe | Ampliar para MEI |
| Empresas com filiais | `/segmentos/empresas-com-filiais/` | sistema para empresa com filiais | comercial | Multiusuário, unidades, visão consolidada | Novo | Criar (P2) |

> **Volume de busca não validado.** Sem ferramenta de keywords e sem Search
> Console, as prioridades acima são hipóteses fundamentadas em leitura de SERP.
> Ver a ressalva no `MAPA-DE-KEYWORDS.md`.

---

## 3. Estrutura a aplicar em cada página

O template (`tools/template.py`) já entrega breadcrumb, H1, metadados,
canonical, Open Graph, JSON-LD, FAQ, relacionados e CTA. O que falta é
**conteúdo**, por página:

1. Rotina específica daquele negócio
2. Problemas específicos do segmento
3. Como o SoftPay ajuda
4. Funcionalidades mais relevantes **para aquele segmento**
5. **Exemplo realista de uso no cotidiano** (novo)
6. **Perguntas que o sistema ajuda a responder** (novo)
7. **Planos adequados ao perfil**, sem alterar preços (novo)
8. FAQ ampliada
9. Segmentos e soluções relacionadas

## 4. Recursos confirmados que podem ser citados

PDV e caixa · estoque · variações de tamanho e cor · custo e preço · curva ABC ·
fiado · clientes e CRM · atacado e varejo · loja online · Pix · cupons e
fidelidade · NF-e e NFC-e (em ativação) · multiusuário · filiais · relatórios ·
registro pelo WhatsApp (a partir do plano Loja).

**Respeitar sempre o plano em que cada recurso está disponível.**

## 5. Segmentos deixados de fora

Registrados como oportunidade futura, sem página: pizzarias, delivery em geral,
franquias, prestadores de serviço, grandes empresas, distribuidoras de grãos.
Só ganham página se houver funcionalidade real e diferencial suficiente.

---

## 6. Status da implementação

### Feito (em `tools/c_segmentos.py`, ainda não publicado)

| Página | Estado |
|---|---|
| `/segmentos/loja-de-roupas/` | **Reescrita como piloto.** De 3 blocos/5 FAQ para 6 blocos/9 FAQ. URL preservada |
| `/segmentos/loja-de-celulares-e-acessorios/` | **Criada.** 6 blocos, 7 FAQ |
| `/segmentos/loja-de-autopecas/` | **Criada.** 6 blocos, 7 FAQ |
| `/segmentos/materiais-de-construcao/` | **Criada.** 6 blocos, 7 FAQ |

O padrão validado na piloto e aplicado nas três novas:

1. Rotina específica do negócio
2. Problemas específicos do segmento
3. Como o SoftPay resolve
4. **Bloco "o que ele não faz"** — limites reais do produto
5. **Exemplo realista de uso**, passo a passo
6. **Perguntas que o sistema ajuda a responder**
7. **Tabela de planos adequados** ao perfil, sem alterar preços
8. FAQ ampliada (7 a 9 perguntas)
9. 4 a 6 links relacionados, incluindo o bot do WhatsApp

O bloco "o que ele não faz" é deliberado: sem IMEI e ordem de serviço em
celulares, sem catálogo automotivo por veículo em autopeças, sem orçamento de
obra e controle de entrega em construção. Evita cliente frustrado e sustenta a
credibilidade que o §32 do briefing pede.

### Falta

- [ ] Aprimorar `/segmentos/mercadinho/` (P1) — hoje 4 blocos, 5 FAQ
- [ ] Aprimorar `/segmentos/distribuidora/` (P1) — hoje 3 blocos, 5 FAQ; incluir seções internas de bebidas, alimentos e outros produtos
- [ ] Criar `/segmentos/loja-de-joias/` (P2)
- [ ] Ampliar `/segmentos/pequeno-comercio/` para cobrir MEI (P2) — **preservar a URL**
- [ ] Criar `/segmentos/empresas-com-filiais/` (P2), com link cruzado explícito para `/solucoes/multiplas-lojas/`
- [ ] Reescrever a página central `/segmentos/` para explicar os negócios atendidos, não só listar
- [ ] Rodar `build.py`, `sitemap.py`, `fingerprint.py`, `verifica.py`
- [ ] Validar visualmente a piloto em desktop e mobile
- [ ] Considerar aprimorar `/segmentos/farmacia/`, a página mais fraca do conjunto (2 blocos)
- [ ] Citar o bot do WhatsApp nos segmentos antigos, que foram escritos antes de ele existir

## 7. Pendência de ambiente

Este plano foi feito mas **não implementado** porque a sessão degradou: comandos
de leitura de arquivo passaram a levar minutos e o `git push` parou de concluir
(`fatal: mmap failed`). Há um commit local não publicado (`8330a2e` — chat do
WhatsApp com visual de conversa real e correção do vão nas abas).

Ao retomar em sessão nova: `git push origin main`, depois seguir deste
documento a partir da seção 2.
