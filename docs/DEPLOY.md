# Deploy — SoftPay LP (Cloudflare Pages)

| | |
|---|---|
| Repositório | https://github.com/visionxma/softpay-lp |
| Hospedagem | Cloudflare **Pages** |
| URL do Pages | `softpay-lp.pages.dev` (criada no passo 1) |
| Domínio final | https://site.softpaybr.com |
| App (outro projeto) | https://www.softpaybr.com |

> O site fica em **`public/`**. Tudo que está fora dessa pasta (`docs/`,
> `README.md`, `.github/`) **não** é publicado.

---

## 1. Criar o projeto no Pages

Painel da Cloudflare → **Workers & Pages** → **Create** → aba **Pages**
→ **Connect to Git** → selecione `visionxma/softpay-lp`.

Configure exatamente assim:

| Campo | Valor |
|---|---|
| Framework preset | **None** |
| Build command | *(deixe vazio)* |
| Build output directory | **`public`** |
| Root directory | `/` |
| Production branch | `main` |

Não há build: os arquivos de `public/` são o site.

Ao salvar, o Pages publica e devolve a URL `softpay-lp.pages.dev`.
A partir daí, **todo push em `main` publica sozinho**.

## 2. Conferir na URL do Pages

```bash
curl -s https://softpay-lp.pages.dev/ | grep -o '<title>.*</title>'
```

Deve responder `Sistema de Gestão para Pequenos Negócios | SoftPay`.

Confira também: `/termos`, `/lp/` (deve redirecionar para `/`) e uma
URL inexistente (deve cair no 404).

## 3. Apontar site.softpaybr.com

Hoje o domínio serve a versão antiga pelo GitHub Pages:

```
site.softpaybr.com.  CNAME  visionxma.github.io.   ← registro antigo
```

1. Cloudflare → zona `softpaybr.com` → **DNS** → **Records**
   → apague o registro `site` (CNAME → `visionxma.github.io`)

   > Sem apagar, a criação do domínio falha com **HTTP 409 Conflict**.
   > Isso não é falta de permissão — é o nome já ocupado.

2. Pages → projeto `softpay-lp` → **Custom domains** → **Set up a custom domain**
   → `site.softpaybr.com`

3. Aguarde o certificado (alguns minutos) e confirme:
   ```bash
   curl -sI https://site.softpaybr.com/ | head -3
   ```

4. Desative o GitHub Pages do repositório antigo:
   `visionxma/controleapp` → Settings → Pages → Source: **None**
   (mantenha o repositório como backup da versão anterior).

> Até o passo 1 ser feito, o domínio continua servindo o site antigo.
> Nada quebra: a troca só acontece quando o CNAME sair.

---

## Rodar localmente

```bash
# runtime real do Cloudflare Pages (testa _headers e _redirects)
npx wrangler pages dev public --compatibility-date=2026-07-01

# ou, para só olhar o HTML
python3 -m http.server 8000 --directory public
```

> A flag `--compatibility-date` é necessária porque o wrangler instalado
> (4.109.0) é mais antigo que a data de hoje e o runtime local recusa
> subir. Não afeta o deploy real. Some ao atualizar o wrangler.

## Deploy manual

O workflow `.github/workflows/deploy.yml` é **só disparo manual**
(Actions → Deploy para o Cloudflare Pages → Run workflow), de propósito:
com a integração Git ativa, um workflow automático publicaria duas vezes
a cada push.

Para usá-lo, cadastre em **Settings → Secrets and variables → Actions**:

| Secret | Valor / onde obter |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | `2eb0e3cbc1e9e6090e8946fb75d978c0` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → template **Edit Cloudflare Workers** |

Ou, do seu terminal:

```bash
npx wrangler pages deploy public --project-name=softpay-lp
```

---

## Armadilhas conhecidas

- **O site é `public/`, não a raiz.** Se o *build output directory* ficar
  como `/`, o Pages publica `docs/` e `README.md` junto com o site.
- **Nunca crie `/termos → /termos.html` no `_redirects`.** O Pages já serve
  `/termos` a partir de `termos.html` e canonicaliza no sentido inverso; as
  duas regras juntas geram loop infinito de redirecionamento.
- **Cache de um ano em `/assets/*`.** Ao trocar uma imagem, use um nome de
  arquivo novo, senão o navegador segue com a antiga.
- **`style.css` e `script.js` são versionados pelo hash do conteúdo.**
  Depois de editá-los, rode `python3 tools/fingerprint.py`. Já aconteceu de
  o CSS novo ficar preso atrás do cache de um dia com o HTML novo já no ar —
  o fingerprint existe para isso não repetir.
