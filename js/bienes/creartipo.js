var nombre = document.getElementById("nombre");
var trenta = document.getElementById("trenta");

//Evitar el eventDefault del submit.
document.getElementById("registrar").addEventListener("click",(event)=>{
    event.preventDefault();
    guardar()
})

function guardar(){

    limpiarerror();
    if (nombre.value==""){
        alert("Ingrese el nombre del nuevo tipo.")
        return false;
    }
    else{
        var data = {
            nombre: nombre.value,
            trenta: trenta.value
        };
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign(document.referrer);
                alert("Nuevo tipo de bien registrado correctamente.");
                limpiarerror();
                limpiarinput();
            }
        }

        xhr.onerror = function(e){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api+"/creartipo");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));      

    }
}

function limpiarinput(){
    nombre.value = "";
}
function limpiarerror(){
    nombre.className = "";
}


