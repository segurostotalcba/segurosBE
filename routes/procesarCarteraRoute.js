
const express = require("express");
const router = express.Router();
const { obtenerYGuardarCartera } = require("../controllers/machearDatos/matchearDatosBaseController");
const { obtenerYGuardarCarteraSanCristobal } = require("../controllers/machearDatos/matchearDatosSanCristobalController");
const { obtenerYGuardarCarteraMafre } = require("../controllers/machearDatos/matchearDatosMafreController");
const { obtenerYGuardarCarteraSancor } = require("../controllers/machearDatos/matchearDatosSancorController");
const { obtenerYGuardarCarteraRivadavia } = require("../controllers/machearDatos/matchearDatosRivadaviaController");
const { obtenerYGuardarCarteraTriunfo } = require("../controllers/machearDatos/matchearDatosTriunfoController");
const { obtenerYGuardarCarteraRUS } = require("../controllers/machearDatos/matchearDatosRUSController");

router.get("/procesar-cartera", obtenerYGuardarCartera);
router.get("/procesar-sancristobal", obtenerYGuardarCarteraSanCristobal);
router.get("/procesar-mafre", obtenerYGuardarCarteraMafre);
router.get("/procesar-sancor", obtenerYGuardarCarteraSancor);
router.get("/procesar-rivadavia", obtenerYGuardarCarteraRivadavia);
router.get("/procesar-triunfo", obtenerYGuardarCarteraTriunfo);
router.get("/procesar-rus", obtenerYGuardarCarteraRUS);

module.exports = router;