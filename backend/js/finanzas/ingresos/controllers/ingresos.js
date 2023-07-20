const db = require("../../../conection");
const sql = require('mssql');

const controllers = {};

controllers.addingreso = async function(req, res){
    const {idcliente, concepto, monto, fecha} = req.body;
    await sql.connect(db)
    if(idcliente  == null || idcliente  == undefined || idcliente  == ""){
        return res.send("nonbien");
    }

    var request = new sql.Request();
    request
    .input('idcliente', sql.Int, idcliente )
    .input('concepto', sql.Text, concepto)
    .input('monto', sql.Money, monto)
    .input('balance', sql.Money, monto)
    .input('fecha', sql.Date, fecha)
    .query(`insert into ingresos (idcliente,concepto,monto,fecha,balance) values (@idcliente,@concepto,@monto,@fecha,@balance)`, [idcliente ,concepto,monto,fecha,monto])
    res.sendStatus(200)
}

controllers.updateingreso = async function(req, res){
    const {idingreso , concepto, monto, balance, fecha} = req.body;
    await sql.connect(db)
    if(idingreso  == null || idingreso  == undefined || idingreso  == ""){
        return res.send("nonbien");
    }

    var request = new sql.Request();
    request
    .input('concepto', sql.Text, concepto)
    .input('monto', sql.Money, monto)
    .input('balance', sql.Money, balance)
    .input('fecha', sql.Date, fecha)
    .query(`update ingresos set concepto=@concepto,monto=@monto, balance=@balance, fecha=@fecha where idingreso = ${idingreso}`, [concepto, monto, balance, fecha])
    res.sendStatus(200)
}

controllers.reingreso = async function(req, res){
    const idingreso = req.params.idingreso;
    if(idingreso == null || idingreso == undefined || idingreso == ""){
        return res.send("nonid");
    }
    await sql.connect(db)
    var ingreso = await sql.query(`select i.idcliente, nombre, idingreso, concepto, monto, balance, CONVERT(varchar,fecha,23)fecha
    from ingresos i inner join clientes cl on cl.idcliente = i.idcliente
    where idingreso = ${idingreso}`)
    var data = ingreso.recordset[0]
    res.send(data)
}
controllers.ingresos = async function(req, res){
    const idcliente = req.params.idcliente;
    if(idcliente == null || idcliente == undefined || idcliente == ""){
        return res.send("nonid");
    }

    await sql.connect(db)
    var total = await sql.query(`select sum(monto) total from ingresos
    where idcliente = ${idcliente} and activo = 1`)
    var ingresos = await sql.query(`select idingreso, idcliente, concepto, monto, balance, FORMAT(fecha, 'dd-MM-yyyy') fecha from ingresos
    where idcliente = ${idcliente} and activo = 1`)
    var data = {
        ingresos: ingresos.recordset,
        total: total.recordset[0]}
    res.send(data)
}

controllers.ingresoscontrato = async function(req, res){
    const idcontrato = req.params.idcontrato;
    if(idcontrato == null || idcontrato == undefined || idcontrato == ""){
        return res.send("nonid");
    }

    await sql.connect(db)
    var contrato = await sql.query(`select idcliente from contrato where idcontrato = ${idcontrato}`)
    var ingresos = await sql.query(`select idingreso, idcliente, concepto, monto, balance, FORMAT(fecha, 'dd-MM-yyyy') fecha from ingresos
    where idcliente = ${contrato.recordset[0].idcliente} and activo = 1`)
    var data = ingresos.recordset;
    res.send(data)
}

controllers.ingresosgrupo = async function(req, res){
    const idgrupo = req.params.idgrupo;
    if(idgrupo == null || idgrupo == undefined || idgrupo == ""){
        return res.send("non");
    }
    await sql.connect(db)
    var ingresos = await sql.query(`select cl.idcliente,cl.nombre, CONVERT(varchar,b.descripcion) bien,SUM(ig.monto)tingresos from contrato ct inner join ingresos ig on ig.idcliente = ct.idcliente inner join clientes cl on cl.idcliente = ct.idcliente 
    inner join bienes b on b.idbien = ct.idbien inner join grupos gp on gp.idgrupo = b.idgrupo
    where gp.idgrupo = ${idgrupo} and ig.activo = 1
    group by cl.nombre, cl.idcliente, CONVERT(varchar,b.descripcion)`)

    var data = ingresos.recordset
    res.send(data)
}

module.exports = controllers;