const projetosData = [
    {
        profundidade: -10,
        titulo: 'Em Breve',
        descricao: 'Em desenvolvimento',
        techs: ['...', '...', '...'],
        link: ''
    },
    {
        profundidade: -25,
        titulo: 'Em Breve',
        descricao: 'Em desenvolvimento',
        techs: ['...', '...', '...'],
        link: ''
    },
    {
        profundidade: -50,
        titulo: 'Em Breve',
        descricao: 'Em desenvolvimento',
        techs: ['...', '...', '...'],
        link: ''
    }
];

const secaoProjetos = document.querySelector('#projetos');
const containerProjetos = secaoProjetos?.querySelector('[data-projetos-container]');
const modalProjetos = document.querySelector('#projetos-modal');
const painelModalProjetos = modalProjetos?.querySelector('.projetos-modal__painel');
const botaoFecharModal = modalProjetos?.querySelector('.projetos-modal__fechar');
let cardComFoco = null;

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

function linkSeguro(link) {
    if (typeof link !== 'string' || !link.trim()) return false;

    try {
        const url = new URL(link, window.location.href);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function preencherModalProjeto(projeto) {
    if (!modalProjetos) return;

    modalProjetos.querySelector('.projetos-modal__profundidade').textContent = `${projeto.profundidade}m de profundidade`;
    modalProjetos.querySelector('#projetos-modal-titulo').textContent = projeto.titulo;
    modalProjetos.querySelector('.projetos-modal__descricao').textContent = projeto.descricaoDetalhada || projeto.descricao;

    const listaTechsModal = modalProjetos.querySelector('.projetos-modal__techs');
    listaTechsModal.replaceChildren(...projeto.techs.map((tech) => criarElemento('li', '', tech)));

    const linkModal = modalProjetos.querySelector('.projetos-modal__link');
    const semLinkModal = modalProjetos.querySelector('.projetos-modal__sem-link');
    const projetoTemLink = linkSeguro(projeto.link);
    linkModal.hidden = !projetoTemLink;
    semLinkModal.hidden = projetoTemLink;

    if (projetoTemLink) {
        linkModal.href = projeto.link;
    } else {
        linkModal.removeAttribute('href');
    }
}

function abrirModalProjeto(projeto, card) {
    if (!modalProjetos || !painelModalProjetos) return;

    cardComFoco = card;
    preencherModalProjeto(projeto);
    modalProjetos.hidden = false;
    document.body.classList.add('modal-is-open');
    botaoFecharModal?.focus();
}

function fecharModalProjeto() {
    if (!modalProjetos || modalProjetos.hidden) return;

    modalProjetos.hidden = true;
    document.body.classList.remove('modal-is-open');
    cardComFoco?.focus();
}

if (secaoProjetos && containerProjetos) {
    const listaProjetos = criarElemento('ol', 'projetos-lista');
    listaProjetos.setAttribute('aria-label', 'Projetos por profundidade');
    const profundidades = projetosData.map((projeto) => Number(projeto.profundidade)).filter(Number.isFinite);
    const profundidadeMinima = Math.min(...profundidades);
    const profundidadeMaxima = Math.max(...profundidades);

    projetosData.forEach((projeto, indice) => {
        const item = criarElemento('li', 'projeto-item');
        const profundidade = criarElemento('div', 'projeto-profundidade', `${projeto.profundidade}m`);
        profundidade.setAttribute('aria-label', `${projeto.profundidade} metros de profundidade`);

        const valorProfundidade = Number(projeto.profundidade);
        const nivelProfundidade = !Number.isFinite(valorProfundidade)
            || profundidadeMaxima === profundidadeMinima
            ? 0.5
            : (profundidadeMaxima - valorProfundidade) / (profundidadeMaxima - profundidadeMinima);
        if (Number.isFinite(valorProfundidade)) {
            profundidade.style.setProperty('--brilho-dia', (1 - nivelProfundidade * 0.55).toFixed(2));
            profundidade.style.setProperty('--brilho-noite', (0.45 + nivelProfundidade * 0.55).toFixed(2));
        }

        const card = criarElemento('article', 'projeto-card');
        if (Number.isFinite(valorProfundidade)) {
            card.style.setProperty('--card-lightness', `${Math.round(28 - nivelProfundidade * 13)}%`);
        }
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-label', `Ver detalhes de ${projeto.titulo}`);
        const indiceProjeto = criarElemento('p', 'projeto-card__indice', `PROJETO | ${String(indice + 1).padStart(2, '0')}`);
        const titulo = criarElemento('h3', '', projeto.titulo);
        const descricao = criarElemento('p', 'projeto-card__descricao', projeto.descricao);
        const rodape = criarElemento('div', 'projeto-card__rodape');
        const listaTechs = criarElemento('ul', 'projeto-techs');

        projeto.techs.forEach((tech) => {
            listaTechs.append(criarElemento('li', '', tech));
        });

        if (linkSeguro(projeto.link)) {
            const linkProjeto = criarElemento('a', 'projeto-link', 'Abrir projeto');
            linkProjeto.href = projeto.link;
            linkProjeto.target = '_blank';
            linkProjeto.rel = 'noopener noreferrer';
            linkProjeto.addEventListener('click', (evento) => evento.stopPropagation());
            rodape.append(listaTechs, linkProjeto);
        } else {
            const botaoEmBreve = criarElemento('button', 'projeto-link projeto-link--indisponivel', 'Em breve');
            botaoEmBreve.type = 'button';
            botaoEmBreve.title = 'O link deste projeto será adicionado em breve.';
            botaoEmBreve.addEventListener('click', (evento) => {
                evento.stopPropagation();
                botaoEmBreve.textContent = 'Projeto em breve';
            });
            rodape.append(listaTechs, botaoEmBreve);
        }

        card.append(indiceProjeto, titulo, descricao, rodape);
        card.addEventListener('click', () => abrirModalProjeto(projeto, card));
        card.addEventListener('keydown', (evento) => {
            if (evento.target !== card || (evento.key !== 'Enter' && evento.key !== ' ')) return;
            evento.preventDefault();
            abrirModalProjeto(projeto, card);
        });
        item.append(profundidade, card);
        listaProjetos.append(item);
    });

    if (projetosData.length === 0) {
        const vazio = criarElemento('li', 'projeto-card', 'Nenhum projeto cadastrado.');
        listaProjetos.append(vazio);
    }

    containerProjetos.append(listaProjetos);
}

botaoFecharModal?.addEventListener('click', fecharModalProjeto);

modalProjetos?.addEventListener('click', (evento) => {
    if (evento.target === modalProjetos) fecharModalProjeto();
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharModalProjeto();
});
