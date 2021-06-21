import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
const RobustWebSocket = require('robust-websocket');
const _transform = require('./transformer')

var endpoint
var symbol, sym
export default class BinanceWebSocket {
    constructor(config, props, credentials, update, symbol, callback) {

        if(symbol=== undefined ||symbol.length<1) return
        if(!this.transformed){
            this.symbolRaw = symbol;
        }
        


        if(config=== undefined ||config.name.length<1) return
        console.log('CONFIG',props,config,  config.name || "CONFIG NOT SET")
        this.config = config;
        this.name = config.name;
        this.url = config.url
        this.component = config.component
        
        
        
        //this.endpoint = endpoint;
        if(props=== undefined ) return
        console.log('PROPS',props || "PROPS NOT SET")
        this.props = props;

        if(credentials=== undefined ) return
        console.log('CREDENTIALS',credentials || "CREDENTIALS NOT SET")
        this.credentials = credentials
        
        
        
        console.log('SYMBOL',props, symbol,  symbol || "SYMBOL NOT SET")
        if(symbol=== undefined || symbol.length<1) return  /// bail out
        this.rawSymbol = symbol


        if(callback!== undefined ){
            this.callback = callback
        } 
        
        
        //[this.url,this.endpoint,this.symbol] = [config.url, endpoint, endpoint.split('@')[0]]

        // if (endpoint === null || endpoint === undefined ) {
        //     //this.endpoint = endpoint
        //     sym=props.selectedTicker

        // } else {
            
        //     sym=endpoint
        //     //console.log('SYMBOL', this.symbol, this.endpoint || "")

        // }
        this.coin = this.rawSymbol.split('_')[0]
        this.transform = this.config.transform;
        let tmp= new String(this.symbolRaw)
        if(!this.transformed){
            this.transform.symbol.forEach(transform => {
                //console.log('SYMBOL EX',this.symbol)
                //this.symbol = new String(this.rawSymbol)
               tmp = tmp[transform]()
               
                this.transformed=true
               //console.log('XFORMER SYMBOL',this.symbol,proto)
               
            });
        
        }
        this.symbol = tmp
        this.endpoint = this.symbol + 
        this.config.transform.stream + 
        this.config.transform.interval || "" +
        this.config.transform.frequency || "" 
        

    
        console.log('ENDPOINT WORKING?', this.endpoint)
        if (this.rawSymbol.match(/\|/g) !== null && rawSymbol.match(/\|/g).length > 0) { //listenKey
            // if (symbol.match(/\|/g).length === 1) {
            //     this.symbolLower = this.rawSymbol.split('|')[0].replace('_','').toLowerCase()
            //     this.endpoint = this.symbol.split('|')[1]
            //     this.currency = this.endpoint.split('_')[1]
                
            // }
        } else {
            // if(this.component === 'depth'){
            //     this.endpoint = ''
            // }
        
        // if(this.rawSymbol.match(/\|/g) === null) {
                

        //     if (this.rawSymbol.match(/@/g) !== null && this.rawSymbol.match(/@/g).length=== 1) {
        //         this.symbol = this.rawSymbol.split('@')[0]
        //         this.endpoint = this.rawSymbol.split('@')[1]
        //         this.currency = this.endpoint.split('_')[1]
        //     } else if (this.rawSymbol.match(/@/g) !== null && this.rawSymbol.match(/@/g).length=== 2) { //depth
        //         this.symbol = symbol.split('@')[0]
        //         this.stream = symbol.split('@')[1]
        //         this.interval = symbol.split('@')[2]
        //         this.endpoint = this.symbol + '@' +this.stream + '@' + this.interval
        //     } else {
        //         console.log('WHAT AM I MISSING', this.symbolRaw, this.endpoint||'MISSING ENDPOINT')
        //         return;
        //     }

        
        }

       
        //console.log('XFORMER WORKING', this.symbol)
        

        console.log('SYMBOL/ENDPOINT',this.component,this.symbolRaw,this.symbol, this.endpoint)
        // if(endpoint.length < 1){
        //     this.endpoint = endpoint

        // } else{
        //     if(endpoint.includes('\|')){
        //         this.symbol = endpoint.split('|')[0]
        //         this.endpoint = endpoint.split('|')[1]
        //     }
        //     if(endpoint.includes('_')){
        //         this.endpoint = endpoint
        //         this.symbol = endpoint.split('@')[0]
        //     }
        // }
if(!this.url || !this.endpoint ) return

        console.log('connecting to',this.url+this.endpoint)
        this.client = new RobustWebSocket(this.url+this.endpoint, null, {
            timeout: 60000,
            shouldReconnect:function()  { 
                if(!this.url || !this.endpoint){
                    return;
                }
                return function (event, ws) {
                console.log('Reconnecting to ' + this.url + this.endpoint + ' ' + ' code:' + event.code + ' attempts:' + ws.attempts)}
                
                if (event.code === 1008 || event.code === 1011) return
                return [0, 3000, 10000][ws.attempts]
            }
        }
        )
        console.log('NAME', this.name)
        //this.name = 'Binance';
        //this.config = config
        //this.symbol = props.selectedTicker
        //this.endpoint = endpoint || 'btcusd@kline_1m'
        this.event = '';
        this.lastEvent = 'first event';
        this.eventMessage = '';
        this.subId = -1
        this.tickers = this.props.tickers || [];
        //this.symbolRaw = props.selectedTicker || 'DOGE_USDT'
        //this.component = this.config.component;
        this.login = this.config.login || false;
        this.update = update || [];
        this.prevPrices = update;
        this.callback = this.callback || (() => {})
        this.ping_id = 0;
        this.ping_time = 1000000
        //this.symbol = props.selectedTicker || 'DOGEUSDT';
        //this.url = config.url || 'wss://stream.binance.us:9443/ws/';
        this.client.binaryType = 'blob'; //blob / text
        this.pingIn = 'ping';
        this.pingOut = 'pong';
        this.subscribeMessage = this.getSubscribeMessage(this.symbolLower);
        this.unsubscribeMessage = this.getUnsubscribeMessage(this.symbolLower);
        //this.loginMessage = this.getLoginMessage(symbol);
        this.transformer = new _transform(this.name);
        this.key = this.credentials.key;
        this.secret = this.credentials.secret;
        this.apiName = this.credentials.apiName;

        this.client.addEventListener('open', function (event) {
            this.event = 'open'
            this.lastEvent = 'open'
            this.eventMessage = 'raw open'
            //console.log("RAW OPEN S B O", event)
        });
        this.client.addEventListener('close', function (event) {
            this.event = 'close'
            this.lastEvent = 'close'
            this.eventMessage = 'raw close'
            //console.log("RAW CLOSE EVENT", event)
        });
        this.client.addEventListener('message', function (event) {
            this.event = 'message'
            this.lastEvent = 'message'
            this.eventMessage = 'raw message'
            //console.log("RAW MESSAGE EVENT S B O", typeof event.data, event.data, event)
        });

        this.messageEvent = fromEvent(this.client, 'message');


        this.listenEvent = this.messageEvent
            .pipe(filter(event => typeof event.data === 'string'))
            .pipe(filter(event => event.data !== this.pingIn))
            .pipe(filter(event => JSON.parse(event.data).id === undefined))
            .pipe(filter(event => JSON.parse(event.data).e !== 'executionReport'));
        this.listenEvent.subscribe(ev => {
            //console.log('KLINE SET PRE PARSE', ev.data, this.component, this.subId, this.event, this.eventMessage,this.lastEvent, JSON.parse(ev.data))
            //console.log('LISTEN EVENT MESSAGE',JSON.parse(ev.data))
            //let msg = this.getSubscribeMessage(symbol)
            // this.client.send(msg);
            let json = JSON.parse(ev.data)
            if (this.component === 'spot') { //spot
                //console.log('SPOT SET')

                this.setSpotData(json);
            } else if (this.component === 'depth') {
                //console.log('DEPTH SET')
                this.setDepthData(json);
            } else if (this.component === 'trade') {
                //console.log('MARKET SET')
                this.setMarketData(json);
            } else if (this.component === 'kline') {




                //this.subId = em.id

                // console.log('BULLSHIT! jsonId,event,jsonSymbol',json.id||'idunset', this.event||'evunset', this.lastEvent||'lastevunset', json.s||'symunset',this.eventMessage||'evMsgNotset' )
                if (json.id === undefined && this.event === 'subscribe' && json.s !== undefined) {
                    console.log('KLINE SET EVENT', this.event, this.eventMessage, this.lastEvent, json.s, this.subId)
                    this.component='kline'
                    this.setKlineData(json);
                } else {
                    //if(this.subId === -1){
                    //this.subId = em.id
                    //}
                    console.log('KLINE SET ID', this.event, this.eventMessage, this.lastEvent, json.id, this.subId, JSON.parse(ev.data))
                }

            }
        });

        this.blobEvent = this.messageEvent
            .pipe(filter(event => JSON.parse(event.data).e === 'executionReport'))

        this.blobEvent.subscribe(ev => {
            // console.log('BLOB EVENT MESSAGE', ev.data)
            let json = JSON.parse(ev.data);

            this.setOpenOrders(json);


        })

        //console.log('BLOB EVENT UNZIPPED',json)


        this.pingEvent = this.messageEvent
            .pipe(filter(event => typeof event.data === 'string'))
            .pipe(filter(event => event.data === this.pingIn))
        this.pingEvent.subscribe(ev => {
            console.log('PING EVENT MESSAGE', ev.data)
            this.client.send(this.pingOut);
        });


        this.closeEvent = fromEvent(this.client, 'close').subscribe((event) => {
            this.event = 'close 141'
            console.log('CLOSE EVENT', event)
            clearInterval(this.ping_id)
        });

    }



    setOpenOrders(json) {

        this.component = 'orders'
        console.log('setOpenOrders', Array.isArray(json), typeof json)
        if (json !== undefined || !Array.isArray(json)) {

            
            //console.log('pre pre Transform', json)
            //console.log('TICKERS', this.tickers[this.name], this.symbol)




            let newTrade = this.transformer.getTradeStream(json, this.tickers[this.name])
            if (newTrade.state === 'CANCELED') {
                this.update = this.update.filter(trade => trade.order_id !== newTrade.order_id)
            } else {

                this.update.unshift(newTrade)

            }

            this.callback(this.update)


        }
    }


    setSpotData(json) {
        this.component = 'spot'

        if (json !== undefined) {


            let newState = this.transformer.getStream(json, this.symbolRaw, this.prevPrices);


            this.callback(newState);
            this.prevPrices.push(newState.lastPrice);

            if (this.prevPrices.length > 2) {
                this.prevPrices.splice(0, 1);
            }

        }
    }
    setDepthData(json) {

        this.component = 'depth'

        if (json !== undefined) {

            //console.log('pre pre pre Transform', json)
            //let json = JSON.parse();


            this.callback(json);


        }
    }

    setMarketData(json) {

        this.component = 'market'
        //console.log('setMarketData', json)
        if (json !== undefined) {

            let len = this.prevPrices.length
            let side = '';
            if (parseFloat(this.prevPrices[len - 1]) > parseFloat(json.p)) {
                side = 'sell';
            } else {
                side = 'buy';
            }

            this.callback({ price: json.p, size: json.q, side: side })


            this.prevPrices.push(json.p);

            if (this.prevPrices.length > 2) {
                this.prevPrices.splice(0, 1);
            }




        }
    }
    setKlineData(json) {

        this.component = 'kline'
        //console.log('setMarketData', json)
        if (json !== undefined) {

            console.log('KLINE', json.s, this.symbol.toUpperCase(), json.hasOwnProperty('result') ? json.id : 'Not Yet')
            if (json.s === this.symbol.toUpperCase()) {
                console.log('KLINE DATA', json)
                if (json.data !== '{}') {
                    this.callback(json)
                }

            }



        }
    }
    getLoginMessage(key, secret, apiName) {

        let timestamp = Date.now().toString();
        let signature = require("crypto")
            .createHmac("sha256", secret)
            .update(timestamp + '#' + apiName + '#bitmart.WebSocket')
            .digest("hex"); //binary, hex,base64

        let msg = { "op": "login", "args": [key, timestamp, signature] };
        return JSON.stringify(msg)

    }

    getSubscribeMessage(symbol) {
        // console.log('getSubscribeMessage', symbol )

        return '';
    }

    getUnsubscribeMessage(symbol) {
        //console.log('getUnSubscribeMessage', symbol )

        return '';
    }


    close() {
        if(this.client === undefined) return;
        this.event = 'close'
        this.lastEvent = 'close'
        this.eventMessage = 'close'
        let id = setInterval(() => {
            console.log('READYSTATE', this.client.readyState, this.component,this.endpoint)
            if (this.client.readyState === 3) {
                clearInterval(id)
            } else if (this.client.readyState === 1) {

                this.client.close();
                clearInterval(id)
            } else {
                clearInterval(id)
            }
        }, 500);
    }

    setUrl(url,endpoint) {
        if(url !==undefined && endpoint !== undefined){
            this.url = url;
            this.endpoint = endpoint ;
            console.log(url,endpoint)
            return url+ endpoint
        } else {
            console.log(this.config.url,this.endpoint)
            return this.url + this.endpoint ;
        }
       
        
    }



    parseEndpoint(msg) {

        // msg = JSON.stringify({"method": "SUBSCRIBE","params": ["btcusd@kline_1m"],"id": id})
        console.log(msg)
        let json = JSON.parse(msg);
        let params = json.params
        let id = json.id
        let endpoint = params[0]

        let symbol = endpoint.split('@')[0];
        let streamInterval = endpoint.split('@')[1];
        let stream = streamInterval.split('_')[0]
        let interval = streamInterval.split('_')[1]
        let ret = { symbol: symbol, endpoint: endpoint, stream: stream, interval: interval, id: id }
        return ret;
    }

    subscribe(msg) {
        this.event = 'subscribe'
        this.lastEvent = 'subscribe'
        this.eventMessage = msg
        //console.log("SOCKET GOT", msg, this.client.readyState)
        let id = setInterval(() => {
            console.log('SOCKET SENT READYSTATE', this.client.readyState, msg)
            if (this.client.readyState === 3) {
                clearInterval(id)
            } else if (this.client.readyState === 1) {
                let json = this.parseEndpoint(msg)
                this.symbol = json.symbol
                console.log('EP SET', json.endpoint)
                this.endpoint = json.endpoint
                this.subId = json.id
                //this.client.endpoint= json.endpoint
                this.setUrl( this.connectUrl, endpoint)

                //this.client.url = config.url+ep.params[0]

                console.log('SOCKET SENT SUBSCRIBE', msg, json)

                this.client.send(msg);
                //this.client.close();
                clearInterval(id)
            } else {
                clearInterval(id)
            }
        }, 10000);
    }

    unsubscribe(msg) {
        //console.log("SOCKET GOT", msg, this.client.readyState)
        this.event = 'unsubscribe'
        this.lastEvent = 'unsubscribe'
        this.eventMessage = msg
        // let json =this.parseEndpoint(msg)      
        //this.subId = json.id

        let iiid = setInterval(() => {
            console.log('SOCKET SENT READYSTATE', this.client.readyState, msg)
            if (this.client.readyState === 3) {
                clearInterval(iiid)
            } else if (this.client.readyState === 1) {
                //let json =this.parseEndpoint(msg)

                // this.subId = json.id



                console.log('SOCKET SENT UNSUBSCRIBE', msg)

                this.client.send(msg);
                //this.client.close();
                clearInterval(iiid)
            } else {
                clearInterval(iiid)
            }
        }, 500);
    }

    send(msg) {
        this.event = 'send'
        this.eventMessage = msg
        this.lastEvent = 'send'
        console.log("SOCKET GOT", msg, this.client.readyState)
        let iiid = setInterval(() => {
            console.log('READYSTATE', this.client.readyState, this.component, msg)
            if (this.client.readyState === 3) {
                clearInterval(id)
            } else if (this.client.readyState === 1) {

                // let id=1000;
                // msg = JSON.stringify({"method": "SUBSCRIBE","params": ["btcusd@kline_1m"],"id": id})
                // let ep = this.parseEndpoint(msg)
                // this.symbol = ep.symbol
                // this.endpoint = ep.symbol

                console.log('SOCKET SENT', msg)

                this.client.send(msg);
                //this.client.close();
                clearInterval(iiid)
            } else {
                clearInterval(iiid)
            }
        }, 500);
    }



};
