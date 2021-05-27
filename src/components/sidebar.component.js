import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthContext } from "../App";
import {  Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//import { Container, Row, Col, Nav, Navbar} from "react-bootstrap";

import Alert from "./alert.component";
//import Dashboard from "./dashboard.component";
import Login from "./login.component";
import AssetList from "./asset-list.component";
import EditAsset from "./edit-asset.component";
import CreateAsset from "./create-asset.component";
import Register from "./register.component";
import Dashboard from "./dashboard.component";
import Exchanges from "./exchanges.component";

export const Sidebar = () => {

    const { state, dispatch } = React.useContext(AuthContext);
    let location = useLocation();
    //console.log(location.pathname);
    //const { state, dispatch } = React.useContext(AuthContext);
//     const history = useHistory();
//     const onLogout = e => {      
//       console.log('Logout');
//       localStorage.setItem('token', null);
      
//       axios.defaults.headers.common['Authorization'] = null;
//       dispatch({
//           type: LOGOUT
//       })
//       dispatch({
//           type: SET_ALERT_OVERWRITE,
//           payload: {  message:'Logout Successful', alertType: 'success', timeout:10000}
//       })
//       history.push("/login");
//    }
    return (
        <div className="container-fluid">
        <div className="row"> 
          { state.isAuthenticated  && location.pathname !== '/register' && (<nav className="col-md-2 d-none d-md-block eggplant sidebar">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                
                {state.isAuthenticated && ( <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>)}
                {state.isAuthenticated && ( <li className="navbar-item">
                  <Link to="/exchanges" className="nav-link">Exchanges</Link>
                </li>)}
                {state.isAuthenticated && ( <li className="navbar-item">
                  <Link to="/asset" className="nav-link">Assets</Link>
                </li>)}
                {state.isAuthenticated && ( <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Asset</Link>
                </li>)}
                {state.isAuthenticated && ( <li className="navbar-item">
                  <Link to="/edit" className="nav-link">Edit Asset</Link>
                </li>)}
                
              </ul>
            </div>
          </nav>)}
          
          <main role="main" style={{margingLeft:'unset'}}  className="col-md-9 ml-sm-auto col-lg-10 px-4">
          
          
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/asset" exact component={AssetList} />
          <Route path="/exchanges" exact component={Exchanges} />
          <Route path="/edit" component={EditAsset} />
          <Route path="/create" component={CreateAsset} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register}  />
          </main>
          </div>
    </div>
    )
};
export default Sidebar