import { fromEvent, throwError } from 'rxjs';
import { filter } from 'rxjs/operators';
import { callbackify } from 'util';
const Decompress = require("./decompress").Decompress;
const RobustWebSocket = require('robust-websocket');
const _transform = require('./transformer')

export default class BitmartWebSocket {
    constructor(  config, props, credentials, trades, endpoint, callback){
       // return
        //console.log("BITMART PROPS", config, props, credentials, trades)
        //return;
        let symbol = props.selectedTicker;
        this.client = new RobustWebSocket( config.url, null, {
            timeout: 60000,
            shouldReconnect: function(event, ws) {
                console.log('Reconnecting')
                if (event.code === 1008 || event.code === 1011) return
                return [0, 3000, 10000][ws.attempts]
            }
            }
        ) 
        this.component = config.component || 'orders'
        this.name = 'Bitmart';
        this.callback = callback;
        this.login = config.login || false;
        this.trades = trades ;
        this.prevPrices = trades
        this.ping_id = 0 ;
        this.ping_time = 10000
        this.symbol =  props.selectedTicker || 'SHIB_USDT';
        this.symbolLower =  props.selectedTicker.toLowerCase() || 'shib_usdt';
        this.symbolUpper =  props.selectedTicker.toUpperCase() || 'SHIB_USDT';
        this.url = config.url || 'wss://ws-manager-compress.bitmart.com?protocol=1.1';
        this.client.binaryType = 'blob'; //blob / text
        this.pingText =  'pong';
        this.subscribeMessage = this.getSubscribeMessage(symbol);
        this.unsubscribeMessage = this.getUnsubscribeMessage(symbol);
        //this.loginMessage = this.getLoginMessage(symbol);
        this.transformer =  new _transform(this.name);
        this.decompress =  new Decompress(); //decompression class
        this.key = credentials.key;
        this.secret = credentials.secret;
        this.apiName = credentials.apiName;
        if(this.component === 'spot') this.client.addEventListener('open', function(event){
            //console.log("RAW OPEN SPOT S B O", this.component, event);
            
        });
        if(this.component === 'depth') this.client.addEventListener('open', function(event){
            //console.log("RAW OPEN DEPTH S B O", this.component, event);
            
        });
        if(this.component === 'spot') this.client.addEventListener('close', function(event){
            //console.log("RAW CLOSE SPOT S B O", this.component, event);
            
        });
        if(this.component === 'depth') this.client.addEventListener('close', function(event){
            //console.log("RAW CLOSE SPOT S B O", this.component, event);
            
        });
        if(this.component === 'orders') this.client.addEventListener('open', function(event){
            //console.log("RAW OPEN ORDERS S B O", this.component, event);
        });
        this.client.addEventListener('close', function(event){

        });
        let comp = this.component
        
        if(this.component === 'spot') this.client.addEventListener('message', function(event){
           
             //console.log(" RAW MESSAGE SPOT S B O ", typeof event.data, event.data, event )
        
        });

        if(this.component === 'market') this.client.addEventListener('message', function(event){
           
            //console.log(" RAW MESSAGE MARKET S B O ", typeof event.data, event.data, event )
       
       });

        if(this.component === 'depth') this.client.addEventListener('message', function(event){
           
            //console.log(" RAW MESSAGE DEPTH S B O ", typeof event.data, event.data, event )
       
       });

        if(this.component === 'orders') this.client.addEventListener('message', function(event){
           
            //console.log(" RAW MESSAGE ORDERS S B O ", typeof event.data, event.data, event )
       
       });
       
        this.messageEvent = fromEvent(this.client, 'message');


        this.loginEvent = this.messageEvent
        .pipe(filter( event =>  typeof event.data === 'string'))
        .pipe(filter( event =>  event.data !== this.pingText    ))
        .pipe(filter( event =>  JSON.parse(event.data).event === 'login'));
        this.loginEvent.subscribe(ev=> {
            //console.log('LOGIN EVENT MESSAGE',JSON.parse(ev.data).event)
            let msg = this.getSubscribeMessage(symbol)
            this.client.send(msg);
        }); 

        this.blobEvent = this.messageEvent.pipe(filter( event => event.data instanceof Blob ));
        this.blobEvent.subscribe( ev=> {
            //console.log('BLOB EVENT MESSAGE', ev.data)
            let json = ev.data;
            let unzipped;
            this.decompress.unzip(json,(err, buffer) => {
                        if(buffer === undefined){
                            return ;
                        }
                json =  JSON.parse(buffer.toString('UTF-8'));
                //console.log('UNZIP EVENT MESSAGE', json)
                if(this.component === 'orders'){
                    //console.log('ORDERS SET')
                    this.setOpenOrders(json, props);
                } else  if(this.component === 'spot'){
                    //console.log('SPOT SET')
                    this.setSpotData(json);
                } else  if(this.component === 'depth'){
                    //console.log('DEPTH SET')
                    this.setDepthData(json);
                } else  if(this.component === 'market'){ //market
                    //console.log('DEPTH SET')
                    this.setMarketData(json);
                }
                //console.log('BLOB EVENT CALLBACK', json)
            })
            
            //console.log('BLOB EVENT UNZIPPED',json)
        }); 

        this.pingEvent = this.messageEvent
        .pipe(filter( event =>  typeof event.data === 'string'))
        .pipe(filter( event => event.data === this.pingText ))
        this.pingEvent.subscribe( ev=> {
            //console.log('PING EVENT MESSAGE',ev.data)
        }); 
        
        this.openEvent = fromEvent(this.client, 'open').subscribe((event) => {
            //console.log('OPEN EVENT', event)
            
            if(this.login){
                let msg = this.getLoginMessage(credentials.key,credentials.secret,credentials.apiName)
                //console.log('LoginMessage', msg)
                this.client.send(msg)
            } else {
                //console.log('SEND EVENT', event)
                let msg = this.getSubscribeMessage(symbol)
                let id = setInterval(() => {
                    //console.log('READYSTATE', this.client.readyState), msg
                    if(this.client.readyState === 1){
                        this.client.send(msg);
                        clearInterval(id)
                    }
                }, 1000);
                
                
            }
            

            this.ping_id = setInterval(() =>{
                
                if( this.client.readyState === 1 ){
                    this.client.send('ping');
                    
                } 
            }, this.ping_time);
            

        
        });
        this.closeEvent = fromEvent(this.client, 'close').subscribe((event) => {
            //console.log('CLOSE EVENT', event)
            clearInterval(this.ping_id)
            
            
        });

    }

        setOpenOrders (json, props){
            
            if(  json !== undefined && json.data !== undefined && json.data.length > 0 ){
                console.log('setOpenOrders',json,this.symbol, this.trades)
                
                let newTrade = this.transformer.getTradeStream(json.data[0],this.symbol)
                let filtered;
                if(newTrade.state === 'CANCELED'){
                    
                    this.trades = this.trades.filter(trade => trade.order_id !== newTrade.order_id)
                 

                } else {
                        
                        this.trades.unshift(newTrade)
                        
                }
                   
                this.callback(this.trades);
                   
                    
                
            }
        }

       

        setSpotData (json){
            
            if(  json !== undefined && json.data !== undefined && json.data.length > 0 ){
                
                
                let newState = this.transformer.getStream(json.data[0],this.symbol,this.prevPrices);
                 
                
                this.callback(newState);
                this.prevPrices.push(newState.lastPrice );

                if(this.prevPrices.length > 2){
                    this.prevPrices.splice(0,1);
                }
        
            }
        } 
        setDepthData (json){
            
           
            //console.log('setDepthData unzipped', json)
            if(  json !== undefined && json.data !== undefined && json.data.length > 0 ){
                
                
                this.callback(json.data[0]);
               
        
            }
        }

        setMarketData (json){
            
           
            //console.log('setMarketData unzipped', json)
            if(  json !== undefined && json.data !== undefined && json.data.length > 0 ){
                       
                this.callback(json.data[0]);
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
            let msg;
            
            this.symbol = symbol;
            if(this.component === 'orders'){
                msg = {"op": "subscribe", "args":["spot/user/order:"+symbol]}
            } else if(this.component === 'miniTicker'){
                msg = {"op": "subscribe", "args":["spot/ticker:"+symbol]}
            } else if(this.component === 'depth5'){
                msg = {"op": "subscribe", "args": ["spot/depth5:"+symbol]}
            } else if(this.component === 'market'){
                msg = {"op": "subscribe", "args": ["spot/trade:"+symbol]} //market
            }else if(this.component === 'kline'){
                this.prefix = ''
                this.suffix = '_1m'
                this.conjunction = '@'
                this.symbol = this.symbolUpper
                //msg = {"op": "subscribe", "args": ["spot/kline:"+symbol]} //market
            } else {
                msg = '';
            }
            //console.log('getSubscribeMessage', symbol, msg )
            return JSON.stringify(msg);
        }

        getUnsubscribeMessage (symbol) {
            let msg;
            if(this.component === 'orders'){
                msg = {"op": "unsubscribe", "args":["spot/user/order:"+symbol]}
            } else if(this.component === 'miniTicker'){
                msg = {"op": "unsubscribe", "args":["spot/ticker:"+symbol]}
            } else if(this.component === 'depth5'){
                msg = {"op": "unsubscribe", "args": ["spot/depth5:"+symbol]}
            } else if(this.component === 'market'){
                msg = {"op": "unsubscribe", "args": ["spot/trade:"+symbol]}
            } 
           // console.log('getUnSubscribeMessage', msg )
            
            return JSON.stringify(msg);
        }

        close(){
            
            let msg = this.getUnsubscribeMessage(this.symbol);
            if(msg === undefined) return
            if(msg.length > 0){
                let id = setInterval(() => {
                   // console.log('READYSTATE', this.client.readyState)
                    if(this.client.readyState === 3){
                        clearInterval(id)
                    } else if(this.client.readyState === 1){
                        this.client.send(msg);
                        this.client.close();
                        clearInterval(id)
                    } 
                }, 1000);
            }
            
            
        }
    
    
    
};
