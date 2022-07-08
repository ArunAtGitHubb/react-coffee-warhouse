import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const Logout = () => {
    
    let location = useHistory()

    useEffect(() => {
        localStorage.removeItem("isAuth")
        localStorage.removeItem("token")
        location.push("/login")
    }, [])

    return <h1>Logging out...</h1>
}

export default Logout