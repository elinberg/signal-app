import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import MarketWebSocketConnection from './market.websocket';

const Market = props => {
const history = useHistory();
const [intervalId, setIntervalId ] = useState('');
const [ data, setData ]= useState( {})
//const [ prevPrice, setPrevPrice ]= useState('0.00')  ;    
let [isOnline] = useState(navigator.onLine);
const setOnline = () => {
    console.log('We are online!');
    isOnline(true);
};
const setOffline = () => {
    console.log('We are offline!');
    //props.selectedTicker='';
    //props.clearTicker();
    history.push('/login?offline=true')
    isOnline(false);
};  
const onPriceClick = e => {
    console.log('Price Click', e.target.innerText);
    let event = {target:{value:e.target.innerText}}
    props.onChangePrice(event);
}
useEffect(() => {
    window.addEventListener('offline', setOffline);
    window.addEventListener('online', setOnline);
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
                secret: '',}];        
        }

        setData({
            name: props.exchange.name,
            apiKey: thisExchange.length > 0 ? thisExchange[0].apiKey: '',
            secret: thisExchange.length > 0 ? thisExchange[0].secret: '',
            url: props.exchange.url,
            asks:[],
            bids:[],
            market:[],
            selectedTicker: '',
            prevSelectedTicker: props.selectedTicker,
            tickerEndpoint: props.exchange.tickerEndpoint
        });

        //console.log('exchange' ,props.exchange,props);
        if(props.selectedTicker.length < 3){
            return;
        }

        let msg = '';
        if(localStorage.getItem('selectedTicker') === undefined){ 
            localStorage.setItem('selectedTicker',props.selectedTicker);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/depth5:"+props.selectedTicker]});
            //console.log('ws_send1',props.selectedTicker)
           // ws_send(msg);
        } else if(props.selectedTicker === localStorage.getItem('selectedTicker')){
            //console.log('ws_send2',props.selectedTicker)
        } else if(props.selectedTicker !== localStorage.getItem('selectedTicker')){
            msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/depth5:"+localStorage.getItem('selectedTicker')]});
            //console.log('ws_send3',props.selectedTicker)
            //ws_send(msg);
            localStorage.setItem('selectedTicker',props.selectedTicker);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/depth5:"+props.selectedTicker]});
            //console.log('ws_send4',props.selectedTicker)
            //ws_send(msg);
        }
        if(props.exchange.name === 'Binance'){
            //msg='';
        }
        let client = [];
        msg = JSON.stringify({"op": "subscribe", "args":["spot/trade:"+props.selectedTicker]});
        //console.log('DEPTH MSG', msg)
        client[props.exchange.name] = new MarketWebSocketConnection(props,setData, data ,msg );
        
        //c//lient.push(ws);
        if(props.exchange.name === 'Bitmart'){

           

        // let iid = setInterval(() =>{
            
        //     if(client['Bitmart'].readyState == 1){
        //         //console.log('DEPTH SENDING:',msg)
        //         client['Bitmart'].send(msg);
        //         clearInterval(iid)
        //     }
        // }, 500);
        // console.log('DEPTH SENT:',msg)

        let iid = setInterval(() =>{
            //console.log('READYSTATE1',client['Bitmart'].readyState)
            if(client['Bitmart'].readyState === 1 ){
                //console.log('PINGIN:','ping')
                client['Bitmart'].send('ping');
                //client['Bitmart'].send(msg);
            } 
        }, 15000);
        setIntervalId(iid);

        }

        
        //console.log('CLIENT', client);
      
        return () => {

            window.removeEventListener('offline', setOffline);
            window.removeEventListener('online', setOnline);
            setData({});
            let msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/trade:"+localStorage.getItem('selectedTicker')]});
            
            
            localStorage.setItem('selectedTicker', '');
            //var unSubscribe = ["btcusd@miniTicker","ethusd@miniTicker","bnbusd@miniTicker","aadausd@miniTicker","adausd@miniTicker","dogeusdt@miniTicker", "enjusd@miniTicker", "maticusd@miniTicker", "eosusd@miniTicker", "vthousdt@miniTicker", "uniusdt@miniTicker"]
            
            //send unsubscrube message here
            //client.send(msg)
            if(client['Bitmart']){
                //client.send(msg)
                clearInterval(intervalId)
            client['Bitmart'].close();
            }
            if(client['Binance']){
                client['Binance'].close();
            }

            
            console.log('Leaving', msg);
        }

},[props.selectedTicker]);
        if(data.market === undefined){
            return null;
        }
        if(data.bids === undefined){
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