const db = require("../../conection");
const sql = require('mssql')

const controllers = {};

controllers.clientesgrupos = async function(req, res){
  const idgrupo = req.params.idgrupo;
  await sql.connect(db)
  var clientes = await sql.query(`select ct.idcontrato, cl.idcliente, cl.nombre, cedula, telefono, descripcion, g.nombre gnombre, ct.balance, DATEDIFF(d, isnull(fecha,fechafactini),case when fechafactfin = fechafactini and fechafactini < CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin > CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP then fechafactfin end)/dias facturasg
  from contrato ct inner join bienes b on b.idbien = ct.idbien left outer join grupos g on b.idgrupo = g.idgrupo inner join clientes cl on cl.idcliente = ct.idcliente left outer join facturas f on f.idfactura = ct.idfactura inner join plazos p on p.idplazo = ct.idplazo
  where g.idgrupo = ${idgrupo} and ct.activo = 1`)
  var data = clientes.recordset;
  res.send(data);
}

controllers.listaclientes = async function (req, res) {
  await sql.connect(db)
  var request =  await new sql.query(`select * from clientes where activo = 1 order by nombre asc`);
  const data = request.recordsets[0];
  res.send(data)
};

controllers.contratosclientes = async function (req, res) {
  await sql.connect(db)
  var request =  await new sql.query(`select DISTINCT(nombre),cedula,cl.idcliente from clientes cl join contrato ct on ct.idcliente = cl.idcliente where ct.activo = 1`);
  const data = request.recordsets[0];
  res.send(data)
};


controllers.clienteid = async function (req, res) {
  const idcliente = req.params.idcliente;
  await sql.connect(db)
  var request =  await new sql.query(`select * from clientes where idcliente = ${idcliente}`);
  const data = request.recordsets[0];
  res.send(data)
};

controllers.clienteadd = async function (req, res) {
  
  const {nombre,cedula,telefono,tipoidentif} = req.body;
  
  await sql.connect(db)
  var request = new sql.Request();

  request
  .input('nombre', sql.VarChar(90), nombre)
  .input('cedula', sql.VarChar(15), cedula)
  .input('telefono', sql.VarChar(15), telefono)
  .input('tipoidentif', sql.Int, tipoidentif)
  .query(`insert into clientes (nombre, cedula, telefono, tipoidentif) values (@nombre,@cedula,@telefono,@tipoidentif )`, [nombre,cedula,telefono,tipoidentif])
  res.sendStatus(201)
};

controllers.updatecliente = async function (req, res) {
  const {nombre,cedula,telefono,idcliente,tipoidentif} = req.body;

  await sql.connect(db)
  var request = new sql.Request();

  request
  .input('nombre', sql.VarChar(90), nombre)
  .input('cedula', sql.VarChar(15), cedula)
  .input('telefono', sql.VarChar(15), telefono)
  .input('tipoidentif', sql.Int, tipoidentif)
  .query(`update clientes set nombre = @nombre, cedula = @cedula, telefono = @telefono, tipoidentif = @tipoidentif where idcliente = ${idcliente}`, [nombre,cedula,telefono,tipoidentif])
  res.sendStatus(200)
}

controllers.datacliente = async function(req, res){
  const idcliente = req.params.idcliente;
  await sql.connect(db)
  var request = await new sql.query(`select b.idbien, c.activo, descripcion,plazo ,isnull(direccion,'-')direccion,tp.nombre nombretipo, isnull(gp.nombre,'-') nombregrupo, disponible, idcontrato, CONVERT(VARCHAR, fechaini,23)fechaini, CONVERT(VARCHAR, fechafin,23)fechafin, DATEDIFF(D, CURRENT_TIMESTAMP,fechafin)contratovence, c.monto, c.balance, c.idcliente, cl.nombre nombrecliente,isnull(cedula,'Inexistente')cedula, isnull(telefono,'Inexistente')telefono
  from bienes b inner join tipobien tp on tp.idtipobien = b.idtipobien 
  left outer join contrato c on c.idbien = b.idbien left outer join clientes cl on cl.idcliente = c.idcliente left outer join grupos gp on gp.idgrupo = b.idgrupo left outer join plazos pl on pl.idplazo = c.idplazo
  where b.idbien = ${idcliente} and ISNULL(c.activo, b.activo) = 1`)
  const data = request.recordsets[0];
  res.send(data)
}

module.exports = controllers;