const mongoose = require("mongoose");

const clientesSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true, 
        trim: true, 
        minlength: 3, 
        match: /^[A-Za-zÁÉÍÓÚÜÑñ\s]+$/ // Allows Spanish accented characters
    },
    dni: { 
        type: String, 
        unique: true, 
        required: true, 
        trim: true, 
        lowercase: true // Ensures uniqueness in case-insensitive manner
    },
    fechaNacimiento: { type: Date },
    fechaRegistro: { type: Date, default: Date.now },
    fechaActualizado: { type: Date }
});

// Auto-update `fechaActualizado` before saving
clientesSchema.pre("save", function (next) {
    this.fechaActualizado = new Date();
    next();
});

module.exports = mongoose.model("Cliente", clientesSchema);