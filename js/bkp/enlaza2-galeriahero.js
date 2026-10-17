const slides=document.querySelectorAll(".blz-slide");

let actual=0;

setInterval(()=>{

    slides[actual].classList.remove("active");

    actual++;

    if(actual>=slides.length)
        actual=0;

    slides[actual].classList.add("active");

},5000);