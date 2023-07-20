const express = require('express');

const bienes = require("../controllers/bienes");

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones bienes

app.get('/tipobienes', bienes.alltipobienes)

app.get('/bienes', bienes.allbienes)

app.get('/bienes/activos', bienes.bienesactivos)

app.get('/bienes/grupos', bienes.allgrupos)

app.post('/bienes/addgrupo', bienes.addgrupo)

app.post('/grupo/update', bienes.updategrupo)

app.get('/bienes/grupo/:idgrupo', bienes.selectgrupo)

app.post('/bienes/modificar/update', bienes.updatebien)

app.get('/tipobien/:idtipobien', bienes.tipobien)

app.post('/tipobienes/update', bienes.updatetipobien)

app.get('/bienes/:idbien', bienes.bienid)

app.post('/bienes/add', bienes.addbien)

app.post('/creartipo', bienes.creartipo)

app.get('/databien/:idbien', bienes.databien)

app.get('/factbien/:idcontrato', bienes.factbien)


module.exports = app;