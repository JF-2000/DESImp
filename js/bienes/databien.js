const infbien = document.getElementById("infbien");
const infcontrato = document.getElementById("contrato");
const infcliente = document.getElementById("cliente");
const finanza = document.getElementById("finanza");

const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');
var intcoma = new Intl.NumberFormat('en-US')

let datos;
var idcontrato;
let finanzas;

async function bieninf() {
    let html = "";
    await fetch(api+`/databien/${info}`)
    .then(response => response.json())
    .then((data) => datos = data);
    html = `<div class="card-header bg-primary" style="color: white;"><h3>${datos.bien.descripcion}</h3></div>`
    html += `<div class="p-4">
   
        <h5>ID:</h5>
        <label>${datos.bien.idbien}</label>
        <h5>Dirección:</h5>
        <label>${datos.bien.direccion}</label>
        <h5>Tipo:</h5>
        <label>${datos.bien.nombretipo}</label>
        <h5>Grupo:</h5>
        <label>${datos.bien.nombregrupo}</label>
        <h5>Disponibilidad:</h5>
        <label>${datos.bien.disponible ? 'Disponible':'Alquilado'}</label>

    </div>` 
    html += `<div>
    <a class="btn btn-dark" href="../../vistas/consultas/listabienes.html"><i class="fas fa-arrow-left"></i> Volver</a>
    <a class="btn btn-primary" href="../../index.html"><i class="fas fa-home"></i> Menú</a>
    </div>`    
    if(datos.contrato == undefined){
        idcontrato = "non"
    }else{
        idcontrato = datos.contrato.idcontrato;
    }

    infbien.innerHTML = html;
    contrato();
    cliente();
    ultpago();

}

async function cliente(){
    let html = "";
    if(datos.contrato != undefined){
        html = `<div class="card-header bg-primary" style="color: white;"><h3>Cliente</h3></div>`
        html += `<div class="p-3">
    
        <h5>ID:</h5><label> ${datos.contrato.idcliente}</label><br>
        <h5>Nombre:</h5><label> ${datos.contrato.nombrecliente}</label><br>
        <h5>Identificación/Pasaporte:</h5><label> ${datos.contrato.cedula}</label><br>
        <h5>Teléfono:</h5><label> ${datos.contrato.telefono}</label><br>
        
        </div>`
    
        infcliente.innerHTML = html;
            
    }else{
        html = `<div class="card-header bg-primary" style="color: white;"><h3>Cliente</h3></div>`
        html += `<div class="p-3"><h2>Sin cliente</h2></div>`
        infcliente.innerHTML = html;
    }

}

async function contrato(){
    let html = "";
    if(datos.contrato != undefined){
        html = `<a class="a-btn" href="../../vistas/consultas/clientcontrato.html?inf=${datos.contrato.idcliente}"><div class="card-header bg-primary" style="color: white;"><h3>Contrato</h3></div>`
        html += `<div class="p-3">

            <h5>ID:</h5><label> ${datos.contrato.idcontrato}</label><br>
            <h5>Cliente:</h5><label> ${datos.contrato.nombrecliente}</label><br>
            <h5>Fecha de inicio:</h5><label> ${datos.contrato.fechaini}</label><br>
            <h5>Fecha de fin:</h5><label> ${datos.contrato.fechafin}</label><br>
            <h5>Contrato finaliza en:</h5><label> ${datos.contrato.contratovence} Días</label><br>
            <h5>Monto de alquiler:</h5><label> RD$${intcoma.format(datos.contrato.monto)} al ${datos.contrato.plazo}</label><br>
            <h5>Balance:</h5><label> RD$${intcoma.format(datos.contrato.balance)}</label><br>

        </div></a>`

        infcontrato.innerHTML = html;
    }else{
        html = `<div class="card-header bg-primary" style="color: white;"><h3>Contrato</h3></div>`
        html += `<div class="p-3"><h2>Sin contrato</h2></div>`
        infcontrato.innerHTML = html;
    }
        
}

document.getElementById("facturas").addEventListener("click", ()=>{
    factura()
})
document.getElementById("pagos").addEventListener("click", ()=>{
    ultpago()
})

async function factura(){
    let html = "";
    if(idcontrato == "non"){
        return false
    }else{
        await fetch(api+`/factbien/${idcontrato}`)
        .then(response => response.json())
        .then((data) => finanzas = data);
        if(finanzas.facturas[0].idfactura){
            finanzas.facturas.forEach(facturar => {
                html += `<div class="card-header bg-primary" style="color: white;"><h4>Factura-ID:${facturar.idfactura}</h4></div>
                <div>
                <label>Cuando se generó: ${facturar.fechaf}</label><br>
                <label>Monto: RD$${intcoma.format(facturar.montof)}</label><br>
                <label>Concepto: ${facturar.conceptof}</label><br>`
                switch(facturar.estado){
                    case 'D':
                        html += `<label>Estado: Debe</label><br>
                        </div>`
                    break
                    case 'P':
                        html += `<label>Estado: Pago</label><br>
                        </div>`
                    break

                }
            });
        }else{
            html = "<label>Sin facturas registradas...</label>";
        }

        finanza.innerHTML = html;
    }
}

async function ultpago(){
    let html = "";
    if(idcontrato == "non"){
        return false
    }else{
        await fetch(api+`/factbien/${idcontrato}`)
        .then(response => response.json())
        .then((data) => finanzas = data);
        if(finanzas.pagos[0].idpago){
            finanzas.pagos.forEach(pagos => {
                html += `<div class="card-header bg-primary" style="color: white;"><h4>Pago-ID:${pagos.idpago}</h4></div>
                <div>
                <label>El pago se realizó: ${pagos.fechap}</label><br>
                <label>Monto: RD$${intcoma.format(pagos.montop)}</label><br>
                <label>Recibido por: ${pagos.recibidopor}</label><br>
                <label>Pagado por: ${pagos.pagopor}</label><br>
                <label>Balance despues del pago: RD$${intcoma.format(pagos.balancep)}</label><br>
                </div>`
            });
        }else{
            html = "<label>Sin pagos registrados...</label>";
        }

        finanza.innerHTML = html;
    }
}


