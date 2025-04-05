const url = "https://docs.google.com/spreadsheets/d/"
const ssid = "130jrF_ShmBY91LkTvFsDnXcH220slXLnJpkaHIjnkSA";
const query1 = `/gviz/tq?`; //visualization data
const query2 = 'tqx=out:json';
const query3 = 'sheet=Clientes';

const select = `select *`
const query4 = encodeURIComponent(select);

const endpoint = `${url}${ssid}${query1}&${query2}&${query3}&tq=${query4}`;
//output.innerHTML = endpoint1;

    fetch(endpoint)
    .then(res => res.text())
    .then(data => {
        const temp = data.substring(47).slice(0, -2); 
        const json = JSON.parse(temp);
        const clientes = []
        var listClientes = []
        json.table.rows.forEach((row) => {
            clientes.push(row.c)
        });
        console.log(clientes.length)
        for (let i = 0; i < clientes.length; i++) {
            let client = {}
            client.nombre = clientes[i][0]
            client.dni = clientes[i][1]
            client.departamento = clientes[i][2]
            client.compania = clientes[i][3]
            client.estado = clientes[i][4]
            client.patente = clientes[i][5]
            client.telefono = clientes[i][6]
            client.nota = clientes[i][7]
            listClientes.push(client)   
        }
       console.log(listClientes)
    });


function makeCell(parent, html, classAdd){
 const ele = document.createElement('div');
 parent.append(ele); //create element to the parent
 ele.innerHTML = html;
 ele.classList.add(classAdd);
 return ele;
}