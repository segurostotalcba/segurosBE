const axios = require("axios");
//const baseClientController = require("./baseClientController")
const Cliente = require("../../models/clienteModel");
//const DatosContacto = require("../../models/clienteDatosContactoModel");
const Vehiculo = require("../../models/vehiculoModel");
const Poliza = require("../../models/polizaModel");
//const ClienteDomicilio = require("../../models/clienteDomicilio");
const mongoose = require("mongoose");

const parseCustomDate = (dateStr) => {
    const match = dateStr.match(/\d+/g); // Extract numbers from the string
    if (match && match.length === 3) {
        const [year, month, day] = match.map(Number);
        return new Date(year, month - 1, day); // Convert to Date (months are 0-based)
    }
    return null; // Handle invalid dates
};

async function saveOrUpdatePoliza(item, idCliente) {
    debugger;
    try {
        const polizaExistente = await Poliza.findOne({ 
            poliza: item.poliza, 
            idCliente 
        });
        
        // Create a new policy object
        const poliza = {
            poliza: item.poliza,
            fechaInicioVigencia: parseCustomDate(item.fechaInicioVigencia),
            fechaFinVigencia: parseCustomDate(item.fechaFinVigencia),
            compania: "SAN CRISTOBAL",
            ramo: item.ramo,
            estadoPoliza: item.estadoPoliza,
            idCliente
        };
        const idPoliza = polizaExistente._id;
        
        if (!polizaExistente) {
            const newPoliza = new Poliza(poliza);
            await newPoliza.save();
            console.log("Nueva Póliza Creada:", newPoliza);
            return newPoliza._id; // Return _id of the new document
        } else {
            const updatedPoliza = await Poliza.findOneAndUpdate(
                idPoliza,
                { $set: poliza }, // Update existing record
                { new: true, upsert: true } // Return updated document
            );
            console.log("Póliza Actualizada:", updatedPoliza);
            return updatedPoliza._id; // Return _id of the updated document
        }
    } catch (error) {
        console.error("Error saving or updating policy:", error);
        throw error;
    }
}

async function saveOrUpdateVehiculo(item, idCliente, idPoliza) {
    debugger;
    try {
        // Ensure idPoliza is an ObjectId
        if (!mongoose.Types.ObjectId.isValid(idPoliza)) {
            throw new Error(`Invalid idPoliza: ${idPoliza}`);
        }

        const vehiculoExistente = await Vehiculo.findOne({ 
            patente: item.patente, 
            idCliente,
            idPoliza
        });

        const vehiculo = {
            nombre: item.datosVehiculo,
            tipoVehiculo: item.ramo,
            patente: item.patente,
            idCliente,
            idPoliza: new mongoose.Types.ObjectId(idPoliza) // Ensure correct type
        };
        
        if(["MOTO", "AUTO"].includes(item.ramo) && item.patente){
        if (!vehiculoExistente) {
            const newVehiculo = new Vehiculo(vehiculo);
            await newVehiculo.save();
            console.log("Nuevo vehículo creado:", newVehiculo);
            return newVehiculo._id;
        } else {
            const updatedVehiculo = await Vehiculo.findOneAndUpdate(
                { patente: item.patente, idCliente, idPoliza },
                { $set: vehiculo },
                { new: true, upsert: true }
            );
            console.log("Vehículo actualizado:", updatedVehiculo);
            return updatedVehiculo._id;
        }
    }
    } catch (error) {
        console.error("Error al intentar crear o actualizar vehículo:", error);
        throw error;
    }
}

const procesarObjeto = async (item) => {
    try {
        debugger;
        let name = item.nombre.replace(/,/g, "");
        let clienteExistente = await Cliente.findOne({ dni: item.dni });
        if (!clienteExistente) {
            clienteExistente = new Cliente({
                nombre: name,
                dni: item.dni ? item.dni : `SD${Math.floor(100000 + Math.random() * 900000)}`
            });

            await clienteExistente.save();
        }
        const idCliente = clienteExistente._id;
        const idPoliza = await saveOrUpdatePoliza(item, idCliente);
        await  saveOrUpdateVehiculo(item, idCliente, idPoliza);
        console.log(`Se ha creado o alcualizado registro para ${item.nombre} - ${item.dni}`)

      
    } catch (error) {
        console.error("Error processing object:", error);
    }
};

const obtenerYGuardarCarteraSanCristobal = async (req, res) => {
    try {
        debugger;
        console.log("Obteniendo datos de cartera...");
        const responseCartera = await axios.get("http://localhost:9000/api/sancristobal", {
            params: {
                hoja: "Hoja1",
                ssid: "1RwRdy3Ah1Xrx8Pafd8e23ZXDSfUVGaq4"
            },
            headers: { "Content-Type": "application/json" }
        });

        //console.log(typeof responseCartera.data)
        //console.log(responseCartera.data)
        const carteraArray = responseCartera.data.data || [];

        if (!responseCartera.data || !Array.isArray(carteraArray)) {
            throw new Error("La respuesta de la cartera no es un array válido");
        }
        debugger;
        //console.log(`Procesando ${carteraArray.length} elementos...`);
        console.log("Datos obtenidos, enviando a guardar-datos...");
        for (const item of carteraArray) {
            await procesarObjeto(item);
        }
        res.status(200).json({ message: "Datos procesados correctamente" });
      
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { obtenerYGuardarCarteraSanCristobal };