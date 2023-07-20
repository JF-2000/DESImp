const express = require('express');

const cliente = require("../controllers/clientes");

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones cliente

app.get('/clientes', cliente.listaclientes)

app.get('/clientes/contratos', cliente.contratosclientes)

app.get('/clientes/:idcliente', cliente.clienteid)

app.post('/clientes/add', cliente.clienteadd)

app.post('/clientes/update', cliente.updatecliente)

app.get('/clientes/grupo/:idgrupo', cliente.clientesgrupos)

module.exports = app;