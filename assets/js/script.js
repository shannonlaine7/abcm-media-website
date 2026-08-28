
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const founderCards = document.querySelectorAll('.founder-card');
founderCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (window.matchMedia('(hover: none)').matches) {
      card.classList.toggle('revealed');
    }
  });
  card.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.classList.toggle('revealed');
    }
  });
});
