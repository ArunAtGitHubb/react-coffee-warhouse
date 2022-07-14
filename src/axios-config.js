import axios from 'axios'
import { logout, refreshToken } from './api'
import { BASE_URL } from './constants'
import { LOG } from './logs'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

window.addEventListener("storage", (e) => {
    LOG.logGeneral && console.log("storage->token: ", e.storageArea.token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${e.storageArea.token}`
    LOG.logNetwork && console.log(axiosInstance.defaults.headers)
})

let token = localStorage.getItem("token")

if(token !== null){
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`
}

const CancelToken = axios.CancelToken;
let cancel;
let requests = []

axiosInstance.interceptors.request.use(function (config) {
    LOG.logNetwork && console.log("interceptor request", config)

    LOG.logNetwork && console.log(requests, config.url)

    requests.map((request, idx) => {
        if(request?.url === config.url){
            request.cancel()
            requests.splice(idx, 1)
        }
    })

    config.cancelToken =  new CancelToken((c) =>{
        LOG.logGeneral && console.log(c)
        let request = {
            url: config.url,
            cancel: c
        }

        requests.push(request)
        cancel = c;
    })

    return config
    }, function (error) {
    LOG.logNetworkErrors && console.log("interceptor request", error)
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
    // Successfull responses like range from 2xx
    requests.map((request, idx) => {
        if(request.url === response.config.url){
            requests.splice(idx, 1)
        }
    })
    LOG.logNetwork && console.log("interceptor response", response)
    return response;
}, function (error) {
    LOG.logNetworkErrors && console.log("interceptor response error", error)
    // Unsuccessfull responses range from 4xx, like token expiry
        let statusCode = error?.response?.status 
        if(statusCode === 401){
            let token = localStorage.getItem("token")
            if(token !== null){
                refreshToken(token).then(data => {
                    // refreshed token
                    LOG.logNetwork && console.log("inside refreshToken then {}", data)
                    let newToken = data.data.data
                    localStorage.setItem("token", newToken)
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`
                }).catch(err => {
                    // invalid token
                    logout()
                    LOG.logNetworkErrors && console.log("inside refreshToken catch {}")
                })
            }
        }
    return Promise.reject(error);
    });