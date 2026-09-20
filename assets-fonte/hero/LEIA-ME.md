# A peça do hero: quatro aparelhos, desenhados em CSS

Referência: a home da TriboPay, que o Victor mandou — monitor, notebook, tablet
e celular juntos, cada um com o produto rodando.

## Por que NÃO é uma imagem

A primeira versão foi feita como render: os aparelhos vinham do codex com as
telas em chroma e as capturas entravam dentro por transformação de perspectiva.
Funcionou, mas duas coisas se perdiam e o Victor apontou as duas (17/09/2026):

1. **A moldura ficava presa à resolução do render.** Numa tela de alta
   densidade as bordas amoleciam. Ampliar não resolve: não há detalhe para
   recuperar.
2. **A captura passava por um warp**, que come nitidez antes mesmo de o
   navegador redimensionar.

Hoje a moldura é desenhada em CSS — borda, raio, gradiente e sombra. É
vetorial: nítida em qualquer densidade, pesa alguns bytes, e cada milímetro do
acabamento é ajustável. A captura entra como `<img>` no tamanho nativo, sem
deformação nenhuma.

As medidas estão todas em `cqw` (por cento da largura do contêiner), então a
peça inteira escala junto e nada quebra em nenhuma largura.

Os arquivos do render antigo (`aparelhos-cores.png`, `aparelhos3.png`) ficam
aqui como registro do caminho anterior; o site não usa nenhum dos dois.

## Que tela vai em cada aparelho

| aparelho | tela | arquivo |
|---|---|---|
| monitor | PDV, carrinho em R$ 414,60 | `assets/sistema/pdv.webp` |
| notebook | controle de estoque | `assets/sistema/estoque.webp` |
| tablet | catálogo da loja online | `assets/sistema/catalogo.webp` |
| celular | o carrinho de uma venda | `assets/sistema/pdv-celular.webp` |

Tablet e celular têm tela em retrato e a captura é larga: ela entra por
`object-fit: cover`, ancorada no lado que interessa (esquerda no tablet, onde
está o menu do catálogo; direita no celular, onde está o carrinho).

Abaixo de 62rem só o monitor aparece, e a captura dele vira o recorte
`pdv-celular.webp` — a tela inteira do PDV em 390px seria ilegível.

## O que ainda falta (depende do Victor)

As capturas em `assets/sistema/` têm **1400x845**. Para "acima de 4K", como o
Victor pediu, e para cada aparelho mostrar o layout RESPONSIVO dele (o sistema
em largura de tablet, o sistema em largura de celular), é preciso recapturar o
sistema logado em cada viewport com `deviceScaleFactor` 2 ou 3.

O login em https://www.softpaybr.com/auth passou a exigir **captcha da
Cloudflare** ("Confirme que é humano"), e o botão Entrar só habilita depois do
clique. Conta e senha estão em `~/.claude/credenciais/softpay.md`. Basta o
Victor dar esse clique uma vez com o navegador do agente aberto
(`de browser start`) que a sessão fica salva no perfil e eu recapturo tudo.

## A peça do celular (19/09/2026)

Abaixo de 62rem a hero mostra `public/assets/hero/aparelhos-2*.webp`: monitor +
celular renderizados, com as telas do sistema encaixadas. A fonte é
`aparelhos-2-chroma.png` (render do codex de 18/09, tela do monitor em verde puro
e a do celular em magenta puro) e o script é `tools/peca-hero-celular.py`.
`aparelhos-4-chroma.png` é a versão de quatro aparelhos, guardada para o dia em
que o desktop voltar a usar render.

- Monitor: o PDV **inteiro** (`pdv.webp`), só com o rodapé cortado para bater a
  proporção da tela. Recorte do meio deixava cartões e preços partidos na borda.
- Celular: o painel do carrinho recortado do mesmo PDV, com faixa branca no alto
  para o entalhe da câmera. A mesma venda de R$ 414,60 nas duas telas.
- **Sem `filter: drop-shadow` na imagem.** Com filtro numa imagem que anima em
  3D, o Chrome rasteriza em baixa resolução e as telas viram mancha no meio da
  rolagem (medido lado a lado em DPR 3). A sombra é uma elipse em
  `.hero__tela::after`.

### Capturas reais (19/09/2026, noite)

O Victor destravou o captcha do login no navegador do agente e as telas passaram
a vir do sistema de verdade, em `assets-fonte/hero/capturas/`:

- `pdv-1440-dpr2.png` — `/vendas` a 1440x852, densidade 2 (2880x1704), com o
  carrinho montado na loja de demonstração (4 itens, R$ 414,60). Vai no monitor.
- `carrinho-390-dpr3.png` — o carrinho no layout de CELULAR do sistema (a gaveta
  que abre pelo botão flutuante), mesma venda. Vai no celular.
- `vendas-390-dpr3.png` — a grade de produtos no layout de celular (reserva).

Como capturar de novo: navegador do agente logado (`de browser start`), aba de
fundo por `abaSemFoco()`, `Emulation.setDeviceMetricsOverride` na largura
desejada. Os cliques nos produtos só montam o carrinho — nunca finalizar venda.
A sessão do painel `/admin` tem dados reais de clientes: não fotografar.

### Por que 1152px e não 1440 (20/09/2026)

O Victor: "as imagens dentro dos aparelhos continuam um lixo". Não era o
arquivo: o PDV inteiro cabe num monitor de 253px na página — 5,7x de redução a
1440px, que apaga o traço fino da fonte. Três medidas, medidas lado a lado em
tamanho real:

1. capturar o sistema a **1152px** em vez de 1440 (mesma interface, menos
   elementos por tela — a letra chega 25% maior no destino);
2. **realce de nitidez** (unsharp) depois de cada redução, no encaixe da tela e
   na versão de 1200px;
3. rolar a grade de produtos e o carrinho de volta ao **topo** antes de
   fotografar — os cliques que montam a venda deixam os dois rolados.

`de browser stop`/`navegador.close()` fecham o Chrome do agente e derrubam a
sessão: nos roteiros de captura, **nunca fechar o navegador**.

### O balcão em 1024px, com o carrinho recolhido (20/09/2026)

"Essa daqui tá péssima." O 1152px resolveu a nitidez, mas não a **composição**:
o celular fica por cima do canto direito do monitor e tapava justamente a
coluna do carrinho (começa em x=793 de 1152, medido na página). A tela grande
aparecia partida ao meio, com metade de uma coluna de itens escapando por trás
do celular — e a mesma venda estava duplicada nos dois aparelhos.

A saída veio do próprio sistema: abaixo de um certo espaço, o `/vendas`
**recolhe o carrinho** num botão flutuante e a grade de produtos ocupa a tela
toda. É um estado real do produto, não um truque de foto. A captura passou a
ser `balcao-1024-dpr2.png` — `/vendas` a **1024x606, densidade 2** (2048x1212,
já na proporção 1,69 da tela do monitor: entra inteira, sem corte de rodapé).

O que muda na peça:

- **monitor = o balcão** (menu, busca, filtros, grade de produtos, teclas de
  atalho no rodapé) e **celular = o carrinho** daquela mesma venda. Um aparelho
  não repete mais o outro: juntos contam a venda inteira.
- redução até o monitor de 253px cai de 4,5x para **3,1x** — a letra do nome do
  produto e do preço fica legível em 390px (conferido com recorte em DPR 3).

Antes de fotografar, esperar o selo de latência do sistema ficar **verde**
(< 350ms): num print, o badge laranja de 900ms lê como sistema lento.

### A largura da captura é o que decide (20/09/2026, segunda rodada)

"Só diminuir a dimensão para ficar legal." Ele estava certo: o problema nunca
foi nitidez, era **escala**. A barra lateral do sistema é fixa em **240px**, e é
ela que denuncia o zoom — come **23%** da tela a 1024, **19%** a 1280 e **17%**
a 1440. A 1024 a peça mostrava três colunas de produto (a terceira cortada pelo
celular) e uma fileira partida na borda de baixo: cara de print ampliado.

Capturei 1280x758 e 1440x852 e montei as três peças, renderizadas lado a lado
na largura real da hero (351px CSS, DPR 3) antes de escolher:

| captura | como fica no monitor de 351px |
|---|---|
| 1024x606 | 3 colunas, a 3ª cortada, fileira partida — **ampliada demais** |
| **1280x758** | **4 colunas, 3 fileiras inteiras, rodapé de atalhos, preço legível** |
| 1440x852 | letra menor sem ganho, 4ª fileira partida no meio, "PRODUTO TESTE" entra na vitrine |

Ficou **1280x758, densidade 2**. As capturas de 1024 e 1440 foram apagadas: só
a que está em uso fica no repositório.

O script aceita argumentos para essa comparação sem sobrescrever o que está no
ar: `python3 tools/peca-hero-celular.py <captura.png> <pasta-de-saida>`.
Precisa de numpy e Pillow, que não estão no Python do sistema —
`uv run --with numpy --with pillow python tools/peca-hero-celular.py`.
