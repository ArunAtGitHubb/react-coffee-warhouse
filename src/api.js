import axios from "axios";
import { axiosInstance } from "./axios-config";
import { LOG } from "./logs";

export const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const loginFormData = new FormData();
        loginFormData.append("data", JSON.stringify({username, password}))
        // for Content-Type': 'multipart/form-data
        axiosInstance.post("/auth/login", loginFormData).then(({data}) => {
            localStorage.setItem("isAuth", data.status)
            if(data.status){
                let {token} = {...data.data}
                localStorage.setItem("token", token)
            }
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getUser2 = () => {
    return axiosInstance.get("/V1/profile/2")
}

export const getUser = () => new Promise((resolve, reject) => {
    axiosInstance.get("/V1/profile/2").then(user => {
        resolve(user)
    }).catch(err => {
        reject(err)
    })
})

export const logout = () => {
    localStorage.removeItem("isAuth")
    localStorage.removeItem("token")
}

export const refreshToken = (token) => new Promise((resolve, reject) => {
    let formdata = new FormData();
    formdata.append("data", JSON.stringify({"token": token}));

    let reqOptions = {
    url: "https://devth.tigeensolutions.com:447/api/auth/refresh_token",
    method: "POST",
    data: formdata,
    }

    axios.request(reqOptions).then(data => {
        LOG.logNetwork && console.log(data)
        resolve(data)
    }).catch(err => {
        LOG.logNetworkErrors && console.log(err)
        reject(err)
    })
})
