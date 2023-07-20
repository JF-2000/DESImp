const express = require('express');

const ingresos = require("../controllers/ingresos")

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones ingresos

app.post('/ingreso/add', ingresos.addingreso)

app.post('/ingreso/update', ingresos.updateingreso)

app.get('/ingreso/:idcliente', ingresos.ingresos)

app.get('/ingreso/contrato/:idcontrato', ingresos.ingresoscontrato)

app.get('/ingreso/select/:idingreso', ingresos.reingreso)

app.get('/ingreso/grupo/:idgrupo', ingresos.ingresosgrupo)

module.exports = app;