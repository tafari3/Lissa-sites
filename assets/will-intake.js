/* Serina Bhasera Consultancy: private, native will preparation worksheet.
   Answers remain in the current document. No transmission or persistent storage. */
(() => {
  'use strict';
  const form = document.getElementById('will-questionnaire');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('[data-will-step]'));
  const stageLabels = Array.from(document.querySelectorAll('#will-stages li'));
  const progress = document.getElementById('will-progress-label');
  const progressBar = document.querySelector('.will-progress-track');
  const progressFill = document.getElementById('will-progress-fill');
  const back = document.getElementById('will-back');
  const next = document.getElementById('will-next');
  const error = document.getElementById('will-error');
  const notReady = document.getElementById('will-not-ready');
  const giftList = document.getElementById('will-gift-list');
  const addGift = document.getElementById('will-add-gift');
  const review = document.getElementById('will-review-output');
  let step = 0;

  // This is deliberately NOT an HTML form: Enter cannot send answers by GET or POST.
  const field = name => form.querySelector(`[name="${name}"]`);
  const value = name => {
    const inputs = Array.from(form.querySelectorAll(`[name="${name}"]`));
    if (!inputs.length) return '';
    if (inputs[0].type === 'radio') return String(inputs.find(input => input.checked)?.value || '').trim();
    return String(inputs[0].value || '').trim();
  };

  function updateConditions() {
    const status = value('marital_status');
    const hasSpouse = status === 'Married' || status === 'Separated';
    document.getElementById('will-spouse-applicable').hidden = !hasSpouse;
    document.getElementById('will-spouse-na').hidden = hasSpouse;
    if (!hasSpouse) {
      field('spouse_name').value = '';
      field('spouse_notes').value = '';
    }
    const showChildren = value('has_children') === 'Yes';
    document.getElementById('will-children-details').hidden = !showChildren;
    field('children_count').required = showChildren;
    if (!showChildren) {
      field('children_count').value = '';
      field('has_minors').value = '';
    }
    notReady.hidden = value('wants_will') !== 'No';
  }

  function renumberGifts() {
    const items = Array.from(giftList.querySelectorAll('[data-will-gift]'));
    items.forEach((item, i) => {
      item.querySelector('h4').textContent = `Gift ${i + 1}`;
      const remove = item.querySelector('.will-remove-gift');
      remove.setAttribute('aria-label', `Remove gift ${i + 1}`);
      item.querySelectorAll('input, textarea').forEach(input => {
        input.id = `will-gift-${i + 1}-${input.name}`;
        input.parentElement.querySelector('label').htmlFor = input.id;
      });
    });
    addGift.disabled = items.length >= 10;
  }

  function getGifts() {
    return Array.from(giftList.querySelectorAll('[data-will-gift]')).map(item => ({
      description: (item.querySelector('[name="gift_description"]')?.value || '').trim(),
      recipient: (item.querySelector('[name="gift_recipient"]')?.value || '').trim(),
      notes: (item.querySelector('[name="gift_notes"]')?.value || '').trim()
    })).filter(item => item.description || item.recipient || item.notes);
  }

  function makeText(tag, contents, className) {
    const el = document.createElement(tag);
    el.textContent = contents;
    if (className) el.className = className;
    return el;
  }

  function addReviewSection(title, targetStep, rows) {
    const section = document.createElement('section');
    section.className = 'will-review-section';
    const heading = document.createElement('div');
    heading.className = 'will-review-heading';
    heading.append(makeText('h4', title));
    const edit = makeText('button', 'Edit', 'will-review-edit');
    edit.type = 'button';
    edit.addEventListener('click', () => showStep(targetStep));
    heading.append(edit);
    section.append(heading);
    const list = document.createElement('dl');
    list.className = 'will-review-list';
    rows.forEach(([label, val]) => {
      list.append(makeText('dt', label), makeText('dd', val || 'Not provided'));
    });
    section.append(list);
    review.append(section);
  }

  function renderReview() {
    review.replaceChildren();
    review.append(makeText('p', 'WILL PREPARATION NOTES - NOT A LEGAL WILL', 'will-print-heading'));
    addReviewSection('Your details', 1, [
      ['Name', value('full_name')], ['Phone / WhatsApp', value('phone')],
      ['Email', value('email')], ['Town or city', value('location')]
    ]);
    addReviewSection('Marital status and spouse', 2, [
      ['Marital status', value('marital_status')],
      ['Spouse / partner', value('spouse_name')], ['Notes', value('spouse_notes')]
    ]);
    addReviewSection('Children and dependants', 4, [
      ['Children or dependants', value('has_children')],
      ['Number', value('children_count')], ['Any under 18', value('has_minors')]
    ]);
    const gifts = getGifts();
    const rows = gifts.length ? gifts.flatMap((gift, i) => [
      [`Gift ${i + 1}`, gift.description || 'To discuss'],
      ['Intended recipient', gift.recipient], ['Instructions', gift.notes]
    ]) : [['Gifts or property', 'To be discussed with the consultancy']];
    addReviewSection('Bequests', 5, rows);
    addReviewSection('Final wishes', 6, [
      ['Executor preference', value('executor')], ['Guardian preference', value('guardian')],
      ['Other wishes', value('final_notes')]
    ]);
    review.append(makeText('p', 'This is only a preliminary preparation summary. It has not been sent to the consultancy and must be reviewed by a qualified professional.', 'will-review-disclaimer'));
  }

  function showStep(index, focusHeading = true) {
    if (index < 0 || index >= steps.length) return;
    step = index;
    updateConditions();
    steps.forEach((section, i) => { section.hidden = i !== index; });
    stageLabels.forEach((item, i) => {
      item.classList.toggle('is-current', i === index);
      item.classList.toggle('is-complete', i < index);
      if (i === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    progress.textContent = `Step ${index + 1} of ${steps.length}`;
    progressBar.setAttribute('aria-valuenow', String(index + 1));
    progressFill.style.width = `${((index + 1) / steps.length) * 100}%`;
    back.hidden = index === 0;
    next.hidden = index === steps.length - 1;
    next.innerHTML = index === steps.length - 2 ? 'Review answers <span aria-hidden="true">&rarr;</span>' : 'Continue <span aria-hidden="true">&rarr;</span>';
    error.hidden = true;
    if (index === steps.length - 1) renderReview();
    if (focusHeading) {
      steps[index].querySelector('h3').focus({ preventScroll: true });
      document.getElementById('will-stages').scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  function validateCurrentStep() {
    if (step === 0 && value('wants_will') === 'No') {
      notReady.hidden = false;
      return false;
    }
    const inputs = Array.from(steps[step].querySelectorAll('input, select, textarea'));
    for (const input of inputs) {
      if (input.closest('[hidden]')) continue;
      if (!input.checkValidity()) {
        error.hidden = false;
        error.textContent = 'Please complete the required information before continuing.';
        input.reportValidity();
        input.focus();
        return false;
      }
    }
    return true;
  }

  back.addEventListener('click', () => showStep(step - 1));
  next.addEventListener('click', () => {
    if (validateCurrentStep()) showStep(step + 1);
  });
  form.addEventListener('change', updateConditions);

  addGift.addEventListener('click', () => {
    if (giftList.querySelectorAll('[data-will-gift]').length >= 10) return;
    const source = giftList.querySelector('[data-will-gift]');
    const copy = source.cloneNode(true);
    copy.querySelectorAll('input, textarea').forEach(input => { input.value = ''; });
    giftList.append(copy);
    renumberGifts();
    copy.querySelector('input').focus();
  });
  giftList.addEventListener('click', event => {
    const remove = event.target.closest('.will-remove-gift');
    if (!remove) return;
    const item = remove.closest('[data-will-gift]');
    if (giftList.querySelectorAll('[data-will-gift]').length > 1) item.remove();
    else item.querySelectorAll('input, textarea').forEach(input => { input.value = ''; });
    renumberGifts();
  });

  document.getElementById('will-print').addEventListener('click', () => {
    document.body.classList.add('will-print-only');
    window.print();
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('will-print-only'));
  document.getElementById('will-clear').addEventListener('click', () => {
    if (!window.confirm('Clear all of your answers from this page? This cannot be undone.')) return;
    form.querySelectorAll('input, select, textarea').forEach(input => {
      if (input.type === 'radio' || input.type === 'checkbox') input.checked = false;
      else if (input.tagName === 'SELECT') input.selectedIndex = 0;
      else input.value = '';
    });
    giftList.querySelectorAll('[data-will-gift]').forEach((item, i) => { if (i > 0) item.remove(); });
    renumberGifts();
    showStep(0);
  });
  renumberGifts();
  showStep(0, false);
})();
