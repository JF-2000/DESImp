const db = require("../../../conection");
const sql = require('mssql');

const controllers = {};

controllers.reportbenegrupo = async function(req,res){
    const {desde, hasta} = req.body 

    if(desde == null || desde == undefined || desde == ""){
        return res.send('err')
    }
    if(hasta == null || hasta == undefined || hasta == ""){
        return res.send('err')
    }
    if(hasta < desde){
        return res.send('err')
    }

    await sql.connect(db)
    var totalg = await sql.query(`select g.idgrupo,nombre,pagos,gastos,ingresos from grupos g
    left outer join (select gp.idgrupo, sum(pg.monto) pagos from contrato ct left outer join pagos pg on pg.idcontrato = ct.idcontrato 
    inner join bienes b on b.idbien = ct.idbien inner join grupos gp on gp.idgrupo = b.idgrupo
    where FORMAT (pg.fecha, 'yyyy-MM-dd') >= '${desde}' and FORMAT (pg.fecha, 'yyyy-MM-dd') <= '${hasta}'
    group by gp.idgrupo) i on i.idgrupo = g.idgrupo
    left outer join (select gp.idgrupo, sum(gt.monto) gastos from gastos gt inner join grupos gp on gp.idgrupo = gt.idgrupo
    where FORMAT (gt.fecha, 'yyyy-MM-dd') >= '${desde}' and FORMAT (gt.fecha, 'yyyy-MM-dd') <= '${hasta}'
    group by gp.idgrupo) e on e.idgrupo = g.idgrupo
    left outer join (select gp.idgrupo, sum(ig.monto) ingresos from contrato ct left outer join ingresos ig on ig.idcliente = ct.idcliente
    inner join bienes b on b.idbien = ct.idbien inner join grupos gp on gp.idgrupo = b.idgrupo
    where ig.activo = 1
    group by gp.idgrupo) a on a.idgrupo = g.idgrupo
    where activo = 1;`)

    var data = totalg.recordset
    res.send(data)
}

controllers.estadofinanzas = async function(req,res){
    await sql.connect(db);
    var totalgenerado = await sql.query(`select SUM(p.monto)totalgenerado,tp.nombre
    from pagos p inner join contrato c on c.idcontrato = p.idcontrato inner join bienes b on b.idbien = c.idbien inner join tipobien tp on tp.idtipobien = b.idtipobien
    where YEAR(fecha) = YEAR(CURRENT_TIMESTAMP)
    group by tp.nombre`);
    var totaldebe = await sql.query(`select SUM(f.monto)totaldebe,tp.nombre
    from facturas f inner join contrato c on c.idcontrato = f.idcontrato inner join bienes b on b.idbien = c.idbien inner join tipobien tp on tp.idtipobien = b.idtipobien
    where YEAR(fecha) = YEAR(CURRENT_TIMESTAMP)
    group by tp.nombre`);
    var data = {
        totalgenerado: totalgenerado.recordset,
        totaldebe: totaldebe.recordset
    }
    res.send(data);
}



module.exports = controllers;