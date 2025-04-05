const express = require("express");
const mongoose = require("mongoose");
const Vehiculo = require("../models/vehiculoModel");

const router = express.Router();

// Validar datos de entrada
const validarVehiculo = (data) => {
    const errors = [];

    if (!data.patente || data.patente.length < 3) {
        errors.push("La patente es obligatorio, solo debe contener letras y tener al menos 3 caracteres.");
    }

    return errors;
};

// Crear Vehiculo
router.post('/vehiculos', async (req, res) => {
    const errors = validarVehiculo(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const nuevoVehiculo = new Vehiculo(req.body);
        await nuevoVehiculo.save();
        res.status(201).json(nuevoVehiculo);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el Vehiculo", error });
    }
});

// Obtener todos los Vehiculos
router.get('/Vehiculos', async (req, res) => {
    try {
        const Vehiculos = await Vehiculo.find();
        res.json(Vehiculos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Vehiculos", error });
    }
});

// Obtener Vehiculo por ID numérico
router.get('/Vehiculos/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: "ID de Vehiculo inválido" });
    }

    try {
        const Vehiculo = await Vehiculo.findOne({ id });
        if (!Vehiculo) return res.status(404).json({ error: "Vehiculo no encontrado" });
        res.json(Vehiculo);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Vehiculo", error });
    }
});

// Buscar Vehiculo por patente
router.get('/vehiculos/buscar', async (req, res) => {
    const { patente } = req.query;

    if (!patente) {
        return res.status(400).json({ error: "Debe proporcionar una patente para poder buscar" });
    }

    try {
        const query = {};
        if (patente) query.patente = patente;
    
        const Vehiculos = await Vehiculo.find(query);
        if (Vehiculos.length === 0) return res.status(404).json({ error: "No se encontraron Vehiculos" });

        res.json(Vehiculos);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar Vehiculos", error });
    }
});

// Actualizar Vehiculo
router.put('/vehiculos/:id', async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de Vehiculo inválido" });
    }

    const errors = validarVehiculo(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const VehiculoActualizado = await Vehiculo.findByIdAndUpdate(
            id,
            { ...req.body},
            { new: true }
        );

        if (!VehiculoActualizado) return res.status(404).json({ error: "Vehiculo no encontrado" });

        res.json(VehiculoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar Vehiculo", error });
    }
});

// Eliminar Vehiculo
router.delete("/vehiculos/:id", async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de Vehiculo inválido" });
    }

    try {
        const resultado = await Vehiculo.deleteOne({ _id: id }); // Use _id for MongoDB ObjectID
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Vehiculo no encontrado" });
        }

        res.json({ message: "Vehiculo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar Vehiculo", error });
    }
});

router.get('/cliente_vehiculos', async (req, res) => {
    const { idCliente } = req.query;

    if (!idCliente) {
        return res.status(400).json({ message: "El parámetro idCliente es obligatorio" });
    }

    try {
        // Find vehicles and populate their associated policy
        const vehiculos = await Vehiculo.find({ idCliente }).populate('idPoliza');

        if (vehiculos.length === 0) {
            return res.status(404).json({ message: "No se encontraron vehículos para este cliente" });
        }

        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener vehículos", error: error.message });
    }
});

module.exports = router;