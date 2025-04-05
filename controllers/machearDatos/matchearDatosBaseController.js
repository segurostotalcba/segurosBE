const axios = require("axios");
//const baseClientController = require("./baseClientController")
const Cliente = require("../../models/clienteModel");
const DatosContacto = require("../../models/clienteDatosContactoModel");
const Vehiculo = require("../../models/vehiculoModel");
const Poliza = require("../../models/polizaModel");
const ClienteDomicilio = require("../../models/clienteDomicilio");
const mongoose = require("mongoose");


const procesarObjeto = async (item) => {
    try {
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
       /* const polizaExistente = await Poliza.findOne({ compania: item.compania, ramo: item.ramo, idCliente });
        if (!polizaExistente) {
            const poliza = new Poliza({
                compania: item.compania,
                ramo: item.ramo,
                estadoPoliza: item.estadoPoliza,
                idCliente
            });
            await poliza.save();
        } else {
            console.log(`Poliza already exists for cliente ${idCliente}`);
        }*/

        // Avoid duplicate Vehiculo
        if (["AUTO", "MOTO"].includes(item.ramo) && item.patente) {
            const vehiculoExistente = await Vehiculo.findOne({ patente: item.patente, tipoVehiculo : item.ramo, idCliente });
            if (!vehiculoExistente) {
                const vehiculo = new Vehiculo({
                    patente: item.patente,
                    tipoVehiculo: item.ramo,
                    idCliente
                });
                await vehiculo.save();
            } else {
                console.log(`Vehiculo with patente ${item.patente} already exists for cliente ${idCliente}`);
            }
        }

        // Avoid duplicate ClienteDomicilio
        if (["INTEGRAL COMERCIO", "HOGAR"].includes(item.ramo) && item.patente) {
            let address = item.patente.replace(/,/g, "");
            const domicilioExistente = await ClienteDomicilio.findOne({ domicilio: address, idCliente });
            if (!domicilioExistente) {
                const domicilio = new ClienteDomicilio({
                    domicilio: address,
                    tipoDomicilio : item.ramo,
                    idCliente
                });
                await domicilio.save();
            } else {
                console.log(`Domicilio ${address} already exists for cliente ${idCliente}`);
            }
        }

        // Avoid duplicate DatosContacto
        if (item.telefono) {
            const contactoExistente = await DatosContacto.findOne({ telefonoMovil: item.telefono, idCliente });
            if (!contactoExistente) {
                const datosContacto = new DatosContacto({
                    telefonoMovil: item.telefono,
                    idCliente
                });
                await datosContacto.save();
            } else {
                console.log(`Telefono ${item.telefono} already exists for cliente ${idCliente}`);
            }
        }

    } catch (error) {
        console.error("Error processing object:", error);
    }
};

const obtenerYGuardarCartera = async (req, res) => {
    try {
    
        console.log("Obteniendo datos de cartera...");
        const responseCartera = await axios.get("http://localhost:9000/api/cartera", {
            params: {
                hoja: "Clientes",
                ssid: "1T-QXU_mgO7PO6ocaUxmoLl4ost0ZvrBd3G99EQ4I6qo"
            },
            headers: { "Content-Type": "application/json" }
        });

        //console.log(typeof responseCartera.data)
        //console.log(responseCartera.data)
        const carteraArray = responseCartera.data.data || [];

        if (!responseCartera.data || !Array.isArray(carteraArray)) {
            throw new Error("La respuesta de la cartera no es un array válido");
        }
        //debugger;
        //console.log(`Procesando ${carteraArray.length} elementos...`);
        console.log("Datos obtenidos, enviando a guardar-datos...");
        var count = 0;
        for (const item of carteraArray) {
            console.log(`Se procesa la position ${item.nombre}:` + count ++);
            await procesarObjeto(item);
        }
        res.status(200).json({ message: "Datos procesados correctamente" });
      
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { obtenerYGuardarCartera };