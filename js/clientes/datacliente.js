const infcliente = document.getElementById("infcliente");
const infcontrato = document.getElementById("contrato");
const facturas = document.getElementById("facturas");
const pagos = document.getElementById("pagos");
const listpagos = document.getElementById("listpagos");

const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

intcoma = new Intl.NumberFormat('en-US');

let datos;
var idcontrato;
let finanzas;

async function clienteinf() {
    
    await fetch(api+`/clientes/${info}`)
    .then(response => response.json())
    .then((data) => datos = data[0]);
    html = `<div class="card-header bg-primary" style="color: white;"><h3>${datos.nombre}</h3></div>`
    html += `<div class="p-4">
        <h5>ID:</h5>
        <label>${datos.idcliente}</label>
        <h5>Identificación:</h5>
        <label>${datos.cedula}</label>
        <h5>Teléfono:</h5>
        <label>${datos.telefono}</label>
    </div>
    <div class="divbtn" style="display:inline-block;">
        <a class="btn btn-dark" href="../../vistas/consultas/clientes.html"><i class="fas fa-arrow-left"></i> Volver</a>
        <a class="btn btn-primary" href="../../index.html"><i class="fas fa-home"></i> Menú</a>
    </div>`

    infcliente.innerHTML = html;
    contrato();
}


async function contrato(){
    let clicontratos;
    await fetch(api+`/contratos/${info}`)
    .then(response => response.json())
    .then((data) => clicontratos = data.contratos);
    if(clicontratos){
        let html = "";
        for(i = 0; i < clicontratos.length; i++){

            html = `<button onclick="factura(${clicontratos[i].idcontrato})"><div class="card-header bg-primary" style="color: white; text-aling:center;"><h3>Contrato #${clicontratos[i].idcontrato}</h3></div>`
            html += `<table><tr><th>ID</th><th>Descripción</th><th>Inicio</th><th>Fin</th><th>Monto alquiler</th><th>Balance contrato</th><th>Plazo</th></tr>`
            html += 
                `<tr>
                    <td><label>${clicontratos[i].idcontrato}</label></td> 
                    <td><label>${clicontratos[i].descripcion}</label></td>
                    <td><label>${clicontratos[i].fechaini}</label></td>
                    <td><label>${clicontratos[i].fechafin}</label></td>
                    <td><label>RD$${intcoma.format(clicontratos[i].monto)}</label></td>
                    <td><label>RD$${intcoma.format(clicontratos[i].balance)}</label></td>
                    <td><label>${clicontratos[i].dias}</label></td>
                </tr>`
            html += `</table></button><br><br>`
            infcontrato.innerHTML += html;
        }

    }else{
        html = `<div class="card-header bg-primary" style="color: white;"><h3>Contrato afiliado</h3></div>`
        html += `<div class="p-3"><h2>Sin contrato afiliado</h2></div>`
        infcontrato.innerHTML = html;
    }
        
}

async function factura(id){
    idcontrato = id;
    let html="";
    await fetch(api+`/consultafacturas/${id}`)
    .then(response => response.json())
    .then((data) => finanzas = data);
    
    if(finanzas.facturas[0]){
        html = `<div class="card-header bg-primary" style="color: white; text-aling:center;"><h3>Facturas-contrato: #${id}</h3></div>`
        html += `<table><tr><th>ID</th><th>Fecha generada</th><th>Monto</th><th>Concepto</th><th>Estado</th></tr>`
        finanzas.facturas.forEach(fact=>{
            html +=
            `<tr>
                <td><label>${fact.idfactura}</label></td>
                <td><label>${fact.fecha}</label></td> 
                <td><label>RD$${intcoma.format(fact.monto)}</label></td>
                <td><label>${fact.concepto}</label></td>`
            if(fact.estado == "D"){
                html+=`<td><label>Debe</label></td>
                </tr>`
            }else{
                html+=`<td><label>Pago</label></td>
                </tr>`
            }

        })
        html += 

        `<tfoot>
            <tr>
                <td COLSPAN=3>Total debe:</td>
                <td COLSPAN=2>RD$${intcoma.format(finanzas.sumdebe[0].totaldebe ? finanzas.sumdebe[0].totaldebe : 0)}</td>
            </tr>
        </tfoot>`
        html += `</table>`
        
    }else{
        html = `<div class="card-header bg-primary" style="color: white; text-aling:center;"><h3>Facturas-contrato: #${id}</h3></div>`
        html += `<table>`
        html += `<h3>Sin facturas pendientes...</h3>`
        html += `</table>`
    }

    facturas.innerHTML = html;

    pago(id);    
}

async function pago(id){
    let html="";

    if(finanzas.pagos[0]){
        html = `<button onclick="modalpagos(); listadepagos();" class="table"><div class="card-header bg-primary" style="color: white; text-aling:center;"><h3>Pagos-contrato: #${id}</h3></div>`
        html += `<table><tr><th>ID</th><th>Fecha de pago</th><th>Monto</th><th>Concepto</th></tr>`
        finanzas.pagos.forEach(pagos=>{
            html +=
            `<tr>
                <td><label>${pagos.idpago}</label></td>
                <td><label>${pagos.fecha}</label></td> 
                <td><label>RD$${intcoma.format(pagos.monto)}</label></td>
                <td><label>${pagos.concepto}</label></td>
            </tr>`
        })
        html += 
        `<tfoot>
            <tr>
                <td COLSPAN=2>Total pago:</td>
                <td COLSPAN=2>RD$${intcoma.format(finanzas.sumpago[0].totalpago)}</td>
            </tr>
        </tfoot>`
        html += `</table></button>`
        
    }else{
        html = `<div class="card-header bg-primary" style="color: white; text-aling:center;"><h3>Pagos-contrato: #${id}</h3></div>`
        html += `<table>`
        html += `<h3>Sin pagos registrados...</h3>`
        html += `</table>`
    }

    pagos.innerHTML = html;
        
}

async function listadepagos(){
    let lospagos;
    let html="";
    await fetch(api+`/consultafacturas/${idcontrato}`)
    .then(response => response.json())
    .then((data) => lospagos = data);
        html = `<table class="table table-bordered" id="tabbienes">
        <tr><th>ID</th><th>Fecha de pago</th><th>Monto</th><th>Concepto</th><th>IDFactura</th></tr>`
        lospagos.pagos.forEach(pago => {
            html +=
            `<tr>
                <td> <label>${pago.idpago}</label></td>
                <td> <label>${pago.fecha}</label></td>
                <td> <label>RD$${intcoma.format(pago.monto)}</label></td>
                <td> <label>${pago.concepto}</label></td>
                <td> <label>${pago.idfactura}</label></td>
                <td><a class="btn btn-primary" id="seleccionar" onclick="imprimir(${pago.idpago})"><i class="fas fa-print fontawe"></i></a></td>
            </tr>`
        });
        html += `</table>`
    listpagos.innerHTML = html;
    
}
function imprimir(idpago){
    window.open(`../../vistas/funciones/recibo.html?inf=${idpago}`, "Recibo", "width=1050, height=600")
}

