const createHostForm = document.getElementById("createHostForm");

createHostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Data');
    const data = getFormData(e.target);
    console.log(data);
    const hostData = await vulcanApi.createHost({tag: data.tag, name: data.name, alias: data.alias});
    console.log(hostData);
    UIkit.modal("#createHostModal").hide();

    const name = document.createElement("a");
    name.href = `/hosts/${hostData.data.id}`;
    name.textContent = hostData.data.name;
    const tag = document.createTextNode(hostData.data.tag);
    const alias = document.createTextNode(hostData.data.alias);
    addToTable(0, [name, tag, alias]);
})

const deleteHost = async (node, id) => {
    await vulcanApi.deleteHost(id);
    console.log(node.parentElement.parentElement.remove());
}

