async function fetchDataTriunfo(url, ssid, hoja){ 
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
            case "29-MOTO":
                ramo = "MOTO"
                break;
            case "4-AUTOS":
                ramo = "AUTO"
                break;
            case "94-SEPE":
                ramo = "SEPELIOS"
                break;
            case "9-VICOL":
                ramo = "VIDA COLECTIVO"
                break;
            case "15-COMBI":
                ramo = "COMBI"
                break;
            case "12-ACCPE":
                ramo = "HOGAR"
                break;
            default:
                console.log("id ramo no coincide con uno existente - " + idRamo)
        }
        return ramo;
    }
    

    // Convertir los datos en objetos estructurados
    const listRow = rows.map(row => ({
        ramo: getRamo(row[3]),
        poliza: row[2],
        nombre: row[5].trimEnd(),
        dni: row[6],
        estadoPoliza: row[9] ? row[9].trimEnd() : null,
        fechaInicioVigencia: row[11],
        fechaFinVigencia: row[12],   
        vehiculo: row[17],
        motor: row[19] ? row[19].trimEnd() : null,
        chasis: row[20] ? row[20].trimEnd() : null,
        patente: row[21] ? row[21].trimEnd() : null
    }));

   return listRow;

}

module.exports = {fetchDataTriunfo}