const listacliente = document.getElementById("listacliente");
const listacontratos = document.getElementById("listacontratos");
const filtro = document.getElementById("filtronombre");

day = new Date();
day.format

const url = window.location.search;
let searchParams = new URLSearchParams(url);
const info = searchParams.get('inf');

intcoma = new Intl.NumberFormat('en-US');

let clientes = [];
let contrato = [];

async function listarclientes() {

  await fetch(api+'/clientes/contratos')
  .then(response => response.json())
  .then((data) => clientes = data);
  html = `<table class="table table-bordered" id="tabclientes">
  <tr><th>Nombre</th><th>Identificación</th></tr>`
  clientes.forEach(cliente => {
    html += 
    `<tr>
     <td><a href="../../vistas/funciones/modificarcliente.html?inf=${cliente.idcliente}">${cliente.nombre}</a></td>
      <td> <label>${cliente.cedula}</label></td>
      <td><a href="../consultas/clientcontrato.html?inf=${cliente.idcliente}" class="btn btn-dark">Contratos</a></td>
    </tr>`
  });
  html += `</table>`

  listacliente.innerHTML = html;

}

async function listarcontratos() {
    await fetch(api+`/contratos/${info}`)
    .then(response => response.json())
    .then((data) => Data = data);
      document.getElementById('nombrecliente').textContent = Data.cliente[0].nombre;
    pintartablacontratos(Data)
}

if(document.getElementById('filtro')){
  var filtrar = document.getElementById('filtro')
  filtrar.addEventListener('change',pintartablacontratos)
}

async function pintartablacontratos(){
  
  let tabla = [];

  switch(filtrar.value){
    case '3':
      tabla = Data.contratos;
    break
    case '1':
      tabla = Data.contratos.filter(function(a){
        return a.activo == 1
      })
    break
    case '2':
      tabla = Data.contratos.filter(function(a){
        return a.activo == 0
      })
    break
  }

  html = `<table class="table" id="tabclientes">
  <tr><th>ID</th><th>Descripción</th><th>Fecha inicio</th><th>Fecha fin</th><th>Monto renta</th><th>Balance</th><th>Facturas por generar</th><th>Plazos</th><th>Estado</th></tr>`
  tabla.forEach(contrato => {
    html += 
    `<tr>
      <td><label>${contrato.idcontrato}</label></td>
      <td><a href="../../vistas/funciones/modificarbien.html?inf=${contrato.idbien}">${contrato.descripcion}</a></td>
      <td><label>${contrato.fechaini}</label></td>
      <td><label>${contrato.fechafin}</label></td>
      <td><label>RD$${intcoma.format(contrato.monto)}</label></td>
      <td><label>RD$${intcoma.format(contrato.balance)}</label></td>`
      if (contrato.facturasgeneradas <= 0){
        html += `<td><label>0</label></td>`
      }else{
        html += `<td><label>${contrato.facturasgeneradas}</label></td>`
      }
      html +=`<td><label>${contrato.dias}D</label></td>
      <td><label>${contrato.activo ? 'ACTIVO' : 'INACTIVO'}</label></td>
      <td><a href="../consultas/facturascontrato.html?inf=${contrato.idcontrato}" class="btn btn-primary">Facturas</a></td>
      <td><a href="../funciones/modificarcontrato.html?inf=${contrato.idcontrato}" class="btn btn-danger">Modificar</a></td>
    </tr>`
  });

  html += `</table>`

  listacontratos.innerHTML = html;

}



