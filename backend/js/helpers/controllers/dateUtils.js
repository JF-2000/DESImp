const controllers = {};

controllers.IncMonth = (date,meses) =>{
    date = new Date(date)
    return new Date(date.setMonth(date.getMonth()+meses)).toISOString().slice(0,10);
}

controllers.Date = () =>{
    return new Date().toISOString().slice(0,10);  
}

controllers.IncDate = (date,dias) =>{
    date = new Date(date)
    return new Date(date.setDate(date.getDate()+dias)).toISOString().slice(0,10);
}


module.exports = controllers;
