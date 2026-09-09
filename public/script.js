/**
 * Sistema de Controle.App - Landing Page JavaScript
 * Interactive features and animations
 */

// ========== Atribuição de Afiliado (Plataforma de Parceiros) ==========
// Mesma regra do app (src/lib/partnerTracking.ts): lê ?ref= / utm_* e grava o
// cookie first-party `sp_partner_ref` por 30 dias, FIRST-TOUCH (nunca
// sobrescreve). ATENÇÃO: a LP (site.softpaybr.com) e o app (www.softpaybr.com)
// são subdomínios DIFERENTES, então este cookie first-party NÃO é lido pelo app.
// Nesse cenário quem carrega a atribuição é a propagação do `ref` na query dos
// links de cadastro, logo abaixo. [VALIDAR] Se a intenção for compartilhar o
// cookie entre os subdomínios, ele precisa ser gravado com `Domain=.softpaybr.com`
// — mudança de comportamento de comissionamento, não aplicada aqui.
// Tudo best-effort: nunca quebra a LP.
(function () {
    var COOKIE = 'sp_partner_ref';

    function sanitizeRef(raw) {
        if (!raw) return null;
        var clean = String(raw).trim().slice(0, 64).replace(/[^a-zA-Z0-9_.-]/g, '');
        return clean || null;
    }

    function readAttribution() {
        try {
            var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
            if (!m) return null;
            var parsed = JSON.parse(decodeURIComponent(m[1]));
            return (parsed && sanitizeRef(parsed.ref)) ? parsed : null;
        } catch (e) { return null; }
    }

    var attribution = readAttribution();
    try {
        var params = new URLSearchParams(window.location.search);
        var utm = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (k) {
            var v = params.get(k);
            if (v) utm[k] = v.trim().slice(0, 120);
        });
        // ref explícito vence; utm_campaign é o fallback (doc PARCEIROS-SAAS 03 §2.2)
        var ref = sanitizeRef(params.get('ref')) || sanitizeRef(utm.utm_campaign);
        // first-touch: se já existe cookie, a atribuição antiga vence
        if (ref && !attribution) {
            attribution = { ref: ref, utm: utm, at: new Date().toISOString() };
            var secure = location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(attribution)) +
                '; path=/; max-age=' + (30 * 86400) + '; SameSite=Lax' + secure;
        }
    } catch (e) { /* nunca quebrar a LP */ }

    // Visita: avisa o Hub que alguém ABRIU o link do afiliado, e não só quem
    // termina o cadastro — sem isto o funil do parceiro começa no cadastro e
    // quem desistiu antes fica invisível. Chave pública de propósito (a mesma
    // publishable key que o painel do Hub já expõe) e a RPC só insere clique,
    // com teto por IP no servidor. Usa a MESMA chave de sessão do app
    // (src/lib/partnerTracking.ts): LP e app nunca contam a chegada em dobro.
    try {
        if (ref) {
            var visitFlag = COOKIE + '_visit:' + ref;
            if (!sessionStorage.getItem(visitFlag)) {
                sessionStorage.setItem(visitFlag, '1');
                var q = new URLSearchParams(window.location.search);
                fetch('https://nsifcgtyjpzbavgbtnlq.supabase.co/rest/v1/rpc/track_click', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        apikey: 'sb_publishable_G3bC5V3GPGvmnf1lGFtJBg_OqnL6aDA',
                        Authorization: 'Bearer sb_publishable_G3bC5V3GPGvmnf1lGFtJBg_OqnL6aDA'
                    },
                    body: JSON.stringify({
                        p_ref: ref,
                        p_saas: 'softpay',
                        p_src: q.get('src') || q.get('utm_source') || null
                    }),
                    keepalive: true
                }).catch(function () { });
            }
        }
    } catch (e) { /* visita é best-effort — nunca quebra a LP */ }

    // Propaga o ref nos CTAs de cadastro (cookie continua sendo o principal)
    if (attribution && attribution.ref) {
        document.addEventListener('DOMContentLoaded', function () {
            var CTA_SELECTOR = 'a[href^="/auth"], a[href*="softpaybr.com/auth"]';
            document.querySelectorAll(CTA_SELECTOR).forEach(function (a) {
                try {
                    var raw = a.getAttribute('href');
                    var absolute = /^https?:\/\//i.test(raw);
                    var url = new URL(raw, location.origin);
                    if (!url.searchParams.get('ref')) {
                        url.searchParams.set('ref', attribution.ref);
                        // preserva a origem quando o CTA aponta para o app
                        a.setAttribute('href', absolute ? url.href : url.pathname + url.search);
                    }
                } catch (e) { /* mantém o href original */ }
            });
        });
    }
})();

// ========== DOM Elements ==========
const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// ========== Navbar Scroll Effect ==========
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (navbar) {
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    lastScroll = currentScroll;
});

// ========== Mobile Menu Toggle ==========
mobileMenuToggle?.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
    document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
});

// ========== Close Mobile Menu on Link Click ==========
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== Intersection Observer for Fade-in Animations ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.feature-card, .benefit-card, .showcase-item');
animateElements.forEach(el => observer.observe(el));

// ========== Active Navigation Link ==========
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ========== Parallax Effect for Hero Shapes ==========
const shapes = document.querySelectorAll('.shape');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// ========== Counter Animation for Numbers ==========
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
};

// ========== WhatsApp Button Click Tracking ==========
const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');

whatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
        console.log('WhatsApp button clicked');
        // Add analytics tracking here if needed
    });
});

// ========== Meta Pixel - CompleteRegistration (Trial Signup) ==========
const registrationTriggers = document.querySelectorAll('[data-track="complete-registration"]');

registrationTriggers.forEach(el => {
    el.addEventListener('click', () => {
        if (typeof fbq === 'function') {
            fbq('track', 'CompleteRegistration', {
                content_name: el.textContent.trim(),
                status: 'trial-7-days',
                source: el.href || 'sticky-cta'
            });
        }
    });
});

// ========== Meta Pixel - WhatsApp Support (Lead) ==========
const whatsappTriggers = document.querySelectorAll('[data-track="whatsapp-support"], .whatsapp-float');

whatsappTriggers.forEach(el => {
    el.addEventListener('click', () => {
        if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
                content_name: 'WhatsApp Support',
                content_category: 'Trial 7 Days'
            });
        }
    });
});

// ========== CTA Button Click Tracking ==========
const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        console.log('CTA button clicked:', button.textContent);
    });
});

// ========== Image Lazy Loading ==========
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ========== Form Validation (if forms are added) ==========
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ========== Local Storage for User Preferences ==========
const savePreference = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
};

const getPreference = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
};

// ========== Page Load Animation ==========
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Animate hero elements
    // A entrada do hero é feita em CSS (.hero-text > * { animation: heroIn }).
    // Antes era feita aqui, setando opacity:0 em conteúdo JÁ VISÍVEL para
    // depois trazer de volta: isso fazia o hero piscar no load e, se algo
    // interrompesse entre os dois setTimeout, ele sumia de vez.
});

// Os depoimentos passaram a ser exibidos lado a lado, sem carrossel.
// ========== Console Message ==========
console.log('%c🚀 SoftPay', 'font-size: 20px; font-weight: bold; color: #1DA1F2;');
console.log('%cDesenvolvido por VisionX Soluções Tecnológicas', 'font-size: 12px; color: #666;');
console.log('%chttps://visionxma.com', 'font-size: 12px; color: #1DA1F2;');

// ========== Prevent Right Click on Images (Optional) ==========
// Uncomment if you want to protect images
/*
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
});
*/

// ========== Easter Egg - Konami Code ==========
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiSequence.join('')) {
        console.log('🎮 Konami Code activated! You found the easter egg!');
        document.body.style.animation = 'rainbow 2s linear infinite';
    }
});

// ========== Performance Monitoring ==========
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.fetchStart, 'ms');
            }
        }
    });

    perfObserver.observe({ entryTypes: ['navigation'] });
}

// ========== Export functions for external use ==========
window.ControleApp = {
    savePreference,
    getPreference,
    validateEmail,
    animateCounter
};

// ========== Abas ==========
// Padrão ARIA de tablist: clique, setas, Home e End.
// Cobre tanto a lista em pílula quanto a versão em tipografia display.
// Sem JS, o primeiro painel continua visível e os outros ficam com [hidden]:
// a página não quebra, só perde a troca.
document.querySelectorAll('.tablist, .display-tablist').forEach(function (lista) {
    var abas = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
    if (!abas.length) return;

    function seleciona(indice, moverFoco) {
        abas.forEach(function (aba, i) {
            var ativa = i === indice;
            aba.setAttribute('aria-selected', ativa ? 'true' : 'false');
            aba.tabIndex = ativa ? 0 : -1;
            var painel = document.getElementById(aba.getAttribute('aria-controls'));
            if (painel) {
                painel.hidden = !ativa;
                if (ativa) {
                    painel.classList.remove('is-entering');
                    void painel.offsetWidth;          // reinicia a animação
                    painel.classList.add('is-entering');
                }
            }
        });
        if (moverFoco) abas[indice].focus();
    }

    abas.forEach(function (aba, i) {
        aba.addEventListener('click', function () {
            // Quando o modo de rolagem está ativo, quem manda na aba é o
            // scroll: trocar aqui também faria a aba piscar antes de o
            // scroll reposicionar.
            if (document.documentElement.classList.contains('js-tabs-scroll')
                && lista.closest('[data-tabs-scroll]')) return;
            seleciona(i, false);
        });
    });

    lista.addEventListener('keydown', function (e) {
        var atual = abas.indexOf(document.activeElement);
        if (atual === -1) return;
        var destino = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = (atual + 1) % abas.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') destino = (atual - 1 + abas.length) % abas.length;
        else if (e.key === 'Home') destino = 0;
        else if (e.key === 'End') destino = abas.length - 1;
        if (destino !== null) {
            e.preventDefault();
            seleciona(destino, true);
            if (document.documentElement.classList.contains('js-tabs-scroll')) {
                abas[destino].click();     // leva a rolagem até o trecho da aba
            }
        }
    });
});

// ========== Abas que avançam com o scroll ==========
// A seção de funcionalidades fica fixa enquanto a página rola, e a aba ativa
// muda conforme o progresso. Só liga quando faz sentido: precisa de tela
// larga, de suporte a position:sticky e de o visitante não ter pedido menos
// movimento. Em qualquer outro caso a seção segue no tamanho natural, com as
// abas funcionando por clique — o conteúdo nunca depende deste efeito.
(function () {
    var trilho = document.querySelector('[data-tabs-scroll]');
    if (!trilho) return;

    var lista = trilho.querySelector('.display-tablist');
    var abas = lista ? Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]')) : [];
    if (abas.length < 2) return;

    var querMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
    var telaLarga = window.matchMedia('(min-width: 901px)');
    var suportaSticky = CSS.supports && CSS.supports('position', 'sticky');

    function podeLigar() {
        return suportaSticky && telaLarga.matches && !querMenosMovimento.matches;
    }

    document.documentElement.style.setProperty('--tabs-count', abas.length);

    // barra de progresso ao lado das abas
    var progresso = document.createElement('span');
    progresso.className = 'tabs-progress';
    progresso.setAttribute('aria-hidden', 'true');

    var ativo = -1;
    function ativar(indice) {
        if (indice === ativo) return;
        ativo = indice;
        abas.forEach(function (aba, i) {
            var eh = i === indice;
            aba.setAttribute('aria-selected', eh ? 'true' : 'false');
            aba.tabIndex = eh ? 0 : -1;
            var painel = document.getElementById(aba.getAttribute('aria-controls'));
            if (painel) {
                painel.hidden = !eh;
                if (eh) {
                    painel.classList.remove('is-entering');
                    void painel.offsetWidth;
                    painel.classList.add('is-entering');
                }
            }
        });
        var alvo = abas[indice];
        if (alvo && progresso.parentNode) {
            progresso.style.height = alvo.offsetHeight + 'px';
            progresso.style.transform = 'translateY(' + alvo.offsetTop + 'px)';
        }
    }

    var pendente = false;
    function aoRolar() {
        if (pendente) return;
        pendente = true;
        window.requestAnimationFrame(function () {
            pendente = false;
            if (!podeLigar()) return;
            var caixa = trilho.getBoundingClientRect();
            var percorrivel = caixa.height - window.innerHeight;
            if (percorrivel <= 0) return;
            var avanco = Math.min(Math.max(-caixa.top / percorrivel, 0), 0.999);
            ativar(Math.floor(avanco * abas.length));
        });
    }

    // clique continua funcionando: leva a rolagem até o trecho da aba
    abas.forEach(function (aba, i) {
        aba.addEventListener('click', function (e) {
            if (!podeLigar()) return;              // fora do modo fixo, o clique já é tratado
            e.preventDefault();
            var caixa = trilho.getBoundingClientRect();
            var topo = caixa.top + window.pageYOffset;
            var percorrivel = caixa.height - window.innerHeight;
            var destino = topo + (percorrivel * (i + 0.35) / abas.length);
            window.scrollTo({ top: destino, behavior: 'smooth' });
        });
    });

    function aplicarModo() {
        if (podeLigar()) {
            document.documentElement.classList.add('js-tabs-scroll');
            if (!progresso.parentNode) lista.appendChild(progresso);
            ativo = -1;
            aoRolar();
        } else {
            document.documentElement.classList.remove('js-tabs-scroll');
            if (progresso.parentNode) progresso.parentNode.removeChild(progresso);
        }
    }

    aplicarModo();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aplicarModo);
    if (querMenosMovimento.addEventListener) {
        querMenosMovimento.addEventListener('change', aplicarModo);
        telaLarga.addEventListener('change', aplicarModo);
    }
})();

/* ---------------------------------------------------------------------------
   FAQ — a copy da esquerda entra alinhada ao topo da seção e vai para o meio
   da janela conforme a página rola.

   Por que isso não sai só com CSS: `position: sticky` tem UM ponto de parada,
   e aqui são dois comportamentos. Três abordagens em CSS puro foram medidas e
   descartadas (o motivo de cada uma está no comentário do style.css); todas
   falhavam no mesmo ponto — a copy já nascia no meio, em vez de começar junto
   da primeira pergunta.

   O que o script faz: enquanto a seção rola, aumenta o deslocamento de 0 até o
   valor que centraliza o texto na janela, proporcionalmente ao quanto já se
   rolou. O CSS aplica esse número no `top`. Sem JavaScript, o valor fica em 0
   e a copy se comporta como sticky comum, alinhada ao topo — nada quebra.
   --------------------------------------------------------------------------- */
(function () {
    const aside = document.querySelector('.faq--split .faq-aside');
    const secao = document.querySelector('#faq');
    if (!aside || !secao) return;

    const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
    let alvo = 0;          // deslocamento final, em px
    let pendente = false;

    function medir() {
        const navH = parseFloat(getComputedStyle(document.documentElement)
                        .getPropertyValue('--nav-h')) || 90;
        const respiro = 24; // o --spacing-md que o CSS já soma no top
        const livre = window.innerHeight - navH;
        // quanto seria preciso descer para o texto ficar no meio da janela
        alvo = Math.max(0, (livre - aside.offsetHeight) / 2 - respiro);
    }

    function atualizar() {
        pendente = false;

        // desliga em coluna única, tela baixa ou quando o usuário pediu menos
        // movimento: nesses casos o CSS já resolve, alinhado ao topo.
        //
        // Também desliga a partir de 1100px, onde a lista passou a ter DUAS
        // colunas: com a lista pela metade da altura, centralizar a copy abria
        // um vazio de ~400px no topo da coluna esquerda enquanto as perguntas
        // já tinham começado. Medido em 1440px na captura da seção.
        if (window.innerWidth <= 860 || window.innerWidth >= 1100 ||
            window.innerHeight <= 620 || menosMovimento.matches) {
            aside.style.setProperty('--faq-offset', '0px');
            return;
        }

        const r = secao.getBoundingClientRect();
        // 0 quando a seção encosta no topo; 1 depois de rolar uma janela inteira
        const avanco = Math.min(1, Math.max(0, -r.top / window.innerHeight));
        aside.style.setProperty('--faq-offset', (alvo * avanco).toFixed(1) + 'px');
    }

    function aoRolar() {
        if (pendente) return;
        pendente = true;
        requestAnimationFrame(atualizar);
    }

    medir();
    atualizar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', function () { medir(); aoRolar(); });
    if (menosMovimento.addEventListener) menosMovimento.addEventListener('change', atualizar);
})();

/* ---------------------------------------------------------------------------
   REVELAÇÃO AO ROLAR
   Estrutura copiada do site.froxbr.com (js/main.js), que já está validado no
   ar, com as mesmas quatro proteções:

     1. A classe `.js` é posta aqui, e só ela ativa o estado escondido no CSS.
        Sem JavaScript nada some — esconder por animação sem essa trava é a
        forma mais comum de deixar página em branco para o visitante.
     2. Sem IntersectionObserver, tudo aparece de uma vez.
     3. `intersectionRatio === 0` junto com `isIntersecting`: em rolagem muito
        rápida o observador pode reportar o elemento já ultrapassado.
     4. Rede de segurança no scroll: se por qualquer motivo um elemento acima
        da dobra continuar oculto, ele é revelado assim que entra na faixa.

   Marcação automática: em vez de editar 77 páginas à mão, os alvos são
   escolhidos por seletor. Só entra bloco de conteúdo — nada de hero (que
   precisa aparecer instantaneamente) nem de elemento fixo.
   --------------------------------------------------------------------------- */
(function () {
    var raiz = document.documentElement;
    var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sem a classe .js o CSS não esconde nada. Quem pediu menos movimento
    // também não recebe o estado escondido.
    if (menosMovimento) return;
    raiz.classList.add('js');

    // No celular a marcação é outra (ver REVELAÇÃO NO CELULAR, no fim do
    // arquivo): cada bloco recebe uma variação própria. Aqui só o desktop.
    if (window.matchMedia('(max-width: 767.98px)').matches) return;

    var SELETORES = [
        '.section-header',
        '.pricing-card',
        '.segment-card',
        '.testimonial-card, .depo-card',
        '.split-content',
        '.stat-card',
        '.page-section > h2',
        '.faq-item',
        '.footer-column'
    ].join(',');

    var itens = [].slice.call(document.querySelectorAll(SELETORES))
        .filter(function (el) {
            // fora: o que está na primeira tela (precisa nascer visível) e o
            // que já tem marcação própria
            if (el.closest('#hero, .navbar, .whatsapp-float')) return false;
            if (el.hasAttribute('data-reveal')) return false;
            return el.getBoundingClientRect().top > window.innerHeight * 0.9;
        });

    itens.forEach(function (el) { el.setAttribute('data-reveal', ''); });

    function mostrar(el) {
        if (el.classList.contains('is-visible')) return;
        el.classList.add('is-visible');
        el.addEventListener('transitionend', function fim() {
            el.classList.add('reveal-done');
            el.removeEventListener('transitionend', fim);
        });
    }

    if (!('IntersectionObserver' in window)) {
        itens.forEach(mostrar);
        return;
    }

    var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
            if (!e.isIntersecting && e.intersectionRatio === 0) return;
            mostrar(e.target);
            io.unobserve(e.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

    itens.forEach(function (el) { io.observe(el); });

    // Rede de segurança
    var varrendo = false;
    function varrer() {
        varrendo = false;
        var limite = window.innerHeight + 200;
        itens.forEach(function (el) {
            if (el.classList.contains('is-visible')) return;
            if (el.getBoundingClientRect().top < limite) { mostrar(el); io.unobserve(el); }
        });
    }
    window.addEventListener('scroll', function () {
        if (!varrendo) { varrendo = true; requestAnimationFrame(varrer); }
    }, { passive: true });
})();

/* ---------------------------------------------------------------------------
   PONTOS INDICADORES DO CARROSSEL
   O CSS veio do safirion.com.br (classe .kvc-dots): bolinha de 7px que vira
   barra de 22px quando ativa. O HTML dele é gerado por script, então a lógica
   abaixo é a implementação equivalente.

   Os pontos são criados só quando o elemento REALMENTE rola na horizontal —
   assim, se a tela for larga e a grade voltar a ser grade, eles somem.
   --------------------------------------------------------------------------- */
(function () {
    var GRADES = '.seg-grid, .card-grid, .stats-grid';
    var mq = window.matchMedia('(max-width: 640px)');

    function montar(grade) {
        if (grade.nextElementSibling && grade.nextElementSibling.classList.contains('cm-dots')) {
            return grade.nextElementSibling;
        }
        var dots = document.createElement('div');
        dots.className = 'cm-dots';
        dots.setAttribute('aria-hidden', 'true'); // decorativo: a rolagem já é acessível
        for (var i = 0; i < grade.children.length; i++) {
            dots.appendChild(document.createElement('span'));
        }
        grade.parentNode.insertBefore(dots, grade.nextSibling);
        return dots;
    }

    function ligar(grade) {
        // só faz sentido se houver rolagem horizontal de verdade
        if (grade.scrollWidth <= grade.clientWidth + 10) return;

        var dots = montar(grade);
        var spans = dots.children;

        function marcar() {
            var meio = grade.scrollLeft + grade.clientWidth / 2;
            var atual = 0, menor = Infinity;
            for (var i = 0; i < grade.children.length; i++) {
                var c = grade.children[i];
                var centro = c.offsetLeft + c.offsetWidth / 2;
                var d = Math.abs(centro - meio);
                if (d < menor) { menor = d; atual = i; }
            }
            for (var j = 0; j < spans.length; j++) {
                spans[j].classList.toggle('on', j === atual);
            }
        }

        var pendente = false;
        grade.addEventListener('scroll', function () {
            if (pendente) return;
            pendente = true;
            requestAnimationFrame(function () { pendente = false; marcar(); });
        }, { passive: true });

        marcar();
    }

    function aplicar() {
        var grades = document.querySelectorAll(GRADES);
        for (var i = 0; i < grades.length; i++) {
            if (mq.matches) ligar(grades[i]);
            else {
                var d = grades[i].nextElementSibling;
                if (d && d.classList.contains('cm-dots')) d.remove();
            }
        }
    }

    aplicar();
    if (mq.addEventListener) mq.addEventListener('change', aplicar);
    window.addEventListener('resize', function () {
        clearTimeout(window.__cmDotsT);
        window.__cmDotsT = setTimeout(aplicar, 200);
    });
})();


/* ===========================================================================
   CELULAR — controles da reconstrução mobile (2026-09-09)
   Tudo aqui é progressivo: sem JavaScript, planos, FAQ e rodapé aparecem
   inteiros (o CSS só esconde quando o <html> tem a classe .has-js).
   =========================================================================== */
document.documentElement.classList.add('has-js');

(function () {
    var celular = window.matchMedia('(max-width: 767.98px)');

    /* --- Planos: "Ver o que inclui" abre a lista de recursos do cartão ---- */
    document.querySelectorAll('.price-toggle').forEach(function (btn) {
        var card = btn.closest('.price-card');
        var rotulo = btn.querySelector('.price-toggle-label');
        if (!card) return;
        btn.addEventListener('click', function () {
            var aberto = card.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
            if (rotulo) rotulo.textContent = aberto ? 'Ocultar detalhes' : 'Ver o que inclui';
        });
    });

    /* --- FAQ: quatro perguntas à vista; "Ver mais" revela o resto -------- */
    (function () {
        var lista = document.querySelector('.faq-list[data-faq-collapsible]');
        var btn = document.querySelector('.faq-more');
        if (!lista || !btn) return;
        var rotulo = btn.querySelector('.faq-more-label');

        btn.addEventListener('click', function () {
            var aberto = lista.classList.toggle('is-expanded');
            btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
            if (rotulo) rotulo.textContent = aberto ? 'Ver menos' : 'Ver mais perguntas';
            if (!aberto) {
                // ao recolher, a página encolhe de repente: a lista volta para
                // a vista, em vez de deixar o leitor no meio de outra seção
                var navH = parseFloat(getComputedStyle(document.documentElement)
                              .getPropertyValue('--nav-h')) || 60;
                var topo = lista.getBoundingClientRect().top + window.pageYOffset - navH - 12;
                if (lista.getBoundingClientRect().top < 0) {
                    window.scrollTo({ top: topo, behavior: 'auto' });
                }
                btn.focus({ preventScroll: true });
            }
        });
    })();

    /* --- Rodapé: cada grupo de links vira acordeão, só no celular --------
       O título <h3> recebe um <button> por dentro enquanto a tela é
       estreita; ao voltar ao desktop, o texto puro é restaurado. Assim o
       DOM do desktop fica exatamente como era. */
    var colunas = [].slice.call(document.querySelectorAll('.footer .footer-column'));

    function montarRodape() {
        colunas.forEach(function (col, i) {
            var titulo = col.querySelector('.footer-heading:not(.footer-heading--sub)');
            var lista = col.querySelector(':scope > ul');
            if (!titulo || !lista || titulo.querySelector('.footer-toggle')) return;
            if (!lista.id) lista.id = 'footer-lista-' + (i + 1);
            var texto = titulo.textContent;
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'footer-toggle';
            btn.textContent = texto;
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-controls', lista.id);
            titulo.textContent = '';
            titulo.appendChild(btn);
            btn.addEventListener('click', function () {
                var aberto = col.classList.toggle('is-open');
                btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
            });
        });
    }

    function desmontarRodape() {
        colunas.forEach(function (col) {
            var btn = col.querySelector('.footer-toggle');
            if (!btn) return;
            var titulo = btn.parentNode;
            titulo.textContent = btn.textContent;
            col.classList.remove('is-open');
        });
    }

    function aplicarRodape() {
        if (celular.matches) montarRodape(); else desmontarRodape();
    }

    aplicarRodape();
    if (celular.addEventListener) celular.addEventListener('change', aplicarRodape);
})();

/* ---------------------------------------------------------------------------
   REVELAÇÃO NO CELULAR
   Mesmas proteções da revelação de desktop (acima): só esconde com a classe
   .js, sem IntersectionObserver mostra tudo, e uma rede de segurança no
   scroll. A diferença é a marcação: no celular cada bloco recebe uma
   variação (máscara, blur, lateral, profundidade, escalonamento) para a
   página ter continuidade sem repetir o mesmo movimento em tudo.
   --------------------------------------------------------------------------- */
(function () {
    var raiz = document.documentElement;
    if (!window.matchMedia('(max-width: 767.98px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    raiz.classList.add('js');

    // [seletor, tipo, variação]. "stagger" escalona os filhos diretos.
    var MAPA = [
        ['.section-header',                       'stagger', ''],
        ['.stats-bar .stats-grid',                'stagger', 'blur'],
        ['#recursos .container:last-child',       'reveal',  ''],
        ['#pricing .price-grid',                  'stagger', ''],
        ['#pricing .plans-trust-line',            'reveal',  ''],
        ['#pricing .plans-support-note',          'reveal',  ''],
        ['#segmentos .seg-grid',                  'stagger', 'zoom'],
        ['#segmentos .seg-feature',               'reveal',  'zoom'],
        ['#numeros .insight-card',                'reveal',  ''],
        ['#numeros .calc--flow',                  'stagger', 'left'],
        ['.split .section-label',                 'reveal',  ''],
        ['.split .split-title',                   'reveal',  'mask'],
        ['.split .split-text',                    'reveal',  ''],
        ['.split .split-list',                    'stagger', 'left'],
        ['.split .split-note',                    'reveal',  ''],
        ['.split .split-content > .btn',          'reveal',  ''],
        ['.split .split-more',                    'reveal',  ''],
        ['.split .split-visual',                  'reveal',  'zoom'],
        ['#decisao .decision-steps',              'stagger', 'left'],
        ['#cobertura .coverage-content',          'stagger', ''],
        ['#cobertura .map-wrap',                  'reveal',  'depth'],
        ['#testimonials .depo-grid',              'stagger', 'zoom'],
        ['#features .display-tabs',               'reveal',  ''],
        ['#features .faq-footer',                 'reveal',  ''],
        ['#showcase .showcase-content',           'stagger', ''],
        ['#showcase .showcase-image',             'reveal',  'depth'],
        ['.trust .trust-grid',                    'stagger', 'left'],
        ['#suporte .support-inner',               'stagger', ''],
        ['#benefits .plan-duo',                   'stagger', ''],
        ['#benefits .faq-footer',                 'reveal',  ''],
        ['#faq .faq-aside',                       'stagger', ''],
        ['#faq .faq-list',                        'stagger', ''],
        ['#faq .faq-more-wrap',                   'reveal',  ''],
        ['#faq .faq-footer',                      'reveal',  ''],
        ['#conteudo-seo .card-grid',              'stagger', 'zoom'],
        ['#conteudo-seo .faq-footer',             'reveal',  ''],
        ['#cta .cta-content',                     'stagger', ''],
        ['.footer .footer-brand',                 'reveal',  ''],
        ['.footer .footer-quick',                 'stagger', ''],
        ['.footer .footer-links',                 'reveal',  '']
    ];

    var itens = [];
    MAPA.forEach(function (regra) {
        [].forEach.call(document.querySelectorAll(regra[0]), function (el) {
            if (el.closest('#hero, .navbar, .whatsapp-float, .mobile-sticky-cta')) return;
            if (el.hasAttribute('data-reveal') || el.hasAttribute('data-reveal-stagger')) return;
            // o que já está na primeira tela nasce visível
            if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return;
            el.setAttribute(regra[1] === 'stagger' ? 'data-reveal-stagger' : 'data-reveal', regra[2]);
            itens.push(el);
        });
    });

    function mostrar(el) {
        if (el.classList.contains('is-visible')) return;
        el.classList.add('is-visible');
    }

    if (!('IntersectionObserver' in window)) {
        itens.forEach(mostrar);
        return;
    }

    var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
            if (!e.isIntersecting && e.intersectionRatio === 0) return;
            mostrar(e.target);
            io.unobserve(e.target);
        });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });

    itens.forEach(function (el) { io.observe(el); });

    var varrendo = false;
    function varrer() {
        varrendo = false;
        var limite = window.innerHeight + 160;
        itens.forEach(function (el) {
            if (el.classList.contains('is-visible')) return;
            if (el.getBoundingClientRect().top < limite) { mostrar(el); io.unobserve(el); }
        });
    }
    window.addEventListener('scroll', function () {
        if (!varrendo) { varrendo = true; requestAnimationFrame(varrer); }
    }, { passive: true });
})();
