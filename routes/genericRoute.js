const express = require("express");
const mongoose = require("mongoose");
const Cliente = require("../models/clienteModel");

const router = express.Router();

router.post('/clientes', async (req, res) => {
    try {
        const nuevoCliente = new Cliente(req.body);
        await nuevoCliente.save();
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el cliente", error });
    }
});
