let tipobienes = []; 
let grupos = [];
let crea = false;

intcoma = new Intl.NumberFormat('en-US');

function crear(){
  crea = true;
}

async function listartipobienes() {
  const listatipobienes = document.getElementById("listatipobienes");
  await fetch(api+'/tipobienes')
  .then(response => response.json())
  .then((data) => tipobienes = data);

  html = `<br><br>`
  if(crea==false){
    html += `<option  value="0">Todos</option>`
  }
  tipobienes.forEach(tipobien => {
    html += `<option  value="${tipobien.idtipobien}">${tipobien.nombre}</option>`
  });
  html += `<br><br>`

  listatipobienes.innerHTML = html;
}

async function listatipobien() {
  const listtipo = document.getElementById('listtipo');
  await fetch(api+'/tipobienes')
  .then(response => response.json())
  .then((data) => tipobienes = data);

  html = `<table class="table table-bordered" id="tabtipo">
  <tr><th>ID</th><th>Nombre</th><th>Tiempo renta</th></tr>`
  tipobienes.forEach(tipobien => {
    html += 
    `<tr>
      <td> <label>${tipobien.idtipobien}</label></td>
      <td> <label>${tipobien.nombre}</label></td>`
      switch(tipobien.trenta){
        case 'indef':
          html += `<td> <label>INDEFINIDO</label></td>`
        break
        case 'year':
          html += `<td> <label>AÑO</label></td>`
        break
        case 'quincena':
          html += `<td> <label>QUINCENA</label></td>`
        break
        case 'mes':
          html += `<td> <label>MES</label></td>`
        break
        case '':
          html += `<td> <label>Sin tiempo</label></td>`
        break
      }
    html += `<td style="width: 60px"><a href="../funciones/modificartipobien.html?inf=${tipobien.idtipobien}" class="btn btn-danger">Modificar</a></td>
    </tr>`
  });
  html += `</table>`

  listtipo.innerHTML = html;

}

async function listagrupos(){
  const listgrupo = document.getElementById('listagrupos');
  await fetch(api+'/bienes/grupos')
  .then(response => response.json())
  .then((data) => grupos = data);

  html = `<br><br>`
  if(crea == false){
    html += `<option  value="0">Todos</option>`
  }else{
    html += `<option  value="0">Sin grupo</option>`
  }
  
  grupos.forEach(grupo => {
    html += `<option  value="${grupo.idgrupo}">${grupo.nombre}</option>`
  });
  html += `<br><br>`

  listgrupo.innerHTML = html;
}

async function listargrupos(){
  const listgrupos = document.getElementById("listgrupo");
  let html = "";
  let listagrupo = [];
  await fetch(api+'/bienes/grupos')
  .then(response => response.json())
  .then((data) => listagrupo = data);
  html = `<table class="table table-bordered" id="tabgrupo">
  <tr><th>ID</th><th>Nombre</th><th>Balance</th></tr>`
  listagrupo.forEach(grupo => {
    html += 
    `<tr>
      <td>${grupo.idgrupo}</td>
      <td><a class="a-btn" href="../consultas/clientesgrupos.html?inf=${grupo.idgrupo}">${grupo.nombre}</a></td>
      <td>RD$${intcoma.format(grupo.balance)}</td>
      <td style="width: 60px"><a href="../funciones/modificargrupo.html?inf=${grupo.idgrupo}" class="btn btn-danger"> Modificar</a></td>
      <td style="width: 60px"><a href="../consultas/clientesgrupos.html?inf=${grupo.idgrupo}" class="btn btn-primary"> Clientes</a></td>
      <td style="width: 60px"><a href="../consultas/listagastos.html?inf=${grupo.idgrupo}" class="btn btn-dark">Gastos</a></td>
    </tr>`
  });
  html += `</table>`

  listgrupos.innerHTML = html;
}
