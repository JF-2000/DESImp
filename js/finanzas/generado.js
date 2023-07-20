const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');

let finanzas = [];

async function generado(){
    let Data = [];
    await fetch(api+'/estadofinanciero')
    .then(response => response.json())
    .then((data) => Data = data)
    pintargrafica(Data)
    
}



function pintargrafica(Data){
    let entidades = [];
    let valores = [];
    let entidades2 = [];
    let valores2 = [];
    Data.totaldebe.forEach(e=> {
        entidades.push(e.nombre);
        valores.push(e.totaldebe);
    });
    Data.totalgenerado.forEach(e=> {
        entidades2.push(e.nombre);
        valores2.push(e.totalgenerado);
    });
    
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: entidades,
            datasets: [{
                data: valores,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'TOTAL POR COBRAR',
                    padding: {
                        top: 30,
                        bottom: 10
                    },
                    font:{
                        size: 32
                    }
                },
                legend: {
                    display: false
                }
            }
        }

    });

    const myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: entidades2,
            datasets: [{
                data: valores2,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'TOTAL GENERADO',
                    padding: {
                        top: 30,
                        bottom: 10
                    },
                    font:{
                        size: 32
                    }
                },
                legend: {
                    display: false
                }
            }

        }
    });
}
