const express = require("express");
const mongoose = require("mongoose");
const Cliente = require("../models/clienteModel");

const router = express.Router();

// Validar datos de entrada
const validarCliente = (data) => {
    const errors = [];

    if (!data.nombre || !/^[A-Za-zÑñ\s]+$/.test(data.nombre) || data.nombre.length < 3) {
        errors.push("El nombre es obligatorio, solo debe contener letras y tener al menos 3 caracteres.");
    }

    if (!data.dni || !/^[0-9]{7,8}$/.test(data.dni)) {
        errors.push("El DNI es obligatorio y debe contener entre 7 y 8 dígitos.");
    }

    return errors;
};

// Crear cliente
router.post('/clientes', async (req, res) => {
    const errors = validarCliente(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const nuevoCliente = new Cliente(req.body);
        await nuevoCliente.save();
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el cliente", error });
    }
});


// Obtener todos los clientes
router.get('/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener clientes", error });
    }
});

// Obtener cliente por ID numérico
router.get('/cliente/:id', async (req, res) => {
    const { id } = req.params; // Get the id from URL params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de cliente inválido" });
    }

    try {
        const cliente = await Cliente.findById(id);
        if (!cliente) return res.status(404).json({ error: "Cliente no encontrado" });
        
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener cliente", error });
    }
});

// Buscar cliente por nombre o DNI
router.get('/clientes/buscar', async (req, res) => {
    const { nombre, dni } = req.query;

    if (!nombre && !dni) {
        return res.status(400).json({ error: "Debe proporcionar un nombre o DNI para buscar" });
    }

    try {
        const query = {};
        if (nombre) query.nombre = new RegExp(`^${nombre}`, "i");
        if (dni) query.dni = dni;

        const clientes = await Cliente.find(query);
        if (clientes.length === 0) return res.status(404).json({ error: "No se encontraron clientes" });

        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar clientes", error });
    }
});

// Actualizar cliente
router.put('/clientes/:id', async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de cliente inválido" });
    }

    const errors = validarCliente(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            id,
            { ...req.body, fechaActualizado: new Date() },
            { new: true }
        );

        if (!clienteActualizado) return res.status(404).json({ error: "Cliente no encontrado" });

        res.json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar cliente", error });
    }
});

// Eliminar cliente
router.delete("/clientes/:id", async (req, res) => {
    const id = req.params.id; // Keep it as a string for MongoDB ObjectID

    // Validate the ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de cliente inválido" });
    }

    try {
        const resultado = await Cliente.deleteOne({ _id: id }); // Use _id for MongoDB ObjectID
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar cliente", error });
    }
});

module.exports = router;