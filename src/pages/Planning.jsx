
import * as React from 'react';

import { useLocalization } from '@progress/kendo-react-intl';
import { Card, CardHeader, Avatar, CardTitle, CardSubtitle } from '@progress/kendo-react-layout';
import { guid } from '@progress/kendo-react-common';

import { Scheduler } from './../components/Scheduler';

import { employees } from './../resources/employees';
import { images } from './../resources/images';
import { orders, ordersModelFields } from './../resources/orders';
import { teams } from './../resources/teams';
import { getErrorMessage, LOG } from '../logs';
import { useHistory } from 'react-router-dom';
import { getUser, logout } from '../api';
import { NOTIFICATION_TYPES } from '../constants';

const orderEmployees = employees.filter(employee => employee.jobTitle === 'Sales Representative');
const initialFilterState = { };

orderEmployees.forEach(employee => {
    if(employee.fullName === 'Wait Peperell') {
        initialFilterState[employee.id] = false;
    } else {
        initialFilterState[employee.id] = true;
    }
});

const Planning = (props) => {
    const localizationService = useLocalization();
    const [filterState, setFilterState] = React.useState(initialFilterState);
    const [data, setData] = React.useState(orders);

    const onDataChange = React.useCallback(
        ({ created, updated, deleted }) => {
            setData(old => old
                // Filter the deleted items
                .filter((item) => deleted.find(current => current[ordersModelFields.id] === item[ordersModelFields.id]) === undefined)
                // Find and replace the updated items
                .map((item) => updated.find(current => current[ordersModelFields.id] === item[ordersModelFields.id]) || item)
                // Add the newly created items and assign an `id`.
                .concat(created.map((item) => Object.assign({}, item, { [ordersModelFields.id]: guid() }))))
        },
        []
    );

    const onEmployeeClick = React.useCallback(
        (employeeId) => {
            setFilterState({
                ...filterState,
                [employeeId]: !filterState[employeeId]
            });
        },
        [filterState, setFilterState]
    );

    let history = useHistory()
    const {onHasNotification} = props

    React.useEffect(() => {
        if(JSON.parse(localStorage.getItem("isAuth"))){
            getUser().then(user => {
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

    return (
        <div id="Planning" className="planning-page main-content">
            <div className="card-container grid">
                <h3 className="card-title">{localizationService.toLanguageString('custom.teamCalendar')}</h3>
                {

                    orderEmployees.map(employee => {
                        return (
                            <div
                                key={employee.id}
                                onClick={() => onEmployeeClick(employee.id)}
                                style={!filterState[employee.id] ? {opacity: .5} : {}}
                            >
                                <Card style={{ borderWidth: 0, cursor: 'pointer'}}>
                                    <CardHeader className="k-hbox" >
                                        <Avatar type='image' shape='circle' size={'large'} style={{
                                            borderWidth: 2,
                                            borderColor: teams.find(({teamID}) => teamID === employee.teamId).teamColor,
                                        }}>
                                            <div className="k-avatar-image" style={{
                                                backgroundImage: images[employee.imgId + employee.gender],
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center center',
                                            }}
                                            />
                                        </Avatar>
                                        <div>
                                            <CardTitle style={{color: teams.find(({teamID}) => teamID === employee.teamId).teamColor}}>{employee.fullName}</CardTitle>
                                            <CardSubtitle>{employee.jobTitle}</CardSubtitle>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        );
                    })
                }
                <div className="card-component" >
                    <Scheduler
                        data={data.filter(event => filterState[event.employeeID])}
                        onDataChange={onDataChange}
                        modelFields={ordersModelFields}
                        resources={[
                            {
                                name: 'Teams',
                                data: teams,
                                field: 'teamID',
                                valueField: 'teamID',
                                textField: 'teamName',
                                colorField: 'teamColor'
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export default Planning;

