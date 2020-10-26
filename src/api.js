import axios from 'axios'
var https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: true });

const Axios = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    httpsAgent: httpsAgent,
    timeout: 500*1000
})

export default Axios