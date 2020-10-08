const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const server = require('http').createServer(app);
const sio = require('socket.io')(server);
const pug = require('pug');
require('dotenv').config({path: "../.env"});

app.engine('html', pug.renderFile)
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require("./routes/index"));
app.use('/github', require('./routes/github.js'));
app.use('/static/screenshoots/', express.static(__dirname + '/public/screenshoots/'));
app.use('/static/js/', express.static(__dirname + '/public/js/'));

const updaterNamespace = sio.of('/updater')
require('./namespaces/updater')(updaterNamespace, sio);

const clientNamespace = sio.of('/clients')
require('./namespaces/client')(clientNamespace, sio);

const managerNamespace = sio.of('/manager')
require('./namespaces/manager')(managerNamespace, sio);

server.listen(3000, () => {
    console.log('listening on http://localhost:3000');
})