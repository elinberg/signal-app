import React, {useEffect} from 'react';
import { REMOVE_ALERT, SET_ALERT } from "../components/types";
import { AuthContext } from "../App";
import ExchangeTradeList from "./exchange.trade.component";

 const Dashboard = (props) => { 


    const { state, dispatch } = React.useContext(AuthContext);  
    //const msg = {  message:'Fuck Yeah', alertType: 'success', timeout:10000 } 
    useEffect(() => {
    // dispatch({
    //     type: SET_ALERT,
    //     payload: msg
    // })
    }, []);

        return (
          <div className="float-left">
            <div className="d-flex justify-content-between flex-wrap  align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group mr-2">
                <button className="btn btn-sm btn-outline-secondary">Share</button>
                <button className="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button>
            </div>
            <div className="container" style={{marginTop: '35px', width:'100%'}}></div>
           
          </div>
           <ExchangeTradeList />
        </div>
            
        )

}

export default Dashboard