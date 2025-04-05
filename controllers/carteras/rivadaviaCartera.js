async function fetchDataRivadavia(url, ssid, hoja){ 
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
        clienteInterno: row[1],
        nombre: row[2].replace(/,/g, "").trimEnd(),
        poliza: row[3],
        fechaInicioVigencia: row[4],
        fechaFinVigencia: row[5]  
    }));

   return listRow;

}

module.exports = {fetchDataRivadavia}