# Fontes do SoftPay — como foram escolhidas e como refazer

A referência tipográfica é a da Stone (stone.com.br): **Roobert** (Displaay) no
texto e **ABC Gravity X Compressed** (Dinamo) no display. As duas são pagas; o
arquivo da Gravity diz, no próprio `name` table, que é proibido guardá-lo em
servidor público. Por isso o site usa reproduções em OFL:

| papel | arquivo em `public/fontes/` | origem | parecença (IoU) |
|---|---|---|---|
| display | `softpay-display-v1.woff2` | Roboto Flex, wdth 28 · wght 650 · opsz 144, espaço = 0,136 da maiúscula | 0,875 (Archivo: 0,577) |
| texto 400/500/600/700 | `softpay-texto-<peso>-v1.woff2` | Funnel Sans 350/450/625/725 | 0,808 / 0,834 / 0,862 / 0,871 |

## Refazer

1. Baixe as fontes de referência **só para medir, nunca para o repositório**
   (`https://www.stone.com.br/fonts/Roobert-Regular.woff2` etc.) e converta para
   `.otf/.ttf` numa pasta `stone/` ao lado destes scripts; as candidatas vão em
   `cand/` (TTF do github.com/google/fonts).
2. `uv run --with pillow --with numpy python medir.py texto400|texto600|display`
   → ranking em `res-*.json` (os de 25/09/2026 estão aqui).
3. `uv run --with pillow --with numpy python folha.py texto|display` → folha
   lado a lado para olhar.
4. `uv run --with fonttools --with brotli python construir.py` → woff2 em `saida/`.
   Versão nova sobe com sufixo `-v2` (o `_headers` serve `/fontes/*` com cache eterno).

## Comprou a licença

Troque só os `src` dos `@font-face` no topo de `public/sistema.css` (e no
`<style>` do `404.html`). Os nomes de família (`SoftPay Display`, `SoftPay
Texto`) e o resto do CSS não mudam. A Gravity tem ~a mesma largura da SoftPay
Display (1,004×), então `--display-k` continua valendo.
