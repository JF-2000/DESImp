const express = require('express');
const pagos = require("../controllers/pagos")

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Conexiones pagos.

app.post('/pagos/grupo', pagos.pagosporgrupos)

app.get('/pago/recibo/:idpago', pagos.recibopago)

app.post('/pago/registrarpago', pagos.registrarpago)

app.post('/pago/registrarabono', pagos.abonar)

app.post('/pago/deposito', pagos.pagodeposito)

module.exports = app;
