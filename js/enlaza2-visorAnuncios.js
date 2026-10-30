let urlActual = "";

// ===== ABRIR =====
function abrirVista(url) {
  const sheet = document.getElementById("blz-bottom-sheet");
  const bg = document.getElementById("blz-overlay-bg");
  const content = document.getElementById("blz-sheet-content");
  
  content.innerHTML = `<iframe src="${url}" style="width:100%; height:100%; border:none; overflow:auto;"></iframe>`;
  
  // Resetear transform por si quedó basura de un drag anterior
  sheet.style.transform = ""; 
  
  sheet.classList.add("active");
  bg.classList.add("active");
  document.body.style.overflow = "hidden";
}


// ===== CERRAR =====
function cerrarSheet() {
  const sheet = document.getElementById("blz-bottom-sheet");
  
  sheet.classList.remove("active");
  document.getElementById("blz-overlay-bg").classList.remove("active");
  
  // IMPORTANTE: Resetea el estilo inline para que CSS tome el control al ocultarse
  sheet.style.transform = ""; 
  
  document.body.style.overflow = "auto";
}


// ===== DRAG (IMPORTANTE) =====
document.addEventListener("DOMContentLoaded", () => {
  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  const sheet = document.getElementById("blz-bottom-sheet");
  const handle = document.getElementById("dragHandle");

  if (!handle || !sheet) return;

  // --- EVENTOS TÁCTILES (MÓVIL) ---
  handle.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    currentY = startY; // CORRECCIÓN: Inicializa para evitar saltos matemáticos si no hay movimiento
    isDragging = true;
  });

  handle.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    let diff = currentY - startY;

    if (diff > 0) {
      sheet.style.transform = `translateY(${diff}px)`;
    }
  });

  handle.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;

    let diff = currentY - startY;
    if (diff > 120) {
      cerrarSheet();
    } else {
      sheet.style.transform = "translateY(0)";
    }
  });

  // --- EVENTOS DE RATÓN (PC) ---
  handle.addEventListener("mousedown", (e) => {
    startY = e.clientY;
    currentY = startY; // CORRECCIÓN: Inicializa para que si solo haces click, "diff" sea 0 y no un negativo gigante
    isDragging = true;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    currentY = e.clientY;
    let diff = currentY - startY;

    if (diff > 0) {
      sheet.style.transform = `translateY(${diff}px)`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;

    let diff = currentY - startY;
    if (diff > 120) {
      cerrarSheet();
    } else {
      sheet.style.transform = "translateY(0)";
    }
  });
});