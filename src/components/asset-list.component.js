import React, { useEffect, useState } from 'react';
import SocketFactory from './assets/socket.factory'
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Market from "./assets/market.component";
import axios from 'axios';
import Table from "react-bootstrap/Table";
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
const Decompress = require("./assets/decompress").Decompress;

const _transform = require('./assets/transformer');

const openOrders  = props => {
    
    let endpoint;
    //const [data, setData ] = useState({asset:[]});
    const decompress =  new Decompress(); //decompression class
    //console.log('OpenOrders', props)
    let style;
    const client = []

    var orders = []
    var key = props.exchange[0].apiKey;
    var apiName = props.exchange[0].apiName;
    var secret = props.exchange[0].secret;
    var listenKey = '';
    const [orderHistory, setOrderHistory ] = useState({asset:[]});
    useEffect(()=>{
        
        if( 
            props === undefined ||
            props.exchange === undefined ||
            props.selectedTicker === undefined ||
            props.data === undefined ||
            props.data.name === undefined ||
            orderHistory === undefined 
            
    ){
        return null;
    }

    if(props.selectedTicker.length < 1 || props.data.name.length < 1 ) return null

        //console.log('CREDS',key,apiName,secret)

        props.setData({
            ...props.data,
            asset: []
        });
    
        //console.log('GETTING TRADES', props);
        if(props.selectedTicker === undefined || props.selectedTicker.length < 1){
            return null
        }

       // console.log('GETTING TRADES 2', '/api/'+props.data.name+'/trades?status=4&symbol='+props.data.selectedTicker);
        // 
        let transformer = new _transform(props.data.name);
        axios.get('/api/'+props.data.name+'/trades?status=4&symbol='+props.selectedTicker.replace("_",""), {
            timeout:5000,
            headers: {
            'xbmkey': key,
            'xbmname': apiName,
            'xbmsecret': secret
            }
        })
        .then(response => {
            // this.setState({ asset: response.data });
            let listenKey
            listenKey = response.data.listenKey
            // console.log('TRADES DATA' , 
            //     response.data,
            //     props.data,
            //     '/api/'+props.data.name+'/trades?status=4&symbol='+props.selectedTicker.toUpperCase()
            //  );
            endpoint=props.selectedTicker
            orders = transformer.getTrades(response.data,props.selectedTicker)
            // console.log('TRADES ORDERS' , 
            //     orders,
            //     response
            //  );
            if(props.data.name === 'Binance' &&
            response.data.listenKey !== undefined &&
            props.selectedTicker !== undefined){
                console.log('LISTENKEY 69', props.data.name,props.selectedTicker,response.data.listenKey);
                endpoint = response.data.listenKey;
                listenKey = response.data.listenKey;
               // console.log('LISTENKEY', props.data.name+'|'+response.data.listenKey);
                
            } else if(props.data.name === 'Bitmart'){
                endpoint = props.data.selectedTicker.toUpperCase()
            }
            
            if(props.data.name === 'Binance' && response.data.listenKey === undefined){
                endpoint = '';
                console.log('WARNING LISTENKEY', props.data.selectedTicker,response.data.listenKey);
            }
            console.log('91',props)
            
            props.setData({
                ...props.data,
                asset:orders
            });
         //}) //ERIC
         //console.log('ENDPOINT XS', endpoint)
        const config = { 
        Bitmart: {
            name:'BitmartWebSocket', 
            component:'orders', 
            instance:0,
            subscribe:true,
            login:true, 
            url: 'wss://ws-manager-compress.bitmart.com?protocol=1.1',
            transform: {
                symbol:['toLowerCase', 'valueOf'],
                stream:'orders',
                interval:'',
                frequency:''
            } 
        }, 
        Binance: {
            name:'BinanceWebSocket', 
            component:'orders', 
            instance:0,
            login:false, 
            subscribe:true,
            url:'wss://stream.binance.us:9443/ws/',
            transform: {
                symbol:[
                    'toLowerCase',
                    "replace|_"
                ],
                stream:'order',
                interval:'',
                frequency:''
            } 
        }
        }
      
       
        // {selectedTicker:props.selectedTicker},
        // {key:key,apiName:apiName,secret:secret} ,
        // orders,
        //     config
        // )
       // if(client[props.data.name] !== undefined) return
       // console.log('ENDPOINT XS', endpoint)
        client[props.data.name] = SocketFactory.createInstance(
            config[props.data.name],
            {selectedTicker:props.selectedTicker,tickers:props.tickers},
            {
                key:key,
                apiName:apiName,
                secret:secret
            },
            orders,
            endpoint,
            (orders) => {
                props.setData({
                    ...props.data,
                    asset:orders
                }
                );
            //console.log('CALLBACK DATA', spot);
        });

        })


    // let  messageEvent = fromEvent(client[props.data.name].client, 'message');
    // let  blobEvent = messageEvent.pipe(filter( event => event.data instanceof Blob ));
    // blobEvent.subscribe( ev=> {
    //     console.log('BLOB EVENT MESSAGE', ev.data)
    //     let json = ev.data;
    //     let unzipped;
    //     decompress.unzip(json,(err, buffer) => {
    //             if(buffer === undefined){
    //                 return ;
    //             }
    //     json =  JSON.parse(buffer.toString('UTF-8'));
    //     console.log('UNZIP EVENT MESSAGE', json)
    //     })
        
    // }); 
    return(()=>{
        let ords=[]
        props.setData({...props.data,orders:ords})
        if(client[props.data.name] !== undefined) client[props.data.name].close()
        
        console.log('Leaving')
    })

    },[props.selectedTicker])


    //console.log('OpenOrders1', props.data.asset, props);
    return (

    props.data.asset.map((asset,i) =>{
        if( asset.state !== undefined && asset.state === 'CANCELED'){
            style = {textDecoration: 'line-through'}
        } else {
            style = {};
        }
        return  (
            <tr style={style} key={i}>
                <td  className={ asset.side ==='buy' ? 'text-success' : 'text-danger' }>{asset.pair !== undefined ? asset.pair.replace(/_/g,"/") : ''}</td>
                <td style={{textTransform: 'capitalize', whiteSpace:'nowrap'}} className=" ">{asset.price} {asset.order_type !== undefined ? asset.order_type :''}</td>
                <td className="">{asset.qty !== undefined ? asset.qty : ''} </td>
                <td style={{}} className="">{asset.cost} {asset.base}</td> 
                 <td style={{}} className="">{asset.transaction_date}</td>
            </tr>
            )
    })
    )
    
}

//// END OPENOPDERS

 const Asset  = props => {
    const decompress =  new Decompress(); //decompression class
    //console.log('AssetProps', props)
    let style;
    if(props.assets === undefined || props.assets.length < 1){
        return null;
    }
   // console.log('AssetProps1', props.assets);
    return (

       

    props.assets.map((asset,i) =>{
        if( asset.state !== undefined && asset.state === 'CANCELED'){
            style = {textDecoration: 'line-through'}
        } else {
            style = {};
        }
        return  (
            <tr style={style} key={i}>
                <td  className={ asset.side ==='buy' ? 'text-success' : 'text-danger' }>{asset.base !== undefined ? asset.base : ''}</td>
                <td style={{textTransform: 'capitalize', whiteSpace:'nowrap'}} className=" ">{asset.price} {asset.order_type !== undefined ? asset.order_type :''}</td>
                <td className="">{asset.qty !== undefined ? asset.qty : ''} </td>
                <td style={{}} className="">{asset.cost} {asset.base}</td> 
                 <td style={{}} className="">{asset.transaction_date}</td>
            </tr>
            )
    })
    )
    
}

////END ASSET

const OrderHistory = (props) => {
    // const [orderHistory, setOrderHistory ] = useState({asset:[]});
    const [fetched, setFetched] = React.useState(false);
    var histories = []  
    //const decompress =  new Decompress(); //decompression class
   


    
    var key = props.exchange[0].apiKey;
    var apiName = props.exchange[0].apiName;
    var secret = props.exchange[0].secret;

    useEffect(() => {
    if( 
        
        props === undefined ||
        props.selectedTicker === undefined ||
        props.data === undefined ||
        props.data.name === undefined 
        // props.data.name.length < 1||
        // props.selectedTicker.length < 1 
    ){
        return null;
    }

    if( 
        props.data.name.length < 1||
        props.selectedTicker.length < 1 
    ){
        return null;
    }



    //console.log('OrderHistory', props)
    if(props.setOrderHistory === undefined) return
    props.setOrderHistory({
        ...orderHistory,
        asset: []
    });
    
    //console.log('GETTING ORDERS', props.exchange||'', props.data||'');
    let transformer = new _transform(props.data.name);
    const ac = new AbortController();
    Promise.all([
    axios.get('http://localhost:4000/'+props.data.name+'/trades?status=6&symbol='+props.selectedTicker, {
        headers: {
            xbmkey: key,
            xbmname: apiName,
            xbmsecret: secret
        }
        })
    .then(response => {
       // this.setState({ asset: response.data });
       //console.log('ORDERS DATA' , response.data);
       histories= transformer.getTrades(response.data.trades, props.selectedTicker)
            
                setOrderHistory({
                ...orderHistory,
                asset: histories
                });
    })]).then(() => { 
        setFetched(true);
        return function cancel() {
            console.log('ABORTING')
            ac.abort()
          }
    }, [props.data.name,props.selectedTicker])
    
        

    return (() => {
        props.setOrderHistory({})
          // Abort fetches on unmount
        
       // return fetched;
    })
    


    }   , [props.selectedTicker]);  
    
    let style;
    if(props.data === undefined || props.data.orderHistory === undefined) return null;
    //console.log('listOrderHistory', props.data.orderHistory, props.data,props)
    return (

        props.data.orderHistory.asset.map((asset,i) =>{
            if( asset.state !== undefined && asset.state === 'CANCELED'){
                style = {textDecoration: 'line-through'}
            } else {
                style = {};
            }
            return  (
                <tr style={style} key={i}>
                    <td  className={ asset.side ==='buy' ? 'text-success' : 'text-danger' }>{asset.pair !== undefined ? asset.pair.replace(/_/g,"/") : ''}</td>
                    <td style={{textTransform: 'capitalize', whiteSpace:'nowrap'}} className=" ">{asset.price} {asset.order_type !== undefined ? asset.order_type :''}</td>
                    <td className="">{asset.qty !== undefined ? asset.qty : ''} </td>
                    <td style={{}} className="">{asset.cost} {asset.base}</td> 
                     <td style={{}} className="">{asset.transaction_date}</td>
                </tr>
                )
        })
        )
   
}
//END OrderHistory
const AssetList = props => {
//export default className AssetList extends Component {
   // const [intervalId, setIntervalId ] = useState('');
   // const [orderHistory, setOrderHistory ] = useState({asset:[]});
    //const [data, setData ] = useState({asset:[]});
    //const [socket, setSocket ] = useState({wss:[], exchange:{}});
    
    let [ orderTab, setOrderTab ] = useState(0);
    

    
    var ex = JSON.parse(localStorage.getItem('exchanges'))
    const thisExchange = ex.filter(exchange => 
        props.exchange.name === exchange.name
    )
    if(thisExchange){ 
    } else {
        thisExchange = [{ 
            name: props.exchange.name,
            apiKey: '',
            secret: ''}];        
    }
    useEffect(() => {
        if( orderTab === undefined || props === undefined || props.exchange === undefined || props.exchange.name.length < 1){
            return null
        }
        //const t=props.selectedTicker||''
        $('#carousel-'+props.exchange.name).carousel('pause')
        $('#carousel-'+props.exchange.name).on('slide.bs.carousel', function (event) {
            console.log(event.to);
            setOrderTab(event.to)
            if(event.to === 0){
                //listOpenOrders()
            }
            
        })

        
        return () => {
            
            console.log('Leaving');
        }
    
    }, [orderTab, props.exchange.name]); 
     

          
        return (
 <div className="font-face-din fx-12" style={{width:'100%', maxHeight:'196px', overflow:'scroll', overflowY:'scroll'}} >
<div id={'carousel-'+props.exchange.name}  className="carousel slide">

  <ol className="carousel-indicators carousel-indicators-numbers">
    <li data-target={'#carousel-'+props.exchange.name}  data-slide-to="0" className="active">Open Orders</li>
    <li data-target={'#carousel-'+props.exchange.name}  data-slide-to="1" className="">Order History</li>
    <li data-target={'#carousel-'+props.exchange.name}  data-slide-to="2">Market Trades</li>
  </ol>


  <div className="carousel-inner" role="listbox">
    <div className="carousel-item active">
    <Table size="sm" className="font-face-din fx-11 mb-0" style={{ marginTop: 0 , width:'100%', minWidth:'375px',textAlign:'left' }} >
        <tbody style={{ overflow:'auto'}}>
            {openOrders( {exchange:thisExchange, data:props.data, setData:props.setData, selectedTicker:props.selectedTicker, tickers:props.tickers } )}
            
        </tbody>
    </Table>
    </div>
    <div className="carousel-item">
    <Table size="sm" className="font-face-din fx-11 mb-0" style={{ marginTop: 0 , width:'100%', minWidth:'375px',textAlign:'left' }} >
        <tbody style={{ overflow:'auto'}}>
        <OrderHistory exchange={thisExchange}  data={props.data} selectedTicker={props.selectedTicker}  />
        </tbody>
    </Table>
    </div>
    <div className="carousel-item">
    <div size="sm" className="font-face-din fx-11 mb-0" style={{ marginTop: 0 , width:'100%', minWidth:'375px',textAlign:'left' }} >
        <div style={{ overflow:'auto'}}>
        <Market instance="0" onChangePrice={props.onChangePrice}  baseAsset={props.data.baseAsset}  exchange={props.exchange} selectedTicker={props.selectedTicker} prevSelectedTicker={props.prevSelectedTicker}  />
        </div>
    </div>
    </div>
  </div>

</div>
</div>
               
)

}
export default AssetList;