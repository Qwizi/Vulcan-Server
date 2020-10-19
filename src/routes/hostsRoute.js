const express = require("express");
const router = express.Router();
const paginate = require('express-paginate');
const authMiddleware = require('../middleware/authMiddleware');
const {Account, Host} = require('../sequelize');


router.get('/', authMiddleware, async (req, res) => {
    const results = await Host.findAndCountAll({limit: req.query.limit, offset: req.skip});
    const pageCount = Math.ceil(results.count/req.query.limit)
    res.render('hosts/index', {
        address: process.env.ADDRESS,
        hosts: results.rows,
        count: results.count,
        pageCount: pageCount,
        pages: paginate.getArrayPages(req)(50, pageCount, req.query.page)
    })
})

router.get('/:hostTag', authMiddleware, async (req, res) => {
    const host = await Host.findOne({where: {tag: req.params.hostTag}})

    const results = await Account.findAndCountAll({limit: req.query.limit, offset: req.skip, HostId: host.dataValues.id})
    const pageCount = Math.ceil(results.count/req.query.limit)
    res.render('hosts/detail', {
        address: process.env.ADDRESS,
        accounts: results.rows,
        count: results.count,
        pageCount: pageCount,
        pages: paginate.getArrayPages(req)(50, pageCount, req.query.page)
    })
})

module.exports = router;
