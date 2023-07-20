const pago = document.getElementById("idpago");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const contfactura = document.getElementById("contenidofactura");

const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

intcoma = new Intl.NumberFormat('en-US')

var idcontrato;
let infrecibo = [];

async function constructrecibo() {
    
    let html = "";
    await fetch(api + `/pago/recibo/${info}`)
        .then(response => response.json())
        .then((data) => infrecibo = data[0])
            pago.textContent = infrecibo.idpago;
            fecha.textContent = infrecibo.fecha;
            hora.textContent = infrecibo.hora;
            idcontrato = infrecibo.idcontrato;
            html = `
            <div class="row my-4">
                <div class="inline-block col-6">
                    <label class="enunciado">Recibí de: </label><label class="llenado"> ${infrecibo.nombre}.</label>
                </div>
                <div class="inline-block col-3">
                    <label class="enunciado">Contrato No: </label><label class="llenado"> ${infrecibo.idcontrato}.</label>
                </div>
                <div class="inline-block col-3">
                    <label class="enunciado">Factura No: </label><label class="llenado"> ${infrecibo.idfactura}.</label>
                </div>
            </div>
            <div class="row my-4">
                <div class="inline-block col-7">
                    <label class="enunciado">Referente a: </label><label class="llenado"> ${infrecibo.descripcion}.</label>
                </div>
                <div class="inline-block col-5">`

                switch(infrecibo.formapago){
                    case "EF":
                        html += `<label class="enunciado">Forma de pago:</label><label class="llenado">Efectivo.</label>`
                    break
                    case "TC":
                        html += `<label class="enunciado">Forma de pago:</label><label class="llenado">Tarjeta de crédito.</label>`
                    break
                    case "DE":
                        html += `<label class="enunciado">Forma de pago:</label><label class="llenado">Depósito.</label>`
                    break
                    case "TR":
                        html += `<label class="enunciado">Forma de pago:</label><label class="llenado">Transferencia.</label>`
                    break
                    case "NC":
                        html += `<label class="enunciado">Forma de pago:</label><label class="llenado">Nota de crédito.</label>`
                    break
                    case "DA":
                        html += `<label class="enunciado">Forma de pago:</label><label class="llenado">Depósito alquiler.</label>`
                    break
                }
            html +=`</div>
            </div>
            <div class="row my-4">
                <div class="inline-block col-4">
                    <label class="enunciado">Fecha factura: </label><label class="llenado"> ${infrecibo.fechafactura}.</label>
                </div>
                <div class="inline-block col-4">
                    <label class="enunciado">Concepto: </label><label class="llenado"> ${infrecibo.concepto}.</label>
                </div>
                <div class="inline-block col-4">
                    <label class="enunciado">Monto:</label><label class="llenado"> RD$${intcoma.format(infrecibo.monto)}.</label>
                </div>
            </div>
            `
        contfactura.innerHTML = html;
    


        

}

function imprimirElemento() {
    var contenido = document.getElementById("recibo").innerHTML;
    document.body.innerHTML = contenido;
    window.print();
    window.location.reload();
    return true;
}

document.getElementById("imprimir").addEventListener("click", function() {
    var div = document.getElementById("recibo");
    imprimirElemento(div);
});