import React from 'react';
import {  Link } from "react-router-dom";
import { push as Menu } from 'react-burger-menu';
import { AuthContext } from "../App";

export default props => {

    const { state, data, setData, dispatch } = React.useContext(AuthContext);
    const handleStateChange = data => {
        //console.log('Oh Fuck', data)
        setData({isOpen: data.isOpen})  ;
    }
    const closeMenu = () => {
        setData({isOpen: false})  ;
      }

  return (
    <Menu pageWrapId={props.pageWrapId} outerContainerId={props.outerContainerId} styles={props.styles} isOpen={data.isOpen} onStateChange={handleStateChange} className="col-md-2 d-none d-md-block eggplant">
      {props.isAuthenticated && (
                  <Link to="/dashboard" onClick={closeMenu} className="nav-link menu-item">Dashboard</Link>
                )}
                {props.isAuthenticated && (
                  <Link to="/exchanges" onClick={closeMenu} className="nav-link menu-item">Exchanges</Link>
                )}
                {props.isAuthenticated && ( 
                  <Link to="/asset" onClick={closeMenu} className="nav-link menu-item">Assets</Link>
                )}
                {props.isAuthenticated && ( 
                  <Link to="/create" onClick={closeMenu} className="nav-link menu-item">Create Asset</Link>
                )}
                {props.isAuthenticated && ( 
                  <Link to="/edit" onClick={closeMenu} className="nav-link menu-item">Edit Asset</Link>
                )}
    </Menu>
  );
}

