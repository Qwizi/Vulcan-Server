const manageBtnScreenShoot = document.getElementById('manageBtnScreenShoot');

manageBtnScreenShoot.addEventListener('click', (e) => {
    sio.emit('screenshoot', {clientId: clientId});
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