import { requestPayload, sendRequest } from './request-service.mjs';

const dialog = document.querySelector('#request-dialog');
const form = document.querySelector('#vuelve-request');
const contact = document.querySelector('#request-contact');
const contactLabel = document.querySelector('#contact-label');
const contactHint = document.querySelector('#contact-hint');
const status = document.querySelector('#request-status');
const submit = document.querySelector('#request-submit');
const success = document.querySelector('#request-success');
const drafts = { whatsapp: '', email: '' };
let currentMethod = 'whatsapp';
let sending = false;

document.querySelector('#open-request').addEventListener('click', () => {
  dialog.showModal();
  if (success.hidden) document.querySelector('#request-name').focus();
});
document.querySelector('#close-request').addEventListener('click', () => dialog.close());
document.querySelector('#close-request-success').addEventListener('click', () => dialog.close());

form.addEventListener('change', event => {
  if (event.target.name !== 'contact_method') return;
  drafts[currentMethod] = contact.value;
  currentMethod = event.target.value;
  const email = currentMethod === 'email';
  contact.type = email ? 'email' : 'tel';
  contact.name = email ? 'email' : 'phone';
  contact.autocomplete = email ? 'email' : 'tel';
  contact.inputMode = email ? 'email' : 'tel';
  contact.maxLength = email ? 254 : 30;
  contact.placeholder = email ? 'tu@correo.com' : '+52 664 123 4567';
  contactLabel.textContent = email ? 'Tu correo' : 'Tu WhatsApp';
  contactHint.textContent = email ? 'Te escribiremos sobre tu solicitud.' : 'Incluye la lada si tu número es de otro país.';
  contact.value = drafts[currentMethod];
  contact.setCustomValidity('');
  status.textContent = '';
  contact.focus();
});
contact.addEventListener('input', () => contact.setCustomValidity(''));

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  const data = new FormData(form);
  let payload;
  try {
    payload = requestPayload({
      name: data.get('name'), business: data.get('cafeteria'),
      contact: contact.value, method: currentMethod,
      consent: data.has('privacy_consent'), botcheck: data.has('botcheck'),
    }, data.get('access_key'));
  } catch (error) {
    status.textContent = error.message;
    status.dataset.state = 'error';
    return;
  }
  sending = true;
  submit.disabled = true;
  submit.textContent = 'Enviando…';
  form.setAttribute('aria-busy', 'true');
  status.textContent = '';
  try {
    await sendRequest(payload);
    form.hidden = true;
    success.hidden = false;
    document.querySelector('#request-success-title').focus();
    form.reset();
    drafts.whatsapp = '';
    drafts.email = '';
  } catch (error) {
    status.textContent = error.message;
    status.dataset.state = 'error';
  } finally {
    sending = false;
    form.removeAttribute('aria-busy');
    submit.disabled = false;
    submit.textContent = 'Solicitar demostración';
  }
});
