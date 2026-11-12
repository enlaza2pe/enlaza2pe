let anuncios = [];
let categorias = [];
let anunciosCategoriaActual = [];

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
  },

  vote: {
    clase: "cta-banner--vote",
    particulas: particulasVote()
  }

};

/* Cargar los cinco JSON de anuncios y el menú */
Promise.all([
  fetch("json/anuncios-alquileres.json").then(r => {
    if (!r.ok) throw new Error("Error cargando alquileres");
    return r.json();
  }),

  fetch("json/anuncios-deliverys.json").then(r => {
    if (!r.ok) throw new Error("Error cargando delivery");
    return r.json();
  }),

  fetch("json/anuncios-empleos.json").then(r => {
    if (!r.ok) throw new Error("Error cargando Empleos");
    return r.json();
  }),

  fetch("json/anuncios-serviciosgen.json").then(r => {
    if (!r.ok) throw new Error("Error cargando servicios");
    return r.json();
  }),

  fetch("json/anuncios-asesoresprofesional.json").then(r => {
    if (!r.ok) throw new Error("Error cargando promociones");
    return r.json();
  }),

  fetch("json/categorias-menu.json").then(r => {
    if (!r.ok) throw new Error("Error cargando categorías");
    return r.json();
  })
])
  .then(([
    anunciosAlq,
    anunciosDelivery,
    anunciosEmpleos,
    anunciosServicios, 
    anunciosAsesorias,
    categoriasData
  ]) => {

    /* Mantener todos los anuncios disponibles */
    anuncios = [
      ...anunciosAlq,
      ...anunciosDelivery,
      ...anunciosEmpleos,
      ...anunciosServicios,
      ...anunciosAsesorias 
    ];

    categorias = categoriasData;

    window.anunciosPorCategoria = {
      "Alquileres": anunciosAlq,
      "Envíos a domicilio": anunciosDelivery,
      "Empleos": anunciosEmpleos,
      "Servicios Generales": anunciosServicios,
      "Asesoría Profesional": anunciosAsesorias 
    };

    renderBanners();

    if (categorias.length > 0) {
      cargarCategoria(categorias[0].categoria, {
        scroll: false,
        compacto: false
      });
    }

  })
  .catch(error => {
    console.error("No se pudieron cargar los datos:", error);
  });

/** RENDERIZAR LA BARRA DE NAVEGACIÓN */
function crearBanner(grupo, esPrimero) {
  const tpl = templatesBanner[grupo.template];
  if (!tpl) {
    console.warn(
      `No existe el template "${grupo.template}" para ${grupo.categoria}`
    );
  }

  // Si es el 1° elemento renderizado de la lista, le inyectamos clase 'is-active' de entrada
  const claseActiva = esPrimero ? "is-active" : "";

  return `
    <a class="cta-banner ${tpl ? tpl.clase : ""} ${claseActiva}" 
       data-categoria="${grupo.categoria}" 
       aria-pressed="${esPrimero ? "true" : "false"}" 
       href="#" >
       ${tpl ? tpl.particulas : ""}
       <span class="cta-icon" aria-hidden="true">
         ${grupo.icono || ""}
       </span>
       <span class="cta-content">
         <span class="cta-title-row">
           <span class="cta-title">${grupo.categoria}</span>
         </span>
       </span>
    </a>
  `;
}

/*Banners configurados como sticky navbar en css*/
function renderBanners() {
  const contenedor = document.getElementById('contenedor-banners');
  if (!contenedor) return;

  // Renderizado limpio identificando el primer elemento activo
  contenedor.innerHTML = categorias
    .map((grupo, index) => crearBanner(grupo, index === 0))
    .join('');

  // ESCUCHADOR DE EVENTOS: Llama a cargarCategoria al hacer clic en un banner
  contenedor.querySelectorAll('.cta-banner').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // Evita que el # recargue o mueva la pantalla al tope
      const cat = this.dataset.categoria;
      cargarCategoria(cat);
    });
  });

  // EFECTO DE REBOTE AUTOMÁTICO (HINT ANIMATION) - Inicia al instante
  contenedor.scrollTo({ left: 650, behavior: 'smooth' });

  setTimeout(() => {
    contenedor.scrollTo({ left: 0, behavior: 'smooth' });
  }, 700);
}


/*   CLICK EN UNA CATEGORÍA */
document.addEventListener("click", function (e) {
  const btn = e.target.closest("#contenedor-banners [data-categoria]");
  if (!btn) return;
  e.preventDefault();
  const categoria = btn.dataset.categoria;
    // 1. Añadimos visualmente la clase compacta al contenedor inmediatamente
  const contenedor = document.getElementById('contenedor-banners');
  if (contenedor) {
    contenedor.classList.add('modo-compacto'); 
  }


  // Al hacer click de forma manual, pasa a cargarse con su diseño/clase compacta respectiva
  if (typeof ejecutarConLoader === 'function') {
    ejecutarConLoader(() => {
      cargarCategoria(categoria, { scroll: true, compacto: true });
    });
  } else {
    cargarCategoria(categoria, { scroll: true, compacto: true });
  }
 
});

/* CARGAR CATEGORIAS */
function cargarCategoria(categoria, { scroll = true, compacto = true } = {}) {
  const grupo = categorias.find(x => x.categoria === categoria);
  if (!grupo) return;

  document.querySelectorAll("#contenedor-banners [data-categoria]").forEach(btn => {
    const activo = btn.dataset.categoria === categoria;
    btn.classList.toggle("is-active", activo);
    btn.setAttribute("aria-pressed", String(activo));
  });

  const botonActivo = document.querySelector("#contenedor-banners [data-categoria].is-active");

  // AJUSTE UX: Desplaza el banner presionado hacia el centro visible del contenedor
  if (scroll && botonActivo) {
    botonActivo.scrollIntoView({
      behavior: "smooth",
      block: "nearest", // No altera el scroll vertical de la página entera
      inline: "center"  // <--- CLAVE: Centra el banner y revela los bordes de los vecinos
    });
  }

  anunciosCategoriaActual = window.anunciosPorCategoria[categoria] || [];
  renderBadges(grupo);
  renderAnuncios(anunciosCategoriaActual);

  document.getElementById("titulo-resultados").textContent = "Resultados para " + categoria;
  document.getElementById("resultados-bar").style.display = "block";
  document.getElementById("contenedor-banners").classList.toggle("modo-compacto", compacto);
}

function renderBadges(grupo) {
  const contenedor = document.getElementById("subcategorias-container");
  if (!contenedor) return;

  // 1. LIMPIEZA Y CONFIGURACIÓN DEL CONTENEDOR (UNA FILA CONTINUA)
  contenedor.innerHTML = "";
  contenedor.style.display = "flex";
  contenedor.style.gap = "6px";
  contenedor.style.width = "100%";
  contenedor.style.maxWidth = "100%";
  contenedor.style.boxSizing = "border-box";
  contenedor.style.overflowX = "auto";
  contenedor.style.webkitOverflowScrolling = "touch";

  const subcategorias = [
    "Todos",
    ...grupo.subcategory.filter(sub => sub.toLowerCase() !== "todos")
  ];

  const coloresTemplate = {
    refer: "#4157d2", diwali: "#9A2E8F", candy: "#FF6FAE",
    festival: "#A767D9", practice: "#2F4A52", join: "#2e7550", strawberry: "#E61B56", vote: "#B88200"
  };
  const colorBorde = coloresTemplate[grupo.template] || '#7C6FE8';

  // 2. RENDERIZADO EN UNA SOLA FILA DIRECTA (Eliminamos divisiones matemáticas)
  contenedor.innerHTML = subcategorias.map((sub, index) => {
    const id = `blz-radio-${index}`;
    return `
      <label class="blz-badge ${index === 0 ? 'activo' : ''}" 
             for="${id}" 
             data-subcategoria="${sub}" 
             style="--color-dinamico: ${colorBorde}; color: ${colorBorde}; display: inline-flex; align-items: center; padding: 4px 7px; border-radius: 10px; cursor: pointer; font-weight:700; white-space: nowrap; position: relative;">
        <input type="radio" id="${id}" name="blz-subcategoria" value="${sub}" ${index === 0 ? "checked" : ""}>
        <span class="blz-radio" style="border-color: ${colorBorde};"></span>
        <span class="blz-badge-text">${sub}</span>
      </label>
    `;
  }).join("");

  // 3. EFECTO DE REBOTE AUTOMÁTICO (HINT ANIMATION)
  setTimeout(() => {
    // Solo aplica el rebote si la fila realmente desborda el ancho de la pantalla móvil
    if (contenedor.scrollWidth > contenedor.clientWidth) {
      contenedor.scrollTo({ left: 400, behavior: "smooth" });

      setTimeout(() => {
        contenedor.scrollTo({ left: 0, behavior: "smooth" });
      }, 190);
    }
  }, 1000);
}


/* EVENT CLICK EN BADGE */
document.addEventListener("click", function (e) {
  const badge = e.target.closest("[data-subcategoria]");
  if (!badge) return;
  const subcategoria = badge.dataset.subcategoria;
  document.querySelectorAll("#subcategorias-container .blz-badge").forEach(lbl => lbl.classList.remove("activo"));
  badge.classList.add("activo");
  if (typeof ejecutarConLoader === 'function') {
    ejecutarConLoader(() => { filtrarSubcategoria(subcategoria); });
  } else {
    filtrarSubcategoria(subcategoria);
  }
});

/* FILTRAR SUBCATEGORIA */
function filtrarSubcategoria(subcategoria) {
  const filtrados = subcategoria === "Todos"
    ? anunciosCategoriaActual
    : anunciosCategoriaActual.filter(a => {
      // Si subcategory es un Array, busca si incluye la opción elegida
      if (Array.isArray(a.subcategory)) {
        return a.subcategory.includes(subcategoria);
      }
      // Si queda algún anuncio antiguo con texto plano simple, lo evalúa normalmente
      return a.subcategory === subcategoria;
    });

  renderAnuncios(filtrados, subcategoria);
  document.getElementById("titulo-resultados").textContent = "Resultados para: " + subcategoria;
}



/* RENDER ANUNCIOS */
function renderAnuncios(lista, subcategoria) {

  const contenedorTipo1 = document.getElementById("tipo1");

  if (!contenedorTipo1) return;

  contenedorTipo1.innerHTML = "";
  lista.forEach(a => {
    switch (a.tipoanuncio) {
      case 1:
        contenedorTipo1.innerHTML += diseño1(a, subcategoria);
        break;
    }
  });
}
 

/* RENDER PARTICULAS de BANNERS  */
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
