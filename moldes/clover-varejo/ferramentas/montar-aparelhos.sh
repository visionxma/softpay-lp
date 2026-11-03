#!/bin/zsh
# Monta os prints REAIS do SoftPay dentro das molduras da extensão Mobile Simulator
# (assets/devices/<slug>/device.png; tela pelos números do viewport do simulator.js, em 2x).
# A tela entra reta, sem perspectiva. Saída: moldes/clover-varejo/publicar/*.webp (+ -800).
set -e
F=~/.local/bin/ffmpeg
RAIZ="${0:A:h:h}"
PUB="$RAIZ/../../public"
SAI="$RAIZ/publicar"
DEV=~/Library/Application\ Support/Google/Chrome\ for\ Testing/Default/Extensions/ckejmhbmlajgoklhgbapkiccekfoccmk/4.23.0_0/assets/devices
TMP=$(mktemp -d)
mkdir -p "$SAI"

# montar <print> <device.png> <girar 0|1> <x> <y> <larg> <alt> <saida-sem-ext> <raio do canto da tela>
montar() {
  local print="$1" dev="$2" girar="$3" x="$4" y="$5" w="$6" h="$7" nome="$8"
  local quadro="$TMP/quadro.png"
  if [[ "$girar" == 1 ]]; then
    $F -hide_banner -loglevel error -y -i "$dev" -vf "format=rgba,transpose=1" "$quadro"
  else
    $F -hide_banner -loglevel error -y -i "$dev" -vf "format=rgba" "$quadro"
  fi
  # A tela da moldura é preta e opaca: o print vai POR CIMA, com os cantos arredondados (raio $r),
  # e a moldura perde a cor (aparelho prata, como os da referência).
  local r="${9:-0}"
  $F -hide_banner -loglevel error -y -i "$quadro" -i "$print" -filter_complex \
    "[1:v]format=rgba,scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}:0:0,\
geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(gt(hypot(max(0,max(${r}-X,X-(W-1-${r}))),max(0,max(${r}-Y,Y-(H-1-${r})))),${r}),0,255)'[tela];\
     [0:v]hue=s=0,format=rgba[q];[q][tela]overlay=${x}:${y},format=rgba" \
    "$TMP/$nome.png"
  $F -hide_banner -loglevel error -y -i "$TMP/$nome.png" -vf "scale=1200:-2:flags=lanczos" -c:v libwebp -quality 86 -lossless 0 "$SAI/$nome.webp"
  $F -hide_banner -loglevel error -y -i "$TMP/$nome.png" -vf "scale=800:-2:flags=lanczos" -c:v libwebp -quality 84 -lossless 0 "$SAI/$nome-800.webp"
  echo "ok $nome"
}

# MacBook Air: quadro 1648x947 css, tela 1280x800 em (183,54) -> 2x
montar "$PUB/assets/sistema/pdv.webp"        "$DEV/macbook-air/device.png"            0 366 108 2560 1600 pdv-notebook 0
# iPad Air 4 deitado: tela 1180x820 em (55,57) no retrato -> deitado (110,110) 2360x1640 em 2x
montar "$PUB/assets/sistema/estoque.webp"    "$DEV/apple-ipad-air-4/device.png"       1 110 110 2360 1640 estoque-tablet 36
# Galaxy Tab S7 deitado: tela 1280x800 em (46,46) -> deitado (92,92) 2560x1600 em 2x
montar "$PUB/assets/sistema/clientes.webp"   "$DEV/samsung-galaxy-tab-s7/device.png"  1 92 92 2560 1600 fiado-tablet 30
# iPad Air 4 em pé: tela 820x1180 em (55,57) -> (110,114) 1640x2360 em 2x
montar "$PUB/assets/sistema/tablet-financeiro.webp" "$DEV/apple-ipad-air-4/device.png" 0 110 114 1640 2360 caixa-tablet 36
# iMac 24: tela 2048x1152 em (54,54) -> (108,108) 4096x2304 em 2x
montar "$PUB/assets/sistema/financeiro.webp" "$DEV/apple-imac-24-inch-2021/device.png" 0 108 108 4096 2304 relatorio-imac 0
# Fileira da chamada final (a faixa de aparelhos da Clover no pé da página): os mesmos aparelhos, apoiados na mesma linha
$F -hide_banner -loglevel error -y -f lavfi -i "color=c=black@0.0:s=2400x620,format=rgba" \
  -i "$SAI/relatorio-imac.webp" -i "$SAI/pdv-notebook.webp" -i "$SAI/caixa-tablet.webp" -i "$SAI/fone-zap.webp" -filter_complex \
  "[1:v]scale=-2:600:flags=lanczos[a];[2:v]scale=820:-2:flags=lanczos[b];[3:v]scale=-2:520:flags=lanczos[c];[4:v]scale=-2:440:flags=lanczos[d];\
   [0:v][a]overlay=150:H-h[x1];[x1][b]overlay=830:H-h[x2];[x2][c]overlay=1680:H-h[x3];[x3][d]overlay=2080:H-h,format=rgba" \
  -frames:v 1 "$TMP/fileira.png"
$F -hide_banner -loglevel error -y -i "$TMP/fileira.png" -c:v libwebp -quality 86 "$SAI/fileira.webp"
$F -hide_banner -loglevel error -y -i "$TMP/fileira.png" -vf "scale=800:-2:flags=lanczos" -c:v libwebp -quality 84 "$SAI/fileira-800.webp"
echo "ok fileira"
rm -rf "$TMP"
