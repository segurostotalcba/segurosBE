    async function fetchDataCartera(url, ssid, hoja){ 
        //const ssid = "1RwRdy3Ah1Xrx8Pafd8e23ZXDSfUVGaq4";
        const query1 = `/gviz/tq?`;
        const query2 = "tqx=out:json";
        //const hoja = "sheet=Hoja1";
        const select = "select *";
        const query4 = encodeURIComponent(select);
        const endpoint = `${url}${ssid}${query1}&${query2}&${hoja}&tq=${query4}`;
        const response = await fetch(endpoint);
        const text = await response.text();
        const temp = text.substring(47).slice(0, -2); // Eliminar caracteres innecesarios
        const json = JSON.parse(temp);

        const rows = [];
        json.table.rows.forEach(row => {
            rows.push(row.c.map(cell => (cell ? cell.v : null))); // Manejar valores nulos
        });

        // Convertir los datos en objetos estructurados
        const listRow = rows.map(row => ({
            nombre: row[2],
            dni: row[3],
            ramo: row[4],
            compania: row[5],
            estadoPoliza: row[6],
            patente: row[7],
            telefono: row[8],

        }));

    return listRow;

    }

    module.exports = {fetchDataCartera}