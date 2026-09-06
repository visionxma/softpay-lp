# -*- coding: utf-8 -*-
"""Versiona style.css e script.js pelo hash do próprio conteúdo.

Substitui o `?v=N` manual: se o arquivo muda, a URL muda sozinha, e o cache
de um dia do _headers deixa de servir versão velha. Se o arquivo não muda,
a URL continua igual e o cache é aproveitado.

Rode antes de cada deploy:  python3 tools/fingerprint.py
"""
import hashlib, io, os, re, glob, sys

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ARQUIVOS = ["style.css", "script.js"]


def hash_de(caminho):
    with open(caminho, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()[:10]


def main():
    os.chdir(RAIZ)
    versoes = {}
    for nome in ARQUIVOS:
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
            # troca qualquer ?v=... existente pelo hash, com ou sem barra inicial
            s = re.sub(r'(["\'])(/?)%s\?v=[^"\']*(["\'])' % re.escape(nome),
                       lambda m: "%s%s%s?v=%s%s" % (m.group(1), m.group(2), nome, h, m.group(3)),
                       s)
            # e versiona referências que ainda não tenham query
            s = re.sub(r'(["\'])(/?)%s(["\'])' % re.escape(nome),
                       lambda m: "%s%s%s?v=%s%s" % (m.group(1), m.group(2), nome, h, m.group(3)),
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
