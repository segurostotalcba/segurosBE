const mongoose = require("mongoose");

const polizaSchema = new mongoose.Schema({
    poliza: { type: String },
    fechaInicioVigencia: { type: Date },
    fechaFinVigencia: { type: Date },
    compania: {type: String},
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
    ramo:{type: String},
    estadoPoliza:{type: String},
    clienteInterno: {type: String}
});


module.exports = mongoose.model("Poliza", polizaSchema);