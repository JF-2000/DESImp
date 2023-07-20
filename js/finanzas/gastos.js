const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');
var idbien;
let tprint = [];
var total;

var intcoma  = new Intl.NumberFormat('en-US');

async function selectgrupo(){
    let grupo = [];
    await fetch(api+`/bienes/grupo/${info}`)
    .then(response => response.json())
    .then(( data) => grupo = data);
        document.getElementById("grupo").textContent += grupo.nombre;
        if(document.getElementById("fecha")){
            var fecha = document.getElementById("fecha")
            fecha.value = new Date().toISOString().slice(0, 10);
        }
        if(document.getElementById("desde") && document.getElementById("hasta")){
            var desde = document.getElementById("desde");
            var hasta = document.getElementById("hasta");

            if(sessionStorage.getItem("desde") || sessionStorage.getItem("hasta")){
                if(sessionStorage.getItem("desde")){
                    desde.value = sessionStorage.getItem("desde");
                }
                if(sessionStorage.getItem("hasta")){
                    hasta.value = sessionStorage.getItem("hasta");
                }
                listargastos();
            }else{
                var mespass = new Date()
                desde.value = new Date(mespass.setMonth(mespass.getMonth()-1)).toISOString().slice(0,10);
                hasta.value = new Date().toISOString().slice(0,10);
                listargastos();
            }
            
        }
}

if(document.getElementById('nuevo')){
    document.getElementById('nuevo').addEventListener('click', ()=>{
        window.location.assign(`../../vistas/funciones/registrargasto.html?inf=${info}`)
    })
}

//Agregar gasto

if(document.getElementById('registrar')){
    document.getElementById('registrar').addEventListener('click', (e)=>{
        e.preventDefault();
        agregargasto();
    })
}

async function agregargasto(){
    var concepto = document.getElementById("concepto");
    var monto = document.getElementById("monto");
    var fecha = document.getElementById("fecha");

    if(concepto.value == "" || concepto.value == null || concepto.value == undefined){
        alert("Ingrese el concepto del gasto.")
        return false;
    }

    if(fecha.value == "" || fecha.value == null || fecha.value == undefined){
        alert("Ingrese fecha.")
        return false;
    }

    if(monto.value == "" || monto.value == null || monto.value == undefined){
        alert("Ingrese el monto del gasto.")
        return false;
    }

    if(info == "" || info == null || info == undefined || info == 0){
        alert("No se detecta el bien.")
        return false;
    }

    var data = {
        idgrupo: info,
        concepto: concepto.value,
        monto: monto.value,
        fecha: fecha.value
    };

    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText == "nonbien"){
                alert("Seleccione un bien para este gasto.")
                return false;
            }
            window.location.assign(`../../vistas/consultas/listagastos.html?inf=${info}`);
            alert("Gasto registrado correctamente");
        }
    }

    xhr.onerror = function () {
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api + "/gastos/add");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

}

if(document.getElementById("filtrar")){
    document.getElementById("filtrar").addEventListener('click',()=>{
        listargastos();
    })
}

//Lista de gastos
async function listargastos(){
    const lgastos = document.getElementById("listagastos");
    var desde = document.getElementById("desde");
    var hasta = document.getElementById("hasta");
    html = "";
    let gastos = [];
    
    if(info == null || info == undefined || info == ""){
        alert("No se detecta el identificador del grupo seleccionado.")
        return false;
    }
    if(desde == null || desde == undefined || desde == ""){
        alert("No se puede validar la fecha desde.")
        return false;
    }
    if(hasta == null || hasta == undefined || hasta == ""){
        alert("No se puede validar la fecha hasta.")
        return false;
    }

    var data = {
        idgrupo: info,
        desde: desde.value,
        hasta: hasta.value,
    };

    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText == "nonid"){
                alert("Ocurrio un problema al identificar el ID.")
                return false;
            }
            gastos = await JSON.parse(xhr.response);

            html = `<table class="table table-bordered" id="tabgastos">
            <tr><th>ID</th><th>Concepto</th><th>Fecha</th><th>Monto</th></tr>`
            gastos.gastos.forEach(gasto => {
              html += 
              `<tr>
                    <td>${gasto.idgasto}</td>
                    <td>${gasto.concepto}</td>
                    <td>${gasto.fecha}</td>
                    <td>RD$${intcoma.format(gasto.monto)}</td>
                    <td><a href="../funciones/modificargasto.html?inf=${gasto.idgasto}" class="btn btn-danger">Modificar</a></td>
              </tr>`
              tprint.push([gasto.idgasto,gasto.concepto,gasto.fecha,intcoma.format(gasto.monto)])
            });
            html += `
            <tfoot>
                <th COLSPAN=2>Total gastos:</th>
                <th COLSPAN=2>RD$${intcoma.format(gastos.total.total)}</th>
            </tfoot>
            </table>`
            total = intcoma.format(gastos.total.total)
            lgastos.innerHTML = html;
        }
    }

    xhr.onerror = function () {
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api + "/gastos");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

}


//Modificar gasto
async function selectgasto(){
    var elgrupo = document.getElementById("bien")
    var concepto = document.getElementById("concepto");
    var monto = document.getElementById("monto");
    var fecha = document.getElementById("fecha");
    html = "";
    let elgasto = [];
    await fetch(api+`/gasto/${info}`)
    .then(response => response.json())
    .then(( data) => elgasto = data);
        elgrupo.textContent = elgasto.nombre;
        concepto.value = elgasto.concepto;
        monto.value = elgasto.monto;
        fecha.value = elgasto.fecha;
        idgrupo = elgasto.idgrupo;
        
}

if(document.getElementById('actualizar')){
    document.getElementById('actualizar').addEventListener('click', (e)=>{
        e.preventDefault();
        actualizargasto();
    })
}

async function actualizargasto(){
    var concepto = document.getElementById("concepto");
    var monto = document.getElementById("monto");
    var fecha = document.getElementById("fecha");

    if(concepto.value == "" || concepto.value == null || concepto.value == undefined){
        alert("Ingrese el concepto del gasto.")
        return false;
    }

    if(fecha.value == "" || fecha.value == null || fecha.value == undefined){
        alert("Ingrese el concepto del gasto.")
        return false;
    }

    if(monto.value == "" || monto.value == null || monto.value == undefined){
        alert("Ingrese el monto del gasto.")
        return false;
    }

    if(info == "" || info == null || info == undefined || info == 0){
        alert("No se detecta el bien.")
        return false;
    }

    var data = {
        idgasto: info,
        idgrupo: idgrupo,
        concepto: concepto.value,
        monto: monto.value,
        fecha: fecha.value
    };

    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText == "nonbien"){
                alert("Sin gasto seleccionado.")
                return false;
            }
            window.location.assign(`../../vistas/consultas/listagastos.html?inf=${info}`);
            alert("Gasto modificado correctamente");
        }
    }

    xhr.onerror = function () {
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api + "/gastos/update");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

if(document.getElementById('borrar')){
    document.getElementById('borrar').addEventListener('click',()=>{
        borrar();
    })
}


async function borrar(){
    var mensaje = confirm("¿Seguro que desea eliminar este gasto?"); 
    if (mensaje) {
        var data = {
            id: info,
            tipo: 'Gasto',
        };
    
        var xhr = new XMLHttpRequest();
    
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign(`../../vistas/consultas/listagastos.html?inf=${info}`);
                alert("Gasto eliminado correctamente");
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

if(document.getElementById('imprimir')){
    document.getElementById('imprimir').addEventListener('click',()=>{
        imprimir()
    })
}

function imprimir(){
    var desde = document.getElementById("desde");
    var hasta = document.getElementById("hasta");
    var titulo = document.getElementById('grupo').textContent
    var ventana = window.open('', 'PRINT', 'height=600,width=800');
    ventana.document.write(`<html><head>    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="../../style/main.css">
    <title>Imprimir reporte</title>`);
    ventana.document.write('</head><body class="reporte">');
    ventana.document.write('<h1 class="title">Gastos de '+titulo+'</h1>');
    ventana.document.write(`<h2 class="title">Reporte Desde: ${desde.value} | Hasta: ${hasta.value} </h2>`);
    ventana.document.write(`<table class="table table-bordered" id="tabgastos">
    <tr><th>ID</th><th>Concepto</th><th>Fecha</th><th>Monto</th></tr>`);
    for(var i = 0; i < tprint.length; i++){
        ventana.document.write(`<tr>
        <td>${tprint[i][0]}</td>
        <td>${tprint[i][1]}</td>
        <td>${tprint[i][2]}</td>
        <td>RD$${tprint[i][3]}</td>
        </tr>`)
    }
    ventana.document.write(`
    <tfoot>
        <th COLSPAN=2>Total gastos:</th>
        <th COLSPAN=2>RD$${total}</th>
    </tfoot>
    </table>`);
    ventana.document.write('</body></html>');
    ventana.focus();
    ventana.print();
    ventana.close();
    return true;

    
}