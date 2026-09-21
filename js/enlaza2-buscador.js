document.addEventListener("DOMContentLoaded", async () => {

    const searchInput = document.getElementById("search");
    const contenedorResultados = document.getElementById("tipo1");
    const tituloResultados = document.getElementById("titulo-resultados-buscador");
    const clearButton = document.getElementById("btn-clear-search");
    const barraResultados = document.querySelector(".resultados-bar-busqueda");
    const hero = document.getElementById("hero");

    const ANUNCIOS_POR_PAGINA = 6;

    let paginaActual = 1;
    let observerScroll = null;


    if (!searchInput || !contenedorResultados) {
        console.error("No se encontró #search o #tipo1.");
        return;
    }

    let anuncios = [];
    let miniSearch = null;

    // =====================================================
    // CONFIGURACIÓN
    // =====================================================

    const PALABRAS_IGNORADAS = new Set([
        "a", "al", "de", "del", "el", "la", "las", "los",
        "en", "para", "por", "con", "sin", "y", "o",
        "un", "una", "unos", "unas", "que", "se",
        "mi", "tu", "su"
    ]);

    const ANUNCIOS_POR_CARGA = 6;

    let resultadosBusqueda = [];
    let cantidadMostrada = 0;

    // =====================================================
    // NORMALIZAR TEXTO
    // =====================================================

    function normalizarTexto(texto) {

        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}\s]/gu, " ")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trim();

    }

    // =====================================================
    // NORMALIZAR SINGULAR / PLURAL
    // =====================================================

    function normalizarSingular(palabra) {

        if (palabra.length <= 4) {
            return palabra;
        }

        if (palabra.endsWith("es")) {
            return palabra.slice(0, -2);
        }

        if (palabra.endsWith("s")) {
            return palabra.slice(0, -1);
        }

        return palabra;

    }

    // =====================================================
    // OBTENER TÉRMINOS DE BÚSQUEDA
    // =====================================================

    function obtenerTerminos(texto) {

        const normalizado = normalizarTexto(texto);

        if (!normalizado) {
            return [];
        }

        return normalizado
            .split(/\s+/)
            .filter(Boolean)

            // IMPORTANTE:
            // ahora permitimos palabras de 1 carácter
            .filter(palabra => palabra.length > 0)

            .filter(palabra =>
                !PALABRAS_IGNORADAS.has(palabra)
            )

            .map(normalizarSingular);

    }

    // =====================================================
    // OBTENER TÉRMINOS DE BÚSQUEDA 2
    // =====================================================


    function obtenerTerminosBusqueda(texto) {

        const normalizado =
            normalizarTexto(texto);

        if (!normalizado) {
            return [];
        }

        return normalizado
            .split(/\s+/)
            .filter(Boolean);

    }

    // =====================================================
    // CARGAR ANUNCIOS
    // =====================================================

    try {

        const respuesta =
            await fetch("json/anuncios.json");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar anuncios.json"
            );
        }

        anuncios = await respuesta.json();

    } catch (error) {

        console.error(
            "Error cargando anuncios.json:",
            error
        );

        return;
    }

    // =====================================================
    // PREPARAR DOCUMENTOS
    // =====================================================

    const documentos = anuncios.map(anuncio => {

        const keywordsOriginales =
            anuncio.keywords || "";

        const keywordsNormalizadas =
            normalizarTexto(keywordsOriginales);

        return {

            ...anuncio,

            id: String(anuncio.idanuncio),

            keywordsBusqueda:
                keywordsNormalizadas

        };

    });

    // =====================================================
    // CREAR MINISEARCH
    // =====================================================

    miniSearch = new MiniSearch({

        fields: [
            "keywordsBusqueda"
        ],

        storeFields: [
            "idanuncio",
            "subcategory",
            "keywords",
            "web",
            "featured",
            "titulo",
            "descripcion",
            "imagenes",
            "tipoanuncio",
            "creado"
        ],

        processTerm: term => {

            return normalizarTexto(term);

        }

    });

    miniSearch.addAll(documentos);

    /*console.log(
        "MiniSearch listo:",
        anuncios.length,
        "anuncios indexados."
    );
*/



    // =====================================================
    // BUSQUEDA EN TIEMPO REAL
    // =====================================================

    let temporizadorBusqueda = null;

    /* searchInput.addEventListener(
         "input",
         function () {
 
             // Mostrar / ocultar X
             if (clearButton) {
 
                 clearButton.style.display =
                     searchInput.value.trim()
                         ? "flex"
                         : "none";
 
             }
 
             clearTimeout(
                 temporizadorBusqueda
             );
 
             temporizadorBusqueda =
                 setTimeout(() => {
 
                     ejecutarBusqueda(
                         searchInput.value
                     );
 
                 }, 120);
 
         }
     );*/

    // =====================================================
    // LISTENER BUSCADOR
    // =====================================================

    searchInput.addEventListener(
        "input",
        function () {

            const tieneTexto =
                searchInput.value.trim().length > 0;


            // -------------------------------------------
            // BOTÓN X
            // -------------------------------------------

            if (clearButton) {

                clearButton.style.display =
                    tieneTexto
                        ? "flex"
                        : "none";

            }


            // -------------------------------------------
            // ACTIVAR / DESACTIVAR MODO BÚSQUEDA
            // -------------------------------------------

            if (hero) {

                hero.classList.toggle(
                    "busqueda-activa",
                    tieneTexto
                );

            }


            // -------------------------------------------
            // DEBOUNCE
            // -------------------------------------------

            clearTimeout(
                temporizadorBusqueda
            );

            temporizadorBusqueda =
                setTimeout(() => {

                    ejecutarBusqueda(
                        searchInput.value
                    );

                }, 120);

        }
    );


    // =====================================================
    // EJECUTAR BÚSQUEDA
    // =====================================================

    function ejecutarBusqueda(texto) {

        const textoOriginal =
            texto.trim();

        const terminos =
            obtenerTerminosBusqueda(textoOriginal);

        // ---------------------------------------------
        // INPUT VACÍO
        // ---------------------------------------------

        if (!textoOriginal || terminos.length === 0) {

            restaurarEstadoNormal();

            return;
        }

        // ---------------------------------------------
        // ACTIVAR ESTADO DE BÚSQUEDA
        // ---------------------------------------------

        activarEstadoBusqueda();

        // ---------------------------------------------
        // CONSULTA
        // ---------------------------------------------

        const consulta =
            terminos.join(" ");

        const resultados =
            miniSearch.search(
                consulta,
                {
                    combineWith: "AND",

                    // IMPORTANTE
                    // Permite buscar:
                    // c
                    // ch
                    // chi
                    // chif
                    // chifa
                    prefix: true,

                    fuzzy: false
                }
            );

        console.log(
            "Búsqueda:",
            textoOriginal,
            "Términos:",
            terminos,
            "Resultados:",
            resultados.length
        );

        // ---------------------------------------------
        // CONVERTIR RESULTADOS A ANUNCIOS
        // ---------------------------------------------

        resultadosBusqueda =
            resultados
                .map(resultado => {

                    return anuncios.find(
                        anuncio =>
                            String(
                                anuncio.idanuncio
                            ) ===
                            String(
                                resultado.id
                            )
                    );

                })
                .filter(Boolean);

        // ---------------------------------------------
        // ALEATORIZAR
        // ---------------------------------------------

        resultadosBusqueda =
            mezclarAleatoriamente(
                resultadosBusqueda
            );

        // ---------------------------------------------
        // REINICIAR PAGINACIÓN
        // ---------------------------------------------

        cantidadMostrada = 0;

        // ---------------------------------------------
        // TÍTULO
        // ---------------------------------------------

        actualizarTituloResultados(
            textoOriginal,
            resultadosBusqueda.length
        );

        // ---------------------------------------------
        // RENDERIZAR
        // ---------------------------------------------

        renderizarResultados();

    }

    // =====================================================
    // RENDERIZAR RESULTADOS
    // =====================================================

    function renderizarResultados() {

        contenedorResultados.innerHTML = "";

        paginaActual = 1;

        if (!resultadosBusqueda.length) {

            contenedorResultados.innerHTML = `
            <div class="col-12">
                <div class="blz-sin-resultados">

                    <i class="bi bi-search"></i>

                    <h4>No encontramos anuncios</h4>

                    <p>
                        Prueba con otras palabras.
                    </p>

                </div>
            </div>
        `;

            detenerScrollAutomatico();

            return;
        }

        mostrarPaginaResultados(1);

        prepararScrollAutomatico();
    }

    function mostrarPaginaResultados(numeroPagina) {

        const inicio =
            (numeroPagina - 1) *
            ANUNCIOS_POR_PAGINA;

        const fin =
            inicio +
            ANUNCIOS_POR_PAGINA;

        const anunciosPagina =
            resultadosBusqueda.slice(
                inicio,
                fin
            );

        if (!anunciosPagina.length) {
            return;
        }

        if (numeroPagina > 1) {

            const separador =
                document.createElement("div");

            separador.className =
                "col-12 blz-pagina-separador";

            separador.innerHTML = `
            <div class="blz-pagina-titulo">
                Página ${numeroPagina}
            </div>
        `;

            contenedorResultados.appendChild(
                separador
            );
        }


        // -----------------------------------------------
        // Renderizar anuncios
        // -----------------------------------------------

        anunciosPagina.forEach(anuncio => {

            const palabrasCoincidentes =
                obtenerCoincidencias(
                    anuncio.keywords,
                    searchInput.value
                );

            contenedorResultados.insertAdjacentHTML(
                "beforeend",
                crearCardBusqueda(
                    anuncio,
                    palabrasCoincidentes
                )
            );

        });


        paginaActual = numeroPagina;
    }

    // -----------------------------------------------
    // Separador / título de página
    // -----------------------------------------------
    /*
        const separador = document.createElement("div");
    
        separador.className =
            "col-12 blz-pagina-separador";
    
        separador.innerHTML = `
            <div class="blz-pagina-titulo">
                Página ${numeroPagina}
            </div>
        `;
    
        contenedorResultados.appendChild(
            separador
        );
    
    
        // -----------------------------------------------
        // Anuncios
        // -----------------------------------------------
    
        anunciosPagina.forEach(anuncio => {
    
            const palabrasCoincidentes =
                obtenerCoincidencias(
                    anuncio.keywords,
                    searchInput.value
                );
    
            const html =
                crearCardBusqueda(
                    anuncio,
                    palabrasCoincidentes
                );
    
            contenedorResultados.insertAdjacentHTML(
                "beforeend",
                html
            );
    
        });
    
    
        paginaActual = numeroPagina;
    }*/



    function prepararScrollAutomatico() {

        detenerScrollAutomatico();

        const totalPaginas =
            Math.ceil(
                resultadosBusqueda.length /
                ANUNCIOS_POR_PAGINA
            );

        if (totalPaginas <= 1) {
            return;
        }


        const sentinel =
            document.createElement("div");

        sentinel.id =
            "blz-scroll-sentinel";

        sentinel.className =
            "blz-scroll-sentinel";

        contenedorResultados.appendChild(
            sentinel
        );


        observerScroll =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const siguientePagina =
                            paginaActual + 1;


                        if (
                            siguientePagina >
                            totalPaginas
                        ) {

                            detenerScrollAutomatico();

                            return;
                        }


                        // Quitar sentinel actual
                        sentinel.remove();


                        // Mostrar siguiente página
                        mostrarPaginaResultados(
                            siguientePagina
                        );


                        // Crear nuevo sentinel
                        prepararScrollAutomatico();

                    });

                },
                {
                    root: null,

                    rootMargin:
                        "0px 0px 250px 0px",

                    threshold: 0
                }
            );


        observerScroll.observe(
            sentinel
        );
    }

    // ---------------------------------
    //    SCROLL AUTOMATICO
    // ---------------------------------


    function prepararScrollAutomatico() {

        detenerScrollAutomatico();

        const totalPaginas =
            Math.ceil(
                resultadosBusqueda.length /
                ANUNCIOS_POR_PAGINA
            );

        if (totalPaginas <= 1) {
            return;
        }


        const sentinel =
            document.createElement("div");

        sentinel.id =
            "blz-scroll-sentinel";

        sentinel.className =
            "blz-scroll-sentinel";

        contenedorResultados.appendChild(
            sentinel
        );


        observerScroll =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const siguientePagina =
                            paginaActual + 1;


                        if (
                            siguientePagina >
                            totalPaginas
                        ) {

                            detenerScrollAutomatico();

                            return;
                        }


                        // Quitar sentinel actual
                        sentinel.remove();


                        // Mostrar siguiente página
                        mostrarPaginaResultados(
                            siguientePagina
                        );


                        // Crear nuevo sentinel
                        prepararScrollAutomatico();

                    });

                },
                {
                    root: null,

                    rootMargin:
                        "0px 0px 250px 0px",

                    threshold: 0
                }
            );


        observerScroll.observe(
            sentinel
        );
    }


    function detenerScrollAutomatico() {

        if (observerScroll) {

            observerScroll.disconnect();

            observerScroll = null;

        }

        const sentinel =
            document.getElementById(
                "blz-scroll-sentinel"
            );

        if (sentinel) {
            sentinel.remove();
        }
    }


    /* =====================================================
   OBTENER KEYWORDS COINCIDENTES
===================================================== */

    function obtenerCoincidencias(
        keywords,
        textoBuscado
    ) {

        const consulta =
            normalizarTexto(textoBuscado);

        if (!consulta) {
            return [];
        }


        // ================================================
        // TEXTO BUSCADO
        // ================================================

        const terminosBusqueda =
            consulta
                .split(/\s+/)
                .filter(Boolean);


        if (!terminosBusqueda.length) {
            return [];
        }


        // ================================================
        // KEYWORDS DEL JSON
        //
        // Ejemplo:
        //
        // "mudanza flete transporte carga muebles"
        //
        // se convierte en:
        //
        // ["mudanza", "flete", "transporte",
        //  "carga", "muebles"]
        // ================================================

        const palabrasOriginales =
            String(keywords ?? "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        const resultado = [];


        // ================================================
        // COMPARAR CADA KEYWORD
        // ================================================

        palabrasOriginales.forEach(
            palabraOriginal => {

                const palabraNormalizada =
                    normalizarTexto(
                        palabraOriginal
                    );


                // ============================================
                // ¿LA KEYWORD CONTIENE LO QUE ESCRIBIÓ?
                //
                // c     → camion
                // co    → camion
                // con   → construccion
                // mud   → mudanza
                // ============================================

                const coincide =
                    terminosBusqueda.every(
                        termino =>
                            palabraNormalizada.includes(
                                termino
                            )
                    );


                if (
                    coincide &&
                    !resultado.includes(
                        palabraOriginal
                    )
                ) {

                    resultado.push(
                        palabraOriginal
                    );

                }

            }
        );


        return resultado;

    }

    // =====================================================
    // CARD
    // =====================================================

    /* function crearCardBusqueda(
         anuncio,
         palabrasCoincidentes
     ) {
 
         return diseño1(
             anuncio,
             palabrasCoincidentes
         );
 
     }*/

    function crearCardBusqueda(
        anuncio,
        palabrasCoincidentes
    ) {

        if (Number(anuncio.tipoanuncio) === 2) {

            return diseño2(
                anuncio,
                palabrasCoincidentes
            );

        }

        return diseño1(
            anuncio,
            palabrasCoincidentes
        );

    }

    // =====================================================
    // MEZCLAR ALEATORIAMENTE
    // Fisher-Yates
    // =====================================================

    function mezclarAleatoriamente(array) {

        const copia =
            [...array];

        for (
            let i = copia.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                copia[i],
                copia[j]
            ] = [
                    copia[j],
                    copia[i]
                ];

        }

        return copia;

    }

    // =====================================================
    // TÍTULO DE RESULTADOS
    // =====================================================

    function actualizarTituloResultados(
        texto,
        cantidad
    ) {

        if (
            !tituloResultados ||
            !barraResultados
        ) {
            return;
        }

        tituloResultados.innerHTML = `
        <strong>${cantidad}</strong>
        ${cantidad === 1
                ? "anuncio encontrado"
                : "anuncios encontrados"}
        para
        <strong>"${escaparHTML(texto)}"</strong>
    `;

        barraResultados.style.display =
            "block";


    }

    // =====================================================
    // RESTAURAR ESTADO NORMAL
    // =====================================================

    function restaurarEstadoNormal() {

        resultadosBusqueda = [];

        cantidadMostrada = 0;

        contenedorResultados.innerHTML = "";

        if (tituloResultados) {
            tituloResultados.innerHTML = "";
        }

        if (barraResultados) {
            barraResultados.style.display = "none";
        }

        restaurarEstadoHero();

        if (
            typeof mostrarCategoriasInicio ===
            "function"
        ) {

            mostrarCategoriasInicio();

        }

    }

    // =====================================================
    // ACTIVAR ESTADO DE BÚSQUEDA
    // =====================================================

    function activarEstadoBusqueda() {

        const app =
            document.getElementById("app");

        const hero =
            document.getElementById("hero");

        if (app) {

            app.classList.add(
                "estado-busqueda"
            );

            app.classList.remove(
                "estado-home"
            );

        }

        if (hero) {

            hero.classList.add(
                "hero-buscando"
            );

        }

    }

    // =====================================================
    // RESTAURAR HERO
    // =====================================================

    function restaurarEstadoHero() {

        const app =
            document.getElementById("app");

        const hero =
            document.getElementById("hero");

        if (app) {

            app.classList.remove(
                "estado-busqueda"
            );

            app.classList.add(
                "estado-home"
            );

        }

        if (hero) {

            hero.classList.remove(
                "hero-buscando"
            );

        }

    }

    // =====================================================
    // LISTENER BOTÓN X
    // =====================================================

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                // -----------------------------------------
                // LIMPIAR INPUT
                // -----------------------------------------

                searchInput.value = "";


                // -----------------------------------------
                // OCULTAR X
                // -----------------------------------------

                clearButton.style.display = "none";


                // -----------------------------------------
                // RESTAURAR HERO
                // -----------------------------------------

                if (hero) {

                    hero.classList.remove(
                        "busqueda-activa"
                    );

                }


                // -----------------------------------------
                // OCULTAR SUGERENCIAS
                // -----------------------------------------

                const suggestions =
                    document.getElementById(
                        "suggestions"
                    );

                if (suggestions) {

                    suggestions.style.display =
                        "none";

                }


                // -----------------------------------------
                // RESTAURAR ESTADO NORMAL
                // -----------------------------------------

                restaurarEstadoNormal();


                // -----------------------------------------
                // DEVOLVER FOCO
                // -----------------------------------------

                searchInput.focus();

            }
        );

    }

});


//agregado:

/* =====================================================
    ESCAPAR HTML (FUNCIONA)
 ===================================================== */

function escaparHTML(valor) {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =====================================================
   BOTÓN MINI BUSCAR 
===================================================== */

function irABuscador() {
    const input = document.getElementById("search");
    if (!input) return;
    input.focus();//   1. activar teclado inmediatamente
    input.select();//   2. opcional: seleccionar texto (UX)
    input.scrollIntoView({//   3. luego hacer scroll suave
        behavior: "smooth",
        block: "center"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const cta = document.getElementById("hero");
    const mini = document.getElementById("miniBuscador");
    if (!cta || !mini) return;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mini.classList.add("oculto");
                } else {
                    mini.classList.remove("oculto");
                }
            });
        },
        {
            threshold: 0.4
        }
    );
    observer.observe(cta);
});


//variable automática para altura de nav

function actualizarAlturaNav() {

    const nav =
        document.querySelector(
            ".site-nav"
        );

    if (!nav) {
        return;
    }

    const altura =
        nav.offsetHeight-15;

    document.documentElement.style
        .setProperty(
            "--nav-height",
            `${altura}px`
        );
}


window.addEventListener(
    "load",
    actualizarAlturaNav
);

window.addEventListener(
    "resize",
    actualizarAlturaNav
);


document.getElementById("btn-search").addEventListener("click", function (e) {
    e.preventDefault();

    const searchInput = document.getElementById("search");

    searchInput.blur();
});