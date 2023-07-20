const db = require("../../../conection");
const sql = require('mssql');
const dateutils = require("../../../helpers/controllers/dateUtils")

const controllers = {};

controllers.clientesconfacturas = async function(req,res){
    await sql.connect(db)
    var clientes = await new sql.query(`select ct.idcliente, cl.nombre, cedula, telefono, ct.balance, gp.nombre nombregrupo, gp.idgrupo
    from contrato ct inner join clientes cl on cl.idcliente = ct.idcliente inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura inner join bienes b on b.idbien = ct.idbien left outer join grupos gp on gp.idgrupo = b.idgrupo
    where (fechafactini <= CURRENT_TIMESTAMP and DATEDIFF(D,isnull(fecha,fechafactini), CURRENT_TIMESTAMP)/dias > 0 and ct.activo = 1) or (ct.balance > 0 and ct.activo = 1) or (fechafactini <= CURRENT_TIMESTAMP and fechafactfin < CURRENT_TIMESTAMP and DATEDIFF(D,isnull(fecha,fechafactini), fechafactfin)/dias > 0 and ct.activo = 1)
    group by ct.idcliente,cl.nombre,cedula, telefono, ct.balance, gp.nombre,gp.idgrupo`);
    data = clientes.recordsets[0];
    res.send(data);
}

controllers.updatefactura = async function(req,res){
    const {idfactura, concepto, monto, antmonto} = req.body

    if(idfactura == "" || idfactura == null || idfactura == undefined){
        return res.send("err");
    }else{
    var request = new sql.Request();
        var idcontract = await sql.query(`select idcontrato from facturas where idfactura = ${idfactura}`)
        var idcontrato = idcontract.recordset[0].idcontrato
        await sql.query(`update contrato set balance = balance - ${antmonto} where idcontrato = ${idcontrato}`)
        await sql.query(`update contrato set balance = balance + ${monto} where idcontrato = ${idcontrato}`)
        await request
        .input('concepto', sql.Text, concepto)
        .input('monto', sql.Money, monto)
        .query(`update facturas set concepto = @concepto, monto = @monto where idfactura = ${idfactura}`, [concepto, monto]);
        return res.sendStatus(200);
    }
}

controllers.selectfactura = async function(req,res){
    const idfactura = req.params.idfactura
    await sql.connect(db)
    var factura = await new sql.query(`select f.idfactura, CONVERT(VARCHAR,fecha,23)fecha, f.monto, descripcion, f.concepto
    from facturas f inner join contrato c on c.idcontrato = f.idcontrato inner join bienes b on b.idbien = c.idbien 
    where f.idfactura = ${idfactura}`)
    data = factura.recordsets[0];
    res.send(data);
}

controllers.consultarfacturascontrato = async function(req,res){
    const idcontrato = req.params.idcontrato;
    await sql.connect(db)
    var facturas = await new sql.query(`select idfactura,CONVERT(varchar,fecha,23)fecha, monto,balance,concepto,estado
    from facturas 
    where idcontrato = ${idcontrato} and YEAR(fecha) = YEAR(CURRENT_TIMESTAMP) and estado = 'D'`)
    var sumdebe = await new sql.query(`select SUM(monto)totaldebe from facturas where idcontrato = ${idcontrato} and estado = 'D'`)
    var pagos = await new sql.query(`select idpago,idcontrato,CONVERT(varchar,fecha,23)fecha,monto,concepto,balance,recibidopor,pagopor,idfactura,CONVERT(varchar,fechafactura,23)fechafactura
    from pagos 
    where idcontrato = ${idcontrato} and YEAR(fecha) = YEAR(CURRENT_TIMESTAMP)`)
    var sumpago = await new sql.query(`select SUM(monto)totalpago from pagos where idcontrato = ${idcontrato}`)
    data = {
        facturas: facturas.recordsets[0],
        sumdebe: sumdebe.recordsets[0],
        pagos: pagos.recordsets[0],
        sumpago: sumpago.recordsets[0]
    }
    res.send(data);
}

controllers.facturaporcontrato = async function (req, res) {

    const idcontract = req.params.idcontrato
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    let cantfacturas = [];
    await sql.connect(db)

    cantfacturas = await new sql.query(`select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechafactini), case when fechafactfin = fechafactini and fechafactini < CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin > CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP then fechafactfin when fechafactini <= CURRENT_TIMESTAMP and fechafactfin = fechafactini then CURRENT_TIMESTAMP end)/dias facturasG, ct.monto, ct.idcliente, ct.balance, agrupado, plazo
    from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where ct.activo = 1 and ct.idcontrato = ${idcontract}`);

    for(var x=0; x < cantfacturas.recordsets[0].length; x++ ){
        

        var idcontrato = cantfacturas.recordsets[0][x].idcontrato;
        var cantidad = cantfacturas.recordsets[0][x].facturasG;
        var balance = cantfacturas.recordsets[0][x].balance;

        var newbalance = 0;
        var totalmonto = 0;

        if (cantfacturas.recordsets[0][x].agrupado == true){
            var monto = cantfacturas.recordsets[0][x].monto * cantidad;


            if(cantidad > 0){
                var request = new sql.Request();
                var fecha = dateutils.Date();

                var concepto = cantidad + "Días";
                
               await request
                .input('idcontrato', sql.Int, idcontrato)
                .input('fecha', sql.Date, fecha)
                .input('monto', sql.Money, monto)
                .input('balance', sql.Money, monto)
                .input('concepto', sql.Text, concepto)
                .query(`insert into facturas (idcontrato,fecha,monto,balance,concepto) 
                values (@idcontrato,@fecha,@monto,@balance,@concepto)`, [idcontrato,fecha,monto,monto,concepto])

                totalmonto = totalmonto + monto;
            }
            newbalance = balance + totalmonto;
            
        }else if(cantfacturas.recordsets[0][x].plazo == "mes"){
            var monto = cantfacturas.recordsets[0][x].monto;
            var fecha = await refecha(idcontrato);
    
            for(var i = 0; i < cantidad; i++){
                var mes = new Date(fecha).getUTCMonth();
                var concepto = meses[mes];  

                var request = new sql.Request();
               await request
                .input('idcontrato', sql.Int, idcontrato)
                .input('fecha', sql.Date, fecha)
                .input('monto', sql.Money, monto)
                .input('balance', sql.Money, monto)
                .input('concepto', sql.Text, concepto)
                .query(`insert into facturas (idcontrato,fecha,monto,balance,concepto) 
                values (@idcontrato,@fecha,@monto,@balance,@concepto)`, [idcontrato,fecha,monto,monto,concepto])

                totalmonto = totalmonto + monto;
                fecha = dateutils.IncMonth(fecha,1);
            }
            newbalance = balance + totalmonto;

        }else if(cantfacturas.recordsets[0][x].plazo == "quincena"){
            var monto = cantfacturas.recordsets[0][x].monto;
            var fecha = await refecha(idcontrato);
    
            for(var i = 0; i < cantidad; i++){
                var mes = new Date(fecha).getUTCMonth();
                var concepto = meses[mes];  

                var request = new sql.Request();
               await request
                .input('idcontrato', sql.Int, idcontrato)
                .input('fecha', sql.Date, fecha)
                .input('monto', sql.Money, monto)
                .input('balance', sql.Money, monto)
                .input('concepto', sql.Text, concepto)
                .query(`insert into facturas (idcontrato,fecha,monto,balance,concepto) 
                values (@idcontrato,@fecha,@monto,@balance,@concepto)`, [idcontrato,fecha,monto,monto,concepto])

                totalmonto = totalmonto + monto;
                fecha = dateutils.IncDate(fecha,15);
            }
            newbalance = balance + totalmonto;
        }
       
        await new sql.query(`update contrato set balance = ${newbalance} where idcontrato = ${idcontrato}`);

        var asigfactura = await new sql.query(`select TOP 1 idfactura 
        from facturas 
        where idcontrato = ${idcontrato} order by idfactura desc`)
        if (asigfactura.recordset.length == 0) {
            return res.send('error');
        }else{
            var idfactura =  asigfactura.recordsets[0][0].idfactura;
            await new sql.query(`update contrato set idfactura = ${idfactura} where idcontrato = ${idcontrato}`)
        }

    }
    data = await enviarfacturas(idcontract)

    return res.send(data);

}

async function enviarfacturas(id){
    await sql.connect(db)
    var countfacturas = await sql.query(`select COUNT(idfactura)cantfacturas from facturas where idcontrato = ${id} and estado = 'D'`)
    var facturas = await new sql.query(`select f.idfactura,b.descripcion, CONVERT(VARCHAR,f.fecha,23)fecha, f.monto, ct.balance, f.concepto 
    from facturas f inner join contrato ct on ct.idcontrato = f.idcontrato inner join clientes cl on cl.idcliente = ct.idcliente inner join bienes b on b.idbien = ct.idbien 
    where ct.idcontrato = ${id} and f.estado = 'D' order by f.idfactura asc`);
    var data = {
       facturas: facturas.recordsets,
       cantfacturas: countfacturas.recordset
    } 
    return data
}

async function refecha(id){
    await sql.connect(db)
    var refecha = await new sql.query(`select TOP 1 isnull(fecha,fechafactini)fecha
    from contrato ct left outer join facturas f on f.idcontrato = ct.idcontrato 
    where ct.idcontrato = ${id} order by f.idfactura desc`);
    var fecha = new Date(refecha.recordsets[0][0].fecha);
    var date  = dateutils.IncMonth(fecha,1);
    return date
}

controllers.adelantarfactura = async function (req, res) {
    const idcontract = req.params.idcontrato
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    let cantfacturas = [];
    await sql.connect(db)

    cantfacturas = await new sql.query(`select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechafactini), case when fechafactfin = fechafactini and fechafactini < CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin > CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP then fechafactfin when fechafactini <= CURRENT_TIMESTAMP and fechafactfin = fechafactini then CURRENT_TIMESTAMP end)/dias facturasG, ct.monto, ct.idcliente, ct.balance, agrupado, plazo
    from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where ct.activo = 1 and ct.idcontrato = ${idcontract}`);

    var idcontrato = cantfacturas.recordsets[0][0].idcontrato;
    var cantidad = 1;
    var balance = cantfacturas.recordsets[0][0].balance;

    var newbalance = 0;
    var totalmonto = 0;

    if(cantfacturas.recordsets[0][0].plazo == "mes"){
        var monto = cantfacturas.recordsets[0][0].monto;
        var fecha = await refecha(idcontrato);

        for(var i = 0; i < cantidad; i++){
            var mes = new Date(fecha).getUTCMonth();
            var concepto = meses[mes];  

            var request = new sql.Request();
            await request
            .input('idcontrato', sql.Int, idcontrato)
            .input('fecha', sql.Date, fecha)
            .input('monto', sql.Money, monto)
            .input('balance', sql.Money, monto)
            .input('concepto', sql.Text, concepto)
            .query(`insert into facturas (idcontrato,fecha,monto,balance,concepto) 
            values (@idcontrato,@fecha,@monto,@balance,@concepto)`, [idcontrato,fecha,monto,monto,concepto])

            totalmonto = totalmonto + monto;
            fecha = dateutils.IncMonth(fecha,1);
        }
        newbalance = balance + totalmonto;

    }else if(cantfacturas.recordsets[0][0].plazo == "quincena"){
        var monto = cantfacturas.recordsets[0][0].monto;
        var fecha = await refecha(idcontrato);

        for(var i = 0; i < cantidad; i++){
            var mes = new Date(fecha).getUTCMonth();
            var concepto = meses[mes];  

            var request = new sql.Request();
            await request
            .input('idcontrato', sql.Int, idcontrato)
            .input('fecha', sql.Date, fecha)
            .input('monto', sql.Money, monto)
            .input('balance', sql.Money, monto)
            .input('concepto', sql.Text, concepto)
            .query(`insert into facturas (idcontrato,fecha,monto,balance,concepto) 
            values (@idcontrato,@fecha,@monto,@balance,@concepto)`, [idcontrato,fecha,monto,monto,concepto])

            totalmonto = totalmonto + monto;
            fecha = dateutils.IncDate(fecha,15);
        }
        newbalance = balance + totalmonto;
    }
    
    await new sql.query(`update contrato set balance = ${newbalance} where idcontrato = ${idcontrato}`);

    var asigfactura = await new sql.query(`select TOP 1 idfactura 
    from facturas 
    where idcontrato = ${idcontrato} order by idfactura desc`)
    if (asigfactura.recordset.length == 0) {
        return res.send('error');
    }else{
        var idfactura =  asigfactura.recordsets[0][0].idfactura;
        await new sql.query(`update contrato set idfactura = ${idfactura} where idcontrato = ${idcontrato}`)
    }


    data = await enviarfacturas(idcontract)

    return res.send(data);

}

module.exports = controllers;