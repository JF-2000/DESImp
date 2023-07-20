var descripcion = document.getElementById("describien");
var direccion = document.getElementById("direccion");
var tipobien = document.getElementById("listatipobienes");
var grupo = document.getElementById('listagrupos');


//Evitar el eventDefault del submit.
document.getElementById("registrar").addEventListener("click",(event)=>{
    event.preventDefault();
    guardar()
})

// window.addEventListener("load",()=>{
//     listartipobienes()
// })

function guardar(){
    limpiarerror();
    if (descripcion.value==""){
        alert("Llene el campo de descripción")
        descripcion.className = "error";
        return false;
    }
    if (tipobien.value==""){
        alert("Necesita crear un tipo de bien antes.")
        tipobien.className = "error";
        return false;
    }
    else{
        var data = {
            descripcion: descripcion.value,
            direccion: direccion.value,
            idtipobien: tipobien.value,
            idgrupo: grupo.value
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/listabienes.html');
                alert("Nuevo bien registrado correctamente.")
            }
        }

        xhr.onerror = function(e){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api+"/bienes/add");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));

    }   

}
function limpiarinput(){
    descripcion.value = "";
}
function limpiarerror(){
    descripcion.className = "";
}
