# RETOMAR — o que fazer nesta sessão

> Handoff escrito em 2026-09-07, no fim de uma sessão que degradou (comandos
> passando de 9 minutos, `git push` sem concluir).
>
> **Como usar:** abra uma sessão nova no diretório do projeto e diga
> "execute o RETOMAR.md". Siga as etapas na ordem — a etapa 0 é bloqueante.

Projeto: `/Users/alexandrehenrique/Documents/Alexandre Henrique/Projetos Code/SoftPay - LP/softpay-lp`
Site: https://site.softpaybr.com · Repo: https://github.com/visionxma/softpay-lp

---

## ETAPA 0 — Destravar (bloqueante)

Há **dois commits de trabalho pronto que nunca foram publicados**. Nada do que
está descrito abaixo aparece no site até isso ser resolvido.

```bash
cd "/Users/alexandrehenrique/Documents/Alexandre Henrique/Projetos Code/SoftPay - LP/softpay-lp"

# 1. Verifique o que está pendente
git log --oneline -3
git status --short | head

# 2. Complete o build que ficou pela metade
python3 tools/fingerprint.py
python3 tools/verifica.py

# 3. Commite e publique
git add -A
git commit -m "Expande as landing pages de segmento"
git push origin main
```

**Se o push falhar com `fatal: mmap failed: Operation canceled`:** é limite de
memória do processo, não problema do repositório (21 MB, disco sobrando).
Rode num terminal do sistema, fora do Claude Code.

**Confira se subiu:**
```bash
gh api repos/visionxma/softpay-lp/commits/main --jq '.commit.message'
```

O deploy do Cloudflare Pages dispara sozinho quando o push chegar.

### O que está preso, exatamente

| Commit | Conteúdo |
|---|---|
| `8330a2e` (commitado) | Chat do WhatsApp com visual de conversa real (balões verdes, ticks, papel de parede) + correção do vão nas abas de funcionalidades |
| não commitado | Toda a expansão de segmentos descrita abaixo |

---

## ETAPA 1 — Validar o que já foi feito

Quatro páginas foram escritas e geradas, mas **nunca foram verificadas nem
vistas**. Antes de escrever mais, confirme que o padrão está correto.

| Página | O que foi feito |
|---|---|
| `/segmentos/loja-de-roupas/` | Reescrita como piloto: de 3 blocos/5 FAQ para **6 blocos/9 FAQ**. URL preservada |
| `/segmentos/loja-de-celulares-e-acessorios/` | **Criada** — 6 blocos, 7 FAQ |
| `/segmentos/loja-de-autopecas/` | **Criada** — 6 blocos, 7 FAQ |
| `/segmentos/materiais-de-construcao/` | **Criada** — 6 blocos, 7 FAQ |

Sitemap já regenerado: 51 URLs, 27 com imagem.

**Valide assim:**

1. `python3 tools/verifica.py` — deve terminar com "Tudo certo". Ele já pegou
   dois erros reais nesta sessão, então leve a sério o que ele apontar.
2. Veja a piloto renderizada. Não há navegador disponível, mas dá para
   pré-visualizar com `qlmanage` (veja "Ferramentas" no fim).
3. Confira em mobile, reduzindo a largura do preview.

Se algo estiver errado no padrão, **corrija antes** de replicar nas próximas —
é o que o briefing pede ao mandar validar a piloto primeiro.

---

## ETAPA 2 — Completar as páginas de segmento

Todo o conteúdo vive em `tools/c_segmentos.py`. Depois de editar, sempre:

```bash
python3 tools/build.py && python3 tools/sitemap.py && \
python3 tools/fingerprint.py && python3 tools/verifica.py
```

### 2.1 — Prioridade 1 (faltam duas)

- [ ] **`/segmentos/mercadinho/`** — hoje 4 blocos, 5 FAQ. Elevar ao padrão da
      piloto. Ângulo: variedade de itens, giro rápido, caixa e fiado de bairro.
- [ ] **`/segmentos/distribuidora/`** — hoje 3 blocos, 5 FAQ. Elevar ao padrão.
      **Cobrir bebidas, alimentos e outros produtos em seções internas desta
      mesma página** — não criar páginas separadas por tipo de distribuidora.

### 2.2 — Prioridade 2 (três)

- [ ] **`/segmentos/loja-de-joias/`** — criar. Ângulo: peça de alto valor,
      custo e margem, cliente recorrente, controle unitário.
- [ ] **`/segmentos/pequeno-comercio/`** — **preservar a URL** e ampliar para
      cobrir MEI. Já existe; não criar `/segmentos/mei-e-pequeno-comercio/`.
      Ângulo: simplicidade, preço acessível, saída do caderno e da planilha.
- [ ] **`/segmentos/empresas-com-filiais/`** — criar. **Atenção à
      canibalização** com `/solucoes/multiplas-lojas/`: a solução descreve *o
      recurso*, o segmento descreve *quem é a empresa e sua rotina*. Faça link
      cruzado explícito entre as duas, senão competem.

### 2.3 — Melhorias nos segmentos antigos

- [ ] **`/segmentos/farmacia/`** é a página mais fraca do site: só **2 blocos**.
- [ ] **Nenhum segmento antigo cita o bot do WhatsApp** — foram escritos antes
      de ele existir, e hoje é o recurso mais diferenciado do produto. Vale
      incluir em mercadinho, variedades, papelaria, farmácia e distribuidora.

### 2.4 — Página central

- [ ] **`/segmentos/`** é só uma grade de links com uma frase por card. Deve
      explicar para quais negócios o SoftPay é indicado, conectar segmentos a
      funcionalidades e levar ao teste grátis. Editar em `tools/build.py`
      (dicionário `INDICES`).

---

## O padrão validado — replique este

Estrutura aplicada na piloto e nas três novas:

1. **Rotina específica** daquele negócio (não genérica)
2. **Problemas específicos** do segmento, em lista
3. **Como o SoftPay resolve**, com subtítulos por recurso
4. **Bloco "o que ele não faz"** — os limites reais do produto
5. **Exemplo realista de uso**, passo a passo numerado, marcado como ilustrativo
6. **Perguntas que o sistema ajuda a responder**
7. **Tabela de planos adequados** ao perfil, sem alterar preços
8. **FAQ** com 7 a 9 perguntas
9. **4 a 6 links relacionados**, incluindo o bot do WhatsApp

O item 4 é deliberado e deve ser mantido: sem IMEI e ordem de serviço em
celulares, sem catálogo automotivo por veículo em autopeças, sem orçamento de
obra e controle de entrega em construção. Dizer o limite antes da venda evita
cliente frustrado e sustenta a credibilidade que o §32 do briefing pede.

---

## Regras que não podem ser quebradas

- **Não inventar** funcionalidade, integração, número, depoimento ou resultado.
- **Não alterar preços:** Nota Fiscal R$ 65 · Comércio R$ 69 · Loja R$ 89 ·
  ERP Completo R$ 109. Todos com 7 dias grátis, sem cartão.
- **Sempre dizer em qual plano** o recurso está. O bot do WhatsApp, a curva ABC,
  as variações, a loja online e a importação são **a partir do plano Loja**.
- **Emissão fiscal é "em ativação"** — nunca transformar em promessa.
- **Não prometer** segurança absoluta nem aumento de lucro.
- **Não criar página** só para ter URL. Cada uma precisa de intenção de busca
  clara e algo verdadeiro a dizer que as outras não dizem.
- **Preservar URLs** existentes ao melhorar uma página.

### Recursos confirmados (pode citar)

PDV e caixa · estoque · variações de tamanho e cor · custo e preço · curva ABC ·
fiado · clientes e CRM · atacado e varejo · loja online · Pix · cupons e
fidelidade · NF-e e NFC-e (em ativação) · multiusuário · filiais · relatórios ·
registro pelo WhatsApp.

### Segmentos que ficam de fora

Pizzarias, delivery, franquias, prestadores de serviço, grandes empresas e
distribuidoras de grãos. Só ganham página se houver funcionalidade real e
diferencial suficiente. Registrar como oportunidade futura no relatório.

---

## Ferramentas do projeto

```bash
python3 tools/build.py            # gera as páginas a partir de tools/c_*.py
python3 tools/sitemap.py          # regenera o sitemap (com extensão de imagem)
python3 tools/fingerprint.py      # versiona CSS/JS pelo hash — OBRIGATÓRIO após editar CSS/JS
python3 tools/verifica.py         # auditoria: estrutura, metadata, links, schema
python3 tools/mapa_interlinks.py  # regenera o mapa de links internos
```

**Pré-visualizar sem navegador** (a extensão do Chrome não conecta nesta
máquina). Monte um HTML com o CSS embutido, caminhos de imagem absolutos e sem
`<script>`, salve no scratchpad e rode:

```bash
qlmanage -t -s 1250 -o . preview.html
```

Depois leia o `.png` gerado. Para ver a página inteira, escale o body
(`transform: scale(0.105)`) — foi assim que os problemas de espaçamento
apareceram.

---

## Armadilhas conhecidas (todas já custaram retrabalho)

1. **`animation: ... both` esconde conteúdo.** Mantém `opacity: 0` no primeiro
   frame. Já escondeu o hero inteiro e os painéis das abas. Se o conteúdo é
   essencial, ele nasce visível e a animação vive numa classe aplicada depois.
2. **Existe `section { padding: 7rem 0 }` global.** Seções de artigo herdam isso
   e abrem vãos enormes. As classes `.section-block` e `.page-section` já zeram.
3. **Nunca criar redirect `/termos → /termos.html`.** O `html_handling` do
   Cloudflare faz o caminho inverso; as duas regras juntas geram loop infinito.
4. **Sempre rodar `fingerprint.py` após mexer em CSS ou JS.** Sem isso, o cache
   de um dia serve a versão antiga e o layout quebra para quem visita.
5. **`compatibility_date` do wrangler** não pode ser mais nova que o binário
   instalado, senão `wrangler pages dev` não sobe. Use `--compatibility-date=2026-07-01`.
6. **Contraste:** o azul do logo (`#1DA1F2`) dá 2,83:1 com texto branco e
   reprova em WCAG AA. Para texto sobre fundo colorido, use `--brand-600` ou
   mais escuro. Meça antes de decidir.

---

## Contexto do projeto

**Documentação em `docs/`:**

| Arquivo | Conteúdo |
|---|---|
| `seo/PLANO-SEGMENTOS.md` | Auditoria completa, canibalização, tabela de planejamento, status |
| `seo/AUDITORIA-INICIAL.md` | Estado inicial e pendências |
| `seo/CHANGELOG-SEO.md` | O que mudou e por quê |
| `seo/MAPA-DE-KEYWORDS.md` | Clusters — **sem volume de busca**, é hipótese |
| `seo/ROADMAP-SEO.md` | Prioridades, incluindo os `[VALIDAR]` |
| `seo/CHECKLIST-SEO.md` · `GUIA-DE-COPY.md` | Padrões a seguir |
| `DEPLOY.md` | Como publicar |
| `IMAGENS.md` | Especificação e prompts das fotos |

**Estado do site:** 52 páginas (49 antes + 3 novas). Deploy pelo Cloudflare
Pages, integração Git, output directory `public`.

---

## Pendências que dependem de você (não de código)

Estas estão no `ROADMAP-SEO.md` como P1 e travam melhorias reais:

- [ ] **Google Search Console** — não configurado. É o P0: sem ele, todo o
      trabalho de keywords é hipótese. Leva minutos pela verificação DNS na
      Cloudflare. Passo a passo em `docs/seo/SEARCH-CONSOLE.md`.
- [ ] Número real de clientes ativos (o site diz "mais de 100")
- [ ] Descrição técnica exata da segurança (Supabase é o banco? criptografia?)
- [ ] Situação da emissão fiscal por plano, hoje
- [ ] Controle de validade de produtos existe? (afeta a página de farmácia)
- [ ] Limite de fiado por cliente existe?
- [ ] Perfis de permissão por usuário, ou só multi-login?
- [ ] Estrutura de filiais: estoque compartilhado ou separado? (afeta a página
      de empresas com filiais)
- [ ] WhatsApp correto: (86) 99819-3851 ou (99) 98468-0391? As duas versões do
      site divergiam
- [ ] Screenshots reais do produto — §35 do briefing, não dá para gerar

---

## Entrega esperada ao final

1. Páginas criadas e aprimoradas, com URLs
2. Palavras-chave trabalhadas por página
3. Arquivos modificados
4. Links internos criados
5. Dados estruturados implementados
6. Resultado do `verifica.py`
7. Problemas encontrados
8. Pendências que dependem de informação comercial
9. Sugestões de páginas futuras, sem implementá-las
10. Recomendações de acompanhamento no Search Console
