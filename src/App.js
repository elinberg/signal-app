import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'

import Alert from "./components/alert.component";
import Nav from "./components/nav.component";
import Sidebar from "./components/sidebar.component";

import {v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT, LOGIN, LOGOUT, SET_ALERT_OVERWRITE} from "./components/types";


export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  username: null,
  token: null,
  message: null,
  alerts: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("token", action.payload.token);
      const ls = localStorage.getItem('exchanges') ? localStorage.getItem('exchanges') : false;
      console.log('exchanges', ls)
      if(ls === false){
          localStorage.setItem('exchanges',JSON.stringify([]));
      }
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        token: action.payload.token
      };
      case SET_ALERT:
      //console.log('Message',action.payload)
      state.alerts.push({message:action.payload.message,
        alertType: action.payload.alertType,
        timeout: action.payload.timeout,
        id: uuid()});
      return {
        ...state,
        message: action.payload.message,
        alerts:state.alerts
      };
      case SET_ALERT_OVERWRITE:
      //console.log('Message',action.payload)
      state.alerts=[];
      state.alerts.push({message:action.payload.message,
        alertType: action.payload.alertType,
        timeout: action.payload.timeout,
        id: uuid()});
      return {
        ...state,
        message: action.payload.message,
        alerts:state.alerts
      };
      case REMOVE_ALERT:
        //console.log('Remove Alert',action.payload, state)
        
        return {
          ...state,
          message: '',
          alerts:state.alerts.filter(alert => alert.id !== action.payload)
        };
    case 'START_SPOT':
        //console.log('Remove Alert',action.payload, state)
        
        return {
          ...state,
          ticker: action.payload.ticker
        };
    case LOGOUT:
      //localStorage.clear();
      localStorage.setItem('token', '')
      return {
        ...state,
        isAuthenticated: false,
        username: null
      };
    default:
      return state;
  }
};



//console.log('Store New State',store.getState())


  

  function App() {
    //let nav;
    window.$prevPrice = '0.00'
    //console.log('Store State',this.props.store.getState())
    const [state, dispatch] = React.useReducer(reducer, initialState);
    //console.log('App store 1',this.props.authenticated);
    //var isLoggedIn = this.props.store.getState();

    return (
      <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      
      <Router>
        <div className="App">     
          <Alert />
          <Nav /> 
          <Sidebar />
          <br/>
          
        </div>
      </Router>
      
      </AuthContext.Provider>
    );
  
}



export default App;

