class VulcanApi
{
    constructor(url) {
        this.axios = axios.create({baseURL: url})
    }

    getHosts = async () => {
        return await this.axios.get('/hosts');
    }

    getHost = async (id) => {
        return await this.axios.get('/hosts/'+id);
    }

    createHost = async (tag, name, alias) => {
        return await this.axios.post('/hosts', {tag: tag, name: name, alias: alias});
    }

    deleteHost = async (id) => {
        return await this.axios.delete('/hosts/'+id);
    }
}

const vulcanApi = new VulcanApi('http://localhost:3000/api');