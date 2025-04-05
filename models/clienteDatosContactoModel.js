const mongoose = require("mongoose");

const clientesDatosContactoSchema = new mongoose.Schema({
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
    telefonoMovil: { type: String},
    telefonoFijo: { type: String},
    email: { type: String },
    perteneceA: {type: String}
});


module.exports = mongoose.model("ClienteDatosContacto", clientesDatosContactoSchema);