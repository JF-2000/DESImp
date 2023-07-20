// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
var span3 = document.getElementsByClassName("close")[2];
var span4 = document.getElementsByClassName("close")[3];

var modalfactura;
var modalingreso;
// When the user clicks on the button, open the modal
function clickpago() {
    modalfactura = document.getElementById("modalfactura");
    modalfactura.style.display = "block";
}

function modfactura() {
    modalfactura = document.getElementById("modificarfactura");
    modalfactura.style.display = "block";
}

function abonafactura() {
    modalfactura = document.getElementById("abonarfactura");
    modalfactura.style.display = "block";
}

function ingresos() {
    modalingreso = document.getElementById("ingresos");
    modalingreso.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modalfactura.style.display = "none";
}
span2.onclick = function() {
    modalfactura.style.display = "none";
}
span3.onclick = function() {
    modalfactura.style.display = "none";
}
span4.onclick = function() {
    modalingreso.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalfactura) {
        modalfactura.style.display = "none";
    }

}

function cerrarmodal(){
    modalfactura.style.display = "none";
}

function cerrarmodaling(){
    modalingreso.style.display = "none";
}