const express = require("express");
const router = express.Router();
const paginate = require('express-paginate');

const {Client, Cookie, Account, Host, Action} = require('../sequelize');
const authMiddleware = require('../middleware/authMiddleware');

const renderResults =  (req, results) => {
    const pageCount = Math.ceil(results.count/req.query.limit);
    const itemCount = results.count;
    return {
        results: results.rows,
        count: itemCount,
        pageCount: pageCount,
        pages: paginate.getArrayPages(req)(50, pageCount, req.query.page)
    }
}

const sendJson = (res, data) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(data));
}

/*
Clients
 */
router.get('/clients', async (req, res) => {
    const results = await Client.findAndCountAll({limit: req.query.limit, offset: req.skip});
    const renderData = renderResults(req, results)
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(renderData));
})

router.get('/clients/:clientId', async (req, res) => {
    const client = await Client.findOne({where: {id: req.params.clientId}});
    sendJson(res, client);
})

router.post('/clients', authMiddleware, async (req, res) => {
    const value = req.body.value;
    const domain = req.body.domain;
    const path = req.body.path;
    const expires = req.body.expires;
    const secure = req.body.secure;
    const ClientId = req.body.ClientId;

    const newClient = await Client.create({
        value: value,
        domain: domain,
        path: path,
        expires: expires,
        secure: secure,
        ClientId: ClientId
    })

    sendJson(res, newClient);
})

router.delete('/clients/:clientId', authMiddleware, async (req, res) => {
    const client = await Client.destroy({where: {id: req.params.clientId}})
    sendJson(res, client)
})

router.get('/clients/:clientId/cookies', async (req, res) => {
    const client = await Client.findOne({where: {id: req.params.clientId}})
    const cookieResults = Cookie.findAndCountAll({limit: req.query.limit, offset: req.skip, where: {clientId: client.dataValues.id}});
    const results = renderResults(req, cookieResults)
    sendJson(res, results);
})

/*
Cookies
 */
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

/*
Hosts
 */

router.get('/hosts', async (req, res) => {
    const results = await Host.findAndCountAll({limit: req.query.limit, offset: req.skip});
    sendJson(res, renderResults(req, results));
})

router.get('/hosts/:hostId', async (req, res) => {
    const hostId = req.params.hostId;
    const results = await Host.findOne({where: {id: hostId}});
    sendJson(res, JSON.stringify(results));
})

router.get('/hosts/:hostId/accounts', async (req, res) => {
    const hostId = req.params.hostId;
    console.log(hostId);
    const results = await Account.findAndCountAll({limit: req.query.limit, offset: req.skip, where: {HostId: hostId}, include: [Host]})
    sendJson(res, results);
})

router.post('/hosts/:hostId/accounts', authMiddleware, async (req, res) => {
    const hostId = req.params.hostId;

    const username = req.body.username;
    const password = req.body.password;

    const newAccount = await Account.create({username: username, password: password, HostId: hostId})
    sendJson(res, newAccount);
})

router.post('/hosts', authMiddleware, async (req, res) => {
    const name = req.body.name;
    const tag = req.body.tag;
    const alias = req.body.alias;

    const newHost = await Host.create({name: name, tag: tag, alias: alias});
    sendJson(res, newHost);
})

router.delete('/hosts/:hostId', async (req, res) => {
    const host = await Host.destroy({where: {id: req.params.hostId}})
    sendJson(res, host);
})


/*
Accounts
 */

router.get('/accounts', async (req, res) => {
    const results = await Account.findAndCountAll({limit: req.query.limit, offset: req.skip, include: [Host]});
    sendJson(res, renderResults(req, results));
})

router.post('/accounts', authMiddleware, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const HostId = req.body.HostId;

    const host = await Host.findOne({where: {id: HostId}});

    const newAccount = await Account.create({username: username, password: password, HostId: host.dataValues.id});

    sendJson(res, newAccount);
})

router.delete('/accounts/:accountId', authMiddleware, async (req, res) => {
    const account = await Account.destroy({where: {id: req.params.accountId}});
    sendJson(res, account);
})

/*
Actions
 */

router.get('/actions', async (req, res) => {
    const results = await Account.findAndCountAll({limit: req.query.limit, offset: req.skip})
    sendJson(res, results);
})

router.get('/actions/:actionId', async (req, res) => {
    const action = await Action.findOne({where: {id: req.params.actionId}})
    sendJson(res, action)
})

router.post('/actions', authMiddleware, async (req, res) => {
    const name = req.body.name;
    const tag = req.body.tag;
    const HostId = req.body.HostId;

    const host = await Host.findOne({where: {id: HostId}})

    const newAction = await Action.create({name: name, tag: tag, HostId: host.dataValues.id})

    sendJson(res, newAction)
})

router.delete('/actions/:actionId', authMiddleware, async (req, res) => {
    const action = await Action.destroy({where: {id: req.params.actionId}})
    sendJson(res, action)
})

module.exports = router;