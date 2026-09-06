# Guia de Copy — SoftPay

Como escrever qualquer texto novo do site sem quebrar o que já foi construído.

## Posicionamento

> **O sistema de gestão que entende o seu negócio.**

E a mensagem que sustenta a diferenciação:

> **Seu sistema mostra os números. O SoftPay ajuda você a entendê-los.**

Tudo que for escrito deve caber embaixo dessas duas frases. Se um texto novo
poderia estar no site de qualquer ERP, ele ainda não está pronto.

## Quem lê

Dono de loja pequena, 1–2 funcionários, faturamento acima de R$ 10 mil/mês.
Saiu do caderno ou está saindo. Não é técnico e não tem paciência para jargão.
Está avaliando com o celular na mão, entre um cliente e outro.

Escreva para essa pessoa — não para o investidor, não para o concorrente.

## Regras inegociáveis

1. **Nunca invente.** Funcionalidade, cliente, depoimento, integração, métrica,
   volume de busca ou resultado. Se não dá para confirmar no produto, escreva
   "confirme com o suporte" ou marque `[VALIDAR]`.
2. **Nunca prometa segurança absoluta.** Nada de "100% seguro" ou "impossível
   perder dados". Descreva o que existe: nuvem, Supabase, backup automático,
   acesso por usuário.
3. **Nunca prometa aumento de lucro.** O SoftPay organiza dados. Quem decide
   é o lojista.
4. **Todo número de exemplo é marcado como exemplo.** Use o badge
   "Exemplo ilustrativo" e diga que os valores são fictícios.
5. **Preço sempre em HTML**, nunca só em imagem.
6. **Assunto fiscal manda consultar o contador.** Sempre. Sem exceção.
7. **Não difame concorrente.** Compare por critério objetivo ou não compare.

## Tom

| Faça | Não faça |
|---|---|
| "Quanto dinheiro está parado no seu estoque?" | "Solução completa de gestão de inventário" |
| "O caderno não te dá um total" | "Metodologias arcaicas de controle manual" |
| "Confirme com o suporte antes de contratar" | "Atende a todas as necessidades" |
| "Vender bem e não ter dinheiro quase nunca é problema de venda" | "Maximize sua performance de vendas" |

Frases curtas. Voz ativa. Segunda pessoa ("você"). Zero jargão corporativo.
Quando um termo técnico for necessário — CMV, curva ABC, markup — explique na
primeira aparição.

## Reconhecer o lado do leitor

O que mais diferencia o texto deste site: ele admite quando o outro lado tem
razão. A página `/perguntas/caderno-ou-sistema/` lista as vantagens reais do
caderno antes de mostrar onde ele falha. A de farmácia diz em destaque que o
SoftPay não cobre SNGPC.

Isso não enfraquece a venda — é o que faz o resto do texto ser acreditável.

## Estrutura de página

**Página de pergunta:** resposta direta em destaque no topo, depois o
aprofundamento. Quem só quer a resposta acha em 3 segundos.

**Página de guia:** resposta curta no intro, método em passos, exemplo com
números fictícios, erros comuns, fontes.

**Página de solução:** problema → como o SoftPay resolve → em qual plano → FAQ.

**Página de segmento:** a realidade daquele comércio → o que muda → uma
particularidade só daquele segmento → FAQ. Nunca "find and replace" de outro
segmento.

## Recursos por plano — decore isto

| Plano | Preço | Usuários |
|---|---|---|
| Nota Fiscal | R$ 65/mês | até 2 — só emissão, sem PDV/estoque |
| Comércio | R$ 69/mês | 1 — PDV, caixa, fiado, estoque essencial |
| Loja | R$ 89/mês | até 3 — + cobrança Pix, loja online, estoque avançado |
| ERP Completo | R$ 109/mês | até 10 — + NFC-e e NF-e |

Sempre que citar um recurso, diga em qual plano ele está. Emissão fiscal é
descrita como **"em ativação"** — não transforme isso em promessa.

## Checklist antes de publicar

- [ ] Cabe embaixo do posicionamento?
- [ ] Todo recurso citado existe e está no plano certo?
- [ ] Números de exemplo estão marcados como fictícios?
- [ ] Assunto fiscal manda consultar o contador?
- [ ] Tem `title`, `meta description` e `H1` únicos?
- [ ] Tem pelo menos 3 links internos contextuais?
- [ ] Se tem FAQ, o schema bate com o texto visível?
- [ ] Um lojista entenderia lendo no celular, sem dicionário?
