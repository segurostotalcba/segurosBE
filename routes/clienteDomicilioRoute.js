const express = require("express");
const mongoose = require("mongoose");
const Domicilio = require("../models/clienteDomicilio");

const router = express.Router();

// Validar datos de entrada
const validar = (data) => {
    const errors = [];

    if (!data.domicilio || data.domicilio < 3) {
        errors.push("El domicilio es obligatorio, solo debe contener letras y tener al menos 3 caracteres.");
    }
    return errors;
};

// Crear cliente
router.post('/domicilio', async (req, res) => {
    const errors = validar(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });
    try {
        const nuevoDomicilio = new Domicilio(req.body);
        await nuevoDomicilio.save();
        res.status(201).json(nuevoDomicilio);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el domicilio", error });
    }
});


// Obtener todos los clientes
router.get('/domicilios', async (req, res) => {
    try {
        const domicilios = await Domicilio.find();
        res.json(domicilios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener domicilios", error });
    }
});

// Obtener cliente por ID numérico
router.get('/domicilio/:id', async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de cliente inválido" });
    }

    try {
        const domicilio = await Domicilio.findOne({ id });
        if (!domicilio) return res.status(404).json({ error: "Domicilio no encontrado" });
        res.json(domicilio);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener domicilio", error });
    }
});


// Actualizar cliente
router.put('/domicilio/:id', async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de cliente inválido" });
    }

    const errors = validar(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const domicilioActualizado = await Domicilio.findByIdAndUpdate(
            id,
            { ...req.body, fechaActualizado: new Date() },
            { new: true }
        );

        if (!domicilioActualizado) return res.status(404).json({ error: "Domicilio no encontrado" });

        res.json(domicilioActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar domicilio", error });
    }
});

// Eliminar cliente
router.delete("/domicilio/:id", async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de Domicilio inválido" });
    }

    try {
        const resultado = await Domicilio.deleteOne({ _id: id }); // Use _id for MongoDB ObjectID
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Domicilio no encontrado" });
        }

        res.json({ message: "Domicilio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar domicilio", error });
    }
});


router.get('/cliente_domicilios', async (req, res) => {
    const { idCliente } = req.query;

    if (!idCliente) {
        return res.status(400).json({ message: "El parámetro idCliente es obligatorio" });
    }

    try {
        const domicilios = await Domicilio.find({ idCliente });

        if (domicilios.length === 0) {
            return res.status(404).json({ message: "No se encontraron domicilios para este cliente" });
        }

        res.json(domicilios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener domicilio", error: error.message });
    }
});


module.exports = router;