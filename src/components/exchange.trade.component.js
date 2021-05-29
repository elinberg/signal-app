import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router";
import {SET_ALERT_OVERWRITE} from './types';
import { AuthContext } from "../App";
import ExchangeTradeForm from "./exchange.tradeForm.component"
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
 export const Exchange  = props => {
const [key, setKey] = useState('buy');
const [prev, setPrev] = useState('sell');
const onSelect = k => {
    console.log('onSelect',k)
    if(k == 'buy'){
        setPrev('sell')
    } else {
        setPrev('buy')
    }
    setKey(k)
}

useEffect(() => {


}, []);
    

return (
    
    <div className="card" style={{float:'left', width: '24rem', marginRight:'10px'}}>
        
        <div style={{paddingLeft:'5px', paddingRight:'5px'}} className="card-body">
            <h5 className="card-title">{props.exchange.name} </h5>
            <Tabs defaultActiveKey="buy" 
                id={'buy-sell-tab-'+props.exchange.name}  onSelect={onSelect} className="nav nav-pills nav-justified nav-fill">
                <Tab className="tab" data-toggle="tab" eventKey="buy" title="Buy" tabClassName="">
                {/* <ExchangeTradeForm exchange={props.exchange} /> */}
                </Tab>
                <Tab className="tab" data-toggle="tab" eventKey="sell" title="Sell" tabClassName="">
                {/* <ExchangeTradeForm exchange={props.exchange} />  */}
                </Tab>
            </Tabs>
            <ExchangeTradeForm onTabSelect={onSelect} prev={prev} setTab={setKey} tab={key} exchange={props.exchange} /> 
            {/* <div class="btn-group" style={{width:'100%'}} role="group" aria-label="Buy or Sell">
                <button type="button" class="btn btn-primary btn-block btn-sm mt-0 active">Buy</button>
                <button type="button" class="btn btn-secondary btn-block btn-sm mt-0">Sell</button>
            </div> */}
            {/* <div>
                <div className="col-sm-12" eventKey="buy" title="Buy" tabClassName="">
                <ExchangeTradeFormBuy exchange={props.exchange} />
                </div>
                <div className="col-sm-12" eventKey="sell" title="Sell" tabClassName="">
                <ExchangeTradeFormBuy exchange={props.exchange} /> 
                </div>
            </div> */}
            
        </div>
    </div>
    )

    
}


const ExchangeTradeList = props => {

    //const { data, setData } = React.useContext(AuthContext);

    const initialState = {
        exchange: [],
        showModal: 'none'
      };

    const [data, setData] = React.useState(initialState);
    
      let history = useHistory();

// if(props.exchange === undefined){
//     return null;
// }
console.log('ExchangeTradeList', data)
    //useEffect(() => {
        useEffect(() => {
           
         axios.get('/api/exchange/')
             .then(response => {
                 //this.setState({ asset: response.data });
                 console.log('GET EX',response.data, data)
                setData({
                    ...data,
                    exchange: response.data,
                    showModal: 'none'
                  });
             })
             .catch(function (error){
                 console.log(error);
             })

            return () => {
                 setData({})
             }

         }, []);
    //console.log('isData', data)
    const [isOpen, setIsOpen] = React.useState(false);
    //const [hideModal, setHideModal] = React.useState({});
    const [exchange, setExchange] = React.useState({});
    //const [exchange, setExchange] = React.useState(props.exchange);
    const [title, setTitle] = React.useState("Transitioning...");
    const [url, setUrl] = React.useState("");
    //const [time, setTime] = React.useState("");
    const { dispatch } = React.useContext(AuthContext);
    const showModal = props => {
        //document.getElementById('exchangeModal').setAttribute('show', true);
        setIsOpen(true);
        setTitle(props.exchange.name);
       // setExchange(props.exchange)
        //setUrl(props.exchange.url)
        //setHideModal(hideModal);
 
    };
    const hideModal = () => {
        //document.getElementById('exchangeModal').setAttribute('show', true);
        setIsOpen(false);
        setTitle('')
    };
    
    async function asyncAxios(currentExchange) {
        var config = {
            method: 'get',
            withCredentials: true,
            url: currentExchange.url+'/time', 
            data : {}
          };
        try {
        const response = await axios(config);
        return response.data;
        }
        catch (error) {
            console.log(error);
        }
        
    }


    const listExchange = () => {
        console.log('ListEx', data)
        return data.exchange.map(function(currentExchange, i){
           
            //setData(data)
             console.log('DATA',currentExchange);
            var datas = '';
            
            // var config = {
            //     method: 'get',
            //     withCredentials: true,
            //     url: currentExchange.url+'/time', 
            //     data : {}
            //   };
            //   let {data} =  axios(config);
            // asyncAxios(currentExchange).then(function(response) {
            //     console.log('Time',response.serverTime);
            //     //dispatch('SET_TIME',response.serverTime)
            //     //currentExchange.serverTime = response.serverTime;
                
            //   });
              //console.log('FFFF',props)
            
              return <Exchange title={currentExchange.name} hideModal={hideModal} setUrl={setUrl} setTitle={setTitle} showModal={showModal} setIsOpen={setIsOpen} exchange={currentExchange} key={i} />;
            
            
        })
    }

  if( data === undefined){
        return null;
  }
  return (
    <div className="container" style={{marginTop: '10px', width:'100%'}}>
        
        {listExchange()}

        {/* <ModalExchange id="exchangeModal" setExchange={setExchange} exchange={exchange} title={title} url={url} setUrl={setUrl} setTitle={setTitle} isOpen={isOpen} show={true} hideModal={hideModal} showModal={showModal} tabindex="-1"></ModalExchange>    */}
    </div>
    
  );

}
export default ExchangeTradeList;