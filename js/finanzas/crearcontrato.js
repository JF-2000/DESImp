const listatipobienes = document.getElementById("listatipobienes");
const listabien = document.getElementById("listabien");
const lbienes = document.getElementById("lbienes");
var idbien;


const infoclient = document.getElementById('infocliente');
const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');
let infcliente = [];


async function cliente() {
    var hoy = new Date().toISOString().slice(0, 10)
    var elcliente;

    await fetch(api + `/clientes/${info}`)
        .then(response => response.json())
        .then((data) => elcliente = data[0]);
            html = `
            <div class="col-6">
                <div class="input-group-desc">
                    <label>${elcliente.nombre}</label>
                    <label class="label--desc">Nombre</label>
                </div>
            </div>`
            if(elcliente.cedula){
                html += `  <div class="col-6">
                <div class="input-group-desc">
                    <label>${elcliente.cedula}</label>
                    <label class="label--desc">Identificación</label>
                </div>
            </div>`  
            }

    infoclient.innerHTML = html;
    document.getElementById('fechaini').value = hoy

}

fechafin = document.getElementById('fechafin');
var add;
document.getElementById("indef").addEventListener("click",()=>{
    add = new Date(fechaini.value).toISOString().slice(0, 10)
    actplazo = "indef";
    return fechafin.value = add;
})
document.getElementById("year").addEventListener("click",()=>{
    var hoy = new Date(fechaini.value)
    add = new Date(hoy.setFullYear(hoy.getFullYear() + 1)).toISOString().slice(0, 10)
    actplazo = "year";
    return fechafin.value = add;
})
document.getElementById("mes").addEventListener("click",()=>{
    var hoy = new Date(fechaini.value)
    add = new Date(hoy.setMonth(hoy.getMonth() + 1)).toISOString().slice(0, 10)
    actplazo = "mes";
    return fechafin.value = add;
})
document.getElementById("quincena").addEventListener("click",()=>{
    var hoy = new Date(fechaini.value)
    add = new Date(hoy.setDate(hoy.getDate() + 15)).toISOString().slice(0, 10)
    actplazo = "quincena";
    return fechafin.value = add;
})

let actplazo;
document.getElementById("fechaini").addEventListener("change", ()=>{
    switch(actplazo){
        case 'mes': 
            document.getElementById("mes").click()
        break
        case 'year': 
            document.getElementById("year").click()
        break
        case 'quincena': 
            document.getElementById("quincena").click()
        break
        case 'indef': 
            document.getElementById("indef").click()
        break
    }
})

async function bien(b) {
  
    var elbien;
    var infobien = document.getElementById("infobien");
    await fetch(api + `/bienes/${b}`)
        .then(response => response.json())
        .then((data) => elbien = data[0]);

    var html = `<br><label>Descripción: ${elbien.descripcion}</label><br>`
    if(elbien.direccion){
        html += `<label>Dirección: ${elbien.direccion}</label><br>`
    }
    infobien.innerHTML = html;
    if(elbien.trenta != ''){
        console.log(elbien.trenta)
        switch(elbien.trenta){
            case 'mes': 
                document.getElementById("mes").click()
            break
            case 'year': 
                document.getElementById("year").click()
            break
            case 'quincena': 
                document.getElementById("quincena").click()
            break
            case 'indef': 
                document.getElementById("indef").click()
            break
        }
    }
    idbien = elbien.idbien;

    cerrarmodal()
}

document.getElementById("plazo").addEventListener("change", () => {
    var tiempo = document.getElementById("plazo");
    var agrupar = document.getElementById('agrupar');
    switch(tiempo.value){
        case "2":
        return agrupar.value = 0;
        case "1":
        return agrupar.value = 1;
        case "3":
        return agrupar.value = 0;
    }
})

//Evitar el eventDefault del submit.
document.getElementById("registrar").addEventListener("click", (event) => {
    event.preventDefault();
    registrarcontrato()
})


function registrarcontrato() {
    const monto = document.getElementById('costorenta').value;
    const fechaini = document.getElementById('fechaini').value;
    const fechafin = document.getElementById('fechafin').value;
    const idplazo = document.getElementById('plazo').value;
    const agrupar = document.getElementById('agrupar').value;
    const deposito = document.getElementById('deposito').value;
    costorenta.className = "";

    if (fechaini > fechafin) {
        alert("Eliga una fecha correcto para el final del contrato!")
        return false;
    }
    if (costorenta.value == "" || costorenta.value <= 0) {
        costorenta.className = "error"
        alert("Ingrese un costo real!")
        return false;

    }
    if (fechaini == "" || fechafin == "") {
        alert("Seleccione una fecha")
        return false;
    }
    if(idbien == null || idbien == "" || idbien == undefined){
        alert("Seleccione un bien para rentar en este contrato!")
        return false;
    }
    else {
        var data = {
            idcliente: info,
            idbien,
            idfactura: 0,
            idpago: 0,
            fechaini: fechaini,
            fechafin: fechafin,
            monto: monto,
            balance: 0,
            idplazo: idplazo,
            agrupado: agrupar,
            deposito: deposito
        };

        var xhr = new XMLHttpRequest();


        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if(xhr.responseText == "nonbien"){
                    alert("Seleccione un bien para este contrato.")
                    return false;
                }
                window.location.assign(`../../vistas/consultas/clientcontrato.html?inf=${info}`);
                alert("Contrato creado correctamente");
            }
        }

        xhr.onerror = function () {
            alert("Ocurrio un problema, por favor intentelo mas tarde.")
        };

        xhr.open("POST", api + "/contratos/add");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    }

}

document.getElementById("btnbienes").addEventListener("click",(event)=>{
    event.preventDefault();
    listbienes();
})

async function listbienes() {

    await fetch(api + '/bienes/activos')
        .then(response => response.json())
        .then((data) => bienes = data);

    pintarlista(bienes)
}

var group = document.getElementById('listagrupos')
group.addEventListener('change', pintarlista)

var type = document.getElementById('listatipobienes')
type.addEventListener('change', pintarlista)

async function pintarlista() {

    let disponibles = [];

    switch (type.value) {
        case '0':
            switch (group.value) {
                case '0':
                    disponibles = bienes.filter(function (d) {
                        return d.disponible == 1
                    })
                    break
                case group.value:
                    disponibles = bienes.filter(function (d) {
                        return d.idgrupo == group.value && d.disponible == 1
                    })
                    break
            }
            break
        case type.value:
            switch (group.value) {
                case '0':
                    disponibles = bienes.filter(function (d) {
                        return d.idtipobien == type.value && d.disponible == 1
                    })
                    break
                case group.value:
                    disponibles = bienes.filter(function (d) {
                        return d.idtipobien == type.value && d.idgrupo == group.value && d.disponible == 1
                    })
                    break
            }
            break
    }


    html = `<table class="table table-bordered" id="tabbienes">
    <tr><th>Descripción</th><th>Dirección</th><th>Tipo</th><th>Grupo</th></tr>`
    disponibles.forEach(bien => {

        html +=
            `<tr>
        <td> <label>${bien.descripcion}</label></td>
        <td> <label>${bien.direccion}</label></td>
        <td> <label>${bien.nombretipo}</label></td>
        <td> <label>${bien.nombregrupo}</label></td>
        <td><a class="btn btn-dark" id="seleccionar" onclick="bien(${bien.idbien})"><i class="fas fa-check"></i></a></td>
        </tr>`
    });
    html += `</table>`

    lbienes.innerHTML = html;
}


cliente();