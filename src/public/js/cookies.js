const cookiesForm = document.getElementById('cookiesForm');

cookiesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Ciasteczka')
    const data = getFormData(e.target);
    console.log(data);
    sio.emit('cookies', data);
    const idSuffix = "cookies";
    deactivateSubmitBtn(idSuffix);
    showSpinner(idSuffix);
    deactivateInputs(idSuffix);
})

sio.on('cookies', data => {
    console.log(data.cookies);
})