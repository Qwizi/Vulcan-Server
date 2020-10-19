const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const cache = require('../cache');
const {User} = require('../sequelize');

const authMiddleware = require('../middleware/authMiddleware');

router.get("/", authMiddleware, (req, res) => {
    const clients = cache.get("clients");
    res.render('index', {
        clients: clients,
        address: process.env.ADDRESS,
        logged: req.session.logged,
        user: req.session.user
    })
})

router.get('/client/:clientId/', authMiddleware, (req, res) => {
    const clients = cache.get("clients");
    const clientIndex = clients.indexOf(`/clients#${req.params.clientId}`)
    const client = clients[clientIndex]
    if (!client) res.redirect(process.env.ADDRESS);
    else {
        res.render('client/index', {
            client: client,
            address: process.env.ADDRESS,
            logged: req.session.logged,
        })
    }

})

router.get("/login", (req, res) => {
    res.render('login', {
        address: process.env.ADDRESS
    })
});

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const user = await User.findOne({where: {username: username}});
        if (user instanceof User) {
            const matchedPassword = await bcrypt.compare(password, user.dataValues.password);
            if (matchedPassword) {
                req.session.logged = true;
                req.session.user = user.dataValues;
                res.redirect('/');
            } else {
                console.log('Nie znaleiono uzytkownika');
                res.redirect('/login');
            }
        } else {
            console.log('Nie znaleiono uzytkownika');
            res.redirect('/login');
        }
    }
})

router.get('/logout', authMiddleware, (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
})

module.exports = router;