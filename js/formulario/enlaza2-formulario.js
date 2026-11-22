/* publicacion.js — Formulario "Edita tu anuncio" (enlaza2.pe) */
(function () {
  'use strict';

  /* ---------- Configuración ---------- */
  const WHATSAPP_ADMIN = '51991490519';
  const CLASE_ABIERTO = 'is-open'; // Asegúrate que en tu CSS sea .blz-photo-menu.is-open { display: block !important; }
  const CLASE_PANEL_TEMA = 'offcanvas-menu';
  const MAX_DESCRIPCION = 350;

  // URLs directas (i.ibb.co/...) de cada cartel
  const CARTELES = {
    "Se alquila (general)": "https://i.ibb.co/VpzsVQ20/image-4bacd3a.jpg",
    "Se alquila cuarto": "https://i.ibb.co/FkvQ8kGx/image-f9eda6da.jpg",
    "Se alquila depa": "https://i.ibb.co/4ZH21CvL/image-a187731a.jpg",
    "Se alquila local": "https://i.ibb.co/23FgDPfZ/image-6badf1a5.jpg",
    "Se vende casa": "https://i.ibb.co/fYscVcdy/image-4f0e0ac6.jpg",
    "Servicios generales": "https://i.ibb.co/SDxJY9DY/image-ea1b8f8b.jpg",
    "Servicio de electricista": "https://i.ibb.co/twgzdLhL/image-dfa7032a.jpg",
    "Servicio de albañilería": "https://i.ibb.co/hJWnxztx/image-2e0633b9.jpg",
    "Servicio de pintor": "https://i.ibb.co/nsbh7wfr/image-6b036388.jpg",
    "Servicio de gasfitero": "https://i.ibb.co/gLc4R4cB/image-18961f79.jpg",
    "Hago delivery": "https://i.ibb.co/MxKX7vVG/image-ea8cc6db.jpg",
    "Brindo asesoría profesional": "https://i.ibb.co/Y4F0RkfR/image-e4a038a8.jpg",
    "Se necesita trabajador": "https://i.ibb.co/RpY38PWW/image-c5b352ad.jpg",
  };

const IMAGEN_EN_BLANCO = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  /* ---------- Utilidades ---------- */
  const tarjetaDe = (el) => el.closest('.blz-publicar-card');

  function limpiarTexto(texto) {
    return String(texto || '')
      .replace(/\r\n?/g, '\n')                          // normaliza saltos de línea
      .replace(/<[^>]*>/g, '')                          // quita etiquetas HTML completas
      .replace(/[<>]/g, '')                             // quita < o > sueltos
      .replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi, '')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // control, pero conserva \n y \t
      .replace(/([!?¿¡])\1{2,}/g, '$1$1')               // ya no toca los puntos
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function setMenu(tarjeta, abrir) {
    if (!tarjeta) return;
    const menu = tarjeta.querySelector('#menuOpcionesFoto');
    const boton = tarjeta.querySelector('#btnToggleMenuFoto');
    if (!menu) return;

    menu.classList.toggle(CLASE_ABIERTO, abrir);
    menu.style.setProperty('display', abrir ? 'block' : 'none', 'important');
    if (boton) boton.setAttribute('aria-expanded', String(abrir));
  }

  /* ---------- Delegación de eventos ---------- */
  document.addEventListener('click', function (e) {
    const t = e.target;

    // Abrir/cerrar el selector desplegable de fotos
    const toggle = t.closest('#btnToggleMenuFoto');
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      const tarjeta = tarjetaDe(toggle);
      const menu = tarjeta && tarjeta.querySelector('#menuOpcionesFoto');
      const estaAbierto = !!menu && (menu.classList.contains(CLASE_ABIERTO) || menu.style.display === 'block');
      setMenu(tarjeta, !estaAbierto);
      return;
    }


    // Selección de duración
    const dur = t.closest('.blz-dur-btn');
    if (dur) {
      e.preventDefault();
      const tarjeta = tarjetaDe(dur);
      tarjeta.querySelectorAll('.blz-dur-btn').forEach((b) => b.classList.toggle('active', b === dur));
      const precioSpan = tarjeta.querySelector('#precioBoton');
      if (precioSpan) precioSpan.textContent = dur.dataset.precio;
      return;
    }

    // Enviar anuncio
    const publicar = t.closest('#btnPublicarMini');
    if (publicar) {
      e.preventDefault();
      procesarYEnviar(tarjetaDe(publicar));
      return;
    }

    // Cerrar el desplegable al hacer clic fuera de él y de su botón
    document.querySelectorAll('.blz-publicar-card').forEach((tarjeta) => {
      const menu = tarjeta.querySelector('#menuOpcionesFoto');
      const boton = tarjeta.querySelector('#btnToggleMenuFoto');
      if (menu && !menu.contains(t) && !(boton && boton.contains(t))) setMenu(tarjeta, false);
    });
  });


  // Radio buttons: la selección real (checked) controla el estado visual y los datos enviados.
  document.addEventListener('change', function (e) {
    const radio = e.target;
    if (!radio.matches('input[type="radio"][name="opcionFotoAnuncio"]')) return;

    const tarjeta = tarjetaDe(radio);
    if (!tarjeta) return;

    tarjeta.querySelectorAll('.blz-radio-row').forEach((fila) => {
      const input = fila.querySelector('input[type="radio"]');
      fila.classList.toggle('active', !!input && input.checked);
    });

    const propia = radio.dataset.propia === 'true';
    const tipo = radio.value;
    const preview = tarjeta.querySelector('#previewFoto');
    const textoBoton = tarjeta.querySelector('#btnToggleMenuFoto span');

    if (propia) {
      if (preview) preview.src = IMAGEN_EN_BLANCO;
      if (textoBoton) textoBoton.textContent = 'Enviaré mis fotos';
    } else {
      const url = CARTELES[tipo];
      if (preview && url) preview.src = url;
      if (textoBoton) textoBoton.textContent = 'Cambiar foto';
    }

    setMenu(tarjeta, false);
  });


  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.blz-publicar-card').forEach((tarjeta) => setMenu(tarjeta, false));
    }
  });

  /* ---------- Inputs y Contadores ---------- */
  document.addEventListener('input', function (e) {
    if (e.target.matches('#miniDescripcion')) {
      if (e.target.value.length > MAX_DESCRIPCION) {
        e.target.value = e.target.value.slice(0, MAX_DESCRIPCION);
      }
      const tarjeta = tarjetaDe(e.target);
      const contador = tarjeta.querySelector('#countDescripcion');
      if (contador) {
        const restante = MAX_DESCRIPCION - e.target.value.length;
        contador.textContent = restante;
        contador.parentElement.classList.toggle('blz-counter-warning', restante <= 40);
      }
    }
    if (e.target.matches('#miniWhatsapp')) {
      e.target.value = e.target.value.replace(/\D/g, '');
    }
  });

  /* ---------- Validación y Envío ---------- */
  function procesarYEnviar(tarjeta) {
    if (!tarjeta) return;

    // Honeypot anti-bots
    const honeypot = tarjeta.querySelector('#gonzalo');
    if (honeypot && honeypot.value.trim() !== '') return;

    const inputTitulo = tarjeta.querySelector('#miniTitulo');
    const inputDesc = tarjeta.querySelector('#miniDescripcion');
    const inputWsp = tarjeta.querySelector('#miniWhatsapp');

    const titulo = limpiarTexto(inputTitulo ? inputTitulo.value : '');
    const descripcion = limpiarTexto(inputDesc ? inputDesc.value : '');
    const telefono = (inputWsp ? inputWsp.value : '').replace(/\D/g, '');

    // Validaciones completas
    if (titulo.length < 4) {
      alert('Escribe un título claro para tu anuncio (mínimo 4 letras).');
      if (inputTitulo) inputTitulo.focus();
      return;
    }

    if (descripcion.length < 10) {
      alert('Describe mejor tu anuncio (mínimo 10 letras).');
      if (inputDesc) inputDesc.focus();
      return;
    }

    if (!/^(51)?9\d{8}$/.test(telefono)) {
      alert('Ingresa un número de WhatsApp válido de 9 dígitos (ej. 987654321).');
      if (inputWsp) inputWsp.focus();
      return;
    }

    // Recopilar duración
    const duracion = tarjeta.querySelector('.blz-dur-btn.active');
    const dias = duracion ? duracion.dataset.dias : '90';
    const precio = duracion ? duracion.dataset.precio : '20';

    // Recopilar selección de foto desde el radio realmente marcado en el HTML
    const opcionFoto = tarjeta.querySelector('input[name="opcionFotoAnuncio"]:checked');
    let infoImagen = 'Se alquila (general)';
    if (opcionFoto) {
      if (opcionFoto.dataset.propia === 'true') {
        infoImagen = 'SÍ TENGO IMÁGENES PROPIAS (las enviaré por aquí al final)';
      } else {
        const tipo = opcionFoto.value;
        const cat = opcionFoto.dataset.cat || '';
        const urlCartel = CARTELES[tipo] || '';
        infoImagen = `${cat} - ${tipo}\n🖼️ Cartel: ${urlCartel}`;
      }
    }

    const mensaje = [
      '*¡Nuevo anuncio! - enlaza2.pe*',
      `*Título:* ${titulo}`,
      `*Descripción:* ${descripcion}`,
      `*WhatsApp:* ${telefono}`,
      `*Duración:* ${dias} días (S/ ${precio})`,
      `*Imagen/Cartel:* ${infoImagen}`
    ].join('\n');

    window.open(
      `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener'
    );

    resetearYCerrar(tarjeta);
  }

  /* ---------- Control del Panel del Tema ---------- */
  function formularioDelPanel() {
    return document.querySelector('.site-mobile-menu-body #menu-formulario')
      || document.getElementById('menu-formulario');
  }

  function resetearYCerrar(tarjeta) {
    if (tarjeta) {
      tarjeta.querySelectorAll('#miniTitulo, #miniDescripcion, #miniWhatsapp').forEach((el) => {
        el.value = '';
      });
      const contador = tarjeta.querySelector('#countDescripcion');
      if (contador) contador.textContent = String(MAX_DESCRIPCION);
      if (contador && contador.parentElement) contador.parentElement.classList.remove('blz-counter-warning');
    }
    cerrarFormularioPublicar();

  }

  function abrirFormularioPublicar() {
    const form = formularioDelPanel();
    if (!form) return;
    form.style.display = 'block';
    document.body.classList.add(CLASE_PANEL_TEMA);
  }

  function cerrarFormularioPublicar() {
    const form = formularioDelPanel();
    if (form) form.style.display = '';
    document.body.classList.remove(CLASE_PANEL_TEMA);
  }

  new MutationObserver(function () {
    if (!document.body.classList.contains(CLASE_PANEL_TEMA)) {
      const form = formularioDelPanel();
      if (form) form.style.display = '';
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window.abrirFormularioPublicar = abrirFormularioPublicar;
  window.cerrarFormularioPublicar = cerrarFormularioPublicar;
})();