const express = require("express");
const carteraSanCristobal = require("../controllers/carteras/sanCristobalCartera");
const carteraMafre = require("../controllers/carteras/mafreCartera");
const carteraSancor = require("../controllers/carteras/sancorCartera");
const carteraRivadavia = require("../controllers/carteras/rivadaviaCartera");
const carteraTriunfo = require("../controllers/carteras/triunfoCartera");
const carteraRUS = require("../controllers/carteras/RUSCartera");
const cartera = require("../controllers/carteras/baseCartera");

const router = express.Router();
const url = "https://docs.google.com/spreadsheets/d/";

const fetchData = async (req, res, fetchFunction) => {
    try {
        const { ssid, hoja } = req.query;
        if (!ssid || !hoja) return res.status(400).json({ error: "Debe proporcionar un ssid y hoja para obtener los datos" });

        const listRow = await fetchFunction(url, ssid, hoja);
        res.json({ data: listRow });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ error: "Error al obtener los datos" });
    }
};

router.get("/cartera", (req, res) => fetchData(req, res, cartera.fetchDataCartera));
router.get("/sancristobal", (req, res) => fetchData(req, res, carteraSanCristobal.fetchDataSanCristobal));
router.get("/mafre", (req, res) => fetchData(req, res, carteraMafre.fetchDataMafre));
router.get("/sancor", (req, res) => fetchData(req, res, carteraSancor.fetchDataSancor));
router.get("/rivadavia", (req, res) => fetchData(req, res, carteraRivadavia.fetchDataRivadavia));
router.get("/triunfo", (req, res) => fetchData(req, res, carteraTriunfo.fetchDataTriunfo));
router.get("/RUS", (req, res) => fetchData(req, res, carteraRUS.fetchDataRUS));
module.exports = router;