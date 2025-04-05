const axios = require("axios");
//const baseClientController = require("./baseClientController")
const Cliente = require("../../models/clienteModel");
//const DatosContacto = require("../../models/clienteDatosContactoModel");
const Vehiculo = require("../../models/vehiculoModel");
const Poliza = require("../../models/polizaModel");
//const ClienteDomicilio = require("../../models/clienteDomicilio");
const mongoose = require("mongoose");

const parseCustomDate = (fechaString) => {
    let [day, month, year] = fechaString.split("/").map(Number);
    let fechaValida = new Date(year, month - 1, day); // Month is zero-based

     // Convert to ISO format
    let fechaISO = fechaValida.toISOString();
    return fechaISO;
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
            fechaInicioVigencia: item.fechaInicioVigencia ? parseCustomDate(item.fechaInicioVigencia) : null ,
            fechaFinVigencia: item.fechaInicioVigencia ? parseCustomDate(item.fechaFinVigencia) : null,
            compania: "TRINFO",
            ramo: item.ramo,
            estadoPoliza: item.estadoPoliza,
            idCliente
        };
        
        if (!polizaExistente) { 
            const newPoliza = new Poliza(poliza);
            await newPoliza.save();
            console.log("Nueva Póliza Creada:", newPoliza);
            return newPoliza._id; // Return _id of the new document
        } else {
            const idPoliza = polizaExistente._id;
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
        var vehiculoExistente;
        if(item.patente){
            vehiculoExistente = await Vehiculo.findOne({ 
                patente: item.patente, 
                idCliente
            });
        } else if(item.vehiculo && ! item.patente) {
            vehiculoExistente = await Vehiculo.findOne({ 
                nombre: item.vehiculo, 
                idCliente,
                idPoliza
            });
        }
         

        const vehiculo = {
            nombre: item.vehiculo,
            tipoVehiculo: item.ramo,
            patente: item.patente,
            motor: item.motor,
            chasis: item.chasis,
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
        if(["MOTO", "AUTO"].includes(item.ramo) && item.vehiculo){
        await  saveOrUpdateVehiculo(item, idCliente, idPoliza);}
        console.log(`Se ha creado o alcualizado registro para ${item.nombre} - ${item.dni}`)
    
    } catch (error) {
        console.error("Error processing object:", error);
    }
};

const obtenerYGuardarCarteraTriunfo = async (req, res) => {
    try {
        debugger;
        console.log("Obteniendo datos de cartera...");
        const responseCartera = await axios.get("http://localhost:9000/api/triunfo", {
            params: {
                hoja: "Sheet0",
                ssid: "197riVPURLjcM_q0JxRC3TSCH4TrhtBxw"
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

module.exports = { obtenerYGuardarCarteraTriunfo };