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

    console.log(categoria);
    const globos = palabrasCoincidentes
        .map(palabra => ` <span class="blz-search-keyword"> ${escaparHTML(palabra)} </span> `)
        .join(""); 
    // Buscamos el color correspondiente. Si no existe, no aplica background-color inline.
    const colorHex = COLORES_SUBCATEGORIAS[globos] || "";
    const estiloColor = colorHex ? `style="background-color: ${colorHex};"` : "";
    const subcategoria = a.subcategory 
        ? ` <span class="blz-subcategory-badge" ${estiloColor}> ${escaparHTML(a.subcategory)} </span> ` 
        : "";
        

    return `
    <div class="col-12 col-md-6 mb-3">
        <div class="blz-horizontal-card">
            <!-- CONTENEDOR FLEX PRINCIPAL -->
            <div class="blz-card-flex-wrapper">
                <div class="blz-card-image-side">
                    <a href="javascript:void(0)" onclick="abrirVista('${a.web}')" class="blz-card-image-wrapper" >
                        <!-- SUBCATEGORÍA -->
                        ${subcategoria}
                        <!-- GALERÍA -->
                        <div class="blz-img-container-fix">
                            ${crearGaleria(a.imagenes)}
                        </div>
                    </a>
                </div>
                <div class="blz-card-content-side">
                    <!-- Zona Superior: Textos -->
                    <div class="blz-card-body-text">
                        <!-- TÍTULO: Aseguramos color oscuro y legible -->
                        <h2 class="blz-card-title">
                            <a href="javascript:void(0)" onclick="abrirVista('${a.web}')" >
                                ${a.titulo ?? ""}
                            </a>
                        </h2>
                        <!-- DESCRIPCIÓN -->
                        <p class="blz-card-description">
                            ${a.descripcion ?? ""}
                        </p>
                        <!-- KEYWORDS -->
                        ${
                            globos ? ` <div class="blz-search-keywords"> ${globos} </div> ` : ""
                        }
                    </div>
                    <!-- Zona Inferior: Botones de Acción -->
                    <div class="blz-card-actions">
                        <!-- Botón Compartir -->
                        <button type="button" class="btn-blz-action btn-blz-share" onclick="event.stopPropagation(); compartirAnuncio('${a.web}')" >
                            COMPARTE
                        </button>
                        <!-- Botón VER -->
                        <button type="button" class="btn-blz-action btn-blz-view" onclick="abrirVista('${a.web}')" >
                            ${a.boton ?? "VER"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

//función para las imágenes
function crearGaleria(imagenes = []) {
  if (!imagenes.length) {
    imagenes = ["img/default/diseno2-5.jpg"];
  }
  return `
        <div class="blz-slider">
            ${imagenes.map((img, i) => `
                <img
                    src="${img}"
                    class="img-fluid ${i === 0 ? 'activo' : ''}"
                    loading="lazy">
            `).join("")}
        </div>
    `;
}

//JS del carrusel
document.addEventListener("DOMContentLoaded",()=>{
    setInterval(()=>{
        document.querySelectorAll(".blz-slider").forEach(slider=>{
            const imgs=slider.querySelectorAll("img");
            if(imgs.length<=1) return;
            let actual=[...imgs].findIndex(i=>i.classList.contains("activo"));
            imgs[actual].classList.remove("activo");
            actual=(actual+1)%imgs.length;
            imgs[actual].classList.add("activo");
        });
    },4000);
});

