async function fetchDataSancor(url, ssid, hoja){ 
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

    const getRamo = (idRamo) => {
        var ramo = "";
        switch (idRamo) {
            case 1730:
                ramo = "VID VINCULADO"
                break;
            case 600:
                ramo = "AP INTEGRO"
                break;
            case 3100:
                ramo = "MOTOVEHICULO"
                break;
            case 200:
                ramo = "AUTO"
                break;
            case 2500:
                ramo = "AP LABORAL"
                break;
            case 1800:
                ramo = "HOGAR"
                break;
            default:
                console.log("id ramo no coincide con uno existente")
        }
        return ramo;
    }
    

    // Convertir los datos en objetos estructurados
    const listRow = rows.map(row => ({
        ramo: getRamo(parseInt(row[1])),
        poliza: row[4],
        fechaInicioVigencia: row[7],
        fechaFinVigencia: row[8],
        dni: row[11].slice(-8),
        clienteInterno: row[17],
        nombre: row[12]
    }));

   return listRow;

}

module.exports = {fetchDataSancor}