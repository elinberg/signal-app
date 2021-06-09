import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import SocketFactory from './socket.factory';

const Market = props => {
const history = useHistory();
const [intervalId, setIntervalId ] = useState('');

const [ data, setData ]= useState( {})
//const [ prevPrice, setPrevPrice ]= useState('0.00')  ;    

const onPriceClick = e => {
    console.log('Price Click', e.target.innerText);
    let event = {target:{value:e.target.innerText}}
    props.onChangePrice(event);
}
useEffect(() => {
   
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
                secret: '',}];        
        }

        setData({
            
            market:[],
            
        });

        //console.log('exchange' ,props.exchange,props);
        if(props.selectedTicker.length < 3){
            return;
        }

 
        let client = [];
        let msg ='';
        if(props.exchange.name === 'Binance'){
            msg=props.selectedTicker.replace(/_/g,"").toLowerCase()+'@aggTrade';
        }
        
        const config = { Bitmart: {name:'BitmartWebSocket', component:'market', login:false, url: 'wss://ws-manager-compress.bitmart.com?protocol=1.1'}, Binance: {name:'BinanceWebSocket', component:'market', login:false, url:'wss://stream.binance.us:9443/ws/'} };
        client[props.exchange.name] =  SocketFactory.createInstance(config[props.exchange.name],  props,{key:'',apiName:'',secret:''}, [], msg , (market) => {
           
            
            data.market.unshift(market)

                if(data.market.length > 9){
                    data.market.splice(9,1);
                }
                //console.log('MarketWS', newState)

                setData({
                    ...data,
                    
                })
        

           
        });


        return () => {
            data.market.splice(0,9)
            setData({
                ...data,
                
            });
    
            client[props.exchange.name].close()
            
     
            console.log('Leaving', msg);
        }

},[props.selectedTicker]);
        if(data.market === undefined){
            return null;
        }
        
        //console.log('MARKET',data)
        let sideClass = '';
        return (
            
            <div className="pull-right" style={{marginTop: '2px', marginBottom: '2px', paddingRight:'35px', width:'160px'}}>
                
                <ul className="pt-1" style={{listStyleType:'none', paddingLeft:'0px'}}>
                {data.market.map((value, index) => {
                    if(value.side === 'buy'){
                        sideClass = 'text-success';
                    } else {
                        sideClass = 'text-danger';
                    }
                            return <li className="tiny" key={index} style={{whiteSpace:'nowrap'}}><small onClick={onPriceClick} className={sideClass} >{value.price}</small> <small className="" >{value.size.split('.')[0]}</small></li>
                })}
                </ul>
                
                
            </div>
            
        );
        
}
export default Market;