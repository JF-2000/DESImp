const db = require("../../../conection");
const sql = require('mssql');

const controllers = {};

controllers.addcontrato = async function (req, res) {
    const {idcliente,idbien,idfactura,idpago,fechaini,fechafin,monto,balance,idplazo,agrupado, deposito} = req.body;
    
    await sql.connect(db)
    var request = new sql.Request();
  
    if(idbien == null || idbien == undefined || idbien == ""){
      return res.send("nonbien");
    }
  
    request.input('actbien', sql.Int, idbien)
    .query(`update bienes set disponible = 0 where idbien = @actbien`,[idbien]);
  
    request
    .input('idcliente', sql.Int, idcliente)
    .input('idbien', sql.Int, idbien)
    .input('idfactura', sql.Int, idfactura)
    .input('idpago', sql.Int, idpago)
    .input('fechaini', sql.Date, fechaini)
    .input('fechafin', sql.Date,fechafin)
    .input('fechafactini', sql.Date, fechaini)
    .input('fechafactfin', sql.Date, fechafin)
    .input('monto', sql.Money, monto)
    .input('balance', sql.Money, balance)
    .input('idplazo', sql.Int, idplazo)
    .input('agrupado', sql.Int, agrupado)
    .input('deposito', sql.Int, deposito)
    .query(`insert into contrato (idcliente,idbien,idfactura,idpago,fechaini,fechafin,fechafactini,fechafactfin,monto,balance,idplazo,agrupado,deposito) values (@idcliente,@idbien,@idfactura,@idpago,@fechaini,@fechafin,@fechafactini,@fechafactfin,@monto,@balance,@idplazo,@agrupado,@deposito)`, [idcliente,idbien,idfactura,idpago,fechaini,fechafin,fechaini,fechafin,monto,balance,idplazo,agrupado,deposito])
    res.sendStatus(200)
}

controllers.updatecontrato = async function (req, res) {
    const {idcontrato,idbien,idbienpass,fechaini,fechafin,fechafactini,fechafactfin,monto,idplazo,agrupado,activo,deposito} = req.body;
    
    await sql.connect(db)
    var request = new sql.Request();
  
    if(idbien == null || idbien == undefined || idbien == ""){
      return res.send("nonbien");
    }
  
    if(idbienpass == null || idbienpass == undefined || idbienpass == ""){
      return res.send("nonbien");
    }
  
    if(idbien != idbienpass){
      var request = new sql.Request();
      request.input('idbienpass', sql.Int , idbienpass)
      .query(`update bienes set disponible = 1 where idbien= @idbienpass`, [idbienpass])
  
      request.input('actbien', sql.Int, idbien)
      .query(`update bienes set disponible = 0 where idbien = @actbien`,[idbien])
    }
  
    if(idbien == idbienpass){
      const buscar = await sql.query(`select idbien from contrato where idbien = ${idbien} and idcontrato != ${idcontrato} and activo = 1`);
      const comprobar = buscar.recordset;
      if(comprobar.length == 0){
        var request = new sql.Request();
        request.input('actbien', sql.Int, idbien)
        .query(`update bienes set disponible = 0 where idbien = @actbien`,[idbien])
      }else{
        return res.send('concontrato')
      }
    }
  
    request
    .input('idcontrato', sql.Int, idcontrato)
    .input('idbien', sql.Int, idbien)
    .input('fechaini', sql.Date, fechaini)
    .input('fechafin', sql.Date, fechafin)
    .input('fechafactini', sql.Date,fechafactini)
    .input('fechafactfin', sql.Date,fechafactfin)
    .input('monto', sql.Money, monto)
    .input('idplazo', sql.Int, idplazo)
    .input('agrupado', sql.Int, agrupado)
    .input('deposito', sql.Int, deposito)
    .input('activo', sql.Int, activo)
    .query(`update contrato set idbien=@idbien, fechaini=@fechaini,  fechafin=@fechafin, fechafactini=@fechafactini, fechafactfin=@fechafactfin, monto=@monto, idplazo=@idplazo, agrupado=@agrupado, activo=@activo, deposito=@deposito where idcontrato = @idcontrato`, [idbien,fechaini,fechafin,fechafactini,fechafactfin,monto,idplazo,agrupado,idcontrato,activo,deposito])
  
    res.sendStatus(200)
}

controllers.recuperarcontrato = async function (req, res) {
    const idcontrato = req.params.idcontrato;
    await sql.connect(db)
  
    var contrato = await new sql.query(`select cl.nombre, cl.idcliente, b.idbien, b.idtipobien, b.descripcion,CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin,CONVERT(VARCHAR, fechafactini,23)fechafactini,CONVERT(VARCHAR, fechafactfin,23)fechafactfin,c.monto,c.balance,c.agrupado,c.idplazo,c.activo,c.deposito
    from contrato c inner join bienes b on b.idbien = c.idbien inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente 
    where idcontrato = ${idcontrato}`);
    const data = {
      contrato: contrato.recordsets[0]
    }
    res.send(JSON.stringify(data))
}

controllers.contratosdelcliente = async function (req, res) {
    const idcliente = req.params.idcliente;
    await sql.connect(db)
    var cliente =  await new sql.query(`select nombre from clientes where idcliente = ${idcliente}`);
  
    var contratos =  await new sql.query(`select c.idcontrato, descripcion,cl.nombre nombrecliente, CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin, dias, c.monto, c.balance, DATEDIFF(d, isnull(fecha,fechafactini),case when fechafactfin = fechafactini and fechafactini < CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin > CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP then fechafactfin end)/dias facturasgeneradas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') Fechadeconsulta, b.idbien, c.activo
    from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente inner join bienes b on b.idbien = c.idbien
    where c.idcliente = ${idcliente} order by c.idcontrato`);
    
    const data = {
      cliente: cliente.recordsets[0],
      contratos: contratos.recordsets[0]
    }
    res.send(JSON.stringify(data))
}

module.exports = controllers;