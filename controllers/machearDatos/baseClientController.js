


const parseCustomDate = (dateStr) => {
    const match = dateStr.match(/\d+/g); // Extract numbers from the string
    if (match && match.length === 3) {
        const [year, month, day] = match.map(Number);
        return new Date(year, month - 1, day); // Convert to Date (months are 0-based)
    }
    return null; // Handle invalid dates
};

const procesarObjetoSanCristobal = async (item) => {
    try {
        debugger;
        let name = item.nombre.replace(/,/g, "");
        let clienteExistente = await Cliente.findOne({ nombre: name });
        if (!clienteExistente) {
            clienteExistente = new Cliente({
                nombre: name,
                dni: item.dni ? item.dni : `SD${Math.floor(100000 + Math.random() * 900000)}`
            });

            await clienteExistente.save();
        }
        const idCliente = clienteExistente._id;

        // Avoid duplicate Poliza
        const ramo = item.ramo.toUpperCase();
        const polizaExistente = await Poliza.findOne({ compania: item.compania, ramo: ramo, idCliente });
        if (!polizaExistente) {
            const poliza = new Poliza({
                poliza: item.poliza,
                fechaInicioVigencia: parseCustomDate(item.fechaInicioVigencia),
                fechaFinVigencia: parseCustomDate(item.fechaFinVigencia),
                compania: "SAN CRISTOBAL",
                ramo: ramo,
                estadoPoliza: item.estadoPoliza,
                idCliente
            });
            await poliza.save();
        } else {
            console.log(`Poliza already exists for cliente ${idCliente}`);
        }

        // Avoid duplicate Vehiculo
      
        if (["AUTO", "MOTO"].includes(ramo) && item.patente) {
            const vehiculoExistente = await Vehiculo.findOne({ patente: item.patente, idCliente });
            if (!vehiculoExistente) {
                const vehiculo = new Vehiculo({
                    nombre: item.datosVehiculo,
                    patente: item.patente,
                    idCliente
                });
                await vehiculo.save();
            } else {
                console.log(`Vehiculo with patente ${item.patente} already exists for cliente ${idCliente}`);
            }
        }

        // Avoid duplicate ClienteDomicilio
        /*if (["INTEGRAL COMERCIO", "HOGAR"].includes(ramo) && item.patente) {
            let address = item.patente.replace(/,/g, "");
            const domicilioExistente = await ClienteDomicilio.findOne({ domicilio: address, idCliente });
            if (!domicilioExistente) {
                const domicilio = new ClienteDomicilio({
                    domicilio: address,
                    idCliente
                });
                await domicilio.save();
            } else {
                console.log(`Domicilio ${address} already exists for cliente ${idCliente}`);
            }
        }

        // Avoid duplicate DatosContacto
        if (item.telefono) {
            const contactoExistente = await DatosContacto.findOne({ telefono: item.telefono, idCliente });
            if (!contactoExistente) {
                const datosContacto = new DatosContacto({
                    telefonoMovil: item.telefono,
                    idCliente
                });
                await datosContacto.save();
            } else {
                console.log(`Telefono ${item.telefono} already exists for cliente ${idCliente}`);
            }
        }*/

    } catch (error) {
        console.error("Error processing object:", error);
    }
};



const guardarDatos = async (req, res) => {
    try {
        const datos = req.body;
        if (!Array.isArray(datos) || datos.length === 0) {
            return res.status(400).json({ error: "No data provided" });
        }

        for (const item of datos) {
            await procesarObjeto(item);
        }

        res.status(201).json({ message: "Datos guardados correctamente" });
    } catch (error) {
        console.error("Error al guardar datos:", error);
        if (error.code === 'ECONNRESET') {
            return res.status(500).json({ error: "Connection reset error" });
        }
        res.status(500).json({ error: "Error al guardar datos" });
    }
};

/*const guardarDatos = async (req, res) => {
    const guardarDatos = async (req, res) => {
        try {
            const datos = req.body;
            if (!Array.isArray(datos) || datos.length === 0) {
                return res.status(400).json({ error: "No data provided" });
            }
    
            for (const item of datos) {
                if (!item.dni) return; // Skip if no DNI
                
                let clienteExistente = await Cliente.findOne({ dni: item.dni });
                if (!clienteExistente) {  
                    clienteExistente = new Cliente({
                        nombre: item.nombre,
                        dni: item.dni
                    });
                    await clienteExistente.save();
                }
    
                const idCliente = clienteExistente.id;
    
                const poliza = new Poliza({
                    compania: item.compania,
                    ramo: item.ramo,
                    estadoPoliza: item.estadoPoliza,
                    idCliente
                });
                await poliza.save();
    
                if (["AUTO", "MOTO"].includes(item.ramo) && item.patente) {
                    const vehiculo = new Vehiculo({
                        patente: item.patente,
                        idCliente
                    });
                    await vehiculo.save();
                } else if (["INTEGRAL COMERCIO", "HOGAR"].includes(item.ramo) && item.patente) {
                    const domicilio = new ClienteDomicilio({
                        domicilio: item.patente,
                        idCliente
                    });
                    await domicilio.save();
                }
    
                if (item.telefono) {
                    const datosContacto = new DatosContacto({
                        telefono: item.telefono,
                        idCliente
                    });
                    await datosContacto.save();
                }
            }
    
            res.status(201).json({ message: "Datos guardados correctamente" });
        } catch (error) {
            console.error("Error al guardar datos:", error);
            // Capture ECONNRESET error
            if (error.code === 'ECONNRESET') {
                return res.status(500).json({ error: "Connection reset error" });
            }
            res.status(500).json({ error: "Error al guardar datos" });
        }
    };
};*/

module.exports = {procesarObjetoSanCristobal,  guardarDatos };
