---Todos
select c.idcontrato, descripcion,cl.nombre nombrecliente, fechaini,fechafin, dias, c.monto, c.balance, DATEDIFF(d, fechaini, CURRENT_TIMESTAMP)/dias facturasgeneradas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') Fechadeconsulta
from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente inner join bienes b on b.idbien = c.idbien
where c.activo = 1


select idcontrato,descripcion,CONVERT(VARCHAR, fechaini,23)fechaini,CONVERT(VARCHAR, fechafin,23)fechafin,balance,plazo,b.idbien
from contrato c inner join bienes b on b.idbien = c.idbien inner join plazos p on p.idplazo = c.idplazo 
where idcliente = 1

---Solo los que tienen facturas actuales
select c.idcontrato, descripcion,cl.nombre Nombrecliente, fechaini,fechafin, dias, c.monto, c.balance, DATEDIFF(d, fechaini, CURRENT_TIMESTAMP)/dias facturasGeneradas, agrupado,  FORMAT (getdate(), 'yyyy-MM-dd') Fechadeconsulta
from contrato c left outer join facturas f on f.idfactura = c.idfactura inner join plazos p on p.idplazo = c.idplazo inner join clientes cl on cl.idcliente = c.idcliente inner join bienes b on b.idbien = c.idbien
where DATEADD(D,dias,isnull(fecha,fechaini)) <= CURRENT_TIMESTAMP 

---Clientes por grupos.
select ct.idcontrato, cl.idcliente, cl.nombre, cedula, telefono, descripcion, g.nombre gnombre
from contrato ct inner join bienes b on b.idbien = ct.idbien left outer join grupos g on b.idgrupo = g.idgrupo inner join clientes cl on cl.idcliente = ct.idcliente
where g.idgrupo = 1 and ct.activo = 1

select * 
from contrato ct inner join bienes b on b.idbien = ct.idbien left outer join grupos g on b.idgrupo = g.idgrupo inner join clientes cl on cl.idcliente = ct.idcliente
where g.idgrupo = 1 and ct.idcliente = 1 and ct.activo = 1

truncate table facturas
truncate table pagos
update contrato set balance = 0, idfactura = 0, idpago = 0