# Roadmap de SEO — SoftPay

Atualizado em 2026-09-06.

## Concluído

**Fase 1 — Auditoria** · `AUDITORIA-INICIAL.md`
**Fase 2/3 — Pesquisa e mapa de keywords** · `MAPA-DE-KEYWORDS.md` (sem volume; ver ressalva no documento)
**Fase 4 — Arquitetura** · `ARQUITETURA-SEO.md`
**Fase 5 — Interlinks** · `MAPA-DE-INTERLINKS.md`, gerado dos links reais
**Fase 6 — Nova home** · página pilar comercial na raiz
**Fase 7 — Página pilar informacional** · `/sistema-de-gestao-para-pequenos-negocios/`
**Fase 8 — Segmentos** · 7 páginas
**Fase 9 — Guias e perguntas** · 7 guias + 13 perguntas
**Fase 10 — SEO técnico** · canonical, OG, schema, sitemap, robots, 404, redirects
**Fase 11 — Acessibilidade e performance** · skip link, foco visível, lazy loading, dimensões de imagem
**Fase 12 — QA** · `tools/verifica.py`, passando em 48 páginas

Também: 9 páginas de solução, `/sobre/`, `/contato/` e os 4 índices de cluster.

## P0 — Bloqueia tudo

- [ ] **Configurar o Google Search Console.** Sem ele, toda priorização daqui
      para frente continua sendo hipótese. Ver `SEARCH-CONSOLE.md`.

## P1 — Validações com o produto

Itens escritos de forma conservadora por não terem sido confirmados. Cada um
resolvido melhora uma página específica:

- [ ] Descrição técnica exata da segurança → `/perguntas/sistema-de-gestao-e-seguro/`
- [ ] Número real de clientes ativos → home (hoje "mais de 100")
- [ ] Situação da emissão fiscal por plano → `/solucoes/nfe/` e `/nfce/`
- [ ] Controle de validade de produtos → `/segmentos/farmacia/`
- [ ] Limite de fiado por cliente → `/solucoes/controle-de-fiado/`
- [ ] Perfis de permissão por usuário → `/solucoes/multiplas-lojas/`
- [ ] Estrutura de filiais (estoque compartilhado ou separado?) → idem
- [ ] Formatos aceitos na importação → `/perguntas/posso-migrar-de-outro-sistema/`
- [ ] Formas de pagamento da loja online → `/solucoes/loja-online/`
- [ ] Recomendações automáticas: o produto sugere ação ou só exibe indicador?
      → destrava o cluster `/inteligencia/` (§14)
- [ ] WhatsApp correto: (86) 99819-3851 ou (99) 98468-0391?
- [ ] Oferta "7 dias sem cartão" confirmada no fluxo de `/auth`

## P2 — Depois dos primeiros dados

- [ ] Revisar `title` e `meta description` das páginas com CTR baixo
- [ ] Ajustar as páginas em posição 5–20 (as que estão perto de subir)
- [ ] Criar guias para lacunas do §5 ainda descobertas:
      "quais produtos dão lucro", "como descobrir produtos encalhados",
      "como saber o que comprar para minha loja"
- [ ] Avaliar `/segmentos/` adicionais só se houver demanda real

## P3 — Expansão

- [ ] Cluster `/inteligencia/` (§14) — depende da validação sobre recomendações
- [ ] Comparativos (§31) — só com pesquisa real; nunca difamar concorrente
- [ ] Calculadoras (§39): margem, preço de venda, estoque parado
- [ ] Screenshots reais do produto no lugar das imagens genéricas (§35)
- [ ] Depoimentos verdadeiros adicionais (§32)

## P4 — Infra

- [ ] GA4 ou equivalente para medir conversão (§43)
- [ ] Bing Webmaster Tools
- [ ] Reduzir pesos da fonte Poppins (6 pesos carregados hoje)
- [ ] Otimizar imagens de depoimento (`.jpeg`/`.png` com espaço no nome)
- [ ] Revisar o bloqueio de clique direito e de atalhos no `script.js` —
      atrapalha a experiência sem benefício real

## Princípio

> 10 páginas excelentes > 100 artigos genéricos.

Não crie página para preencher a árvore. Cada nova página precisa de intenção
de busca clara e de algo verdadeiro a dizer que as existentes não dizem.
