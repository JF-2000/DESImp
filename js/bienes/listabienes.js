const lbienes = document.getElementById("lbienes");
const filtro = document.getElementById("filtronombre");
let bienes = [];

async function listbienes() {

  await fetch(api+'/bienes')
  .then(response => response.json())
  .then((data) => bienes = data);
    setTimeout(pintarlista, 1000)
}

var dispo = document.getElementById('disponibilidad')
dispo.addEventListener('change',pintarlista)

var group = document.getElementById('listagrupos')
group.addEventListener('change',pintarlista)

var type = document.getElementById('listatipobienes')
type.addEventListener('change',pintarlista)

async function pintarlista(){

    let disponibles=[];

    switch(dispo.value){
        case '1':
            switch(group.value){
                case '0':
                    switch(type.value){
                        case '0':
                            disponibles = bienes
                        break
                        case type.value:
                            disponibles = bienes.filter(function(d){
                                return d.idtipobien == type.value
                            })
                        break
                
                    }
                break
                case group.value:
                    switch(type.value){
                        case '0':
                            disponibles = bienes.filter(function(d){
                                return d.idgrupo == group.value
                            })
                        break
                        case type.value:
                            disponibles = bienes.filter(function(d){
                                return d.idgrupo == group.value && d.idtipobien == type.value
                            })
                        break 
                    }
 
                break
        
            }
        break
        case '2':
            switch(group.value){
                case '0':
                    switch(type.value){
                        case '0':
                            disponibles = bienes.filter( function(d){
                                return d.disponible == 1
                            })
                        break
                        case type.value:
                            disponibles = bienes.filter(function(d){
                                return d.disponible == 1 && d.idtipobien == type.value
                            })
                        break 
                    }

                break
                case group.value:
                    switch(type.value){
                        case '0':
                            disponibles = bienes.filter( function(d){
                                return d.disponible == 1 && d.idgrupo == group.value
                            })
                        break
                        case type.value:
                            disponibles = bienes.filter(function(d){
                                return d.disponible == 1 && d.idtipobien == type.value && d.idgrupo == group.value
                            })
                        break 
                    }
                break
        
            }
        break
        case '3':
            switch(group.value){
                case '0':
                    switch(type.value){
                        case '0':
                            disponibles = bienes.filter( function(d){
                                return d.disponible == 0
                            })
                        break
                        case type.value:
                            disponibles = bienes.filter(function(d){
                                return d.disponible == 0 && d.idtipobien == type.value
                            })
                        break 
                    }
                break
                case group.value:
                    switch(type.value){
                        case '0':
                            disponibles = bienes.filter( function(d){
                                return d.disponible == 0 && d.idgrupo == group.value
                            })
                        break
                        case type.value:
                            disponibles = bienes.filter(function(d){
                                return d.disponible == 0 && d.idtipobien == type.value && d.idgrupo == group.value
                            })
                        break 
                    }

                break
        
            }
        break

    }


    html = `<table class="table table-bordered" id="tabbienes">
    <tr><th>ID</th><th>Descripción</th><th>Dirección</th><th>Tipo</th><th>Grupo</th><th>Estado</th></tr>`
    disponibles.forEach(bien => {
      html += 
      `<tr>
          <td><label>${bien.idbien}</label></td>
          <td><a href="../consultas/databien.html?inf=${bien.idbien}">${bien.descripcion}</a></td>
          <td><label>${bien.direccion}</label></td>
          <td><label>${bien.nombretipo}</label></td>
          <td><label>${bien.nombregrupo}</label></td>
          <td><label>${bien.disponible ? 'Disponible':'Alquilado'}</td>
          <td><a href="../funciones/modificarbien.html?inf=${bien.idbien}" class="btn btn-danger">Modificar</a></td>
      </tr>`
    });
    html += `</table>`
    if(document.getElementById("loader")){
        document.getElementById("loader").style.display = "none";
    }
    
    lbienes.innerHTML = html;
}
