module.exports = (namespace, sio) => {
    namespace.on('connection', (socket) => {
        console.log('Updater connected')
    })
}