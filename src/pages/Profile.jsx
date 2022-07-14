
import * as React from 'react';
import * as actions from '../store/actions'

import { useLocalization } from '@progress/kendo-react-intl';
import { useHistory } from "react-router-dom";
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';

import { Input } from './../components/form/Input';
import { MaskedTextBox } from './../components/form/MaskedTextBox';
import { DropDownList } from './../components/form/DropDownList';
import { Editor } from './../components/form/Editor';
import { Upload } from './../components/form/Upload';
import { RadioGroup } from './../components/form/RadioGroup';
import { Switch } from './../components/form/Switch';

import { countries } from './../resources/countries';
import { teams } from './../resources/teams';

import { requiredValidator, emailValidator, phoneValidator, biographyValidator } from './../validators'
import {getUser, getUser2, logout, refreshToken} from '../api'
import { NOTIFICATION_TYPES } from '../constants';
import { getErrorMessage, LOG } from '../logs';
import {connect} from 'react-redux'

const countriesData = countries.map(country => country.name);
const teamsData = teams.map(team => ({
    value: team.teamID,
    label: team.teamName
}));

const Profile = (props) => {
        const { onHasNotification } = props;
        const {...formValues} = props
        const localizationService = useLocalization();
        const history = useHistory();

    React.useEffect(() => {
        if(JSON.parse(localStorage.getItem("isAuth"))){
            getUser(3).then(user => {
                    LOG.logNetworkErrors && console.log("getUser", user)
                })
                .catch(err => {
                    // expired or invalid token or cancelled api request
                    LOG.logNetworkErrors && console.log("inside catch {}", err)
                    let token = localStorage.getItem("token")
                    if(err?.response?.status === 400){
                        LOG.logNetworkErrors && console.log("status 400")
                        onHasNotification(NOTIFICATION_TYPES.Error, getErrorMessage(4))
                        logout()
                        history.push('/login')
                    }else if(token === null || token === undefined ){ 
                        LOG.logNetworkErrors && console.log("token null")
                        logout()
                        onHasNotification(NOTIFICATION_TYPES.Error, getErrorMessage(5))
                        history.push('/login')
                    }
                })
        }
    }, [])

        const onSubmit = React.useCallback(
            (dataItem) => {
                props.onProfileChange(dataItem);
                history.push('/');
            },
            [history]
        );

        const onCancelClick = React.useCallback(
            () => {
                history.push('/');
            },
            [history]
        );

        return (
            <div id="Profile" className="profile-page main-content">
                <div className="card-container">
                    <div className="card-component">
                        <Form
                            onSubmit={onSubmit}
                            initialValues={{
                                ...formValues
                            }}
                            render={(formRenderProps) => (
                                <FormElement horizontal={true} style={{ maxWidth: 700 }}>
                                    <Field
                                        id={'avatar'}
                                        name={'avatar'}
                                        label={''}
                                        validator={requiredValidator}
                                        component={Upload}
                                    />
                                    <Field
                                        id={'firstName'}
                                        name={'firstName'}
                                        label={localizationService.toLanguageString('custom.firstName')}
                                        validator={requiredValidator}
                                        component={Input}
                                    />
                                    <Field
                                        id={'middleName'}
                                        name={'middleName'}
                                        label={localizationService.toLanguageString('custom.middleName')}
                                        optional={true}
                                        component={Input}
                                    />
                                    <Field
                                        id={'lastName'}
                                        name={'lastName'}
                                        label={localizationService.toLanguageString('custom.lastName')}
                                        validator={requiredValidator}
                                        component={Input}
                                    />
                                    <Field
                                        id={'email'}
                                        name={'email'}
                                        type={'email'}
                                        placeholder={'e.g.: peter@gmail.com'}
                                        label={localizationService.toLanguageString('custom.email')}
                                        validator={emailValidator}
                                        component={Input}
                                    />
                                    <Field
                                        id={'phoneNumber'}
                                        name={'phoneNumber'}
                                        label={localizationService.toLanguageString('custom.phoneNumber')}
                                        mask={'(+9) 0000-000-00-00'}
                                        validator={phoneValidator}
                                        component={MaskedTextBox}
                                    />
                                    <Field
                                        id={'country'}
                                        name={'country'}
                                        label={localizationService.toLanguageString('custom.country')}
                                        data={countriesData}
                                        component={DropDownList}
                                    />
                                    <Field
                                        id={'biography'}
                                        name={'biography'}
                                        label={localizationService.toLanguageString('custom.biography')}
                                        validator={biographyValidator}
                                        component={Editor}
                                    />
                                    <Field
                                        labelId={'isInPublicDirectoryLabel'}
                                        name={'isInPublicDirectory'}
                                        label={localizationService.toLanguageString('custom.public')}
                                        component={Switch}
                                    />
                                    <Field
                                        labelId={'teamlabel'}
                                        name={'teamId'}
                                        layout={'horizontal'}
                                        label={localizationService.toLanguageString('custom.team')}
                                        component={RadioGroup}
                                        data={teamsData}
                                    />
                                    <hr />
                                    <div className={'k-form-buttons'}>
                                        <Button
                                            onClick={onCancelClick}
                                        >
                                            {localizationService.toLanguageString('custom.cancel')}
                                        </Button>
                                        <Button
                                            primary={true}
                                            type={'submit'}
                                            disabled={!formRenderProps.allowSubmit}
                                        >
                                            {localizationService.toLanguageString('custom.saveChanges')}
                                        </Button>
                                    </div>
                                </FormElement>
                            )}
                        />
                    </div>
                </div>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        ...state.profile
    }
    }
    
    const mapDispatchToProps = (dispatch) => {
    return {
        onLanguageChange: (event) => dispatch(actions.onLanguageChange(event)),
        onProfileChange: (dataItem) => dispatch(actions.onProfileChange(dataItem))
    }
    }
    
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
