window.onload = () => {
    const clients = document.querySelectorAll("span[data-clientid]");
    for (let i = 0; i < clients.length; i++) {
        const clientId = clients[i].dataset.clientid.replace('/clients#', '');
        clients[i].textContent = clientId;
        clients[i].parentElement.href = `/client/${clientId}`;
    }
}

const activateIndexNodes = () => {
    const ids = ['website', 'screenshoot']
    ids.map(id => {
        activateSubmitBtn(id);
        activateInputs(id);
    })
}

const deactivateIndexNodes = () => {
    const ids = ['website', 'screenshoot']
    ids.map(id => {
        deactivateSubmitBtn(id);
        deactivateInputs(id);
    })
}

sio.on('client_connected', function (data) {
    console.log(data);
    const tbody = document.getElementsByTagName('tbody')[0];
    const row = tbody.insertRow(tbody.rows.length);
    const clientCell = row.insertCell(0);
    row.classList.add('uk-animation-slide-bottom-medium')
    const clientLink = document.createElement('a');
    const splitClientId = data.client.replace('/clients#', '');
    clientLink.href = `/client/${splitClientId}`;
    clientLink.innerHTML = `<span data-clientid=${data.client}>${splitClientId}</span>`;
    console.log(clientLink);

    clientCell.appendChild(clientLink);

    activateIndexNodes();
});

sio.on('client_disconnected', function (data) {
    const clientSpan = document.querySelector(`[data-clientid="${data.client}"]`);
    console.log(clientSpan);
    console.log(clientSpan.parentElement.parentElement.parentElement);
    clientSpan.parentElement.parentElement.parentElement.classList.add('uk-animation-slide-top-medium')
    clientSpan.parentElement.parentElement.parentElement.classList.add('uk-animation-reverse')
    clientSpan.parentElement.parentElement.parentElement.remove()

    if (!isValidClientsCount()) {
        deactivateIndexNodes();
    }

})