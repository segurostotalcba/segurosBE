const express = require("express");
const { guardarDatos } = require("../controllers/machearDatos/baseClientController");

const router = express.Router();

router.post("/guardar-datos", guardarDatos);

module.exports = router;
