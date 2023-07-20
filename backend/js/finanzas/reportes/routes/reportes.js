const express = require('express');

const reportes = require("../controllers/reportes")

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones reportes

app.post('/reporte/benegrupos', reportes.reportbenegrupo)

app.get('/estadofinanciero', reportes.estadofinanzas)

module.exports = app;