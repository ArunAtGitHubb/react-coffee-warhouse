import { axiosInstance } from "./axios-config";

export const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const loginFormData = new FormData();
        loginFormData.append("data", JSON.stringify({username, password}))
        // for Content-Type': 'multipart/form-data
        
        axiosInstance.post("/auth/login", loginFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(({data}) => {
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

export const getUser = new Promise((resolve, reject) => {
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
    let tokenFormData = new FormData()
    tokenFormData.append("data", JSON.stringify({token}))
    axiosInstance.post('/auth/refresh_token', tokenFormData)
        .then(data => {
            console.log(data)
            resolve(data)
        }).catch(err => {
            reject(err)
        })
})