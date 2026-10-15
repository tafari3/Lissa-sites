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
  const serviceSelect = document.getElementById('enquiry-service');
  if (serviceSelect) {
    const requested = new URLSearchParams(window.location.search).get('service');
    if (requested && [...serviceSelect.options].some(option => option.value === requested)) {
      serviceSelect.value = requested;
    }
  }
  // Static local/GitHub Pages previews cannot accept Netlify form submissions.
  const enquiryForm = document.getElementById('enquiry-form');
  const hostname = window.location.hostname;
  const unsupportedPreview = window.location.protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.github.io');
  if (enquiryForm && unsupportedPreview) {
    enquiryForm.addEventListener('submit', event => {
      event.preventDefault();
      const notice = document.getElementById('form-preview-note');
      if (notice) { notice.hidden = false; notice.focus(); }
    });
  }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
})();
