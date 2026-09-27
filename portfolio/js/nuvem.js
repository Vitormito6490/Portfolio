const nuvens = document.querySelectorAll('.nuvem-item');

nuvens.forEach((nuvem) => {
  nuvem.style.transform = 'none';
  nuvem.style.right = getComputedStyle(nuvem).right;
  nuvem.style.top = getComputedStyle(nuvem).top;
});
