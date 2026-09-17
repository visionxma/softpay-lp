# A família de aparelhos do hero

`aparelhos-cores.png` é a cena crua: monitor, notebook, tablet e celular, com
**uma cor chroma diferente em cada tela** e o fundo em magenta. Gerada no codex
em 17/09/2026, a partir da referência que o Victor mandou (a home da TriboPay).

| tela | cor chroma | matiz |
|---|---|---|
| monitor | verde `#00FF00` | 95–150 |
| notebook | ciano `#00FFFF` | 165–200 |
| tablet | amarelo `#FFFF00` | 45–70 |
| celular | laranja `#FF8000` | 15–42 |
| fundo | magenta `#FF00FF` | 280–330 |

`aparelhos3.png` é o resultado, com fundo transparente.

## Por que uma cor por tela

A primeira versão usou verde em todas. **Não funciona**: as telas do monitor e
do notebook se tocam na cena, a rotulagem de componentes conexos não separa os
limites com segurança, e a composição vazou — o menu do sistema apareceu pintado
fora da moldura do monitor. Com uma cor por tela a segmentação é direta e não há
ambiguidade.

## O caminho, passo a passo

1. Segmentar por **matiz** (HSV), não por comparação de canais RGB: amarelo e
   laranja se confundem em RGB (o amarelo captura o laranja).
2. Achar os quatro cantos de cada tela pelo ponto mais próximo de cada canto do
   bounding box. Guardar a **distância** até esse canto: se for grande, o canto
   está coberto por outro aparelho.
3. Reconstruir o canto coberto por paralelogramo (`bl = tl + br − tr`). O
   monitor tem DOIS cantos cobertos (pelo notebook e pelo tablet): ali a base é
   medida numa coluna livre, entre os dois.
4. Compor por transformação de perspectiva, com a tela fonte em 2x o tamanho do
   destino para não perder nitidez.
5. Máscara = cor daquela tela, dilatada **2px**, ∩ o quadrilátero. A dilatação
   tapa o fio de chroma do antisserrilhado; mais que isso e a tela invade a
   moldura.
6. Fundo magenta → alfa.
7. Limpar o chroma que sobrou **só FORA das áreas pintadas**. Limpar dentro
   apaga o que é verde no próprio sistema — foi assim que o selo "Aberto" do
   caixa sumiu na segunda tentativa.

## Que tela vai em cada aparelho

| aparelho | tela | de onde |
|---|---|---|
| monitor | PDV com o carrinho em R$ 414,60 | `assets/sistema/pdv.webp` |
| notebook | controle de estoque | `assets/sistema/estoque.webp` |
| tablet | catálogo da loja online | `assets/sistema/catalogo.webp` |
| celular | a coluna do carrinho | recorte vertical de `pdv.webp` |

Nenhuma interface foi desenhada: é o sistema que o lojista vai abrir.
