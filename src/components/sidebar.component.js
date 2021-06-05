import React from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "../App";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//import { Container, Row, Col, Nav, Navbar} from "react-bootstrap";

//import Dashboard from "./dashboard.component";
import Login from "./login.component";
import AssetList from "./asset-list.component";
import EditAsset from "./edit-asset.component";
import CreateAsset from "./create-asset.component";
import Register from "./register.component";
import Dashboard from "./dashboard.component";
import Exchanges from "./exchanges.component";
import TopMenu from "./menu.component";

export const Sidebar = props => {

    const { state, data } = React.useContext(AuthContext);
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



var styles = {
  width:'196px',
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: '14px',
    top: '72px'
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    minWidth:'230px'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}

var isOpen = open => {
  if(open === undefined){
    return false;
  }
  return open;
}
var isMenuOpen = function(state) {
  console.log('SIDEBAR MENU STATE',state)
  return state;
};

    return (
        <div id="outer-container" className="container-fluid" style={{width:'100%'}}>
        <div  className="row"> 
        
          { state.isAuthenticated  && location.pathname !== '/register' && (
          <TopMenu pageWrapId={ "main" } outerContainerId={ "outer-container" } styles={styles}  onStateChange={isMenuOpen}  isOpen={data.isOpen }  isAuthenticated={state.isAuthenticated} />)}
          <main id="main"  role="main" style={{marginLeft:'unset'}}  className="col-md-12 ml-sm-auto col-lg-12 mt-3 px-0">
          <Route path="/dashboard" exact render={ () => <Dashboard isOpen={isOpen} />} />
          <Route path="/asset" exact render={ props => <AssetList showHeading={true} />} />
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