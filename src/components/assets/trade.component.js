import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
//import TradeFormContext from "../tradeFormContext"
import TradeWebSocketConnection from './trade.websocket';


const Trade = props => {

console.log('Trade', props)
//const { state } = React.useContext(TradeFormContext); 
const history = useHistory();
const [intervalId, setIntervalId ] = useState('');
const [ data, setData ]= useState( props.data)
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
            asset:props.data.asset,
            selectedTicker: '',
            prevSelectedTicker: props.selectedTicker,
            tickerEndpoint: props.exchange.tickerEndpoint
        });

        console.log('exchange' ,props.exchange,props);
        if( props.selectedTicker !== undefined && props.selectedTicker.length < 3){
            return;
        }

        let msg = '';
        if(localStorage.getItem('selectedTicker') === undefined){ 
            localStorage.setItem('selectedTicker',props.selectedTicker);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/depth5:"+props.selectedTicker]});
            console.log('ws_send1',props.selectedTicker)
           // ws_send(msg);
        } else if(props.selectedTicker === localStorage.getItem('selectedTicker')){
            console.log('ws_send2',props.selectedTicker)
        } else if(props.selectedTicker !== localStorage.getItem('selectedTicker')){
            msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/depth5:"+localStorage.getItem('selectedTicker')]});
            console.log('ws_send3',props.selectedTicker)
            //ws_send(msg);
            localStorage.setItem('selectedTicker',props.selectedTicker);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/depth5:"+props.selectedTicker]});
            console.log('ws_send4',props.selectedTicker)
            //ws_send(msg);
        }
        if(props.exchange.name === 'Binance'){
            //msg='';
        }
        let client = [];
        //msg = JSON.stringify({"op": "subscribe", "args":["spot/depth5:"+props.selectedTicker]});

        var exchanges = JSON.parse(localStorage.getItem('exchanges'));
        var exchanged = exchanges.filter(exchange => exchange.name === props.exchange.name)
        var key = exchanged[0].apiKey;
        var apiName = exchanged[0].apiName;
        var secret = exchanged[0].secret;
        console.log('KEY/SECRET',props.selectedTicker,exchanged,key, secret, props.exchange.name,exchanges)
        //return null;
        var timestamp = Date.now().toString();
        var signature = require("crypto")
        .createHmac("sha256", secret)
        .update(timestamp+'#'+apiName+'#bitmart.WebSocket')
        .digest("hex"); //binary, hex,base64


        //var signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(timestamp + "#" + "test001" +  "#bitmart.WebSocket", secret))

        console.log('key,secret,timestamp,signature', timestamp,signature, signature)
        msg = JSON.stringify({"op": "login", "args":[key,timestamp,signature]});


        console.log('TRADE MSG', props,props.setData, data ,msg)
        client[props.exchange.name] = new TradeWebSocketConnection(props,props.setData, data ,msg );
        
        //c//lient.push(ws);
        if(props.exchange.name === 'Bitmart'){

            if(client['Bitmart'].readyState === 1 ){
                // {"op": "subscribe", "args": ["spot/user/order:BTC_ USDT"]}
                msg = JSON.stringify({"op": "subscribe", "args":["spot/user/order:"+props.selectedTicker]});
                client['Bitmart'].send(msg)
            }

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
            let msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/depth5:"+localStorage.getItem('selectedTicker')]});
            
            
            localStorage.setItem('selectedTicker', '');
            var unSubscribe = ["btcusd@miniTicker","ethusd@miniTicker","bnbusd@miniTicker","aadausd@miniTicker","adausd@miniTicker","dogeusdt@miniTicker", "enjusd@miniTicker", "maticusd@miniTicker", "eosusd@miniTicker", "vthousdt@miniTicker", "uniusdt@miniTicker"]
            
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
        // if(data.last_fill_count === undefined){
        //     return null;
        // }
        // if(data.last_fill_price === undefined){
        //     return null;
        // }
        // if(data.last_fill_time === undefined){
        //     return null;
        // }
        // if(data.symbol === undefined){
        //     return null;
        // }
        // if(data.type === undefined){
        //     return null; //order type
        // }
        // if(data.side === undefined){
        //     return null; //buy / sell
        // }
        // if(data.order_id === undefined){
        //     return null;
        // }
        console.log('USER-TRADE',data)
        if(data.asset !== undefined){
            return null;
        }
        console.log('TRADE',data)
        return null;
        return (
            <div className="container" style={{marginTop: '2px', marginBottom: '2px', paddingLeft:'0px'}}>
                
                <ul style={{listStyleType:'none', paddingLeft:'0px'}}>
                {data.asks.map((value, index) => {
                            return <li key={index} style={{whiteSpace:'nowrap'}}><small onClick={onPriceClick} className="text-danger" >{value[0]}</small> <small className="" >{value[1]}</small></li>
                })}
                </ul>
                <ul style={{listStyleType:'none', paddingLeft:'0px'}}>
                {data.bids.map((value, index) => {
                            return <li key={index} style={{whiteSpace:'nowrap'}}><small onClick={onPriceClick} className="text-success">{value[0]}</small> <small className="" >{value[1]}</small></li>
                })}
                </ul>
                
            </div>
        
        );
        
}
export default Trade;