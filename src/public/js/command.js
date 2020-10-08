const commandForm = document.getElementById('commandForm');
const commandResult = document.getElementById('commandResult');
const commandFormBtnClear = document.getElementById('commandFormBtnClear');
const commandInput = document.querySelector('input[name="command"]')
const selectCommands = document.getElementById('selectCommands');

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

sio.on('command', (data) => {
    console.log(data.message);
    const resultBody = document.createElement('div');
    resultBody.style.marginBottom = "5px";
    resultBody.style.padding = "2px";
    resultBody.style.borderBottom = '1px solid white';

    resultBody.textContent = data.message;
    commandResult.append(resultBody);
})
