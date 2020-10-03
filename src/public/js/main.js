let sio = io('/manager');

sio.on('connect', function() {
    console.log('I\'m connected');
});

sio.on('notification', (data) => {
    UIkit.notification({message: data.message, pos: data.pos, status: data.status});
})