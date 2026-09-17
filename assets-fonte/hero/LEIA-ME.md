# A família de aparelhos do hero

`aparelhos-chroma.png` é a cena crua: monitor, notebook, tablet e celular, com
**todas as telas em verde chroma** e o fundo em **magenta**. Gerada no codex em
17/09/2026, a partir da referência que o Victor mandou (a home da TriboPay).

`aparelhos-corte.png` é o resultado: as capturas REAIS do sistema entraram
dentro de cada tela por transformação de perspectiva, o fundo magenta virou
transparente e o esverdeado das bordas foi neutralizado.

## Como refazer (o caminho todo está no histórico desta sessão)

1. Detectar as regiões verdes e rotular os componentes conexos.
2. Para cada região, achar os quatro cantos pelo ponto mais próximo de cada
   canto do bounding box. **Não use os extremos de (x+y) e (x−y)**: numa tela
   quase alinhada aos eixos eles devolvem o mesmo canto duas vezes.
3. A tela do monitor fica parcialmente coberta pelo notebook e pelo tablet, e o
   canto inferior-esquerdo dela não existe na máscara. Estime por paralelogramo:
   `bl = tl + (br − tr)`. O que ficar fora da máscara não aparece.
4. Dilatar a máscara verde ~4px antes de colar: a borda entre a tela e a moldura
   tem antisserrilhado, e sem dilatar sobra um fio verde em volta de cada tela.
5. Fundo magenta → alfa; despill do verde e do magenta nas bordas.

## Que tela vai em cada aparelho

| aparelho | tela | de onde |
|---|---|---|
| monitor | PDV com o carrinho em R$ 414,60 | `assets/sistema/pdv.webp` |
| notebook | controle de estoque | `assets/sistema/estoque.webp` |
| tablet | catálogo da loja online | `assets/sistema/catalogo.webp` |
| celular | a coluna do carrinho | recorte vertical de `pdv.webp` |

Nenhuma interface foi desenhada: é o sistema que o lojista vai abrir.
