(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');
  const header = document.querySelector('.site-header');
  if (toggle && navigation) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      navigation.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('nav-open', !expanded);
    });
    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => { if (event.matches) close(); });
  }
  if (header) {
    const setScrolled = () => header.classList.toggle('has-scrolled', window.scrollY > 16);
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
