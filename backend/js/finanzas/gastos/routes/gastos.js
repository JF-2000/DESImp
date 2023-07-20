const express = require('express');

const gastos = require("../controllers/gastos")

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones gastos

app.post('/gastos/add', gastos.addgasto)

app.post('/gastos/update', gastos.updategasto)

app.post('/gastos', gastos.gastosgrupo)

app.get('/gasto/:idgasto', gastos.regasto)

module.exports = app;