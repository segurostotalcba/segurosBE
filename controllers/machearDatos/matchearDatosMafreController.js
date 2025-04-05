const axios = require("axios");
//const baseClientController = require("./baseClientController")
const Cliente = require("../../models/clienteModel");
const DatosContacto = require("../../models/clienteDatosContactoModel");
const Vehiculo = require("../../models/vehiculoModel");
const Poliza = require("../../models/polizaModel");
const Domicilio = require("../../models/clienteDomicilio");
const mongoose = require("mongoose");

const parseCustomDate = (dateStr) => {
    const match = dateStr.match(/\d+/g); // Extract numbers
    if (match && match.length === 3) {
        const [day, month, year] = match.map(Number); // Correct order: DD/MM/YYYY
        return new Date(year, month - 1, day); // Convert to Date (months are 0-based)
    }
    return null; // Handle invalid dates
};

async function saveOrUpdatePoliza(item, idCliente) {
    debugger;
    try {
        const polizaExistente = await Poliza.findOne({ 
            poliza: item.poliza,
            ramo : item.ramo,
            idCliente 
        });
        
        // Create a new policy object
        const poliza = {
            poliza: item.poliza,
            fechaFinVigencia: parseCustomDate(item.fechaFinVigencia),
            compania: "MAFRE",
            ramo: item.ramo,
            estadoPoliza: item.estadoPoliza,
            clienteInterno: item.clienteInterno,
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

async function saveOrUpdateDatosContacto(item, idCliente) {
    debugger;
    try {
        // Ensure idCliente is an ObjectId
        if (!mongoose.Types.ObjectId.isValid(idCliente)) {
            throw new Error(`Invalid idCliente: ${idCliente}`);
        }

        const contactoExistente = await DatosContacto.findOne({ 
            telefonoMovil: item.telefonoMovil,
            idCliente
        });

        const datoContacto = {
            telefonoMovil: item.telefonoMovil,
            idCliente
        };

       

        if (!contactoExistente) {
            const newDatoContacto = new DatosContacto(datoContacto);
            await newDatoContacto.save();
            console.log("Nuevo Dato de Contacto creado:", newDatoContacto);
            return newDatoContacto._id;
        } else {
            const idDatoContacto = contactoExistente._id; 
            const updatedDatoContacto = await Vehiculo.findOneAndUpdate(
                idDatoContacto,
                { $set: datoContacto },
                { new: true, upsert: true }
            );
            console.log("Dato contacto actualizado:", updatedDatoContacto);
            return updatedDatoContacto._id;
        }
    
    } catch (error) {
        console.error("Error al intentar crear o actualizar Dato de contacto:", error);
        throw error;
    }
}


async function saveOrUpdateDomicilio(item, idCliente) {
    debugger;
    try {
        // Ensure idCliente is an ObjectId
        if (!mongoose.Types.ObjectId.isValid(idCliente)) {
            throw new Error(`Invalid idCliente: ${idCliente}`);
        }

        const domicilioExistente = await Domicilio.findOne({
            tipoDomicilio: item.ramo,
            idCliente
        });

        const datoDomicilio = {
            domicilio: item.domicilio,
            localidad: item.localidad, 
            cp: item.codPostal,
            tipoDomicilio: item.ramo,
            idCliente
        };

        if (!domicilioExistente) {
            const newDomicilio = new Domicilio(datoDomicilio);
            await newDomicilio.save();
            console.log("Nuevo Domicilio creado:", newDomicilio);
            return newDomicilio._id;
        } else {
            const idDomicilio = domicilioExistente._id; 
            const updatedDomicilio = await Domicilio.findOneAndUpdate(
                idDomicilio,
                { $set: datoDomicilio },
                { new: true, upsert: true }
            );
            console.log("Dato domicilio actualizado:", updatedDomicilio);
            return updatedDomicilio._id;
        }
    
    } catch (error) {
        console.error("Error al intentar crear o actualizar Dato de contacto:", error);
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
        if(["AUTO", "MOTO"].includes(item.ramo) && item.patente){
            await  saveOrUpdateVehiculo(item, idCliente, idPoliza);
        }
        if(item.telefonoMovil){
            await saveOrUpdateDatosContacto(item, idCliente)
        }
        if(["HOGAR", "INTEGRAL DE COMERCIO", "COMBINADO FAMILIAR"].includes(item.ramo) && item.domicilio){
            await saveOrUpdateDomicilio(item, idCliente)
        }
       
        console.log(`Se ha procesar registro para ${item.nombre} - ${item.dni}`)

      
    } catch (error) {
        console.error("Error processing object:", error);
    }
};

const obtenerYGuardarCarteraMafre = async (req, res) => {
    try {
        debugger;
        console.log("Obteniendo datos de cartera...");
        const responseCartera = await axios.get("http://localhost:9000/api/mafre", {
            params: {
                hoja: "HOJA 1",
                ssid: "1lJJVirQts9FwdGNnHBdCyumSHQCtOos7"
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

module.exports = { obtenerYGuardarCarteraMafre };