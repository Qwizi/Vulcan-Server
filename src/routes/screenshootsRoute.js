const express = require("express");
const router = express.Router();
const paginate = require('express-paginate');

const {Screenshoot} = require('../sequelize');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
    const results = await Screenshoot.findAndCountAll({limit: 9, offset: req.skip})
    const itemCount = results.count;
    const pageCount = Math.ceil(results.count/9);
    const pages = paginate.getArrayPages(req)(50, pageCount, req.query.page)
    console.log(pages);
    const next = pages.find(p => p.number === req.query.page + 1)
    const previous = pages.find(p => p.number === req.query.page - 1);
    console.log(next);
    console.log(previous);
    res.render('screenshoots/index', {
        screenshoots: results.rows,
        address: process.env.ADDRESS,
        count: itemCount,
        pageCount: pageCount,
        pages: pages,
        currentPage: req.query.page,
        next: next,
        previous: previous
    })
});

module.exports = router;