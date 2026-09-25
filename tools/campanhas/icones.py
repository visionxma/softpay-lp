"""Ícones de traço (24x24, stroke currentColor) usados nas páginas de campanha.

Um lugar só para os desenhos: a página chama pelo nome e o gerador escreve o
<svg> embutido — sem biblioteca de ícones, sem pedido de rede.
"""

TRACOS = {
    'nota': '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
    'globo': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    'nuvem': '<path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 9.4 4.3 4.3 0 0 0 7 18z"/>',
    'aparelhos': '<rect x="3" y="4" width="13" height="10" rx="1.5"/><path d="M7 18h5"/><rect x="17" y="8" width="4.5" height="10" rx="1"/>',
    'caixa': '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/>',
    'codigo': '<path d="M4 5v14M7 5v14M10 5v14M13 5v14M17 5v14M20 5v14"/>',
    'escudo': '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    'caixas': '<path d="M3 8l9-5 9 5-9 5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    'caderno': '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 3v18M12 8h4M12 12h4"/>',
    'fone': '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/>',
    'queda': '<path d="M3 7l6 6 4-4 8 8"/><path d="M21 12v5h-5"/>',
    'fantasma': '<path d="M5 20V10a7 7 0 0 1 14 0v10l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2z"/><path d="M9.5 10.5h.01M14.5 10.5h.01"/>',
    'cadeado': '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    'etiqueta': '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    'balanca': '<path d="M12 4v16M5 20h14"/><path d="M5 8l-3 6h6zM19 8l-3 6h6z"/><path d="M5 8h14"/>',
    'relogio': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'sincroniza': '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
    'ferramenta': '<path d="M14.5 6.5a4 4 0 0 0 5 5L13 18l-3 3-3-3 3-3 6.5-6.5a4 4 0 0 0-2-2z"/>',
    'foguete': '<path d="M5 15c-1 1.5-1 4-1 4s2.5 0 4-1"/><path d="M9 15l-3-3c1.5-4.5 5-8 11-9 0 6-4.5 9.5-9 11z"/><circle cx="15" cy="9" r="1.5"/>',
    'whats': '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1.2-1.2 1.8.8-.3 1.6c-3.8.4-8.1-3.9-7.7-7.7l1.6-.3.8 1.8z"/>',
    'celular': '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
    'tablet': '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M11 18h2"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'mais': '<path d="M12 5v14M5 12h14"/>',
    'seta': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'play': '<path d="M8 5v14l11-7z"/>',
    'usuarios': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    'mapa': '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    'loja': '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/>',
    'grafico': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    'pix': '<path d="M12 3l4 4-4 4-4-4z"/><path d="M12 13l4 4-4 4-4-4z"/><path d="M3 12l4-4 4 4-4 4zM13 12l4-4 4 4-4 4z"/>',
}


def icone(nome, tam=22, classe='ic'):
    return (f'<svg class="{classe}" width="{tam}" height="{tam}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" '
            f'aria-hidden="true" focusable="false">{TRACOS[nome]}</svg>')
