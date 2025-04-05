const mongoose = require("mongoose");

const companiaSchema = new mongoose.Schema({
    id: { type: Number, unique: true, min: 1 },
    name: { type: String }
});

module.exports = mongoose.model("Compania", companiaSchema);