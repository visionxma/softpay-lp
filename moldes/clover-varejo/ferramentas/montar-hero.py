# Monta a imagem da hero (publicar/aparelhos-4.webp, 1640x1240, fundo transparente) com os MESMOS aparelhos
# da fileira: molduras da Mobile Simulator com os prints reais do SoftPay (saída de montar-aparelhos.sh).
# Por que não o public/assets/hero/aparelhos-4.webp da home: a sombra dele é alfa pontilhado (feito para o
# fundo escuro da home); no fundo claro da Clover ela vira granulado preto sob o notebook e o iMac.
# Aqui a sombra é desenhada: elipse borrada, alfa contínuo, e o alfa sai sem perda (alpha_quality=100).
# uso: uv run -q --with pillow python ferramentas/montar-hero.py
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

PUB = Path(__file__).resolve().parent.parent / "publicar"


def peca(nome, *, altura=None, largura=None):
    im = Image.open(PUB / f"{nome}.webp").convert("RGBA")
    im = im.crop(im.getbbox())
    if altura:
        largura = round(im.width * altura / im.height)
    else:
        altura = round(im.height * largura / im.width)
    return im.resize((largura, altura), Image.LANCZOS)


def montar(nome, largura, altura, base, cena, menor=None):
    """cena: (peça, x da esquerda, quanto desce além da base), de trás para a frente."""
    tela = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
    for im, x, desce in cena:
        fundo = base + desce
        # sombra de contato: elipse achatada sob a base, borrada; tom do texto da página, nunca preto puro
        sombra = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
        d = ImageDraw.Draw(sombra)
        folga = im.width * 0.04
        d.ellipse((x + folga, fundo - 10, x + im.width - folga, fundo + 10), fill=(16, 24, 32, 110))
        tela.alpha_composite(sombra.filter(ImageFilter.GaussianBlur(9)))
        tela.alpha_composite(im, (x, fundo - im.height))
    tela.save(PUB / f"{nome}.webp", quality=88, alpha_quality=100, method=6)
    if menor:
        tela.resize(menor, Image.LANCZOS).save(PUB / f"{nome}-800.webp", quality=86, alpha_quality=100, method=6)
    claro = Image.new("RGBA", tela.size, (255, 255, 255, 255))
    claro.alpha_composite(tela)
    claro.convert("RGB").save(f"/tmp/clover-varejo-fotos/sombra/{nome}-nova.png")
    print("ok", nome, tela.size)


# hero: os quatro aparelhos sobrepostos, em bloco quase quadrado como o grupo da Clover (1640x1240): a hero
# de 100svh no computador fica cheia, sem a sobra de 200 px em cima e embaixo que a faixa 2:1 deixava
montar("aparelhos-4", 1640, 1240, 1196, [
    (peca("relatorio-imac", altura=1100), 398, -16),
    (peca("pdv-notebook", largura=1050), 16, 14),
    (peca("caixa-tablet", altura=700), 1020, 8),
    (peca("fone-zap", altura=500), 1360, 22),
], menor=(800, 605))

# fundo do bloco "lucro" (flutuante) e das seções extras: computador com o financeiro + celular, 1448x1086
montar("aparelhos-2", 1448, 1086, 1010, [
    (peca("relatorio-imac", altura=900), 40, 0),
    (peca("fone-zap", altura=600), 1080, 20),
])
