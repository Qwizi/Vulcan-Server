const express = require("express");
const router = express.Router();
const paginate = require('express-paginate');
const authMiddleware = require('../middleware/authMiddleware');
const {Account, Host, Action} = require('../sequelize');


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

router.get('/:hostId', authMiddleware, async (req, res) => {
    const host = await Host.findOne({where: {id: req.params.hostId}})
    console.log(host.dataValues.id);
    const results = await Account.findAndCountAll({limit: req.query.limit, offset: req.skip, where: {HostId: host.dataValues.id}})
    const pageCount = Math.ceil(results.count/req.query.limit)
    const actionResults = await Action.findAndCountAll({limit: req.query.limit, offset: req.skip, where: {HostId: host.dataValues.id}})
    const actionPageCount = Math.ceil(results.count/req.query.limit)
    res.render('hosts/detail', {
        address: process.env.ADDRESS,
        accounts: results.rows,
        count: results.count,
        pageCount: pageCount,
        pages: paginate.getArrayPages(req)(50, pageCount, req.query.page),
        host: host,
        actions: actionResults.rows,
        actionsCount: actionResults.count,
        actionsPageCount: actionPageCount
    })
})

module.exports = router;
