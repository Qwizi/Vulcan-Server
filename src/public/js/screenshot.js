const screenshootFormBtn = document.getElementById('screenshootFormBtn');

if (!isValidClientsCount()) {
    const idSuffix = 'screenshoot';
    deactivateSubmitBtn(idSuffix)
    deactivateInputs(idSuffix);
}

screenshootFormBtn.addEventListener('click', (e) => {
    sio.emit('screenshoot', {clientId: clientId});
    const idSuffix = 'screenshoot'
    deactivateSubmitBtn(idSuffix)
    showSpinner(idSuffix);
})
