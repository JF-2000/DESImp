async function generarfacturas(){
    await fetch(api+'/clientes/facturas')
    .then(response => response.json())
    .then((data) => clientes = data);
  
    html = `<table class="table table-bordered" id="tabclientes">
    <tr><th>Nombre</th><th>Identificación</th></tr>`
    clientes.forEach(cliente => {
      html += 
      `<tr>
        <td> <label>${cliente.nombre}</label></td>
        <td> <label>${cliente.cedula}</label></td>
        <td><a href="contrato.html?inf=${cliente.idcliente}" class="btn btn-dark">Facturas</a></td>
      </tr>`
    });
    html += `</table>`
  
    listacliente.innerHTML = html;
}