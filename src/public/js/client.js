
window.onload = () => {
    setInterval(() => {
        sio.emit("process_list", {clientId: clientId});
    }, 2000);
}

sio.on('client_disconnected', (data) => {
    window.location.href = address;
});