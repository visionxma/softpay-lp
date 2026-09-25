# Gera as fontes do SoftPay (OFL) com o desenho medido contra a tipografia da Stone:
#   SoftPay Display = Roboto Flex fixada em wdth 28 / wght 650 / opsz 144
#                     (o par mais próximo da ABC Gravity XCompressed: IoU 0,875)
#   SoftPay Texto   = Funnel Sans em 350/450/625/725 servidos como 400/500/600/700
#                     (os pesos que mais se aproximam da Roobert 400/500/600/700)
import os, glob, urllib.parse
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

AQUI = os.path.dirname(os.path.abspath(__file__))
C = {urllib.parse.unquote(os.path.basename(p)): p for p in glob.glob(os.path.join(AQUI, 'cand', '*.ttf'))}
def acha(prefixo):
    return [p for n, p in C.items() if n.startswith(prefixo)][0]

UNI = [*range(0x20, 0x7F), *range(0xA0, 0x100), 0x131, 0x152, 0x153, 0x2C6, 0x2DA, 0x2DC,
       0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E, 0x2022, 0x2026,
       0x2039, 0x203A, 0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212, 0x2713]

def subsetar(font, saida):
    o = subset.Options()
    o.flavor = 'woff2'
    o.layout_features = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'tnum', 'lnum', 'pnum', 'case', 'frac', 'sups']
    o.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
    o.notdef_outline = True
    o.drop_tables += ['STAT', 'DSIG']
    s = subset.Subsetter(o)
    s.populate(unicodes=[u for u in UNI if u in font.getBestCmap()])
    s.subset(font)
    font.flavor = 'woff2'
    font.save(saida)
    print(os.path.basename(saida), os.path.getsize(saida) // 1024, 'KB')

# Display
rf = TTFont(acha('RobotoFlex'))
eixos = {a.axisTag: a.defaultValue for a in rf['fvar'].axes}
eixos.update({'wdth': 28, 'wght': 650, 'opsz': 144})
d = instancer.instantiateVariableFont(rf, eixos, updateFontNames=False)
# espaço da ABC Gravity: 0,136 da altura da maiúscula (a Roboto Flex tem 0,225)
upm = d['head'].unitsPerEm
cap = d['OS/2'].sCapHeight or 0.712 * upm
cmap = d.getBestCmap()
for u in (0x20, 0xA0):
    g = cmap.get(u)
    if g:
        adv, lsb = d['hmtx'][g]
        d['hmtx'][g] = (round(0.136 * cap), lsb)
subsetar(d, os.path.join(AQUI, 'saida', 'softpay-display.woff2'))

# Texto
for css, w in ((400, 350), (500, 450), (600, 625), (700, 725)):
    f = instancer.instantiateVariableFont(TTFont(acha('FunnelSans[')), {'wght': w}, updateFontNames=False)
    subsetar(f, os.path.join(AQUI, 'saida', f'softpay-texto-{css}.woff2'))
f = instancer.instantiateVariableFont(TTFont(acha('FunnelSans-Italic')), {'wght': 350}, updateFontNames=False)
subsetar(f, os.path.join(AQUI, 'saida', 'softpay-texto-400-italico.woff2'))
