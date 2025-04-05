const express = require("express");
const mongoose = require("mongoose");
const DatosContacto = require("../models/clienteDatosContactoModel");

const router = express.Router();

// Validar datos de entrada
const validarDatosContacto = (data) => {
    const errors = [];
    return errors;
};

// Crear datosContacto
router.post('/datosContacto', async (req, res) => {
    const errors = validarDatosContacto(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const nuevodatosContacto = new DatosContacto(req.body);
        await nuevodatosContacto.save();
        res.status(201).json(nuevodatosContacto);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el datosContacto", error });
    }
});

// Obtener todos los datosContactos
router.get('/datosContacto', async (req, res) => {
    try {
        const datosContactos = await DatosContacto.find();
        res.json(datosContactos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos Contacto", error });
    }
});

// Obtener datosContacto por ID numérico
router.get('/datosContacto/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "ID de datos Contacto inválido" });
    }

    try {
        const datosContacto = await datosContacto.findOne({ id });
        if (!datosContacto) return res.status(404).json({ error: "datos Contacto no encontrado" });
        res.json(datosContacto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos contacto", error });
    }
});


// Actualizar datosContacto
router.put('/datosContacto/:id', async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de datos Contacto inválido" });
    }

    const errors = validarDatosContacto(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const datosContactoActualizado = await DatosContacto.findByIdAndUpdate(
            id,
            { ...req.body},
            { new: true }
        );

        if (!datosContactoActualizado) return res.status(404).json({ error: "Datos contacto no encontrado" });

        res.json(datosContactoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar Datos Contacto", error });
    }
});

// Eliminar datosContacto
router.delete("/datosContacto/:id", async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de Datos Contacto inválido" });
    }

    try {
        const resultado = await DatosContacto.deleteOne({ _id: id }); // Use _id for MongoDB ObjectID
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Datos Contacto no encontrado" });
        }
        res.json({ message: "Datos Contacto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar datosContacto", error });
    }
});

router.get('/cliente_contacto', async (req, res) => {
    const { idCliente } = req.query;

    if (!idCliente) {
        return res.status(400).json({ message: "El parámetro idCliente es obligatorio" });
    }

    try {
        const contacto = await DatosContacto.find({ idCliente });

        if (contacto.length === 0) {
            return res.status(404).json({ message: "No se encontraron datos de contacto para este cliente" });
        }

        res.json(contacto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos de contacto", error: error.message });
    }
});


module.exports = router;