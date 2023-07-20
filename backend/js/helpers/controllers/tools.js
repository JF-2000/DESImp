const db = require("../../conection");
const sql = require('mssql')

const controllers = {};

//Otras funciones.

controllers.borrar = async function(req,res){
const {id,tipo} = req.body;
await sql.connect(db)
var request = new sql.Request();
    switch(tipo){
        case 'Ingreso':
        request.input('idingreso', sql.Int, id)
        .query(`update ingresos set activo = 0 where idingreso = @idingreso`,[id]);
        return res.send(200);
        case 'Gasto':
        request.input('idgasto', sql.Int, id)
        .query(`update gastos set activo = 0 where idgasto = @idgasto`,[id]);
        return res.send(200);
        case 'Cliente':
        request.input('idcliente', sql.Int, id)
        .query(`update clientes set activo = 0 where idcliente = @idcliente`,[id]);
        return res.send(200);
        case 'Bien':
        request.input('idbien', sql.Int, id)
        .query(`update bienes set activo = 0 where idbien = @idbien`,[id]);
        return res.send(200);
        case 'Tipobien':
        request.input('idtipobien', sql.Int, id)
        .query(`update tipobien set activo = 0 where idtipobien = @idtipobien`, [id]);
        return res.send(200);
        case 'Grupo':
        request.input('idgrupo', sql.Int, id)
        .query(`update grupos set activo = 0 where idgrupo = @idgrupo`, [id]);
        return res.send(200);
        case 'Contrato':
        await sql.connect(db)
        const reidbien =  await new sql.query(`select idbien from contrato where idcontrato = ${id}`);
        const idbien = reidbien.recordsets[0][0].idbien;
        await new sql.query(`update bienes set disponible = 1 where idbien = ${idbien}`);

        request.input('idcontrato', sql.Int, id)
        .query(`update contrato set activo = 0 where idcontrato = @idcontrato`, [id]);
        return res.send(200);
    }
}

controllers.comprobar = async function (req,res){
await sql.connect(db);
contratosbencidos = await sql.query(`update contrato set activo = 0 where fechafactfin < CURRENT_TIMESTAMP and fechafactfin != fechafactini`)
return res.sendStatus(200)
}
  
module.exports = controllers;