document.addEventListener("DOMContentLoaded", () => {
  /* = CONFIGURACIÓN = */
  const IMGBB_API_KEY = "TU_API_KEY_DE_IMGBB"; // <-- REEMPLAZA CON TU API KEY
  const WHATSAPP_ADMIN = "51991490519";
  const GOOGLE_SCRIPT_URL = "https://google.com";

  /* = ELEMENTOS DEL DOM = */
  const formulario = document.getElementById("menu-formulario");
  const btnPublicar = document.getElementById("btnPublicarMini");
  const btnNavPublicar = document.getElementById("btnNavPublicar");
  const gonzalo = document.getElementById("gonzalo");

  // Campos del formulario
  const selectCategoria = document.getElementById("miniCategoria");
  const inputTitulo = document.getElementById("miniTitulo");
  const textareaDesc = document.getElementById("miniDescripcion");
  const countDesc = document.getElementById("countDescripcion");
  const inputWhatsapp = document.getElementById("miniWhatsapp");
  const inputDistrito = document.getElementById("miniDistrito");

  // Foto
  const inputFoto = document.getElementById("miniFoto");
  const previewFoto = document.getElementById("previewFoto");
  const placeholderFoto = document.getElementById("placeholderFoto");
  let imagenReducidaBase64 = null;

  // Duración
  const botonesDuracion = document.querySelectorAll(".blz-dur-btn");
  const spanPrecioBoton = document.getElementById("precioBoton");
  let duracionSeleccionada = { dias: "90", precio: "20" };

  let startTime = Date.now();

  /* = 1. LIMPIAR TEXTO Y FILTROS = */
  function limpiarTexto(texto, opciones = {}) {
    if (!texto) return "";
    let limpio = texto
      .replace(/<[^>]*>?/gm, "") // Quita etiquetas HTML
      .replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi, "") // Quita URLs/spam
      .replace(/[\x00-\x1F\x7F]/g, "") // Quita caracteres ocultos
      .replace(/([!?.¿¡])\1{2,}/g, "$1$1"); // Evita signos repetidos (ej. !!!!)

    if (opciones.soloNumeros) {
      return limpio.replace(/[^0-9]/g, "");
    }

    if (opciones.soloLetrasYEspacios) {
      return limpio.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").replace(/\s+/g, " ").trim();
    }

    return limpio
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }

  /* = 2. REDUCIR IMAGEN ANTES DE SUBIR = */
  function reducirImagen(file, maxWidth = 900, calidad = 0.75) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/jpeg", calidad);
          const base64Puro = dataUrl.split(",");
          resolve({ dataUrl, base64Puro });
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  /* = 3. SUBIR IMAGEN A IMGBB = */
  async function subirAImgBB(base64Puro) {
    if (!base64Puro) return "Sin foto";
    if (!IMGBB_API_KEY || IMGBB_API_KEY === "TU_API_KEY_DE_IMGBB") {
      console.warn("API Key de ImgBB no configurada.");
      return "Foto pendiente (API Key no configurada)";
    }

    const formData = new FormData();
    formData.append("image", base64Puro);

    const response = await fetch(`https://imgbb.com{IMGBB_API_KEY}`, {
      method: "POST",
      body: formData
    });

    const resultado = await response.json();
    if (resultado.success) {
      return resultado.data.url;
    } else {
      throw new Error("Error al subir imagen a ImgBB");
    }
  }

  /* = 4. RECOPILAR DATOS Y ABRIR WHATSAPP = */
  function enviarPorWhatsApp(datos) {
    const mensaje = 
`👋 *Hola enlaza2.pe, quiero publicar mi anuncio:*

📂 *Categoría:* ${datos.categoria}
📌 *Título:* ${datos.titulo}
📝 *Descripción:* ${datos.descripcion}
📱 *WhatsApp:* ${datos.whatsapp}
📍 *Distrito:* ${datos.distrito}
⏳ *Duración:* ${datos.dias} días (S/ ${datos.precio})
🖼️ *Foto:* ${datos.urlImagen}`;

    const urlWhatsApp = `https://wa.me{WHATSAPP_ADMIN}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, "_blank");
  }

  /* = 5. RESETEAR Y CERRAR FORMULARIO (FLUJO UX RÁPIDO) = */
  function resetearYCerrar() {
    if (inputTitulo) inputTitulo.value = "";
    if (textareaDesc) textareaDesc.value = "";
    if (countDesc) countDesc.textContent = "350";
    if (inputWhatsapp) inputWhatsapp.value = "";
    if (inputDistrito) inputDistrito.value = "";
    if (inputFoto) inputFoto.value = "";
    imagenReducidaBase64 = null;
    if (previewFoto) {
      previewFoto.src = "";
      previewFoto.style.display = "none";
    }
    if (placeholderFoto) placeholderFoto.style.display = "flex";

    if (formulario) formulario.classList.remove("blz-formulario-abierto");
    if (btnNavPublicar) btnNavPublicar.click();
  }

  /* = EVENTOS DE INTERFAZ = */
  window.abrirFormularioPublicar = function () {
    if (!formulario) return;
    formulario.classList.add("blz-formulario-abierto");
    startTime = Date.now();
    setTimeout(() => { if (inputTitulo) inputTitulo.focus(); }, 350);
  };

  window.cerrarFormularioPublicar = resetearYCerrar;

  // Contador descripción
  if (textareaDesc && countDesc) {
    textareaDesc.addEventListener("input", () => {
      const restante = 350 - textareaDesc.value.length;
      countDesc.textContent = restante;
      countDesc.parentElement.classList.toggle("blz-counter-warning", restante <= 40);
    });
  }

  // Cargar y reducir foto
  if (inputFoto) {
    inputFoto.addEventListener("change", async (e) => {
      const file = e.target.files;
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Selecciona una imagen válida.");
        return;
      }
      try {
        const { dataUrl, base64Puro } = await reducirImagen(file);
        imagenReducidaBase64 = base64Puro;
        previewFoto.src = dataUrl;
        previewFoto.style.display = "block";
        placeholderFoto.style.display = "none";
      } catch (err) {
        console.error(err);
        alert("No se pudo procesar la imagen.");
      }
    });
  }

  // Botones de duración
  botonesDuracion.forEach((btn) => {
    btn.addEventListener("click", () => {
      botonesDuracion.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      duracionSeleccionada = {
        dias: btn.getAttribute("data-dias"),
        precio: btn.getAttribute("data-precio")
      };
      if (spanPrecioBoton) spanPrecioBoton.textContent = duracionSeleccionada.precio;
    });
  });

  /* = ACCIÓN PRINCIPAL: PUBLICAR EN 1 CLIC = */
  if (btnPublicar) {
    btnPublicar.addEventListener("click", async () => {
      // Filtros antispam silenciosos
      if (gonzalo && gonzalo.value !== "") return;
      if ((Date.now() - startTime) / 1000 < 2) {
        alert("Espera un momento antes de publicar.");
        return;
      }

      // Recopilar y filtrar textos
      const categoria = selectCategoria ? selectCategoria.value : "Alquileres";
      const titulo = limpiarTexto(inputTitulo.value);
      const descripcion = limpiarTexto(textareaDesc.value);
      const whatsapp = limpiarTexto(inputWhatsapp.value, { soloNumeros: true });
      const distrito = limpiarTexto(inputDistrito.value, { soloLetrasYEspacios: true });

      // Validaciones rápidas
      if (titulo.length < 4) {
        alert("Ingresa un título para tu anuncio.");
        inputTitulo.focus();
        return;
      }
      if (descripcion.length < 10) {
        alert("Describe brevemente tu anuncio.");
        textareaDesc.focus();
        return;
      }
      if (whatsapp.length < 9) {
        alert("Ingresa un número de WhatsApp válido.");
        inputWhatsapp.focus();
        return;
      }
      if (distrito.length < 3) {
        alert("Ingresa tu distrito.");
        inputDistrito.focus();
        return;
      }

      const textoOriginalBoton = btnPublicar.innerHTML;

      try {
        btnPublicar.disabled = true;
        btnPublicar.textContent = imagenReducidaBase64 ? "Subiendo foto..." : "Procesando...";

        // 1. Subir imagen a ImgBB (si existe)
        const urlImagen = await subirAImgBB(imagenReducidaBase64);

        // 2. Armar objeto completo
        const datosAnuncio = {
          categoria,
          titulo,
          descripcion,
          whatsapp,
          distrito,
          dias: duracionSeleccionada.dias,
          precio: duracionSeleccionada.precio,
          urlImagen,
          timestamp: Date.now()
        };

        // 3. Respaldo en segundo plano en Google Sheets
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(datosAnuncio)
        }).catch((e) => console.warn("Sheets:", e));

        // 4. Redirigir directo a WhatsApp y cerrar formulario
        enviarPorWhatsApp(datosAnuncio);
        resetearYCerrar();

      } catch (error) {
        console.error(error);
        alert("Hubo un problema al subir tu foto. Inténtalo de nuevo.");
      } finally {
        btnPublicar.disabled = false;
        btnPublicar.innerHTML = textoOriginalBoton;
      }
    });
  }
});
