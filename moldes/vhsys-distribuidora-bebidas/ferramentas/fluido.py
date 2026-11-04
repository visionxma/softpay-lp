#!/usr/bin/env python3
"""Expande $P/$R e F(a,b) em clamp() fluido entre 390 px (valor a) e 1440 px (valor b), as duas larguras da captura.
uso: python3 fluido.py molde.fonte.css > ../molde.css   (a fonte mora em ferramentas/; o molde.css é o gerado)"""
import re, sys

def fmt(x):
    s = f"{x:.3f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s

def F(m):
    a, b = float(m.group(1)), float(m.group(2))
    if a == b:
        return f"{fmt(a)}px"
    k = (b - a) / 1050
    c = a - k * 390
    lo, hi = min(a, b), max(a, b)
    sinal = '+' if k >= 0 else '-'
    return f"clamp({fmt(lo)}px, {fmt(c)}px {sinal} {fmt(abs(k) * 100)}vw, {fmt(hi)}px)"

texto = open(sys.argv[1], encoding='utf8').read()
# $P = a página vestida, $R = a raiz do molde (a fonte fica curta e legível)
texto = texto.replace('$P', '.page-molde.mx-vhsys-distribuidora-bebidas').replace('$R', '.mx-vhsys-distribuidora-bebidas')
sys.stdout.write(re.sub(r"F\((-?[\d.]+),\s*(-?[\d.]+)\)", F, texto))
