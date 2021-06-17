import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import SocketFactory from './socket.factory';

const Depth = props => {
const history = useHistory();
const [intervalId, setIntervalId ] = useState('');
const [ data, setData ]= useState( {})
//const [ prevPrice, setPrevPrice ]= useState('0.00')  ;    
 
const onPriceClick = e => {
    console.log('Price Click', e.target.innerText);
    let event = {target:{value:e.target.innerText.split(' ')[0]}}
    props.onChangePrice(event);
}
useEffect(() => {

        //console.log('HANDLESTATE')
  const ex = JSON.parse(localStorage.getItem('exchanges'))
        //console.log('local', ex)
   let thisExchange = ex.filter(exchange => 
            props.exchange.name === exchange.name
        )
        if(thisExchange){ 
        } else {
            thisExchange = [{ 
                name: props.exchange.name,
                apiKey: '',
                secret: ''}];        
        }

        setData({
            name: props.exchange.name,
            apiKey: thisExchange.length > 0 ? thisExchange[0].apiKey: '',
            secret: thisExchange.length > 0 ? thisExchange[0].secret: '',
            url: props.exchange.url,
            depth:[],
            bids:[],
            asks:[],
            selectedTicker: '',
            prevSelectedTicker: props.selectedTicker,
            tickerEndpoint: props.exchange.tickerEndpoint
        });

        //console.log('exchange' ,props.exchange,props);
        if(props.selectedTicker.length < 3){
            return;
        }

        let msg = '';

        
        let client = [];
        msg ='';
        if(props.exchange.name === 'Binance'){
            msg=props.selectedTicker.replace(/_/g,"").toLowerCase()+'@depth5@100ms';
        }
        const config = { Bitmart: {name:'BitmartWebSocket', component:'depth', login:false, url: 'wss://ws-manager-compress.bitmart.com?protocol=1.1'}, Binance: {name:'BinanceWebSocket', component:'depth', login:false, url:'wss://stream.binance.us:9443/ws/'} };
        client[props.exchange.name] =  SocketFactory.createInstance(config[props.exchange.name],  props,{key:'',apiName:'',secret:''}, [], msg , (depth) => {
           //console.log('GOT DEPTH', depth)
            setData({
                ...data,
                ...depth
            });

           
        });
      
    

        
       
      
        return () => {

          
            client[props.exchange.name].close()
            
            
            setData({
                ...data,
                depth: [],
                asks:[],
                bids:[]
            });
            
            
            console.log('Leaving', msg);
        }

},[props.selectedTicker]);
        if(data.asks === undefined){
            return null;
        }
        if(data.bids === undefined){
            return null;
        }
        //console.log('DEPTH',data)
        return (
            
            <div className="container" style={{marginTop: '2px', marginBottom: '2px', paddingLeft:'0px'}}>
                
                <ul className="pt-1" style={{listStyleType:'none', paddingLeft:'0px'}}>
                {data.asks.map((value, index) => {
                            return <li className="tiny" onClick={onPriceClick} key={index} style={{whiteSpace:'nowrap'}}><small  className="text-danger" >{value[0]}</small> <small className="" >{value[1]}</small></li>
                })}
                </ul>
                <ul style={{listStyleType:'none', paddingLeft:'0px'}}>
                {data.bids.map((value, index) => {
                            return <li className="tiny" onClick={onPriceClick} key={index} style={{whiteSpace:'nowrap'}}><small className="text-success">{value[0]}</small> <small className="" >{value[1]}</small></li>
                })}
                </ul>
                
            </div>
            
        );
        
}
export default Depth;