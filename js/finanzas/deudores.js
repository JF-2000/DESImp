const listacliente = document.getElementById("listacliente");
const listafacturas= document.getElementById("listafacturas");
const filtro = document.getElementById("filtronombre");
let clientes = [];
var group;

const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

var intcoma = new Intl.NumberFormat('en-US');

async function listarclientes() {
  await fetch(api+'/clientesfacturas')
  .then(response => response.json())
  .then((data) => clientes = data);
    setTimeout(pintarlist, 1000)
}

if(document.getElementById('listagrupos')){
  group = document.getElementById('listagrupos')
  group.addEventListener('change',pintarlist)
}


async function pintarlist(){
  let filtro = [];
  switch(group.value){
    case "0":
      filtro = clientes;
    break
    case group.value:
      filtro = clientes.filter(function(f){
        return f.idgrupo == group.value;
      })
    break
  }


  html = `<table class="table table-bordered" id="tabclientes">
  <tr><th>ID</th><th>Nombre</th><th>Identificación</th><th>Teléfono</th><th>Grupo</th><th>Balance</th></tr>`
  filtro.forEach(cliente => {
    html +=
      `<tr>
    <td> <label>${cliente.idcliente}</label></td>
      <td> <label>${cliente.nombre}</label></td>
      <td> <label>${cliente.cedula}</label></td>
      <td> <label>${cliente.telefono}</label></td>
      <td> <label>${cliente.nombregrupo}</label></td>
      <td> <label>RD$${intcoma.format(cliente.balance)}</label></td>
      <td><a href="../../vistas/consultas/clientcontrato.html?inf=${cliente.idcliente}" class="btn btn-dark">Contratos</a></td>
    </tr>`;
  });
  html += `</table>`
  
  document.getElementById("loader").style.display = "none";
  listacliente.innerHTML = html;
}

async function listarfacturas() {
  var html = "";
  let facturas = [];
  await fetch(api+`/facturas/${info}`)
  .then(response => response.json())
  .then((data) => facturas = data)
    if(facturas.facturas == 0){
      html = `<h1 class="noti">Sin facturas pendientes...</h1>`
    }else{
      html = `<table class="table table-bordered" id="tabclientes">
      <tr><th>ID</th><th>Descripción</th><th>Fecha</th><th>Concepto</th><th>Monto</th></tr>`
      facturas.facturas[0].forEach( factura => {
        html +=
        `<tr>
          <td> <label>${factura.idfactura}</label></td>
          <td> <label>${factura.descripcion}</label></td>
          <td> <label>${factura.fecha}</label></td>
          <td> <label>${factura.concepto}</label></td>
          <td> <label>RD$${intcoma.format(factura.monto)}</label></td>
          <td style=" width: 60px"><a class="btn btn-primary" onclick="clickpago(); unafactura(${factura.idfactura});">Pagar</a></td>
          <td style=" width: 60px"><a class="btn btn-success" onclick="abonafactura(); abono(${factura.idfactura});">Abonar</a></td>
          <td style=" width: 60px"><a class="btn btn-warning" onclick="modfactura(); modificarfactura(${factura.idfactura})">Editar</a></td>          
        </tr>`
      });
      html += `<tfoot>
          <tr>
            <td COLSPAN=2>Facturas generadas:</td>
            <td COLSPAN=1>${facturas.cantfacturas[0].cantfacturas}</td>
            <td COLSPAN=3>Balance general del contrato:</td>
            <td COLSPAN=2>RD$${intcoma.format(facturas.facturas[0][0].balance)}</td>
          </tr>
        </tfoot>
      </table>`
    }

  listafacturas.innerHTML = html;
}

if(document.getElementById("adelanto")){
  document.getElementById("adelanto").addEventListener("click",()=>{
    var msj = confirm("¿Seguro que desea adelantar una factura?"); 
    if(msj){
      adelanto();
    }
    
  })
}

async function adelanto() {
  await fetch(api+`/facturas/adelanto/${info}`)
  window.location.reload();
}

if(document.getElementById("back")){
  document.getElementById("back").addEventListener("click",()=>{
    back();
  })
}

async function back(){
  let cliente = [];
  await fetch(api+`/contratos/capturar/${info}`)
  .then(response => response.json())
  .then((data) => cliente = data)
  window.location.assign(`../../vistas/consultas/clientcontrato.html?inf=${cliente.contrato[0].idcliente}`)
}
