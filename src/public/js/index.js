window.onload = () => {
    const clients = document.querySelectorAll("span[data-clientid]");
    for (let i=0; i < clients.length; i++) {
        const clientId = clients[i].dataset.clientid.replace('/clients#', '');
        clients[i].textContent = clientId;
        clients[i].parentElement.href = `/client/${clientId}`;
    }

    /*setInterval(async () => {
        const systemInfoClients = await getSystemInfoLocalStorage();
        systemInfoClients.map(item => {
            (async () => {
                const clientTr = Array.prototype.slice.call(clients).find(ct => ct.dataset.clientid === item.clientId);
                if (!clientTr) await removeClientFromLocalStorage(item.clientId);
            })();
        })
    }, 2000);*/
}

const manageBtnScreenShoot = document.getElementById('manageBtnScreenShoot');
manageBtnScreenShoot.addEventListener('click', (e) => {
    sio.emit('screenshoot');
})

const websiteForm = document.getElementById('websiteForm')
const websiteFormBtn = document.getElementById('websiteFormBtn');
const urlSpinner = document.getElementById('urlSpinner')
const urlInput = document.querySelector('input[name="url"]')

websiteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Strona!')
    const formData = new FormData(e.target)
    console.log(Array.from(formData));
    let data = {};
    Array.from(formData).map((item) => {
        data[item[0]] = item[1]

    })
    sio.emit('website', data)
})

sio.on('client_connected', function(data) {
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

});

sio.on('client_disconnected', function(data) {
    const clientSpan = document.querySelector(`[data-clientid="${data.client}"]`);
    console.log(clientSpan);
    console.log(clientSpan.parentElement.parentElement.parentElement);
    clientSpan.parentElement.parentElement.parentElement.classList.add('uk-animation-slide-top-medium')
    clientSpan.parentElement.parentElement.parentElement.classList.add('uk-animation-reverse')
    clientSpan.parentElement.parentElement.parentElement.remove()

})

sio.on('ss_btn', function(data) {
    const state = data.state;

    if (!state) {
        manageBtnScreenShoot.disabled = true;
    } else {
        manageBtnScreenShoot.disabled = false;
        UIkit.notification({message: 'Pomyslnie zrobiono zrzut ekranu', pos: 'bottom-right', status: 'success'})
    }

})

sio.on('website_btn', function(data) {
    const state = data.state;

    if (!state) {
        websiteFormBtn.disabled = true;
        urlSpinner.style.display = 'block';
        urlInput.value = '';
        urlInput.disabled = true;
    } else {
        websiteFormBtn.disabled = false;
        urlSpinner.style.display = 'none';
        urlInput.disabled = false;
    }

})