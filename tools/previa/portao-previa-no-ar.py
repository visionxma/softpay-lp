#!/usr/bin/env python3
"""Portão: todo molde pronto (public/moldes/<id>/) tem a rota dele NO AR na prévia.

Nasceu da correção do Victor em 03/11/2026 ("você demorou esse tempo todo para
não entregar nada"): clone feito e commitado tem de estar visível em
https://softpay-previa.pages.dev desde a 1ª tela, nunca só na branch.
Sai 1 se alguma rota de molde pronto não responder 200 com a marca `mx-<id>`.
Republicar: zsh tools/previa/publicar.sh
"""
import json, pathlib, sys, urllib.request

RAIZ = pathlib.Path(__file__).resolve().parents[2]
BASE = sys.argv[1] if len(sys.argv) > 1 else "https://softpay-previa.pages.dev"
rotas = json.loads((RAIZ / "rotas-clonadas.json").read_text())["rotas"]
prontos = {p.name for p in (RAIZ / "public/moldes").iterdir() if p.is_dir()}
falhas = 0
for rota, info in rotas.items():
    mid = info.get("molde")
    if mid not in prontos:
        continue
    try:
        with urllib.request.urlopen(urllib.request.Request(BASE + rota, headers={"User-Agent": "portao-previa"}), timeout=20) as r:
            ok = r.status == 200 and f"mx-{mid}" in r.read().decode("utf-8", "replace")
    except Exception as e:
        ok = False
    print(("ok   " if ok else "FALTA"), rota, mid)
    falhas += not ok
print(f"{len([1 for i in rotas.values() if i.get('molde') in prontos]) - falhas} no ar, {falhas} faltando")
sys.exit(1 if falhas else 0)
