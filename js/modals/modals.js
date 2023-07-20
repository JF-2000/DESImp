// Get the modal
var modalclientes = document.getElementById("modalclientes");
var modalbienes = document.getElementById("modalbienes");
var modalfacturas = document.getElementById("modalfacturas");

// Get the button that opens the modal
var bbtnclientes = document.getElementById("btnclientes");
var btnbienes = document.getElementById("btnbienes");
var btnfacturas = document.getElementById("btnfacturas");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btnclientes.onclick = function() {
  modalclientes.style.display = "block";
}
btnbienes.onclick = function() {
    modalbienes.style.display = "block";
}
btnfacturas.onclick = function() {
    modalfacturas.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalclientes.style.display = "none";
  modalbienes.style.display = "none";
  modalfacturas.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalclientes) {
        modalclientes.style.display = "none";
    }
    if (event.target == modalbienes) {
        modalbienes.style.display = "none";
    }
    if (event.target == modalfacturas) {
        modalfacturas.style.display = "none";
    }
}

window.addEventListener("load",()=>{
   fetch(api+`/comprobar`)
})