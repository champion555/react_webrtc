import axios from 'axios'
var https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: true });

class ApiService {
    static apiCall(method, url, data, callback) {
        let headers = {
            "Authorization": sessionStorage.getItem('api_access_token'),
            "rejectUnauthorized": true,
            httpsAgent: httpsAgent,
        }
        axios({
            method: method,
            url: url,
            data: data,
            httpsAgent: httpsAgent,
            headers: headers
        })
            .then(function (res) {
                callback(res)
            })
            .catch(function (err) {
                console.log("errors : ", err.response)
                callback(err)
            })
    }
}
export default ApiService