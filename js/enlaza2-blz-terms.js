let termsCargados = false;

// ===== ABRIR Y CARGAR =====
function abrirYIrANormas() {
  abrirTerms();

  if (!termsCargados) {
    fetch("terminos.html")
      .then(res => res.text())
      .then(html => {
        document.getElementById("blzTermsContent").innerHTML = html;
        termsCargados = true;

        // esperar que renderice
        setTimeout(irANormas, 200);
      })
      .catch(() => {
        document.getElementById("blzTermsContent").innerHTML = 
          "<p>Error al cargar los términos.</p>";
      });

  } else {
    setTimeout(irANormas, 200);
  }
}

// ===== ABRIR =====
function abrirTerms() {
  const modal = document.getElementById("blzTerms");
  const content = document.getElementById("blzTermsContent");

  if (!modal || !content) {
    console.error("No existe el modal de términos en el HTML");
    return;
  }

  // abrir modal
  modal.style.display = "flex";

  // cargar solo la primera vez
  if (!termsCargados) {
    fetch("terminos.html")
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar terminos.html");
        return res.text();
      })
      .then(html => {
        content.innerHTML = html;
        termsCargados = true;
      })
      .catch(err => {
        console.error(err);
        content.innerHTML = "<p>Error al cargar los términos.</p>";
      });
  }
}
// ===== CERRAR =====
function cerrarTerms() {
  document.getElementById("blzTerms").style.display = "none";
}

// ===== SCROLL =====
function irANormas() {
  const el = document.getElementById("normasContenido");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}