
window.onload = () => {
    setInterval(() => {
        sio.emit("process_list", {clientId: clientId});
    }, 2000);
}

const hideSpinner = (id) => {
    document.getElementById(id).style.display = "none";
}

const getFormData  = (target) => {
    const formData = new FormData(target)
    let data = {};
    Array.from(formData).map((item) => {
        data[item[0]] = item[1]
    })
    data.clientId = clientId;
    return data;
}

sio.on('client_disconnected', (data) => {
    window.location.href = address;
});