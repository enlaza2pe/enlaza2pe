/* ======================================

tres funciones: arquitectura basada en **estados de interfaz (Home → Búsqueda → Categoría)

 ========================================*/

const app = document.getElementById("app");

/* =========================================================
  REINICIAR TODO
  ========================================================= */

function activarHome() {

    app.classList.remove(
        "estado-home",
        "estado-busqueda",
        "estado-categoria"
    );

    app.classList.add("estado-home");
    document.getElementById("contenedor-banners").classList.remove("modo-compacto");
    document.getElementById("resultados-bar").style.display = "none";
    document.getElementById("resultados-bar-busqueda").style.display = "none";
    document.getElementById("titulo-resultados-busqueda").style.display = "none";
    document.getElementById("search").value = "";
    document.getElementById("tipo1").innerHTML = "";

    window.scrollTo({
        top: document.getElementById("app").offsetTop - 20,
        behavior: "smooth"
    });
}

/* =========================================================
  REINICIAR TODO
  ========================================================= */


function activarBusqueda() {

    app.classList.remove(
        "estado-home",
        "estado-busqueda",
        "estado-categoria"
    );

    app.classList.add("estado-busqueda");
    document.getElementById("contenedor-banners").classList.remove("modo-compacto");
    document.getElementById("resultados-bar").style.display = "none";
}

/*Compactar banners*/
function activarCategoria() {

    app.classList.remove(
        "estado-home",
        "estado-busqueda",
        "estado-categoria"
    );

    app.classList.add("estado-categoria");
    document.getElementById("contenedor-banners").classList.add("modo-compacto");

}