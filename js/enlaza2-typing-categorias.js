const palabras = [
  "Electricista",
  "Gasfitero",
  "Pintor",
  "Albañil",
  "Técnico",
  "Drywallero",
];

let i = 0;      // palabra
let j = 0;      // letra
let borrando = false;

const typing = document.getElementById("typing");

function escribir() {
  const palabra = palabras[i];
  const limiteFijo = 1; // Número de letras que no se borran

  if (!borrando) {
    typing.textContent = palabra.substring(0, j++);
    if (j > palabra.length) {
      borrando = true;
      setTimeout(escribir, 1200);
      return;
    }
  } else {
    typing.textContent = palabra.substring(0, j--);
    if (j === limiteFijo ) {
      borrando = false;
      i = (i + 1) % palabras.length;
    }
  }

  setTimeout(escribir, borrando ? 50 : 100);
}

escribir();

const servicio = document.getElementById("miniServicio");
const extra = document.getElementById("blzExtraFields");
/*
function mostrarExtras(){
  if(!extra.classList.contains("blz-open")){
    extra.classList.add("blz-open");
  }
}

servicio.addEventListener(
  "focus",
  mostrarExtras
);

servicio.addEventListener(
  "input",
  mostrarExtras
);*/