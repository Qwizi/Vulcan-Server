const express = require("express");
const router = express.Router();
const paginate = require('express-paginate');

const {Client, Cookie, Account, Host} = require('../sequelize');
const authMiddleware = require('../middleware/authMiddleware');

const renderResults =  (req, results) => {
    const pageCount = Math.ceil(results.count/req.query.limit);
    const itemCount = results.count;
    const renderData = {
        results: results.rows,
        count: itemCount,
        pageCount: pageCount,
        pages: paginate.getArrayPages(req)(50, pageCount, req.query.page)
    }
    return renderData
}

const sendJson = (res, data) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(data));
}

router.get('/clients', async (req, res) => {
    const sid = req.query.sid;
    const results = await Client.findAndCountAll({limit: req.query.limit, offset: req.skip});
    const renderData = renderResults(req, results)
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(renderData));
})

router.get('/cookies', async (req, res) => {
    const results = await Cookie.findAndCountAll({limit: req.query.limit, offset: req.skip})
    const renderData = renderResults(req, results)
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(renderData));
})

router.get('/cookies/:clientSid', async (req, res) => {
    const sid = req.params.clientSid;
    const sidDb = `/clients#${sid}`;
    const client = await Client.findOne({where: {sid: sidDb}});

    const results = await Cookie.findAndCountAll({limit: req.query.limit, offset: req.skip, where: {clientId: client.dataValues.id}});
    const renderData = renderResults(req, results)
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(renderData));
})

router.get('/hosts', async (req, res) => {
    const results = await Host.findAndCountAll({limit: req.query.limit, offset: req.skip});
    sendJson(res, renderResults(req, results));
})

router.get('/hosts/:hostId', async (req, res) => {
    const hostId = req.params.hostId;
    const results = await Host.findOne({where: {id: hostId}});
    sendJson(res, JSON.stringify(results));
})

router.post('/hosts', authMiddleware, async (req, res) => {
    const name = req.body.name;
    const tag = req.body.tag;
    const alias = req.body.alias;

    const newHost = await Host.create({name: name, tag: tag, alias: alias});
    sendJson(res, newHost);
})

router.get('/accounts', async (req, res) => {
    const results = await Account.findAndCountAll({limit: req.query.limit, offset: req.skip, include: [Host]});
    sendJson(res, renderResults(req, results));
})

module.exports = router;