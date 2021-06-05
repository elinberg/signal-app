import React from "react";
import { AuthContext } from "../App";
import logo from "../logo.svg";
import {  Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//import Alert from "./alert.component";
import axios from 'axios';
import { useHistory } from "react-router";
import { LOGOUT, SET_ALERT_OVERWRITE } from './types';

export const Nav = () => {
  const { state, dispatch } = React.useContext(AuthContext);
  const history = useHistory();
  
  const onLogout = e => {      
    console.log('Logout');
    localStorage.setItem('token', null);
    
    axios.defaults.headers.common['Authorization'] = null;
    dispatch({
        type: LOGOUT
    })
    dispatch({
        type: SET_ALERT_OVERWRITE,
        payload: {  message:'Logout Successful', alertType: 'success', timeout:3000}
    })
    history.push("/login");
 }

 const onClick = () => {
   if(!state.isOpen){
     dispatch( {type:'MENU_STATE',payload:true})
   }
 }
  return (
    <div>
    
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="">
            <div className="pull-left">
            <a className="navbar-brand" onClick={onClick} href="#" target="" rel="noreferrer">
              <img src={logo} width="30" height="30" alt="CodingTheSmartWay.com" />
            </a>
            <Link to="/dashboard" className="navbar-brand">Order Desk</Link>
            </div>
            <div className="pull-right">
              <ul className="navbar-nav navbar-right pull-right mr-auto">
              
                
                {
                  !state.isAuthenticated ?  <li className="navbar-item pull-right">
                  <Link to="/login" isloggedin="true" className="nav-link">Login </Link>
                </li> : <li className="navbar-item pull-right">
                <Link to="/login" onClick={onLogout} className="nav-link">Log Out</Link>
                </li>
                }
                <li className="navbar-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </ul>
            </div>
            </div>
          </nav>
          
          </div>
          
  );
};

export default Nav;



