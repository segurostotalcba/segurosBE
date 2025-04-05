const e = require("express");
const companiaSchema = require("../models/companiasModel");

const router = e.Router();

//create companias
router.post('/companias', (req, res) => {
    const insert = companiaSchema(req.body);
    insert.save()
        .then((data) => { res.json(data) })
        .catch((error) => res.json({ message: error }))
});

//get companias
router.get('/companias', (req, res) => {
    companiaSchema.find()
    .then((data) => { res.json(data) })
    .catch((error) => res.json({ message: error }))
});

module.exports = router;