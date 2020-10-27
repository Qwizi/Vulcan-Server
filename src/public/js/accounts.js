const createAccountForm = document.getElementById("createAccountForm")

createAccountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(hostId);
    const data = getFormData(e.target)
    const accountData = await vulcanApi.createAccount({username: data.username, password: data.password, HostId: hostId});
    console.log(accountData)
    UIkit.modal("#createAccountModal").hide();

    const username = document.createTextNode(accountData.data.username);
    const password = document.createTextNode(accountData.data.password);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.className = 'uk-button uk-button-default';
    console.log(deleteButton)
    addToTable(0, [username, password, deleteButton]);
})

const deleteAccount = async (node, id) => {
    await vulcanApi.deleteAccount(id);
    console.log(node.parentElement.parentElement.remove());
}
