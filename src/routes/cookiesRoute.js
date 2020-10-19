const express = require("express");
const router = express.Router();

const {Client, Ccookie} = require('../sequelize');

router.get('/', async (req, res) => {
    client = await Client.findOne({where: {id}})
});


module.exports = router;