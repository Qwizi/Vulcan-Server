const createHostForm = document.getElementById("createHostForm");

createHostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Data');
    const data = getFormData(e.target);
    console.log(data);
    const hostData = await vulcanApi.createHost(data.tag, data.name, data.alias);
    console.log(hostData);
    UIkit.modal("#createHostModal").hide();
    const nameSpan = document.createElement("span")
    nameSpan.textContent = hostData.data.name;
    addToTable(nameSpan);
})