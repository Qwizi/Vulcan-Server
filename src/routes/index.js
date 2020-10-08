const express = require("express");
const router = express.Router();

let clients = [];

router.get("/", (req, res) => {
    res.render('index', {
        clients: clients,
        address: process.env.ADDRESS
    })
})

router.get('/client/:clientId/', (req, res) => {
    const clientIndex = clients.indexOf(`/clients#${req.params.clientId}`)
    const client = clients[clientIndex]
    if (!client) res.redirect(process.env.ADDRESS);
    else {
        res.render('client', {
            client: client,
            address: process.env.ADDRESS
        })
    }

})

module.exports = router;