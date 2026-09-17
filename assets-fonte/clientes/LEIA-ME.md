# Fotos dos clientes reais — mestres em alta

Daqui saem os recortes de `public/assets/lojistas/vitrine/`. Esta pasta **não**
vai para o ar: fica fora de `public/`.

| Arquivo | Quem é | Origem | O que foi feito |
|---|---|---|---|
| `gabriel-landim-hd.png` | Gabriel Landim — loja de celulares e acessórios | quadro do vídeo `public/assets/depoimentos/gabriel-landim.mp4` (608×1080), recortado acima da legenda | restauração fotográfica (codex/gpt-image) mantendo pessoa, roupa e cena; a placa iluminada do fundo foi pedida **fora de foco e sem letras**, porque o modelo inventava um nome de loja |
| `neto-rn-grifes-hd.png` | Neto — RN Grifes, loja de roupas | quadro do vídeo `neto-rn-grifes.mp4` | mesma restauração; o brasão bordado da RN Grifes foi preservado |
| `naldo-bebidas-original.png` | Naldo Bebidas — distribuidora | post do Instagram indicado pelo Victor (`instagram.com/p/DJ0EdyDJF7K/`), 1152×1440 | **desespelhado** (era selfie de câmera frontal: os cartazes da loja apareciam ao contrário) |
| `naldo-bebidas-hd.png` | idem | do arquivo acima | restauração fotográfica mantendo pessoa, camisa e loja |

Regra: nada de gerar rosto do zero. A restauração serve para tirar ruído de
vídeo e compressão — a identidade da pessoa e a loja dela têm de continuar as
mesmas, senão o "cliente real" deixa de ser real.

## Reenquadramento para o painel vertical (17/09/2026)

Os arquivos `*-alto.png` (1024×1536 pedidos, entregues em ~1085×1450) são a
segunda passada, feita para o bloco "Para quem é" virar painel vertical no
padrão da Stone. Ali o nome do segmento fica no meio-baixo do painel, e com os
retratos fechados da primeira passada o texto caía na boca do lojista.

O pedido ao codex foi de **reenquadramento**, não de restauração: mesma pessoa,
mesma roupa, mesma loja, mas em plano médio — cabeça e ombros começando a ~22%
do topo, tronco na metade de baixo, teto e prateleiras visíveis em volta. É mais
invasivo que a restauração: a cena ao redor é reconstruída (aparecem prateleiras
e objetos que a foto original não mostrava). A pessoa, a roupa e o tipo de loja
são os mesmos — foi conferido lado a lado.

Se um dia houver fotografia de verdade em plano médio destes lojistas, ela
substitui estes arquivos sem nenhuma mudança de CSS: o recorte é 3:4, ancorado
no topo, em 500 e 1000px de largura.

Os três de banco de imagem (farmácia, papelaria, variedades) passaram pelo mesmo
reenquadramento. Nesses não há questão de identidade: já eram fotografia de
banco, não cliente.
