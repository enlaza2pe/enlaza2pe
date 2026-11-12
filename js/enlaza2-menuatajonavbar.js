/* ==========================================
   CLON BANNER + BADGES ATAJO
   Enlaza2.pe
========================================== */

(function () {

    const ID_CLON = "clon-banner-badges-atajo";

    let clonBanners;
    let clonBadges;
    let barraClon;

    // ======================================
    // 1. CREAR ESTRUCTURA DEL CLON
    // ======================================

    function crearEstructuraClon() {

        if (document.getElementById(ID_CLON)) return;

        barraClon = document.createElement("div");

        barraClon.id = ID_CLON;
        barraClon.setAttribute("aria-label", "Navegación rápida");
        barraClon.setAttribute("aria-hidden", "true");

        barraClon.innerHTML = `
            <div class="atajo-banners banners-wrap"></div>
            <div class="atajo-badges blz-badges-wrap"></div>
        `;

        document.body.appendChild(barraClon);

        clonBanners = barraClon.querySelector(".atajo-banners");
        clonBadges = barraClon.querySelector(".atajo-badges");
    }

    // ======================================
    // 2. CLONAR BANNERS ORIGINALES
    // ======================================

    function clonarBanners() {

        const originales = document.querySelectorAll(
            "#contenedor-banners .cta-banner"
        );

        if (!clonBanners) return;

        clonBanners.innerHTML = "";

        originales.forEach(original => {

            const clon = original.cloneNode(true);

            // Evitar identificadores duplicados
            clon.removeAttribute("id");

            clonBanners.appendChild(clon);

        });

    }

    // ======================================
    // 3. CLONAR BADGES ORIGINALES
    // ======================================

    function clonarBadges() {

        const originales = document.querySelectorAll(
            "#subcategorias-container .blz-badge"
        );

        if (!clonBadges) return;

        clonBadges.innerHTML = "";

        originales.forEach((original, index) => {

            const clon = original.cloneNode(true);

            const input = clon.querySelector("input");

            if (input) {

                // Evitar IDs y grupos de radio duplicados
                input.id = `atajo-radio-${index}`;
                input.name = `atajo-subcategoria-${index}`;
                input.removeAttribute("checked");
                input.checked = false;

            }

            clon.setAttribute("data-atajo", "true");

            clonBadges.appendChild(clon);

        });

    }

    // ======================================
    // 4. ACTUALIZAR ESTADOS ACTIVOS
    // ======================================

    function sincronizarClones() {

        if (!barraClon) return;

        // Sincronizar banners
        const bannersOriginales = document.querySelectorAll(
            "#contenedor-banners .cta-banner"
        );

        const bannersClonados = clonBanners.querySelectorAll(
            ".cta-banner"
        );

        bannersClonados.forEach(clon => {

            const original = [...bannersOriginales].find(
                item => item.dataset.categoria === clon.dataset.categoria
            );

            if (!original) return;

            clon.classList.toggle(
                "is-active",
                original.classList.contains("is-active")
            );

            clon.setAttribute(
                "aria-pressed",
                original.getAttribute("aria-pressed") || "false"
            );

        });

        // Sincronizar badges
        const badgesOriginales = document.querySelectorAll(
            "#subcategorias-container .blz-badge"
        );

        const badgesClonados = clonBadges.querySelectorAll(
            ".blz-badge"
        );

        badgesClonados.forEach(clon => {

            const original = [...badgesOriginales].find(
                item => item.dataset.subcategoria ===
                        clon.dataset.subcategoria
            );

            if (!original) return;

            clon.classList.toggle(
                "activo",
                original.classList.contains("activo")
            );

            const inputClon = clon.querySelector("input");
            const inputOriginal = original.querySelector("input");

            if (inputClon && inputOriginal) {
                inputClon.checked = inputOriginal.checked;
            }

        });

    }

    // ======================================
    // 5. REFRESCAR LOS CLONES
    // ======================================

    function actualizarClones() {

        clonarBanners();
        clonarBadges();
        sincronizarClones();

    }

    // ======================================
    // 6. VISIBILIDAD SEGÚN SCROLL
    // ======================================

    function controlarVisibilidad() {

        if (!barraClon) return;

        const limite = window.innerHeight * 0.75;

        const resultados = document.getElementById("resultados-bar");

        const hayResultados = resultados &&
            getComputedStyle(resultados).display !== "none";

        const mostrar =
            window.scrollY >= limite &&
            window.scrollY > 0 &&
            hayResultados;

        barraClon.classList.toggle("visible", mostrar);

        barraClon.setAttribute(
            "aria-hidden",
            String(!mostrar)
        );

    }

    // ======================================
    // 7. CLICK EN BANNER CLONADO
    // ======================================

    barraClonListener();

    function barraClonListener() {

        document.addEventListener("click", function (e) {

            const bannerClon = e.target.closest(
                `#${ID_CLON} .cta-banner`
            );

            if (!bannerClon) return;

            e.preventDefault();
            e.stopPropagation();

            const categoria = bannerClon.dataset.categoria;

            const original = document.querySelector(
                `#contenedor-banners .cta-banner[data-categoria="${CSS.escape(categoria)}"]`
            );

            if (!original) return;

            // Activar el banner original
            original.click();

            // Regresar al inicio absoluto
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }, true);

        // ==================================
        // 8. CLICK EN BADGE CLONADO
        // ==================================

        document.addEventListener("click", function (e) {

            const badgeClon = e.target.closest(
                `#${ID_CLON} .blz-badge`
            );

            if (!badgeClon) return;

            e.preventDefault();
            e.stopPropagation();

            const subcategoria = badgeClon.dataset.subcategoria;

            const originales = document.querySelectorAll(
                "#subcategorias-container .blz-badge"
            );

            const original = [...originales].find(
                item => item.dataset.subcategoria === subcategoria
            );

            if (!original) return;

            // Activar el badge original
            original.click();

            // Regresar al inicio absoluto
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }, true);

    }

    // ======================================
    // 9. OBSERVAR CAMBIOS EN LOS ORIGINALES
    // ======================================

    function observarOriginales() {

        const banners = document.getElementById(
            "contenedor-banners"
        );

        const badges = document.getElementById(
            "subcategorias-container"
        );

        const resultados = document.getElementById(
            "resultados-bar"
        );

        const observer = new MutationObserver(() => {

            actualizarClones();
            controlarVisibilidad();

        });

        if (banners) {
            observer.observe(banners, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["class", "aria-pressed"]
            });
        }

        if (badges) {
            observer.observe(badges, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["class", "checked"]
            });
        }

        if (resultados) {
            observer.observe(resultados, {
                attributes: true,
                attributeFilter: ["style", "class"]
            });
        }

    }

    // ======================================
    // 10. INICIALIZACIÓN
    // ======================================

    function iniciarClonAtajo() {

        crearEstructuraClon();

        actualizarClones();

        observarOriginales();

        window.addEventListener(
            "scroll",
            controlarVisibilidad,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            controlarVisibilidad
        );

        controlarVisibilidad();

    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarClonAtajo
        );

    } else {

        iniciarClonAtajo();

    }

})();