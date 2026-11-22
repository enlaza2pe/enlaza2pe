/* === ATAJO: CLON BANNER + BADGES + UBICACIONES === */
(function() {
	const ID_CLON = "clon-banner-badges-atajo";
	let clonBanners;
	let clonBadges;
	let clonUbicacionesWrap;
	let clonUbicaciones;
	let barraClon;
	let estabaVisible = false;
	// 1. CREAR ESTRUCTURA DEL CLON
	function crearEstructuraClon() {
		if (document.getElementById(ID_CLON)) return;
		barraClon = document.createElement("div");
		barraClon.id = ID_CLON;
		barraClon.setAttribute("aria-label", "Navegación rápida");
		barraClon.setAttribute("aria-hidden", "true");
		barraClon.innerHTML = `
      <div class="atajo-banners banners-wrap"></div>
      <div class="atajo-badges blz-badges-wrap"></div>
      <div class="atajo-ubicaciones-bar" style="display: none;">
        <!--<span class="ubicaciones-label">En:</span>-->
        <div class="atajo-ubicaciones blz-ubicaciones-wrap"></div>
      </div>
    `;
		document.body.appendChild(barraClon);
		clonBanners = barraClon.querySelector(".atajo-banners");
		clonBadges = barraClon.querySelector(".atajo-badges");
		clonUbicacionesWrap = barraClon.querySelector(".atajo-ubicaciones-bar");
		clonUbicaciones = barraClon.querySelector(".atajo-ubicaciones");
	}
	// 2. CLONAR BANNERS ORIGINALES
	function clonarBanners() {
		const originales = document.querySelectorAll("#contenedor-banners .cta-banner");
		if (!clonBanners) return;
		clonBanners.innerHTML = "";
		originales.forEach(original => {
			const clon = original.cloneNode(true);
			clon.removeAttribute("id");
			clonBanners.appendChild(clon);
		});
	}
	// 3. CLONAR BADGES ORIGINALES (SUBCATEGORÍAS)
	function clonarBadges() {
		const originales = document.querySelectorAll("#subcategorias-container .blz-badge");
		if (!clonBadges) return;
		clonBadges.innerHTML = "";
		originales.forEach((original, index) => {
			const clon = original.cloneNode(true);
			const input = clon.querySelector("input");
			if (input) {
				input.id = `atajo-radio-${index}`;
				input.name = `atajo-subcategoria-${index}`;
				input.removeAttribute("checked");
				input.checked = false;
			}
			clon.setAttribute("data-atajo", "true");
			clonBadges.appendChild(clon);
		});
	}
	// 3.5. CLONAR CHIPS DE UBICACIÓN ORIGINALES
	function clonarUbicaciones() {
		const originales = document.querySelectorAll("#ubicaciones-container .blz-ubi-chip");
		const barOriginal = document.getElementById("ubicaciones-bar");
		if (!clonUbicaciones || !clonUbicacionesWrap) return;
		clonUbicaciones.innerHTML = "";
		// Si la categoría actual no tiene ubicaciones o la barra original está oculta, ocultamos la fila en el atajo
		const barOculta = !barOriginal || getComputedStyle(barOriginal).display === "none";
		if (originales.length === 0 || barOculta) {
			clonUbicacionesWrap.style.display = "none";
			return;
		}
		clonUbicacionesWrap.style.display = "flex";
		originales.forEach(original => {
			const clon = original.cloneNode(true);
			clon.removeAttribute("id");
			clon.setAttribute("data-atajo-ubi", "true");
			clonUbicaciones.appendChild(clon);
		});
	}
	// 4. ACTUALIZAR ESTADOS ACTIVOS
	function sincronizarClones() {
		if (!barraClon) return;
		// Sincronizar banners
		const bannersOriginales = document.querySelectorAll("#contenedor-banners .cta-banner");
		const bannersClonados = clonBanners.querySelectorAll(".cta-banner");
		bannersClonados.forEach(clon => {
			const original = [...bannersOriginales].find(item => item.dataset.categoria === clon.dataset.categoria);
			if (!original) return;
			clon.classList.toggle("is-active", original.classList.contains("is-active"));
			clon.setAttribute("aria-pressed", original.getAttribute("aria-pressed") || "false");
		});
		// Sincronizar badges (subcategorías)
		const badgesOriginales = document.querySelectorAll("#subcategorias-container .blz-badge");
		const badgesClonados = clonBadges.querySelectorAll(".blz-badge");
		badgesClonados.forEach(clon => {
			const original = [...badgesOriginales].find(item => item.dataset.subcategoria === clon.dataset.subcategoria);
			if (!original) return;
			clon.classList.toggle("activo", original.classList.contains("activo"));
			const inputClon = clon.querySelector("input");
			const inputOriginal = original.querySelector("input");
			if (inputClon && inputOriginal) {
				inputClon.checked = inputOriginal.checked;
			}
		});
		// Sincronizar chips de ubicación
		const ubiOriginales = document.querySelectorAll("#ubicaciones-container .blz-ubi-chip");
		const ubiClonadas = clonUbicaciones.querySelectorAll(".blz-ubi-chip");
		ubiClonadas.forEach(clon => {
			const original = [...ubiOriginales].find(item => item.dataset.ubicacion === clon.dataset.ubicacion);
			if (!original) return;
			clon.classList.toggle("activo", original.classList.contains("activo"));
		});
	}
	// 4.5. COPIAR UBICACIÓN HORIZONTAL DE FORMA INSTANTÁNEA (SIN REBOTE)
	function copiarPosicionScroll(origen, destino) {
		if (!origen || !destino) return;
		const maxOrigen = origen.scrollWidth - origen.clientWidth;
		const maxDestino = destino.scrollWidth - destino.clientWidth;
		if (maxOrigen <= 0 || maxDestino <= 0) return;
		const proporcion = origen.scrollLeft / maxOrigen;
		destino.scrollTo({
			left: proporcion * maxDestino,
			behavior: "instant"
		});
	}

	function sincronizarScrollDesdeOriginal() {
		const origBanners = document.getElementById("contenedor-banners");
		const origBadges = document.getElementById("subcategorias-container");
		const origUbi = document.getElementById("ubicaciones-container");
		copiarPosicionScroll(origBanners, clonBanners);
		copiarPosicionScroll(origBadges, clonBadges);
		copiarPosicionScroll(origUbi, clonUbicaciones);
	}

	function sincronizarScrollHaciaOriginal() {
		const origBanners = document.getElementById("contenedor-banners");
		const origBadges = document.getElementById("subcategorias-container");
		const origUbi = document.getElementById("ubicaciones-container");
		copiarPosicionScroll(clonBanners, origBanners);
		copiarPosicionScroll(clonBadges, origBadges);
		copiarPosicionScroll(clonUbicaciones, origUbi);
	}
	// 5. REFRESCAR LOS CLONES
	function actualizarClones() {
		clonarBanners();
		clonarBadges();
		clonarUbicaciones();
		sincronizarClones();
		sincronizarScrollDesdeOriginal();
	}
	// 6. VISIBILIDAD SEGÚN SCROLL
	function controlarVisibilidad() {
		if (!barraClon) return;
		const limite = window.innerHeight * 0.55;
		const resultados = document.getElementById("resultados-bar");
		const hayResultados = resultados && getComputedStyle(resultados).display !== "none";
		const mostrar = window.scrollY >= limite && window.scrollY > 0 && hayResultados;
		if (mostrar !== estabaVisible) {
			if (mostrar) {
				sincronizarScrollDesdeOriginal();
			} else {
				sincronizarScrollHaciaOriginal();
			}
			estabaVisible = mostrar;
		}
		barraClon.classList.toggle("visible", mostrar);
		barraClon.setAttribute("aria-hidden", String(!mostrar));
	}
	// 7. LISTENERS DE CLIC EN EL CLON (BANNERS, BADGES Y UBICACIONES)
	barraClonListener();

	function barraClonListener() {
		// Click en Banner clonado
		document.addEventListener("click", function(e) {
			const bannerClon = e.target.closest(`#${ID_CLON} .cta-banner`);
			if (!bannerClon) return;
			e.preventDefault();
			e.stopPropagation();
			const categoria = bannerClon.dataset.categoria;
			const original = document.querySelector(`#contenedor-banners .cta-banner[data-categoria="${CSS.escape(categoria)}"]`);
			if (!original) return;
			sincronizarScrollHaciaOriginal();
			original.click();
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}, true);
		// Click en Subcategoría clonada
		document.addEventListener("click", function(e) {
			const badgeClon = e.target.closest(`#${ID_CLON} .blz-badge`);
			if (!badgeClon) return;
			e.preventDefault();
			e.stopPropagation();
			const subcategoria = badgeClon.dataset.subcategoria;
			const originales = document.querySelectorAll("#subcategorias-container .blz-badge");
			const original = [...originales].find(item => item.dataset.subcategoria === subcategoria);
			if (!original) return;
			sincronizarScrollHaciaOriginal();
			original.click();
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}, true);
		// Click en Ubicación clonada
		document.addEventListener("click", function(e) {
			const ubiClon = e.target.closest(`#${ID_CLON} .blz-ubi-chip`);
			if (!ubiClon) return;
			e.preventDefault();
			e.stopPropagation();
			const ubicacion = ubiClon.dataset.ubicacion;
			const originales = document.querySelectorAll("#ubicaciones-container .blz-ubi-chip");
			const original = [...originales].find(item => item.dataset.ubicacion === ubicacion);
			if (!original) return;
			sincronizarScrollHaciaOriginal();
			original.click();
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}, true);
	}
	// 9. OBSERVAR CAMBIOS EN LOS ORIGINALES
	function observarOriginales() {
		const banners = document.getElementById("contenedor-banners");
		const badges = document.getElementById("subcategorias-container");
		const ubicaciones = document.getElementById("ubicaciones-container");
		const ubicacionesBar = document.getElementById("ubicaciones-bar");
		const resultados = document.getElementById("resultados-bar");
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
		if (ubicaciones) {
			observer.observe(ubicaciones, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ["class"]
			});
		}
		if (ubicacionesBar) {
			observer.observe(ubicacionesBar, {
				attributes: true,
				attributeFilter: ["style", "class"]
			});
		}
		if (resultados) {
			observer.observe(resultados, {
				attributes: true,
				attributeFilter: ["style", "class"]
			});
		}
	}
	// 10. INICIALIZACIÓN
	function iniciarClonAtajo() {
		crearEstructuraClon();
		actualizarClones();
		observarOriginales();
		window.addEventListener("scroll", controlarVisibilidad, {
			passive: true
		});
		window.addEventListener("resize", controlarVisibilidad);
		controlarVisibilidad();
	}
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", iniciarClonAtajo);
	} else {
		iniciarClonAtajo();
	}
})();