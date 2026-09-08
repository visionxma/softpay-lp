# RETOMAR — estado do projeto

> Atualizado em 2026-09-07, ao fim da sessão que executou o plano de segmentos.
> A versão anterior deste arquivo descrevia trabalho preso sem publicar; isso
> foi resolvido. Nada aqui é bloqueante.

Projeto: `/Users/alexandrehenrique/Documents/Alexandre Henrique/Projetos Code/SoftPay - LP/softpay-lp`
Site: https://site.softpaybr.com · Repo: https://github.com/visionxma/softpay-lp

---

## Leia isto antes de rodar qualquer comando

O projeto vive em `~/Documents`, sincronizado com o **iCloud Drive** com
"Otimizar Armazenamento do Mac" ativo, e o disco está em 93%. O macOS despeja
arquivos do projeto para a nuvem — inclusive `tools/*.py` e objetos do `.git`.
Ler um arquivo despejado **bloqueia** esperando um download que muitas vezes não
acontece: foi isso que travou a sessão de 2026-09-06, não o git.

Como reconhecer: `git status` congela, ou aparece
`fatal: mmap failed: Operation canceled`.

```bash
# quantos arquivos estão na nuvem em vez de no disco
find . -type f -exec ls -lO {} + 2>/dev/null | grep -c dataless

# destravar o daemon do iCloud quando ele empaca
killall bird
```

**A solução durável é tirar o projeto do iCloud** — mover para
`~/Projetos/softpay-lp`, por exemplo — ou desligar "Otimizar Armazenamento do
Mac". Enquanto isso não acontecer, o problema volta.

Se o `.git` estiver preso e você precisar publicar agora, clone o repositório
num diretório local, copie os fontes para lá e publique de lá:

```bash
git clone https://github.com/visionxma/softpay-lp.git /tmp/lp && cd /tmp/lp
rsync -a --exclude .git --exclude .wrangler --exclude __pycache__ \
      "/Users/alexandrehenrique/Documents/Alexandre Henrique/Projetos Code/SoftPay - LP/softpay-lp/" .
python3 tools/build.py && python3 tools/sitemap.py && \
python3 tools/fingerprint.py && python3 tools/verifica.py
git add -A && git commit -m "..." && git push origin main
```

---

## Onde o trabalho parou

Tudo do plano de segmentos foi implementado e publicado. **54 páginas**, sitemap
com 53 URLs, `verifica.py` sem apontamentos. O detalhamento está em
`docs/seo/PLANO-SEGMENTOS.md` (seção 6) e em `docs/seo/CHANGELOG-SEO.md`.

Os 12 segmentos e seu tamanho atual:

| Segmento | Blocos | FAQ | Figura |
|---|---|---|---|
| mercadinho | 7 | 9 | sim |
| loja-de-roupas | 6 | 9 | sim |
| loja-de-variedades | 3 | 6 | sim |
| papelaria | 3 | 6 | sim |
| farmacia | 7 | 9 | sim |
| distribuidora | 8 | 9 | sim |
| loja-de-celulares-e-acessorios | 6 | 7 | sim |
| loja-de-autopecas | 6 | 7 | **não** |
| materiais-de-construcao | 6 | 7 | **não** |
| loja-de-joias | 7 | 9 | **não** |
| empresas-com-filiais | 7 | 9 | **não** |
| pequeno-comercio | 7 | 9 | sim |

---

## Próximas oportunidades, em ordem

1. **Fotos dos 4 segmentos sem figura.** Prompts prontos em `docs/IMAGENS.md`,
   itens 9 a 12. Elas ficaram sem imagem de propósito: reaproveitar a foto da
   distribuidora de bebidas exigia um `alt` que mentia sobre a imagem.
2. **Elevar `loja-de-variedades` e `papelaria`** ao padrão dos demais — falta o
   bloco "o que ele não faz" e a tabela de planos.
3. **`/solucoes/multiplas-lojas/` tem só 2 blocos**, e agora é a página mais
   fraca do site. É a que `/segmentos/empresas-com-filiais/` aponta.
4. **Segmentos futuros**, só se houver funcionalidade real que os sustente:
   pet shop, loja de calçados, ótica, loja de brinquedos, tabacaria.
   Ficam de fora hoje: pizzaria, delivery, prestador de serviço com agenda,
   franquia e rede com mais de 10 acessos.

---

## Regras que não podem ser quebradas

- **Não inventar** funcionalidade, integração, número, depoimento ou resultado.
- **Não alterar preços:** Nota Fiscal R$ 65 · Comércio R$ 69 · Loja R$ 89 ·
  ERP Completo R$ 109. Todos com 7 dias grátis, sem cartão.
- **Sempre dizer em qual plano** o recurso está. Bot do WhatsApp, curva ABC,
  variações, loja online e importação são **a partir do plano Loja**.
- **Emissão fiscal é "em ativação"** — nunca transformar em promessa.
- **Não prometer** segurança absoluta nem aumento de lucro.
- **Preservar URLs** existentes ao melhorar uma página.
- **Nenhuma página nova sem intenção de busca clara** e algo verdadeiro a dizer
  que as outras não dizem.

### Recursos confirmados (pode citar)

PDV e caixa · estoque · variações de tamanho e cor · custo e preço · curva ABC ·
fiado · clientes e CRM · atacado e varejo · loja online · Pix · cupons e
fidelidade · NF-e e NFC-e (em ativação) · multiusuário · filiais · relatórios ·
registro pelo WhatsApp.

---

## Ferramentas

```bash
python3 tools/build.py            # gera as páginas a partir de tools/c_*.py
python3 tools/sitemap.py          # regenera o sitemap
python3 tools/fingerprint.py      # versiona CSS/JS — OBRIGATÓRIO após editar CSS/JS
python3 tools/verifica.py         # auditoria: estrutura, metadata, links, schema
python3 tools/mapa_interlinks.py  # regenera o mapa de links internos
```

**Pré-visualizar sem navegador.** A extensão do Chrome conecta, mas não tem
permissão para `localhost` — a captura falha com "showing error page". Monte um
HTML com o CSS embutido, imagens em caminho absoluto e sem `<script>`, e use:

```bash
qlmanage -t -s 1250 -o . preview.html
```

Para a página inteira, escale o body (`transform: scale(0.105)`). **Para testar
mobile de verdade**, o `qlmanage` sozinho não serve: ele escala o desktop e as
media queries não disparam. Ponha a página num `<iframe width="390">` dentro de
outro HTML — aí as media queries respondem à largura do iframe.

---

## Armadilhas conhecidas

1. **`animation: ... both` esconde conteúdo.** Mantém `opacity: 0` no primeiro
   frame. Conteúdo essencial nasce visível; a animação vive numa classe aplicada
   depois.
2. **Existe `section { padding: 7rem 0 }` global.** As classes `.section-block`
   e `.page-section` já zeram isso.
3. **Nunca criar redirect `/termos → /termos.html`.** O `html_handling` do
   Cloudflare faz o caminho inverso; juntas, as duas regras dão loop infinito.
4. **Sempre rodar `fingerprint.py` após mexer em CSS ou JS.** Sem isso, o cache
   de um dia serve a versão antiga e o layout quebra para quem visita.
5. **`compatibility_date` do wrangler** não pode ser mais nova que o binário.
   Use `--compatibility-date=2026-07-01`.
6. **Contraste:** o azul do logo (`#1DA1F2`) dá 2,83:1 com texto branco e
   reprova em WCAG AA. Para texto sobre fundo colorido, use `--brand-600` ou
   mais escuro.
7. **`overflow: hidden` mata `position: sticky`.** Um ancestral com overflow
   diferente de `visible` vira o container de rolagem do sticky, e o elemento
   para de grudar. Foi o que quebrou as abas de funcionalidades: `.section-block`
   usava `overflow: hidden` para recortar os cantos arredondados. Use
   `overflow: clip`, que recorta igual sem criar o container.
8. **Cuidado com seletor descendente em componentes.** `.page-note strong`
   pegava o `<strong>` do texto além do título e quebrava frases em três linhas.
   Já corrigido, mas o padrão pode se repetir em outros blocos.

---

## Pendências

Todas em **`docs/PENDENCIAS.md`** — o que falta, quem resolve e em que ordem.

Resumo do topo da lista:

1. **Search Console** — a tag já está no ar, falta criar a propriedade
2. **Seis respostas de produto** travam 22 páginas em "confirme com o suporte"
3. **Política de privacidade** pode nomear o banco errado (Firebase × Supabase)
4. **Quatro fotos de segmento** ainda faltam — prompts em `docs/IMAGENS.md`

Saíram desta lista por já estarem resolvidos: o link do WhatsApp (corrigido no
commit `b297d74`, 108 links com `wa.me/5586998193851`) e a reescrita de
`/solucoes/`, concluída em 2026-09-07.
