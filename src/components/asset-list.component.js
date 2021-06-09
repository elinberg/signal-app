import React, { useEffect, useState } from 'react';
import SocketFactory from './assets/socket.factory'
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Market from "./assets/market.component";
import axios from 'axios';
import Table from "react-bootstrap/Table";


const _transform = require('./assets/transformer');

 const Asset  = props => {
    console.log('AssetProps', props)
    let style;
    if(props.assets === undefined || props.assets.length < 1){
        return null;
    }
    console.log('AssetProps1', props.assets);
    return (

       

    props.assets.map((asset,i) =>{
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

const onDelete = e => {
    
    console.log(e.target.asset)
    axios.delete( '/api/asset/delete/'+e.target.id)
    .then(res => {
        console.log(res.data);
        
        // dispatch({
        //     type: SET_ALERT_OVERWRITE,
        //     payload: {  message:'Login Successful', alertType: 'success', timeout:10000}
        // })
        // dispatch({
        //     type: SET_ALERT_OVERWRITE,
        //     payload: {  message:'Login Successful', alertType: 'success', timeout:10000}
        // })
        //let history = useHistory();
       //history.push("/asset");
        
    });
} 


const AssetList = props => {
//export default className AssetList extends Component {
    const [intervalId, setIntervalId ] = useState('');
    const [history, setHistory ] = useState({asset:[]});
    const [data, setData ] = useState({asset:[]});
    
    let [ orderTab, setOrderTab ] = useState(0);
    
    // constructor(props) {
    //     super(props);
    //     divis.state = {asset: []};
    // }
    
    var ex = JSON.parse(localStorage.getItem('exchanges'))
    var thisExchange = ex.filter(exchange => 
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
        $('#carousel-'+props.exchange.name).carousel('pause')
        $('#carousel-'+props.exchange.name).on('slide.bs.carousel', function (event) {
            console.log(event.to);
            setOrderTab(event.to)
            if(event.to === 0){
                //listOpenOrders()
            }
            getOrderHistory()
        })

     },[props.selectedTicker,setOrderTab])


     useEffect(() => {
        let mytrades = [];
        let listenKey;
        if(props.selectedTicker === undefined || props.selectedTicker.length < 1){
            return;
        }
        var key = thisExchange[0].apiKey;
        var apiName = thisExchange[0].apiName;
        var secret = thisExchange[0].secret;
        console.log('CREDS',key,apiName,secret)
    
        let client = [];
        setData({
            ...data,
            asset: []
        });
    
        console.log('GETTING TRADES', props, orderTab);
        let transformer = new _transform(props.exchange.name);
        axios.get('/api/'+props.exchange.name+'/trades?status=4&symbol='+props.selectedTicker, {
            headers: {
            'xbmkey': key,
            'xbmname': apiName,
            'xbmsecret': secret
            }
        })
        .then(response => {
            // this.setState({ asset: response.data });
            
            console.log('TRADES DATA' , response.data, props.data,'/api/'+props.exchange.name+'/trades?status=4&symbol='+props.selectedTicker);
            mytrades = transformer.getTrades(response.data.trades,props.selectedTicker)
            /////////
            
            setData({
                ...data,
                asset:mytrades
            });
    
            if(props.exchange.name === 'Binance'){
                listenKey = response.data.listenKey;
                console.log('LISTENKEY', listenKey);
            } else {
                listenKey = '';
            }
           
            const config = { Bitmart: {name:'BitmartWebSocket', component:'orders', login:true, url: 'wss://ws-manager-compress.bitmart.com?protocol=1.1'}, Binance: {name:'BinanceWebSocket', component:'orders', login:false, url:'wss://stream.binance.us:9443/ws/'} };
      
            console.log('Properties',  props , {key:key,apiName:apiName,secret:secret} , mytrades, config)
            client[props.exchange.name] =  SocketFactory.createInstance(config[props.exchange.name],  props,{key:key,apiName:apiName,secret:secret}, mytrades, listenKey, (orders) => {
           
                setData({
                    ...data,
                    asset:orders
                });
                //console.log('CALLBACK DATA', spot);
            });
    
                
        }).catch(function (error){
            console.log(error);
        })
        return () => {
            
            setData({
                ...data,
                asset:[]
            });
            
            client[props.exchange.name].close()
    
            
            console.log('Leaving');
        }
    
    }, [props.selectedTicker, orderTab]);  
 
    


console.log('AssetsList', props);
if(props.data === undefined || props.data.asset === undefined || props.selectedTicker === undefined){
    return ;
}
    
    
    
      //let history = useHistory();
     
const getOrderHistory = () => {
    let mytrades;
    var ex = JSON.parse(localStorage.getItem('exchanges'))
    var thisExchange = ex.filter(exchange => 
        props.exchange.name === exchange.name
    )
    if(thisExchange){ 
    } else {
        thisExchange = [{ 
            name: props.exchange.name,
            apiKey: '',
            secret: ''}];        
    }
    var key = thisExchange[0].apiKey;
    var apiName = thisExchange[0].apiName;
    var secret = thisExchange[0].secret;
    //return null;
    // var timestamp = Date.now().toString();
    // var signature = require("crypto")
    // .createHmac("sha256", secret)
    // .update(timestamp+'#'+apiName+'#bitmart.WebSocket')
    // .digest("hex"); 
    
    
    

    setHistory({
        ...history,
        asset: []
    });

    console.log('GETTING ORDERS', props, thisExchange);
    let transformer = new _transform(props.exchange.name);
    axios.get('http://localhost:4000/'+props.exchange.name+'/trades?status=6&symbol='+props.selectedTicker, {
        headers: {
            xbmkey: key,
            xbmname: apiName,
            xbmsecret: secret
        }
        })
    .then(response => {
       // this.setState({ asset: response.data });
       console.log('ORDERS DATA' , response.data);
       

       mytrades = transformer.getTrades(response.data.trades, props.selectedTicker)
       setHistory({
        ...history,
        asset: mytrades
        });
    })

    console.log('listOrderHistory', history)

}



    //});
    // componentDidMount() {
        // axios.get('http://localhost:4000/asset/')
        //     .diven(response => {
        //         divis.setState({ asset: response.data });
        //     })
        //     .catch(function (error){
        //         console.log(error);
        //     })
    // }
    const listOpenOrders = () => {
    //assetList() {
        console.log('listOpenOrders', props)
        return <Asset data={props.data} assets={props.data.asset} />;

        // return data.asset.map(function(currentAsset, i){
        //     return <Asset asset={currentAsset} key={i} />;
        // })
    }

const listOrderHistory = () => {

        // setHistory({
        //     ...history,
        //     asset: []
        // });

        // console.log('GETTING ORDERS', props, orderTab);
        // let transformer = new _transform(props.exchange.name);
        // axios.get('http://localhost:4000/'+props.exchange.name+'/trades?status=4&symbol='+props.selectedTicker, headers)
        // .then(response => {
        //    // this.setState({ asset: response.data });
        //    console.log('ORDERS DATA' , response.data, props.data);
        //    mytrades = transformer.getTrades(response.data.trades)
        //    setHistory({
        //     ...history,
        //     asset: mytrades
        //     });
        // })

        // console.log('listOrderHistory', props)
        return <Asset data={history} assets={history.asset} />

        // return data.asset.map(function(currentAsset, i){
        //     return <Asset asset={currentAsset} key={i} />;
        // })
    }
    
          
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
            <Asset data={props.data} assets={props.data.asset} />
        </tbody>
    </Table>
    </div>
    <div className="carousel-item">
    <Table size="sm" className="font-face-din fx-11 mb-0" style={{ marginTop: 0 , width:'100%', minWidth:'375px',textAlign:'left' }} >
        <tbody style={{ overflow:'auto'}}>
        <Asset data={history} assets={history.asset} />
        </tbody>
    </Table>
    </div>
    <div className="carousel-item">
    <div size="sm" className="font-face-din fx-11 mb-0" style={{ marginTop: 0 , width:'100%', minWidth:'375px',textAlign:'left' }} >
        <div style={{ overflow:'auto'}}>
        <Market onChangePrice={props.onChangePrice} clearTicker={props.clearTicker}  baseAsset={props.data.baseAsset}  exchange={props.exchange} selectedTicker={props.selectedTicker} prevSelectedTicker={props.prevSelectedTicker}  />
        </div>
    </div>
    </div>
  </div>

</div>
</div>
               
)

}
export default AssetList;