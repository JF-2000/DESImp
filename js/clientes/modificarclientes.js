infoclient = document.getElementById('infocliente');
const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

var nombre = document.getElementById("nombre");
var radio = document.getElementsByName("identificacion");
var cedula = document.getElementById("cedula");
var pasaporte = document.getElementById("pasaporte");
var telefono = document.getElementById("telefono");
var tipoidentif;
var identificacion;

let cliente = [];

async function selectcliente() {

    await fetch(api+`/clientes/${info}`)
    .then(response => response.json())
    .then((data) => cliente = data[0]);
        nombre.value = cliente.nombre
        telefono.value = cliente.telefono
        for(i = 0; i < radio.length; i++){
            if(radio[i].value == cliente.tipoidentif){
                radio[i].checked = true;
                tipoidentif = radio[i].value;
                break 
            }
        }
        if( cliente.tipoidentif == 1){
            cedula.removeAttribute("hidden","")
            pasaporte.setAttribute("hidden","")
            cedula.value = cliente.cedula;
        }
        if( cliente.tipoidentif == 2){
            cedula.setAttribute("hidden","")
            pasaporte.removeAttribute("hidden","")
            pasaporte.value = cliente.cedula;
        }
}

async function borrar(){
    var mensaje = confirm("¿Seguro que desea eliminar este cliente?"); 
    if (mensaje) {
        var data = {
            id: info,
            tipo: 'Cliente',
        };
    
        var xhr = new XMLHttpRequest();
    
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/clientes.html');
                alert("Cliente eliminado correctamente");
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

document.getElementById("cedula").addEventListener("focus", ()=>{
    if(document.getElementById("Cedula").checked){
        tipoidentif = 1;
        cedula.removeAttribute("hidden","")
        pasaporte.setAttribute("hidden","")
        cedula.focus();
        applyInputMask("cedula","000-0000000-0")
    }
    else if(document.getElementById("Pasaporte").checked){
        tipoidentif = 2;
        cedula.setAttribute("hidden","")
        pasaporte.removeAttribute("hidden","")
        pasaporte.focus();
    }
    
})

document.getElementById("pasaporte").addEventListener("focus", ()=>{
    if(document.getElementById("Cedula").checked){
        tipoidentif = 1;
        cedula.removeAttribute("hidden","")
        pasaporte.setAttribute("hidden","")
        cedula.focus();
        applyInputMask("cedula","000-0000000-0")
    }
    else if(document.getElementById("Pasaporte").checked){
        tipoidentif = 2;
        cedula.setAttribute("hidden","")
        pasaporte.removeAttribute("hidden","")
        pasaporte.focus();
    }
    
})

document.getElementById("telefono").addEventListener("focus", ()=>{
    applyInputMask("telefono","000-000-0000")
})

document.getElementById("registrar").addEventListener("click",(event)=>{
    event.preventDefault();
    guardar()
})
document.getElementById("borrar").addEventListener("click",(event)=>{
    event.preventDefault();
    borrar()
})

function guardar(){
    if(cedula.getAttribute("hidden","")==null){
        identificacion = cedula.value;
    }
    if(pasaporte.getAttribute("hidden","")==null){
        identificacion = pasaporte.value;
    }

    if (nombre==""){
        alert("Llene el campo de descripción")
        return false;
    }
    else{
        var data = {
            nombre: nombre.value,
            cedula: identificacion,
            telefono: telefono.value,
            tipoidentif,
            idcliente: info 
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign('../../vistas/consultas/clientes.html')
                alert("Cliente modificado correctamente");
            }
        }

        xhr.onerror = function(){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api+"/clientes/update");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(data));

    }   

}
