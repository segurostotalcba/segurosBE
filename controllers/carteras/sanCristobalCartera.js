async function fetchDataSanCristobal(url, ssid, hoja){ 
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
            nombre: row[0],
            dni: row[1],
            clienteInterno: row[2],
            ramo: row[3],
            producto: row[4],
            patente: row[5],
            datosVehiculo: row[6],
            poliza: row[7],
            pas: row[8],
            tipoContratacion: row[9],
            fechaInicioVigencia: row[10],
            fechaFinVigencia: row[11],
            moneda: row[12],
            sumaAsegurada: row[13],
            premio: row[14],
            estadoPoliza: row[15],
            fechaCancelacion: row[16],
            motivoCancelacion: row[17]
        }));

       return listRow;

}

module.exports = {fetchDataSanCristobal}