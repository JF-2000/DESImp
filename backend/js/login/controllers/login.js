const db = require("../../conection");
const sql = require('mssql')

const controllers = {};

//Conexiones usuario

controllers.session = async function (req, res) {
    const {user,password} = req.body;
    
    await sql.connect(db)
    var usuario = await sql.query(`select iduser,usuario, password, auth 
    from usuarios 
    where usuario = '${user}' and password = '${password}'`);
    let data = usuario.recordset[0];
  
    if(data == undefined){
      res.send("non")
    }else{
      res.json(data)
    }
}
  

module.exports = controllers;