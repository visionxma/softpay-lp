# -*- coding: utf-8 -*-
"""Versiona style.css, script.js e as artes do hero pelo hash do conteúdo.

Substitui o `?v=N` manual: se o arquivo muda, a URL muda sozinha, e o cache
de um dia do _headers deixa de servir versão velha. Se o arquivo não muda,
a URL continua igual e o cache é aproveitado.

As imagens de `/assets/` entram aqui porque o _headers as serve com
`max-age=31536000, immutable` — um ano sem revalidar. Trocar o arquivo no
deploy não basta: quem já visitou o site continua vendo a arte antiga até o
cache expirar. Foi o que aconteceu em 2026-09-08 com a COmputador.webp, cuja
perspectiva tinha sido corrigida: o CSS novo subiu, a imagem velha ficou
(`cf-cache-status: HIT`, `age` de 40 horas). Com o hash na URL o caminho muda
e o cache antigo deixa de ser consultado.

Rode antes de cada deploy:  python3 tools/fingerprint.py
"""
import hashlib, io, os, re, glob, sys

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ARQUIVOS = ["style.css", "script.js"]

# Imagens grandes e servidas com cache imutável. Caminho relativo a public/.
IMAGENS = [
    "assets/COmputador.webp",
    # arte do monitor virado para a direita, usada so no celular
    "assets/computador-mobile-direita.webp",
    # Redimensionadas em 2026-09-09 (4,8 MB -> 86 KB nos avatares; celular.webp
    # 1,5 MB -> 55 KB). Sem o hash aqui, quem ja visitou o site continuaria
    # baixando os arquivos antigos por ate um ano, e a otimizacao nao chegaria
    # a ninguem — o mesmo caso da COmputador.webp descrito acima.
    "assets/logo.png",
    "assets/celular.webp",
    "assets/+100/logo_boutique.png",
    "assets/+100/logo_cosmeticos.png",
    "assets/+100/logo_minimercado.png",
    "assets/+100/logo_padaria.png",
    "assets/+100/logo_oficina.png",
]


def hash_de(caminho):
    with open(caminho, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()[:10]


def main():
    os.chdir(RAIZ)
    versoes = {}
    for nome in ARQUIVOS + IMAGENS:
        alvo = os.path.join("public", nome)
        if not os.path.exists(alvo):
            print("ausente, ignorado:", alvo)
            continue
        versoes[nome] = hash_de(alvo)

    alterados = 0
    alvos = glob.glob("public/**/*.html", recursive=True) + ["tools/template.py"]
    for f in alvos:
        s = io.open(f, encoding="utf-8").read()
        orig = s
        for nome, h in versoes.items():
            # (1) caminhos relativos, com ou sem barra inicial: style.css, /assets/x.webp
            # troca qualquer ?v=... existente pelo hash
            s = re.sub(r'(["\'])(/?)%s\?v=[^"\']*(["\'])' % re.escape(nome),
                       lambda m: "%s%s%s?v=%s%s" % (m.group(1), m.group(2), nome, h, m.group(3)),
                       s)
            # e versiona referências que ainda não tenham query
            s = re.sub(r'(["\'])(/?)%s(["\'])' % re.escape(nome),
                       lambda m: "%s%s%s?v=%s%s" % (m.group(1), m.group(2), nome, h, m.group(3)),
                       s)
            # (2) URLs absolutas — og:image e twitter:image exigem endereço
            # completo. Facebook, WhatsApp e LinkedIn guardam a prévia por
            # URL: sem o hash aqui, o link compartilhado mostra a arte antiga
            # mesmo depois do deploy.
            s = re.sub(r'(https://site\.softpaybr\.com/)%s(\?v=[^"\']*)?(["\'])' % re.escape(nome),
                       lambda m: "%s%s?v=%s%s" % (m.group(1), nome, h, m.group(3)),
                       s)
        if s != orig:
            io.open(f, "w", encoding="utf-8").write(s)
            alterados += 1

    for nome, h in versoes.items():
        print("%-12s -> v=%s" % (nome, h))
    print("arquivos atualizados: %d" % alterados)
    return 0


if __name__ == "__main__":
    sys.exit(main())
