const express = require("express");
const mongoose = require("mongoose");
const Cliente = require("../models/clienteModel");
const Poliza = require("../models/polizaModel");
const Vehiculo = require("../models/vehiculoModel");
const DatosContacto = require("../models/clienteDatosContactoModel");
const Domicilio = require("../models/clienteDomicilio");
const router = express.Router();


router.get("/buscar", async (req, res) => {
    try {
        const { nombre, dni, poliza, patente } = req.query;
        let clientes = null;

        // Buscar por nombre o DNI con mejor manejo de espacios y mayúsculas
        if (nombre || dni) {
            const filtro = {};
            if (nombre) filtro.nombre = new RegExp(nombre.trim(), "i");
            if (dni) filtro.dni = dni.trim();
            clientes = await Cliente.find(filtro);
        }

        // Buscar por póliza
        if (!clientes && poliza) {
            const polizaEncontrada = await Poliza.findOne({ poliza });
            if (polizaEncontrada) {
                clientes = await Cliente.find({ _id: polizaEncontrada.idCliente });
            }
        }

        // Buscar por patente
        if (!clientes && patente) {
            const vehiculoEncontrado = await Vehiculo.findOne({ patente });
            if (vehiculoEncontrado) {
                clientes = await Cliente.find({ _id: vehiculoEncontrado.idCliente });
            }
        }

        if (!clientes || clientes.length === 0) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        // Procesar cada cliente y obtener la información asociada
        const resultados = await Promise.all(clientes.map(async (item) => {
            const clienteId = item._id;
            
            const [polizas, vehiculos, datosContacto, domicilio] = await Promise.all([
                Poliza.find({ idCliente: clienteId }),
                Vehiculo.find({ idCliente: clienteId }),
                DatosContacto.find({ idCliente: clienteId }),
                Domicilio.find({ idCliente: clienteId })
            ]);

            return {
                cliente: item,
                polizas,
                vehiculos,
                datosContacto, 
                domicilio
            };
        }));

        // Enviar la respuesta con los datos procesados
        res.json(resultados);

    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).json({ mensaje: "Error en la búsqueda", error: error.message });
    }
});

module.exports = router;