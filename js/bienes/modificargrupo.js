var nombre = document.getElementById("nombre")

const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

async function selectgrupo(){
    let elgrupo = [];
    await fetch(api+`/bienes/grupo/${info}`)
    .then(response => response.json())
    .then((data) => elgrupo = data);
        nombre.value = elgrupo.nombre;
}

document.getElementById("registrar").addEventListener("click", (event) => {
    event.preventDefault();
    guardar()
})

document.getElementById("borrar").addEventListener("click",(event)=>{
    event.preventDefault();
    borrar()
})

async function borrar(){
    var mensaje = confirm("¿Seguro que desea eliminar este grupo?"); 
    if (mensaje) {
        var data = {
            id: info,
            tipo: 'Grupo',
        };
    
        var xhr = new XMLHttpRequest();
    
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/listagrupos.html');
                alert("Grupo eliminado correctamente");
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

function guardar(){

    if (nombre==""){
        alert("Llene el campo de descripción")
        return false;
    }
    else{
        var data = {
            idgrupo: info,
            nombre: nombre.value
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/listagrupos.html')
                alert("Grupo modificado correctamente");
            }
        }

        xhr.onerror = function(){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api+"/grupo/update");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(data));

    }   

}