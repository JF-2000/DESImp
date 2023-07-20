select b.idbien, descripcion, isnull(direccion,'-')direccion,tp.nombre nombretipo, isnull(gp.nombre,'-') nombregrupo, disponible
from bienes b inner join tipobien tp on tp.idtipobien = b.idtipobien 
left outer join grupos gp on gp.idgrupo = b.idgrupo
where b.idbien = 1

select idcontrato, c.activo, plazo, 
CONVERT(VARCHAR, fechaini,23)fechaini, 
CONVERT(VARCHAR, fechafin,23)fechafin, 
CASE WHEN fechafactini <> fechafactfin THEN CAST( DATEDIFF(D, CURRENT_TIMESTAMP,fechafactfin) as VARCHAR(10))
     WHEN fechafactini = fechafactfin THEN 'Indefinido' 
	 WHEN fechafactfin < CURRENT_TIMESTAMP then 'Vencido' 
	 end as contratovence, 
	 c.monto, c.balance, c.idcliente, cl.nombre nombrecliente,isnull(cedula,'Inexistente')cedula, isnull(telefono,'Inexistente')telefono
from bienes b inner join tipobien tp on tp.idtipobien = b.idtipobien 
left outer join contrato c on c.idbien = b.idbien left outer join clientes cl on cl.idcliente = c.idcliente left outer join grupos gp on gp.idgrupo = b.idgrupo left outer join plazos pl on pl.idplazo = c.idplazo
where b.idbien = 2 and c.activo = 1

select gp.idgrupo, gp.nombre, sum(balance) balance
from grupos gp left outer join bienes b on b.idgrupo = gp.idgrupo left outer join contrato c on c.idbien = b.idbien
group by gp.nombre, gp.idgrupo

select FORMAT(getdate(), 'yyyy-MM-dd hh:mm:ss tt')

insert into pagos (idcontrato, fecha, monto, balance,idfactura,fechafactura,concepto,formapago) 
    values (1, getdate(),5000,5000,7,'2022-6-30', 'Junio', 'EF')

select p.idpago, ct.idcontrato,cl.nombre, p.monto, descripcion, FORMAT(fecha,'dd-MM-yyyy') fecha, FORMAT(fecha,'hh:mm:ss tt') hora,CONVERT(VARCHAR, fechafactura, 23)fechafactura , p.concepto, p.idfactura,formapago
    from pagos p inner join contrato ct on ct.idcontrato = p.idcontrato inner join clientes cl on ct.idcliente = cl.idcliente inner join bienes b on b.idbien = ct.idbien
    where p.idpago = 6

select ct.idcliente, cl.nombre, cedula, telefono, ct.balance, gp.nombre nombregrupo, gp.idgrupo
    from contrato ct inner join clientes cl on cl.idcliente = ct.idcliente inner join plazos pl on pl.idplazo = ct.idplazo left outer join facturas f on f.idfactura = ct.idfactura inner join bienes b on b.idbien = ct.idbien left outer join grupos gp on gp.idgrupo = b.idgrupo
    where (fechafactini <= CURRENT_TIMESTAMP and DATEDIFF(D,isnull(fecha,fechafactini), CURRENT_TIMESTAMP)/dias > 0 and ct.activo = 1) or (ct.balance > 0 and ct.activo = 1) or (fechafactini <= CURRENT_TIMESTAMP and fechafactfin < CURRENT_TIMESTAMP and DATEDIFF(D,isnull(fecha,fechafactini), fechafactfin)/dias > 0 and ct.activo = 1)
    group by ct.idcliente,cl.nombre,cedula, telefono, ct.balance, gp.nombre,gp.idgrupo

select idgasto, idbien, concepto, monto, FORMAT(fecha, 'dd-MM-yyyy') fecha from gastos
where idbien = 1 and activo = 1

select sum(monto) total from gastos
    where idbien = 1 and activo = 1

update clientes set nombre = 'papo'
