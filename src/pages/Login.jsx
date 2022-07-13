import React, { useEffect, useRef, useState} from 'react'

import { Input } from "@progress/kendo-react-inputs";
import { Form, Field, FormElement } from "@progress/kendo-react-form"

import { useHistory } from 'react-router-dom';
import {loginUser} from '../api'
import { NOTIFICATION_TYPES } from '../constants';
import { Loader } from '@progress/kendo-react-indicators';
import { getErrorMessage, LOG } from '../logs';

const Login = (props) => {

    const [load, setLoad] = useState(false)
    let usernameRef = useRef()
    let passwordRef = useRef()

    let history = useHistory()
    useEffect(() => {
        if(JSON.parse(localStorage.getItem("isAuth"))){
            history.push("/profile")
        }
    }, [])

    const {onHasNotification} = props

    const loginHandler = (data) => {
        let username = usernameRef.current.value
        let password = passwordRef.current.value
        setLoad(true)
        loginUser(username, password).then(data => {
            LOG.logGeneral && console.log(data)
            setLoad(false)
            let newNotification = {type: null, msg: null}
            if(data.status){
                newNotification.msg = getErrorMessage(1)
                newNotification.type = NOTIFICATION_TYPES.Info
                history.push("/profile")
            }else{
                newNotification.type = NOTIFICATION_TYPES.Error
                newNotification.msg = getErrorMessage(2)
            }
            onHasNotification(newNotification.type, newNotification.msg)
        }).catch(err => {
            onHasNotification(NOTIFICATION_TYPES.Error, getErrorMessage(3))
            setLoad(false)
            history.push("/login")
        })
    }

    return <>
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
                disabled={load}
                type={"button"}
                onClick={loginHandler}
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base login-btn"
                >
                    {load ? <><Loader size='large' type='pulsing' /> Loading</> : <>Login</> }
                </button>
            </div>
            </FormElement>
        )}
        />
    </>
}

export default Login