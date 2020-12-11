import axios from 'axios'
var https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: true });

const SelfAxios = axios.create({
    baseURL: process.env.SELF_SERVICE_URL,
    httpsAgent: httpsAgent,
    timeout: 500*1000
})

export default SelfAxios