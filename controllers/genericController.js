const { Model } = require("mongoose");

async function create(Model, body) {
    try {
        const newDocument = new Model(body);
        await newDocument.save();
        return { success: true, data: newDocument };
    } catch (error) {
        return { success: false, error };
    }
}

module.exports = { create };

