const mongoose = require("mongoose");
//const Counter = require("./counterModel");

const vehiculosSchema = new mongoose.Schema({
   // id: { type: Number, unique: true, min: 1 },
    nombre: { type: String },
    tipoVehiculo: {type:String},
    patente: { type: String },
    nuevaRenovacion: { type: String },
    motor: { type: String },
    chasis: { type: String },
    idTipo: { type: String },
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
    idPoliza: { type: mongoose.Schema.Types.ObjectId, ref: "Poliza" }
});

// Middleware to auto-increment the ID before saving
/*vehiculosSchema.pre("save", async function (next) {
    const doc = this;
    if (!doc.isNew) return next(); // Only increment for new documents

    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "vehiculos" }, // Collection name as identifier
            { $inc: { seq: 1 } }, // Increment the sequence
            { new: true, upsert: true } // Create if not exists
        );
        doc.id = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});*/

module.exports = mongoose.model("vehiculo", vehiculosSchema);