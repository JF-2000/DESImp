const express = require('express');

const login = require("../controllers/login");

var app = express();

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Conexiones users

app.post('/login', login.session)

module.exports = app;