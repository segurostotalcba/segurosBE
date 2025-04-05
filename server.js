const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require("path");
require("dotenv").config();
const clientesRoutes = require("./routes/clientesRoute");
const polizaRoutes = require("./routes/polizaRoute");
const searchRoutes = require("./routes/searchRoute");
const vehiculoRoutes = require("./routes/vehiculoRoute")
const datosContactoRoute = require("./routes/clienteDatosContactoRoute");
const carteraSanCristobal = require("./routes/carteraExcelRoute");
//const matchearSanCristobal = require("./routes/matchearRoute")
const procesarCartera = require("./routes/procesarCarteraRoute");
const domicilioRoute = require("./routes/clienteDomicilioRoute");
const app = express();
app.use((req, res, next) => {
    res.setTimeout(60000, () => {  // Set timeout to 60 seconds
        res.status(408).send("Request timed out");
    });
    next();
});
app.use(bodyParser.json());
app.use(cors());

//middleware
app.use(express.json());
app.use('/api', clientesRoutes);
app.use('/api', polizaRoutes);
app.use('/api', searchRoutes);
app.use('/api', vehiculoRoutes);
app.use('/api', datosContactoRoute);
app.use('/api', carteraSanCristobal);
app.use('/api', procesarCartera);
app.use('/api', domicilioRoute);

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 9000;

app.get('/', (req, res)=>{
    res.send("Bienvenidos a Seguros Total....");
});

//Add env
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('connected to mongo db success'))
.catch((err)=>console.error(err));

app.listen(port, ()=> console.log("server listening on port", port));