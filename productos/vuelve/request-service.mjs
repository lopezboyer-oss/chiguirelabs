export const requestEndpoint = 'https://api.web3forms.com/submit';

export function requestPayload(values, accessKey) {
  const name = String(values.name || '').trim();
  const business = String(values.business || '').trim();
  const contact = String(values.contact || '').trim();
  const method = values.method;
  if (!name || name.length > 100 || !business || business.length > 120) {
    throw new Error('Escribe tu nombre y el de tu cafetería.');
  }
  if (!['whatsapp', 'email'].includes(method)) throw new Error('Elige cómo podemos contactarte.');
  if (method === 'email' && (contact.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))) {
    throw new Error('Revisa tu correo electrónico.');
  }
  if (method === 'whatsapp' && (!/^\+?[\d\s().-]+$/.test(contact) || contact.replace(/\D/g, '').length < 10 || contact.replace(/\D/g, '').length > 15)) {
    throw new Error('Escribe un número de WhatsApp de 10 a 15 dígitos, incluyendo la lada internacional si corresponde.');
  }
  if (!values.consent) throw new Error('Autoriza el contacto para atender tu solicitud.');
  if (values.botcheck) throw new Error('No pudimos enviar esta solicitud.');
  return {
    access_key: accessKey,
    subject: 'Nueva solicitud para probar Vuelve — chiguirelabs.com',
    from_name: 'Vuelve · chiguirelabs.com',
    name,
    cafeteria: business,
    contacto_preferido: method === 'whatsapp' ? 'WhatsApp' : 'Correo electrónico',
    [method === 'whatsapp' ? 'phone' : 'email']: contact,
    privacy_consent: 'Sí, para atender esta solicitud de Vuelve',
    origen: 'Landing de Vuelve · chiguirelabs.com/productos/vuelve/',
    botcheck: false,
  };
}

export async function sendRequest(payload, { fetchImpl = fetch, timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(requestEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      throw new Error('No pudimos confirmar el envío. Tus datos siguen aquí para volver a intentar.');
    }
    return true;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError || error instanceof SyntaxError) {
      throw new Error('No pudimos confirmar el envío. Revisa tu conexión y vuelve a intentar.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
