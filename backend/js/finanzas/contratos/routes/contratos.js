const express = require('express');
const contratos = require("../controllers/contratos")

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Conexiones contratos.

app.post('/contratos/add', contratos.addcontrato)

app.post('/contratos/update', contratos.updatecontrato)

app.get('/contratos/:idcliente', contratos.contratosdelcliente)

app.get('/contratos/capturar/:idcontrato', contratos.recuperarcontrato)


module.exports = app;