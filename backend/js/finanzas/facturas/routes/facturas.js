const express = require('express');

const facturas = require("../controllers/facturas");

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones facturas.

app.get('/consultafacturas/:idcontrato', facturas.consultarfacturascontrato)

app.get('/clientesfacturas', facturas.clientesconfacturas)

app.get('/factura/:idfactura', facturas.selectfactura)

app.post('/factura/update', facturas.updatefactura)

app.get('/facturas/:idcontrato',facturas.facturaporcontrato)

app.get('/facturas/adelanto/:idcontrato',facturas.adelantarfactura)



module.exports = app;