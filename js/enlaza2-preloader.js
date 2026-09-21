/* ======================================================
   LOADER GLOBAL
====================================================== */

function mostrarLoader() {

    document.getElementById("overlayer").style.display = "block";
    document.querySelector(".loader").style.display = "flex";

}

function ocultarLoader() {

    document.getElementById("overlayer").style.display = "none";
    document.querySelector(".loader").style.display = "none";

}

/* simula pequeña carga visual */

function ejecutarConLoader(callback, tiempo = 300){

    mostrarLoader();

    setTimeout(()=>{

        callback();

        ocultarLoader();

    }, tiempo);

}