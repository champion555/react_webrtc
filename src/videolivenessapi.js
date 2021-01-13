import axios from 'axios'
var https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: true });

const AxiosVideoLiv = axios.create({
    baseURL: process.env.VIDEO_LIVENESS_URL,
    httpsAgent: httpsAgent,
    timeout: 500*1000
})

export default AxiosVideoLiv