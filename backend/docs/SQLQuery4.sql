---Prin
select DATEDIFF(D,CURRENT_TIMESTAMP,fechafin) meses,monto,idcliente, DATEDIFF(M,fechaini,CURRENT_TIMESTAMP)*monto Debe 
from contrato
where fechaini <= CURRENT_TIMESTAMP

---Prin2
select isnull(fecha,fechaini)fecha,c.idcontrato, dias,c.monto, DATEDIFF(d, isnull(fecha,fechaini),CURRENT_TIMESTAMP)/dias facturas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') fechahoy, (DATEDIFF(d, isnull(fecha,fechaini),CURRENT_TIMESTAMP)/dias * c.monto)Debe
from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo
where DATEADD(D,dias,isnull(fecha,fechaini)) <= CURRENT_TIMESTAMP

select isnull(fecha, fechaini)fecha, f.idcontrato,f.idfactura, f.monto, f.balance 
from facturas f left outer join contrato c on f.idcontrato = c.idcontrato 
where fecha <= CURRENT_TIMESTAMP

---act1
select montopago from factura 

select (montototal-montopago) deuda from debe d inner join factura f on f.idcontrato = d.idcontrato

Update debe set monto = 7000 where idcontrato = 3 

select montototal from debe where idcontrato = 3

select concepto,balance from debe where idcontrato = 3 and balance > 0

select balance from debe where idcontrato = 3 and balance = 0

---act2
select balance from contrato where idcontrato = 3

select iddeuda, fecha from debe 

select idpago, fechapago from pagos where idcontrato 

select top 1 iddebe, idcontrato from debe order by fecha desc , iddebe desc
select top 1 idpago, idcontrato from pagos order by fecha desc , idpago desc

update contrato set  iddebe = isnull((select top 1 iddebe 
from debe where debe.idcontrato = contrato.idcontrato 
order by fecha desc , iddebe desc),0)

update contrato set  idpago = isnull((select top 1 idpago 
from pagos where pagos.idcontrato = contrato.idcontrato 
order by fecha desc , iddebe desc),0)

select DISTINCT(nombre),cedula,clientes.idcliente from clientes join contrato on clientes.idcliente = contrato.idcliente

select idcontrato,descripcion,CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin,balance,plazo
from contrato c inner join bienes b on b.idbien = c.idbien inner join plazos p on p.idplazo = c.idplazo 
where idcliente = 1

select DISTINCT(nombre),cedula from facturas f inner join contrato ct on ct.idcontrato = f.idcontrato inner join clientes cl on ct.idcliente = cl.idcliente

---Ver ultima factura del cliente X
select top 1 f.idfactura, f.idcontrato, fecha, descripcion, idcliente 
from facturas f inner join contrato ct on ct.idcontrato = f.idcontrato inner join bienes b on b.idbien = ct.idbien 
where ct.idcliente = 2 
order by fecha desc , idfactura desc

---ID
select DATEDIFF(M,isNull(fecha,fechaini),CURRENT_TIMESTAMP) mesesdebe,c.monto,f.idcontrato, DATEDIFF(M,isNull(fecha,fechaini),CURRENT_TIMESTAMP)*c.monto Debe
from contrato c inner join facturas f on f.idcontrato = c.idcontrato
where isNull(fecha,fechaini) <= CURRENT_TIMESTAMP group by f.idcontrato

select idbien, nombre,descripcion from bienes b inner join tipobien tb on tb.idtipobien = b.idtipobien

select cl.nombre, b.idbien, b.descripcion,CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin,c.monto,c.balance,c.agrupado,c.idplazo,p.plazo,p.dias
  from contrato c inner join bienes b on b.idbien = c.idbien inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente 
