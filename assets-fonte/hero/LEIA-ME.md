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
