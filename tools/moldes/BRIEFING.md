# Briefing de quem clona uma rota de SEO do SoftPay

Pedido do Victor (03/11/2026, por voz): "Todas as LPs que vão melhorar o SEO tem que ser bonitas... no nível
da principal... clonar perfeitamente as melhores LPs do mercado... colocando a nossa identidade visual em uma
cópia perfeita... Pegando tudo da referência e tornando nosso. Sem erros." E: "tornar as imagens mais
realistas, melhores, mais intuitivas. Para captar mesmo."

Regra da casa: `jarvis manual rota-de-seo-e-clone-de-lp-diferente` e
`jarvis manual referencia-nomeada-se-clona-pela-captura` (leia os dois).

## Teto: 45 minutos do início ao relatório

Cobrança do Victor (04/11/2026): "toda vez que vejo um agente demorando mais de uma hora acho estranho,
desnecessário". O clone da Lightspeed (estoque) ficou 1h46 rodando portão atrás de portão. Por isso:

- Registre com `fundo registrar molde-<id> "<o que faz>"` e bata ponto a cada etapa com o MINUTO em que está.
- Aos 35 minutos, pare de polir: tire as fotos `clone-1440.png`/`clone-390.png`, rode `de qa` UMA vez e
  escreva o relatório com o que ficou abaixo da referência. O agente principal integra, publica a prévia e
  decide se vale outra rodada curta.
- **Não rode `portao-lp-victor.mjs` nem `varrer-aparelhos.mjs`**: são 15–20 min cada no Mac de 8 GB. Quem
  roda é o principal, uma vez, em segundo plano, contra a prévia no ar.
- Um conserto que pede mais de 10 min vira item do relatório, não mais uma volta.

## Onde

- Projeto: `/Users/victorgabryellferreiraqueiroz/BACKUP_VICTOR/Projetos/VISIONX/SOFTPAY LP`
  (branch `seo-rotas-clonadas`; NÃO faça commit, NÃO rode `tools/build.py`: quem integra é o agente principal).
- Sua pasta: `moldes/<id>/` (só ela é sua). Arquivos comuns que você NÃO edita: `tools/build.py`,
  `tools/blocks.py`, `tools/template.py`, `tools/moldes/vestir.mjs`, `tools/moldes/contrato.py`,
  `tools/moldes/mapa-de-fontes.tsv`, `rotas-clonadas.json`, `public/sistema.css`, `public/index.html`.
  Precisa de mudança num deles? Escreva no relatório final o que e por quê.
- Conteúdo da rota (o que vai na página): `tools/conteudo/<slug>.json`.

## Contrato do molde (o `vestir.mjs` chama isto)

`moldes/<id>/molde.mjs` exporta:

```js
export const meta = { id, referencia, captura, topoDoChassi, secoes: [{ idx, tipo, omitida? }], classeRaiz? };
export function desenho(D) { return '<html do miolo do <main>>'; }
```

`D` = o JSON de `tools/conteudo/<slug>.json` (h1, intro, blocks, faq, cta_title, cta_text, related, mais,
breadcrumbs, figura…) + `origem` (true na prova contra a referência, false na rota), `rota`,
`links` ({app, cadastro, wpp}: use `links.cadastro` nos botões de criar conta, ele leva o código de afiliado),
`v(endereco)` (devolve o endereço com `?v=<hash>`) e `base` (`/moldes/<id>`).

- `moldes/<id>/molde.css`: o CSS da captura escopado em `.mx-<id>` (só as regras usadas) + a roupa do
  SoftPay. `molde.js` opcional (comportamento da referência). Imagens em `moldes/<id>/publicar/`
  (servidas em `/moldes/<id>/<arquivo>`; sempre `D.v(D.base + '/arquivo.webp')`).
- Cabeçalho, rodapé, `<head>`, JSON-LD e botões fixos são do chassi (template.py): o molde faz só o miolo,
  com a hero começando logo abaixo do cabeçalho do chassi (`topoDoChassi`).
- Teste: `node tools/moldes/vestir.mjs --so /<slug>/ --seco` (confere) e sem `--seco` (grava a rota em
  `public/<slug>/index.html` e os arquivos em `public/moldes/<id>/`). O PORTÃO DE TEXTO sai 1 se sumir
  qualquer texto de busca (h1 igual e único, intro, títulos, parágrafos, itens, notas, exemplos, tabelas,
  cartões, FAQ inteira e VISÍVEL, chamada, links de related/mais/breadcrumbs, botão de cadastro). Texto
  dentro de `hidden`/`aria-hidden` não conta. Nenhum texto de SEO pode sair: ele entra NOS BLOCOS da
  referência (o bloco de "tópicos" da referência recebe as seções da rota, o FAQ da referência recebe a FAQ…).
- Node: `~/.nvm/versions/node/v24.20.0/bin/node` (não há node no PATH de subprocesso).

## Modelos prontos da casa (leia antes de escrever)

- `VISIONX/SITE-VISIONX/moldes/stripe-pagamentos/` (o mais completo: meta.secoes com `omitida`, modo
  origem × produto, origem.json, origem.css, acabamento.css, molde.js, prova.json) e `moldes/rd-crm/`,
  `moldes/nuvem-loja/`.
- `VISIONX/SITE-VISIONX/gerador/provar-molde.mjs` (prova seção por seção contra a captura) e
  `~/.jarvis/marcio-safirion/clone/bin/` (`capturar.mjs`, `escopar-css.mjs`, `vestir-css.mjs`,
  `provar-molde.mjs`, `portao-vaos.mjs`, `portao-render-molde.mjs`, `pagina.mjs`).
- `VISIONX/FINAGRO-LP/moldes/wise-conversor/` (construir.mjs escopa o CSS com postcss do
  `~/.jarvis/marcio-safirion/clone/node_modules`).

## Passos

1. Skill `responsivo-de-cara` e Read INTEIRO de `~/.claude/jarvis-design/doutrina.md` (em duas leituras:
   1–562 e 563–fim) ANTES de escrever qualquer HTML/CSS: o gancho bloqueia sem as duas. Arquivo de
   interface se escreve com Write/Edit, nunca por heredoc no Bash.
2. `fundo registrar molde-<id> "clone de <rota>" --retomar "ler moldes/<id>/ e seguir o BRIEFING"` e
   `fundo batida molde-<id> "<etapa>"` a cada etapa; no fim `fundo fim molde-<id> ok|falhou "<resumo>"`.
3. Captura RENDERIZADA (todo passo de navegador, foto ou varredura passa por `trava-pesada`, que deixa
   um pesado por vez na máquina de 8 GB):
   `trava-pesada ~/.nvm/versions/node/v24.20.0/bin/node ~/.jarvis/marcio-safirion/clone/bin/capturar.mjs <url> ~/.jarvis/visionx/clones/capturas/<id> --larguras 1440,390`
   Opcional, para o ZIP e o ai-brief: `trava-pesada refs baixar <url> --nicho softpay-seo`.
   Navegador: só o Chrome sem janela (9444) ou o que o capturador sobe. NUNCA a 9333, nunca `open`.
4. Inventário ANTES de trocar peças: liste o que é de pessoa/empresa REAL da origem (logo de cliente,
   depoimento, número, prêmio, preço deles). Isso sai com `omitida: '<motivo>'` em `meta.secoes`, ou o
   bloco recebe dado VERDADEIRO do SoftPay. Nada se inventa: nenhum depoimento, nota, número de clientes,
   prêmio ou percentual. Fatos do SoftPay: só o que está no JSON da rota e em `public/index.html`
   (planos, preços, recursos).
5. Molde: composição, ordem, tamanhos de letra, espaçamentos, componentes e animação 1:1 com a
   referência. Trocam: marca, copy (o conteúdo da rota), cores papel por papel e a FAMÍLIA da fonte
   (o tamanho fica). Identidade do SoftPay (de `public/sistema.css`):
   fontes `SoftPay Display` para títulos e `SoftPay Texto` para texto — as duas são a Montserrat
   variável (`/fontes/softpay-montserrat-v1.woff2`, peso 100–900, itálico em
   `softpay-montserrat-italico-v1.woff2`), a letra do logo, escolhida pelo Victor em 03/11/2026.
   Título em caixa normal (nunca `uppercase` por herança da referência), 700–800, espaço -0,02em;
   texto corrido em 500;
   `--noite #06121F`, `--azul #0C5C9E` (ação, branco por cima 6,91:1), `--azul-forte #084A81`,
   `--azul-vapor #E8F3FB`, `--tinta #0A1A28`, fundo branco. Botão em cor viva leva texto BRANCO.
   Regras que vencem a referência: hero cobre a tela inteira (`min-height: 100svh` menos o cabeçalho do
   chassi) com FUNDO DE PONTA A PONTA no próprio elemento da hero — foto/vídeo cobrindo a hero inteira ou
   `background-image` (degradê nos tons da casa); só `background-color` reprova o `fundo-de-ponta-a-ponta`
   do portão (shopify-pos-varejo, 04/11/2026, conserto em 18557d97) —, vão máximo de 120 px no computador e 72 px no celular, celular copia a composição do
   computador (lado a lado em 360 px, sem rolagem lateral, nem dentro de componente), FAQ em
   `<details name>` com tudo visível no HTML, alvo de toque ≥ 44 px.
   Achados da onda 1 (03/11/2026), que valem para todo molde:
   - **Espaçamento entre letras NÃO vem da referência** quando a letra vira `SoftPay Display`: ela é
     condensada, e o `letter-spacing` negativo de uma sans larga (−0,02 a −0,04em, −1px) cola as letras e
     some com o espaço entre palavras (medido no square-pdv: "frentedecaixa"). Na camada vestida, todo
     título em `SoftPay Display` usa o da casa: `0.005em` (hero: `-0.0036em`). Confira ampliando a foto.
   - **Nada de borda grossa colorida de um lado só** (`border-left: 3px+` em nota/aviso/citação): o
     gancho acusa como marca de interface feita por IA. Nota vira borda fina de 1 px em volta + fundo.
   - **Carrossel do computador é trilho que rola, não seção cortada:** `overflow-x: auto` +
     `scroll-snap-type: x mandatory` + `scrollbar-width: none` NO PRÓPRIO trilho, setas rolando o trilho;
     nunca `overflow: hidden` na seção para esconder o item seguinte (o `de qa` reprova os portões 3 e 4).
     No celular continua grade, sem rolagem lateral.
   - **Desfoque de foto sem ampliar a foto:** `scale(1.04)` para esconder a borda do `blur` estoura a
     caixa (o `de audit` dá ALTA). Use uma camada por cima com `backdrop-filter: blur()` ou filtro SVG
     `feGaussianBlur edgeMode="duplicate"`.
   - **`de qa` 7/7 é condição de pronto**, não meta.
   - **Botão cheio pintado com `currentcolor` ganha cor DECLARADA** (clover-varejo, 03/11/2026): a
     origem pinta o fundo com a cor do texto do pai. Na tela dá o mesmo azul, mas o portão de contraste
     apaga as letras para ler o fundo e apagava o botão junto (texto branco "sobre" faixa clara, 1,08:1).
     Fundo com `var(--m-primaria)`; `:active` e hover trocam as duas cores.
   - **Utilitário da origem com `!important` vence o acabamento** (lightspeed-varejo, 03/11/2026):
     `tw:lap-s:min-h-[462px]` prendia a coluna da hero em 462 px. A regra do acabamento que precisa
     mudar a mesma propriedade também leva `!important`; confira no `getComputedStyle`, não no CSS.
   - **Vão da hero se mede com `tools/moldes/vaos-hero.mjs <url> <seletor> [prefixo] [1440x900,390x844]`**
     (abre `display: contents`, junta colunas lado a lado numa fileira, sai 1 acima de 120/72 px ou com a
     hero maior que a tela). A sobra que não cabe nos vãos vai para o TÍTULO crescer com a altura
     (`clamp(<origem>, <N>svh, <teto>)`), nunca para padding.
6. Imagens (o pedido central do Victor: realistas e que captam):
   - foto/arte que a referência usa → refeita com os MESMOS objetos e enquadramento, em cena brasileira
     do segmento da rota (comércio de verdade, luz natural, sem cara de banco de imagem), pelo MCP
     `mcp__imagem__gerar_imagem` com provedor GRÁTIS (`huggingface` flux-dev/flux ou `pollinations`;
     nunca `openai`, que é pago). Pessoas: tons de pele variados entre as fotos. Conferir cada imagem
     com Read (mão, dedo, texto torto, rosto deformado = gera de novo). Saída em webp, nítida, com versão
     de 800 px quando for grande.
   - tela de produto → PRINT REAL do SoftPay: `public/assets/sistema/*.webp` (catalogo, clientes,
     estoque, financeiro, fiscal, pdv, pdv-celular, celular-carrinho, tablet-financeiro) ou captura nova
     com `tools/app/{entrar,capturar-tela,capturar-caixa}.mjs`. Tela desenhada em HTML/CSS não vale.
   - aparelho só onde a referência tem aparelho; tela de frente entra reta.
7. Prova (tudo por `trava-pesada`):
   - modo origem contra a captura, seção por seção (`provar-molde.mjs`, limiar 0,12) → `moldes/<id>/prova.json`
     com `"passou": true` e `"referencia"` igual à do contrato; `ref-1440.png` e `ref-390.png`.
   - página vestida servida: `python3 -m http.server <sua porta> --directory public` (cada agente tem a sua)
     e fotos `clone-1440.png` e `clone-390.png` da rota (foto por CDP `Page.captureScreenshot`; o
     screenshot do Playwright trava no 9444). Cada PNG > 20 KB.
   - compare você mesmo ref × clone em 1440 e 390 (Read das fotos, ampliando as seções):
     `node ~/.jarvis/design-engine/ferramentas/comparar-com-referencia.mjs <ref.png> <clone.png> --json`.
     Se a nossa parece mais pobre em qualquer seção, não está pronto.
   - `PORTA_CDP=9444 de qa http://127.0.0.1:<porta>/<slug>/ --vp 360,390,768,1024,1440` e
     `de audit ... --vp 360,390,768`: zero rolagem lateral, zero "itens empilhados que cabem".
   - Portão das correções do Victor (roda o PRINCIPAL, em segundo plano, contra a prévia; o agente só
     informa no relatório o seletor da hero): `node ~/.jarvis/design-engine/ferramentas/portao-lp-victor.mjs
     <url> --heroi '<seletor da hero do molde>' --saida <arq>.json`. O `--heroi` é obrigatório: sem ele o
     portão pega a 1ª `section` do miolo (no square-pdv, um bloco de 2.653 px sem o h1) e reprova a hero
     à toa. Se a REFERÊNCIA mostra aparelho além de celular (monitor, maquininha, hardware), acrescente
     `--aparelhos-permitidos celular,notebook` e diga isso no relatório. O topo estendido (barra de
     ponta a ponta no alto, cápsula ao rolar) é do chassi desde 03/11/2026: não mexa nele no molde.
   - Antes de fechar, mate o servidor que você subiu e confira que não deixou navegador vivo
     (`pgrep -fl chrome-headless-shell`; mate só o que VOCÊ abriu, nunca 9333/9444/Chrome for Testing).
8. Se a referência não se deixar capturar (bloqueio, página vazia, 403), use a reserva indicada no seu
   enunciado e diga isso no relatório (o agente principal troca o contrato).

## Relatório final (curto)

O que ficou em `moldes/<id>/`, as seções da referência e o que foi omitido com motivo, as imagens geradas
(provedor e caminho), a saída do `vestir --so`, o `passou` do prova.json, os números do `de qa`/`de audit`,
e o que você acha que ainda está abaixo da referência. Relatório é pista: o principal confere no pixel.
