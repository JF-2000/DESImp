const db = require("../../conection");
const sql = require('mssql')

const controllers = {};

controllers.alltipobienes = async function (req, res) {
    await sql.connect(db)
    var request =  await new sql.query(`select * from tipobien where activo = 1`);
    const data = request.recordsets[0];
    res.send(data)
};

controllers.allbienes = async function (req, res) {
    await sql.connect(db)
    var request =  await new sql.query(`select b.idbien, g.idgrupo, tb.nombre nombretipo, tb.idtipobien,isnull(g.nombre,'-') nombregrupo, descripcion, isnull(direccion,'-') direccion, trenta, disponible
    from bienes b inner join tipobien tb on tb.idtipobien = b.idtipobien left outer join grupos g on g.idgrupo = b.idgrupo 
    where b.activo = 1 `);
    const data = request.recordsets[0];
    res.send(data)
};

controllers.bienesactivos = async function (req, res) {
    await sql.connect(db)
    var request =  await new sql.query(`select b.idbien, g.idgrupo, tb.nombre nombretipo, tb.idtipobien,isnull(g.nombre,'-') nombregrupo, descripcion, isnull(direccion,'-') direccion, trenta, disponible
    from bienes b inner join tipobien tb on tb.idtipobien = b.idtipobien left outer join grupos g on g.idgrupo = b.idgrupo 
    where b.activo = 1 and disponible = 1`);
    const data = request.recordsets[0];
    res.send(data)
};

controllers.updatebien = async function (req, res) {
    const {descripcion,direccion,idtipobien,idgrupo,idbien} = req.body;
    
    await sql.connect(db)
    var request = new sql.Request();
  
    request
    .input('descripcion', sql.Text, descripcion)
    .input('direccion', sql.Text, direccion)
    .input('idtipobien', sql.Int, idtipobien)
    .input('idgrupo', sql.Int, idgrupo)
    .query(`update bienes set descripcion = @descripcion, direccion = @direccion, idtipobien = @idtipobien, idgrupo = @idgrupo where idbien = ${idbien}`, [descripcion,direccion,idtipobien,idgrupo])
    res.sendStatus(200)
};

controllers.updatetipobien = async function (req, res) {
    const {nombre,trenta,idtipobien} = req.body;
    
    await sql.connect(db)
    var request = new sql.Request();
  
    request
    .input('nombre', sql.VarChar(30),nombre)
    .input('trenta', sql.VarChar(10),trenta)
    .input('idtipobien', sql.Int, idtipobien)
    .query(`update tipobien set nombre = @nombre, trenta = @trenta where idtipobien= @idtipobien`, [nombre,trenta,idtipobien])
    res.sendStatus(200)
};

controllers.tipobien = async function (req, res) {
    const idtipobien = req.params.idtipobien;
    await sql.connect(db)
    var request =  await new sql.query(`select * from tipobien where idtipobien = ${idtipobien}`);
    const data = request.recordsets[0];
    res.send(data)
};

controllers.bienid = async function (req, res) {
    const idbien = req.params.idbien;
    await sql.connect(db)
    var request =  await new sql.query(`select b.activo, descripcion, direccion, disponible, idbien, b.idgrupo, b.idtipobien, tb.nombre nombretipo, g.nombre nombregrupo,trenta
    from bienes b left outer join grupos g on g.idgrupo = b.idgrupo inner join tipobien tb on tb.idtipobien = b.idtipobien  
    where idbien = ${idbien}`);
    const data = request.recordsets[0];
    res.send(data)
};

controllers.addbien = async function (req, res) {
  
    const {descripcion, direccion, idtipobien, idgrupo} = req.body;
    await sql.connect(db)
    var request = new sql.Request();
  
    request
    .input('idtipobien', sql.Int, idtipobien)
    .input('idgrupo', sql.Int, idgrupo)
    .input('descripcion', sql.Text, descripcion)
    .input('direccion', sql.Text,direccion)
    .query(`insert into bienes (idtipobien, idgrupo, descripcion, direccion) values (@idtipobien,@idgrupo,@descripcion,@direccion)`, [idtipobien,idgrupo,descripcion,direccion])
    res.sendStatus(200)
  
};

controllers.creartipo = async function (req, res) {
  
    const {nombre,trenta} = req.body;
    await sql.connect(db)
    var request = new sql.Request();
    
    request
    .input('nombre', sql.VarChar(30), nombre)
    .input('trenta', sql.VarChar(10), trenta)
    .query(`insert into tipobien (nombre,trenta) values (@nombre,@trenta)`, [nombre,trenta])
    res.sendStatus(200)
}

controllers.selectgrupo = async function(req,res){
    const id = req.params.idgrupo;
    await sql.connect(db);
    var grupo = await sql.query(`select * from grupos where idgrupo = ${id}`)
    var data = grupo.recordset[0]
    res.send(data);
}

controllers.allgrupos = async function(req,res){
    await sql.connect(db)
    var request =  await new sql.query(`select gp.idgrupo, gp.nombre, sum(balance) balance
    from grupos gp left outer join bienes b on b.idgrupo = gp.idgrupo left outer join contrato c on c.idbien = b.idbien
    where gp.activo = 1
    group by gp.nombre, gp.idgrupo `);
    const data = request.recordsets[0];
    res.send(data)
}

controllers.addgrupo = async function(req,res){

    const {nombre} = req.body
    await sql.connect(db)
    var request = new sql.Request();
  
    request
    .input('nombre', sql.VarChar(30), nombre)
    .query(`insert into grupos (nombre) values (@nombre)`, [nombre])
    res.sendStatus(200)
}

controllers.updategrupo = async function (req, res) {
    const {nombre,idgrupo} = req.body;
    
    await sql.connect(db)
    var request = new sql.Request();
  
    request
    .input('nombre', sql.VarChar(30),nombre)
    .input('idgrupo', sql.Int, idgrupo)
    .query(`update grupos set nombre = @nombre where idgrupo = @idgrupo`, [nombre,idgrupo])
    res.sendStatus(200)
};

controllers.databien = async function(req, res){
    const idbien = req.params.idbien;
    await sql.connect(db)
    var bien = await new sql.query(`select b.idbien, descripcion, isnull(direccion,'-')direccion,tp.nombre nombretipo, isnull(gp.nombre,'-') nombregrupo, disponible
    from bienes b inner join tipobien tp on tp.idtipobien = b.idtipobien 
    left outer join grupos gp on gp.idgrupo = b.idgrupo
    where b.idbien = ${idbien}`)
    var contrato = await new sql.query(`select idcontrato, c.activo, plazo, CONVERT(VARCHAR, fechaini,23)fechaini, CONVERT(VARCHAR, fechafin,23)fechafin, CASE WHEN fechafactini != fechafactfin THEN CAST( DATEDIFF(D, CURRENT_TIMESTAMP,fechafactfin) as VARCHAR(10)) WHEN fechafactini = fechafactfin THEN 'Indefinido' WHEN fechafactfin < CURRENT_TIMESTAMP then 'Vencido' end as contratovence, c.monto, c.balance, c.idcliente, cl.nombre nombrecliente,isnull(cedula,'Inexistente')cedula, isnull(telefono,'Inexistente')telefono
    from bienes b inner join tipobien tp on tp.idtipobien = b.idtipobien 
    left outer join contrato c on c.idbien = b.idbien left outer join clientes cl on cl.idcliente = c.idcliente left outer join grupos gp on gp.idgrupo = b.idgrupo left outer join plazos pl on pl.idplazo = c.idplazo
    where b.idbien = ${idbien} and c.activo = 1`)
    const data = {
        bien: bien.recordset[0],
        contrato: contrato.recordset[0]
    } 
    res.send(data)
}

controllers.factbien = async function(req, res){
    const idcontrato = req.params.idcontrato;
    await sql.connect(db)
    var facturas = await new sql.query(`select f.idfactura, ct.idcontrato, CONVERT(VARCHAR,f.fecha,23)fechaf, f.monto montof, f.concepto conceptof, f.estado
    from contrato ct left outer join facturas f on f.idcontrato = ct.idcontrato
    where ct.idcontrato = ${idcontrato} and ct.activo = 1 and YEAR(fecha) = YEAR(CURRENT_TIMESTAMP)`)
    var pagos = await new sql.query(`select TOP 1 ct.idcontrato,pg.idpago,CONVERT(VARCHAR,pg.fecha,23)fechap, pg.monto montop, recibidopor, pagopor, pg.balance balancep
    from contrato ct left outer join pagos pg on pg.idcontrato = ct.idcontrato
    where ct.idcontrato = ${idcontrato} and ct.activo = 1 order by pg.idpago desc`)
    const data = {
        facturas: facturas.recordsets[0],
        pagos: pagos.recordsets[0]
    }
    res.send(data)
}


module.exports = controllers;