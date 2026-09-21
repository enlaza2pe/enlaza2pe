/* =====================================================
   DISEÑO 1
   Especialista sin tarjeta
===================================================== */

function diseño1(a, palabrasCoincidentes = []) {

    // =================================================
    // KEYWORDS COINCIDENTES
    // =================================================

    const globos = palabrasCoincidentes
        .map(palabra => `
            <span class="blz-search-keyword">
                ${escaparHTML(palabra)}
            </span>
        `)
        .join("");


    // =================================================
    // SUBCATEGORÍA
    // =================================================

    const subcategoria = a.subcategory
        ? `
            <span class="blz-subcategory-badge">
                ${escaparHTML(a.subcategory)}
            </span>
          `
        : "";


    // =================================================
    // CARD
    // =================================================

    return `

        <div class="col-md-6 col-lg-4 mb-4">

            <div class="blog-entry">


                <!-- ==================================
                     IMAGEN
                =================================== -->

                <a
                    href="javascript:void(0)"
                    onclick="abrirVista('${a.web}')"
                    class="img-link blz-card-image"
                >

                    <!-- SUBCATEGORÍA -->

                    ${subcategoria}

                    <!-- GALERÍA -->

                    ${crearGaleria(a.imagenes)}

                </a>


                <!-- ==================================
                     INFORMACIÓN DEL ANUNCIO
                =================================== -->

                <div class="post-entry-alt">

                    <div class="excerpt">


                        <!-- TÍTULO
                             IMPORTANTE:
                             NO escaparHTML()
                             porque el JSON contiene HTML
                        -->

                        <h2>

                            <a
                                href="javascript:void(0)"
                                onclick="abrirVista('${a.web}')"
                            >
                                ${a.titulo ?? ""}
                            </a>

                        </h2>


                        <!-- DESCRIPCIÓN
                             IMPORTANTE:
                             NO escaparHTML()
                        -->

                        <p>
                            ${a.descripcion ?? ""}
                        </p>


                        <!-- ==================================
                             KEYWORDS
                        =================================== -->

                        ${
                            globos
                                ? `
                                    <hr class="blz-keywords-separator">

                                    <div class="blz-search-keywords">
                                        ${globos}
                                    </div>
                                  `
                                : ""
                        }


                    </div>

                </div>

            </div>

        </div>

    `;
}


/*function diseño1(a) {
  return `
	  <div class="col-md-6 col-lg-4 mb-4">
		<div class="blog-entry">
      <a href="javascript:void(0)" onclick="abrirVista('${a.web}')" class="img-link">
        <!-- BADGE --> 
        <div class="card-keyword">
            ${a.keyword ?? ""}
        </div>
        ${crearGaleria(a.imagenes)}
      </a>
    
        <div class="post-entry-alt">
         <div class="excerpt">
          
         
          <h2><a href="javascript:void(0)" onclick="abrirVista('${a.web}')">${a.titulo}</a></h2>        
          

          <span class="date">${a.rubro} &bullet; ${a.subcategory}</span>
                
          <p>${a.descripcion}</p>
          <p><a href="javascript:void(0)" onclick="abrirVista('${a.web}')" class="btn btn-sm">VER INFORMACIÓN ➡️</a></p>
        </div>
          </div>
      </div>
	  </div>`;
}*/

//función para las imágenes
function crearGaleria(imagenes = []) {
  if (!imagenes.length) {
    imagenes = ["img/default/diseno2-5.jpg"];
  }
  return `
        <div class="blz-slider">
            ${imagenes.map((img, i) => `
                <img
                    src="${img}"
                    class="img-fluid ${i === 0 ? 'activo' : ''}"
                    loading="lazy">
            `).join("")}
        </div>
    `;
}

//JS del carrusel
document.addEventListener("DOMContentLoaded",()=>{
    setInterval(()=>{
        document.querySelectorAll(".blz-slider").forEach(slider=>{
            const imgs=slider.querySelectorAll("img");
            if(imgs.length<=1) return;
            let actual=[...imgs].findIndex(i=>i.classList.contains("activo"));
            imgs[actual].classList.remove("activo");
            actual=(actual+1)%imgs.length;
            imgs[actual].classList.add("activo");
        });
    },4000);
});

