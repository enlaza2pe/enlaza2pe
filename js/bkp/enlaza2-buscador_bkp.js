document.addEventListener("DOMContentLoaded", async () => {

    const searchInput = document.getElementById("search");
    const contenedorResultados = document.getElementById("tipo1");

    if (!searchInput || !contenedorResultados) {
        console.error("No se encontró #search o #tipo1.");
        return;
    }

    let anuncios = [];
    let miniSearch = null;

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const PALABRAS_IGNORADAS = new Set([
        "a", "al", "de", "del", "el", "la", "las", "los",
        "en", "para", "por", "con", "sin", "y", "o",
        "un", "una", "unos", "unas", "que", "se",
        "mi", "tu", "su"
    ]);

    /* =====================================================
        NORMALIZAR TEXTO ("LIMPIAR CONSULTA")
    ===================================================== */
    function normalizarTexto(texto) {
        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}\s]/gu, " ")
            .replace(/\s+/g, " ")
            .replace(/[^\w\s]/g, " ")
            .toLowerCase()
            .trim();
    }


    /* =====================================================
       NORMALIZAR PALABRAS  (FUNCIONA)
    ===================================================== */

    function obtenerTerminos(texto) {
        const normalizado = normalizarTexto(texto);
        if (!normalizado) {
            return [];
        }

        return normalizado
            .split(" ")
            .filter(Boolean)
            .filter(palabra => palabra.length > 1)
            .filter(palabra =>
                !PALABRAS_IGNORADAS.has(palabra)
            )
            .map(normalizarSingular);
    }

    /* =====================================================
       SINGULAR / PLURAL
       Normalización sencilla para búsquedas comunes  (FUNCIONA)
    ===================================================== */

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

    /* =====================================================
       CARGAR ANUNCIOS  (FUNCIONA)
    ===================================================== */

    try {
        const respuesta = await fetch("json/anuncios.json");
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

    /* =====================================================
       PREPARAR DOCUMENTOS PARA MINISEARCH (FUNCIONA)
    ===================================================== */

    const documentos = anuncios.map(anuncio => {

        const keywordsOriginales =
            anuncio.keywords || "";

        const keywordsNormalizadas =
            obtenerTerminos(keywordsOriginales).join(" ");

        return {
            ...anuncio,
            id: String(anuncio.idanuncio),
            keywordsBusqueda: keywordsNormalizadas
        };

    });

    /* =====================================================
       CREAR INDICE MINISEARCH (FUNCIONA)
    ===================================================== */

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

            const normalizado = normalizarTexto(term);

            return normalizarSingular(normalizado);
        }
    });

    miniSearch.addAll(documentos);

    console.log("MiniSearch listo:", anuncios.length, "anuncios indexados.");
    /* =====================================================
       DEBOUNCE (FUNCIONA)
    ===================================================== */

    let temporizadorBusqueda = null;

    searchInput.addEventListener(
        "input",
        function () {
            clearTimeout(
                temporizadorBusqueda
            );

            temporizadorBusqueda =
                setTimeout(() => {
                    ejecutarBusqueda(
                        searchInput.value
                    );

                }, 180);

        }
    );

    /* =====================================================
      BUSQUEDA (FUNCIONA)
   ===================================================== */

    function ejecutarBusqueda(texto) {
        const terminos =
            obtenerTerminos(texto);

        /* =================================================  
           CAMPO VACIO → RESTAURAR ESTADO NORMAL
        ================================================= */

        if (terminos.length === 0) {
            restaurarEstadoNormal();
            return;
        }

        const consulta =
            terminos.join(" ");

        const resultados =
            miniSearch.search(
                consulta,
                {
                    combineWith: "AND",
                    prefix: false,
                    fuzzy: false
                }
            );

        console.log(
            "Búsqueda:",
            terminos,
            "Resultados:",
            resultados.length
        );

        renderizarResultados(
            resultados,
            terminos
        );
    }

    /* =====================================================
       RENDERIZAR RESULTADOS (FUNCIONA)
    ===================================================== */

    function renderizarResultados(
        resultados,
        terminosBuscados
    ) {

        contenedorResultados.innerHTML = "";

        if (!resultados.length) {

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

            return;
        } 


        resultados.forEach(resultado => {

            const anuncio =
                anuncios.find(
                    item =>
                        String(item.idanuncio) ===
                        String(resultado.id)
                );

            if (!anuncio) {
                return;
            }

            const palabrasCoincidentes =
                obtenerCoincidencias(
                    anuncio.keywords,
                    terminosBuscados
                );

            const card =
                crearCardBusqueda(
                    anuncio,
                    palabrasCoincidentes
                );

            contenedorResultados.insertAdjacentHTML(
                "beforeend",
                card
            );

        });

    }

    /* =====================================================
       ENCONTRAR KEYWORDS COINCIDENTES (FUNCIONA)
    ===================================================== */

    function obtenerCoincidencias(
        keywords,
        terminosBuscados
    ) {
        const keywordsNormalizadas =
            obtenerTerminos(keywords);

        return terminosBuscados.filter(
            termino =>
                keywordsNormalizadas.includes(
                    termino
                )
        );

    }

    /* =====================================================
       CARD DE RESULTADO
       AQUÍ CONSERVAMOS LA INFORMACIÓN DEL ANUNCIO      (FUNCIONA)
    ===================================================== */

    function crearCardBusqueda(a, palabrasCoincidentes) {
        return diseño1(a, palabrasCoincidentes);
    }

    /* =====================================================
       RESTAURAR ESTADO NORMAL (FUNCIONA)
    ===================================================== */

    function restaurarEstadoNormal() {
        contenedorResultados.innerHTML = "";

        /*
         * IMPORTANTE: Aquí NO hacemos otra búsqueda.
         * Si tu sistema actual tiene una función que
         * vuelve a pintar las categorías/anuncios iniciales,
         * se llama aquí.
         * */

        if (typeof mostrarCategoriasInicio === "function") {
            mostrarCategoriasInicio();
        }
    }
});

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
   BOTON X (LIMPIAR INPUT)
===================================================== */
const input = document.getElementById("search");
const clear = document.getElementById("btn-clear-search");
input.addEventListener("input", () => {
    activarBusqueda();
    if (!input) {
        activarHome();
        return;
    }
    clear.style.display = input.value.trim() ? "flex" : "none";
});

clear.addEventListener("click", () => {
    input.value = "";
    clear.style.display = "none";
    document.getElementById("suggestions").style.display = "none";
    input.focus();
    input.select();
});


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