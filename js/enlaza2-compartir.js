async function compartirSitio() {
  const data = {
    title: "Enlaza2.pe",
    text:
      "Encuentra servicios y anuncios cerca de ti en Carmen de la Legua",
    url: "https://enlaza2.pe"
  };

  try {
    if (navigator.share) {
      await navigator.share(data);
    } else {
      navigator.clipboard.writeText(data.url);
      alert("Enlace copiado");
    }
  } catch (err) {
    console.log(err);
  }
}