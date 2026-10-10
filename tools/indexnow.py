# -*- coding: utf-8 -*-
"""Avisa o IndexNow (Bing, Yandex, Seznam, Naver e Yep) de todas as páginas do sitemap.

Rode DEPOIS de a publicação estar no ar:  python3 tools/indexnow.py [--so-mostrar]
A chave é o nome do arquivo public/<chave>.txt (o buscador confere a posse lendo esse arquivo no site).
Só a rede padrão do Python; sai 1 se o serviço recusar.
"""
import json, pathlib, re, sys, urllib.request

RAIZ = pathlib.Path(__file__).resolve().parent.parent / "public"
HOST = "site.softpaybr.com"
CHAVE = "afb71ab9820666f31d755c17910faf3c"


def urls():
    return re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", (RAIZ / "sitemap.xml").read_text(encoding="utf-8"))


def main():
    lista = urls()
    if not (RAIZ / f"{CHAVE}.txt").exists():
        print("falta o arquivo da chave em public/"); return 1
    if "--so-mostrar" in sys.argv:
        print(len(lista), "endereços;", lista[0], "…", lista[-1]); return 0
    corpo = json.dumps({"host": HOST, "key": CHAVE, "keyLocation": f"https://{HOST}/{CHAVE}.txt", "urlList": lista}).encode()
    pedido = urllib.request.Request("https://api.indexnow.org/indexnow", data=corpo, headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        r = urllib.request.urlopen(pedido, timeout=30)
        print(f"IndexNow: {len(lista)} endereços enviados, resposta {r.status}")
        return 0 if r.status in (200, 202) else 1
    except urllib.error.HTTPError as e:
        print(f"IndexNow recusou: {e.code} {e.read()[:200]!r}"); return 1


if __name__ == "__main__":
    sys.exit(main())
