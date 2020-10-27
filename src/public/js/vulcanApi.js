class VulcanApi
{
    constructor(url) {
        this.axios = axios.create({baseURL: url})
    }

    getHosts = async () => {
        return await this.axios.get('/hosts');
    }

    getHost = async (id) => {
        return await this.axios.get('/hosts/' + id);
    }

    createHost = async ({tag, name, alias}) => {
        return await this.axios.post('/hosts', {tag: tag, name: name, alias: alias});
    }

    deleteHost = async (id) => {
        return await this.axios.delete('/hosts/'+id);
    }

    getHostActions = async (hostId) => {
        return await this.axios.get(`/hosts/${hostId}/actions`);
    }

    getAccounts = async () => {
        return await this.axios.get('/accounts')
    }

    getAccount = async (id) => {
        return await this.axios.get('/accounts/'+id);
    }

    createAccount = async ({username, password, HostId}) => {
        return await this.axios.post('/accounts', {username: username, password: password, HostId: HostId})
    }

    deleteAccount = async (id) => {
        return await this.axios.delete('/accounts/'+id);
    }

    getActions = async () => {
        return await this.axios.get('/actions/');
    }

    getAction = async (id) => {
        return await this.axios.get('/actions/'+id);
    }

    createAction = async ({name, tag, HostId}) => {
        return await this.axios.post('/actions', {name: name, tag: tag, HostId: HostId})
    }

    deleteAction = async (id) => {
        return await this.axios.delete('/actions/'+id);
    }

    getCookies = async () => {
        return await this.axios.get('/cookies')
    }

    getCookie = async (id) => {
        return await this.axios.get('/cookies/'+id)
    }

    createCookie = async ({value, domain, path, secure, expires, ClientId}) => {
        return await this.axios.post('/cookies', {value, domain, path, secure, expires, ClientId})
    }

    deleteCookie = async (id) => {
        return await this.axios.delete('/cookies/'+id);
    }

    getClients = async () => {
        return await this.axios.get('/clients');
    }

    getClient = async (id) => {
        return await this.axios.get('/clients/'+id);
    }

    createClient = async (sid) => {
        return await this.axios.post('/clients', {sid: sid})
    }

    deleteClient = async (id) => {
        return await this.axios.delete('/clients/'+id);
    }

    getClientCookies = async (sid) => {
        return await this.axios.get(`/clients/${sid}/cookies`);
    }
}

const vulcanApi = new VulcanApi('http://localhost:3000/api');