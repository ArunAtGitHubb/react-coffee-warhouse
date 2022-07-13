import * as actions from '../actions'
import { countries } from '../../resources/countries'
import { LOG } from '../../logs'

const initialState = {
    localeId: 'en-US',
    firstName: 'Peter',
    lastName: 'Douglas',
    middleName: '',
    email: 'peter.douglas@progress.com',
    phoneNumber: '(+1) 8373-837-93-02',
    avatar: null,
    country: countries[33].name || "Not Available",
    isInPublicDirectory: true,
    biography: '',
    teamId: 1
}

export const profileReducer = (state = initialState, action) => {
    switch(action.type){
        case actions.CHANGE_LANGUAGE: 
            return{
                ...state,
                localeId: action.localeId
            }
        case actions.CHANGE_PROFILE:
            LOG.logGeneral && console.log("in reducer", action.dataItem, state)
            let dataItem = action.dataItem
            return{
                ...state,
                ...dataItem
            }
        default:
            return state
    }
}