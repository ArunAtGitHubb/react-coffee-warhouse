import React from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import App from './App';

import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import { profileReducer } from './store/reducers/profileReducer';


const store = configureStore({
  reducer: {
    profile: profileReducer
  }
})

// const store = createStore(rootReducer) // @deprecated

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
