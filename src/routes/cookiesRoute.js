const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('cookies/index', {
        address: process.env.ADDRESS
    })
});


module.exports = router;