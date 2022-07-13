import React from "react";

import {
    Notification,
    NotificationGroup,
    } from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";

const Notifications = (props) => {
    return (<NotificationGroup
    style={{
        right: 0,
        bottom: 0,
        alignItems: "flex-start",
        flexWrap: "wrap-reverse",
    }}>
        <Fade>
            {props.hasNotification && <Notification
                type={{
                    style: props.notification?.type,
                    icon: true,
                }}
                closable={true}
                >
                {props.notification?.msg}
            </Notification>}
        </Fade>
    </NotificationGroup>)
}

export default Notifications