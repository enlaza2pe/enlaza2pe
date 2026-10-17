let currentURL = "";

function abrirModal(url) {
  currentURL = url;

  const modal = document.getElementById("floating-view");
  const iframe = document.getElementById("floating-iframe");

  iframe.src = url;
  modal.style.display = "block";

  document.body.classList.add("modal-open");
}

function cerrarModal() {
  document.getElementById("floating-view").style.display = "none";
  document.getElementById("floating-iframe").src = "";

  document.body.classList.remove("modal-open");
}

function ampliar() {
  window.location.href = currentURL;
}

document.getElementById("btn-close").onclick = cerrarModal;
document.getElementById("btn-expand").onclick = ampliar;


//Dragabble

const modal = document.getElementById("floating-view");
const header = document.getElementById("floating-header");

let isDragging = false;
let offsetX, offsetY;

header.onmousedown = (e) => {
  isDragging = true;
  offsetX = e.clientX - modal.offsetLeft;
  offsetY = e.clientY - modal.offsetTop;
};

document.onmousemove = (e) => {
  if (!isDragging) return;

  modal.style.left = (e.clientX - offsetX) + "px";
  modal.style.top = (e.clientY - offsetY) + "px";
};

document.onmouseup = () => {
  isDragging = false;
};



function abrirPopup(url) {
  window.open(
    url,
    "anuncio",
    "width=1000,height=700,top=100,left=200,resizable=yes,scrollbars=yes"
  );
}
