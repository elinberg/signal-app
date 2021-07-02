import React, { useEffect, useState } from 'react';
import SocketFactory from './socket.factory';
import { useHistory } from "react-router";


const Depth = props => {
const history = useHistory();
const [intervalId, setIntervalId ] = useState('');
//const [ data, setData ]= useState( {})
//const [ prevPrice, setPrevPrice ]= useState('0.00')  ;    
 
const onPriceClick = e => {
    console.log('Price Click', e.target.innerText);
    let event = {target:{value:e.target.innerText.split(' ')[0]}}
    props.onChangePrice(event);
}
let client = [];
let [data, setData] = React.useState({})
useEffect(() => {
    if(props === undefined || props.selectedTicker === undefined || props.selectedTicker.length < 1) return
    //console.log("INSTANCE", props.instance)
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
        if(thisExchange === undefined) return
        setData({
            name: props.exchange.name,
            apiKey: thisExchange.length > 0 ? thisExchange[0].apiKey: '',
            secret: thisExchange.length > 0 ? thisExchange[0].secret: '',
            url: props.exchange.url,
            depth:{asks:[],bids:[]},
            bids:[],
            asks:[],
            selectedTicker: '',
            prevSelectedTicker: props.selectedTicker,
            tickerEndpoint: props.exchange.tickerEndpoint
        });

        //console.log('exchange' ,props.exchange,props);
        if(props === undefined && props.selectedTicker === undefined && props.selectedTicker.length < 3){
            return;
        }
        
        //console.log('DEPTH PROPS', props)

        let endpoint = '';

        
       
        let msg ='';
        if(props.exchange.name === 'Binance'){
            endpoint=props.selectedTicker;
        }
        const config = {
        Bitmart: 
        {
            name:'BitmartWebSocket', 
            component:'depth',
            instance:props.instance,
            login:false, 
            subscribe:true, 
            url: 'wss://ws-manager-compress.bitmart.com?protocol=1.1',
            transform: {symbol:['toUpperCase', 'valueOf'],
            stream:'depth5',
            interval:'_1m',
            frequency:''} 
        }, 
        Binance:
            {
            name:'BinanceWebSocket', 
            component:'depth', 
            instance:props.instance,
            login:false,
            subscribe:false, 
            url:'wss://stream.binance.us:9443/ws/',
            transform: {
                symbol:[
                    'toLowerCase',
                    "replace|_"
                ],
                stream:'@depth',
                interval:'5',
                frequency:'@100ms'
            } 
            }
        };
        //console.log("INSTANCE", props.instance)
        client[props.exchange.name] =  SocketFactory.createInstance(
            config[props.exchange.name],
            props,
            {
                key:'',
                apiName:'',
                secret:''
            },
            [],
            endpoint,
            (depth) => {
                if(props.instance === "1"){
                   // console.log("DEPTH DATA", props, depth)
                setData({
                    ...data,
                    asks:depth.asks,
                    bids:depth.bids
                    // exchange:props.data.exchange,
                    // tickers:props.data.tickers,
                    // asset:props.data.asset,
                    // selectedTicker:props.data.selectedTicker
                });
               // console.log("INSTANCE", props)
                }
                
                
            
            

           
             }
         );
      
//         console.log("INSTANCE", props.instance)

        
       
      
        return () => {

           // console.log("INSTANCE", props.instance)
           
            client[props.exchange.name].close()
            client[props.exchange.name]={}
            
            props.setData(
                {
                    ...props.data,
                    depth: [],
                    asks:[],
                    bids:[]
            }   
            );
            
            
            console.log('Leaving', msg);
        }

},[props.selectedTicker]);



//return null
        if(props.selectedTicker === undefined){
            return null;
        }
        if(data.asks === undefined){
            return null;
        }
        if(data.bids === undefined){
            return null;
        }

        //console.log('DEPTH', props, data);
        // if(props.data.asks === undefined){
        //     return null;
        // }
        // if(props.data.bids === undefined){
        //     return null;
        // }
        if(props.instance === "3"){
            //console.log("INSTANCE 2", props, props.data)
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