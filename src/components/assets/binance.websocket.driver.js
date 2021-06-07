const Decompress = require("./decompress").Decompress;
const RobustWebSocket = require('robust-websocket');
//import BitmartWebSocket  from './bitmart.websocket.driver';
const _transform = require('./transformer')
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export default class BinanceWebSocket  {
    constructor(  config, props, credentials, trades){

        let symbol = props.selectedTicker;
        this.client = new RobustWebSocket(config.url, null, {
            timeout: 600000,
            shouldReconnect: function(event, ws) {
                console.log('Reconnecting')
                if (event.code === 1008 || event.code === 1011) return
                return [0, 3000, 10000][ws.attempts]
            }
            }
        ) 
        this.name = 'Binance';
        this.login = config.login || false;
        this.trades = trades || [] ;
        this.ping_id = 0 ;
        this.ping_time = 1000000
        this.symbol =  props.selectedTicker || 'DOGEUSDT';
        this.url = config.url || 'wss://stream.binance.us:9443/ws/';
        this.client.binaryType = 'blob'; //blob / text
        this.pingIn =  'ping';
        this.pingOut =  'pong';
        this.subscribeMessage = this.getSubscribeMessage(symbol);
        this.unsubscribeMessage = this.getUnsubscribeMessage(symbol);
        //this.loginMessage = this.getLoginMessage(symbol);
        this.transformer =  new _transform(this.name);
        this.decompress =  new Decompress(); //decompression class
        this.key = credentials.key;
        this.secret = credentials.secret;
        this.apiName = credentials.apiName;
        this.client.addEventListener('open', function(event){
            console.log("RAW OPEN S B O", typeof event.data, event )
        });
        this.client.addEventListener('close', function(event){});
        this.client.addEventListener('message', function(event){
            //console.log("RAW MESSAGE EVENT S B O", typeof event.data, event.data, event )
        });
       
        this.messageEvent = fromEvent(this.client, 'message');


        this.loginEvent = this.messageEvent
        .pipe(filter( event =>  typeof event.data === 'string'))
        .pipe(filter( event =>  event.data !== this.pingIn    ))
        .pipe(filter( event =>  JSON.parse(event.data).event === 'login'));
        this.loginEvent.subscribe(ev=> {
            //console.log('LOGIN EVENT MESSAGE',JSON.parse(ev.data).event)
            //let msg = this.getSubscribeMessage(symbol)
           // this.client.send(msg);
        }); 

        this.blobEvent = this.messageEvent
        .pipe(filter( event => JSON.parse(event.data).e === 'executionReport'))
    
        this.blobEvent.subscribe( ev=> {
           // console.log('BLOB EVENT MESSAGE', ev.data)
            let json = JSON.parse(ev.data) ;
            
                this.setOpenOrders(json, props);
               
        })
            
            //console.log('BLOB EVENT UNZIPPED',json)
         

        this.pingEvent = this.messageEvent
        .pipe(filter( event =>  typeof event.data === 'string'))
        .pipe(filter( event => event.data === this.pingIn ))
        this.pingEvent.subscribe( ev=> {
            console.log('PING EVENT MESSAGE',ev.data)
            this.client.send(this.pingOut);
        }); 
        
        this.openEvent = fromEvent(this.client, 'open').subscribe((event) => {
           // console.log('OPEN EVENT', event)
            
            if(this.login){
                //let msg = this.getLoginMessage(credentials.key,credentials.secret,credentials.apiName)
                //console.log('LoginMessage', msg)
                //this.client.send(msg)
            } else {
                //let msg = this.getSubscribeMessage(symbol)
                //this.client.send(msg);
            }
            

            

        
        });
        this.closeEvent = fromEvent(this.client, 'close').subscribe((event) => {
           // console.log('CLOSE EVENT', event)
            clearInterval(this.ping_id)
        });

        }

        setOpenOrders (json, props){
           // console.log('setOpenOrders', json, props)
           
           console.log('setOpenOrders', Array.isArray(json), typeof json)
            if( json !== undefined || ! Array.isArray(json) ){
                
                //console.log('pre pre pre Transform', json)
                props.setData({
                    ...props.data,
                    asset:[]
                })
                 //console.log('pre pre Transform', json.data)
                
                let newTrade = this.transformer.getTradeStream(json,this.symbol)
                if(newTrade.state === 'CANCELED'){
                    //console.log('PRE FILTERED', this.trades);
                    this.trades = this.trades.filter(trade => trade.order_id !== newTrade.order_id)
                    //console.log('FILTERED', this.trades);

                } else {
                        
                        this.trades.unshift(newTrade)
                        
                }
                            
                    //console.log('TRDATA4', this.trades);
                    
                props.setData({
                    ...props.data,
                    asset:this.trades
                })
        
            }
        }

        getLoginMessage ( key,secret,apiName ) {
            
            let timestamp = Date.now().toString();
            let signature = require("crypto")
                            .createHmac("sha256", secret)
                            .update(timestamp+'#'+apiName+'#bitmart.WebSocket')
                            .digest("hex"); //binary, hex,base64

            let msg = {"op": "login", "args":[key,timestamp,signature]} ;
            return JSON.stringify(msg)

        }

        getSubscribeMessage (symbol) {
            console.log('getSubscribeMessage', symbol )
            this.symbol = symbol;
            return JSON.stringify({"op": "subscribe", "args":["spot/user/order:"+symbol]});
        }

        getUnsubscribeMessage (symbol) {
            console.log('getUnSubscribeMessage', symbol )
            
            return JSON.stringify({"op": "unsubscribe", "args":["spot/user/order:"+symbol]});
        }
    
    
    
};
