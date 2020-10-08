const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const cache = require('../cache');

router.get("/", (req, res) => {
    if (req.session.logged) {
        const clients = cache.get("clients");
        res.render('index', {
            clients: clients,
            address: process.env.ADDRESS,
            logged: req.session.logged,
            user: req.session.user
        })
    } else {
        res.redirect('/login')
    }

})

router.get('/client/:clientId/', (req, res) => {
    const clients = cache.get("clients");
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

router.get("/login", (req, res) => {
    res.render('login', {
        address: process.env.ADDRESS
    })
});

router.post('/login', (req, res) => {
    (async () => {
        const User = require('../models/user');
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
            /*bcrypt.hash(password, saltRounds, function(err, hash) {
                const newUser = User.create({username: username, password: hash});
            });*/
            const user = await User.findOne({where: {username: username}});
            if (user instanceof User) {
                const matchedPassword = await bcrypt.compare(password, user.dataValues.password);
                if (matchedPassword) {
                    req.session.logged = true;
                    req.session.user = user.dataValues;
                    res.redirect('/');
                }
            }
        }
        res.redirect('/login');
    })();
})

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
})

module.exports = router;