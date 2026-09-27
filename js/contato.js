// Use o ID do formulário criado no Formspree. Exemplo: https://formspree.io/f/seu_id
const FORM_ENDPOINT = 'https://formspree.io/f/moevkboz';

const formularioContato = document.querySelector('#contact-form');

if (formularioContato) {
    const botaoEnviar = formularioContato.querySelector('[type="submit"]');
    const mensagemStatus = formularioContato.querySelector('#contact-status');
    const textoOriginalBotao = botaoEnviar.textContent;

    formularioContato.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        if (!formularioContato.reportValidity()) return;

        botaoEnviar.disabled = true;
        botaoEnviar.textContent = 'Enviando...';
        mensagemStatus.textContent = '';
        mensagemStatus.removeAttribute('data-state');

        try {
            const endpointTemporario = FORM_ENDPOINT || '';
            if (
                !endpointTemporario ||
                endpointTemporario.includes('SEU_ID_AQUI') ||
                endpointTemporario.includes('formspree.io/f/SEU_ID_AQUI')
            ) {
                throw new Error('Configure o endpoint Formspree no arquivo js/contato.js antes de enviar.');
            }

            const resposta = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: new FormData(formularioContato)
            });

            if (!resposta.ok) {
                throw new Error('Não foi possível enviar sua mensagem agora. Tente novamente.');
            }

            formularioContato.reset();
            mensagemStatus.dataset.state = 'success';
            mensagemStatus.textContent = 'Mensagem enviada. Obrigado por entrar em contato!';
        } catch (erro) {
            mensagemStatus.dataset.state = 'error';
            mensagemStatus.textContent = erro.message.startsWith('Configure o endpoint')
                ? erro.message
                : 'Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.';
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = textoOriginalBotao;
        }
    });
}
