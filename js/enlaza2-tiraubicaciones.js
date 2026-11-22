// Variables globales de estado para recordar ambos filtros
let subcategoriaActual = "Todos";
let ubicacionActual = "Lugares";

// Diccionario por si en el JSON de anuncios usas siglas (ej. "CDLR") y en categorías el nombre completo
const equivalenciasUbicacion = {
  "Carmen de la Legua": ["Carmen de la Legua", "CDLR", "cdlr"],
  "Dulanto": ["Dulanto"],
  "Villa": ["Villa"]
};

/* CARGAR CATEGORIAS */
function cargarCategoria(categoria, { scroll = true, compacto = true } = {}) {
  const grupo = categorias.find(x => x.categoria === categoria);
  if (!grupo) return;

  // Reiniciamos los filtros al cambiar de categoría
  subcategoriaActual = "Todos";
  ubicacionActual = "Lugares";

  document.querySelectorAll("#contenedor-banners [data-categoria]").forEach(btn => {
    const activo = btn.dataset.categoria === categoria;
    btn.classList.toggle("is-active", activo);
    btn.setAttribute("aria-pressed", String(activo));
  });

  const botonActivo = document.querySelector("#contenedor-banners [data-categoria].is-active");
  if (scroll && botonActivo) {
    botonActivo.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  anunciosCategoriaActual = window.anunciosPorCategoria[categoria] || [];
  
  renderBadges(grupo);
  renderUbicaciones(grupo); // <-- Renderiza los botones de "Ubicado en"
  aplicarFiltrosCombinados(); // <-- Muestra los resultados iniciales

  document.getElementById("titulo-resultados").textContent = "Resultados para " + categoria;
  document.getElementById("resultados-bar").style.display = "block";
  document.getElementById("contenedor-banners").classList.toggle("modo-compacto", compacto);
}

/* RENDERIZAR UBICACIONES */
function renderUbicaciones(grupo) {
  const bar = document.getElementById("ubicaciones-bar");
  const contenedor = document.getElementById("ubicaciones-container");
  if (!bar || !contenedor) return;

  // Si la categoría no tiene ubicaciones definidas, ocultamos la barra
  if (!grupo.ubicado_en || grupo.ubicado_en.length === 0) {
    bar.style.display = "none";
    contenedor.innerHTML = "";
    return;
  }

  const coloresTemplate = {
    refer: "#4157d2", diwali: "#9A2E8F", candy: "#FF6FAE",
    festival: "#A767D9", practice: "#2F4A52", join: "#2e7550", strawberry: "#E61B56", vote: "#B88200"
  };
  const colorDinamico = coloresTemplate[grupo.template] || '#1e293b';

  const ubicaciones = [
    "Lugares",
    ...grupo.ubicado_en.filter(u => u.toLowerCase() !== "Lugares")
  ];

  contenedor.innerHTML = ubicaciones.map((ubi, index) => `
    <button type="button" 
            class="blz-ubi-chip ${index === 0 ? 'activo' : ''}" 
            data-ubicacion="${ubi}"
            style="--color-dinamico: ${colorDinamico};">
      ${ubi}
    </button>
  `).join("");

  bar.style.display = "flex";
}

/* EVENTO CLICK EN SUBCATEGORÍA Y UBICACIÓN */
document.addEventListener("click", function (e) {
  // 1. Click en Subcategoría
  const badgeSub = e.target.closest("[data-subcategoria]");
  if (badgeSub) {
    subcategoriaActual = badgeSub.dataset.subcategoria;
    document.querySelectorAll("#subcategorias-container .blz-badge").forEach(lbl => lbl.classList.remove("activo"));
    badgeSub.classList.add("activo");
    
    ejecutarFiltroConLoader();
    return;
  }

  // 2. Click en Ubicación
  const chipUbi = e.target.closest("[data-ubicacion]");
  if (chipUbi) {
    ubicacionActual = chipUbi.dataset.ubicacion;
    document.querySelectorAll("#ubicaciones-container .blz-ubi-chip").forEach(btn => btn.classList.remove("activo"));
    chipUbi.classList.add("activo");
    
    ejecutarFiltroConLoader();
  }
});

function ejecutarFiltroConLoader() {
  if (typeof ejecutarConLoader === 'function') {
    ejecutarConLoader(() => { aplicarFiltrosCombinados(); });
  } else {
    aplicarFiltrosCombinados();
  }
}

/* FILTRO COMBINADO (SUBCATEGORÍA + UBICACIÓN) */
function aplicarFiltrosCombinados() {
  const filtrados = anunciosCategoriaActual.filter(anuncio => {
    // Validar Subcategoría
    const cumpleSub = subcategoriaActual === "Todos" || (
      Array.isArray(anuncio.subcategory)
        ? anuncio.subcategory.includes(subcategoriaActual)
        : anuncio.subcategory === subcategoriaActual
    );

    // Validar Ubicación (soporta strings, arrays y abreviaturas como CDLR)
    let cumpleUbi = true;
    if (ubicacionActual !== "Lugares") {
      const valoresAceptados = equivalenciasUbicacion[ubicacionActual] || [ubicacionActual];
      if (Array.isArray(anuncio.ubicado_en)) {
        cumpleUbi = anuncio.ubicado_en.some(u => valoresAceptados.includes(u));
      } else {
        cumpleUbi = valoresAceptados.includes(anuncio.ubicado_en);
      }
    }

    return cumpleSub && cumpleUbi;
  });

  renderAnuncios(filtrados, subcategoriaActual);
}
