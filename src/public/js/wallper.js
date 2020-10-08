const wallperForm = document.getElementById('wallperForm');

wallperForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Tapeta');
    const data = getFormData(e.target);
    sio.emit('wallper', data);
})