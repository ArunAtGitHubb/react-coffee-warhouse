import axios from 'axios'
import { logout, refreshToken } from './api'
import { BASE_URL } from './constants'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

let token = localStorage.getItem("token")

if(token !== null){
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

window.addEventListener("storage", (e) => {
    console.log("storage->token: ", e.storageArea.token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${e.storageArea.token}`
})

axiosInstance.interceptors.request.use(function (config) {
    console.log("interceptor request", config)
    return config;
    }, function (error) {
    console.log("interceptor request", error)
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
    // Successfull responses like range from 2xx
    console.log("interceptor response", response)
    return response;
}, function (error) {
    // Unsuccessfull responses range from 4xx, like token expiry
    let statusCode = error.response.status
    if(statusCode === 401 || statusCode === 403){
        let token = localStorage.getItem("token")
        if(token !== null){
            refreshToken(token).then(data => {
                // refreshed token
                console.log(data)
                let newToken = data.data
                localStorage.setItem("token", newToken)
            }).catch(err => {
                // invalid token
                logout()
                window.location.href = "/login"
                console.log("Invalid Token", err)
            })
        }
    }
    console.log("interceptor response error", error)
    return Promise.reject(error);
    });