const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const form = document.getElementById('business-form');
const success = document.getElementById('form-success');

if (form && success) {
  const submitButton = form.querySelector('button[type="submit"]');
  const buttonLabel = submitButton.querySelector('.button-label');
  const buttonLoading = submitButton.querySelector('.button-loading');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    buttonLabel.hidden = true;
    buttonLoading.hidden = false;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (!data.success) throw new Error('No se pudo enviar el formulario');

      form.hidden = true;
      success.hidden = false;
      success.focus();
      form.reset();
    } catch (error) {
      openEmailFallback(formData);
    } finally {
      submitButton.disabled = false;
      buttonLabel.hidden = false;
      buttonLoading.hidden = true;
    }
  });
}

function openEmailFallback(formData) {
  const name = formData.get('fullname') || '';
  const phone = formData.get('phone') || '';
  const business = formData.get('business') || '';
  const priority = formData.get('priority') || '';
  const preferredTime = formData.get('preferred_time') || '';
  const challenge = formData.get('challenge') || 'Sin descripción';
  const privacyConsent = formData.get('privacy_consent') || 'No';

  const subject = encodeURIComponent(`Solicitud Negocio en Orden - ${business}`);
  const body = encodeURIComponent(
    `Nombre: ${name}\n` +
    `WhatsApp / teléfono: ${phone}\n` +
    `Negocio: ${business}\n` +
    `Prioridad: ${priority}\n` +
    `Horario preferido: ${preferredTime}\n\n` +
    `Aviso de privacidad aceptado: ${privacyConsent}\n\n` +
    `Situación actual:\n${challenge}`
  );

  window.location.href = `mailto:lopezboyer@gmail.com?subject=${subject}&body=${body}`;
}
