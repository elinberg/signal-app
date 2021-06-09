import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
const RobustWebSocket = require('robust-websocket');
const _transform = require('./transformer')

export default class BinanceWebSocket  {
    constructor(  config, props, credentials, trades, endpoint, callback){

        let symbol = props.selectedTicker.replace(/_/g,"").toLowerCase();
        console.log('connecting to',config.url+endpoint, symbol)
        this.client = new RobustWebSocket(config.url+endpoint, null, {
            timeout: 600000,
            shouldReconnect: function(event, ws) {
                console.log('Reconnecting')
                if (event.code === 1008 || event.code === 1011) return
                return [0, 3000, 10000][ws.attempts]
            }
            }
        ) 
        this.name = 'Binance';
        this.symbolRaw = props.selectedTicker || 'DOGE_USDT'
        this.component = config.component;
        this.login = config.login || false;
        this.trades = trades || [] ;
        this.prevPrices = trades;
        this.callback = callback || {}
        this.ping_id = 0 ;
        this.ping_time = 1000000
        this.symbol =  symbol|| 'DOGEUSDT';
        this.url = config.url || 'wss://stream.binance.us:9443/ws/';
        this.client.binaryType = 'blob'; //blob / text
        this.pingIn =  'ping';
        this.pingOut =  'pong';
        this.subscribeMessage = this.getSubscribeMessage(symbol);
        this.unsubscribeMessage = this.getUnsubscribeMessage(symbol);
        //this.loginMessage = this.getLoginMessage(symbol);
        this.transformer =  new _transform(this.name);
        this.key = credentials.key;
        this.secret = credentials.secret;
        this.apiName = credentials.apiName;
        this.client.addEventListener('open', function(event){
            console.log("RAW OPEN S B O",  event )
        });
        this.client.addEventListener('close', function(event){});
        this.client.addEventListener('message', function(event){
            //console.log("RAW MESSAGE EVENT S B O", typeof event.data, event.data, event )
        });
       
        this.messageEvent = fromEvent(this.client, 'message');


        this.listenEvent = this.messageEvent
        .pipe(filter( event =>  typeof event.data === 'string'))
        .pipe(filter( event =>  event.data !== this.pingIn    ))
        .pipe(filter( event =>  JSON.parse(event.data).e !== 'executionReport'));
        this.listenEvent.subscribe(ev=> {
        //console.log('LISTEN EVENT MESSAGE',JSON.parse(ev.data))
            //let msg = this.getSubscribeMessage(symbol)
           // this.client.send(msg);
           let json = JSON.parse(ev.data)
         if(this.component === 'ticker'){
            //console.log('SPOT SET')
            
            this.setSpotData(json);
        } else  if(this.component === 'depth'){
            //console.log('DEPTH SET')
            this.setDepthData(json);
        } else  if(this.component === 'market'){
            //console.log('MARKET SET')
            this.setMarketData(json);
        }
        }); 

        this.blobEvent = this.messageEvent
        .pipe(filter( event => JSON.parse(event.data).e === 'executionReport'))
    
        this.blobEvent.subscribe( ev=> {
           // console.log('BLOB EVENT MESSAGE', ev.data)
            let json = JSON.parse(ev.data) ;
            
            this.setOpenOrders(json);
            
               
        })
            
            //console.log('BLOB EVENT UNZIPPED',json)
         

        this.pingEvent = this.messageEvent
        .pipe(filter( event =>  typeof event.data === 'string'))
        .pipe(filter( event => event.data === this.pingIn ))
        this.pingEvent.subscribe( ev=> {
            console.log('PING EVENT MESSAGE',ev.data)
            this.client.send(this.pingOut);
        }); 
        
        
        this.closeEvent = fromEvent(this.client, 'close').subscribe((event) => {
           // console.log('CLOSE EVENT', event)
            clearInterval(this.ping_id)
        });

        }

        setOpenOrders (json){
           
           
           //console.log('setOpenOrders', Array.isArray(json), typeof json)
            if( json !== undefined || ! Array.isArray(json) ){
                
                
                 //console.log('pre pre Transform', json)
                
                let newTrade = this.transformer.getTradeStream(json,this.symbol)
                if(newTrade.state === 'CANCELED'){
                    this.trades = this.trades.filter(trade => trade.order_id !== newTrade.order_id)
                } else {
                        
                        this.trades.unshift(newTrade)
                        
                }
                            
                    this.callback(this.trades)
                    
        
            }
        }


        setSpotData (json){
            
            if(  json !== undefined  ){
                
                
                let newState = this.transformer.getStream(json,this.symbolRaw,this.prevPrices);
                 
                
                this.callback(newState);
                this.prevPrices.push(newState.lastPrice );

                if(this.prevPrices.length > 2){
                    this.prevPrices.splice(0,1);
                }
        
            }
        } 
        setDepthData (json){
            
           
            
            if(  json !== undefined  ){
                
                //console.log('pre pre pre Transform', json)
                //let json = JSON.parse();
                 
                
                this.callback(json);
               
        
            }
        }

        setMarketData (json){
            
           
            //console.log('setMarketData', json)
            if(  json !== undefined  ){
                
                let len = this.prevPrices.length
                let side = '';
                if(parseFloat(this.prevPrices[len-1]) > parseFloat(json.p)){
                    side = 'sell';
                } else {
                    side = 'buy';
                } 

                this.callback({price: json.p, size:json.q, side:side})

                
            this.prevPrices.push(json.p );

            if(this.prevPrices.length > 2){
                this.prevPrices.splice(0,1);
            }
                
                
               
        
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
           // console.log('getSubscribeMessage', symbol )
            
            return '';
        }

        getUnsubscribeMessage (symbol) {
            //console.log('getUnSubscribeMessage', symbol )
            
            return '';
        }


        close(){
            let id = setInterval(() => {
               // console.log('READYSTATE', this.client.readyState, this.component)
                if(this.client.readyState === 3){
                    clearInterval(id)
                } else if(this.client.readyState === 1){
                    
                    this.client.close();
                    clearInterval(id)
                } else {
                    clearInterval(id)
                }
            }, 1000);
        }
    
    
    
};
