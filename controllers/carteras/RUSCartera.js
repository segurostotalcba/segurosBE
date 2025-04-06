function getRamo(data) {
    const text = data.toUpperCase();
    if (text.includes("MOTOVEHICULO")) {
        return "MOTO";
    } else if (text.includes("VEHÍCULO")) {
        return "AUTO";
    } else {
        return "VIDA";
    }
}





async function fetchDataRUS(url, ssid, hoja){ 
    const query1 = `/gviz/tq?`;
    const query2 = "tqx=out:json";
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
        poliza: row[0],
        nombre: row[1].split(' - ')[1].trim(),
        estadoPoliza: row[2],
        fechaInicioVigencia: row[3],
        fechaFinVigencia: row[4],
        vehiculo: row[5],
        ramo: getRamo(row[5])
    }));

   return listRow;

}

module.exports = {fetchDataRUS}