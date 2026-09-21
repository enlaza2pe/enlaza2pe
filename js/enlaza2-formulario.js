document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const formulario =
        document.getElementById("menu-formulario");

    const btnPublicar =
        document.getElementById("btnPublicarMini");

    const step1 =
        document.getElementById("miniStep1");

    const step2 =
        document.getElementById("miniStep2");

    const textarea =
        document.getElementById("miniServicio");

    const inputDatos =
        document.getElementById("miniNombreTelefono");

    const countServicio =
        document.getElementById("countServicio");

    const countDatos =
        document.getElementById("countDatos");

    const gonzalo =
        document.getElementById("gonzalo");

    const btnCerrarExito =
        document.getElementById("btnCerrarExito");

    const btnNavPublicar =
        document.getElementById("btnNavPublicar");


    /* =====================================================
       TIEMPO ANTISPAM
    ===================================================== */

    let startTime = Date.now();


    /* =====================================================
       ABRIR FORMULARIO
    ===================================================== */

    window.abrirFormularioPublicar = function () {

        const formulario =
            document.getElementById("menu-formulario");

        if (!formulario) {

            console.error(
                "No existe #menu-formulario"
            );

            return;
        }


        /* Mostrar formulario */

        formulario.classList.add(
            "blz-formulario-abierto"
        );


        /* Reiniciar antispam */

        startTime = Date.now();


        /* Esperar la animación */

        setTimeout(() => {

            const primerCampo =
                document.getElementById("miniServicio");

            if (primerCampo) {

                primerCampo.focus();

            }

        }, 350);

    };




    /* =====================================================
       CONTADORES
    ===================================================== */

    if (textarea && countServicio) {

        textarea.addEventListener(
            "input",
            () => {

                const restante =
                    350 - textarea.value.length;

                countServicio.textContent =
                    restante;

                countServicio.parentElement
                    .classList.toggle(
                        "blz-counter-warning",
                        restante <= 40
                    );

            }
        );

    }


    if (inputDatos && countDatos) {

        inputDatos.addEventListener(
            "input",
            () => {

                const restante =
                    80 - inputDatos.value.length;

                countDatos.textContent =
                    restante;

                countDatos.parentElement
                    .classList.toggle(
                        "blz-counter-warning",
                        restante <= 15
                    );

            }
        );

    }


    /* =====================================================
   CERRAR FORMULARIO
===================================================== */

    window.cerrarFormularioPublicar = function () {

        if (step2) {
            step2.classList.remove("blz-step-visible");
        }

        if (step1) {
            step1.style.display = "block";
        }

        if (formulario) {
            formulario.classList.remove("blz-formulario-abierto");
        }

        /* Cerrar NAV */
        if (btnNavPublicar) {
            btnNavPublicar.click();
        }

    };


    /* =====================================================
       PASO 2 → VOLVER A CERRAR
    ===================================================== */
    if (btnCerrarExito) {
        btnCerrarExito.addEventListener("click", cerrarFormularioPublicar);
    }

    /* =====================================================
       PUBLICAR
    ===================================================== */

    if (btnPublicar) {

        btnPublicar.addEventListener(
            "click",
            async () => {

                const servicio =
                    textarea.value.trim();

                const nombretelefono =
                    inputDatos.value.trim();


                /* VALIDACIONES */

                if (!servicio) {

                    alert(
                        "Ingresa tu servicio."
                    );

                    textarea.focus();

                    return;
                }


                if (servicio.length < 5) {

                    alert(
                        "Describe mejor tu servicio."
                    );

                    textarea.focus();

                    return;
                }


                if (nombretelefono === "") {

                    alert(
                        "Ingresa tu nombre y WhatsApp o correo."
                    );

                    inputDatos.focus();

                    return;
                }


                if (nombretelefono.length < 5) {

                    alert(
                        "Ingresa datos de contacto válidos."
                    );

                    inputDatos.focus();

                    return;
                }


                /* HONEYPOT */

                if (gonzalo && gonzalo.value !== "") {
                    return;
                }


                /* ANTISPAM */

                const segundos =
                    (Date.now() - startTime) / 1000;

                if (segundos < 3) {

                    alert(
                        "Espera unos segundos antes de publicar."
                    );

                    return;
                }


                /* DATOS */

                const data = {

                    servicios: servicio,

                    nombretelefono:
                        nombretelefono,

                    timestamp:
                        Date.now()

                };


                try {

                    btnPublicar.disabled = true;

                    btnPublicar.innerText =
                        "Enviando...";


                    await fetch(
                        "https://script.google.com/macros/s/AKfycbyElkanUrtIcnE5SvLA1qqt97Ag22Jo2BOrXceki1EG4dD0-PffrU2_Hh_Hb8wyqP1fPA/exec",
                        {
                            method: "POST",

                            body:
                                JSON.stringify(data)
                        }
                    );


                    /* PASAR AL PASO 2 SIN CERRAR EL NAV */

                    if (step1) {
                        step1.style.display = "none";
                    }

                    if (step2) {
                        step2.classList.add("blz-step-visible");
                    }

                    if (formulario) {
                        formulario.classList.add("blz-formulario-abierto");
                    }


                } catch (error) {

                    console.error(
                        error
                    );

                    alert(
                        "No se pudo enviar la solicitud. Inténtalo nuevamente."
                    );


                } finally {
                    btnPublicar.disabled = false;
                }

                /*finally {
                    btnPublicar.disabled = false;
                    btnPublicar.innerHTML = `
                        <span class="blz-btn-icon">
                            <i class="bi bi-send-fill"></i>
                        </span>
                        <span> Publicar mi servicio </span>
                    `;
                }*/

            }
        );

    }



});


