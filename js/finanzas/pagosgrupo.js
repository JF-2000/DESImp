var desde = document.getElementById('desde');
var hasta = document.getElementById('hasta');
const lpagos = document.getElementById('lpagos');

const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

intcoma = new Intl.NumberFormat('en-US')

async function asigfecha(){
    let grupo = [];
    await fetch(api + `/bienes/grupo/${info}`)
    .then(response => response.json())
    .then((data) => grupo = data )
        document.getElementById('ngrupo').textContent = grupo.nombre;
    
    if(sessionStorage.getItem("desde") || sessionStorage.getItem("hasta")){
        if(sessionStorage.getItem("desde")){
            desde.value = sessionStorage.getItem("desde");
        }
        if(sessionStorage.getItem("hasta")){
            hasta.value = sessionStorage.getItem("hasta");
        }
        pagosgrupo();
    }else{
        var mespass = new Date()
        desde.value = new Date(mespass.setMonth(mespass.getMonth()-1)).toISOString().slice(0,10);
        hasta.value = new Date().toISOString().slice(0,10);
        pagosgrupo();
    }

}

async function pagosgrupo(){
    var pagosG = [];

    var data = {
        idgrupo: info,
        desde: desde.value,
        hasta: hasta.value
    };

    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.responseText == "err"){
                alert("Ocurrio un problema al ejecutar la ocnsulta, verifique la información.")
                return false;
            }
            pagosG = await JSON.parse(xhr.response);

            var tpagos = 0;

            html = `<table class="table table-bordered" id="tabgastos">
            <tr"><th>ID</th><th>Cliente</th><th>Bien</th><th>Fecha del pago</th><th>Fecha de factura</th><th>Monto</th></tr>`
            pagosG.forEach(generado => {
              html += 
              ` <tr>
                    <td>${generado.idpago}</td>
                    <td>${generado.cliente}</td> 
                    <td>${generado.descripcion}</td> 
                    <td>${generado.fecha}</td>
                    <td>${generado.fechafactura}</td>
                    <td>RD$${intcoma.format(generado.monto)}</td> 
                </tr>`

                tpagos += generado.monto
            });
            html += `
            <tfoot>
                <th COLSPAN=3>Total:</th>
                <th COLSPAN=3>RD$${intcoma.format(tpagos)}</th>
            </tfoot>
            </table>`

            lpagos.innerHTML = html;
        }
    }

    xhr.onerror = function () {
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api + "/pagos/grupo");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

if(document.getElementById('imprimir')){
    document.getElementById('imprimir').addEventListener('click',()=>{
        imprimir()
    })
}

function imprimir(){

    var tabla = document.getElementById('lpagos').innerHTML
    var titulo = document.getElementById('ngrupo').textContent
    var ventana = window.open('', 'PRINT', 'height=600,width=800');
    ventana.document.write(`<html><head>    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="../../style/main.css">
    <title>Imprimir reporte</title>`);
    ventana.document.write('</head><body class="reporte">');
    ventana.document.write('<h1 class="title">Cobros de '+titulo+'</h1>');
    ventana.document.write(`<h2 class="title">Reporte Desde: ${desde.value} | Hasta: ${hasta.value} </h2>`);
    ventana.document.write(tabla);
    ventana.document.write('</body></html>');
    ventana.focus();
    ventana.print();
    ventana.close();
    return true;

    
}