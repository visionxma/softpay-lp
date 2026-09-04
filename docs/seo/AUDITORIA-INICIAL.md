# Auditoria inicial de SEO — SoftPay LP

Data: 2026-09-04
Escopo auditado: `softpay-lp/` (landing page servida em `https://site.softpaybr.com/lp/`)

---

## 1. Stack e deploy

| Item | Situação |
|---|---|
| Framework | Nenhum. HTML + CSS + JS estáticos, sem build, sem `package.json` |
| Arquivos | `index.html`, `style.css`, `script.js`, `termos.html`, `privacidade.html`, `reembolso.html` |
| Rotas | Nenhum roteador. Navegação da home é por âncoras (`#hero`, `#pricing`, …) |
| Base URL | `<base href="/lp/">` — a LP é servida **dentro do app**, no caminho `/lp/` |
| Dependências externas | Google Fonts (Poppins) e Meta Pixel (2 IDs) |
| Analytics | Meta Pixel com eventos `PageView`, `ViewContent`, e tracking de CTA em `script.js`. **Sem Google Analytics e sem Google Search Console detectados** |

## 2. SEO técnico — estado ANTES

| Item | Antes |
|---|---|
| `<title>` | "SoftPay - Gestão de vendas e estoque para seu Negócio" — não alinhado ao posicionamento nem a termo de busca |
| Meta description | Genérica, sem menção ao teste grátis |
| Canonical | **Ausente** |
| Open Graph | **Ausente** |
| Twitter/X Card | **Ausente** |
| `robots` meta | Ausente |
| `robots.txt` | **Inexistente** |
| `sitemap.xml` | **Inexistente** |
| Schema / JSON-LD | **Inexistente** |
| `lang` | `pt-BR` — OK |
| H1 | 1 único (OK), mas com texto de oferta, não de posicionamento |
| Hierarquia de headings | Consistente (H1 → H2 → H3) |
| Breadcrumbs | Não aplicável (página única) |

## 3. Conteúdo — lacunas frente ao briefing

Seções existentes antes: hero, preços, depoimentos, funcionalidades, demonstração, benefícios, CTA, rodapé.

**Ausentes:**

- Seção por segmento (mercadinho, roupas, variedades, papelaria, farmácia, distribuidora, pequeno comércio)
- Diferenciação "mostra os números × ajuda a entender"
- Bloco de estoque como dinheiro parado
- Bloco de fiado
- Bloco de decisão ("o que fazer com os dados")
- Segurança dos dados
- Suporte humano
- Loja online
- Multiusuário e filiais
- FAQ

## 4. Inconsistências e erros factuais encontrados

| # | Problema | Onde | Tratamento |
|---|---|---|---|
| 1 | **"Google Firebase"** citado como tecnologia de segurança | card "Seguro" da seção Benefícios | **Corrigido** para Supabase / banco em nuvem, conforme briefing. **[VALIDAR]** com o time técnico |
| 2 | Três números de prova social diferentes na mesma página: "+100 usuários", "Mais de 100 lojistas ativos", "123 lojistas" | hero e depoimentos | **Normalizado** para "mais de 100" (o mais conservador já publicado). **[VALIDAR]** o número real |
| 3 | Preços | seção de preços | Conferem com o briefing: R$65 / R$69 / R$89 / R$109. Já em HTML (não em imagem) — OK |
| 4 | Domínio de SEO | `<base href="/lp/">` | A home está em `/lp/`, mas o briefing determina a raiz. **Requer ação de deploy** — ver Changelog |

## 5. Performance

| Item | Situação |
|---|---|
| Imagens hero/demonstração | `.webp` — bom |
| Imagens de depoimento | `.jpeg`/`.png` não otimizados, com **espaços no nome do arquivo** |
| `loading="lazy"` | Ausente em todas as imagens (adicionado nesta rodada abaixo da dobra) |
| `width`/`height` nas imagens | Ausentes → risco de CLS (adicionados nas principais) |
| Fontes | Poppins com 6 pesos via Google Fonts + `preconnect` — pesado; avaliar reduzir para 3–4 pesos |
| JS | ~15 KB, sem dependências externas. Vários listeners de `scroll` sem throttle |
| Render-blocking | `style.css` e a folha do Google Fonts |

## 6. Acessibilidade

| Item | Situação |
|---|---|
| Contraste | Não medido formalmente — **[VALIDAR]** |
| Skip link | Ausente (adicionado) |
| `aria-label` nas setas do carrossel | Presente — OK |
| SVGs decorativos | Sem `aria-hidden` (corrigido) |
| Foco visível | Não estilizado (adicionado `:focus-visible`) |
| `alt` das imagens | Genéricos ("SoftPay Desktop", "Sistema Mobile") — reescritos |

## 7. Riscos identificados

1. **`script.js` bloqueia clique direito em imagens e alguns atalhos de teclado** (linhas ~403 e ~415). Não afeta SEO, mas prejudica a experiência e a acessibilidade. Não foi alterado nesta rodada — decisão de produto.
2. **`base href="/lp/"`** — qualquer mudança de caminho da LP quebra CSS, JS e imagens. Não foi alterado.
3. **`robots.txt` e `sitemap.xml` só funcionam na raiz do domínio.** Foram criados na pasta da LP; o deploy precisa publicá-los em `/`.

## 8. Itens que continuam pendentes de validação

- [ ] Segurança: descrição técnica exata (Supabase é o banco? há criptografia em repouso? quem tem acesso?)
- [ ] Número real de clientes ativos
- [ ] Situação da emissão fiscal ("em ativação" — vale para quais planos, hoje?)
- [ ] Controle de filiais: como funciona na prática e em quais planos
- [ ] Permissões por usuário: existem perfis/papéis ou só multi-login?
- [ ] Importação/migração: formatos aceitos
- [ ] Recomendações automáticas: o produto sugere ações ou apenas exibe indicadores?
- [ ] Oferta de 7 dias grátis sem cartão: confirmar no fluxo de `/auth`
