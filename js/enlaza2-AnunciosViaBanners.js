/* ========================================================
   BANNERS DESIGNS
========================================================= */

const templatesBanner = {
  refer: {
    clase: "cta-banner--refer",
    particulas: particulasRefer()
  },

  diwali: {
    clase: "cta-banner--diwali",
    particulas: particulasDiwali()
  },

  candy: {
    clase: "cta-banner--candy",
    particulas: particulasCandy()
  },

  festival: {
    clase: "cta-banner--festival",
    particulas: particulasFestival()
  },

  practice: {
    clase: "cta-banner--practice",
    particulas: particulasPractice()
  },

  join: {
    clase: "cta-banner--join",
    particulas: particulasJoin()
  },

  strawberry: {
    clase: "cta-banner--raspberry",
    particulas: particulasJoin()
  }

};

/* =========================================================
   Carga en paralelo los anuncios y el menú, luego procesa y renderiza las categorías.
========================================================= */
Promise.all([
  fetch("json/anuncios.json").then(r => r.json()),
  fetch("json/categorias-menu.json").then(r => r.json())
])
  .then(([anunciosData, categoriasData]) => {

    anuncios = anunciosData;
    categorias = categoriasData;

    renderBanners();

  });

/*======================================================
RENDER VISUAL DE BANNERS
=======================================================*/
function crearBanner(grupo) {
  const tpl = templatesBanner[grupo.template];
  return `
    <a class="cta-banner ${tpl.clase}" href="#" data-categoria="${grupo.categoria}">
      ${tpl.particulas}
      <div class="cta-content">
        <p class="cta-eyebrow">
           ${grupo.subcategory.join(" - ")}
        </p> 
        <div class="cta-title-row">
          <h2 class="cta-title">
            ${grupo.categoria}
          </h2> 
          <span class="cta-button">
            Seleccionar
          </span>
        </div>
      </div>
    </a>
  `;
}


function renderBanners() {

  const contenedor =
    document.getElementById("contenedor-banners");

  contenedor.innerHTML =
    categorias
      .map(grupo => crearBanner(grupo))
      .join("");
}

/* =========================================================
   EVENT CLICK EN BANNER
========================================================= */

document.addEventListener("click", function (e) {

  const btn = e.target.closest("[data-categoria]");

  if (!btn) return;

  e.preventDefault();

  const categoria = btn.dataset.categoria;

  /*cargarCategoria(categoria);*/
  ejecutarConLoader(() => {
    activarCategoria(); /*COMPACTAR INPUT AL CLICKEAR BANNER*/
    cargarCategoria(categoria);
  });
});

/* =========================================================
   CARGAR CATEGORIAS
========================================================= */

function cargarCategoria(categoria) {

  const grupo = categorias.find(x => x.categoria === categoria);

  if (!grupo) return;

  renderBadges(grupo);

  const anunciosFiltrados = anuncios.filter(a => grupo.subcategory.includes(a.subcategory));

  renderAnuncios(anunciosFiltrados);

  document.getElementById("titulo-resultados").textContent = "Resultados para: " + categoria;
  document.getElementById("resultados-bar").style.display = "block";
  document.getElementById("contenedor-banners").classList.add("modo-compacto");
  document.getElementById("resultados-bar").scrollIntoView({ behavior: "smooth" });
}

/* =========================================================
  RENDER BADGES
========================================================= */

function renderBadges(grupo) {

  const contenedor =
    document.getElementById(
      "subcategorias-container"
    );

  contenedor.innerHTML = "";

  grupo.subcategory.forEach(sub => {

    contenedor.innerHTML += `

      <button
        class="blz-badge"
        data-subcategoria="${sub}">
        ${sub}
      </button>
    `;
  });

}

/* =========================================================
  EVENT CLICK EN BADGE
========================================================= */

document.addEventListener("click", function (e) {

  const badge = e.target.closest("[data-subcategoria]");
  if (!badge) return;

  const subcategoria = badge.dataset.subcategoria;
  /*filtrarSubcategoria(subcategoria);*/
  ejecutarConLoader(() => {

    filtrarSubcategoria(subcategoria);
  });

});

/* =========================================================
  FILTRAR SUBCATEGORIA
========================================================= */

function filtrarSubcategoria(subcategoria) {



  const filtrados = anuncios.filter(a => a.subcategory === subcategoria);

  renderAnuncios(filtrados);

  document.getElementById("titulo-resultados").textContent = "Resultados para: " + subcategoria;
  document.getElementById("resultados-bar").style.display = "block";
  document.getElementById("contenedor-banners").classList.add("modo-compacto");

}

/* =========================================================
  BOTON X 
  ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-reset-resultados").addEventListener("click", activarHome); //funcion


});






/* =========================================================
  RENDER ANUNCIOS
========================================================= */

function renderAnuncios(lista) {

  document.getElementById("tipo1").innerHTML = "";

  lista.forEach(a => {

    switch (a.tipoanuncio) {

      case 1:
        document.getElementById("tipo1").innerHTML += diseño1(a);
        break;
    }
  });
}


/* =========================================================
  RENDER PARTICULAS de BANNERS
======================================================== */

function particulasRefer() {
  return `
    <span class="particles">
      <span class="particle" style="--x:8%;  --y:20%; --s:5px;  --o:.35; --d:6s;  --del:0s;"></span>
			<span class="particle" style="--x:18%; --y:70%; --s:4px;  --o:.25; --d:7s;  --del:.6s;"></span>
			<span class="particle" style="--x:28%; --y:35%; --s:6px;  --o:.3;  --d:5.5s;--del:1.1s;"></span>
			<span class="particle" style="--x:35%; --y:80%; --s:3px;  --o:.4;  --d:8s;  --del:.3s;"></span>
			<span class="particle" style="--x:46%; --y:15%; --s:5px;  --o:.3;  --d:6.5s;--del:1.6s;"></span>
			<span class="particle" style="--x:55%; --y:55%; --s:4px;  --o:.35; --d:7.2s;--del:.9s;"></span>
			<span class="particle" style="--x:64%; --y:25%; --s:6px;  --o:.25; --d:6.8s;--del:2s;"></span>
			<span class="particle" style="--x:70%; --y:75%; --s:3px;  --o:.35; --d:5.8s;--del:.2s;"></span>
			<span class="particle" style="--x:80%; --y:42%; --s:5px;  --o:.3;  --d:7.6s;--del:1.3s;"></span>
			<span class="particle" style="--x:88%; --y:18%; --s:4px;  --o:.3;  --d:6.2s;--del:.7s;"></span>
			<span class="particle" style="--x:92%; --y:68%; --s:5px;  --o:.28; --d:7s;  --del:1.9s;"></span>
			<span class="particle" style="--x:12%; --y:50%; --s:3px;  --o:.3;  --d:8.4s;--del:.5s;"></span>
			<span class="particle" style="--x:60%; --y:88%; --s:4px;  --o:.25; --d:6.6s;--del:1.4s;"></span>
			<span class="particle" style="--x:40%; --y:55%; --s:3px;  --o:.3;  --d:7.4s;--del:.1s;"></span>
    </span>
  `;
}

function particulasDiwali() {
  return `
    <span class="particles">
      <span class="particle particle--glow" style="--x:78%; --y:30%; --s:140px; --o:.5; --d:9s; --del:0s;"></span>
			<span class="particle particle--glow" style="--x:90%; --y:65%; --s:110px; --o:.45;--d:10s;--del:1.5s;"></span>
			<span class="particle particle--glow" style="--x:60%; --y:10%; --s:90px;  --o:.35;--d:8.5s;--del:.8s;"></span>
			<span class="particle particle--dot" style="--x:10%; --y:25%; --s:4px; --o:.5; --d:6s;  --del:0s;"></span>
			<span class="particle particle--dot" style="--x:20%; --y:65%; --s:3px; --o:.4; --d:7s;  --del:.4s;"></span>
			<span class="particle particle--dot" style="--x:32%; --y:40%; --s:5px; --o:.45;--d:5.5s;--del:1s;"></span>
			<span class="particle particle--dot" style="--x:42%; --y:75%; --s:3px; --o:.5; --d:8s;  --del:.2s;"></span>
			<span class="particle particle--dot" style="--x:50%; --y:20%; --s:4px; --o:.4; --d:6.4s;--del:1.4s;"></span>
			<span class="particle particle--dot" style="--x:15%; --y:85%; --s:3px; --o:.4; --d:7.6s;--del:.9s;"></span>
			<span class="particle particle--dot" style="--x:5%;  --y:55%; --s:4px; --o:.45;--d:6.8s;--del:1.7s;"></span>
			<span class="particle particle--dot" style="--x:38%; --y:12%; --s:3px; --o:.4; --d:7.2s;--del:.5s;"></span>
			<span class="particle particle--dot" style="--x:68%; --y:55%; --s:4px; --o:.5; --d:6s;  --del:1.1s;"></span>
			<span class="particle particle--dot" style="--x:82%; --y:88%; --s:3px; --o:.4; --d:8.2s;--del:.3s;"></span>
			<span class="particle particle--dot" style="--x:95%; --y:42%; --s:4px; --o:.45;--d:7s;  --del:1.6s;"></span>
    </span>
  `;
}

function particulasCandy() {
  return `
    <span class="particles">
      <span class="particle" style="--x:10%; --y:20%; --s:5px; --o:.4; --d:6s;  --del:0s;"></span>
			<span class="particle" style="--x:22%; --y:65%; --s:4px; --o:.3; --d:7s;  --del:.5s;"></span>
			<span class="particle" style="--x:30%; --y:30%; --s:6px; --o:.35;--d:5.5s;--del:1s;"></span>
			<span class="particle" style="--x:40%; --y:80%; --s:3px; --o:.4; --d:8s;  --del:.3s;"></span>
			<span class="particle" style="--x:50%; --y:15%; --s:5px; --o:.3; --d:6.5s;--del:1.5s;"></span>
			<span class="particle" style="--x:58%; --y:55%; --s:4px; --o:.4; --d:7.2s;--del:.8s;"></span>
			<span class="particle" style="--x:68%; --y:25%; --s:6px; --o:.3; --d:6.8s;--del:1.9s;"></span>
			<span class="particle" style="--x:75%; --y:75%; --s:3px; --o:.4; --d:5.8s;--del:.2s;"></span>
			<span class="particle" style="--x:85%; --y:40%; --s:5px; --o:.35;--d:7.6s;--del:1.2s;"></span>
			<span class="particle" style="--x:90%; --y:18%; --s:4px; --o:.35;--d:6.2s;--del:.6s;"></span>
			<span class="particle" style="--x:14%; --y:48%; --s:3px; --o:.4; --d:8.4s;--del:.4s;"></span>
			<span class="particle" style="--x:62%; --y:88%; --s:4px; --o:.3; --d:6.6s;--del:1.3s;"></span>
    </span>
  `;
}

function particulasFestival() {
  return `
    <span class="particles">
      <span class="particle particle--sparkle" style="--x:55%; --y:10%; --s:8px; --o:.8; --d:4s; --del:0s;"></span>
			<span class="particle particle--sparkle" style="--x:72%; --y:60%; --s:6px; --o:.7; --d:4.6s; --del:.8s;"></span>
			<span class="particle" style="--x:10%; --y:25%; --s:4px; --o:.4; --d:6s; --del:.2s;"></span>
			<span class="particle" style="--x:22%; --y:65%; --s:3px; --o:.35;--d:7s; --del:.6s;"></span>
			<span class="particle" style="--x:34%; --y:35%; --s:5px; --o:.4; --d:5.5s;--del:1s;"></span>
			<span class="particle" style="--x:45%; --y:80%; --s:3px; --o:.3; --d:8s; --del:.4s;"></span>
			<span class="particle" style="--x:62%; --y:20%; --s:4px; --o:.35;--d:6.5s;--del:1.3s;"></span>
			<span class="particle" style="--x:80%; --y:35%; --s:3px; --o:.3; --d:7.2s;--del:.9s;"></span>
			<span class="particle" style="--x:90%; --y:75%; --s:4px; --o:.35;--d:6.8s;--del:1.7s;"></span>
    </span>
  `;
}

function particulasPractice() {
  return `
    <span class="particles">
					<span class="particle particle--sparkle"
						style="--x:48%; --y:14%; --s:7px; --o:.6; --d:4.4s; --del:.3s;"></span>
					<span class="particle" style="--x:8%;  --y:30%; --s:4px; --o:.3; --d:6s;  --del:0s;"></span>
					<span class="particle" style="--x:18%; --y:70%; --s:3px; --o:.3; --d:7s;  --del:.5s;"></span>
					<span class="particle" style="--x:30%; --y:45%; --s:5px; --o:.3; --d:5.5s;--del:1s;"></span>
					<span class="particle" style="--x:42%; --y:60%; --s:3px; --o:.3; --d:8s;  --del:.3s;"></span>
					<span class="particle" style="--x:58%; --y:25%; --s:4px; --o:.3; --d:6.5s;--del:1.4s;"></span>
					<span class="particle" style="--x:68%; --y:55%; --s:3px; --o:.3; --d:7.2s;--del:.8s;"></span>
					<span class="particle" style="--x:85%; --y:30%; --s:4px; --o:.25;--d:6.8s;--del:1.6s;"></span>
    </span>
  `;
}

function particulasJoin() {
  return `
    <span class="particles">
      <span class="particle particle--sparkle" style="--x:52%; --y:12%; --s:7px; --o:.7; --d:4.2s; --del:0s;"></span>
			<span class="particle particle--sparkle" style="--x:30%; --y:70%; --s:6px; --o:.6; --d:4.8s; --del:1s;"></span>
			<span class="particle" style="--x:10%; --y:25%; --s:4px; --o:.35;--d:6s;  --del:.2s;"></span>
			<span class="particle" style="--x:22%; --y:55%; --s:3px; --o:.3; --d:7s;  --del:.6s;"></span>
			<span class="particle" style="--x:40%; --y:35%; --s:5px; --o:.35;--d:5.5s;--del:1.1s;"></span>
			<span class="particle" style="--x:62%; --y:65%; --s:3px; --o:.3; --d:8s;  --del:.4s;"></span>
			<span class="particle" style="--x:78%; --y:30%; --s:4px; --o:.3; --d:6.5s;--del:1.5s;"></span>
			<span class="particle" style="--x:90%; --y:70%; --s:3px; --o:.3; --d:7.2s;--del:.9s;"></span>
    </span>
  `;
}


function particulasVote() {
  return `
    <span class="particles">
      <span class="particle particle--sparkle" style="--x:50%; --y:10%; --s:7px; --o:.6; --d:4.4s; --del:.5s;"></span>
			<span class="particle" style="--x:8%;  --y:25%; --s:4px; --o:.35;--d:6s;  --del:0s;"></span>
			<span class="particle" style="--x:20%; --y:65%; --s:3px; --o:.3; --d:7s;  --del:.5s;"></span>
			<span class="particle" style="--x:32%; --y:40%; --s:5px; --o:.35;--d:5.5s;--del:1s;"></span>
			<span class="particle" style="--x:44%; --y:75%; --s:3px; --o:.3; --d:8s;  --del:.3s;"></span>
			<span class="particle" style="--x:60%; --y:25%; --s:4px; --o:.3; --d:6.5s;--del:1.3s;"></span>
			<span class="particle" style="--x:72%; --y:55%; --s:3px; --o:.3; --d:7.2s;--del:.8s;"></span>
			<span class="particle" style="--x:88%; --y:35%; --s:4px; --o:.3; --d:6.8s;--del:1.6s;"></span>
    </span>
  `;
}



/* =========================================================
   CARRUSEL HORIZONTAL CON SCROLL
========================================================= */

/*		<div class="blz-carrusel-wrapper">
            <span class="blz-carrusel-titulo"></span>
            <div class="blz-carrusel-container"> 
              <div id="carrusel-categorias" class="blz-carrusel"></div> 
              <div class="blz-carrusel-next" id="btnScroll">
                <img class="js-menu-toggle" src="icons/abajo-caterogorias.png">
              </div> 
              <div onclick="abrirCategorias()">
                <div class="blz-coral js-menu-toggle">Categorías</div>
              </div> 
            </div>
          </div>
        </div>

function construirCarruselCategorias(categorias) { 
}*/

/* =======================================
Helper iconos
=======================================*/
/*
function obtenerNombreIcono(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ñ", "n")
    .replaceAll(" ", "-")
    .replaceAll("/", "");
}*/