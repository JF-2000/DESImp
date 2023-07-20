const Prefactura = document.getElementById("factura");
const modiffactura = document.getElementById("modfactura");
const abonofactura = document.getElementById("abonofactura");
const listaingresos = document.getElementById("tablaingresos");
intcoma = new Intl.NumberFormat('en-US');

var iding = 0;
var baling = 0;
var idpago = 0;
async function unafactura(id){
    let lafactura = []; 
    var html = "";
    await fetch(api + `/factura/${id}`)
    .then(response => response.json())
    .then((data) => lafactura = data[0]);
    html = `<div class="row">
        <div class="col-6">
            <label>ID:<h5>${lafactura.idfactura}</h5></label><br>
            <label>DESCRIPCIÓN:<h5>${lafactura.descripcion}</h5></label><br>
            <label>FECHA:<h5>${lafactura.fecha}</h5></label><br>
            <label>CONCEPTO:<h5>${lafactura.concepto}</h5></label><br>
        </div>
        <div class="col-6">
            <label>MONTO:<h5>RD$${intcoma.format(lafactura.monto)}</h5></label><br>
            <label>Forma de pago: </label><br>
            <select id="formapago">
                <option value="EF">Efectivo</option>
                <option value="TC">Tarjeta de crédito</option>
                <option value="DE">Depósito</option>
                <option value="DA">Depósito de alquiler</option>
                <option value="TR">Transferencia</option>
                <option value="NC">Nota de crédito</option>
            </select>
            <button class="btn-inv btn btn-dark" id="btningreso" onclick="ingresos(); listingresos();">Seleccionar ingreso</button>
            <div id="infingreso"></div>
        </div>

        <div style="text-align: right;"><a class="btn btn-primary" onclick="registpago(${lafactura.idfactura})"><i class="fas fa-coins"></i> Registrar pago</a></div>
    </div>`

    Prefactura.innerHTML = html;
    document.getElementById('formapago').addEventListener('change',()=>{
        if(document.getElementById('formapago').value == "DA"){
            document.getElementById('btningreso').style.display = "block"
            document.getElementById('infingreso').style.display = "block"
        }else{
            document.getElementById('btningreso').style.display = "none"
            document.getElementById('infingreso').style.display = "none"
        }
    })
}

async function abono(id){
    let lafactura = []; 
    var html = "";
    await fetch(api + `/factura/${id}`)
    .then(response => response.json())
    .then((data) => lafactura = data[0]);
    html = `<div class="row">
        <div class="col-6">
            <label>ID:<h5>${lafactura.idfactura}</h5></label><br>
            <label>DESCRIPCIÓN:<h5>${lafactura.descripcion}</h5></label><br>
            <label>FECHA:<h5>${lafactura.fecha}</h5></label><br>
            <label>CONCEPTO:<h5>${lafactura.concepto}</h5></label><br>
        </div>
        <div class="col-6">
            <label>MONTO:<h5>RD$${intcoma.format(lafactura.monto)}</h5></label><br>
            <label>Forma de pago: </label><br>
            <select id="formapago">
                <option value="EF">Efectivo</option>
                <option value="TC">Tarjeta de crédito</option>
                <option value="DE">Depósito</option>
                <option value="DA">Depósito de alquiler</option>
                <option value="TR">Transferencia</option>
                <option value="NC">Nota de crédito</option>
            </select><br>
            <button class="btn-inv btn btn-dark" id="btningreso" onclick="ingresos(); listingresos();">Seleccionar ingreso</button>
            <div id="intabono"><label>Abono: <input type="number" id="abono" value="${lafactura.monto}"></label></div>
            <div id="infingreso"></div>
            <br>
        </div>

        <div style="text-align: right;"><a class="btn btn-success" onclick="registrarabono(${lafactura.idfactura})"><i class="fas fa-coins"></i> Registrar abono</a></div>
    </div>`

    abonofactura.innerHTML = html;

    document.getElementById('formapago').addEventListener('change',()=>{
        if(document.getElementById('formapago').value == "DA"){
            document.getElementById('intabono').style.display = "none"
            document.getElementById('btningreso').style.display = "block"
            document.getElementById('infingreso').style.display = "block"
        }else{
            document.getElementById('intabono').style.display = "block"
            document.getElementById('btningreso').style.display = "none"
            document.getElementById('infingreso').style.display = "none"
        }
    })

}




async function modificarfactura(id){
    let lafactura = []; 
    var html = "";
    await fetch(api + `/factura/${id}`)
    .then(response => response.json())
    .then((data) => lafactura = data[0]);
    html = `<div class="row">
        <div class="col-6">
            <label>ID:<h5>${lafactura.idfactura}</h5></label><br>
            <label>DESCRIPCIÓN:<h5>${lafactura.descripcion}</h5></label><br>
            <label>FECHA:<h5>${lafactura.fecha}</h5></label><br>
        </div>
        <div class="col-6">
            <label>CONCEPTO:<input id="concepto" type="text" value="${lafactura.concepto}"></label><br><br>
            <label>MONTO:<input id="monto" type="number" value="${lafactura.monto}"></label><br>
        </div>
        <div style="text-align: right;"><a class="btn btn-warning" onclick="guardar(${id},${lafactura.monto});"><i class="fas fa-edit"></i> Guardar cambios</a></div>
    </div>`

    modiffactura.innerHTML = html;
}

async function listingresos(){
    let ingresos = []; 
    var html = "";
    await fetch(api + `/ingreso/contrato/${info}`)
    .then(response => response.json())
    .then((data) => ingresos = data);
    html = `<table class="table table-bordered" id="tabingresos">
    <tr><th>ID</th><th>Concepto</th><th>Fecha</th><th>Balance</th></tr>`
    ingresos.forEach(ingreso => {
        html += 
        `<tr>
            <td>${ingreso.idingreso}</td>
            <td>${ingreso.concepto}</td>
            <td>${ingreso.fecha}</td>
            <td>RD$${intcoma.format(ingreso.balance)}</td>
            <td><a class="btn btn-primary" onclick="selectingreso(${ingreso.idingreso},${ingreso.balance})">Seleccionar</a></td>
        </tr>`
    })
    html += `</table>`

    listaingresos.innerHTML = html;
}


async function guardar(id,antmonto){
    var concepto = document.getElementById("concepto");
    var monto = document.getElementById("monto");
    if(concepto.value == "" || concepto.value == null || concepto.value == undefined ){
        alert("Ingrese un concepto a la factura.")
        return false;
    }
    if(id == "" || id == null || id == undefined ){
        alert("La factura no contiene ningún ID.")
        return false;
    }
    if(monto.value <= 0 || monto.value == null || monto.value == "" ||  monto.value == undefined){
        alert("La factura no contiene ningún monto válido.")
        return false;
    }
    var data = {
        idfactura: id,
        concepto: concepto.value,
        antmonto: antmonto,
        monto: monto.value
    };

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var error = xhr.response;
            if(error == 'err'){
                alert("Ocurrio un error al modificar la factura.")
            }else{
                window.location.reload();
                alert("Factura modificada correctamente.");
            }
        }
    }

    xhr.onerror = function(){
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api+ `/factura/update`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
}

async function registpago(id){
    var formapago = document.getElementById("formapago");
    if(formapago.value == "DA"){
        return (pagodeposito(id,'pago'))
    }
    var data = {
        idfactura: id,
        formapago: formapago.value
    };

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            idpago = await xhr.response;
            var confi = confirm("Pago registrado correctamente!");
            if(confi == true || confi == false){
                window.open(`../../vistas/funciones/recibo.html?inf=${idpago}`, "Recibo", "width=1050, height=600")
                window.location.reload();
            }
        }
    }

    xhr.onerror = function(){
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api+ `/pago/registrarpago`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
}

async function registrarabono(id){
    var formapago = document.getElementById("formapago");
    if(formapago.value == "DA"){
        return (pagodeposito(id,'abono'))
    }
    var abono = document.getElementById("abono");
    if (abono.value == "" || abono.value == 0 || abono.value == null || abono.value == undefined ){
        alert("Ingrese un monto valido en el abono.")
        return false;
    }
    var data = {
        idfactura: id,
        abono: abono.value,
        formapago: formapago.value
    };

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            idpago = await xhr.response;
            var confi = confirm("Abono registrado correctamente!");
            if(confi == true || confi == false){
                window.open(`../../vistas/funciones/recibo.html?inf=${idpago}`, "Recibo", "width=1050, height=600").then(
                    window.location.reload()
                )
                
            }
        }
    }

    xhr.onerror = function(){
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api+ `/pago/registrarabono`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
}

function selectingreso(id,balan){
    const infoingreso = document.getElementById('infingreso')
    iding = id;
    baling = balan;
    html = `<label>Ingreso:</label><br>
    <label>ID: <label class="label-blue">${iding}</label></label><br>
    <label>Balance: <label class="label-blue">RD$${intcoma.format(baling)}</label></label>`
    infoingreso.innerHTML = html;
    cerrarmodaling();
}

async function pagodeposito(id,tipo){
    var formapago = document.getElementById("formapago");
    var data = {
        idfactura: id,
        tipo: tipo,
        idingreso: iding,
        balance: baling,
        formapago: formapago.value
    };

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            if(await xhr.response == 'errD'){
                alert('El deposito seleccionado, no cuenta con el saldo suficiente para realizar esta acción.')
                return false;
            }
            idpago = await xhr.response;
            var confi = confirm("Pago registrado correctamente!");
            if(confi == true || confi == false){
                window.open(`../../vistas/funciones/recibo.html?inf=${idpago}`, "Recibo", "width=1050, height=600")
                window.location.reload();
            }
        }
    }

    xhr.onerror = function(){
        alert("Ocurrio un problema, por favor intentelo mas tarde.")
    };

    xhr.open("POST", api+ `/pago/deposito`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
}
