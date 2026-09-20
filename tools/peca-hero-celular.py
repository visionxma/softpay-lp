#!/usr/bin/env python3
"""Peça da hero do CELULAR: monitor + celular com as telas do sistema encaixadas.

Fonte: assets-fonte/hero/aparelhos-2-chroma.png — render do codex (18/09/2026)
com a tela do monitor em verde puro e a do celular em magenta puro.

O que vai em cada tela (refeito em 19/09/2026, "deixe perfeito"):
· MONITOR — o PDV INTEIRO (public/assets/sistema/pdv.webp, 1400x845), só com a
  faixa de rodapé cortada para bater a proporção da tela (1,69). A versão
  anterior usava um recorte do meio do PDV (pdv-celular.webp) que cortava
  cartões de produto na esquerda e preços do carrinho na direita. Tela
  inteira é o que um monitor de verdade mostra; nada fica partido na borda.
· CELULAR — o painel do carrinho recortado do mesmo PDV, da borda do painel
  (x=1036) até o fim, com uma faixa branca no alto para o entalhe da câmera não
  cobrir o título "Carrinho". A captura anterior (celular-carrinho.webp) já
  vinha cortada na esquerda — ícone e números dos itens pela metade.

As duas telas mostram a MESMA venda (R$ 414,60): no balcão e no celular.

Encaixe: máscara do chroma engordada 2px (senão sobra fio colorido na borda),
cantos medidos pelo ponto da máscara mais próximo de cada canto da caixa,
captura redimensionada em LANCZOS e colada por perspectiva. O fundo preto vira
alfa por rampa de luminância, preservando a sombra de contato.

Saída: public/assets/hero/aparelhos-2.webp (1448) e aparelhos-2-1200.webp.
Uso: python3 tools/peca-hero-celular.py   (Pillow + numpy)
"""
import pathlib
import sys
import numpy as np
from PIL import Image, ImageFilter

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CHROMA = RAIZ / 'assets-fonte/hero/aparelhos-2-chroma.png'
CAP = RAIZ / 'assets-fonte/hero/capturas'
# argumento 1: outra captura do balcão (para comparar larguras antes de escolher)
# argumento 2: outra pasta de saída (para não sobrescrever o que está no ar)
PDV = CAP / (sys.argv[1] if len(sys.argv) > 1 else 'balcao-1366-dpr2.png')
CARRINHO = CAP / 'carrinho-390-dpr3.png'  # 1170x2532 — carrinho no layout de celular, densidade 3
SAIDA = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else RAIZ / 'public/assets/hero'

def dilatar(m, n=2):
    for _ in range(n):
        m = m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1)
    return m

def cantos(mask):
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    out = []
    for ax, ay in [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]:
        i = int(np.argmin((xs - ax) ** 2 + (ys - ay) ** 2)); out.append((float(xs[i]), float(ys[i])))
    return out, (int(x0), int(y0), int(x1), int(y1))

def coef(origem, destino):
    A, B = [], []
    for (xd, yd), (xs, ys) in zip(destino, origem):
        A.append([xd, yd, 1, 0, 0, 0, -xs * xd, -xs * yd]); B.append(xs)
        A.append([0, 0, 0, xd, yd, 1, -ys * xd, -ys * yd]); B.append(ys)
    return np.linalg.solve(np.array(A, float), np.array(B, float))

def encaixar(base, mask, tela):
    mask = dilatar(mask)
    quad, (x0, y0, x1, y1) = cantos(mask)
    lw, lh = x1 - x0 + 1, y1 - y0 + 1
    # cobre a caixa exatamente: a tela já vem na proporção certa
    # a redução é grande (o PDV inteiro cabe num monitor de 253px na página):
    # sem realce, o traço fino da fonte some e a tela vira mancha cinza
    img = tela.resize((lw, lh), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.1, percent=85, threshold=2))
    c = coef([(x - x0, y - y0) for x, y in quad], [(0, 0), (lw - 1, 0), (lw - 1, lh - 1), (0, lh - 1)])
    warp = img.transform((lw, lh), Image.PERSPECTIVE, tuple(c), Image.BICUBIC)
    base.paste(warp, (x0, y0), Image.fromarray((mask[y0:y1 + 1, x0:x1 + 1] * 255).astype('uint8')))
    return lw, lh

def apagar_fileira_parcial(pdv):
    """Tira a fileira de produtos que fica PELA METADE no pé da grade.

    A 1366px cabem 3 fileiras inteiras e o topo de uma quarta. Essa quarta
    começa em "PRODUTO TESTE" — item da loja de demonstração que fica legível
    no tamanho real do celular (conferido: recorte da faixa no tamanho real,
    ampliado 3x) e não pode aparecer numa peça de venda.

    Nenhuma largura resolve: o cabeçalho do caixa só para de colidir a partir
    de ~1366 (a 1280 o selo de latência sai "239m" com o "s" tapado pelo ícone
    do Operador), e a essa altura a quarta fileira já espia. A janela em que as
    duas coisas ficam certas não existe.

    Então a fileira sai da IMAGEM, não do sistema: a faixa dela é pintada com o
    cinza do próprio fundo da grade, medido ali do lado. A grade passa a
    terminar depois da terceira fileira, com margem antes da barra de totais —
    que é como um app de verdade fica quando a lista acaba. Nada é inventado:
    só deixa de aparecer conteúdo que estava cortado.

    Medido no perfil de cor da captura (fração de branco por linha, x a partir
    do fim da barra lateral): cartões da 3ª fileira até y=1342, vão cinza da
    grade 1346-1368, fileira parcial 1369-1429, barra de totais a partir de
    1430. Recapturou? refazer essa medição, não confiar nos números.
    """
    MENU, Y0, Y1 = 240 * 2, 1344, 1430
    if pdv.size != (2732, 1614):
        return pdv          # outra captura: as medidas acima não valem
    fundo = pdv.getpixel((1000, 1356))                      # o cinza do vão da grade
    pdv = pdv.copy()
    pdv.paste(Image.new('RGB', (pdv.width - MENU, Y1 - Y0), fundo), (MENU, Y0))
    return pdv

def main():
    peca = Image.open(CHROMA).convert('RGB')
    a = np.asarray(peca).astype(np.int16); R, G, B = a[..., 0], a[..., 1], a[..., 2]
    verde = (G > 150) & (R < 120) & (B < 120)
    magenta = (R > 150) & (B > 150) & (G < 120)
    pdv = apagar_fileira_parcial(Image.open(PDV).convert('RGB'))   # 2732x1614

    # MONITOR: o BALCÃO — barra lateral, busca e a grade de produtos, com o
    # carrinho recolhido pelo próprio sistema (o carrinho fica no celular, que
    # cobre o canto direito do monitor).
    #
    # A LARGURA DA CAPTURA é o que decide se a peça fica bonita, e não a
    # nitidez. Duas coisas dependem dela, e as duas têm de ser conferidas
    # AMPLIADAS antes de publicar:
    #
    # 1. ESCALA. A barra lateral do sistema é fixa em 240px: come 23% da tela a
    #    1024, 19% a 1280, 18% a 1366, 16% a 1536. A 1024 a interface aparecia
    #    ampliada — três colunas, a terceira cortada pelo celular e a segunda
    #    fileira partida na borda: cara de print com zoom, não de monitor.
    #
    # 2. O CABEÇALHO DO CAIXA. Ele ganha itens conforme a largura, e a 1280 os
    #    itens COLIDEM: o selo de latência sai escrito "239m" com o "s" tapado
    #    pelo ícone do Operador. É bug do sistema, não do recorte — e foi
    #    exatamente o que o Victor apontou no print de 20/09. A 1024 não
    #    aparecia porque o "Operador" nem era renderizado.
    #
    # 1366x807 é o ponto: cabeçalho completo e sem sobreposição (268ms ·
    # Operador · 02:53 · Sangria · Suprimento · Histórico · Fechar), barra
    # lateral em 18% e o preço ainda legível no render de 390px. A 1536 o
    # cabeçalho também fica limpo, mas abre um vão vazio no meio.
    #
    # O celular MORDE o monitor de y=46% para baixo, cobrindo de 89,6% a 100%
    # da largura (medido na máscara verde do chroma). Nenhuma largura alinha
    # uma borda de coluna com esses 89,6%, então a última coluna sempre entra
    # parcialmente por baixo do celular — o que se controla é que ela seja a
    # QUARTA, e não a terceira.
    _, (x0, y0, x1, y1) = cantos(dilatar(verde)); prop = (x1 - x0 + 1) / (y1 - y0 + 1)
    # a captura já vem na proporção da tela (1366x807 = 1,69): entra inteira,
    # com rodapé e tudo — nada cortado pela borda do monitor
    monitor = pdv.crop((0, 0, pdv.width, min(pdv.height, round(pdv.width / prop))))

    # CELULAR: o carrinho no layout de CELULAR do próprio sistema (capturado a
    # 390px, densidade 3), sem a sombra da gaveta na borda esquerda e com uma
    # faixa no alto para o entalhe da câmera não cobrir o "4 itens"
    _, (x0, y0, x1, y1) = cantos(dilatar(magenta)); prop_c = (x1 - x0 + 1) / (y1 - y0 + 1)
    car = Image.open(CARRINHO).convert('RGB')
    car = car.crop((20, 0, car.width, car.height))
    # a captura é um pouco mais alta que a proporção da tela: ela entra pela
    # ALTURA (nada do rodapé do carrinho — Limpar e Finalizar — fica de fora) e
    # sobra uma margem estreita dos lados, na cor do fundo do painel
    larg = car.width; alto = round(larg / prop_c)
    faixa = round(alto * 0.045)
    esc = (alto - faixa) / car.height
    car2 = car.resize((round(car.width * esc), alto - faixa), Image.LANCZOS)
    celular = Image.new('RGB', (larg, alto), car.getpixel((car.width // 2, 8)))
    celular.paste(car2, ((larg - car2.width) // 2, faixa))

    base = peca.copy()
    print('monitor', encaixar(base, verde, monitor), 'de', monitor.size)
    print('celular', encaixar(base, magenta, celular), 'de', celular.size)

    arr = np.asarray(base).astype(np.float32)
    alpha = np.clip((arr.max(axis=2) - 6.0) / 16.0, 0, 1)
    alpha[dilatar(verde) | dilatar(magenta)] = 1.0
    final = Image.fromarray(np.dstack([arr, alpha * 255]).astype('uint8'), 'RGBA')
    final.save(SAIDA / 'aparelhos-2.webp', quality=88, method=6)
    menor = final.resize((1200, round(1200 * final.height / final.width)), Image.LANCZOS)
    rgb = Image.merge('RGB', menor.split()[:3]).filter(ImageFilter.UnsharpMask(radius=0.8, percent=60, threshold=2))
    menor = Image.merge('RGBA', (*rgb.split(), menor.split()[3]))
    menor.save(SAIDA / 'aparelhos-2-1200.webp', quality=90, method=6)
    final.save('/tmp/peca2-final.png')
    print('ok')

if __name__ == '__main__':
    main()
