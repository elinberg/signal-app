import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import WebSocketConnection from './spot.websocket';

// let count = 0;
// let prices = [];
// let gains = [];
// let losses = [];
const Spot = props => {
//const { state, dispatch } = React.useContext(AuthContext); 
const history = useHistory();
const [intervalId, setIntervalId ] = useState('');
const [ data, setData ]= useState( {})
//const [ prices, setPrices ]= useState( [])
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

useEffect(()=>{
    //let prices = [];
    // if(props !== undefined && props.selectedTicker !== undefined && props.selectedTicker.length > 0){

    //     if(data.priceStyle==='text-danger'){
    //         //loss
    //         if(losses.length < 14){
    //             losses.push(parseFloat(data.prevPrice)-parseFloat(data.lastPrice))
    //             console.log('Losses',parseFloat(data.prevPrice)-parseFloat(data.lastPrice))
    //         }
            
    //     } else if(data.priceStyle==='text-success'){
    //         if(gains.length < 14){
    //             gains.push(parseFloat(data.lastPrice)-parseFloat(data.prevPrice))
    //             console.log('Gains', parseFloat(data.lastPrice)-parseFloat(data.prevPrice))
    //         }
    //     }

    //     console.log(gains,losses)
    //     if(gains.length == 14 && losses.length == 14){
    //         console.log('GOT HERE')
    //     //let gains = prices.filter(price => price > 0);
    //     console.log('Gains',gains)
    //     let avgGain = (gains) => gains.reduce((a, b) => a + b) / gains.length;
    //     //let losses = prices.filter(price => price < 0);
    //     let avgLoss= (losses) => losses.reduce((a, b) => a + b) / losses.length;
    //     console.log('Losses',losses)
    //     let gain = avgGain(gains);
    //     let loss = avgLoss(losses)
    //     let rs = Math.abs(gain) / Math.abs(loss);
    //     let rsi = 100 - (100 / (1 + rs));
    //     console.log('RSI',rsi);
    //     gains=[];
    //     losses=[]
    //     }
    //     //prices = [];
        

    // } else {
        
    //     count = 0;

    // count++
    // console.log(count);
    // }//if selectedTicker
     
},[data.lastPrice, props.selectedTicker])



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
            high24hr: '',
            low24hr: '',
            open24hr: '',
            volume24hr: '',
            lastPrice:'',
            priceStyle:'' ,
            prevPrice:'0.00' ,
            selectedTicker: '',
            prevSelectedTicker: props.selectedTicker,
            tickerEndpoint: props.exchange.tickerEndpoint
        });

        console.log('exchange' ,props.exchange,props);
        if(props.selectedTicker.length < 3){
            return;
        }

        let msg = '';
        if(localStorage.getItem('selectedTicker') === undefined){ 
            localStorage.setItem('selectedTicker',props.selectedTicker);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/ticker:"+props.selectedTicker]});
            //console.log('ws_send1',props.selectedTicker)
           // ws_send(msg);
        } else if(props.selectedTicker === localStorage.getItem('selectedTicker')){
            //console.log('ws_send2',props.selectedTicker)
        } else if(props.selectedTicker !== localStorage.getItem('selectedTicker')){
            msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/ticker:"+localStorage.getItem('selectedTicker')]});
            //console.log('ws_send3',props.selectedTicker)
            //ws_send(msg);
            localStorage.setItem('selectedTicker',props.selectedTicker);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/ticker:"+props.selectedTicker]});
            //console.log('ws_send4',props.selectedTicker)
            //ws_send(msg);
        }
        if(props.exchange.name === 'Binance'){
            //msg='';
        }
        let client = [];
        client[props.exchange.name] = new WebSocketConnection(props,setData, data ,msg );
        
        //c//lient.push(ws);
        if(props.exchange.name === 'Bitmart'){

        // let iid = setInterval(() =>{
            
        //     if(client['Bitmart'].readyState == 1){
        //         console.log('SENDING:',msg)
        //         client['Bitmart'].send(msg);
        //         clearInterval(iid)
        //     }
        // }, 500);

        let iid = setInterval(() =>{
            //console.log('READYSTATE1',client['Bitmart'].readyState)
            if(client['Bitmart'].readyState === 1 ){
                //console.log('PINGING:','ping')
                client['Bitmart'].send('ping');
                //client['Bitmart'].send(msg);
            } 
        }, 15000);
        setIntervalId(iid)

        }
        
        
        //console.log('CLIENT', client);
      
        return () => {

            window.removeEventListener('offline', setOffline);
            window.removeEventListener('online', setOnline);
            setData({});
            let msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/ticker:"+localStorage.getItem('selectedTicker')]});
            
            
            localStorage.setItem('selectedTicker', '');
            var unSubscribe = ["btcusd@miniTicker","ethusd@miniTicker","bnbusd@miniTicker","aadausd@miniTicker","adausd@miniTicker","dogeusdt@miniTicker", "enjusd@miniTicker", "maticusd@miniTicker", "eosusd@miniTicker", "vthousdt@miniTicker", "uniusdt@miniTicker"]
            
            //send unsubscrube message here
            //client.send(msg)
            if(client['Bitmart']){
                
                //client['Bitmart'].send(msg)
                
                clearInterval(intervalId)
                client['Bitmart'].close();
            }
            if(client['Binance']){
                client['Binance'].close();
            }

            
            console.log('Leaving', msg);
        }

},[props.selectedTicker]);

//console.log(count++) 
        return (
            
            <div className="container" style={{marginTop: '2px', marginBottom: '2px'}}>
                
                 <div onClick={onPriceClick} style={{width:'72%', paddingLeft:'1px',paddingTop:'1px'}} className="float-left"><h6 className={data.priceStyle}>{data.lastPrice}</h6></div>
                <div style={{width:'28%', paddingLeft:'1px'}} className="float-left"><h6> {data.baseAsset}</h6></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', marginTop:'0px' }} className="tiny pt-1 float-left"><small>{data.high24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="tiny-label pt-1 float-left"><small >High</small></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', marginTop:'0px'}} className="tiny float-left"><small>{data.low24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="tiny-label float-left"><small> Low</small></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', color:'', marginTop:'0px' }} className="tiny float-left"><small>{data.open24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="tiny-label float-left"><small>Open</small></div>


                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', color:'', marginTop:'0px'}} className="tiny float-left"><small>{data.volume24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px'}}  className="tiny-label float-left"><small> Volume</small></div>

            </div>
            
        );
        
}
export default Spot;