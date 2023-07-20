const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

intcoma = new Intl.NumberFormat('en-US');

async function datosgrupo(){
    let listclientesgrupo = [];
    let html = "";
    const lista = document.getElementById("listgrupo")
    await fetch(api+`/clientes/grupo/${info}`)
    .then(response => response.json())
    .then((data) => listclientesgrupo = data)
    if(listclientesgrupo.length == 0){
        html = `<h1 class="noti">Sin clientes...</h1>`
    }else{
        html = `<table class="table table-bordered" id="tabclientes">
        <tr><th>ID</th><th>Nombre</th><th>Identificación</th><th>Teléfono</th><th>Bien alquilado</th><th>Grupo</th><th>Balance</th><th>Facturas por generar</th></tr>`
        listclientesgrupo.forEach(cliente => {
            html += 
            `<tr>
            <td> <label>${cliente.idcliente}</label></td>
            <td> <a class="a-btn" href="../../vistas/consultas/datacliente.html?inf=${cliente.idcliente}">${cliente.nombre}</a></td>
            <td> <label>${cliente.cedula}</label></td>
            <td> <label>${cliente.telefono}</label></td>
            <td> <label>${cliente.descripcion}</label></td>
            <td> <label>${cliente.gnombre}</label></td>
            <td> <label>RD$${intcoma.format(cliente.balance)}</label></td>
            <td> <label>${cliente.facturasg}</label></td>
            <td><a class="btn btn-primary" href="../consultas/facturascontrato.html?inf=${cliente.idcontrato}">Facturas</a></td>
            </tr>`
        });
        html += `</table>`
        document.getElementById("titulo").textContent += listclientesgrupo[0].gnombre
    }
    lista.innerHTML = html;

}