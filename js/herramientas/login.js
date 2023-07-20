document.getElementById("ingresar").addEventListener("click",(event)=>{
    event.preventDefault();
    login();
})

async function login(){
    var user = document.getElementById("user");
    var passw = document.getElementById("passw");

    if(passw.value==""){
        alert("Ingrese la contraseña!")
        return false;
    }
    if(user.value==""){
        alert("Ingrese el usuario!")
        return false;
    }

    var data = {
        user: user.value,
        password: passw.value
    };
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhr.response == "non"){
                alert("El usuario o la contraseña son incorrectas!")
            }else{
                let Data = [];
                Data = JSON.parse(xhr.response);
                sessionStorage.setItem("user", Data.user);
                sessionStorage.setItem("auth", Data.auth);
                window.location.assign('../../index.html');
            }
        }
    }

    xhr.onerror = function(e){
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api+"/login");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify( data));   
    
}