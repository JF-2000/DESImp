// Get the modal

var modalbienes = document.getElementById("modalbienes");

// Get the button that opens the modal
var btnbienes = document.getElementById("btnbienes");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btnbienes.onclick = function() {
  modalbienes.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalbienes.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalbienes) {
        modalbienes.style.display = "none";
    }

}

function cerrarmodal(){
    modalbienes.style.display = "none";
}