import axios from 'axios'
var https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: true });

class ApiService {
    static apiCall(method, url, data, callback) {
        let headers = {
            "rejectUnauthorized": true,
            httpsAgent: httpsAgent,
            'Content-Type': 'application/json',      
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
    static uploadDoc(method, url, data,api_access_token, callback) {
        // console.log(api_access_token)
        let headers = {
            Authorization: `Bearer ${api_access_token}`,
            "rejectUnauthorized": true,
            httpsAgent: httpsAgent,
            'Content-Type': 'application/json',      
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