# SoftPay — Landing Page

Landing page institucional do **SoftPay**, o sistema de gestão para pequenos negócios.

Publicada em **https://site.softpaybr.com/**

> O aplicativo é outro projeto e vive em `https://www.softpaybr.com`.
> Esta página é só o site de marketing/SEO — todos os CTAs apontam para `www.softpaybr.com/auth`.

---

## Stack

Site estático, sem build e sem dependências de runtime.

| | |
|---|---|
| Marcação | HTML |
| Estilo | CSS puro (`style.css`) |
| Script | JavaScript sem framework (`script.js`) |
| Hospedagem | Cloudflare Pages |
| CI/CD | Integração Git do Cloudflare Pages (push em `main` publica) |

Não há `package.json`: nada é compilado. Os arquivos do repositório são o site.

## Estrutura

```
.
├── public/               # ← O SITE. É só isto que vai para o ar.
│   ├── index.html        #   Home (página pilar de SEO)
│   ├── termos.html       #   servido em /termos
│   ├── privacidade.html  #   servido em /privacidade
│   ├── reembolso.html    #   servido em /reembolso
│   ├── 404.html
│   ├── style.css
│   ├── script.js         #   navegação, carrossel, tracking de afiliados
│   ├── assets/           #   imagens e logos
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── _headers          #   cabeçalhos e cache (Cloudflare)
│   └── _redirects        #   redirecionamentos 301/302 (Cloudflare)
├── docs/                 # documentação (SEO e deploy) — não vai para o ar
└── .github/workflows/    # deploy manual de emergência
```

No painel do Pages, o **build output directory** precisa ser `public`.

## Rodar localmente

```bash
# runtime real do Cloudflare Pages (testa _headers e _redirects)
npx wrangler pages dev public --compatibility-date=2026-07-01

# ou, para só olhar o HTML
python3 -m http.server 8000 --directory public
```

## Publicar

Com a integração Git do Pages ativa, **todo push em `main` publica sozinho**.

Para publicar manualmente:

```bash
npx wrangler pages deploy public --project-name=softpay-lp
```

O passo a passo completo — criar o projeto no painel e apontar o domínio —
está em **[`docs/DEPLOY.md`](docs/DEPLOY.md)**.

## Convenções

- **URLs canônicas não têm `.html`.** `/termos`, não `/termos.html` — o
  `html_handling: auto-trailing-slash` cuida disso. Nunca crie um redirect
  `/termos → /termos.html`: isso gera loop infinito.
- **A home é a raiz.** `/lp/` é legado e redireciona 301 para `/`.
- **Arquivo novo do site vai em `public/`.** Fora de lá, não é publicado.
- **Cache:** HTML sempre revalida; `assets/` tem cache de um ano. Ao trocar uma
  imagem, use um nome de arquivo novo.
- **`style.css` e `script.js` são versionados por query string** (`?v=3`).
  Ao alterá-los, incremente o número no `index.html`.

## SEO

A estratégia, a auditoria e o histórico estão em [`docs/seo/`](docs/seo/):

- [`AUDITORIA-INICIAL.md`](docs/seo/AUDITORIA-INICIAL.md) — estado inicial e pendências
- [`CHANGELOG-SEO.md`](docs/seo/CHANGELOG-SEO.md) — o que mudou e por quê

O deploy está documentado em [`docs/DEPLOY.md`](docs/DEPLOY.md).

Ao editar o conteúdo, mantenha o FAQ visível **em sincronia com o `FAQPage`**
do JSON-LD no `<head>`: toda pergunta do schema precisa existir na página.

---

© SoftPay — VisionX Inova Simples (IS) · CNPJ 61.427.918/0001-06
