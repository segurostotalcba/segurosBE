const axios = require("axios");
//const baseClientController = require("./baseClientController")
const Cliente = require("../../models/clienteModel");
//const DatosContacto = require("../../models/clienteDatosContactoModel");
//const Vehiculo = require("../../models/vehiculoModel");
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
            compania: "RIVADAVIA",
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



const procesarObjeto = async (item) => {
    try {
        debugger;
        let clienteExistente = await Cliente.findOne({ nombre: item.nombre });
        if (!clienteExistente) {
            clienteExistente = new Cliente({
                nombre: item.nombre,
                dni: item.dni ? item.dni : `SD${Math.floor(100000 + Math.random() * 900000)}`
            });

            await clienteExistente.save();
        }
        const idCliente = clienteExistente._id;
        const idPoliza = await saveOrUpdatePoliza(item, idCliente);
        console.log(`Se ha procesado el registro para ${item.nombre} - ${item.dni}`)

      
    } catch (error) {
        console.error("Error el procesar el objeto:", error);
    }
};

const obtenerYGuardarCarteraRivadavia = async (req, res) => {
    try {
        debugger;
        console.log("Obteniendo datos de cartera...");
        const responseCartera = await axios.get("http://localhost:9000/api/rivadavia", {
            params: {
                hoja: "Hoja1",
                ssid: "1kzF-P7DhewT9Ka7cIwqa1wqkxbM7ZpWo"
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

module.exports = { obtenerYGuardarCarteraRivadavia };