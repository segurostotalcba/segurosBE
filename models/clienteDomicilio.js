const mongoose = require("mongoose");

const clienteDomicilioSchema = new mongoose.Schema({
    domicilio: { type: String},
    localidad: { type: String},
    cp: { type: String},
    tipoDomicilio: {type: String},
    fechaActualizado:  {type: Date},
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
    idPoliza: { type: mongoose.Schema.Types.ObjectId, ref: "Poliza" }
});

module.exports = mongoose.model("ClienteDomicilio", clienteDomicilioSchema);