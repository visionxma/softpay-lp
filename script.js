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
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ========== Mobile Menu Toggle ==========
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// ========== Close Mobile Menu on Link Click ==========
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
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
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});

// ========== Testimonials Carousel ==========
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const outer = track?.parentElement;
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const cards = Array.from(track?.querySelectorAll('.testimonial-card') || []);

    if (!track || cards.length === 0) return;

    let current = 0;
    const total = cards.length;

    function applyTransform(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    function goTo(index) {
        current = ((index % total) + total) % total;

        cards.forEach((card, i) => card.classList.toggle('carousel-active', i === current));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));

        applyTransform(current);
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 45) {
            diff > 0 ? goTo(current + 1) : goTo(current - 1);
        }
    }, { passive: true });

    // Init
    goTo(0);
}

// Run after fonts/images settle so offsetWidth is accurate
window.addEventListener('load', initTestimonialsCarousel);


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
