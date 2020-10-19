const express = require('express')
const session = require('express-session');
const app = express();
const bodyParser = require("body-parser");
const server = require('http').createServer(app);
const sio = require('socket.io')(server);
const pug = require('pug');
const paginate = require('express-paginate');
require('dotenv').config({path: "../.env"});

const installMiddleware = require('./middleware/installMiddleware');

app.engine('html', pug.renderFile)
app.set('view engine', 'pug')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(paginate.middleware(10, 50));

app.use('/', require("./routes/mainRoute"));
app.use('/install', require("./routes/installRoute"));
app.use('/github', require('./routes/githubRoute.js'));
app.use('/ss', require('./routes/screenshootsRoute'));
app.use('/hosts', require('./routes/hostsRoute'));
app.use('/api', require('./routes/apiRoute'));

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
    const cache = require('./cache');
    cache.set("clients", []);
})