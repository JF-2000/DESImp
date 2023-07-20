const listacliente = document.getElementById("listacliente");
const filtro = document.getElementById("filtronombre");


let clientes = [];

async function listarclientes() {

  await fetch(api+'/clientes')
  .then(response => response.json())
  .then((data) => clientes = data);

  html = `<table class="table table-bordered" id="tabclientes">
  <tr><th>ID</th><th>Nombre</th><th>Identificación</th><th>Teléfono</th></tr>`
  clientes.forEach(cliente => {
    html += 
    `<tr>
      <td> <label>${cliente.idcliente}</label></td>
      <td><a href="../consultas/datacliente.html?inf=${cliente.idcliente}">${cliente.nombre}</a></td>
      <td> <label>${cliente.cedula}</label></td>
      <td> <label>${cliente.telefono}</label></td>
      <td style="width: 600px"><a href="../funciones/crearcontrato.html?inf=${cliente.idcliente}" class="btn btn-primary">Rentar</a>
      <a href="../funciones/modificarcliente.html?inf=${cliente.idcliente}" class="btn btn-danger">Modificar</a>
      <a href="../consultas/listaingresos.html?inf=${cliente.idcliente}" class="btn btn-dark">Ingresos</a>
      <a href="clientcontrato.html?inf=${cliente.idcliente}" class="btn btn-dark">Contratos</a></td>
    </tr>`
  });
  html += `</table>`

  listacliente.innerHTML = html;

}

listarclientes();