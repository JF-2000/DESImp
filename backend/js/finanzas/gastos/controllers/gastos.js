const db = require("../../../conection");
const sql = require('mssql');

const controllers = {};

controllers.regasto = async function(req, res){
    const idgasto = req.params.idgasto;
    await sql.connect(db)
    var gasto = await sql.query(`select idgasto, concepto, monto, CONVERT(varchar,fecha,23)fecha, g.idgrupo, nombre
    from gastos gt inner join grupos g on g.idgrupo = gt.idgrupo
    where idgasto = ${idgasto}`)
    var data = gasto.recordset[0]
    res.send(data)
}

controllers.addgasto = async function(req, res){
    const {idgrupo, concepto, monto, fecha} = req.body;
    await sql.connect(db)
    if(idgrupo == null || idgrupo == undefined || idgrupo == ""){
        return res.send("nonbien");
    }

    var request = new sql.Request();
    request
    .input('idgrupo', sql.Int, idgrupo)
    .input('concepto', sql.Text, concepto)
    .input('monto', sql.Money, monto)
    .input('fecha', sql.Date, fecha)
    .query(`insert into gastos (idgrupo,concepto,monto,fecha) values (@idgrupo,@concepto,@monto,@fecha)`, [idgrupo,concepto,monto,fecha])
    res.sendStatus(200)
}

controllers.updategasto = async function(req, res){
    const {idgasto, idgrupo, concepto, monto, fecha} = req.body;
    await sql.connect(db)
    if(idgrupo == null || idgrupo == undefined || idgrupo == ""){
        return res.send("nonbien");
    }

    var request = new sql.Request();
    request
    .input('idgrupo', sql.Int, idgrupo)
    .input('concepto', sql.Text, concepto)
    .input('monto', sql.Money, monto)
    .input('fecha', sql.Date, fecha)
    .query(`update gastos set idgrupo=@idgrupo,concepto=@concepto,monto=@monto,fecha=@fecha where idgasto = ${idgasto}`, [idgrupo,concepto,monto,fecha])
    res.sendStatus(200)
}

controllers.gastosgrupo = async function(req, res){
    const {idgrupo, desde, hasta} = req.body
    if(idgrupo == null || idgrupo == undefined || idgrupo == ""){
        return res.send("nonid");
    }
    if(desde == null || desde == undefined || desde == ""){
        return res.send("nonid");
    }
    if(hasta == null || hasta == undefined || hasta == ""){
        return res.send("nonid");
    }
    if(hasta < desde){
        return res.send("nonid");
    }

    await sql.connect(db)
    var total = await sql.query(`select sum(monto) total from gastos
    where idgrupo = ${idgrupo} and activo = 1 and fecha >= '${desde}' and fecha <= '${hasta}'`)
    var gastos = await sql.query(`select idgasto, idgrupo, concepto, monto, FORMAT(fecha, 'dd-MM-yyyy') fecha from gastos
    where idgrupo = ${idgrupo} and activo = 1 and fecha >= '${desde}' and fecha <= '${hasta}'`)
    var data = {
        gastos: gastos.recordset,
        total: total.recordset[0]}
    res.send(data)
}


module.exports = controllers;