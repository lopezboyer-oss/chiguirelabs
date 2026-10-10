import test from 'node:test';
import assert from 'node:assert/strict';
import { requestPayload, requestEndpoint, sendRequest } from '../request-service.mjs';

const values = { name: 'Dueño de prueba', business: 'AROMA', contact: '+52 664 123 4567', method: 'whatsapp', consent: true };

test('requests only the chosen contact and tags Vuelve separately', () => {
  const phone = requestPayload(values, 'test-key');
  assert.equal(phone.phone, values.contact);
  assert.ok(!('email' in phone));
  assert.equal(phone.cafeteria, 'AROMA');
  assert.match(phone.subject, /Vuelve/);
  const email = requestPayload({ ...values, method: 'email', contact: 'demo@example.com' }, 'test-key');
  assert.equal(email.email, 'demo@example.com');
  assert.ok(!('phone' in email));
});
test('rejects missing consent, malformed contact and honeypot submissions', () => {
  for (const change of [{ consent: false }, { name: ' ' }, { business: '' }, { contact: '123' }, { contact: '1234567890 letras' }, { method: 'email', contact: 'sin-correo' }, { botcheck: true }]) {
    assert.throws(() => requestPayload({ ...values, ...change }, 'test-key'));
  }
});
test('acknowledges success only after the provider confirms the request', async () => {
  let sent;
  assert.equal(await sendRequest(requestPayload(values, 'test-key'), { fetchImpl: async (url, options) => {
    sent = { url, options };
    return { ok: true, json: async () => ({ success: true }) };
  } }), true);
  assert.equal(sent.url, requestEndpoint);
  assert.equal(sent.options.method, 'POST');
  assert.equal(JSON.parse(sent.options.body).contacto_preferido, 'WhatsApp');
});
test('provider rejection and network errors do not become a success message', async () => {
  for (const fetchImpl of [async () => ({ ok: false, json: async () => ({ success: true }) }), async () => ({ ok: true, json: async () => ({ success: false }) }), async () => { throw new TypeError('Network'); }]) {
    await assert.rejects(sendRequest({}, { fetchImpl }), /No pudimos confirmar/);
  }
});
test('a stalled request is aborted and can be retried', async () => {
  await assert.rejects(sendRequest({}, { timeoutMs: 5, fetchImpl: async (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(Object.assign(new Error('Timeout'), { name: 'AbortError' })));
  }) }), /Revisa tu conexión/);
});
