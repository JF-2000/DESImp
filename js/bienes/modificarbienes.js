infoclient = document.getElementById('infocliente');
const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

async function selectbien() {

    await fetch(api+`/bienes/${info}`)
    .then(response => response.json())
    .then(( data) => bienes = data);
        document.getElementById('describien').value = bienes[0].descripcion
        document.getElementById('direccion').value = bienes[0].direccion
        document.getElementById('listatipobienes').value = bienes[0].idtipobien
        document.getElementById('listagrupos').value = bienes[0].idgrupo
}


async function borrar(){
    var mensaje = confirm("¿Seguro que desea eliminar este bien?"); 
    if (mensaje) {
        var data = {
            id: info,
            tipo: 'Bien',
        };
    
        var xhr = new XMLHttpRequest();
    
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/listabienes.html');
                alert("Bien eliminado correctamente");
                
            }
        }
    
        xhr.onerror = function(){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };
    
        xhr.open("POST", api+"/borrar");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
    
        xhr.send(JSON.stringify(data));
    }
    else {

    }

}


document.getElementById("registrar").addEventListener("click",(event)=>{
    event.preventDefault();
    guardar()
})

document.getElementById("borrar").addEventListener("click",(event)=>{
    event.preventDefault();
    borrar()
})
     


function guardar(){

    var descripcion = document.getElementById("describien").value;
    var idtipobien = document.getElementById("listatipobienes").value;
    var direccion = document.getElementById("direccion").value;
    var idgrupo = document.getElementById("listagrupos").value

    if (descripcion.value=="" || idtipobien.value==""){
        alert("Llene el campo de descripción")
        return false;
    }
    else{
        if(direccion=="" || direccion==0){
            direccion = ""
        }
        var data = {
            descripcion,
            direccion,
            idgrupo,
            idtipobien,
            idbien: info 
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/listabienes.html');
                alert("Bien modificado correctamente");
            }
        }

        xhr.onerror = function(){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api+"/bienes/modificar/update");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(data));

    }   

}