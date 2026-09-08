# Pendências — SoftPay

> Estado em 2026-09-08. Este documento lista **só o que falta**. O que já foi
> feito está em `seo/CHANGELOG-SEO.md` e `seo/PLANO-SEGMENTOS.md`.
>
> O item do link do WhatsApp saiu daqui: o número foi corrigido no commit
> `b297d74`, e os 108 links das 52 páginas usam `wa.me/5586998193851`.

**Onde o projeto está:** 54 páginas no ar, sitemap com 53 URLs, `verifica.py`
sem apontamentos, 1478 links internos e nenhuma página órfã. Todas as 22 páginas
de segmento e solução com 6 blocos ou mais.

Cada item abaixo diz **quem resolve**: você (informação ou acesso que só você
tem), eu (código) ou outra pessoa (o site `www`, que não vive neste repositório).

---

## 1. A política de privacidade pode nomear o banco errado — VOCÊ

`/privacidade.html` afirma:

> Dados armazenados em servidores seguros (**Google Firebase**) com criptografia
> em repouso e em trânsito. Comunicações protegidas por HTTPS/TLS. Senhas
> armazenadas com hash criptográfico.

A pendência aberta pergunta se o banco é **Supabase**. Se for, a política
declara o operador de dados errado — isso é LGPD, não detalhe de texto.

**O que fazer:** confirmar qual é o banco. Se for Firebase mesmo, a pendência
fecha sem mudar nada.

---

## 2. Seis respostas de produto que estão travando o texto público — VOCÊ

Hoje **22 páginas mandam o visitante perguntar ao suporte**. Escrevi assim de
propósito — prometer o que não existe seria pior —, mas cada "confirme com o
suporte" é atrito antes do teste grátis, e passa a impressão de que a empresa
não conhece o próprio produto.

| Pergunta | Páginas presas | Onde dói mais |
|---|---|---|
| Existe **controle de validade**? | 8 | Farmácia, mercadinho, distribuidora de alimentos |
| A **emissão fiscal** ainda é "em ativação"? Em quais planos? | 10 | Distribuidora, autopeças, construção |
| Existem **perfis de permissão** por usuário, ou só multi-login? | 5 | Empresas com filiais |
| **Filiais**: estoque compartilhado ou separado? | 1 | Empresas com filiais, distribuidora |
| Existe **transferência de mercadoria** entre lojas? | 1 | Empresas com filiais |
| Existe **limite de fiado** por cliente? | 3 | Fiado, mercadinho, joias |

**O que fazer:** responder as seis. Cada resposta vira frase afirmativa em
várias páginas de uma vez — não preciso reescrever nada do zero.

---

## 3. Uma alegação sem lastro na home — VOCÊ

Logo abaixo dos logos de cliente, visível na primeira dobra:

> **Mais de 100 lojistas** já organizam as vendas com o SoftPay

**O que fazer:** confirmar se o número é real. Se for menor, vale trocar por
algo verdadeiro. Número redondo inflado derruba a confiança exatamente de quem
estava perto de assinar.

---

## 4. Google Search Console — VOCÊ, em andamento

A tag de verificação **já está publicada** na home:

```html
<meta name="google-site-verification" content="EcObWbOkVcOITS-2SRFwPqcN9A-MfdEsYmuBpwq1VyQ" />
```

Falta criar a propriedade. Passo a passo:

1. Abrir `https://search.google.com/search-console/welcome`
   (essa URL pula o seletor de propriedade, evitando cair no FroX por engano)
2. Caixa da direita, "Prefixo do URL": `https://site.softpaybr.com/`
3. Método **Tag HTML** → Verificar
   Se o Google mostrar um `content` diferente do de cima, me avise que eu troco
4. Sitemaps → enviar `sitemap.xml`
5. Inspeção de URL → Solicitar indexação nestas seis:

```
https://site.softpaybr.com/segmentos/loja-de-joias/
https://site.softpaybr.com/segmentos/empresas-com-filiais/
https://site.softpaybr.com/segmentos/loja-de-celulares-e-acessorios/
https://site.softpaybr.com/segmentos/loja-de-autopecas/
https://site.softpaybr.com/segmentos/materiais-de-construcao/
https://site.softpaybr.com/
```

O resto das 53 URLs o sitemap entrega sozinho. A inspeção manual tem limite
diário e só antecipa o rastreio — não melhora posição.

> **Não use o método "Arquivo HTML" neste site.** O `html_handling` do
> Cloudflare Pages remove o `.html` da URL e responde 308 em vez de 200. O
> arquivo `google5b560c7a36020dd4.html` está publicado, mas a tag é o caminho
> confiável. Ver armadilha 3 no `RETOMAR.md`.

Depois de verificar, vale criar **também** uma propriedade de Domínio
(`softpaybr.com`, por DNS na Cloudflare) para enxergar o `www` junto — ver
seção 8.

---

## 5. Imagens — VOCÊ

### Quatro fotos de segmento

Estas páginas estão no ar **sem imagem de abertura**:

- `/segmentos/loja-de-autopecas/`
- `/segmentos/materiais-de-construcao/`
- `/segmentos/loja-de-joias/`
- `/segmentos/empresas-com-filiais/`

Ficaram assim de propósito: reaproveitar `distribuidora.webp` — que mostra
engradados de bebida — exigia um `alt` que não descreve a imagem. Isso é
defeito de acessibilidade e mina a credibilidade de páginas cujo argumento
inteiro é especificidade de segmento.

Prompts prontos em `docs/IMAGENS.md`, itens 9 a 12. Especificação: 1600×660,
`.webp` q80, até 90 KB, em `public/assets/lojistas/`.

### Screenshots reais do produto

O §35 do briefing pede telas reais do SoftPay. Não dá para gerar — precisam
sair do sistema.

---

## 6. Conteúdo — FEITO em 2026-09-07

O cluster `/solucoes/` era a metade fraca do site depois da rodada de
segmentos. **Não é mais.** As 11 páginas abaixo do padrão foram reescritas:

```
antes:  solucoes 2 a 3 blocos · 5 FAQ   (9 das 10 páginas)
depois: todas as 22 páginas com 6 ou mais blocos · 0 abaixo do padrão
```

| Página | Antes | Depois |
|---|---|---|
| `/solucoes/sistema-pdv/` | 2 · 5 | 7 · 9 |
| `/solucoes/controle-de-fiado/` | 2 · 5 | 7 · 9 |
| `/solucoes/controle-de-clientes/` | 2 · 5 | 7 · 9 |
| `/solucoes/loja-online/` | 2 · 5 | 7 · 9 |
| `/solucoes/multiplas-lojas/` | 2 · 5 | 7 · 9 |
| `/solucoes/nfe/` | 2 · 5 | 7 · 9 |
| `/solucoes/nfce/` | 2 · 5 | 7 · 9 |
| `/solucoes/sistema-de-estoque/` | 3 · 5 | 7 · 9 |
| `/solucoes/sistema-financeiro/` | 3 · 5 | 7 · 9 |
| `/segmentos/loja-de-variedades/` | 3 · 6 | 6 · 6 |
| `/segmentos/papelaria/` | 3 · 6 | 6 · 6 |

Mapa de links: **54 páginas, 1478 links, 0 órfãs**.

### O que ficou pendente dentro deste item

As páginas foram escritas **antes** das respostas da seção 3, como você
escolheu. Isso significa que 6 assuntos continuam saindo como "confirme com o
suporte" no texto público, agora também nas soluções:

- validade e lote (estoque, e nos segmentos de farmácia e alimentos)
- limite de fiado por cliente
- perfis de permissão por usuário
- estoque por filial e transferência entre lojas
- contas a pagar com vencimento (financeiro)
- emissão fiscal em ativação (NF-e, NFC-e e todos os planos)
- impressora térmica e gaveta (PDV)
- domínio próprio na loja online

**Quando você responder a seção 3, cada resposta vira afirmação em várias
páginas de uma vez** — é uma passada de edição, não uma reescrita.

## 7. O outro site no mesmo domínio — OUTRA PESSOA

Descoberto em 2026-09-07. Não está neste repositório.

| Host | O que é | Título |
|---|---|---|
| `www.softpaybr.com` | Aplicação SPA | SoftPay — PDV, Estoque e Vendas para o seu Negócio |
| `site.softpaybr.com` | Esta landing page | Sistema de Gestão para Pequenos Negócios \| SoftPay |

O apex `softpaybr.com` redireciona para `www`. Os dois disputam as mesmas
consultas: a description do `www` cita "PDV moderno, controle de estoque,
PIX/cartão, fiado, relatórios e Curva ABC" — o mesmo vocabulário desta landing.
O Google precisa escolher um, e divide autoridade entre os dois.

### Problemas no `www`

1. **O redirect do apex é 307, não 301.** Temporário — diz ao Google para *não*
   consolidar sinais entre `softpaybr.com` e `www`.
2. **O sitemap do `www` lista outro domínio:** URLs de `softpayco.com`
   (`/planes-info`, `/contacto`). Sitemap só aceita URLs do próprio host; o
   Google descarta e registra erro.
3. **`/auth` está no sitemap.** Página de login não deve ser indexada.
4. **O sitemap lista URLs do apex**, que redirecionam — erro leve no Google.
5. **Sem `h1` no HTML servido.** Sendo SPA, depende de JS.

### O que decidir

Qual host é a porta de entrada da marca na busca:

- **Manter os dois com papéis distintos:** `www` como aplicação (com `noindex`
  em `/auth` e afins) e `site` como o conteúdo que busca tráfego.
- **Consolidar:** landing no apex, aplicação em `app.softpaybr.com`. É o
  arranjo mais comum e o que mais concentra autoridade, mas exige redirecionar
  tudo com 301.

Não dá para decidir sem os dados do Search Console.

---

## 8. Oportunidades registradas, não implementadas

Páginas de segmento que só valem se houver funcionalidade real que as sustente:
pet shop, loja de calçados, ótica, loja de brinquedos, tabacaria.

**Ficam de fora hoje:** pizzaria, delivery, prestador de serviço com agenda e
ordem de serviço, gestão de franquia e rede com mais de 10 acessos simultâneos.
Falta recurso específico — e a página `/segmentos/` já diz isso ao visitante.

Nenhuma página nova sem intenção de busca clara e algo verdadeiro a dizer que
as outras não dizem.

---

## Ordem sugerida

| # | O quê | Quem | Por quê |
|---|---|---|---|
| 1 | Terminar o Search Console | Você | Sem ele, tudo é hipótese |
| 2 | Responder as seis perguntas de produto | Você | Destrava 22 páginas e a seção 6 |
| 3 | Confirmar Firebase × Supabase | Você | LGPD |
| 4 | ~~Reescrever `/solucoes/`~~ | ~~Eu~~ | **Feito em 2026-09-07** |
| 5 | Produzir as 4 fotos | Você | Páginas no ar sem imagem |
| 6 | Decidir `www` × `site` | Vocês | Depende dos dados do passo 2 |

Depois das respostas da seção 2, sobra uma passada de edição trocando
"confirme com o suporte" por afirmação nas páginas que ganharam esse texto.
