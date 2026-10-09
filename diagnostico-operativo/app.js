const TOPICS = {
  production: {
    label: 'Producción',
    short: 'Producción',
    scope: 'Un registro diario de producción por turno o pedido, con cantidades, retrasos y merma.',
    reason: 'Puede volver visible cuánto se produce, dónde se retrasa el trabajo y qué información falta para decidir.'
  },
  inventory: {
    label: 'Inventario y existencias',
    short: 'Inventario',
    scope: 'Un control sencillo de entradas, salidas y existencias por presentación, separando disponible de comprometido.',
    reason: 'Permite contrastar lo producido, lo vendido y lo disponible sin depender de recorridos o memoria.'
  },
  costs: {
    label: 'Costos por producto o presentación',
    short: 'Costos',
    scope: 'Una hoja base de costo por presentación que separe insumos, energía, agua, empaque, mano de obra y reparto.',
    reason: 'Ayuda a conocer el margen real, pero requiere confirmar primero qué registros y consumos están disponibles.'
  },
  expenses: {
    label: 'Gastos y pagos',
    short: 'Gastos',
    scope: 'Un registro único de gastos, pagos y comprobantes, con categorías y responsables claros.',
    reason: 'Suele permitir un avance rápido cuando existen comprobantes, fotografías o movimientos que se pueden ordenar.'
  }
};

const UNDECIDED_TOPIC = {
  label: 'Por decidir durante la llamada',
  scope: 'Comparar las áreas señaladas y elegir una mejora pequeña que pueda mostrar un resultado visible con los registros disponibles.',
  reason: 'Todavía no hay una prioridad suficientemente clara. La llamada servirá para comparar impacto, complejidad, información disponible y facilidad de adopción.'
};

const QUESTIONS = [
  {
    id: 'size', section: 'Tu operación', kicker: 'Contexto del negocio', type: 'single',
    title: '¿Cuántas personas trabajan actualmente en el negocio, incluyéndote?',
    help: 'Esto nos ayuda a estimar cuánta coordinación y adopción requeriría una primera solución.',
    options: [['solo', 'Solo yo'], ['2-5', 'De 2 a 5 personas'], ['6-10', 'De 6 a 10 personas'], ['11-20', 'De 11 a 20 personas'], ['20+', 'Más de 20 personas']]
  },
  {
    id: 'organization', section: 'Tu operación', kicker: 'Forma de organización', type: 'single',
    title: '¿Cómo está formado principalmente el equipo?',
    options: [['self', 'Trabajo por cuenta propia'], ['family', 'Familia, sin personal externo'], ['mixed', 'Familia y personal contratado'], ['employees', 'Principalmente personal contratado']]
  },
  {
    id: 'role', section: 'Tu operación', kicker: 'Tu participación', type: 'single',
    title: '¿Cuál describe mejor tu papel en el negocio?',
    options: [['all', 'Hago prácticamente de todo'], ['operate', 'Opero y también superviso'], ['manage', 'Principalmente administro y dirijo'], ['supervise', 'Otra persona administra y yo superviso']]
  },
  {
    id: 'activities', section: 'Tu operación', kicker: 'Actividades actuales', type: 'multi',
    title: '¿Qué actividades forman parte de la operación?',
    help: 'Selecciona todas las que correspondan.',
    options: [['manufacture', 'Fabricar el producto'], ['resell', 'Comprar y revender'], ['counter', 'Venta directa en mostrador'], ['routes', 'Entregas o rutas'], ['business', 'Venta a negocios o distribuidores']]
  },
  {
    id: 'frictions', section: 'Dónde duele', kicker: 'Problemas actuales', type: 'multi', max: 2,
    title: '¿Qué áreas generan más frustración o incertidumbre hoy?',
    help: 'Elige máximo dos. Después escogeremos una para comenzar.',
    options: [['production', 'Producción: cuánto hacer y dónde aparecen retrasos'], ['inventory', 'Inventario: no tener certeza de las existencias'], ['costs', 'Costos: no conocer el costo real por presentación'], ['expenses', 'Gastos: pagos, comprobantes o desorden'], ['unclear', 'No distingo todavía cuál es el problema principal']]
  },
  {
    id: 'priority', section: 'Dónde duele', kicker: 'Primera prioridad', type: 'single', dynamic: true,
    title: 'Si tuviéramos que empezar por una sola área, ¿cuál elegirías?',
    help: 'Solo mostramos las áreas que seleccionaste. También puedes decidirlo con nosotros durante la llamada.'
  },
  {
    id: 'consequences', section: 'Dónde duele', kicker: 'Consecuencia visible', type: 'multi', max: 2,
    title: '¿Qué consecuencias notas con mayor frecuencia?',
    help: 'Elige máximo dos.',
    options: [['review_time', 'Pierdo tiempo preguntando o revisando'], ['mismatch', 'Los registros no coinciden con la realidad'], ['delays', 'Se producen atrasos'], ['losses', 'Se pierde producto o dinero'], ['no_info', 'Me falta información para decidir'], ['owner', 'Todo depende del dueño'], ['unknown', 'No lo sé todavía']]
  },
  {
    id: 'frequency', section: 'Dónde duele', kicker: 'Frecuencia', type: 'single',
    title: '¿Con qué frecuencia aparece el problema?',
    options: [['many_daily', 'Varias veces al día'], ['daily', 'Casi todos los días'], ['weekly', 'Varias veces por semana'], ['seasonal', 'Principalmente en temporadas de alta demanda'], ['occasional', 'Ocasionalmente'], ['unknown', 'No lo sé']]
  },
  {
    id: 'production_detail', section: 'Producción', kicker: 'Profundizar en producción', type: 'multi', max: 2, topic: 'production',
    title: 'En producción, ¿qué sería más útil aclarar primero?',
    help: 'Elige máximo dos.',
    options: [['qty', 'Cantidad producida por día o turno'], ['orders', 'Qué producir según pedidos'], ['bottlenecks', 'Cuellos de botella y retrasos'], ['waste', 'Merma o producto no aprovechado'], ['records', 'Quién registra y cómo lo hace'], ['unknown', 'No lo sé todavía']]
  },
  {
    id: 'inventory_detail', section: 'Inventario', kicker: 'Profundizar en inventario', type: 'multi', max: 2, topic: 'inventory',
    title: 'En inventario, ¿qué sería más útil aclarar primero?',
    help: 'Elige máximo dos.',
    options: [['balance', 'Saldo realmente disponible'], ['moves', 'Entradas y salidas'], ['reconcile', 'Conciliar producción, ventas y existencias'], ['committed', 'Distinguir disponible de producto comprometido'], ['formats', 'Control por presentación'], ['unknown', 'No lo sé todavía']]
  },
  {
    id: 'costs_detail', section: 'Costos', kicker: 'Profundizar en costos', type: 'multi', max: 2, topic: 'costs',
    title: 'En costos, ¿qué sería más útil conocer primero?',
    help: 'Elige máximo dos.',
    options: [['unit', 'Costo por bolsa, bloque o presentación'], ['utilities', 'Impacto de luz y agua'], ['inputs', 'Empaque y mano de obra'], ['delivery', 'Costo del reparto'], ['margin', 'Diferencia entre precio y costo'], ['unknown', 'No lo sé todavía']]
  },
  {
    id: 'expenses_detail', section: 'Gastos', kicker: 'Profundizar en gastos', type: 'multi', max: 2, topic: 'expenses',
    title: 'En gastos, ¿qué sería más útil ordenar primero?',
    help: 'Elige máximo dos.',
    options: [['payments', 'Pagos por realizar'], ['receipts', 'Comprobantes y facturas'], ['personal', 'Separar gastos personales del negocio'], ['categories', 'Clasificar gastos por categoría'], ['commitments', 'Compromisos de pago próximos'], ['unknown', 'No lo sé todavía']]
  },
  {
    id: 'tools', section: 'Lo que ya existe', kicker: 'Herramientas actuales', type: 'multi',
    title: '¿Qué herramientas usan actualmente?',
    help: 'Selecciona todas las que correspondan. Si quieres mostrarnos el nombre o la pantalla de algún sistema, puedes añadir una foto o audio en esa opción.',
    options: [['pos', 'Sistema de ventas o punto de venta'], ['accounting', 'Contabilidad o facturación'], ['operations', 'Sistema de inventario o producción'], ['excel', 'Microsoft Excel'], ['sheets', 'Google Sheets'], ['paper', 'Libretas, hojas o formatos en papel'], ['whatsapp', 'WhatsApp'], ['none', 'Ninguna herramienta formal'], ['unknown', 'No lo sé']]
  },
  {
    id: 'communication', section: 'Lo que ya existe', kicker: 'Comunicación del equipo', type: 'multi', teamOnly: true,
    title: '¿Cómo se coordinan normalmente las personas del equipo?',
    help: 'Selecciona todas las que correspondan.',
    options: [['wa_direct', 'WhatsApp individual'], ['wa_groups', 'Grupos de WhatsApp'], ['verbal', 'Indicaciones verbales'], ['calls', 'Llamadas'], ['board', 'Papel o pizarrón'], ['system', 'Un sistema o aplicación']]
  },
  {
    id: 'records', section: 'Lo que ya existe', kicker: 'Datos disponibles', type: 'single',
    title: '¿Dónde están hoy los registros relacionados con el problema?',
    options: [['digital', 'En sistemas o archivos digitales que se pueden exportar'], ['photos', 'En fotografías, mensajes o comprobantes'], ['paper', 'Principalmente en papel'], ['mixed', 'En una mezcla de digital y papel'], ['memory', 'Principalmente en la memoria de las personas'], ['unknown', 'No lo sé']]
  },
  {
    id: 'participants', section: 'Ponerlo en práctica', kicker: 'Personas involucradas', type: 'single',
    title: '¿Cuántas personas necesitarían usar o alimentar una primera solución?',
    options: [['one', 'Solo yo'], ['two', 'Dos personas'], ['3-5', 'De 3 a 5 personas'], ['5+', 'Más de 5 personas'], ['start_owner', 'Prefiero comenzar conmigo y después integrar al equipo'], ['unknown', 'No lo sé']]
  },
  {
    id: 'desired', section: 'Ponerlo en práctica', kicker: 'Resultado deseado', type: 'single',
    title: '¿Qué resultado te gustaría notar primero?',
    options: [['know_day', 'Conocer cómo va el día sin tener que preguntar'], ['errors', 'Reducir errores y diferencias'], ['time', 'Ahorrar tiempo'], ['know_costs', 'Conocer los costos reales'], ['expense_order', 'Tener los gastos ordenados'], ['delegate', 'Poder delegar con mayor confianza'], ['orientation', 'Saber por dónde conviene empezar']]
  },
  {
    id: 'start', section: 'Ponerlo en práctica', kicker: 'Forma de comenzar', type: 'single',
    title: '¿Cómo te resultaría más cómodo iniciar?',
    options: [['improve', 'Mejorar una herramienta que ya usamos'], ['phone', 'Usar principalmente el teléfono'], ['computer', 'Usar principalmente una computadora'], ['format', 'Empezar con un formato o resumen sencillo'], ['new', 'Probar una herramienta nueva'], ['call', 'Decidirlo durante la llamada']]
  },
  {
    id: 'approval', section: 'Preparar la propuesta', kicker: 'Toma de decisión', type: 'single',
    title: 'Si después de la llamada tiene sentido preparar una propuesta, ¿quién aprobaría el presupuesto?',
    options: [['me', 'Yo'], ['partner', 'Lo decidiríamos en familia o con un socio'], ['other', 'Otra persona'], ['undefined', 'Todavía no está definido']]
  }
];

const elements = {
  intro: document.getElementById('intro'), questionnaire: document.getElementById('questionnaire'), result: document.getElementById('result'),
  form: document.getElementById('diagnostic-form'), card: document.getElementById('question-card'), options: document.getElementById('options'),
  number: document.getElementById('question-number'), kicker: document.getElementById('question-kicker'), title: document.getElementById('question-title'),
  help: document.getElementById('question-help'), section: document.getElementById('section-label'), current: document.getElementById('progress-current'),
  total: document.getElementById('progress-total'), bar: document.getElementById('progress-bar'), validation: document.getElementById('validation'),
  back: document.getElementById('back-button'), next: document.getElementById('next-button'), start: document.getElementById('start-button'),
  resume: document.getElementById('resume-button'), save: document.getElementById('save-indicator'), template: document.getElementById('evidence-template'),
  resultPrimary: document.getElementById('result-primary'), resultPrimaryReason: document.getElementById('result-primary-reason'),
  resultSecondary: document.getElementById('result-secondary'), resultSecondaryReason: document.getElementById('result-secondary-reason'),
  resultScope: document.getElementById('result-scope'), resultSuccess: document.getElementById('result-success'), scoreGrid: document.getElementById('score-grid'),
  missingList: document.getElementById('missing-list'), send: document.getElementById('send-button'), exportStatus: document.getElementById('export-status')
};

const DB_NAME = 'chiguire-diagnostico';
const STORE_NAME = 'drafts';
const DRAFT_KEY = 'diagnostico-operativo-v1';
let state = { answers: {}, evidence: {}, currentId: 'size', updatedAt: null, submittedAt: null };
let currentIndex = 0;
let mediaRecorder = null;
let recordingTarget = null;
let recordingChunks = [];
let recordingTimer = null;

function optionObjects(question) {
  if (question.dynamic) {
    const selected = state.answers.frictions || [];
    const available = selected.filter((id) => TOPICS[id]).map((id) => [id, TOPICS[id].label]);
    return [...available, ['together', 'Prefiero decidirlo juntos durante la llamada']].map(([id, label]) => ({ id, label }));
  }
  return question.options.map(([id, label]) => ({ id, label }));
}

function activeQuestions() {
  const themes = state.answers.frictions || [];
  const size = state.answers.size?.[0];
  return QUESTIONS.filter((question) => {
    if (question.topic && !themes.includes(question.topic)) return false;
    if (question.teamOnly && size === 'solo') return false;
    return true;
  });
}

function selectedFor(id) { return state.answers[id] || []; }

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB no disponible'));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveDraft() {
  state.updatedAt = new Date().toISOString();
  elements.save.classList.add('saving');
  try {
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).put(state, DRAFT_KEY);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
    elements.save.lastChild.textContent = ' Guardado en este dispositivo';
  } catch (error) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...state, evidence: {} }));
      elements.save.lastChild.textContent = ' Respuestas guardadas; evidencias solo en esta sesión';
    } catch (_) {
      elements.save.lastChild.textContent = ' No fue posible guardar automáticamente';
    }
  } finally {
    elements.save.classList.remove('saving');
  }
}

async function loadDraft() {
  try {
    const db = await openDatabase();
    const saved = await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(DRAFT_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    if (saved?.answers) return saved;
  } catch (_) {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) return JSON.parse(saved);
  }
  return null;
}

async function deleteDraft() {
  try {
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      transaction.objectStore(STORE_NAME).delete(DRAFT_KEY);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  } catch (_) {}
  localStorage.removeItem(DRAFT_KEY);
}

function startQuestionnaire(resume = false) {
  elements.intro.hidden = true;
  elements.result.hidden = true;
  elements.questionnaire.hidden = false;
  const active = activeQuestions();
  currentIndex = resume ? Math.max(0, active.findIndex((q) => q.id === state.currentId)) : 0;
  if (currentIndex < 0) currentIndex = 0;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion() {
  const active = activeQuestions();
  if (currentIndex >= active.length) currentIndex = active.length - 1;
  const question = active[currentIndex];
  state.currentId = question.id;
  elements.number.textContent = String(currentIndex + 1).padStart(2, '0');
  elements.kicker.textContent = question.kicker;
  elements.title.textContent = question.title;
  elements.help.textContent = question.help || (question.type === 'multi' ? 'Puedes seleccionar más de una opción.' : 'Selecciona una opción.');
  elements.section.textContent = question.section;
  elements.current.textContent = currentIndex + 1;
  elements.total.textContent = active.length;
  elements.bar.style.width = `${((currentIndex + 1) / active.length) * 100}%`;
  elements.back.disabled = currentIndex === 0;
  elements.next.innerHTML = currentIndex === active.length - 1 ? 'Ver diagnóstico <span aria-hidden="true">→</span>' : 'Continuar <span aria-hidden="true">→</span>';
  elements.validation.hidden = true;
  elements.options.innerHTML = '';

  const selected = selectedFor(question.id);
  const options = optionObjects(question);
  if (question.dynamic && selected.some((value) => !options.some((option) => option.id === value))) {
    state.answers[question.id] = [];
  }

  options.forEach((option) => elements.options.appendChild(buildOption(question, option)));
  updateOptionStates(question);
  elements.card.focus({ preventScroll: true });
  saveDraft();
}

function buildOption(question, option) {
  const wrapper = document.createElement('div');
  wrapper.className = 'option-wrap';
  wrapper.dataset.option = option.id;

  const label = document.createElement('label');
  label.className = 'option-label';
  const input = document.createElement('input');
  input.type = question.type === 'single' ? 'radio' : 'checkbox';
  input.name = question.id;
  input.value = option.id;
  input.checked = selectedFor(question.id).includes(option.id);
  input.addEventListener('change', () => handleAnswer(question, option.id, input.checked));

  const mark = document.createElement('span');
  mark.className = 'control-mark';
  mark.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.className = 'option-text';
  text.textContent = option.label;
  label.append(input, mark, text);
  wrapper.appendChild(label);

  const evidence = elements.template.content.firstElementChild.cloneNode(true);
  evidence.hidden = !input.checked;
  setupEvidence(evidence, question.id, option.id, option.label);
  wrapper.appendChild(evidence);
  return wrapper;
}

function handleAnswer(question, optionId, checked) {
  let selected = [...selectedFor(question.id)];
  if (question.type === 'single') {
    selected = checked ? [optionId] : [];
  } else if (checked) {
    if (!selected.includes(optionId)) selected.push(optionId);
  } else {
    selected = selected.filter((id) => id !== optionId);
  }

  if (question.max && selected.length > question.max) {
    selected = selected.filter((id) => id !== optionId);
    const input = elements.options.querySelector(`input[value="${CSS.escape(optionId)}"]`);
    if (input) input.checked = false;
    showValidation(`Puedes seleccionar máximo ${question.max} opciones.`);
  } else {
    elements.validation.hidden = true;
  }

  state.answers[question.id] = selected;
  state.submittedAt = null;
  if (question.id === 'frictions') {
    const priority = selectedFor('priority')[0];
    if (priority && priority !== 'together' && !selected.includes(priority)) state.answers.priority = [];
  }
  updateOptionStates(question);
  saveDraft();
}

function updateOptionStates(question) {
  const selected = selectedFor(question.id);
  const atLimit = question.max && selected.length >= question.max;
  elements.options.querySelectorAll('.option-wrap').forEach((wrapper) => {
    const input = wrapper.querySelector('input');
    const isSelected = selected.includes(input.value);
    wrapper.classList.toggle('selected', isSelected);
    wrapper.classList.toggle('disabled', Boolean(atLimit && !isSelected));
    input.disabled = Boolean(atLimit && !isSelected);
    wrapper.querySelector('.evidence').hidden = !isSelected;
  });
}

function showValidation(message) {
  elements.validation.textContent = message;
  elements.validation.hidden = false;
}

function setupEvidence(container, questionId, optionId, optionLabel) {
  const recordButton = container.querySelector('.record-button');
  const fileInput = container.querySelector('input[type="file"]');
  const preview = container.querySelector('.evidence-preview');
  const message = container.querySelector('.evidence-message');
  if (evidenceFor(questionId, optionId).audio) recordButton.textContent = '● Reemplazar audio';
  recordButton.addEventListener('click', () => toggleRecording(questionId, optionId, optionLabel, recordButton, message));
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    message.textContent = 'Preparando fotografía…';
    try {
      const dataUrl = await compressImage(file);
      setEvidence(questionId, optionId, 'photo', { name: file.name, type: 'image/jpeg', dataUrl });
      message.textContent = 'Fotografía guardada en este dispositivo.';
      renderEvidencePreview(preview, questionId, optionId);
    } catch (_) {
      message.textContent = 'No fue posible procesar esta fotografía.';
    }
    fileInput.value = '';
  });
  renderEvidencePreview(preview, questionId, optionId);
}

function evidenceFor(questionId, optionId) {
  return state.evidence?.[questionId]?.[optionId] || {};
}

function setEvidence(questionId, optionId, type, value) {
  state.evidence[questionId] ||= {};
  state.evidence[questionId][optionId] ||= {};
  if (value) state.evidence[questionId][optionId][type] = value;
  else delete state.evidence[questionId][optionId][type];
  state.submittedAt = null;
  saveDraft();
}

function renderEvidencePreview(preview, questionId, optionId) {
  preview.innerHTML = '';
  const evidence = evidenceFor(questionId, optionId);
  if (evidence.audio) {
    const row = document.createElement('div');
    row.className = 'audio-preview';
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = evidence.audio.dataUrl;
    const remove = removeButton('Eliminar audio', () => {
      setEvidence(questionId, optionId, 'audio', null);
      renderEvidencePreview(preview, questionId, optionId);
    });
    row.append(audio, remove);
    preview.appendChild(row);
  }
  if (evidence.photo) {
    const row = document.createElement('div');
    row.className = 'photo-preview';
    const image = document.createElement('img');
    image.src = evidence.photo.dataUrl;
    image.alt = 'Fotografía adjunta a esta opción';
    const meta = document.createElement('div');
    meta.className = 'preview-meta';
    const name = document.createElement('strong');
    name.textContent = evidence.photo.name || 'Fotografía';
    const detail = document.createElement('small');
    detail.textContent = 'Guardada en este dispositivo';
    meta.append(name, detail);
    const remove = removeButton('Eliminar foto', () => {
      setEvidence(questionId, optionId, 'photo', null);
      renderEvidencePreview(preview, questionId, optionId);
    });
    row.append(image, meta, remove);
    preview.appendChild(row);
  }
}

function removeButton(label, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'remove-evidence';
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

async function toggleRecording(questionId, optionId, optionLabel, button, message) {
  if (mediaRecorder && recordingTarget?.button === button) {
    mediaRecorder.stop();
    return;
  }
  if (mediaRecorder) {
    message.textContent = 'Termina la grabación actual antes de iniciar otra.';
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    message.textContent = 'Este navegador no permite grabar audio aquí. Puedes continuar sin audio.';
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordingChunks = [];
    recordingTarget = { questionId, optionId, optionLabel, button, message, stream };
    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size) recordingChunks.push(event.data);
    });
    mediaRecorder.addEventListener('stop', () => finishRecording());
    mediaRecorder.start();
    button.classList.add('recording');
    button.textContent = '■ Detener grabación';
    message.textContent = 'Grabando… máximo 60 segundos.';
    recordingTimer = window.setTimeout(() => mediaRecorder?.stop(), 60000);
  } catch (_) {
    message.textContent = 'No se obtuvo permiso para usar el micrófono. Puedes continuar sin audio.';
  }
}

function finishRecording() {
  window.clearTimeout(recordingTimer);
  const target = recordingTarget;
  const mimeType = mediaRecorder?.mimeType || 'audio/webm';
  const blob = new Blob(recordingChunks, { type: mimeType });
  target.stream.getTracks().forEach((track) => track.stop());
  target.button.classList.remove('recording');
  target.button.textContent = evidenceFor(target.questionId, target.optionId).audio ? '● Reemplazar audio' : '● Grabar audio';
  const reader = new FileReader();
  reader.onload = () => {
    setEvidence(target.questionId, target.optionId, 'audio', { name: `${target.optionLabel}.webm`, type: mimeType, dataUrl: reader.result });
    target.message.textContent = 'Audio guardado en este dispositivo.';
    renderEvidencePreview(target.button.closest('.evidence').querySelector('.evidence-preview'), target.questionId, target.optionId);
  };
  reader.readAsDataURL(blob);
  mediaRecorder = null;
  recordingTarget = null;
  recordingChunks = [];
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const max = 1600;
        const ratio = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function answerIsValid(question) {
  return selectedFor(question.id).length > 0;
}

function moveNext() {
  const active = activeQuestions();
  const question = active[currentIndex];
  if (!answerIsValid(question)) {
    showValidation('Selecciona al menos una opción para continuar.');
    return;
  }
  if (currentIndex < active.length - 1) {
    currentIndex += 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showResult();
  }
}

function labelFor(question, optionId) {
  return optionObjects(question).find((option) => option.id === optionId)?.label || optionId;
}

function determineTopics() {
  const chosen = selectedFor('frictions').filter((id) => TOPICS[id]);
  const explicit = selectedFor('priority')[0];
  const records = selectedFor('records')[0];
  const desired = selectedFor('desired')[0];
  if (explicit && TOPICS[explicit]) {
    return { primary: explicit, secondary: chosen.find((id) => id !== explicit) || null, inferred: false };
  }
  const ease = { expenses: 4, inventory: 3, production: 2.7, costs: 2.2 };
  if (records === 'digital') { ease.inventory += 0.8; ease.production += 0.6; ease.costs += 0.7; }
  if (['photos', 'paper', 'mixed'].includes(records)) ease.expenses += 0.6;
  if (desired === 'know_costs') ease.costs += 2;
  if (desired === 'expense_order') ease.expenses += 2;
  if (desired === 'know_day') { ease.production += 1; ease.inventory += 1; }
  const ranked = [...chosen].sort((a, b) => ease[b] - ease[a]);
  return { primary: ranked[0] || null, secondary: ranked[1] || null, inferred: true };
}

function scoreResult() {
  const frequency = selectedFor('frequency')[0];
  const records = selectedFor('records')[0];
  const participants = selectedFor('participants')[0];
  const start = selectedFor('start')[0];
  const impact = ['many_daily', 'daily'].includes(frequency) ? 3 : ['weekly', 'seasonal'].includes(frequency) ? 2 : 1;
  const feasibility = records === 'digital' ? 3 : ['photos', 'paper', 'mixed'].includes(records) ? 2 : 1;
  const adoption = ['one', 'start_owner'].includes(participants) || ['phone', 'format', 'improve'].includes(start) ? 3 : participants === '5+' ? 1 : 2;
  return { impact, feasibility, adoption };
}

function showResult() {
  elements.questionnaire.hidden = true;
  elements.intro.hidden = true;
  elements.result.hidden = false;
  const topicResult = determineTopics();
  const primary = topicResult.primary ? TOPICS[topicResult.primary] : UNDECIDED_TOPIC;
  const secondary = topicResult.secondary ? TOPICS[topicResult.secondary] : null;
  const desiredQuestion = QUESTIONS.find((q) => q.id === 'desired');
  const desired = labelFor(desiredQuestion, selectedFor('desired')[0]);
  elements.resultPrimary.textContent = primary.label;
  elements.resultPrimaryReason.textContent = !topicResult.primary
    ? primary.reason
    : topicResult.inferred
    ? `${primary.reason} La sugerencia se basa en la facilidad aparente, los registros disponibles y el resultado que elegiste; la confirmaremos en la llamada.`
    : `${primary.reason} La mostramos primero porque la elegiste expresamente como prioridad.`;
  elements.resultSecondary.textContent = secondary?.label || 'Definir después del primer diagnóstico';
  elements.resultSecondaryReason.textContent = secondary
    ? `${secondary.reason} Puede funcionar como alternativa si el primer tema requiere información que todavía no está disponible.`
    : 'Conviene concentrar la llamada en una sola necesidad antes de abrir una segunda línea de trabajo.';
  elements.resultScope.textContent = primary.scope;
  elements.resultSuccess.textContent = desired;

  const scores = scoreResult();
  const scoreInfo = [
    ['Impacto', scores.impact, 'Frecuencia y consecuencias seleccionadas'],
    ['Facilidad inicial', scores.feasibility, 'Calidad y disponibilidad de los registros'],
    ['Adopción', scores.adoption, 'Personas involucradas y forma preferida de comenzar']
  ];
  elements.scoreGrid.innerHTML = '';
  scoreInfo.forEach(([label, value, detail]) => {
    const item = document.createElement('div');
    item.className = 'score-item';
    item.innerHTML = `<strong>${escapeHtml(label)}</strong><span>${escapeHtml(detail)}</span><div class="score-dots" aria-label="${value} de 3">${[1,2,3].map((n) => `<i class="${n <= value ? 'on' : ''}"></i>`).join('')}</div>`;
    elements.scoreGrid.appendChild(item);
  });

  const missing = buildMissingList(topicResult);
  elements.missingList.innerHTML = missing.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  if (state.submittedAt) {
    elements.send.disabled = true;
    elements.send.textContent = 'Respuestas enviadas';
    elements.exportStatus.textContent = 'Chiguire Labs ya recibió este diagnóstico.';
  } else {
    elements.send.disabled = false;
    elements.send.textContent = 'Enviar respuestas';
    elements.exportStatus.textContent = '';
  }
  state.currentId = 'result';
  saveDraft();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildMissingList(topicResult) {
  const list = ['Confirmar durante la llamada un ejemplo reciente del problema y su consecuencia concreta.'];
  if (selectedFor('records')[0] === 'memory' || selectedFor('records')[0] === 'unknown') list.push('Localizar al menos una fuente de datos o registro que permita comprobar la situación actual.');
  else list.push('Revisar una muestra de los registros existentes y confirmar si pueden reutilizarse.');
  if (selectedFor('priority')[0] === 'together') list.push('Comparar los temas seleccionados y acordar cuál ofrece el avance más visible con menor complejidad.');
  if (selectedFor('approval')[0] === 'undefined' || selectedFor('approval')[0] === 'other') list.push('Confirmar quién participará en la decisión de alcance y presupuesto.');
  if (topicResult.primary === 'costs') list.push('Definir qué componentes del costo se pueden medir actualmente y con qué periodicidad.');
  return list.slice(0, 4);
}

function activeResponseRows() {
  return activeQuestions().map((question) => {
    const selections = selectedFor(question.id);
    return {
      question,
      selections: selections.map((id) => ({ id, label: labelFor(question, id), evidence: evidenceFor(question.id, id) }))
    };
  });
}

function buildPlainSummary() {
  const topics = determineTopics();
  const primary = topics.primary ? TOPICS[topics.primary] : UNDECIDED_TOPIC;
  const secondary = topics.secondary ? TOPICS[topics.secondary] : null;
  const rows = activeResponseRows();
  const lines = [
    'DIAGNÓSTICO OPERATIVO PREVIO — CHIGUIRE LABS',
    `Fecha: ${new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`,
    '',
    `Tema principal sugerido: ${primary.label}`,
    `Tema de respaldo: ${secondary?.label || 'Por definir'}`,
    `Primer alcance a explorar: ${primary.scope}`,
    '',
    'RESPUESTAS'
  ];
  rows.forEach(({ question, selections }) => {
    lines.push('', question.title, selections.map((selection) => `• ${selection.label}`).join('\n'));
    const evidenceCount = selections.reduce((total, selection) => total + (selection.evidence.photo ? 1 : 0) + (selection.evidence.audio ? 1 : 0), 0);
    if (evidenceCount) lines.push(`  Evidencias adjuntas: ${evidenceCount} (incluidas únicamente en el expediente HTML).`);
  });
  lines.push('', 'Este documento prepara una llamada de diagnóstico. No constituye una cotización ni una propuesta automática.');
  return lines.join('\n');
}

function buildExportHtml() {
  const topics = determineTopics();
  const primary = topics.primary ? TOPICS[topics.primary] : UNDECIDED_TOPIC;
  const secondary = topics.secondary ? TOPICS[topics.secondary] : null;
  const rows = activeResponseRows();
  const answersHtml = rows.map(({ question, selections }) => {
    const optionHtml = selections.map((selection) => {
      const media = [];
      if (selection.evidence.photo) media.push(`<img src="${selection.evidence.photo.dataUrl}" alt="Fotografía adjunta" style="max-width:320px;max-height:240px;border-radius:12px;display:block;margin-top:10px;object-fit:cover">`);
      if (selection.evidence.audio) media.push(`<audio controls src="${selection.evidence.audio.dataUrl}" style="width:min(100%,420px);display:block;margin-top:10px"></audio>`);
      return `<li><strong>${escapeHtml(selection.label)}</strong>${media.join('')}</li>`;
    }).join('');
    return `<section><p class="tag">${escapeHtml(question.section)}</p><h2>${escapeHtml(question.title)}</h2><ul>${optionHtml}</ul></section>`;
  }).join('');
  const generated = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeStyle: 'short' }).format(new Date());
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Expediente de diagnóstico operativo</title><style>body{max-width:900px;margin:0 auto;padding:42px 24px;background:#071018;color:#eef5f3;font-family:Arial,sans-serif;line-height:1.55}header{border-bottom:1px solid #26343c;padding-bottom:24px;margin-bottom:28px}h1,h2{line-height:1.15}h1{font-size:2.3rem}h2{font-size:1.2rem;margin-bottom:8px}.accent,.tag{color:#00e5c3}.tag{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px}section{padding:20px;border:1px solid #26343c;border-radius:14px;background:#0d1922;margin:12px 0}li{margin:10px 0;color:#c9d3d4}.summary{border-color:#00a995;background:#09221f}.note{color:#9fb0b2;font-size:.8rem}@media print{body{background:#fff;color:#111}.summary,section{background:#fff;border-color:#ddd}.accent,.tag{color:#087b6b}li,.note{color:#333}}</style></head><body><header><p class="accent"><strong>CHIGUIRE LABS</strong></p><h1>Diagnóstico operativo previo</h1><p>Generado el ${escapeHtml(generated)}</p></header><section class="summary"><p class="tag">Lectura preliminar</p><h2>Tema principal sugerido: ${escapeHtml(primary.label)}</h2><p>${escapeHtml(primary.reason)}</p><p><strong>Tema de respaldo:</strong> ${escapeHtml(secondary?.label || 'Por definir en la llamada')}</p><p><strong>Primer alcance a explorar:</strong> ${escapeHtml(primary.scope)}</p></section>${answersHtml}<p class="note">Este expediente fue generado en el dispositivo de la persona que respondió. Prepara una llamada de diagnóstico y no constituye una cotización ni una propuesta automática.</p></body></html>`;
}

async function sendResponses() {
  if (state.submittedAt) return;
  const originalLabel = elements.send.textContent;
  elements.send.disabled = true;
  elements.send.textContent = 'Enviando…';
  elements.exportStatus.textContent = 'Preparando el expediente de forma segura…';
  try {
    const html = buildExportHtml();
    const expediente = new File(
      [html],
      `diagnostico-operativo-${new Date().toISOString().slice(0, 10)}.html`,
      { type: 'text/html;charset=utf-8' }
    );
    if (expediente.size > 7.5 * 1024 * 1024) {
      throw new Error('El expediente supera el límite de envío. Elimina alguna evidencia multimedia y vuelve a intentarlo.');
    }
    const formData = new FormData();
    formData.append('form-name', 'diagnostico-operativo');
    formData.append('bot-field', '');
    formData.append('title', `Diagnóstico operativo · ${new Date().toLocaleDateString('es-MX')}`);
    formData.append('body', buildPlainSummary());
    formData.append('expediente', expediente);
    const response = await fetch('/', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('No fue posible entregar las respuestas. Revisa tu conexión e inténtalo nuevamente.');
    state.submittedAt = new Date().toISOString();
    await saveDraft();
    elements.send.textContent = 'Respuestas enviadas';
    elements.exportStatus.textContent = 'Listo. Chiguire Labs recibió tu diagnóstico para preparar la llamada.';
  } catch (error) {
    elements.send.disabled = false;
    elements.send.textContent = originalLabel;
    elements.exportStatus.textContent = error.message || 'No fue posible enviar las respuestas. Inténtalo nuevamente.';
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

elements.start.addEventListener('click', () => startQuestionnaire(false));
elements.resume.addEventListener('click', () => {
  if (state.currentId === 'result') showResult();
  else startQuestionnaire(true);
});
elements.next.addEventListener('click', moveNext);
elements.back.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
elements.send.addEventListener('click', sendResponses);

(async function initialize() {
  const saved = await loadDraft();
  if (saved?.answers && Object.keys(saved.answers).length) {
    state = { answers: saved.answers || {}, evidence: saved.evidence || {}, currentId: saved.currentId || 'size', updatedAt: saved.updatedAt || null, submittedAt: saved.submittedAt || null };
    elements.resume.hidden = false;
    elements.start.textContent = 'Revisar desde el inicio →';
    if (state.currentId === 'result') elements.resume.textContent = 'Ver diagnóstico guardado';
  }
})();
