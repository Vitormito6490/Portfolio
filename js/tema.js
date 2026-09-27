const body = document.body;
const toggle = document.querySelector('.theme-toggle');
const toggleIcon = document.querySelector('.theme-toggle__icon');
const sol = document.querySelector('.sol');

function aplicarTema(isNight) {
    body.classList.toggle('theme-night', isNight);

    if (!toggleIcon || !toggle || !sol) return;

    if (isNight) {
        toggleIcon.textContent = '☀️';
        toggle.setAttribute('aria-label', 'Ativar modo dia');
        sol.src = 'imgs/lua.png';
        sol.alt = 'Lua';
    } else {
        toggleIcon.textContent = '🌙';
        toggle.setAttribute('aria-label', 'Ativar modo escuro');
        sol.src = 'imgs/sol.png';
        sol.alt = 'Sol';
    }
}

const temaSalvo = localStorage.getItem('theme-night');
if (temaSalvo === 'true') {
    aplicarTema(true);
}

if (toggle) {
    toggle.addEventListener('click', () => {
        const isNight = !body.classList.contains('theme-night');
        aplicarTema(isNight);
        localStorage.setItem('theme-night', String(isNight));
    });
}

const chavePosicaoScroll = `portfolio-scroll:${location.pathname}${location.search}${location.hash}`;
const navegacaoAtual = performance.getEntriesByType('navigation')[0];
const recarregando = navegacaoAtual?.type === 'reload';
let quadroScrollPendente = null;

function salvarPosicaoScroll() {
    sessionStorage.setItem(chavePosicaoScroll, String(window.scrollY));
}

window.addEventListener('scroll', () => {
    if (quadroScrollPendente !== null) cancelAnimationFrame(quadroScrollPendente);
    quadroScrollPendente = requestAnimationFrame(() => {
        salvarPosicaoScroll();
        quadroScrollPendente = null;
    });
}, { passive: true });

window.addEventListener('pagehide', salvarPosicaoScroll);

if (recarregando) {
    history.scrollRestoration = 'manual';
    const posicaoSalva = Number(sessionStorage.getItem(chavePosicaoScroll));

    if (Number.isFinite(posicaoSalva)) {
        const restaurarPosicao = () => window.scrollTo({ top: posicaoSalva, behavior: 'instant' });

        window.addEventListener('load', restaurarPosicao, { once: true });
        window.addEventListener('pageshow', restaurarPosicao, { once: true });
        document.fonts?.ready.then(restaurarPosicao);
    }
}

