truncate table bienes
truncate table clientes
truncate table contrato


truncate table facturas 
truncate table pagos
update contrato set balance = 0
update contrato set idfactura = 0
update contrato set idpago = 0


truncate table tipobien
truncate table grupos


---DataBien
select b.idbien, c.activo, descripcion,plazo ,isnull(direccion,'-')direccion,tp.nombre nombretipo, isnull(gp.nombre,'-') nombregrupo, disponible, idcontrato, CONVERT(VARCHAR, fechaini,23)fechaini, CONVERT(VARCHAR, fechafin,23)fechafin, DATEDIFF(D, CURRENT_TIMESTAMP,fechafin)contratovence, c.monto, c.balance, c.idcliente, cl.nombre nombrecliente,isnull(cedula,'Inexistente')cedula, isnull(telefono,'Inexistente')telefono
from bienes b inner join tipobien tp on tp.idtipobien = b.idtipobien 
left outer join contrato c on c.idbien = b.idbien left outer join clientes cl on cl.idcliente = c.idcliente left outer join grupos gp on gp.idgrupo = b.idgrupo left outer join plazos pl on pl.idplazo = c.idplazo
where b.idbien = 2 and ISNULL(c.activo, b.activo) = 1

---Facturas databien
select f.idfactura, ct.idcontrato, CONVERT(VARCHAR,f.fecha,23)fechaf, f.monto montof, f.concepto conceptof
from contrato ct left outer join facturas f on f.idcontrato = ct.idcontrato
where ct.idcontrato = 1 and ct.activo = 1
---Pagos databien
select TOP 1 ct.idcontrato,pg.idpago,CONVERT(VARCHAR,pg.fecha,23)fechap, pg.monto montop, recibidopor, pagopor, pg.balance balancep
from contrato ct left outer join pagos pg on pg.idcontrato = ct.idcontrato
where ct.idcontrato = 1 and ct.activo = 1 order by pg.idpago desc


select b.idbien, g.idgrupo, tb.nombre nombretipo, tb.idtipobien,isnull(g.nombre,'-') nombregrupo, descripcion, isnull(direccion,'-') direccion, disponible
    from bienes b inner join tipobien tb on tb.idtipobien = b.idtipobien left outer join grupos g on g.idgrupo = b.idgrupo 
    where b.activo = 1 


---IDK


select TOP 1 isnull(fecha,fechaini)fecha
from contrato ct left outer join facturas f on f.idcontrato = ct.idcontrato 
where ct.idcontrato = 1 order by f.idfactura desc

select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechaini), CURRENT_TIMESTAMP)/dias facturasG, ct.monto, ct.idcliente,agrupado
from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
where (fechaini <= CURRENT_TIMESTAMP and fechafin >= CURRENT_TIMESTAMP and ct.activo = 1 and idcliente = 3) or (fechaini <= CURRENT_TIMESTAMP and fechaini = fechafin and ct.activo = 1 and idcliente = 3)


select TOP 1 idfactura from facturas  where idcontrato = 2 order by idfactura desc

select f.idfactura,b.descripcion, f.fecha, f.monto, f.balance from facturas f inner join contrato ct on ct.idcontrato = f.idcontrato inner join clientes cl on cl.idcliente = ct.idcliente inner join bienes b on b.idbien = ct.idbien where ct.idcliente = 2 order by idfactura desc

select ct.idcliente, nombre, cedula, telefono 
    from contrato ct inner join clientes cl on cl.idcliente = ct.idcliente inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idcontrato = ct.idcontrato
    where (DATEDIFF(D,isnull(fecha,fechaini), CURRENT_TIMESTAMP)/dias != 0) or (fechaini <= CURRENT_TIMESTAMP and fechaini = fechafin) 
    group by ct.idcliente,nombre,cedula, telefono


select c.idcontrato, descripcion,cl.nombre nombrecliente, CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin, dias, c.monto, c.balance, DATEDIFF(d, isnull(fecha,fechaini), CURRENT_TIMESTAMP)/dias facturasgeneradas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') Fechadeconsulta, b.idbien
  from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente inner join bienes b on b.idbien = c.idbien
  where c.idcliente = 3 and c.activo = 1 order by c.idcontrato

select f.idfactura,fecha, f.monto, descripcion 
from facturas f inner join contrato c on c.idcontrato = f.idcontrato inner join bienes b on b.idbien = c.idbien 
where f.idfactura = 1


select f.idfactura,b.descripcion, CONVERT(VARCHAR,f.fecha,23)fecha, f.monto, f.balance 
    from facturas f inner join contrato ct on ct.idcontrato = f.idcontrato inner join clientes cl on cl.idcliente = ct.idcliente inner join bienes b on b.idbien = ct.idbien 
    where ct.idcontrato = 2 order by f.idfactura desc

select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechaini), CURRENT_TIMESTAMP)/dias facturasG, ct.monto, ct.idcliente , agrupado
    from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where (fechaini <= CURRENT_TIMESTAMP and fechafin >= CURRENT_TIMESTAMP and ct.activo = 1 and ct.idcontrato = 2) or (fechaini <= CURRENT_TIMESTAMP and fechaini = fechafin and ct.activo = 1 and ct.idcontrato = 2)


select c.idcontrato, descripcion,cl.nombre nombrecliente, CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin, dias, c.monto, c.balance,isnull( (DATEDIFF(d, isnull(fecha,fechaini), CURRENT_TIMESTAMP)/dias),0) facturasgeneradas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') Fechadeconsulta, b.idbien
  from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente inner join bienes b on b.idbien = c.idbien
  where c.idcliente = 3 and c.activo = 1 order by c.idcontrato

  select f.monto, f.idcontrato, f.idfactura, c.balance from facturas f inner join contrato c on c.idcontrato = f.idcontrato where f.idfactura = 1

  select ct.idcliente, nombre, cedula, telefono
    from contrato ct inner join clientes cl on cl.idcliente = ct.idcliente inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where (fechaini <= CURRENT_TIMESTAMP and DATEDIFF(D,isnull(fecha,fechaini), CURRENT_TIMESTAMP)/dias > 0 and ct.activo = 1) or (fechaini <= CURRENT_TIMESTAMP and fechaini = fechafin and ct.activo = 1) or (ct.balance > 0)
    group by ct.idcliente,nombre,cedula, telefono

select  c.idcontrato, DATEDIFF(D,isnull(fecha,fechaini), CURRENT_TIMESTAMP)/30 facturasG 
from contrato c left outer join facturas f on f.idfactura = c.idfactura


select SUM(p.monto)totalgenerado,tp.nombre
from pagos p inner join contrato c on c.idcontrato = p.idcontrato inner join bienes b on b.idbien = c.idbien inner join tipobien tp on tp.idtipobien = b.idtipobien
where YEAR(fecha) = YEAR(CURRENT_TIMESTAMP)
group by tp.nombre

select SUM(f.monto)totaldebe,tp.nombre
from facturas f inner join contrato c on c.idcontrato = f.idcontrato inner join bienes b on b.idbien = c.idbien inner join tipobien tp on tp.idtipobien = b.idtipobien
where YEAR(fecha) = YEAR(CURRENT_TIMESTAMP)
group by tp.nombre

select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechaini), CURRENT_TIMESTAMP)/dias facturasG, ct.monto, ct.idcliente, ct.balance, agrupado, plazo
    from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where (fechaini <= CURRENT_TIMESTAMP and fechafin >= CURRENT_TIMESTAMP and ct.activo = 1 and ct.idcontrato = 5) or (fechaini <= CURRENT_TIMESTAMP and fechaini = fechafin and ct.activo = 1 and ct.idcontrato = 5)

select idfactura,CONVERT(varchar,fecha,23)fecha, monto,balance,concepto,estado
from facturas 
where idcontrato = 7

select idpago,idcontrato,CONVERT(varchar,fecha,23)fecha,monto,concepto,balance,recibidopor,pagopor
from pagos 
where idcontrato = 7

select SUM(monto) from facturas where idcontrato = 7 and estado = 'D'

select ct.idcliente, nombre, cedula, telefono, ct.balance
    from contrato ct inner join clientes cl on cl.idcliente = ct.idcliente inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where (fechafactini <= CURRENT_TIMESTAMP and DATEDIFF(D,isnull(fecha,fechafactini), CURRENT_TIMESTAMP)/dias > 0 and ct.activo = 1) or (fechafactini <= CURRENT_TIMESTAMP and fechafactini = fechafactfin and ct.activo = 1) or (ct.balance > 0)
    group by ct.idcliente,nombre,cedula, telefono, ct.balance

---new facturas por generar
select c.idcontrato, descripcion,cl.nombre nombrecliente, CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin, dias, c.monto, c.balance, DATEDIFF(d, isnull(fecha,fechafactini),case when fechafactfin = fechafactini and fechafactini < CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin > CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP then fechafactfin end)/dias facturasgeneradas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') Fechadeconsulta, b.idbien, c.activo
    from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente inner join bienes b on b.idbien = c.idbien
    where c.idcliente = 1 order by c.idcontrato

---new cantidad facturas
select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechafactini), case when fechafactfin = fechafactini and fechafactini < CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin > CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP then fechafactfin when fechafactini <= CURRENT_TIMESTAMP and fechafactfin = fechafactini then CURRENT_TIMESTAMP end)/dias facturasG, ct.monto, ct.idcliente, ct.balance, agrupado, plazo
    from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where ct.activo = 1 and ct.idcontrato = 2

---old facturas por generar
select c.idcontrato, descripcion,cl.nombre nombrecliente, CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin, dias, c.monto, c.balance, DATEDIFF(d, isnull(fecha,fechafactini), CURRENT_TIMESTAMP)/dias facturasgeneradas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') Fechadeconsulta, b.idbien, c.activo
    from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente inner join bienes b on b.idbien = c.idbien
    where c.idcliente = 1 order by c.idcontrato

---old cantidad facturas
select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechafactini), CURRENT_TIMESTAMP)/dias facturasG, ct.monto, ct.idcliente, ct.balance, agrupado, plazo
    from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
    where (fechafactini <= CURRENT_TIMESTAMP and fechafactfin >= CURRENT_TIMESTAMP and ct.activo = 1 and ct.idcontrato = 1) or (fechafactini <= CURRENT_TIMESTAMP and fechafactini = fechafactfin and ct.activo = 1 and ct.idcontrato = 1) or (fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP and ct.idcontrato = 1)

--Consultas
select g.idgrupo,nombre,pagos,gastos,ingresos from grupos g
left outer join (select gp.idgrupo, sum(pg.monto) pagos from contrato ct left outer join pagos pg on pg.idcontrato = ct.idcontrato 
inner join bienes b on b.idbien = ct.idbien inner join grupos gp on gp.idgrupo = b.idgrupo
where FORMAT (pg.fecha, 'yyyy-MM-dd') >= '2022-06-08' and FORMAT (pg.fecha, 'yyyy-MM-dd') <= '2022-07-15'
group by gp.idgrupo) i on i.idgrupo = g.idgrupo
left outer join (select gp.idgrupo, sum(gt.monto) gastos from gastos gt inner join grupos gp on gp.idgrupo = gt.idgrupo
where FORMAT (gt.fecha, 'yyyy-MM-dd') >= '2022-06-08' and FORMAT (gt.fecha, 'yyyy-MM-dd') <= '2022-07-15'
group by gp.idgrupo) e on e.idgrupo = g.idgrupo
left outer join (select gp.idgrupo, sum(ig.monto) ingresos from contrato ct left outer join ingresos ig on ig.idcliente = ct.idcliente
inner join bienes b on b.idbien = ct.idbien inner join grupos gp on gp.idgrupo = b.idgrupo
where FORMAT (ig.fecha, 'yyyy-MM-dd') >= '2022-06-08' and FORMAT (ig.fecha, 'yyyy-MM-dd') <= '2022-07-15'
group by gp.idgrupo) a on a.idgrupo = g.idgrupo
where activo = 1;


select pg.idpago, gp.nombre grupo, descripcion, pg.monto, FORMAT(pg.fecha, 'dd-MM-yyyy')fecha, FORMAT(pg.fecha,'HH:mm tt')hora  
from pagos pg inner join contrato ct on ct.idcontrato = pg.idcontrato inner join bienes b on b.idbien = ct.idbien left outer join grupos gp on gp.idgrupo = b.idgrupo
where gp.idgrupo = 1 and FORMAT (pg.fecha, 'yyyy-MM-dd') >= '2022-06-08' and FORMAT (pg.fecha, 'yyyy-MM-dd') <= '2022-07-08'

select gp.idgrupo, sum(ig.monto) ingresos from contrato ct left outer join ingresos ig on ig.idcliente = ct.idcliente
inner join bienes b on b.idbien = ct.idbien inner join grupos gp on gp.idgrupo = b.idgrupo
where FORMAT (ig.fecha, 'yyyy-MM-dd') >= '2022-06-08' and FORMAT (ig.fecha, 'yyyy-MM-dd') <= '2022-07-15'
group by gp.idgrupo

select cl.idcliente,cl.nombre, CONVERT(varchar,b.descripcion) bien, SUM(ig.monto)tingresos from contrato ct inner join ingresos ig on ig.idcliente = ct.idcliente inner join clientes cl on cl.idcliente = ct.idcliente 
inner join bienes b on b.idbien = ct.idbien inner join grupos gp on gp.idgrupo = b.idgrupo
where gp.idgrupo = 2
group by cl.nombre, cl.idcliente, CONVERT(varchar,b.descripcion)

select ct.idcontrato, DATEDIFF(D,isnull(fecha,fechafactini), case when fechafactfin = fechafactini and fechafactini < CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin > CURRENT_TIMESTAMP then CURRENT_TIMESTAMP when fechafactini <= CURRENT_TIMESTAMP and fechafactfin <= CURRENT_TIMESTAMP then fechafactfin when fechafactini <= CURRENT_TIMESTAMP and fechafactfin = fechafactini then CURRENT_TIMESTAMP end)/dias facturasG, ct.monto, ct.idcliente, ct.balance, agrupado, plazo
from contrato ct inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura
where ct.activo = 1 and ct.idcontrato = 67