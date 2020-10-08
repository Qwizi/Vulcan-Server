const express = require('express')
const session = require('express-session');
const app = express();
const bodyParser = require("body-parser");
const server = require('http').createServer(app);
const sio = require('socket.io')(server);
const pug = require('pug');

const User = require('./models/user');

require('dotenv').config({path: "../.env"});

const sequelize = require('./db');
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    //await sequelize.sync({force: true});
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
})();

app.engine('html', pug.renderFile)
app.set('view engine', 'pug')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
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
    const cache = require('./cache');
    cache.set("clients", []);
})