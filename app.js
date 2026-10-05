// Navigation Scroll Effect
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile Menu Toggle & Auto-Close
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.querySelectorAll('details[open]').forEach(details => details.removeAttribute('open'));
  });
});

document.addEventListener('click', event => {
  const services = navLinks.querySelector('.nav-services');
  if (services?.open && !services.contains(event.target)) services.removeAttribute('open');
});

// ─── 6 Ultra-Realistic Industry Data Object ───
const industryCases = {
  hvac: {
    title: "Mantenimiento HVAC Comercial / Industrial",
    tag: "Climatización & Chillers",
    timeline: [
      {
        time: "08:15 AM",
        group: "📌 Grupo Técnicos HVAC Campo",
        text: "Audio de 52 seg: <em>'El Chiller #2 de la Torre Corporativa entró en alarma de alta presión. Presostato disparado y fuga en válvula Danfoss TGEX.'</em>"
      },
      {
        time: "09:40 AM",
        group: "📌 Grupo Compras & Refrig.",
        text: "<em>'Válvula Danfoss ubicada en stock autorizado por $480 USD. Aprobada por Gerencia con Orden de Compra #OC-882.'</em>"
      },
      {
        time: "02:15 PM",
        group: "📌 Grupo Técnicos HVAC Campo",
        text: "<em>'Válvula sustituida, vacío realizado a 500 micrones y recarga R-410A concluida. Chiller #2 operando estable a 22°C.'</em>"
      }
    ],
    report: {
      title: "Falla Crítica Chiller #2 (Torre Corporativa)",
      status: "Reparada y Operativa al 100%",
      sla: "6 horas 00 minutos (SLA < 8h)",
      impact: "Presión y temperatura de edificio normalizadas sin suspensión de actividades",
      action: "Ninguna (OC-882 procesada)"
    }
  },
  obra: {
    title: "Constructora & Obra Civil General",
    tag: "Edificación & Estructuras",
    timeline: [
      {
        time: "07:30 AM",
        group: "📌 Grupo Residencia Obra Frente 3",
        text: "Audio de 38 seg: <em>'Nos faltan 2 toneladas de varilla de 1/2\" para cerrar la parrilla del eje C-12. El colado con bomba pluma es a la 1:00 PM.'</em>"
      },
      {
        time: "08:45 AM",
        group: "📌 Grupo Abastecimiento & Acero",
        text: "<em>'Despachado camión con 2 TN de varilla 1/2\" desde almacén central con guía de remisión #1092. ETA a obra: 10:15 AM.'</em>"
      },
      {
        time: "01:30 PM",
        group: "📌 Grupo Residencia Obra Frente 3",
        text: "<em>'Varilla recibida y armada. Inicio de colado de 45m³ con concreto premezclado. Prueba de tiro y revenimiento aprobada (14cm).'</em>"
      }
    ],
    report: {
      title: "Riesgo de Paro en Colado de Losa (Eje C-12)",
      status: "Colado completado sin retraso",
      sla: "5 horas 00 minutos",
      impact: "Cero horas de retraso en cronograma ($0 penalización por standby de bomba)",
      action: "Ninguna (Consumo de varilla actualizado en ERP)"
    }
  },
  alimentos: {
    title: "Alimentos & Bebidas (Sucursales / Franquicias)",
    tag: "Restaurantes & Cadena de Frío",
    timeline: [
      {
        time: "11:10 AM",
        group: "📌 Grupo Sucursal Zona Centro",
        text: "Audio de 40 seg: <em>'La cámara de congelación principal está en 8°C (debe estar en -18°C). Si sube más se pierde el lote de corte prime.'</em>"
      },
      {
        time: "11:30 AM",
        group: "📌 Grupo Mantenimiento Franquicias",
        text: "<em>'Técnico en ruta con relevador de repuesto y R-404A. ETA 20 min. Se traslada producto a congelador auxiliar de respaldo.'</em>"
      },
      {
        time: "03:20 PM",
        group: "📌 Grupo Sucursal Zona Centro",
        text: "<em>'Relevador cambiado y condensador limpio. Temperatura restablecida a -19°C. Cero merma de producto.'</em>"
      }
    ],
    report: {
      title: "Alerta de Temperatura Frigorífica (Sucursal Centro)",
      status: "Cadena de frío restablecida",
      sla: "4 horas 10 minutos (SLA Contingencia < 5h)",
      impact: "$4,500 USD salvados en merma de insumo prime de res",
      action: "Programar mantenimiento preventivo semestral"
    }
  },
  refaccionaria: {
    title: "Refaccionarias (Autopartes) con Sucursales",
    tag: "Venta Flotillera & Traspasos",
    timeline: [
      {
        time: "10:05 AM",
        group: "📌 Grupo Ventas Sucursal Norte",
        text: "<em>'Cliente flotilla solicita 4 kits de embrague LUK para camionetas de reparto. Solo tenemos 1 kit en almacén local. Venta de $2,800 a punto de caerse.'</em>"
      },
      {
        time: "10:30 AM",
        group: "📌 Grupo Logística & Traspasos",
        text: "<em>'Ubicados 3 kits en Sucursal Sur. Motoboy despachado con folio de traspaso inter-sucursal #T-504.'</em>"
      },
      {
        time: "01:15 PM",
        group: "📌 Grupo Ventas Sucursal Norte",
        text: "<em>'Traspaso recibido, pedido facturado e instalado en taller de cliente. Cobrado en terminal bancaria.'</em>"
      }
    ],
    report: {
      title: "Traspaso Inter-Sucursal por Venta Flotilla",
      status: "Venta concretada y cobrada",
      sla: "2 horas 40 minutos",
      impact: "$2,800 USD en ingresos salvados por agilidad logística",
      action: "Reajustar stock mínimo de seguridad en Sucursal Norte"
    }
  },
  electrico: {
    title: "Servicios Eléctricos & Mecánicos Industriales",
    tag: "Fuerza, Tableros & Subestaciones",
    timeline: [
      {
        time: "06:45 AM",
        group: "📌 Grupo Emergencias Industriales",
        text: "Audio de 60 seg: <em>'Planta Metalmecánica sin energía en Línea 2. Disparó el interruptor electromagnético de 1600A por sobrecorriente en fase B.'</em>"
      },
      {
        time: "08:15 AM",
        group: "📌 Grupo Pruebas & Calibración",
        text: "<em>'Equipo de termografía en sitio. Detectado falso contacto y aislamiento degradado en barra colectora principal.'</em>"
      },
      {
        time: "02:00 PM",
        group: "📌 Grupo Gerencia de Servicio",
        text: "<em>'Mantenimiento a barras realizado, torque a 55 lb-ft y pruebas de aislamiento aprobadas (>500 MΩ). Energización limpia.'</em>"
      }
    ],
    report: {
      title: "Disparo de Interruptor de Fuerza (Planta Metalmecánica)",
      status: "Línea 2 energizada y operando",
      sla: "7 horas 15 minutos",
      impact: "Pruebas de aislamiento certificadas según norma NEMA/NETA (>500 MΩ)",
      action: "Programar inspección termográfica preventiva en tableros secundarios"
    }
  },
  transporte: {
    title: "Servicios de Transporte & Logística de Carga",
    tag: "Flotas en Ruta & Auxilio Carretero",
    timeline: [
      {
        time: "11:40 AM",
        group: "📌 Grupo Monitoreo de Unidades",
        text: "Audio de 35 seg: <em>'Unidad #104 (Tractocamión Freightliner) varada en km 142 Autopista Norte por daño en neumático y manguera de freno.'</em>"
      },
      {
        time: "12:15 PM",
        group: "📌 Grupo Auxilio Vial & Talleres",
        text: "<em>'Unidad de rescate móvil #04 enviada en sitio con 2 neumáticos 295/80R22.5 y kit de conexiones neumáticas.'</em>"
      },
      {
        time: "03:10 PM",
        group: "📌 Grupo Operaciones Logísticas",
        text: "<em>'Reparación concluida. Unidad reanudó marcha con termoking en 4°C. Llegada a CEDIS dentro de ventana autorizada.'</em>"
      }
    ],
    report: {
      title: "Auxilio Carretero Exprés (Unidad #104 Frigorífico)",
      status: "Carga entregada en CEDIS a tiempo",
      sla: "3 horas 30 minutos",
      impact: "Pérdida de carga perecedera: 0% (Cadena de frío garantizada a 4°C)",
      action: "Ninguna (Registro de garantía de neumáticos procesado)"
    }
  },
  cedis: {
    title: "Centro de Distribución (CEDIS) & Almacén Central",
    tag: "Andenes, Rampa & Inventarios",
    timeline: [
      {
        time: "06:15 AM",
        group: "📌 Grupo Andenes & Recibo CEDIS",
        text: "Audio de 48 seg: <em>'El tráiler de la orden #OC-9940 llegó a rampa 4 con 24 tarimas, pero 3 vienen dañadas y el chofer no trae folio de cita impresa.'</em>"
      },
      {
        time: "07:05 AM",
        group: "📌 Grupo Control Inventarios & ERP",
        text: "<em>'Verificada factura con proveedor. Se autoriza la recepción parcial de 21 tarimas en sistema y la nota de devolución por las 3 dañadas (Folio #DEV-302).'</em>"
      },
      {
        time: "09:30 AM",
        group: "📌 Grupo Andenes & Recibo CEDIS",
        text: "<em>'Tráiler liberado y rampa 4 despejada. Tarimas ingresadas a rack de cuarentena y stock disponible para surtido.'</em>"
      }
    ],
    report: {
      title: "Discrepancia & Desbloqueo Rampa 4 (CEDIS Central)",
      status: "Recibo parcial procesado / Andén liberado",
      sla: "3 horas 15 minutos (SLA Recibo < 4h)",
      impact: "Cero penalización por demoras de transporte ($1,200 USD salvados en tiempos de espera de flota)",
      action: "Nota de devolución #DEV-302 enviada a Cuentas por Pagar"
    }
  }
};


// ─── Industry Switcher Logic ───
const indTabs = document.querySelectorAll('.ind-tab-btn');
const indTag = document.getElementById('ind-tag');
const indTitle = document.getElementById('ind-title');
const indChatContainer = document.getElementById('ind-chat-container');

const repTitle = document.getElementById('rep-title');
const repStatus = document.getElementById('rep-status');
const repSla = document.getElementById('rep-sla');
const repImpact = document.getElementById('rep-impact');
const repAction = document.getElementById('rep-action');

function renderIndustryCase(indKey) {
  const data = industryCases[indKey];
  if (!data) return;

  indTag.textContent = data.tag;
  indTitle.textContent = data.title;

  // Render WhatsApp Timeline Items
  indChatContainer.innerHTML = data.timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-group">${item.group}</div>
      <div class="timeline-content">${item.text}</div>
    </div>
  `).join('');

  // Render Executive Report Card
  repTitle.textContent = data.report.title;
  repStatus.textContent = data.report.status;
  repSla.textContent = data.report.sla;
  repImpact.textContent = data.report.impact;
  repAction.textContent = data.report.action;
}

indTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    indTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const indKey = tab.getAttribute('data-ind');
    renderIndustryCase(indKey);
  });
});

// Initial render
renderIndustryCase('hvac');

// ─── Online Web3Forms Submission Handler ───
const form = document.getElementById('omnichat-form');
const successBox = document.getElementById('form-success-box');
const submitBtn = document.getElementById('form-submit-btn');
const resetFormBtn = document.getElementById('reset-eval-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const btnIcon = submitBtn.querySelector('.btn-icon');

  submitBtn.disabled = true;
  btnText.hidden = true;
  if (btnIcon) btnIcon.hidden = true;
  btnLoading.hidden = false;

  try {
    const formData = new FormData(form);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      form.hidden = true;
      successBox.hidden = false;
      form.reset();
    } else {
      // Fallback: Mailto
      triggerMailtoFallback(formData);
    }
  } catch (err) {
    // Fallback: Mailto
    const formData = new FormData(form);
    triggerMailtoFallback(formData);
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    if (btnIcon) btnIcon.hidden = false;
    btnLoading.hidden = true;
  }
});

function triggerMailtoFallback(formData) {
  const name = formData.get('fullname') || '';
  const email = formData.get('email') || '';
  const phone = formData.get('phone') || '';
  const company = formData.get('company') || '';
  const groups = formData.get('groups_count') || '';
  const challenge = formData.get('challenge') || 'N/A';
  const privacyConsent = formData.get('privacy_consent') || 'No';

  const subject = encodeURIComponent(`Diagnóstico OmniChat - ${company}`);
  const body = encodeURIComponent(
    `Diagnóstico Operativo OmniChat:\n\n` +
    `Nombre: ${name}\n` +
    `Email: ${email}\n` +
    `Teléfono: ${phone}\n` +
    `Empresa: ${company}\n` +
    `Grupos activos: ${groups}\n` +
    `Aviso de privacidad aceptado: ${privacyConsent}\n` +
    `Reto principal:\n${challenge}`
  );

  window.location.href = `mailto:lopezboyer@gmail.com?subject=${subject}&body=${body}`;
}

function resetEvalForm() {
  form.hidden = false;
  successBox.hidden = true;
  form.reset();
}

resetFormBtn?.addEventListener('click', resetEvalForm);
