const createActionForm = document.getElementById("createActionForm")

createActionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = getFormData(e.target)
    const actionData = await vulcanApi.createAction({name: data.name, tag: data.tag, HostId: hostId});
    console.log(data)
    UIkit.modal("#createActionModal").hide();

    const name = document.createTextNode(actionData.data.name);
    const tag = document.createTextNode(actionData.data.tag);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.className = 'uk-button uk-button-default';
    addToTable(1,[name, tag, deleteButton]);
})

const deleteAction = async (node, id) => {
    await vulcanApi.deleteAction(id);
    console.log(node.parentElement.parentElement.remove());
}