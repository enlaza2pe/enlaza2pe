// Mapa de colores por subcategoría
const COLORES_SUBCATEGORIAS = {
  refer: "#4157d2",
  diwali: "#9A2E8F",
  candy: "#FF6FAE",
  festival: "#A767D9",
  practice: "#2F4A52",
  Alquileres: "#2e7550",
  strawberry: "#E61B56",
  vote: "#B88200"
};

function diseño1(a, categoria, palabrasCoincidentes = []) { 
  const globos = palabrasCoincidentes
    .map(palabra => ` <span class="blz-search-keyword"> ${escaparHTML(palabra)} </span> `)
    .join("");

  const colorHex = COLORES_SUBCATEGORIAS[globos] || "";
  const estiloColor = colorHex ? `style="background-color: ${colorHex};"` : "";
  //const subcategoria = a.subcategory ? ` <span class="blz-subcategory-badge" ${estiloColor}> ${escaparHTML(a.subcategory)} </span> `: "";

  const escaparComillas = (texto) => String(texto ?? '').replace(/'/g, "\\'");

  // SOLUCIÓN AL POPUP: Convertimos el JSON en una cadena URL segura para que no rompa el atributo onclick
  const imagenesCodificadas = encodeURIComponent(JSON.stringify(a.imagenes ?? []));

  //${subcategoria} ---se retiro cuando estaba encima de la clase : "blz-img-container-fix"
  return `
  <div class="col-12 col-md-6 mb-3">
    <div class="blz-horizontal-card">
      <div class="blz-card-flex-wrapper">
        <div class="blz-card-image-side" style="position: relative;">
          <!-- BOTÓN DE ZOOM EN EL CENTRO -->
          <button type="button" class="blz-zoom-overlay-btn" onclick="event.stopPropagation(); event.preventDefault(); abrirPopupGaleria('${imagenesCodificadas}')" aria-label="Ver galería">
            <span class="bi bi-zoom-in"></span>
          </button>
          
          <a href="javascript:void(0)"  class="blz-card-image-wrapper"  onclick="event.stopPropagation(); event.preventDefault(); abrirPopupGaleria('${imagenesCodificadas}')">
               <div class="blz-img-container-fix">
              ${crearGaleria(a.imagenes)}
            </div>
          </a>
        </div>
        <div class="blz-card-content-side">
          <div class="blz-card-body-text">
            <h1 class="blz-card-title">
              <a href="javascript:void(0)">
                ${a.titulo ?? ""}
              </a>
            </h1>
            <p class="blz-card-description">
              ${a.descripcion ?? ""}
            </p>
            ${globos ? `<div class="blz-search-keywords">${globos}</div>` : ""}
          </div>
          <div class="blz-card-actions" style="display: flex; gap: 8px; width: 100%;">
            <button type="button" class="btn-blz-action btn-blz-share" onclick="event.stopPropagation(); compartirAnuncio('${escaparComillas(a.web)}')" >
              <span class="icon-share-square-o" style='font-size: 22px;'></span>
            </button>
            <button type="button" class="btn-blz-action btn-blz-view" onclick="event.stopPropagation(); procesarContacto('${escaparComillas(a.contacto)}', '${escaparComillas(a.titulo)}')" >
              ${a.boton ?? "CONTACTAR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
}

// Función para las imágenes
function crearGaleria(imagenes = []) {
  if (!imagenes.length) {
    imagenes = ["img/default/diseno2-5.jpg"];
  }
  return `
        <div class="blz-slider">
            ${imagenes.map((img, i) => `
                <img
                    src="${img}"
                    class="blz-card-custom-img ${i === 0 ? 'activo' : ''}"
                    loading="lazy">
            `).join("")}
        </div>
    `;
}

// LÓGICA DEL POPUP MODAL PARA LA GALERÍA
function abrirPopupGaleria(imagenesCodificadas) {
  let imagenes = [];
  try {
    // SOLUCIÓN AL POPUP: Decodificamos el string seguro de vuelta a JSON
    imagenes = JSON.parse(decodeURIComponent(imagenesCodificadas));
  } catch (e) {
    imagenes = [];
  }
  if (!imagenes.length) {
    imagenes = ["img/default/diseno2-5.jpg"];
  }

  const modalExistente = document.getElementById("blzCustomModal");
  if (modalExistente) modalExistente.remove();

  const modalHTML = `
    <div id="blzCustomModal" class="blz-modal-mask" onclick="cerrarPopupGaleria()">
      <div class="blz-modal-container" onclick="event.stopPropagation()">
        <div class="blz-modal-content">
          <div class="blz-modal-slider">
            ${imagenes.map((img, i) => `
              <img src="${img}" class="blz-modal-img ${i === 0 ? 'activo' : ''}" data-index="${i}" alt="Imagen de galería">
            `).join("")}
          </div>
          ${imagenes.length > 1 ? `
            <button type="button" class="blz-modal-nav prev" onclick="cambiarImagenModal(-1)">❮</button>
            <button type="button" class="blz-modal-nav next" onclick="cambiarImagenModal(1)">❯</button>
          ` : ""}
        </div>
        <!-- Botón redondo blanco debajo de la galería -->
        <button type="button" class="blz-modal-close-btn-round" onclick="cerrarPopupGaleria()">CERRAR</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}



function cerrarPopupGaleria() {
  const modal = document.getElementById("blzCustomModal");
  if (modal) modal.remove();
}

function cambiarImagenModal(direccion) {
  const modal = document.getElementById("blzCustomModal");
  if (!modal) return;
  const imgs = modal.querySelectorAll(".blz-modal-img");
  if (imgs.length <= 1) return;

  let actual = [...imgs].findIndex(img => img.classList.contains("activo"));
  imgs[actual].classList.remove("activo");

  actual = (actual + direccion + imgs.length) % imgs.length;
  imgs[actual].classList.add("activo");
}

// JS del carrusel de las tarjetas de anuncios
document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    document.querySelectorAll(".blz-slider").forEach(slider => {
      const imgs = slider.querySelectorAll("img");
      if (imgs.length <= 1) return;
      let actual = [...imgs].findIndex(i => i.classList.contains("activo"));
      imgs[actual].classList.remove("activo");
      actual = (actual + 1) % imgs.length;
      imgs[actual].classList.add("activo");
    });
  }, 4000);
});

function procesarContacto(contacto, tituloAnuncio) {
  if (!contacto) {
    alert("Este anuncio no cuenta con datos de contacto activos.");
    return;
  }

  const urlEvaluar = contacto.toLowerCase().trim();

  if (urlEvaluar.includes('facebook.com') || urlEvaluar.includes('fb.com')) { //(BOTÓN) A FACEBOOK
    let urlDestino = contacto.trim();
    if (!urlDestino.match(/^https?:\/\//i)) {
      urlDestino = `https://${urlDestino}`;
    }
    window.location.href = urlDestino;
  } //(BOTÓN)A PAGINA WEB PROPIA ó CATALOGO ENLAZA2.PE
  else if (urlEvaluar.includes("http://") || urlEvaluar.includes("https://") || urlEvaluar.includes("www.")) {
    let urlDestino = contacto;
    if (urlEvaluar.includes("www.") && !urlEvaluar.includes("http")) {
      urlDestino = "https://";
    }
    abrirVista(urlDestino);
  }
  else { //(BOTÓN)AL WHATSAPP
    let numeroLimpio = String(contacto).replace(/\D/g, '');
    if (numeroLimpio.length === 9) {
      numeroLimpio = "51" + numeroLimpio;
    }
    const tituloLimpio = tituloAnuncio.replace(/<[^>]*>/g, '');
    const mensaje = `Hola, vi tu anuncio "${tituloLimpio}" en Enlaza2.pe y deseo más información.`;
    const urlWhatsapp = "https://wa.me/" + numeroLimpio + "?text=" + encodeURIComponent(mensaje);
    window.open(urlWhatsapp, '_blank');
  }
}
