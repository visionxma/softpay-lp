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
| Hospedagem | Cloudflare — Workers Static Assets |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |

Não há `package.json`: nada é compilado. Os arquivos do repositório são o site.

## Estrutura

```
.
├── index.html            # Home (página pilar de SEO)
├── termos.html           # servido em /termos
├── privacidade.html      # servido em /privacidade
├── reembolso.html        # servido em /reembolso
├── 404.html              # página de erro
├── style.css
├── script.js             # navegação, carrossel, tracking de afiliados
├── assets/               # imagens e logos
├── robots.txt
├── sitemap.xml
├── _headers              # cabeçalhos e cache (Cloudflare)
├── _redirects            # redirecionamentos 301/302 (Cloudflare)
├── .assetsignore         # o que NÃO é publicado no site
├── wrangler.jsonc        # configuração da Cloudflare
└── docs/seo/             # documentação de SEO (não vai para o ar)
```

## Rodar localmente

```bash
# com o runtime real da Cloudflare (recomendado: testa _headers e _redirects)
npx wrangler dev

# ou, para só olhar o HTML
python3 -m http.server 8000
```

`wrangler dev` sobe em `http://localhost:8787`.

## Publicar

O deploy é automático: todo push em `main` dispara o workflow do GitHub Actions.

Para publicar manualmente:

```bash
npx wrangler deploy
```

### Secrets necessários no GitHub

Em **Settings → Secrets and variables → Actions**:

| Secret | Onde obter |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → template *Edit Cloudflare Workers* |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare → Workers & Pages (aparece na barra lateral) |

## Convenções

- **URLs canônicas não têm `.html`.** `/termos`, não `/termos.html` — o
  `html_handling: auto-trailing-slash` cuida disso. Nunca crie um redirect
  `/termos → /termos.html`: isso gera loop infinito.
- **A home é a raiz.** `/lp/` é legado e redireciona 301 para `/`.
- **Cache:** HTML sempre revalida; `assets/` tem cache de um ano. Ao trocar uma
  imagem, use um nome de arquivo novo.
- **`style.css` e `script.js` são versionados por query string** (`?v=3`).
  Ao alterá-los, incremente o número no `index.html`.

## SEO

A estratégia, a auditoria e o histórico estão em [`docs/seo/`](docs/seo/):

- [`AUDITORIA-INICIAL.md`](docs/seo/AUDITORIA-INICIAL.md) — estado inicial e pendências
- [`CHANGELOG-SEO.md`](docs/seo/CHANGELOG-SEO.md) — o que mudou e por quê

Ao editar o conteúdo, mantenha o FAQ visível **em sincronia com o `FAQPage`**
do JSON-LD no `<head>`: toda pergunta do schema precisa existir na página.

---

© SoftPay — VisionX Inova Simples (IS) · CNPJ 61.427.918/0001-06
