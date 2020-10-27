const websiteForm = document.getElementById('websiteForm')
const setActionInput = document.querySelector("input[name='set_action']")
const actionSelectInput = document.querySelector("select[name='action']")
const urlInput = document.querySelector("input[name='url']")

if (!isValidClientsCount()) {
    const idSuffix = 'website';
    deactivateSubmitBtn(idSuffix)
    deactivateInputs(idSuffix);
}

const clearSelect = () => {
    const options = actionSelectInput.options;
    if (options.length > 0) {
        for (let i=0; i < options.length; i++) {
            options.remove(options[i]);
        }
    }
}

const createSelectOption = (tag, name) => {
    const option = document.createElement("option");
    option.text = name;
    option.value = tag;
    actionSelectInput.add(option);
}

const getActions = (target) => {
    if (setActionInput.checked) {
        clearSelect();
        const url = new URL(target.value)
        sio.emit('actions', {url: url})
    }
}

websiteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idSuffix = 'website';
    console.log('Strona!')
    const data = getFormData(e.target);
    console.log(data);
    for (const [key, value] of Object.entries(data)) {
        if (value === "") {
            return errorNotify(`Musisz wypelic pole ${key}`);
        }
    }

    sio.emit('website', data)

    deactivateSubmitBtn(idSuffix);
    deactivateInputs(idSuffix);
    showSpinner(idSuffix);
})

setActionInput.addEventListener('change', (e) => {
    if (!e.target.checked) {
        hideInput('website', 'action');
        clearSelect();
    } else {
        if (urlInput.value !== "") {
            getActions(urlInput)
        }
    }
})


urlInput.addEventListener('focusout', (e) => {
    getActions(e.target);
})

sio.on('actions', data => {
    showInput('website', 'action');
    console.log(data);
    const options = actionSelectInput.options;
    data.actions.map(action => {
        if (options.length === 0) {
            createSelectOption(action.tag, action.name);
        } else {
            for (let i=0; i <= options.length; i++)
            {
                if (options[i].value !== action.tag) {
                    createSelectOption(action.tag, action.name)
                }
            }
        }
    })
});