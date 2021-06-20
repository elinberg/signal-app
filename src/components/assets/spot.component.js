import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { throwError } from 'rxjs';
import SocketFactory from './socket.factory';

// let count = 0;
// let prices = [];
// let gains = [];
// let losses = [];
let endpoint;
const Spot = props => {
//const { state, dispatch } = React.useContext(AuthContext); 
const history = useHistory();
const [intervalId, setIntervalId ] = useState('');
const [ data, setData ]= useState( {})
//const [ prices, setPrices ]= useState( [])
//const [ prevPrice, setPrevPrice ]= useState('0.00')  ;    



const onPriceClick = e => {
    console.log('Price Click', e.target.innerText);
    let event = {target:{value:e.target.innerText}}
    props.onChangePrice(event);
}

//useEffect(()=>{
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
     
//},[data.lastPrice, props.selectedTicker])



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
                secret: '',}];        
        }
        setData({
            ...data,
            spot:{
            high24hr: '',
            low24hr: '',
            open24hr: '',
            volume24hr: '',
            lastPrice:'',
            priceStyle:'' ,
            prevPrice:'0.00' ,
         
        }});

       

        
        // if(props.selectedTicker.length < 3 && props.selectedTicker !== undefined){
        //     //return;
        // }

        
console.log('PROPS', props)
        if(props.exchange.name === 'Binance' && props.selectedTicker !== undefined && props.selectedTicker.length > 0){
            endpoint=props.selectedTicker.replace(/_/g,"").toLowerCase()+'@miniTicker';
        } else {
            endpoint  =props.selectedTicker
            if(endpoint.length < 1)return
            console.log('GOT HERE', endpoint)
        }
        let client = [];
       // client[props.exchange.name] = new WebSocketConnection(props,setData, data ,msg );
       let prevPrices=[];
        const config = { Bitmart: {name:'BitmartWebSocket', component:'ticker', login:false, url: 'wss://ws-manager-compress.bitmart.com?protocol=1.1'}, 
        Binance: {name:'BinanceWebSocket', component:'ticker', login:false, url:'wss://stream.binance.us:9443/ws/'+endpoint} };
        
       
        client[props.exchange.name] =  SocketFactory.createInstance(config[props.exchange.name],  props,{key:'',apiName:'',secret:''}, prevPrices, endpoint , (spot) => {
            
            props.PriceCallback(spot.lastPrice)
            
            
            setData({
                ...data,
                spot:spot
            });

            
            //console.log('CALLBACK DATA', spot);
        });
 
       

        return () => {
            
            setData({
                ...data,
                spot:{
                high24hr: '',
                low24hr: '',
                open24hr: '',
                volume24hr: '',
                lastPrice:'',
                priceStyle:'' ,
                prevPrice:'0.00' ,
             
            }});

            client[props.exchange.name].close()
            console.log('LEAVING')
        }; 

},[props.selectedTicker]);
if(data === undefined || data.spot  === undefined|| data.spot.priceStyle  === undefined  ){
    return null;
}


//console.log(count++) 
        return (
            
            <div className="container" style={{marginTop: '2px', marginBottom: '2px'}}>
                
                 <div onClick={onPriceClick} style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', height:'23px'}} className="float-left"><h6 className={data.spot.priceStyle}>{data.spot.lastPrice}</h6></div>
                <div style={{width:'28%', paddingLeft:'1px'}} className="float-left"><h6> {data.spot.baseAsset}</h6></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', marginTop:'0px' }} className="tiny pt-1 float-left"><small>{data.spot.high24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="tiny-label pt-1 float-left"><small >High</small></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', marginTop:'0px'}} className="tiny float-left"><small>{data.spot.low24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="tiny-label float-left"><small> Low</small></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', color:'', marginTop:'0px' }} className="tiny float-left"><small>{data.spot.open24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="tiny-label float-left"><small>Open</small></div>


                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', color:'', marginTop:'0px'}} className="tiny float-left"><small>{data.spot.volume24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px'}}  className="tiny-label float-left"><small> Volume</small></div>

            </div>
            
        );
        
}
export default Spot;