(() => {
  'use strict';
  const form = document.getElementById('enquiry-form');
  if (!form || form.dataset.cloudpanelProduction !== 'true') return;
  const button = form.querySelector('button[type="submit"]');
  const feedback = document.getElementById('enquiry-status');
  const csrf = form.querySelector('input[name="csrf_token"]');
  if (!button || !feedback || !csrf) return;
  let tokenIssuedAt = 0;
  let busy = false;
  const report = (message, error = false) => {
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.dataset.error = error ? 'true' : 'false';
  };
  const refreshToken = async () => {
    const response = await fetch('/api/csrf.php', { credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) throw new Error('Enquiry service is temporarily unavailable. Please use WhatsApp or telephone.');
    const result = await response.json();
    if (!/^[a-f0-9]{64}$/.test(result.token || '')) throw new Error('Invalid form session.');
    csrf.value = result.token;
    tokenIssuedAt = Date.now();
  };
  button.disabled = true;
  refreshToken().then(() => { button.disabled = false; }).catch((error) => {
    report(error.message || 'Online enquiries are unavailable. Please use WhatsApp or telephone.', true);
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    busy = true;
    button.disabled = true;
    report('Sending your enquiry...');
    try {
      if (!csrf.value || Date.now() - tokenIssuedAt > 12 * 60 * 1000) await refreshToken();
      const response = await fetch(form.action, {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: new URLSearchParams(new FormData(form)),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Your enquiry could not be sent. Please try again.');
      form.reset();
      csrf.value = '';
      report('Your enquiry has been sent. Our team can follow up using your phone number.');
    } catch (error) {
      report(error.message || 'Your enquiry could not be sent. Please use WhatsApp or telephone.', true);
    } finally {
      busy = false;
      // A consumed/expired one-time token must never be reused on retry.
      refreshToken().then(() => { button.disabled = false; }).catch(() => {
        button.disabled = true;
        report('Online enquiries are temporarily unavailable. Please use WhatsApp or telephone.', true);
      });
    }
  });
})();
