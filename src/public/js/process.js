setInterval(() => {
    sio.emit("process_list", {clientId: clientId});
}, 2000);

const processList = document.getElementById('processList');
const processTable = document.getElementById('processTable');
const processForm = document.getElementById('processForm');

processForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getFormData(e.target);
    sio.emit('process_start', data);
})



const killProcess = (processId) => {
    sio.emit("process_kill", {clientId: clientId, processId: processId});
}

sio.on("process_list", (data) => {
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