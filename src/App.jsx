import React from 'react';
import {connect} from 'react-redux'

import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Planning from './pages/Planning.jsx';
import Profile from './pages/Profile.jsx';
import Info from './pages/Info.jsx';
import DrawerRouterContainer from './components/DrawerRouterContainer.jsx';
import { IntlProvider, load, LocalizationProvider, loadMessages } from '@progress/kendo-react-intl';
import {
    Notification,
    NotificationGroup,
    } from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";

import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';

import frNumbers from 'cldr-numbers-full/main/fr/numbers.json';
import frLocalCurrency from 'cldr-numbers-full/main/fr/currencies.json';
import frCaGregorian from 'cldr-dates-full/main/fr/ca-gregorian.json';
import frDateFields from'cldr-dates-full/main/fr/dateFields.json';

import usNumbers from 'cldr-numbers-full/main/en/numbers.json';
import usLocalCurrency from 'cldr-numbers-full/main/en/currencies.json';
import usCaGregorian from 'cldr-dates-full/main/en/ca-gregorian.json';
import usDateFields from'cldr-dates-full/main/en/dateFields.json';

import esNumbers from 'cldr-numbers-full/main/es/numbers.json';
import esLocalCurrency from 'cldr-numbers-full/main/es/currencies.json';
import esCaGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
import esDateFields from'cldr-dates-full/main/es/dateFields.json';

import { enMessages } from './messages/en-US';
import { frMessages } from './messages/fr';
import { esMessages } from './messages/es';

import 'hammerjs';
import '@progress/kendo-theme-default/dist/all.css';
import './App.scss';
import Login from './pages/Login.jsx';
import { logout } from './api.js';
import { NOTIFICATION_TYPES } from './constants.js';
import { getErrorMessage, LOG } from './logs.js';
import * as actions from './store/actions'

load(
    likelySubtags,
    currencyData,
    weekData,
    frNumbers,
    frLocalCurrency,
    frCaGregorian,
    frDateFields,
    usNumbers,
    usLocalCurrency,
    usCaGregorian,
    usDateFields,
    esNumbers,
    esLocalCurrency,
    esCaGregorian,
    esDateFields
);

loadMessages(esMessages, 'es');
loadMessages(frMessages, 'fr');
loadMessages(enMessages, 'en-US');

const App = (props) => {
    const [hasNotification, setHasNotification] = React.useState(false)
    const [notification, setNotification] = React.useState({type: null, msg: null})

    const onHasNotification = (type, msg) => {
        let notify = {
            type, msg
        }
        setHasNotification(true)
        setNotification(notify)
        setTimeout(() => {
            setHasNotification(false)
        }, 3000)
    }

    LOG.logGeneral && console.log("localId from redux", props)

    return (
        <div className="App">
            <LocalizationProvider language={props.localeId}>
                <IntlProvider locale={props.localeId}>
                    <BrowserRouter>
                        <Switch>
                            <Route exact={true} path={"/login"} render={() => <Login onHasNotification={onHasNotification}/>}/>
                            <DrawerRouterContainer>
                                <Route exact={true} path="/" render={() => <Dashboard onHasNotification={onHasNotification}/>} />
                                <Route exact={true} path="/planning" render={() => <Planning onHasNotification={onHasNotification}/>} />
                                <Route exact={true} path="/profile" render={() => <Profile onHasNotification={onHasNotification}/>} />
                                <Route exact={true} path="/info" render={() => <Info onHasNotification={onHasNotification}/>} />
                                <Route exact={true} path="/logout" render={() => {
                                        onHasNotification(NOTIFICATION_TYPES.Info, getErrorMessage(6))
                                        logout()
                                        return <Redirect to="/login" />
                                }} />
                            </DrawerRouterContainer>
                        </Switch>
                        <NotificationGroup
                            style={{
                                right: 0,
                                bottom: 0,
                                alignItems: "flex-start",
                                flexWrap: "wrap-reverse",
                            }}>
                            <Fade enter exit>
                                {hasNotification && <Notification
                                    type={{
                                        style: notification?.type,
                                        icon: true,
                                    }}
                                    closable={true}
                                    onClose={() => props.showNotification(false)}
                                    >
                                    {notification?.msg}
                                </Notification>}
                            </Fade>
                        </NotificationGroup>
                    </BrowserRouter>
                </IntlProvider>
            </LocalizationProvider>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        ...state.profile,
    }
}
    
const mapDispatchToProps = (dispatch) => {
    return {
        onLanguageChange: (localeId) => dispatch(actions.onLanguageChange(localeId)),
    }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(App);

