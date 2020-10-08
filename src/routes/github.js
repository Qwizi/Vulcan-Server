const express = require("express");
const router = express.Router();

router.post('/', (req, res) => {
    if (req.body.action === 'released') {
        //updaterNamespace.emit('download_new_version', req.body)
    }
})

module.exports = router;