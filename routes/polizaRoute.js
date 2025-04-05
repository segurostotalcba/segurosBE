const express = require("express");
const mongoose = require("mongoose");
const Poliza = require("../models/polizaModel");

const router = express.Router();

// Validar datos de entrada
const validar = (data) => {
    const errors = [];
    if (!data.poliza ||  data.poliza.length < 3) {
        errors.push("La poliza es obligatorio, debe tener al menos 3 caracteres.");
    }

    return errors;
};

// Crear poliza
router.post('/poliza', async (req, res) => {
    const errors = validar(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const nuevoPoliza = new Poliza(req.body);
        await nuevoPoliza.save();
        res.status(201).json(nuevoPoliza);
    } catch (error) {
        res.status(500).json({ message: "Error al crear Poliza", error });
    }
});

// Obtener todos los Polizas
router.get('/polizas', async (req, res) => {
    try {
        const Polizas = await Poliza.find();
        res.json(Polizas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Polizas", error });
    }
});


router.get('/cliente_polizas', async (req, res) => {
    const { idCliente } = req.query;

    if (!idCliente) {
        return res.status(400).json({ message: "El parámetro idCliente es obligatorio" });
    }

    try {
        const polizas = await Poliza.find({ idCliente });

        if (polizas.length === 0) {
            return res.status(404).json({ message: "No se encontraron pólizas para este cliente" });
        }

        res.json(polizas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pólizas", error: error.message });
    }
});


//Buscar polizas por  numero de poliza
router.get('/poliza', async (req, res) => {
    const { poliza } = req.query;

    if (!poliza) {
        return res.status(400).json({ message: "El parámetro idCliente es obligatorio" });
    }

    try {
        const polizas = await Poliza.find({ poliza });

        if (polizas.length === 0) {
            return res.status(404).json({ message: "No se encontraron pólizas para numero de poliza ingresado" });
        }

        res.json(polizas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pólizas", error: error.message });
    }
});


// Actualizar Poliza
router.put('/poliza/:id', async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de Poliza inválido" });
    }

    const errors = validar(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const PolizaActualizado = await Poliza.findByIdAndUpdate(
            id,
            { ...req.body, fechaActualizado: new Date() },
            { new: true }
        );

        if (!PolizaActualizado) return res.status(404).json({ error: "Poliza no encontrado" });

        res.json(PolizaActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar Poliza", error });
    }
});

// Eliminar Poliza
router.delete("/polizas/:id", async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de Poliza inválido" });
    }

    try {
        const resultado = await Poliza.deleteOne({ _id: id }); // Use _id for MongoDB ObjectID
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Poliza no encontrado" });
        }

        res.json({ message: "Poliza eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar Poliza", error });
    }
});

module.exports = router;