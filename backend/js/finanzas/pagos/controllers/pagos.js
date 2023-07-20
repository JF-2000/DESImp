const db = require("../../../conection");
const sql = require('mssql');

const controllers = {};

controllers.pagosporgrupos = async function(req,res){
    const {idgrupo, desde, hasta} = req.body;

    if(idgrupo == null || idgrupo == undefined || idgrupo == ""){
        return res.send('err')
    }
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
    var pagos = await sql.query(`select gp.idgrupo, pg.idpago, gp.nombre grupo, cl.nombre cliente, descripcion, pg.monto, FORMAT(pg.fecha, 'dd-MM-yyyy')fecha, FORMAT(pg.fechafactura,'dd-MM-yyyy')fechafactura 
    from pagos pg inner join contrato ct on ct.idcontrato = pg.idcontrato inner join bienes b on b.idbien = ct.idbien left outer join grupos gp on gp.idgrupo = b.idgrupo inner join clientes cl on cl.idcliente = ct.idcliente
    where gp.idgrupo = ${idgrupo} and FORMAT (pg.fecha, 'yyyy-MM-dd') >= '${desde}' and FORMAT (pg.fecha, 'yyyy-MM-dd') <= '${hasta}'`)

    var data = pagos.recordset;
    res.send(data)
}

controllers.registrarpago = async function(req,res){
    const {idfactura,formapago} = req.body
    if(idfactura <= 0 || idfactura == null || idfactura == "" || idfactura == undefined ){
        return res.send('err')
    }
    if(formapago <= 0 || formapago == null || formapago == "" || formapago == undefined ){
        return res.send('err')
    }

    await sql.connect(db)
    const fact = await new sql.query(`select f.monto, f.idcontrato, f.idfactura, c.balance, f.concepto, f.fecha  
    from facturas f inner join contrato c on c.idcontrato = f.idcontrato where f.idfactura = ${idfactura}`)
    
    var monto = fact.recordsets[0][0].monto;
    var idcontrato = fact.recordsets[0][0].idcontrato;
    var fechafactura = fact.recordsets[0][0].fecha;
    var concepto = fact.recordsets[0][0].concepto;
    
    var request = new sql.Request();
    await request
    .input('idcontrato', sql.Int, idcontrato)
    .input('monto', sql.Money, monto)
    .input('balance', sql.Money, monto)
    .input('idfactura', sql.Int, idfactura)
    .input('fechafactura', sql.Date, fechafactura)
    .input('concepto', sql.Text, concepto)
    .input('formapago', sql.VarChar, formapago)
    .query(`insert into pagos (idcontrato, fecha, monto, balance,idfactura,fechafactura,concepto,formapago) 
    values (@idcontrato,getdate(),@monto,@balance,@idfactura,@fechafactura,@concepto,@formapago)`, [idcontrato,monto,monto,idfactura,fechafactura,concepto,formapago]);

    pago = await new sql.query(`select TOP 1 idpago from pagos where idcontrato = ${idcontrato} and idfactura = ${idfactura} order by idpago desc`)
    idpago = pago.recordsets[0][0].idpago;

    await new sql.query(`update contrato set balance = balance - ${monto}, idpago = ${idpago} where idcontrato = ${idcontrato}`);
    await new sql.query(`update facturas set estado = 'P' where idfactura = ${idfactura}`);

    res.json(idpago);
}

controllers.recibopago = async function(req,res){
    id = req.params.idpago;
    await sql.connect(db)
    var pago = await new sql.query(`select p.idpago, ct.idcontrato,cl.nombre, p.monto, descripcion, FORMAT(fecha,'dd-MM-yyyy') fecha, FORMAT(fecha,'hh:mm:ss tt') hora,CONVERT(VARCHAR, fechafactura, 23)fechafactura , p.concepto, p.idfactura,formapago
    from pagos p inner join contrato ct on ct.idcontrato = p.idcontrato inner join clientes cl on ct.idcliente = cl.idcliente inner join bienes b on b.idbien = ct.idbien
    where p.idpago = ${id}`)
    data = pago.recordsets[0];
    res.send(data);
}

controllers.abonar = async function(req, res){
    const {idfactura,formapago,abono} = req.body

    if(idfactura <= 0 || idfactura == null || idfactura == "" || idfactura == undefined ){
        return res.send('err')
    }
    if(formapago <= 0 || formapago == null || formapago == "" || formapago == undefined ){
        return res.send('err')
    }
    if(abono <= 0 || abono == null || abono == "" || abono == undefined ){
        return res.send('err')
    }

    await sql.connect(db)
    const fact = await new sql.query(`select f.monto, f.idcontrato, f.idfactura, c.balance, f.concepto, f.fecha  
    from facturas f inner join contrato c on c.idcontrato = f.idcontrato where f.idfactura = ${idfactura}`)

    if(fact.recordsets[0][0].monto <= abono){

        var monto = fact.recordsets[0][0].monto;
        var idcontrato = fact.recordsets[0][0].idcontrato;
        var fechafactura = fact.recordsets[0][0].fecha;
        var concepto = fact.recordsets[0][0].concepto;
        
        var request = new sql.Request();
        await request
        .input('idcontrato', sql.Int, idcontrato)
        .input('monto', sql.Money, monto)
        .input('balance', sql.Money, monto)
        .input('idfactura', sql.Int, idfactura)
        .input('fechafactura', sql.Date, fechafactura)
        .input('concepto', sql.Text, concepto)
        .input('formapago', sql.VarChar, formapago)
        .query(`insert into pagos (idcontrato, fecha, monto, balance,idfactura,fechafactura,concepto,formapago) 
        values (@idcontrato,getdate(),@monto,@balance,@idfactura,@fechafactura,@concepto,@formapago)`, [idcontrato,monto,monto,idfactura,fechafactura,concepto,formapago]);
    
        pago = await new sql.query(`select TOP 1 idpago from pagos where idcontrato = ${idcontrato} and idfactura = ${idfactura} order by idpago desc`)
        idpago = pago.recordsets[0][0].idpago;
    
        await new sql.query(`update contrato set balance = balance - ${monto}, idpago = ${idpago} where idcontrato = ${idcontrato}`);
        await new sql.query(`update facturas set estado = 'P' where idfactura = ${idfactura}`);
    
        return res.json(idpago);
    } 

    var monto = abono;
    var idcontrato = fact.recordsets[0][0].idcontrato;
    var fechafactura = fact.recordsets[0][0].fecha;
    var concepto = "Abono de " + fact.recordsets[0][0].concepto;
    
    var request = new sql.Request();
    await request
    .input('idcontrato', sql.Int, idcontrato)
    .input('monto', sql.Money, monto)
    .input('balance', sql.Money, monto)
    .input('idfactura', sql.Int, idfactura)
    .input('fechafactura', sql.Date, fechafactura)
    .input('concepto', sql.Text, concepto)
    .input('formapago', sql.VarChar, formapago)
    .query(`insert into pagos (idcontrato, fecha, monto, balance,idfactura,fechafactura,concepto,formapago) 
    values (@idcontrato,getdate(),@monto,@balance,@idfactura,@fechafactura,@concepto,@formapago)`, [idcontrato,monto,monto,idfactura,fechafactura,concepto,formapago]);

    pago = await new sql.query(`select TOP 1 idpago from pagos where idcontrato = ${idcontrato} and idfactura = ${idfactura} order by idpago desc`)
    idpago = pago.recordsets[0][0].idpago;

    await new sql.query(`update facturas set monto = monto - ${abono} where idfactura = ${idfactura}`);
    await new sql.query(`update contrato set balance = balance - ${abono}, idpago = ${idpago} where idcontrato = ${idcontrato}`);

    res.json(idpago);
}

controllers.pagodeposito = async function(req, res){
    const {idfactura,formapago, balance, idingreso, tipo} = req.body

    if(balance <= 0 || balance == null || balance == "" || balance == undefined ){
        return res.send('errD')
    } 
    if(idingreso <= 0 || idingreso == null || idingreso == "" || idingreso == undefined ){
        return res.send('errD')
    }
    if(tipo <= 0 || tipo == null || tipo == "" || tipo == undefined ){
        return res.send('errD')
    }
    if(idfactura <= 0 || idfactura == null || idfactura == "" || idfactura == undefined ){
        return res.send('errD')
    }
    if(formapago <= 0 || formapago == null || formapago == "" || formapago == undefined ){
        return res.send('errD')
    }
      

    await sql.connect(db)
    const fact = await new sql.query(`select f.monto, f.idcontrato, f.idfactura, c.balance, f.concepto, f.fecha  
    from facturas f inner join contrato c on c.idcontrato = f.idcontrato where f.idfactura = ${idfactura}`)

    if(tipo == 'abono'){
            
        if(fact.recordsets[0][0].monto <= balance){

            var monto = fact.recordsets[0][0].monto;
            var idcontrato = fact.recordsets[0][0].idcontrato;
            var fechafactura = fact.recordsets[0][0].fecha;
            var concepto = fact.recordsets[0][0].concepto;
            
            var request = new sql.Request();
            await request
            .input('idcontrato', sql.Int, idcontrato)
            .input('monto', sql.Money, monto)
            .input('balance', sql.Money, monto)
            .input('idfactura', sql.Int, idfactura)
            .input('fechafactura', sql.Date, fechafactura)
            .input('concepto', sql.Text, concepto)
            .input('formapago', sql.VarChar, formapago)
            .query(`insert into pagos (idcontrato, fecha, monto, balance,idfactura,fechafactura,concepto,formapago) 
            values (@idcontrato,getdate(),@monto,@balance,@idfactura,@fechafactura,@concepto,@formapago)`, [idcontrato,monto,monto,idfactura,fechafactura,concepto,formapago]);
        
            pago = await new sql.query(`select TOP 1 idpago from pagos where idcontrato = ${idcontrato} and idfactura = ${idfactura} order by idpago desc`)
            idpago = pago.recordsets[0][0].idpago;
        
            await new sql.query(`update contrato set balance = balance - ${monto}, idpago = ${idpago} where idcontrato = ${idcontrato}`);
            await new sql.query(`update ingresos set balance = balance - ${monto} where idingreso = ${idingreso}`);
            await new sql.query(`update facturas set estado = 'P' where idfactura = ${idfactura}`);
        
            return res.json(idpago);
        } 

        var monto = balance;
        var idcontrato = fact.recordsets[0][0].idcontrato;
        var fechafactura = fact.recordsets[0][0].fecha;
        var concepto = "Abono de " + fact.recordsets[0][0].concepto;
        
        var request = new sql.Request();
        await request
        .input('idcontrato', sql.Int, idcontrato)
        .input('monto', sql.Money, monto)
        .input('balance', sql.Money, monto)
        .input('idfactura', sql.Int, idfactura)
        .input('fechafactura', sql.Date, fechafactura)
        .input('concepto', sql.Text, concepto)
        .input('formapago', sql.VarChar, formapago)
        .query(`insert into pagos (idcontrato, fecha, monto, balance,idfactura,fechafactura,concepto,formapago) 
        values (@idcontrato,getdate(),@monto,@balance,@idfactura,@fechafactura,@concepto,@formapago)`, [idcontrato,monto,monto,idfactura,fechafactura,concepto,formapago]);

        pago = await new sql.query(`select TOP 1 idpago from pagos where idcontrato = ${idcontrato} and idfactura = ${idfactura} order by idpago desc`)
        idpago = pago.recordsets[0][0].idpago;

        await new sql.query(`update facturas set monto = monto - ${balance} where idfactura = ${idfactura}`);
        await new sql.query(`update ingresos set balance = 0 where idingreso = ${idingreso}`);
        await new sql.query(`update contrato set balance = balance - ${balance}, idpago = ${idpago} where idcontrato = ${idcontrato}`);

        return res.json(idpago);
        
    }else if(tipo == 'pago'){

        if(fact.recordsets[0][0].monto > balance){
            return res.send('errD')
        }    

        var monto = fact.recordsets[0][0].monto;
        var idcontrato = fact.recordsets[0][0].idcontrato;
        var fechafactura = fact.recordsets[0][0].fecha;
        var concepto = fact.recordsets[0][0].concepto;
        
        var request = new sql.Request();
        await request
        .input('idcontrato', sql.Int, idcontrato)
        .input('monto', sql.Money, monto)
        .input('balance', sql.Money, monto)
        .input('idfactura', sql.Int, idfactura)
        .input('fechafactura', sql.Date, fechafactura)
        .input('concepto', sql.Text, concepto)
        .input('formapago', sql.VarChar, formapago)
        .query(`insert into pagos (idcontrato, fecha, monto, balance,idfactura,fechafactura,concepto,formapago) 
        values (@idcontrato,getdate(),@monto,@balance,@idfactura,@fechafactura,@concepto,@formapago)`, [idcontrato,monto,monto,idfactura,fechafactura,concepto,formapago]);
    
        pago = await new sql.query(`select TOP 1 idpago from pagos where idcontrato = ${idcontrato} and idfactura = ${idfactura} order by idpago desc`)
        idpago = pago.recordsets[0][0].idpago;
    
        await new sql.query(`update contrato set balance = balance - ${monto}, idpago = ${idpago} where idcontrato = ${idcontrato}`);
        await new sql.query(`update ingresos set balance = balance - ${monto} where idingreso= ${idingreso}`);
        await new sql.query(`update facturas set estado = 'P' where idfactura = ${idfactura}`);
    
        return res.json(idpago);
    }

}




module.exports = controllers;