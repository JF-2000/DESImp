const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Rutas
app.use(require('./clientes/routes/clientes'));
app.use(require('./bienes/routes/bienes'));
app.use(require('./finanzas/contratos/routes/contratos'));
app.use(require('./finanzas/ingresos/routes/ingresos'));
app.use(require('./finanzas/facturas/routes/facturas'));
app.use(require('./finanzas/gastos/routes/gastos'));
app.use(require('./finanzas/pagos/routes/pagos'));
app.use(require('./finanzas/reportes/routes/reportes'));
app.use(require('./login/routes/login'));
app.use(require('./helpers/routes/tools'));



var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port   
   console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app;
