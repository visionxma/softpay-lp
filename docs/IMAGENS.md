# Imagens do site — especificação e prompts

## Por que não usar imagem do Google

Imagem encontrada em busca **não tem licença para uso comercial**. Num site
de empresa isso é risco jurídico real — o dono do direito pode cobrar uso
indevido, e já existe indústria de cobrança em cima disso.

Os dois caminhos limpos:

1. **Foto real do produto e dos clientes.** É o melhor para SEO e conversão
   (§32 e §35 do briefing pedem exatamente isso) e não tem custo de licença.
2. **Geração por IA**, com os prompts abaixo. Confira as regras da ferramenta
   que você usar: algumas restringem uso comercial no plano gratuito.

Se preferir banco de imagens, use **Unsplash** ou **Pexels**, que têm licença
para uso comercial — mas confira a licença de cada foto, não a do site.

---

## Especificação técnica

| | |
|---|---|
| Proporção | **2,4:1** (formato de cápsula) |
| Resolução | 1600 × 660 px |
| Formato final | `.webp`, qualidade 80 |
| Peso alvo | até 90 KB por imagem |
| Pasta | `public/assets/lojistas/` |
| Nomes | `mercadinho.webp`, `roupas.webp`, `papelaria.webp`… |

Como as fotos aparecem recortadas em cápsula, **o assunto precisa estar
centralizado na vertical** — o topo e a base são cortados.

---

## Prompts

Base comum a todos — cole junto de cada prompt:

> Fotografia documental realista, luz natural suave de janela, profundidade de
> campo rasa, cores quentes e naturais, sem filtro pesado, sem texto na imagem,
> sem logotipo de marca, enquadramento horizontal 2,4:1, pessoa real trabalhando
> com naturalidade, expressão concentrada ou sorriso discreto — não posado de
> banco de imagens. Brasil, comércio de bairro.

### 1. Mercadinho
> Dono de mercadinho de bairro brasileiro, homem pardo de 40 anos, camiseta
> polo simples, atrás do balcão operando um computador ao lado da máquina de
> cartão. Prateleiras com produtos de mercearia ao fundo, levemente desfocadas.

### 2. Loja de roupas
> Lojista mulher negra de 30 anos numa loja de roupas pequena, organizando
> peças numa arara, tablet na mão. Araras com roupas coloridas ao fundo,
> desfocadas. Ambiente iluminado e organizado.

### 3. Papelaria
> Balconista de papelaria, mulher branca de 25 anos, atendendo cliente no
> caixa, com prateleiras de material escolar coloridas ao fundo. Movimento de
> volta às aulas.

### 4. Distribuidora de bebidas
> Homem negro de 35 anos, camisa de uniforme, conferindo estoque em um depósito
> de bebidas com engradados empilhados, prancheta ou celular na mão.

### 5. Farmácia
> Atendente de farmácia, mulher parda de 30 anos, jaleco branco, no balcão
> com computador, prateleiras de produtos de higiene ao fundo.

### 6. Loja de variedades
> Dona de loja de variedades, mulher de 50 anos, cabelo grisalho, organizando
> produtos de utilidade doméstica numa prateleira. Muitos itens coloridos,
> ambiente pequeno e cheio.

### 7. Casal de comerciantes
> Casal de comerciantes brasileiros de 40 anos atrás do balcão de uma loja
> pequena, conversando enquanto olham a tela de um computador. Clima de
> parceria e trabalho.

### 8. Celular no balcão
> Close nas mãos de um comerciante segurando um celular sobre o balcão de uma
> loja, com o caixa e produtos desfocados ao fundo. Sem mostrar o rosto.

### 9. Loja de autopeças — **faltando**
> Balconista de loja de autopeças, homem pardo de 45 anos, camisa de uniforme
> simples, atrás do balcão conferindo uma peça na mão. Prateleiras metálicas
> com caixas de peças e filtros ao fundo, levemente desfocadas.

### 10. Materiais de construção — **faltando**
> Dono de depósito de materiais de construção, homem branco de 50 anos,
> conferindo o estoque com uma prancheta. Sacos de cimento empilhados e
> vergalhões ao fundo, área coberta, luz natural entrando pela lateral.

### 11. Loja de joias — **faltando**
> Vendedora de joalheria de rua, mulher negra de 35 anos, apresentando uma
> peça sobre uma bandeja de veludo na vitrine do balcão. Iluminação quente e
> discreta, vitrine desfocada ao fundo. Sem marca visível.

### 12. Empresa com filiais — **faltando**
> Dona de uma rede pequena de lojas, mulher parda de 40 anos, de pé no meio
> da loja com um tablet, olhando para o salão. Ambiente de varejo organizado,
> uma segunda pessoa atendendo ao fundo, desfocada.

### 13 a 16. Pet shop, calçados, cosméticos e bebidas — **faltando**

Os quatro segmentos criados em 2026-09-08 também nasceram sem foto.

> **Oito páginas estão no ar sem imagem de abertura** (9 a 16). Enquanto não
> existirem, elas ficam sem `figura` — é melhor não ter foto do que ter uma que
> o `alt` precisa mentir para descrever. Não reaproveite `distribuidora.webp`:
> ela mostra engradados de bebida e só serve à distribuidora.
>
> **Os prompts prontos das oito estão em
> [`PROMPTS-FOTOS-SEGMENTOS.md`](PROMPTS-FOTOS-SEGMENTOS.md)**, com o padrão de
> estilo extraído das fotos já publicadas, negative prompt e o `alt` de cada
> uma.

---

## Diversidade

A referência (Stone) usa gente de idades, tons de pele e regiões diferentes —
e é isso que faz o site parecer o Brasil real. Mantenha essa variedade: os
prompts acima já alternam de propósito.

---

## Como trocar depois de gerar

1. Salve as imagens em `public/assets/lojistas/`
2. Converta e otimize:
   ```bash
   cwebp -q 80 -resize 1600 0 foto.jpg -o public/assets/lojistas/mercadinho.webp
   ```
3. Na esteira do `public/index.html`, troque o `src` das cápsulas de foto:
   ```html
   <span class="capsule-photo">
       <img src="assets/lojistas/mercadinho.webp"
            alt="Dono de mercadinho usando o SoftPay no balcão"
            loading="lazy" decoding="async" />
   </span>
   ```
4. **Escreva um `alt` descritivo em cada uma** — é exigência de acessibilidade
   e conta para SEO (§35 do briefing).
5. Rode `python3 tools/fingerprint.py` e publique.

## O que mais ganharia com foto real

- **Depoimentos**: hoje só há dois clientes com foto. Cada novo depoimento
  verdadeiro vale mais que qualquer imagem gerada (§32).
- **Páginas de segmento**: faltam as fotos 9 a 12 acima. As páginas de
  autopeças, materiais de construção, joias e empresas com filiais estão no ar
  sem imagem de abertura à espera delas.
- **Screenshots do produto**: o briefing pede telas reais do SoftPay (§35).
  Essas não dá para gerar — precisam vir do sistema.
