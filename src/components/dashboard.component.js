import React, { useEffect } from 'react';

//import { REMOVE_ALERT, SET_ALERT } from "../components/types";
//import { AuthContext } from "../App";
import ExchangeTradeList from "./exchange.trade.component";
//import Trade from "./assets/trade.component";
//import TradeContext from './exchange.tradeForm.component'
//import TradeFormContext from './tradeFormContext'
//import axios from 'axios';

 const Dashboard = (props) => { 
  //const { data , setData, dispatch} = React.useContext(AuthContext);
  //let exchange;
  //const {state} = useContext(TradeFormContext);
  console.log('CONTEXT',props)
 
  useEffect(() => {
   
    
  },[]);
      
 
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
        return ( <ExchangeTradeList />
          
  
        
            
        )

}

export default Dashboard