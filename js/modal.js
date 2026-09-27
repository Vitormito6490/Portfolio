const modalTriggers = document.querySelectorAll('[data-modal-target]');
const modals = document.querySelectorAll('.modal');
const topbar = document.querySelector('.topbar');

function openModal(trigger) {
    const modal = document.getElementById(trigger.dataset.modalTarget);

    if (!modal) return;

    modal.querySelector('[data-modal-text]').textContent = trigger.dataset.modalText;
    modal.hidden = false;
    document.body.classList.add('modal-is-open');
    if (topbar) topbar.style.visibility = 'hidden';
    modal.querySelector('[data-modal-close]').focus();
}

function closeModal(modal) {
    modal.hidden = true;
    document.body.classList.remove('modal-is-open');
    if (topbar) topbar.style.visibility = 'visible';
}

modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(trigger);
    });
});

modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('[data-modal-close]')) {
            closeModal(modal);
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modals.forEach((modal) => {
            if (!modal.hidden) closeModal(modal);
        });
    }
});