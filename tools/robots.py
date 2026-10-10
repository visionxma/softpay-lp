# -*- coding: utf-8 -*-
"""Gera public/robots.txt: libera busca E IA, fecha só a área logada.

Lista de rastreadores = a do protocolo de alavancagem (fase 3), 31 nomes. Cada
robô com grupo próprio ignora o grupo `*`, então as regras de Disallow se
repetem em todos (senão um robô nomeado poderia entrar em /auth).

Uso: python3 tools/robots.py
"""
import io, os

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

ROBOS = """Googlebot Googlebot-Image Google-Extended Bingbot DuckDuckBot YandexBot
Applebot Applebot-Extended GPTBot OAI-SearchBot ChatGPT-User PerplexityBot
Perplexity-User ClaudeBot Claude-User Claude-SearchBot anthropic-ai CCBot Amazonbot
Bytespider meta-externalagent FacebookBot LinkedInBot Twitterbot WhatsApp cohere-ai
YouBot Diffbot ImagesiftBot PetalBot Timpibot""".split()

FECHADO = ["/api/", "/admin", "/dashboard", "/login", "/conta", "/auth", "/app"]


def texto():
    regras = "Allow: /\n" + "".join("Disallow: %s\n" % p for p in FECHADO)
    regras += "Allow: /*.css$\nAllow: /*.js$\n"
    out = ["# robots.txt — SoftPay (site.softpaybr.com)",
           "# GERADO por tools/robots.py — não editar à mão.",
           "# Libera buscadores e assistentes de IA de propósito: as pessoas também",
           "# perguntam \"qual sistema de PDV para mercadinho?\" no ChatGPT, no Perplexity e",
           "# no Gemini. O resumo para eles está em /llms.txt (e o texto inteiro em",
           "# /llms-full.txt). Só a área logada do aplicativo fica fechada.",
           "", "User-agent: *", regras.rstrip("\n"), ""]
    for r in ROBOS:
        out += ["User-agent: %s" % r, regras.rstrip("\n"), ""]
    out += ["Sitemap: https://site.softpaybr.com/sitemap.xml", ""]
    return "\n".join(out)


def gerar():
    io.open(os.path.join(RAIZ, "public", "robots.txt"), "w", encoding="utf-8").write(texto())
    return len(ROBOS)


if __name__ == "__main__":
    print("robots.txt: %d rastreadores nomeados" % gerar())
