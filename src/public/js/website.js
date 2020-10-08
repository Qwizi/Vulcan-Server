const websiteForm = document.getElementById('websiteForm')
const websiteFormBtn = document.getElementById('websiteFormBtn');
const urlSpinner = document.getElementById('urlSpinner')
const urlInput = document.querySelector('input[name="url"]')

websiteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Strona!')
    const data = getFormData(e.target);
    sio.emit('website', data)
})

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