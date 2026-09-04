# Deploy — SoftPay LP

## Onde está o quê

| | |
|---|---|
| Repositório | https://github.com/visionxma/softpay-lp |
| Worker Cloudflare | `softpay-lp` (conta `visionxma`) |
| URL de teste | https://softpay-lp.visionxma.workers.dev |
| Domínio final | https://site.softpaybr.com ← **ainda não migrado** |
| App (outro projeto) | https://www.softpaybr.com |

---

## ⚠️ Pendente: apontar site.softpaybr.com para a Cloudflare

O site novo **já está publicado** na URL de teste, mas o domínio oficial ainda
serve a versão antiga pelo GitHub Pages (repo `visionxma/controleapp`).

A tentativa automática de criar o domínio falhou com **HTTP 409 Conflict** —
não é falta de permissão: já existe um registro DNS ocupando esse nome.

```
site.softpaybr.com.  CNAME  visionxma.github.io.   ← registro antigo
```

### Passo a passo

1. **Confira a URL de teste** e valide o site:
   https://softpay-lp.visionxma.workers.dev

2. **Remova o registro DNS antigo**
   Cloudflare → zona `softpaybr.com` → **DNS** → **Records**
   → apague o registro `site` (CNAME → `visionxma.github.io`)

3. **Crie o domínio no Worker** — escolha uma das duas formas:

   **Pelo painel:**
   Workers & Pages → `softpay-lp` → Settings → **Domains & Routes**
   → Add → Custom Domain → `site.softpaybr.com`

   **Pelo código:** descomente o bloco `routes` no `wrangler.jsonc` e rode:
   ```bash
   npx wrangler deploy
   ```

4. **Confirme** (o certificado leva alguns minutos):
   ```bash
   curl -sI https://site.softpaybr.com/ | head -3
   curl -s https://site.softpaybr.com/ | grep -o '<title>.*</title>'
   ```
   Deve responder `200` e o título `Sistema de Gestão para Pequenos Negócios | SoftPay`.

5. **Desative o GitHub Pages do repo antigo**
   `visionxma/controleapp` → Settings → Pages → Source: **None**
   (deixe o repositório como backup da versão anterior).

> Enquanto o passo 2 não for feito, o domínio continua servindo o site antigo.
> Nada quebra — a troca só acontece quando você remover o CNAME.

---

## Deploy automático pelo GitHub Actions

Todo push em `main` publica sozinho. Falta cadastrar dois secrets:

**GitHub → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Onde obter |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | `2eb0e3cbc1e9e6090e8946fb75d978c0` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → template **Edit Cloudflare Workers** |

Sem esses secrets o workflow falha — até lá, publique com `npx wrangler deploy`.

---

## Comandos

```bash
npx wrangler dev              # roda local com o runtime real da Cloudflare
npx wrangler deploy           # publica
npx wrangler deployments list # histórico
npx wrangler rollback         # volta para a versão anterior
```

---

## Armadilhas conhecidas

- **`.assetsignore` é o que protege o site.** Sem ele, `wrangler deploy`
  publica `.git/`, `.wrangler/` e `docs/` junto com o site. Isso aconteceu no
  primeiro deploy e foi corrigido. Ao adicionar pastas novas ao repositório,
  verifique se elas devem entrar nessa lista.
- **Nunca crie `/termos → /termos.html` no `_redirects`.** O
  `html_handling: auto-trailing-slash` já faz o caminho contrário, e as duas
  regras juntas geram loop infinito de redirecionamento.
- **`compatibility_date` não pode ser mais nova que o wrangler instalado**,
  senão `wrangler dev` não sobe. Hoje: `2026-07-01`.
- **`workers_dev: true` precisa ficar explícito.** Ao adicionar `routes`, o
  wrangler desativa a URL `.workers.dev` por padrão.
