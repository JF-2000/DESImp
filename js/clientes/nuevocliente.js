
var nombre = document.getElementById("nombre");
var telefono = document.getElementById("telefono");
var cedula = document.getElementById("cedula");
var pasaporte = document.getElementById("pasaporte");
var tipoidentif;
var identificacion;
document.getElementById("Cedula").checked = true;

//Evitar el eventDefault del submit.
document.getElementById("registrar").addEventListener("click",(event)=>{
    event.preventDefault();
    guardar()
})

function guardar(){
    limpiarerror();
    if(cedula.getAttribute("hidden","")==null){
        identificacion = cedula.value;
    }
    if(pasaporte.getAttribute("hidden","")==null){
        identificacion = pasaporte.value;
    }

    if (nombre.value==""){
        alert("Favor llenar el campo de nombre.")
        nombre.className = "error";
        return false;
    }else{
        var data = {
            nombre: nombre.value,
            cedula: identificacion,
            tipoidentif,
            telefono: telefono.value
        };

        var xhr = new XMLHttpRequest();
       
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 201) {
                window.location.assign("../../vistas/consultas/clientes.html")
                alert("Nuevo cliente registrado correctamente.")
                limpiarerror();
                limpiarinput();
            }
        }

        xhr.onerror = function(e){
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api+"/clientes/add");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(data));
            
    }
}

document.getElementById("cedula").addEventListener("focus", ()=>{
    if(document.getElementById("Cedula").checked){
        tipoidentif = 1;
        cedula.value = "";
        cedula.removeAttribute("hidden","")
        pasaporte.setAttribute("hidden","")
        cedula.focus();
        applyInputMask("cedula","000-0000000-0")
    }
    else if(document.getElementById("Pasaporte").checked){
        tipoidentif = 2;
        pasaporte.value = "";
        cedula.setAttribute("hidden","")
        pasaporte.removeAttribute("hidden","")
        pasaporte.focus();
    }
    
})

document.getElementById("pasaporte").addEventListener("focus", ()=>{
    if(document.getElementById("Cedula").checked){
        tipoidentif = 1;
        cedula.value = "";
        cedula.removeAttribute("hidden","")
        pasaporte.setAttribute("hidden","")
        cedula.focus();
        applyInputMask("cedula","000-0000000-0")
    }
    else if(document.getElementById("Pasaporte").checked){
        tipoidentif = 2;
        pasaporte.value = "";
        cedula.setAttribute("hidden","")
        pasaporte.removeAttribute("hidden","")
        pasaporte.focus();
    }
    
})

document.getElementById("telefono").addEventListener("focus", ()=>{
    applyInputMask("telefono","000-000-0000")
})


function limpiarinput(){
    nombre.value = "";
    cedula.value = "";
    telefono.value = "";
}
function limpiarerror(){
    cedula.className = "";
    telefono.className = "";
    nombre.className = "";
}

