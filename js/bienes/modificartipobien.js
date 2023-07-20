
const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

var nombre = document.getElementById("nombre");
var trenta = document.getElementById("trenta");

let tipobien = [];

async function selecttipobien() {

    await fetch(api+`/tipobien/${info}`)
    .then(response => response.json())
    .then((data) => tipobien = data[0]);
        nombre.value = tipobien.nombre;
        console.log(tipobien.trenta)
        trenta.value = tipobien.trenta;
}

async function borrar(){
    var mensaje = confirm("¿Seguro que desea eliminar este tipobien?"); 
    if (mensaje) {
        var data = {
            id: info,
            tipo: 'Tipobien',
        };
    
        var xhr = new XMLHttpRequest();
    
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/listatipobien.html');
                alert("Tipobien eliminado correctamente");
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

    if (nombre==""){
        alert("Llene el campo de nombre")
        return false;
    }
    else{
        var data = {
            nombre: nombre.value,
            trenta: trenta.value,
            idtipobien: info 
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/listatipobien.html')
                alert("Tipo de bien modificado correctamente");
            }
        }

        xhr.onerror = function(){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api+"/tipobienes/update");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(data));

    }   

}
