#!/bin/zsh
# Prévia das rotas clonadas do SoftPay em softpay-previa.pages.dev (conta da casa), sem indexar.
# Uso: publicar.sh   (copia o projeto, gera, marca noindex e publica)
set -e
export PATH=~/.nvm/versions/node/v24.20.0/bin:$PATH
SRC="/Users/victorgabryellferreiraqueiroz/BACKUP_VICTOR/Projetos/VISIONX/SOFTPAY LP"
R=/tmp/sp-previa/repo; OUT=/tmp/sp-previa/out
rsync -a --delete --exclude .git --exclude .wrangler --exclude __pycache__ --exclude 'moldes/*/prova' --exclude node_modules "$SRC/" "$R/"
cd "$R"
python3 tools/build.py >/tmp/sp-previa/build.log 2>&1 || { tail -20 /tmp/sp-previa/build.log; exit 1; }
python3 tools/sitemap.py >>/tmp/sp-previa/build.log 2>&1
python3 tools/versionar-assets.py >>/tmp/sp-previa/build.log 2>&1
rm -rf "$OUT"; cp -R public "$OUT"
# só na cópia da prévia: não indexar, não rastrear, sem sitemap
# O X-Robots-Tag entra DENTRO do bloco "/*" que já existe. Um segundo bloco "/*" no
# topo era descartado pela Cloudflare (o último do mesmo caminho vence) e a prévia
# saía sem noindex, com robots.txt só; medido por curl -I em 04/11/2026.
python3 -I - "$OUT/_headers" <<'PY'
import pathlib, sys
p = pathlib.Path(sys.argv[1]); linha = '  X-Robots-Tag: noindex, nofollow, noarchive'
t = p.read_text().splitlines() if p.exists() else []
i = next((n for n, l in enumerate(t) if l.strip() == '/*'), None)
if i is None: t = ['/*', linha, ''] + t
else: t.insert(i + 1, linha)
p.write_text('\n'.join(t) + '\n')
PY
printf 'User-agent: *\nDisallow: /\n' > "$OUT/robots.txt"
rm -f "$OUT"/sitemap*.xml
# acesso da casa (renova se faltar <10 min)
python3 -I - <<'PY' || python3 -I /Users/victorgabryellferreiraqueiroz/BACKUP_VICTOR/Projetos/VISIONX/linkaffiliattes-lp/_fonte/cloudflare-renovar.py >/dev/null
import json, os, sys, time
d = json.load(open(os.path.expanduser('~/.claude/credenciais/visionx-cloudflare-oauth.json')))
sys.exit(0 if d['expires_at'] - time.time() > 600 else 1)
PY
export CLOUDFLARE_ACCOUNT_ID=2eb0e3cbc1e9e6090e8946fb75d978c0
export CLOUDFLARE_API_TOKEN=$(python3 -I -c "import json,os;print(json.load(open(os.path.expanduser('~/.claude/credenciais/visionx-cloudflare-oauth.json')))['access_token'])")
python3 -I - <<'PY'
import json, os, urllib.request, urllib.error
t=os.environ['CLOUDFLARE_API_TOKEN']; a=os.environ['CLOUDFLARE_ACCOUNT_ID']
u=f'https://api.cloudflare.com/client/v4/accounts/{a}/pages/projects'
h={'Authorization':'Bearer '+t,'Content-Type':'application/json'}
try:
    urllib.request.urlopen(urllib.request.Request(u+'/softpay-previa',headers=h)); print('projeto softpay-previa já existe')
except urllib.error.HTTPError:
    r=urllib.request.urlopen(urllib.request.Request(u,data=json.dumps({'name':'softpay-previa','production_branch':'main'}).encode(),headers=h,method='POST'))
    print('projeto criado:', json.load(r)['result']['subdomain'])
PY
cd /tmp/sp-previa && npx -y wrangler@4 pages deploy "$OUT" --project-name softpay-previa --branch main --commit-dirty=true 2>&1 | grep -vE '^\s*$' | tail -6
# prova: o endereço fixo da prévia responde com noindex (a Cloudflare leva alguns segundos)
for i in 1 2 3 4 5 6; do
  curl -sI https://softpay-previa.pages.dev/ | grep -qi '^x-robots-tag: noindex' && { echo 'noindex no ar: ok'; exit 0; }
  sleep 5
done
echo 'FALHA: softpay-previa.pages.dev sem X-Robots-Tag noindex'; exit 1
