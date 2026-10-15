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
  document.querySelectorAll('.image-with-fallback').forEach(frame => {
    const img = frame.querySelector('img');
    if (!img) return;
    const loaded = () => { frame.classList.add('has-image'); img.classList.remove('image-failed'); };
    const failed = () => { frame.classList.remove('has-image'); img.classList.add('image-failed'); };
    img.addEventListener('load', loaded);
    img.addEventListener('error', failed);
    if (img.complete) (img.naturalWidth > 0 ? loaded : failed)();
  });
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
  // WhatsApp Widget Toggle
  const waTrigger = document.getElementById('wa-trigger');
  const waPopover = document.getElementById('wa-popover');
  const waClose = document.getElementById('wa-popover-close');
  if (waTrigger && waPopover) {
    const toggleWa = (open) => {
      const isOpen = open !== undefined ? open : waPopover.hidden;
      waPopover.hidden = !isOpen;
      waTrigger.setAttribute('aria-expanded', String(isOpen));
      if (isOpen && waClose) waClose.focus();
    };
    waTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWa();
    });
    if (waClose) {
      waClose.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWa(false);
        waTrigger.focus();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !waPopover.hidden) {
        toggleWa(false);
        waTrigger.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!waPopover.hidden && !waPopover.contains(e.target) && e.target !== waTrigger) {
        toggleWa(false);
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
})();
