 const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

var idbien;
let tprint = [];
var total;
var idcliente;


var intcoma  = new Intl.NumberFormat('en-US');

async function selectcliente(){
    let cliente = [];
    await fetch(api+`/clientes/${info}`)
    .then(response => response.json())
    .then(( data) => cliente = data);
        document.getElementById("cliente").textContent += cliente[0].nombre;
        if(document.getElementById("fecha")){
            var fecha = document.getElementById("fecha")
            fecha.value = new Date().toISOString().slice(0, 10);
        }
}

if(document.getElementById('nuevo')){
    document.getElementById('nuevo').addEventListener('click', ()=>{
        window.location.assign(`../../vistas/funciones/registraringreso.html?inf=${info}`)
    })
}

//Agregar ingreso

if(document.getElementById('registrar')){
    document.getElementById('registrar').addEventListener('click', (e)=>{
        e.preventDefault();
        agregaringreso();
    })
}

async function agregaringreso(){
    var concepto = document.getElementById("concepto");
    var monto = document.getElementById("monto");
    var fecha = document.getElementById("fecha");

    if(concepto.value == "" || concepto.value == null || concepto.value == undefined){
        alert("Ingrese el concepto del ingreso.")
        return false;
    }

    if(fecha.value == "" || fecha.value == null || fecha.value == undefined){
        alert("Ingrese la fecha.")
        return false;
    }

    if(monto.value == "" || monto.value == null || monto.value == undefined){
        alert("Ingrese el monto del ingreso.")
        return false;
    }

    if(info == "" || info == null || info == undefined || info == 0){
        alert("No se detecta el cliente.")
        return false;
    }

    var data = {
        idcliente: info,
        concepto: concepto.value,
        monto: monto.value,
        fecha: fecha.value
    };

    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText == "nonbien"){
                alert("Seleccione un cliente para este ingreso.")
                return false;
            }
            window.location.assign(`../../vistas/consultas/listaingresos.html?inf=${info}`);
            alert("Ingreso registrado correctamente");
        }
    }

    xhr.onerror = function () {
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api + "/ingreso/add");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

}

//Lista de ingresos
async function listaringresos(){
    const lingresos = document.getElementById("listaingresos");
    html = "";
    let ingresos = [];
    
    await fetch(api+`/ingreso/${info}`)
    .then(response => response.json())
    .then((data) => ingresos = data)
        html = `<table class="table table-bordered" id="tabgastos">
        <tr><th>ID</th><th>Concepto</th><th>Fecha</th><th>Monto</th><th>Balance</th></tr>`
        ingresos.ingresos.forEach(ingreso => {
            html += 
            `<tr>
                <td>${ingreso.idingreso}</td>
                <td>${ingreso.concepto}</td>
                <td>${ingreso.fecha}</td>
                <td>RD$${intcoma.format(ingreso.monto)}</td>
                <td>RD$${intcoma.format(ingreso.balance)}</td>
                <td><a href="../funciones/modificaringreso.html?inf=${ingreso.idingreso}" class="btn btn-danger">Modificar</a></td>
            </tr>`
            tprint.push([ingreso.idingreso,ingreso.concepto,ingreso.fecha,intcoma.format(ingreso.monto)])
        });
        html += `
        <tfoot>
            <th COLSPAN=3>Total ingresos:</th>
            <th COLSPAN=2>RD$${intcoma.format(ingresos.total.total)}</th>
        </tfoot>
        </table>`
        total = intcoma.format(ingresos.total.total)
        lingresos.innerHTML = html;

}


//Modificar ingreso

async function selectingreso(){
    var cliente = document.getElementById("cliente")
    var concepto = document.getElementById("concepto");
    var monto = document.getElementById("monto");
    var balance = document.getElementById("balance");
    var fecha = document.getElementById("fecha");
    html = "";
    let elingreso = [];
    await fetch(api+`/ingreso/select/${info}`)
    .then(response => response.json())
    .then(( data) => elingreso = data);
        cliente.textContent = elingreso.nombre;
        concepto.value = elingreso.concepto;
        monto.value = elingreso.monto;
        balance.value = elingreso.balance;
        fecha.value = elingreso.fecha;
        idcliente = elingreso.idcliente;

        
}

if(document.getElementById('actualizar')){
    document.getElementById('actualizar').addEventListener('click', (e)=>{
        e.preventDefault();
        actualizaringreso();
    })
}

async function actualizaringreso(){
    var concepto = document.getElementById("concepto");
    var monto = document.getElementById("monto");
    var balance = document.getElementById("balance");
    var fecha = document.getElementById("fecha");

    if(concepto.value == "" || concepto.value == null || concepto.value == undefined){
        alert("Ingrese el concepto del ingreso.")
        return false;
    }

    if(fecha.value == "" || fecha.value == null || fecha.value == undefined){
        alert("Ingrese el concepto del ingreso.")
        return false;
    }

    if(monto.value == "" || monto.value == null || monto.value == undefined){
        alert("Ingrese el monto del ingreso.")
        return false;
    }

    if(balance.value == "" || balance.value == null || balance.value == undefined){
        alert("Ingrese el balance del ingreso.")
        return false;
    }

    if(info == "" || info == null || info == undefined || info == 0){
        alert("No se detecta el bien.")
        return false;
    }

    var data = {
        idingreso: info,
        concepto: concepto.value,
        monto: monto.value,
        balance: balance.value,
        fecha: fecha.value
    };

    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText == "nonbien"){
                alert("Sin ingreso seleccionado.")
                return false;
            }
            window.location.assign(`../../vistas/consultas/listaingresos.html?inf=${idcliente}`);
            alert("Ingreso modificado correctamente");
        }
    }

    xhr.onerror = function () {
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api + "/ingreso/update");
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
    var mensaje = confirm("¿Seguro que desea eliminar este ingreso?"); 
    if (mensaje) {
        var data = {
            id: info,
            tipo: 'Ingreso',
        };
    
        var xhr = new XMLHttpRequest();
    
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.location.assign(`../../vistas/consultas/listaingresos.html?inf=${idcliente}`);
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

//Imprimir
if(document.getElementById('imprimir')){
    document.getElementById('imprimir').addEventListener('click',()=>{
        imprimir()
    })
}

function imprimir(){
    var titulo = document.getElementById('cliente').textContent
    var ventana = window.open('', 'PRINT', 'height=600,width=800');
    ventana.document.write(`<html><head>    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="../../style/main.css">
    <title>Imprimir reporte</title>`);
    ventana.document.write('</head><body class="reporte">');
    ventana.document.write('<h1 class="title">Ingresos de '+titulo+'</h1>');
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
        <th COLSPAN=2>Total ingresos:</th>
        <th COLSPAN=2>RD$${total}</th>
    </tfoot>
    </table>`);
    ventana.document.write('</body></html>');
    ventana.focus();
    ventana.print();
    ventana.close();
    return true;

    
}

//Ingresos por grupo

async function infgrupo(){
    var grupo = [];
    await fetch(api+`/bienes/grupo/${info}`)
    .then(response => response.json())
    .then(( data) => grupo = data);
        document.getElementById('ngrupo').textContent = grupo.nombre;
        grupoingresos()
}

async function grupoingresos(){
    const lclientes = document.getElementById('lclientes');
    let clientes = [];
    html = "";

    await fetch(api+`/ingreso/grupo/${info}`)
    .then(response => response.json())
    .then((data)=> clientes = data)
    html = `<table class="table table-bordered" id="tabgastos">
    <tr><th>ID</th><th>Nombre</th><th>Bien</th><th>Total</th></tr>`
    clientes.forEach(cliente => {
        html += 
        `<tr>
            <td>${cliente.idcliente}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.bien}</td>
            <td>RD$${intcoma.format(cliente.tingresos)}</td>
            <td><a href="../consultas/listaingresos.html?inf=${cliente.idcliente}" class="btn btn-dark">Ingresos</a></td>
        </tr>`
    });
    html += `</table>`
    lclientes.innerHTML = html;
    
}