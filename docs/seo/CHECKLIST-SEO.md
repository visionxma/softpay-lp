# Checklist de SEO — SoftPay

## Por página

- [ ] Intenção de busca clara e única
- [ ] Keyword principal definida
- [ ] `H1` único
- [ ] `title` único (≤ 60 caracteres na prática)
- [ ] `meta description` única (≤ 155 caracteres)
- [ ] URL descritiva, sem `.html`, com barra final
- [ ] `canonical` absoluto
- [ ] Open Graph + X Card
- [ ] Conteúdo original, não gerado por substituição
- [ ] Perguntas reais respondidas
- [ ] Ao menos 3 links internos contextuais
- [ ] CTA para o teste grátis
- [ ] Dados reais, nada inventado
- [ ] Schema adequado (`WebPage` + `BreadcrumbList`, `FAQPage` se houver FAQ)
- [ ] FAQ do schema idêntico ao FAQ visível
- [ ] Breadcrumbs visíveis batendo com o schema
- [ ] Responsivo
- [ ] Sem conteúdo duplicado

## Do site

- [x] `sitemap.xml` na raiz, só com páginas indexáveis
- [x] `robots.txt` na raiz, apontando o sitemap
- [x] `canonical` em todas as páginas
- [x] Metadata única em todas
- [x] Open Graph em todas
- [x] Schema em todas
- [x] Página 404
- [x] Redirect 301 de `/lp/` → `/`
- [x] Políticas: termos, privacidade, reembolso
- [x] `/contato/` e `/sobre/`
- [ ] Google Search Console configurado — ver `SEARCH-CONSOLE.md`
- [ ] Core Web Vitals medidos em campo

## Verificação automática

O script confere o que dá para conferir por máquina:

```bash
python3 tools/verifica.py
```

Ele valida, nas 48 páginas: estrutura HTML balanceada, `H1` único, links
internos quebrados, duplicatas de `title`/`description`/`H1`, e se cada
pergunta do `FAQPage` existe no HTML visível.

O mapa de interlinks se regenera com:

```bash
python3 tools/mapa_interlinks.py
```

## O que a máquina não confere

- Se o texto responde de fato à intenção de busca
- Se o recurso citado existe mesmo no produto
- Se o plano mencionado está correto
- Se o número de exemplo está marcado como fictício

Isso é revisão humana — use o `GUIA-DE-COPY.md`.

## Regras absolutas (§44 do briefing)

Nunca: keyword stuffing · páginas duplicadas · doorway pages · spam ·
backlinks comprados · reviews falsos · clientes falsos · integrações falsas ·
números falsos · cloaking · texto escondido · conteúdo só para crawler ·
schema falso.
