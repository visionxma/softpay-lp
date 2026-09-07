# Changelog SEO — SoftPay

## 2026-09-07 — Rodada 4: expansão das landing pages de segmento

De 7 para **12 páginas de segmento**, com o padrão de 6 a 8 blocos aplicado às
prioridades do plano. Site em **54 páginas**, sitemap com 53 URLs.

### Páginas criadas

| URL | Palavra-chave principal |
|---|---|
| `/segmentos/loja-de-joias/` | sistema para loja de joias, sistema para joalheria |
| `/segmentos/empresas-com-filiais/` | sistema para empresa com filiais, sistema para rede de lojas |

Somam-se às três criadas na rodada anterior e publicadas hoje:
`/segmentos/loja-de-celulares-e-acessorios/`, `/segmentos/loja-de-autopecas/`
e `/segmentos/materiais-de-construcao/`.

### Páginas ampliadas — **todas as URLs preservadas**

| URL | Antes | Depois |
|---|---|---|
| `/segmentos/mercadinho/` | 4 blocos, 5 FAQ | 7 blocos, 9 FAQ |
| `/segmentos/distribuidora/` | 3 blocos, 5 FAQ | 8 blocos, 9 FAQ |
| `/segmentos/farmacia/` | **2 blocos**, 5 FAQ | 7 blocos, 9 FAQ |
| `/segmentos/pequeno-comercio/` | 3 blocos, 5 FAQ | 7 blocos, 9 FAQ, cobrindo MEI |
| `/segmentos/` (índice) | grade de links | 4 blocos, tabela segmento→recurso, CTA |
| `/segmentos/loja-de-variedades/` | 3 blocos, 5 FAQ | + bot do WhatsApp, 6 FAQ |
| `/segmentos/papelaria/` | 3 blocos, 5 FAQ | + bot do WhatsApp, 6 FAQ |

`distribuidora` passou a cobrir bebidas, alimentos e produtos em geral em seções
internas da mesma página, em vez de páginas separadas por tipo — que dariam três
textos quase idênticos competindo entre si.

`pequeno-comercio` passou a cobrir MEI na mesma URL, pelo mesmo motivo: não
criamos `/segmentos/mei-e-pequeno-comercio/`.

### Correções

- **Foto enganosa removida de duas páginas.** `loja-de-autopecas` e
  `materiais-de-construcao` reaproveitavam `distribuidora.webp` — foto de
  engradados de bebida — com `alt` descrevendo prateleiras e depósito de
  materiais. As duas ficaram sem figura até existir foto real; os prompts
  entraram em `docs/IMAGENS.md` (itens 9 a 12). Sitemap com imagem: 27 → 25.
- **`.page-note strong` quebrava frases ao meio.** Seletor descendente aplicava
  `display: block` a todo `<strong>` do texto da nota, não só ao título.
  Corrigido para `.page-note > strong`. Afetava 9 notas em 9 páginas, três delas
  já no ar: `/solucoes/bot-whatsapp/`, `/solucoes/nfe/` e `/solucoes/nfce/`.

### Links internos

O bot do WhatsApp — recurso mais diferenciado do produto e escrito depois dos
segmentos antigos — passou a ser citado e linkado em mercadinho, distribuidora,
farmácia, variedades e papelaria. `empresas-com-filiais` e
`/solucoes/multiplas-lojas/` ganharam link cruzado explícito, com um bloco
dizendo qual das duas ler (segmento descreve a empresa, solução descreve o
recurso).

`mapa_interlinks.py`: **54 páginas, 1440 links, 0 órfãs**.

### Arquivos alterados

- `tools/c_segmentos.py` — todo o conteúdo dos segmentos
- `tools/build.py` — índice `/segmentos/` e importação de `ul`, `nota`, `tabela`
- `public/style.css` — correção de `.page-note > strong`
- `docs/IMAGENS.md` — prompts 9 a 12
- `docs/seo/PLANO-SEGMENTOS.md` — status da implementação

### Verificação

`python3 tools/verifica.py` → **54 páginas, tudo certo**: estrutura, H1,
canonical, Open Graph, links internos, duplicatas e FAQ schema.

---

## 2026-09-04 — Rodada 1: nova home (landing page)

Implementação das seções do briefing que dizem respeito à **home / landing page**.
Nenhuma página nova foi criada nesta rodada.

### Arquivos alterados

- `index.html`
- `style.css` (bloco novo no fim do arquivo, nada existente foi removido)

### Arquivos criados

- `robots.txt`
- `sitemap.xml`
- `docs/seo/AUDITORIA-INICIAL.md`
- `docs/seo/CHANGELOG-SEO.md`

---

### 1. Metadata (§23, §27)

- `title`: `Sistema de Gestão para Pequenos Negócios | SoftPay`
- `meta description` reescrita conforme o briefing
- `link rel="canonical"` adicionado
- Open Graph completo (`type`, `site_name`, `locale`, `url`, `title`, `description`, `image`, `image:alt`)
- X/Twitter Card `summary_large_image`
- `meta robots` com `max-snippet` e `max-image-preview:large`
- `theme-color`, `author`, `geo.region`

### 2. Dados estruturados (§24)

Um único `application/ld+json` com `@graph`:

- `Organization` — SoftPay / VisionX Inova Simples (IS), CNPJ, endereço, telefone, e-mail, `areaServed: Brasil`. **Sem `sameAs`** (o briefing proíbe inventar perfis)
- `WebSite`
- `WebPage`
- `SoftwareApplication` — `featureList` só com recursos confirmados; `AggregateOffer` com os 4 planos reais (R$65 / R$69 / R$89 / R$109, BRL, mensal)
- `FAQPage` — 30 perguntas

O FAQ do schema é **gerado da mesma fonte** do FAQ visível: toda pergunta do JSON-LD existe no HTML da página. Não há `aggregateRating` nem review (seriam inventados).

### 3. Hero (§8)

- **H1:** "O sistema de gestão que entende o seu negócio."
- **Subheadline** do briefing, na íntegra
- **CTA** padronizado como "Começar grátis por 7 dias" em todos os botões principais
- **Prova:** "7 dias grátis · sem cartão · sem compromisso"

### 4. Seções novas (§9, §16–§20, §22)

| ID | Seção |
|---|---|
| `#segmentos` | Feito para o seu negócio — 7 cards de segmento |
| `#numeros` | Seu sistema mostra os números. O SoftPay ajuda você a entendê-los |
| `#estoque` | Quanto dinheiro está parado no seu estoque? |
| `#fiado` | Quanto seus clientes ainda precisam pagar? |
| `#decisao` | Não basta saber o que aconteceu. Você precisa saber o que fazer |
| `#loja-online` | Sua loja também vende pela internet |
| `#equipe` | Sua equipe e suas lojas no mesmo sistema |
| `#seguranca` | Seus dados protegidos na nuvem |
| `#suporte` | Quando você precisar de ajuda, fala com gente de verdade |
| `#faq` | 30 perguntas frequentes, em `<details>` nativo |

Ordem final da página: hero → preços → segmentos → números → estoque → fiado → decisão → depoimentos → funcionalidades → demonstração → loja online → equipe → segurança → suporte → benefícios → FAQ → CTA → rodapé.

Preços foram mantidos logo após o hero — a posição era uma decisão deliberada de CRO no código original.

### 5. Correções factuais

- **"Google Firebase" → Supabase / banco em nuvem.** A página afirmava uma tecnologia que contradiz o briefing. **[VALIDAR]** a descrição técnica exata com o time.
- **Prova social normalizada.** A página tinha "+100 usuários", "Mais de 100 lojistas ativos" e "123 lojistas" ao mesmo tempo. Tudo passou para "mais de 100". **[VALIDAR]** o número real.
- Emissão fiscal continua descrita como "em ativação", como já constava nos planos — não foi transformada em promessa.
- Nada de "100% seguro", "impossível perder dados" ou promessa de aumento de lucro.

### 6. Conteúdo marcado como exemplo

O bloco de cálculo de lucro (§9.2) usa números fictícios e traz badge visível **"Exemplo ilustrativo"** e nota de rodapé explicando que os valores dependem dos dados do próprio negócio.

### 7. Rodapé (§25)

- Descrição institucional real
- Nova coluna "Para o seu negócio" (âncoras dos segmentos)
- Coluna de contato ampliada (FAQ, suporte, segurança)
- Empresa responsável em destaque

### 8. Performance e acessibilidade (§33, §34, §35)

- `loading="lazy"` + `decoding="async"` nas imagens abaixo da dobra
- `width`/`height` nas imagens principais (reduz CLS)
- `alt` descritivo em todas as imagens (antes: "SoftPay Desktop", "Sistema Mobile", "Boutique"…)
- `aria-hidden="true" focusable="false"` nos SVGs decorativos
- Skip link "Ir para o conteúdo principal"
- `:focus-visible` com contorno visível
- `prefers-reduced-motion` respeitado nas transições novas
- FAQ em `<details>/<summary>` nativo — acessível por teclado, sem JS

---

## Deploy — resolvido nesta rodada

A investigação do ambiente mostrou que os pressupostos do código estavam desatualizados:

- `site.softpaybr.com` **já serve a LP na raiz** (GitHub Pages, repo `visionxma/controleapp`), e `/lp/` responde 404. O comentário do `<base href="/lp/">` não valia mais.
- **Os CTAs apontavam para `/auth`, que é 404 nesse domínio.** O app está em `www.softpaybr.com`. Todos os botões de teste grátis estavam quebrados em produção.

Correções aplicadas:

- `<base href="/lp/">` removido — quebraria todos os assets na raiz
- CTAs passam a apontar para `https://www.softpaybr.com/auth`
- seletor de atribuição de afiliados no `script.js` ajustado para os CTAs absolutos
- `canonical`, Open Graph e JSON-LD agora usam URLs de raiz
- `robots.txt` e `sitemap.xml` ficam na raiz do site, onde os crawlers os leem
- `_redirects` com **301 de `/lp/` → `/`**, preservando o link antigo

O site foi movido para `public/` e é publicado pelo **Cloudflare Pages**.
O passo a passo — inclusive a troca de DNS ainda pendente — está em [`../DEPLOY.md`](../DEPLOY.md).

---

## Pendências de validação — `[VALIDAR]`

- [ ] Descrição técnica exata da segurança (Supabase é o banco? criptografia? controles de acesso?)
- [ ] Número real de clientes ativos
- [ ] Emissão fiscal: o que já está ativo hoje, por plano
- [ ] Controle de filiais: como funciona e em quais planos
- [ ] Permissões por perfil de usuário — existem, ou é só multi-login?
- [ ] Importação/migração: formatos aceitos
- [ ] Recomendações automáticas (§9.5) — o produto sugere ações ou apenas exibe indicadores? A seção `#decisao` hoje fala **apenas** de painel, relatórios e curva ABC
- [ ] Oferta "7 dias grátis, sem cartão" confirmada no fluxo de `/auth`
- [ ] NFS-e e MDF-e: constam nos planos como "em ativação" — confirmar

---

## Próximos passos (§45)

Esta rodada cobriu a **Fase 6 (nova home)** e parte da **Fase 10 (SEO técnico)**. Continuam pendentes:

- **Fase 2/3** — pesquisa real de keywords e concorrentes; `MAPA-DE-KEYWORDS.md` (não foi criado: exige pesquisa real, e o briefing proíbe inventar volume de busca)
- **Fase 7/8** — páginas de solução e de segmento em `/solucoes/` e `/segmentos/`.
  Os cards de segmento da home estão hoje **sem link**, propositalmente, para não gerar 404. Há um comentário no HTML marcando o ponto exato onde virar link.
- **Fase 9** — guias e central de perguntas
- Página `/sobre/` e `/contato/` (§25)
- Google Search Console + `SEARCH-CONSOLE.md` (§42)
