import React, {useContext, useEffect, useRef, useState} from 'react'

import { Input } from "@progress/kendo-react-inputs";
import { Form, Field, FormElement } from "@progress/kendo-react-form"

import { useHistory } from 'react-router-dom';
import {loginUser} from '../api'
import Spinner from '../components/spinner/spinner'
import { AppContext } from '../AppContext';
import { NOTIFICATION_TYPES } from '../constants';

const Login = (props) => {

    const [load, setLoad] = useState(false)
    const {onHasNotification} = useContext(AppContext)
    let usernameRef = useRef()
    let passwordRef = useRef()

    let history = useHistory()
    useEffect(() => {
        if(JSON.parse(localStorage.getItem("isAuth"))){
            history.push("/profile")
        }
    }, [])


    const loginHandler = (data) => {
        let username = usernameRef.current.value
        let password = passwordRef.current.value
        console.log("clicked", username, password)
        setLoad(true)
        loginUser(username, password).then(data => {
            console.log(data)
            setLoad(false)
            let notification = {type: null, msg: null}
            if(data.status){
                notification.msg = "Logged In sucessfully"
                notification.type = NOTIFICATION_TYPES.Info
                history.push("/profile")
            }else{
                notification.type = NOTIFICATION_TYPES.Error
                notification.msg = "Invalid details"
            }
            onHasNotification(notification.type, notification.msg)
        }).catch(err => {
            onHasNotification(NOTIFICATION_TYPES.Error, "Log In Failed!")
            setLoad(false)
            history.push("/login")
        })
    }

    return <>
    {load && <Spinner />}
        <Form
            render={(formRenderProps) => (
            <FormElement
                style={{
                    maxWidth: 650,
                    position: "relative",
                    left: "35%",
                    top: "100px"
                }}
                >
            <h1>Login</h1>
            <fieldset className={"k-form-fieldset"}>
                <legend className={"k-form-legend"}>
                Please fill in the fields:
                </legend>
                <div className="mb-3">
                    <Input type={"text"} ref={usernameRef} name={"username"} label={"Username"}/>
                    </div>
                <div className="mb-3">
                    <Input type={"password"} ref={passwordRef} name={"password"} label={"Password"}/>
                </div>

            </fieldset>
            <div className="k-form-buttons">
                <button
                type={"button"}
                onClick={loginHandler}
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                >
                Login
                </button>
            </div>
            </FormElement>
        )}
        />
    </>
}

export default Login