"""Conteúdo das páginas de campanha. Toda frase aqui tem de ser verdade no app.

Fonte da verdade: a home (index.html: planos, dúvidas, "sem pegadinha") e as
páginas de solução. O que o SoftPay NÃO tem não entra, mesmo que a referência
tenha: nota "ilimitada", plano grátis para sempre, nota de satisfação, anos de
mercado. O teste é de 7 dias, sem cartão; o plano mais barato é R$ 65.

Regras de copy do portão anti-slop: sem travessão, no máximo um ponto do meio
por frase, nada de emoji como ícone.
"""

LOJA_FOTO = '/assets/lojistas/'
SEGMENTOS = [
    ('Mercadinho', LOJA_FOTO + '800/mercadinho.webp', '/segmentos/mercadinho/'),
    ('Loja de roupas', LOJA_FOTO + '800/loja-de-roupas.webp', '/segmentos/loja-de-roupas/'),
    ('Farmácia', LOJA_FOTO + '800/farmacia.webp', '/segmentos/farmacia/'),
    ('Distribuidora', LOJA_FOTO + '800/distribuidora.webp', '/segmentos/distribuidora/'),
    ('Papelaria', LOJA_FOTO + '800/papelaria.webp', '/segmentos/papelaria/'),
    ('Variedades', LOJA_FOTO + '800/loja-de-variedades.webp', '/segmentos/loja-de-variedades/'),
]

NUMEROS = [
    ('+100', '100', '+', '', 'lojistas usando o SoftPay todo dia'),
    ('8', '8', '', '', 'estados com loja usando'),
    ('7 dias', '', '', '', 'de teste com o sistema aberto'),
    ('R$ 0', '', '', '', 'para começar: sem taxa de instalação'),
]

DEPOIMENTOS = {
    'id': 'depoimentos',
    'h2': ['Quem já largou', '*o caderno'],
    'sub': 'Lojistas do Maranhão que usam o SoftPay no balcão, todo dia, contando o que mudou.',
    'videos': [
        ('/assets/depoimentos/gabriel-landim.mp4', '/assets/depoimentos/gabriel-landim.webp',
         'Antes eu só sabia quanto tinha vendido no fim do mês. Agora vejo no dia.',
         'Gabriel Landim', 'Celulares e acessórios'),
        ('/assets/depoimentos/neto-rn-grifes.mp4', '/assets/depoimentos/neto-rn-grifes.webp',
         'O fiado saiu do caderno. Hoje o cliente recebe o link e paga por Pix.',
         'Neto', 'RN Grifes, loja de roupas'),
    ],
    'numeros': [
        ('+100', '100', '+', 'lojistas usando'),
        ('8', '8', '', 'estados com loja'),
    ],
    'estados_titulo': 'Onde já tem loja usando',
    'estados': ['Maranhão', 'Piauí', 'Pará', 'Pernambuco', 'Mato Grosso', 'São Paulo', 'Rio de Janeiro', 'Paraná'],
}

NUVEM = {
    'id': 'nuvem',
    'pilula': 'Sistema na nuvem',
    'h2': ['Por que trocar por um', '*sistema na nuvem?'],
    'sub': 'A gestão da loja sai do computador do balcão e vai com você para onde você for.',
    'itens': [
        ('globo', 'Acesse de qualquer lugar', 'Na loja, em casa ou na rua: basta abrir o navegador e entrar com o seu e-mail.'),
        ('aparelhos', 'Computador, celular e tablet', 'Chrome, Edge, Safari ou Firefox. Qualquer aparelho com internet serve, sem instalar nada.'),
        ('nuvem', 'Cópia de segurança sozinha', 'O computador quebrou ou sumiu? Você abre em outro aparelho e está tudo lá, com backup de todo dia.'),
        ('sincroniza', 'Do balcão ao escritório', 'Lance a venda no balcão e confira o caixa em casa. Os mesmos números, na mesma hora.'),
        ('ferramenta', 'Sem instalação e sem técnico', 'Criou a conta, já está usando. Não precisa de visita técnica nem de servidor na loja.'),
        ('foguete', 'Atualização que chega sozinha', 'Recurso novo chega para todo mundo ao mesmo tempo, sem baixar e sem reinstalar.'),
    ],
}

FAQ_BASE = [
    ('O teste é grátis mesmo?',
     'Sim. São 7 dias com acesso aos recursos do plano, sem pagar nada. Depois você escolhe um plano a partir de R$ 65 por mês, ou simplesmente não continua.'),
    ('Precisa de cartão de crédito para testar?',
     'Não. O cadastro do teste de 7 dias não pede cartão de crédito.'),
    ('Preciso instalar alguma coisa?',
     'Não. O SoftPay funciona pelo navegador, no computador do balcão e no celular. Não precisa instalar programa nem manter servidor na loja.'),
    ('Funciona no celular e no tablet?',
     'Sim. Ele roda no navegador do celular e do tablet, sem baixar aplicativo, com os recursos do dia a dia da loja.'),
    ('O SoftPay emite nota fiscal?',
     'Sim, nos planos ERP Completo (R$ 109 por mês) e Nota Fiscal (R$ 65 por mês): NFC-e, NF-e, NFS-e e MDF-e, com o pacote do contador incluído.'),
    ('Quanto custa depois do teste?',
     'São quatro planos mensais: Nota Fiscal por R$ 65, Comércio por R$ 69, Loja por R$ 89 e ERP Completo por R$ 109. <a href="/#planos">Veja o que cada um tem</a>.'),
    ('Meus dados ficam seguros?',
     'Os dados ficam num banco de dados na nuvem, com backup automático e acesso individual por usuário. Nenhum sistema promete segurança absoluta, mas os seus dados não dependem do computador da loja.'),
    ('Funciona em Mac e Linux?',
     'Sim. O que ele pede é um navegador atualizado: Chrome, Edge, Safari ou Firefox, em qualquer sistema.'),
    ('Tem taxa de instalação ou fidelidade?',
     'Não. Sem taxa de instalação, sem cobrança para passar os seus produtos para o sistema e sem fidelidade. Você pode cancelar quando quiser.'),
    ('O SoftPay substitui a maquininha?',
     'Não. Ele registra a venda e o recebimento, mas não processa cartão: trabalha junto com a maquininha que você já tem.'),
    ('Quem me ajuda a configurar?',
     'Uma pessoa da equipe, pelo WhatsApp. Sem robô, sem número de protocolo e sem fila.'),
]

CUPOM_CONTA = {
    'titulo': 'SOFTPAY',
    'sub': 'Conta para começar hoje',
    'linhas': [
        ('Sistema aberto por 7 dias', 'R$ 0,00'),
        ('Instalação', 'R$ 0,00'),
        ('Passar seus produtos', 'R$ 0,00'),
        ('Cartão de crédito', 'não pede'),
        ('Fidelidade', 'nenhuma'),
    ],
    'total': ('Total hoje', 'R$ 0,00'),
    'rodape': 'Obrigado pela preferência. Volte sempre.',
}

PAGINAS = [
    # ------------------------------------------------------------------ 1
    # Clone de lp.gestaomaissimples.com.br/lp/gratis: mesma espinha, mesma
    # ordem, mesmo raciocínio de copy (dor antes de recurso, prova antes de
    # pedir, objeção respondida perto do botão). A oferta é a nossa: 7 dias.
    {
        'slug': 'teste-gratis',
        'title': 'Sistema de gestão com PDV e nota fiscal, direto no navegador | SoftPay',
        'description': 'PDV, estoque, caixa, fiado e nota fiscal num sistema que roda no navegador. Teste o SoftPay por 7 dias grátis, sem cartão de crédito.',
        'menu': [('recursos', 'Recursos'), ('como-funciona', 'Como funciona'), ('depoimentos', 'Depoimentos'), ('duvidas', 'Dúvidas')],
        'hero': {
            'foto': LOJA_FOTO + 'mercadinho.webp',
            'peca': '/assets/hero/aparelhos-2-1200.webp',
            'peca_alt': 'O SoftPay aberto num monitor e num celular: o PDV com o carrinho fechando em R$ 414,60',
            'selo': 'Sistema 100% online, sem instalar nada',
            'h1': ['*Sistema de gestão', 'com PDV e nota fiscal,', 'direto no navegador'],
            'sub': 'Feito para o comércio que vende produto com estoque. <b>Mais de 100 lojistas</b> já trocaram o caderno e a planilha pelo SoftPay. Você testa <b>7 dias sem pagar nada</b> e sem cadastrar cartão.',
            'chips': [('nota', 'Nota fiscal NFC-e e NF-e'), ('globo', 'Acesse de qualquer lugar'),
                      ('nuvem', 'Backup automático'), ('aparelhos', 'PC, celular e tablet')],
            'cta': 'Testar grátis',
            'cta2': ('Como funciona', '#como-funciona'),
            'prova': [('usuarios', '+100', 'lojistas'), ('mapa', '8', 'estados'), ('whats', 'Suporte', 'humano no WhatsApp')],
            'cupom': {
                'titulo': 'SOFTPAY',
                'sub': 'Venda 0142 no caixa 1',
                'linhas': [('2x Refrigerante', 'R$ 19,80'), ('1x Arroz 5kg', 'R$ 27,90'),
                           ('Pago no Pix', 'ok'), ('Estoque baixado', 'ok')],
                'total': ('Total', 'R$ 47,70'),
            },
        },
        'numeros': {
            'lead': 'O que já dá para contar de quem usa o SoftPay no balcão',
            'itens': NUMEROS,
            'segmentos': SEGMENTOS,
        },
        'dores': {
            'id': 'dores',
            'pilula': 'Vende o dia todo e no fim do mês não sobra nada?',
            'h2': ['Você vende o dia todo e', '*o dinheiro some no fim do mês?'],
            'sub': 'Se pelo menos uma destas situações acontece na sua loja, o SoftPay foi feito para você.',
            'itens': [
                ('queda', 'O lucro some', 'O mês fecha, a conta não bate e ninguém sabe para onde foi o dinheiro. Vendeu muito e não sobrou.'),
                ('fantasma', 'Estoque fantasma', 'O sistema diz que tem, a prateleira diz que não. Falta o que vende e sobra o que encalha.'),
                ('cadeado', 'Preso a um computador', 'Saiu da loja e ficou no escuro: quanto vendeu, quanto entrou no caixa, quem pagou.'),
                ('etiqueta', 'Preço desatualizado', 'O custo subiu, o preço ficou para trás e a margem foi embora sem ninguém ver.'),
                ('caixa', 'Caixa que nunca fecha', 'Sobra ou falta no fim do dia, e a conferência vira discussão no balcão.'),
                ('caderno', 'Fiado no caderno', 'Quem deve, quanto e desde quando? O caderno anota, mas não cobra ninguém.'),
            ],
            'meio': {
                'titulo': 'Se identificou com alguma dessas situações?',
                'texto': 'Os 7 dias são grátis e sem cartão. Você cria a conta e começa a vender pelo navegador ainda hoje.',
                'cta': 'Resolver isso agora',
            },
        },
        'porque': {
            'id': 'recursos',
            'h2': ['Por que +100 lojistas', '*escolheram o SoftPay'],
            'sub': 'Porque é rápido no balcão, mostra o que está acontecendo na loja e roda no navegador.',
            'itens': [
                ('nota', 'Nota fiscal sem depender do escritório',
                 'NFC-e e NF-e saem da própria venda, com cadastro fiscal e pacote do contador incluídos.',
                 ['NFC-e, NF-e, NFS-e e MDF-e', 'Notas recebidas: ver e manifestar', 'Pacote do contador incluído'],
                 'Planos ERP Completo e Nota Fiscal'),
                ('codigo', 'Venda rápida no PDV',
                 'Leitor de código de barras, busca por nome, desconto e finalização numa tela só.',
                 ['Dinheiro, Pix, cartão, fiado e misto', 'Cada venda baixa o estoque na hora', 'No computador do balcão e no celular'],
                 ''),
                ('escudo', 'Dados seguros na nuvem',
                 'Se o computador quebrar, você abre em outro aparelho e está tudo lá.',
                 ['Cópia de segurança todo dia', 'Acesso individual por usuário', 'Nada preso ao computador da loja'],
                 ''),
                ('caixas', 'Estoque que bate com a prateleira',
                 'Entrada, saída, custo e preço por produto, com variação de tamanho e cor.',
                 ['Aviso de item acabando', 'Custo e margem por produto', 'Curva ABC: o que gira e o que empata'],
                 'Curva ABC no plano Loja'),
                ('pix', 'Fiado que cobra sozinho',
                 'Cada cliente com a conta dele. O link de pagamento Pix vai pelo WhatsApp e a conta baixa quando o dinheiro cai.',
                 ['Quem deve, quanto e há quantos dias', 'Cobrança por link Pix', 'Baixa automática do pagamento'],
                 'A partir do plano Loja'),
                ('fone', 'Suporte de gente',
                 'Você manda mensagem no WhatsApp e fala com uma pessoa da equipe, sem robô e sem fila.',
                 ['Ajuda para configurar', 'Atendimento para todo o Brasil', 'Atualização para todos ao mesmo tempo'],
                 ''),
            ],
        },
        'passos': {
            'id': 'como-funciona',
            'h2': ['Veja como é rápido', '*começar'],
            'sub': 'Em três passos você já está vendendo, sem instalar nada.',
            'itens': [
                ('Crie sua conta', 'Nome, e-mail e senha. Não pede cartão de crédito e não tem nada para instalar.'),
                ('Abra no navegador', 'No computador do balcão, no celular ou no tablet. Chrome, Edge, Safari ou Firefox.'),
                ('Cadastre e venda', 'Cadastre os produtos, abra o caixa e faça a primeira venda. Se travar, o suporte ajuda pelo WhatsApp.'),
            ],
            'tour_titulo': 'O sistema por dentro',
            'tour': [
                ('PDV', '/assets/sistema/pdv.webp', 'O PDV do SoftPay com o carrinho de uma venda fechando em R$ 414,60'),
                ('Estoque', '/assets/sistema/estoque.webp', 'O controle de estoque do SoftPay com a lista de produtos, saldo e preço'),
                ('Finanças', '/assets/sistema/financeiro.webp', 'O painel financeiro do SoftPay com vendas, faturamento e formas de pagamento'),
                ('Notas', '/assets/sistema/fiscal.webp', 'A tela de notas fiscais do SoftPay'),
            ],
        },
        'depoimentos': DEPOIMENTOS,
        'nuvem': NUVEM,
        'comece': {
            'h2': ['Comece agora,', '*sem cartão'],
            'texto': 'Crie a conta, entre no sistema pelo navegador e faça a primeira venda hoje mesmo. Se não servir para a sua loja, é só não continuar.',
            'cta': 'Criar conta grátis',
            'nota': 'Você vai para a tela de cadastro do SoftPay.',
            'checks': ['Acesso imediato', 'Sem cartão de crédito', 'Ajuda no WhatsApp'],
            'cupom': CUPOM_CONTA,
        },
        'faq': {'id': 'duvidas', 'h2': ['Perguntas', '*frequentes'], 'itens': FAQ_BASE},
        'final': {
            'h2': ['Pronto para organizar', '*a sua loja?'],
            'texto': 'Mais de 100 lojistas já controlam estoque, caixa e fiado num sistema que roda no navegador. A sua vez começa com 7 dias grátis.',
            'cta': 'Testar grátis',
            'selos': ['7 dias grátis', 'Sem cartão', 'Sem instalar'],
        },
    },
]

# ---------------------------------------------------------------------- 2
# Clone de muvypdv.com.br: o preço no título, a rotina do balcão em prosa,
# os segmentos em bento, as dores em forma de fala do lojista ("a fila não
# anda") com a resposta embaixo, recursos com foto, planos comparados, dois
# caminhos no fim (testar ou falar com gente) e perguntas. O que a Muvy tem e
# o SoftPay não tem (balança, modo offline, comanda de restaurante) não entra.
PAGINAS.append({
    'slug': 'pdv',
    'title': 'Sistema PDV para loja por R$ 69 por mês, com estoque e fiado | SoftPay',
    'description': 'O PDV do SoftPay registra a venda, baixa o estoque e controla o fiado, no computador ou no celular. A partir de R$ 69 por mês, com 7 dias grátis e sem cartão.',
    'menu': [('rotina', 'O PDV'), ('negocios', 'Negócios'), ('planos', 'Planos'), ('duvidas', 'Dúvidas')],
    'secoes': ['hero', 'prosa', 'bento', 'citacoes', 'fotorecursos', 'planos', 'depoimentos', 'cta_duplo', 'faq'],
    'hero': {
        'foto': LOJA_FOTO + 'casal-comerciantes.webp',
        'peca': '/assets/hero/aparelhos-2-1200.webp',
        'peca_alt': 'O PDV do SoftPay aberto num monitor e num celular, com o carrinho fechando em R$ 414,60',
        'selo': 'Teste 7 dias grátis, sem cartão',
        'h1': ['O sistema PDV que', 'resolve caixa, estoque', 'e fiado por', '*R$ 69 por mês'],
        'sub': 'Venda rápida no balcão, estoque que baixa sozinho e o caderno de fiado dentro do sistema. Funciona no computador e no celular, <b>sem instalar nada</b> e <b>sem fidelidade</b>.',
        'chips': [('codigo', 'Leitor de código de barras'), ('caixas', 'Estoque em tempo real'),
                  ('caderno', 'Fiado por cliente'), ('pix', 'Dinheiro, Pix e cartão')],
        'cta': 'Testar grátis',
        'cta2': ('Ver planos', '#planos'),
        'prova': [('usuarios', '+100', 'lojistas'), ('mapa', '8', 'estados'), ('whats', 'Suporte', 'humano no WhatsApp')],
        'cupom': {
            'titulo': 'SOFTPAY',
            'sub': 'Caixa 1 fechado às 19:02',
            'linhas': [('Dinheiro', 'R$ 612,40'), ('Pix', 'R$ 1.148,90'), ('Cartão', 'R$ 903,70'), ('Fiado', 'R$ 126,00')],
            'total': ('Total do dia', 'R$ 2.791,00'),
        },
    },
    'prosa': {
        'id': 'rotina',
        'foto': LOJA_FOTO + 'celular-balcao.webp',
        'foto_alt': 'Mão segurando o celular no balcão da loja',
        'h2': ['O ponto de venda que', '*entende a rotina do balcão'],
        'paragrafos': [
            'Pense no sábado de movimento: a fila andando, o estoque se atualizando sozinho e, no fim do dia, o número exato do que entrou. É isso que o PDV do SoftPay põe na rotina da loja.',
            'A venda é registrada na hora, com produto, quantidade, preço e forma de pagamento. A mesma venda baixa o estoque e entra no caixa: um registro, e a prateleira, a gaveta e o relatório contam a mesma história.',
            'No fim do dia o caixa fecha comparando o sistema com a gaveta, com sangria e suprimento registrados. A diferença aparece no mesmo dia, enquanto ainda dá para lembrar o que houve.',
        ],
        'cta': 'Testar o PDV grátis',
        'cupom': None,
    },
    'bento': {
        'id': 'negocios',
        'h2': ['O PDV certo para o', '*seu tipo de loja'],
        'sub': 'Cada comércio tem um jeito de vender. O SoftPay foi moldado para o varejo que vende produto com estoque.',
        'itens': [
            ('Mercadinhos', LOJA_FOTO + 'mercadinho.webp', '/segmentos/mercadinho/', 'Caixa rápido, fiado do bairro e estoque que avisa o que está acabando.'),
            ('Lojas de roupas', LOJA_FOTO + 'loja-de-roupas.webp', '/segmentos/loja-de-roupas/', 'Tamanho e cor no mesmo produto, e a peça que encalha aparece na curva ABC.'),
            ('Distribuidoras', LOJA_FOTO + 'distribuidora.webp', '/segmentos/distribuidora/', 'Atacado e varejo no mesmo sistema, com o custo de cada produto registrado.'),
            ('Farmácias', LOJA_FOTO + 'farmacia.webp', '/segmentos/farmacia/', 'Venda no balcão, clientes cadastrados e o estoque conferido sem planilha.'),
            ('Papelarias', LOJA_FOTO + 'papelaria.webp', '/segmentos/papelaria/', 'Centenas de itens pequenos com preço certo e saldo que bate.'),
            ('Lojas de variedades', LOJA_FOTO + 'loja-de-variedades.webp', '/segmentos/loja-de-variedades/', 'De tudo um pouco, com margem por produto para saber o que dá lucro.'),
        ],
        'cta': 'Testar grátis na minha loja',
    },
    'citacoes': {
        'id': 'dores',
        'h2': ['Um PDV que resolve', '*a dor de cabeça do caixa'],
        'sub': 'O que a gente mais ouve de quem chega ao SoftPay, e o que muda depois.',
        'tela': '/assets/sistema/celular-carrinho.webp',
        'tela_alt': 'O carrinho de uma venda no celular: quatro itens somando R$ 414,60 e o botão de finalizar',
        'itens': [
            ('A fila não anda e o cliente reclama.', 'Leitor de código de barras e busca por nome na mesma tela. A venda fecha em poucos toques.'),
            ('Nunca sei o que tem no estoque.', 'Vendeu, baixou. O saldo acompanha cada venda e avisa quando um item está acabando.'),
            ('O caixa nunca fecha certo.', 'Abertura com troco, sangria, suprimento e fechamento comparando o sistema com a gaveta.'),
            ('Perco o controle do fiado.', 'Cada cliente com a conta dele: quanto deve e desde quando. No plano Loja, a cobrança vai por link Pix.'),
            ('Não sei quanto recebi em Pix e em cartão.', 'Cada forma de pagamento aparece separada no fechamento, sem somar na calculadora.'),
            ('Queria vender online, mas é complicado.', 'A loja online usa o mesmo cadastro e o mesmo estoque do balcão, com Pix de confirmação automática.'),
        ],
    },
    'fotorecursos': {
        'id': 'recursos',
        'h2': ['Por que o SoftPay é o PDV', '*da sua loja'],
        'sub': 'O que vem junto com a frente de caixa, sem pagar sistema extra.',
        'itens': [
            (LOJA_FOTO + 'celular-balcao.webp', 'Venda pelo WhatsApp', 'Mande um áudio dizendo o que vendeu: o SoftPay registra, baixa o estoque e confirma. No plano Loja.'),
            (LOJA_FOTO + 'loja-de-roupas.webp', 'Funciona no celular', 'O mesmo sistema do computador do balcão, no navegador do celular e do tablet.'),
            (LOJA_FOTO + 'cosmeticos-e-perfumaria.webp', 'Loja online com Pix', 'O catálogo sai do cadastro que você já tem, e o Pix confirma sozinho.'),
            (LOJA_FOTO + 'distribuidora.webp', 'Nota fiscal no plano ERP', 'NFC-e e NF-e a partir da venda, com o pacote do contador incluído.'),
            (LOJA_FOTO + 'empresas-com-filiais.webp', 'Equipe com acesso próprio', 'Cada funcionário entra com o próprio usuário. Os planos vão de 1 a 10 usuários.'),
            (LOJA_FOTO + 'casal-comerciantes.webp', 'Suporte de gente', 'Fale com uma pessoa da equipe pelo WhatsApp, sem robô e sem fila.'),
        ],
    },
    'planos': {
        'h2': ['Planos para cada', '*tamanho de loja'],
        'sub': 'Todos com 7 dias grátis para testar, sem cartão de crédito. Você escolhe depois.',
        'notas': ['Sem cartão para testar', 'Cancele quando quiser', 'Sem taxa de instalação'],
    },
    'depoimentos': DEPOIMENTOS,
    'cta_duplo': {
        'h2': ['Pronto para ter um PDV', '*que trabalha por você?'],
        'texto': 'Chega de fazer do jeito difícil. A organização que a sua loja precisa está a um clique, sem fidelidade e com um preço que cabe no mês.',
        'cta': 'Testar grátis',
        'cta2': 'Tirar dúvidas',
    },
    'faq': {'id': 'duvidas', 'h2': ['Perguntas sobre', '*o PDV'], 'itens': [
        ('O que é o PDV do SoftPay?',
         'É a frente de caixa do SoftPay: registra a venda com produto, quantidade, preço, forma de pagamento e cliente, e na mesma hora baixa o estoque e lança no caixa.'),
        ('Quanto custa?',
         'O plano Comércio, com PDV e caixa completo, fiado e estoque essencial, custa R$ 69 por mês. O plano Loja custa R$ 89 e o ERP Completo, com nota fiscal, R$ 109.'),
        ('Posso testar antes de pagar?',
         'Sim. São 7 dias com acesso aos recursos do plano, sem cartão de crédito.'),
        ('Funciona com leitor de código de barras?',
         'Sim. O PDV aceita leitor de código de barras e também busca o produto pelo nome.'),
        ('Preciso de computador?',
         'Não. O SoftPay funciona no navegador do computador, do celular e do tablet. Muita loja usa o computador no balcão e o celular fora dele.'),
        ('Quais formas de pagamento o caixa registra?',
         'Dinheiro, Pix, cartão, fiado e pagamento misto. No fechamento, cada forma aparece separada.'),
        ('O SoftPay emite nota fiscal?',
         'Sim, nos planos ERP Completo (R$ 109 por mês) e Nota Fiscal (R$ 65 por mês): NFC-e, NF-e, NFS-e e MDF-e.'),
        ('Substitui a maquininha de cartão?',
         'Não. O SoftPay registra a venda e o recebimento, mas não processa cartão: trabalha junto com a maquininha que você já tem.'),
        ('Tem fidelidade ou taxa de instalação?',
         'Não. Sem fidelidade, sem taxa de instalação e sem cobrança para passar os seus produtos para o sistema.'),
        ('Quem me ajuda a começar?',
         'Uma pessoa da equipe, pelo WhatsApp. Ela ajuda a configurar o caixa e a cadastrar os primeiros produtos.'),
    ]},
})

# ---------------------------------------------------------------------- 3
# Clone de nextar.com.br: página de produto que mostra "como é usar". Hero
# com índice dos módulos, avaliações logo em seguida, um bloco por recurso
# (estoque, relatórios, onde funciona, caixa, catálogo), segmentos, perguntas
# e números com contato. O diferencial que a Nex põe no título é o modo sem
# internet; o nosso é o que só o SoftPay tem: registrar a venda falando no
# WhatsApp, com a conversa real da página de solução.
PAGINAS.append({
    'slug': 'gestao',
    'title': 'Sistema de gestão para loja: estoque, caixa e venda pelo WhatsApp | SoftPay',
    'description': 'Estoque, caixa, fiado, relatórios, loja online e venda registrada por áudio no WhatsApp. Teste o SoftPay 7 dias grátis, sem cartão de crédito.',
    'menu': [('estoque', 'Recursos'), ('segmentos', 'Segmentos'), ('whatsapp', 'WhatsApp'), ('duvidas', 'Dúvidas')],
    'secoes': ['hero', 'modulos', 'depoimentos', 'estoque', 'relatorios', 'plataformas', 'caixa', 'catalogo', 'zap', 'segmentos', 'faq', 'contato'],
    'hero': {
        'foto': LOJA_FOTO + 'loja-de-roupas.webp',
        'peca': '/assets/hero/aparelhos-2-1200.webp',
        'peca_alt': 'O SoftPay aberto num monitor e num celular: o PDV com o carrinho fechando em R$ 414,60',
        'selo': 'Sistema de gestão para o comércio',
        'h1': ['Sua loja inteira', 'no controle,', '*até pelo WhatsApp'],
        'sub': 'Venda no balcão, no celular ou mandando um áudio: o SoftPay registra, baixa o estoque e fecha o caixa. <b>Planos a partir de R$ 65 por mês</b>, com 7 dias grátis para testar.',
        'chips': [('caixas', 'Estoque em tempo real'), ('caixa', 'Caixa por turno'),
                  ('grafico', 'Relatório do que dá lucro'), ('whats', 'Venda por áudio')],
        'cta': 'Testar grátis',
        'cta2': ('Ver recursos', '#estoque'),
        'prova': [('usuarios', '+100', 'lojistas'), ('mapa', '8', 'estados'), ('check', 'Sem cartão', 'para testar')],
        'cupom': {
            'titulo': 'SOFTPAY',
            'sub': 'Registrado pelo WhatsApp',
            'linhas': [('2x Coca', 'R$ 10,00'), ('Pago no Pix', 'ok'), ('Estoque baixado', 'ok')],
            'total': ('Total', 'R$ 10,00'),
        },
    },
    'modulos': [('estoque', 'caixas', 'Estoque'), ('relatorios', 'grafico', 'Relatórios'), ('onde', 'aparelhos', 'Aparelhos'),
                ('caixa', 'caixa', 'Caixa'), ('catalogo', 'loja', 'Loja online'), ('whatsapp', 'whats', 'WhatsApp'),
                ('segmentos', 'etiqueta', 'Segmentos'), ('duvidas', 'mais', 'Dúvidas')],
    'depoimentos': dict(DEPOIMENTOS, h2=['Avaliação de', '*quem usa'],
                        sub='Dois lojistas do Maranhão contando, em vídeo, o que mudou depois do SoftPay.'),
    'estoque': {
        'id': 'estoque', 'icone': 'caixas', 'pilula': 'Controle de estoque',
        'h2': ['O estoque que bate', '*com a prateleira'],
        'texto': ['A venda dá baixa sozinha: o estoque é alimentado pelo próprio PDV, sem segunda digitação. É o que impede o desencontro entre o sistema e a prateleira de nascer.',
                  'Com o custo registrado junto do preço, você vê a margem de cada produto e compra com base no que gira.'],
        'cta': 'Testar grátis',
        'tela': '/assets/sistema/estoque.webp',
        'tela_alt': 'O controle de estoque do SoftPay com a lista de produtos, saldo e preço',
        'lista_foto': LOJA_FOTO + 'loja-de-variedades.webp',
        'lista': [
            ('Baixa automática na venda', 'Toda venda do balcão, do celular ou da loja online baixa o mesmo saldo, na hora.'),
            ('Aviso de item acabando', 'O sistema avisa o que está no fim antes de o cliente pedir e não ter.'),
            ('Custo e margem por produto', 'O produto de 15% e o de 60% deixam de virar uma média que engana.'),
            ('Tamanho e cor no mesmo produto', 'Variação para quem vende roupa, calçado e acessório, sem cadastro repetido.'),
            ('Curva ABC no plano Loja', 'O que sustenta o faturamento, o que gira no meio e o que só empata dinheiro.'),
        ],
    },
    'relatorios': {
        'id': 'relatorios', 'pilula': 'Relatórios',
        'h2': ['Quanto vendi?', '*Quanto sobrou?'],
        'texto': 'Faturamento é o que entrou; lucro é o que sobrou. Com custo, despesas e formas de pagamento no mesmo lugar, o fim do mês deixa de ser sensação e vira número para decidir preço, compra e retirada.',
        'cta': 'Ver meus números',
        'foto': LOJA_FOTO + '800/casal-comerciantes.webp',
    },
    'plataformas': {
        'id': 'onde',
        'h2': ['A loja vai', '*com você'],
        'sub': 'O mesmo sistema no balcão e fora dele. Entrou com o seu e-mail, os dados são os mesmos em qualquer aparelho.',
        'aparelhos': [('aparelhos', 'Computador'), ('celular', 'Celular'), ('tablet', 'Tablet'), ('globo', 'Navegador')],
        'chips': [('loja', 'Venda no balcão e fora da loja'), ('sincroniza', 'Tudo salvo na nuvem'), ('usuarios', 'Um usuário para cada funcionário')],
    },
    'caixa': {
        'id': 'caixa', 'icone': 'caixa', 'pilula': 'Controle de caixa', 'alt': True, 'invertido': True,
        'h2': ['O caixa fecha', '*sem susto'],
        'texto': ['Abertura com troco inicial, movimento do dia e fechamento comparando o sistema com a gaveta. A diferença aparece hoje, enquanto ainda dá para lembrar o que houve.',
                  'Suprimento e sangria ficam registrados, e cada forma de pagamento aparece separada: dinheiro, Pix, cartão e fiado.'],
        'cta': 'Testar grátis',
        'tela': '/assets/sistema/pdv.webp',
        'tela_alt': 'O PDV do SoftPay com o caixa aberto e o carrinho de uma venda',
    },
    'catalogo': {
        'id': 'catalogo',
        'lema': 'Cadastrou. Compartilhou. Vendeu.',
        'h2': ['Loja online', '*com Pix'],
        'texto': 'O catálogo usa os produtos que você já cadastrou, com o mesmo preço e o mesmo saldo do balcão. O cliente escolhe pelo celular, paga por Pix e a confirmação chega sozinha.',
        'link': 'link da sua loja',
        'produtos': [(LOJA_FOTO + '800/loja-de-roupas.webp', 'Camiseta básica', 'R$ 49,90', True),
                     (LOJA_FOTO + '800/loja-de-calcados.webp', 'Tênis casual', 'R$ 199,90', True),
                     (LOJA_FOTO + '800/cosmeticos-e-perfumaria.webp', 'Perfume floral', 'R$ 139,90', False)],
        'tela_alt': 'O catálogo online do SoftPay com os produtos da loja',
        'cta': 'Criar minha loja online',
    },
    'zap': {
        'id': 'whatsapp', 'pilula': 'Só no SoftPay',
        'h2': ['Registre a venda', '*falando no WhatsApp'],
        'texto': 'Com o cliente na frente e a mão no troco, abrir o sistema não acontece. Falar, sim. Você manda um áudio ou uma mensagem, e o SoftPay entende, registra e responde em cerca de dois segundos.',
        'operacoes': ['Registrar venda', 'Lançar despesa', 'Dar entrada no estoque', 'Venda fiada no nome do cliente',
                      'Baixa de fiado', 'Suprimento e sangria', 'Consultar saldo e estoque'],
        'cta': 'Testar grátis',
        'nota': 'São 17 operações por conversa, a partir do plano Loja.',
    },
    'segmentos': {
        'id': 'segmentos',
        'h2': ['Feito para quem vende', '*produto com estoque'],
        'sub': 'Cada segmento tem uma página com o jeito dele de usar o SoftPay.',
        'itens': [
            ('Mercadinho', LOJA_FOTO + '800/mercadinho.webp', '/segmentos/mercadinho/'),
            ('Roupas', LOJA_FOTO + '800/loja-de-roupas.webp', '/segmentos/loja-de-roupas/'),
            ('Farmácia', LOJA_FOTO + '800/farmacia.webp', '/segmentos/farmacia/'),
            ('Distribuidora', LOJA_FOTO + '800/distribuidora.webp', '/segmentos/distribuidora/'),
            ('Papelaria', LOJA_FOTO + '800/papelaria.webp', '/segmentos/papelaria/'),
            ('Variedades', LOJA_FOTO + '800/loja-de-variedades.webp', '/segmentos/loja-de-variedades/'),
            ('Calçados', LOJA_FOTO + '800/loja-de-calcados.webp', '/segmentos/loja-de-calcados/'),
            ('Cosméticos', LOJA_FOTO + '800/cosmeticos-e-perfumaria.webp', '/segmentos/cosmeticos-e-perfumaria/'),
            ('Bebidas', LOJA_FOTO + '800/loja-de-bebidas.webp', '/segmentos/loja-de-bebidas/'),
            ('Autopeças', LOJA_FOTO + '800/loja-de-autopecas.webp', '/segmentos/loja-de-autopecas/'),
            ('Pet shop', LOJA_FOTO + '800/pet-shop.webp', '/segmentos/pet-shop/'),
            ('Construção', LOJA_FOTO + '800/materiais-de-construcao.webp', '/segmentos/materiais-de-construcao/'),
        ],
    },
    'faq': {'id': 'duvidas', 'h2': ['Perguntas', '*frequentes'], 'itens': [
        ('Quanto custa o SoftPay?',
         'São quatro planos mensais: Nota Fiscal por R$ 65, Comércio por R$ 69, Loja por R$ 89 e ERP Completo por R$ 109. Todos com 7 dias grátis para testar.'),
        ('Como funciona o teste de 7 dias?',
         'Você cria a conta e usa os recursos do plano por 7 dias, sem cadastrar cartão. No fim, escolhe um plano ou simplesmente não continua.'),
        ('E se a internet da loja cair?',
         'O SoftPay roda na nuvem, pelo navegador. Como ele abre em qualquer aparelho com os mesmos dados, dá para continuar pelo celular, com a internet do chip.'),
        ('Consigo passar meus produtos para o SoftPay?',
         'Sim, e sem cobrança para isso. A equipe ajuda pelo WhatsApp a colocar o cadastro no sistema.'),
        ('Meus dados ficam seguros?',
         'Os dados ficam num banco de dados na nuvem, com backup automático e acesso individual por usuário. Eles não dependem do computador da loja.'),
        ('Quantos usuários posso ter?',
         'Depende do plano: Comércio tem 1 usuário, Loja até 3 e ERP Completo até 10. Cada funcionário entra com o próprio acesso.'),
        ('Preciso de um computador potente?',
         'Não. O SoftPay roda no navegador: basta um computador, celular ou tablet com Chrome, Edge, Safari ou Firefox atualizado.'),
        ('A venda pelo WhatsApp está em qual plano?',
         'A partir do plano Loja, de R$ 89 por mês. Ela não substitui o painel: correção, configuração e análise continuam lá.'),
    ]},
    'contato': {
        'numeros': [('+100', 'lojistas usando o SoftPay todo dia'), ('8', 'estados com loja usando'), ('7 dias', 'para testar, sem cartão')],
    },
})
