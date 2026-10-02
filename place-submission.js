(() => {
  const form = document.querySelector('#place-submission-form');
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const field = name => form.elements.namedItem(name);
  const feedback = form.querySelector('.submission-feedback');
  const businessFields = form.querySelector('.business-fields');
  const updateMode = () => {
    const business = field('relationship').value === 'business';
    businessFields.hidden = !business;
    businessFields.querySelectorAll('input,textarea').forEach(input => { input.disabled = !business; });
    form.querySelector('.submission-heading').textContent = business ? 'Introduce your place.' : 'Share a lovely find.';
    form.querySelector('button[type="submit"]').textContent = business ? 'Prepare listing request →' : 'Prepare recommendation →';
    feedback.textContent = '';
  };
  const normalizeInstagram = value => value.trim()
    .replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, '')
    .replace(/^@/, '').replace(/[/?#].*$/, '');
  const validateInstagram = () => {
    const valid = /^[a-zA-Z0-9._]{1,30}$/.test(normalizeInstagram(field('instagram').value));
    field('instagram').setCustomValidity(valid ? '' : 'Add the place’s Instagram @handle or profile link.');
    return valid;
  };
  field('city').value = (params.get('city') || '').slice(0,80);
  field('relationship').value = params.get('relationship') === 'business' ? 'business' : 'visitor';
  form.querySelectorAll('[name="relationship"]').forEach(input => input.addEventListener('change', updateMode));
  field('instagram').addEventListener('input', validateInstagram);
  form.addEventListener('submit', event => {
    event.preventDefault();
    validateInstagram();
    for (const name of ['place','city']) {
      field(name).value = field(name).value.trim();
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const business = data.get('relationship') === 'business';
    const subject = `${business ? 'Business listing request' : 'Place recommendation'}: ${data.get('place')} — ${data.get('city')}`;
    const lines = [
      `Relationship: ${business ? 'I own or work here' : 'I’ve visited'}`,
      `Place: ${data.get('place')}`, `Instagram: @${normalizeInstagram(data.get('instagram'))}`,
      `City / neighbourhood: ${data.get('city')}`, `Submitted by: ${String(data.get('name') || '').trim() || 'Not provided'}`,
      '', 'What makes it special:', String(data.get('note') || '').trim() || 'Not provided'
    ];
    if (business) lines.push('', `Website: ${data.get('website') || 'Not provided'}`, `Contact email: ${data.get('contact_email') || 'Not provided'}`, 'Dog policy:', String(data.get('dog_policy') || '').trim() || 'Not provided');
    const emailUrl = `mailto:byfloq@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    feedback.textContent = 'Your email draft is ready. Please send it from your email app to complete your submission. If it did not open, email byfloq@gmail.com with the details above.';
    location.href = emailUrl;
  });
  updateMode();
})();
