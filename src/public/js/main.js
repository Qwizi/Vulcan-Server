let sio = io('/manager');

clientId = null;

const getFormData  = (target) => {
    const formData = new FormData(target)
    let data = {};
    Array.from(formData).map((item) => {
        data[item[0]] = item[1]
    })
    if (clientId) {
        data.clientId = clientId;
    }

    return data;
}

const isValidElement = (id) => {
    const el = document.getElementById(id);
    return typeof (el) != 'undefined' && el != null;
}

const setSpinnerState = (idSuffix, state) => {
    const id = `${idSuffix}Spinner`;
    if (isValidElement(id)) {document.getElementById(id).style.display = state}
}

const hideSpinner = (idSuffix) => {
    setSpinnerState(idSuffix, "none");
}

const showSpinner = (idSuffix) => {
    setSpinnerState(idSuffix, "block");
}

const setProgressStatus = (idSuffix, value) => {
    UIkit.util.ready(function () {
        const id = `${idSuffix}ProgressBar`;
        if (isValidElement(id)) {document.getElementById(id).value = value;}
    });
}

const setSubmitBtnState = (idSuffix, state) => {
    const id = `${idSuffix}FormBtn`;
    if (isValidElement(id)) {document.getElementById(id).disabled = state;}
}

const activateSubmitBtn = (idSuffix) => {
    setSubmitBtnState(idSuffix, false);
}

const deactivateSubmitBtn = (idSuffix) => {
    setSubmitBtnState(idSuffix, true);
}

const setInputsState = (idSuffix, state) => {
    const id = `${idSuffix}Form`;
    if (isValidElement(id)) {
        const form = document.getElementById(id);
        const inputs = form.elements;
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = state;
        }
    }
}

const setInputsVisibleState = (idSuffix, input_name, state) => {
    const id = `${idSuffix}Form`;
    if (isValidElement(id)) {
        const form = document.getElementById(id);
        const inputs = form.elements;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].name === input_name) {
                inputs[i].style.display = state
            }
        }
    }
}

const activateInputs = (idSuffix) => {
    setInputsState(idSuffix, false);
}

const deactivateInputs = (idSuffix) => {
    setInputsState(idSuffix, true);
}

const showInput = (idSuffix, input_name) => {
    setInputsVisibleState(idSuffix, input_name, "block");
}

const hideInput = (idSuffix, input_name) => {
    setInputsVisibleState(idSuffix, input_name, "none");
}

const clearInputs = (idSuffix) => {
    const id = `${idSuffix}Form`;
    if (isValidElement(id)) {
        const form = document.getElementById(id);
        const inputs = form.elements;
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
    }
}

const isValidClientsCount = () => {
    const clients = document.querySelectorAll("span[data-clientid]");
    if (clients.length === 0 && window.location.href.split('/')[3] == "client") {
        console.log(clients);
        console.log('client')
        return true
    }
    return clients.length > 0;
}

const errorNotify = (message) => {
    UIkit.notification({message: message, pos: 'bottom-right', status: 'danger'});
}

const addToTable = (tableIndex, elements) => {
    console.log(elements)
    const tbody = document.getElementsByTagName('tbody')[tableIndex];
    const row = tbody.insertRow(tbody.rows.length);
    elements.map((el, index) => {
        const cell = row.insertCell(index);
        cell.appendChild(el);
    })
}

sio.on('connect', function() {
    console.log('I\'m connected');
});

sio.on('notification', (data) => {
    UIkit.notification({message: data.message, pos: data.pos, status: data.status});
})

sio.on('progress', data => {
    console.log(data);
    const id = data.idSuffix;
    setProgressStatus(data.idSuffix, data.value);

    // Resetujemy
    if (data.value === 100) {
        setTimeout(() => {
            setProgressStatus(id, 0);
            activateSubmitBtn(id);
            clearInputs(id);
            activateInputs(id);
            hideSpinner(id);
        }, 1000);
    }
})