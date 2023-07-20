var desde = document.getElementById('desde');
var hasta = document.getElementById('hasta');
const infofin = document.getElementById('infofin');
var reporte = [];

const intcoma = new Intl.NumberFormat('en-US');

function asigfecha(){
    if(sessionStorage.getItem("desde") || sessionStorage.getItem("hasta")){
        if(sessionStorage.getItem("desde")){
            desde.value = sessionStorage.getItem("desde");
        }
        if(sessionStorage.getItem("hasta")){
            hasta.value = sessionStorage.getItem("hasta");
        }
        beneficiosgrupos();
    }else{
        var mespass = new Date()
        desde.value = new Date(mespass.setMonth(mespass.getMonth()-1)).toISOString().slice(0,10);
        hasta.value = new Date().toISOString().slice(0,10);
        beneficiosgrupos();
    }

}

document.getElementById('filtrar').addEventListener('click',()=>{
    beneficiosgrupos();
})

function imprimir(id){
    var inip = desde.value;
    var finp = hasta.value;
    for(x = 0; x < reporte.length; x++ ){
        if(reporte[x][0] == id){
            var ventana = window.open('', 'PRINT', 'height=600,width=800');
            ventana.document.write(`<html><head>    <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <link rel="stylesheet" href="../../style/main.css">
            <link rel="stylesheet" href="../../style/fontasome.css">
            <script src="../../js/herramientas/buscar.js"></script>
            <title>Imprimir reporte</title>`);
            ventana.document.write('</head><body class="recibo">');
            ventana.document.write(`
            <div>
                <h1 style="text-align: center;">Reporte</h1>
            <div class="row">
                <div class="col-8">
                    <h2>INMOBILIARIA ABREU GARCIA S.R.L.</h2>
                </div>
                <div class="col-4">
                    <h4>RNC: 132048156</h4>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="col-5">
                    <h4>Grupo: ${reporte[x][1]}</h4>
                </div>
                <div class="col-2">
                    <h4>ID: ${reporte[x][0]}</h4>
                </div>
                <div class="col-5">
                    <h4>Periodo: ${inip} / ${finp}</h4>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <h4>Total cobros: RD$${intcoma.format(reporte[x][2])}</h4>
                </div>
                <div class="col-4">
                    <h4>Total gastos: RD$${intcoma.format(reporte[x][3])}</h4>
                </div>
                <div class="col-4">
                    <h4>Total beneficios: RD$${intcoma.format(reporte[x][4])}</h4>
                </div>
            </div>
            <hr /><br>
        </div>'`);
            ventana.document.write('</body></html>');
            ventana.focus();
            ventana.print();
            ventana.close();
            return true;
        }
    }
    
}

async function beneficiosgrupos(){
    var benegrupo = [];

    var data = {
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
            benegrupo = await JSON.parse(xhr.response);

            var tingresos = 0;
            var tpagos = 0;
            var tgastos = 0;
            var tbeneficio = 0;
            html = `<table class="table table-bordered" id="tabgastos">
            <tr class="titabla"><th>ID</th><th>Grupo</th><th>Otros ingresos</th><th>Cobros</th><th>Gastos</th><th>Beneficios</th></tr>`
            benegrupo.forEach(generado => {
              html += 
              ` <tr>
                    <td>${generado.idgrupo}</td>
                    <td>${generado.nombre}</td>`
                if(generado.ingresos == null){
                    generado.ingresos = 0
                    html += `<td>${intcoma.format(generado.ingresos)}</td>`
                }else{
                    html += `<td><a href="../../vistas/consultas/ingresosgrupo.html?inf=${generado.idgrupo}">${intcoma.format(generado.ingresos)}</a></td>`
                }
                    if(generado.pagos == null){
                        generado.pagos = 0
                        html += `<td>${intcoma.format(generado.pagos)}</td>`
                        
                    }else{
                        html += `<td><a href="../../vistas/consultas/pagosgrupo.html?inf=${generado.idgrupo}">${intcoma.format(generado.pagos)}</a></td>`
                    }
                    if(generado.gastos == null){
                        generado.gastos = 0
                        html += `<td>${intcoma.format(generado.gastos)}</td>`
                    }else{
                        html += `<td><a href="../../vistas/consultas/listagastos.html?inf=${generado.idgrupo}">${intcoma.format(generado.gastos)}</a></td>`
                    }
                html += ` <td>${intcoma.format(generado.pagos - generado.gastos)}</td>
                    <td style="width: 60px"><a class="btn btn-dark" onclick="imprimir(${generado.idgrupo})">Imprimir</a></td>
                </tr>`
                tingresos += generado.ingresos
                tpagos += generado.pagos
                tgastos += generado.gastos
                tbeneficio += generado.pagos - generado.gastos
                reporte.push([generado.idgrupo,generado.nombre,generado.pagos, generado.gastos, generado.pagos - generado.gastos])
            });
            html += `
            <tfoot>
                <th COLSPAN=2>Total:</th>
                <th>RD$${intcoma.format(tingresos)}</th>
                <th>RD$${intcoma.format(tpagos)}</th>
                <th>RD$${intcoma.format(tgastos)}</th>
                <th>RD$${intcoma.format(tbeneficio)}</th>
            </tfoot>
            </table>`

            infofin.innerHTML = html;
        }
    }

    xhr.onerror = function () {
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api + "/reporte/benegrupos");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}
