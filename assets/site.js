(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const close = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    document.addEventListener('click', e => { if (!nav.contains(e.target) && !toggle.contains(e.target)) close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 930) close(); });
  }
  document.querySelectorAll('.hero-image img, .sector-image img, .image-story-visual img').forEach(img => {
    const failed = () => { img.classList.add('image-failed'); };
    img.addEventListener('error', failed);
    if (img.complete && img.naturalWidth === 0) failed();
  });
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
})();
