import React, {useContext, useEffect, useState} from 'react';
import { REMOVE_ALERT, SET_ALERT } from "../components/types";
import { AuthContext } from "../App";
import ExchangeTradeList from "./exchange.trade.component";
//import Trade from "./assets/trade.component";
import TradeContext from './exchange.tradeForm.component'
import TradeFormContext from './tradeFormContext'
import axios from 'axios';

 const Dashboard = (props) => { 
  const { data , setData} = React.useContext(AuthContext);
  //let exchange;
  //const {state} = useContext(TradeFormContext);
  console.log('CONTEXT',props)

    //const { tradeFormContext } = React.useContext(TradeFormContext);  
    //console.log(tradeFormContext);
    //const { state, selectedTicker } = tradeFormContext;

    //const data = state;
    //const msg = {  message:'Fuck Yeah', alertType: 'success', timeout:10000 } 
    //const { exchange , setExchange} = React.useState({exchange:[]});
//     useEffect(() => {
      
//       axios.get('/api/exchange/')
//           .then(response => {
//               //this.setState({ asset: response.data });
              
//                 setData({
//                   ...data,
//                   exchange: response.data
//                 });
//                 //setExchange(response.data)
//           })
//           .catch(function (error){
//               console.log(error);
//           })
//       }, []);
// console.log('AXIOS', data)
        return (
          
          <div className="float-left">
            <div className="d-flex justify-content-between flex-wrap  align-items-center pt-3 pb-0 mb-3 border-bottom">
            <h1 className="h2">Dashboard </h1>
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