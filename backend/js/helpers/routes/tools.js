const express = require('express');

const tool = require("../controllers/tools");

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones herramientas

app.post('/borrar', tool.borrar)
app.use('/comprobar', tool.comprobar)

module.exports = app;