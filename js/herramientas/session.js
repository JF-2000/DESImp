if(window.sessionStorage){
    if(sessionStorage.getItem("auth") != 1){
        window.location.assign("../../vistas/funciones/login.html")
    }
}

if(document.getElementById("volver")){
    document.getElementById("volver").addEventListener("click", ()=>{
        window.location.assign(document.referrer);
    })
}

if(document.getElementById("desde") && document.getElementById("hasta")){
    var desde = document.getElementById("desde");
    var hasta = document.getElementById("hasta");

    desde.addEventListener("change", ()=>{
        sessionStorage.setItem("desde", desde.value)
        sessionStorage.setItem("hasta", hasta.value)
    })

    hasta.addEventListener("change", ()=>{
        sessionStorage.setItem("desde", desde.value)
        sessionStorage.setItem("hasta", hasta.value)
    })
}