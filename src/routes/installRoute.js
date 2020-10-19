const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const {User} = require('../sequelize');

router.get('/', async (req, res) => {

    res.render('install/index', {
        address: process.env.ADDRESS
    });

})

router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const user = await User.findOne({where: {username: username}})
        console.log(user instanceof User)
        if (user === null) {
            const hash = await bcrypt.hash(password, 15);
            await User.create({username: username, password: hash});
            return res.redirect('/')
        } else {
            return res.redirect('/install')
        }
    } else {
        return res.redirect('/install')
    }
})

module.exports = router;