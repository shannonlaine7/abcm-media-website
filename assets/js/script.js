const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Founder portrait reveal behavior.
document.querySelectorAll('.founder-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (window.matchMedia('(hover: none)').matches) {
      card.classList.toggle('revealed');
    }
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('revealed');
    }
  });
});

const headerOffset = () => (header ? header.getBoundingClientRect().height : 0) + 12;

// Some sections have generous top padding for the cinematic layout.
// Scroll a little farther into those sections so their labels/headlines
// sit closer to the sticky header when reached from the navigation.
const sectionScrollAdjustments = {
  home: 0,
  about: 0,
  projects: 52,
  founders: 54,
  contact: 46
};

function scrollToTarget(target, updateHistory = true) {
  if (!target) return;
  const extra = sectionScrollAdjustments[target.id] || 0;
  const y = target.getBoundingClientRect().top + window.scrollY - headerOffset() + extra;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });

  if (updateHistory && target.id) {
    history.pushState(null, '', `#${target.id}`);
  }
}

// Use one consistent offset-aware scroll behavior for all internal links.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);
  });
});

const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const navTargets = navLinks
  .map((link) => {
    const id = link.getAttribute('href').slice(1);
    return { id, link, section: document.getElementById(id) };
  })
  .filter((item) => item.section);

function setActiveNav() {
  if (!navTargets.length) return;

  const marker = window.scrollY + headerOffset() + 28;
  let current = navTargets[0];

  // Only compare sections that actually have menu items. This means the
  // Mission section naturally remains under About until Projects begins.
  navTargets.forEach((item) => {
    if (item.section.offsetTop <= marker) current = item;
  });

  // At the very bottom of the page, always mark Contact active.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
    current = navTargets[navTargets.length - 1];
  }

  navLinks.forEach((link) => {
    link.classList.toggle('active', link === current.link);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('resize', setActiveNav);
setActiveNav();

// If the page is opened directly with a hash, correct for the sticky header.
window.addEventListener('load', () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  window.setTimeout(() => scrollToTarget(target, false), 50);
});
