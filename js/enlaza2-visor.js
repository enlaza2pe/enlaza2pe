let urlActual = "";

// ===== ABRIR =====
function abrirVista(url) {
  const sheet = document.getElementById("blz-bottom-sheet");
  const bg = document.getElementById("blz-overlay-bg");
  const content = document.getElementById("blz-sheet-content");

  content.innerHTML = `<iframe src="${url}" style="width:100%; height:100%; border:none; overflow:auto;"></iframe>`;

  sheet.classList.add("active");
  bg.classList.add("active");

  //bloquear scroll de fondo
  document.body.style.overflow = "hidden";
}

// ===== CERRAR =====
function cerrarSheet() {
  document.getElementById("blz-bottom-sheet").classList.remove("active");
  document.getElementById("blz-overlay-bg").classList.remove("active");

  //restaurar scroll de fondo
  document.body.style.overflow = "auto";
}

// ===== DRAG (IMPORTANTE) =====
document.addEventListener("DOMContentLoaded", () => {

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  const sheet = document.getElementById("blz-bottom-sheet");
  const handle = document.getElementById("dragHandle");

  if (!handle || !sheet) return; // evita errores

  // INICIO
  handle.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
  });

  // MOVIMIENTO
  handle.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    currentY = e.touches[0].clientY;
    let diff = currentY - startY;

    if (diff > 0) {
      sheet.style.transform = `translateY(${diff}px)`;
    }
  });

  // FIN
  handle.addEventListener("touchend", () => {
    isDragging = false;

    let diff = currentY - startY;

    if (diff > 120) {
      cerrarSheet();
    } else {
      sheet.style.transform = "translateY(0)";
    }
  });


  handle.addEventListener("mousedown", (e) => {
  startY = e.clientY;
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