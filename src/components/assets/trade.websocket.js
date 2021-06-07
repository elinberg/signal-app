const Decompress = require("./decompress").Decompress;
const RobustWebSocket = require('robust-websocket');
const _transform = require('./transformer')
//const prevPrice = '0.00';
export default  function TradeWebSocketConnection(props, listenKey, credentials, trades) {

const obj = Object.create(protoMethods);
 obj.client = {};

 //obj.msg = msg;
 return obj.getClient(props,props.setData,props.data, listenKey, credentials, trades);

}
    //console.log('Previous Ticker', localStorage.getItem('selectedTicker'), this.props.selectedTicker);
 const protoMethods = {

    getClient: function(props, setData, data, listenKey, credentials, trades){
        //console.log('getClient',props, setData, data, msg, trades)
        if(props.selectedTicker === undefined){
            return;
        }
        let url=''
        if(props.exchange.name === 'Binance'){
            url = 'wss://stream.binance.us:9443/ws/'+listenKey;
        } else {
            url = 'wss://ws-manager-compress.bitmart.com?protocol=1.1'
            
        }

        console.log('Connecting to:', url)
    //this.trades = []

   
    this.client = new RobustWebSocket(url, null, {
                // The number of milliseconds to wait before a connection is considered to have timed out. Defaults to 4 seconds.
                timeout: 60000,
                // A function that given a CloseEvent or an online event (https://developer.mozilla.org/en-US/docs/Online_and_offline_events) and the `RobustWebSocket`,
                // will return the number of milliseconds to wait to reconnect, or a non-Number to not reconnect.
                // see below for more examples; below is the default functionality.
                shouldReconnect: function(event, ws) {
                    console.log('Reconnecting')
                    if (event.code === 1008 || event.code === 1011) return
                    return [0, 3000, 10000][ws.attempts]
                },
                // A boolean indicating whether or not to open the connection automatically. Defaults to true, matching native [WebSocket] behavior.
                // You can open the websocket by calling `open()` when you are ready. You can close and re-open the RobustWebSocket instance as much as you wish.
                automaticOpen: true,
                // A boolean indicating whether to disable subscribing to the connectivity events provided by the browser.
                // By default RobustWebSocket instances use connectivity events to avoid triggering reconnection when the browser is offline. This flag is provided in the unlikely event of cases where this may not be desired.
                ignoreConnectivityEvents: false
                })
        this.client.binaryType='blob'; 
        this.client.addEventListener('open', function(event) {
            if(props.exchange.name === 'Binance'){
                //console.log('GOT', response.data.listenKey)
               
            } else {

                var timestamp = Date.now().toString();
                var signature = require("crypto")
                                .createHmac("sha256", credentials.secret)
                                .update(timestamp+'#'+credentials.apiName+'#bitmart.WebSocket')
                                .digest("hex"); //binary, hex,base64
                var msg = JSON.stringify({"op": "login", "args":[credentials.key,timestamp,signature]});
                this.send(msg)
            }
         console.log('WebSocket Client Connected to ', props.exchange.name);
         
        
        })

        
    this.client.addEventListener('message', function(event) {
            // text frame
            //console.log('Binance TradeWSQQQQ',JSON.parse(event.data))
            if(event.data === 'pong' || event.data === 'ping' ){
                //this.send("ping")
                return;
            }
           // console.log('message',event.data)
            
            if(event.data instanceof Blob ) {

            } else {
                if( JSON.parse(event.data).event === 'login' ){
                    
                    let smsg = JSON.stringify({"op": "subscribe", "args":["spot/user/order:"+props.selectedTicker]});
                    console.log('SUBSCRIBING:' , smsg)
                    
                    this.send(smsg);
                
                } 
            }
        // var newState;
    if(event.data instanceof Blob ) {
        if(props.exchange.name === 'Bitmart'){
        let transformer = new _transform(props.exchange.name);
        let decompress = new Decompress();
        //console.log(event.data)
        let json = decompress.unzip(event.data);
        
        if( json !== undefined && json.data !== undefined ){
            console.log('pre pre pre Transform', json)
            setData({
                ...data,
                asset:[]
            })
                console.log('pre pre Transform', json.data, trades)

                let newTrade = transformer.getTradeStream(json.data[0],props.selectedTicker)
                let orderId;
                if(newTrade.state === 'CANCELED'){
                    orderId=newTrade.order_id
                    trades = trades.filter(trade => trade.order_id !== orderId)
                    console.log('FILTERED', trades);
                    if(trades.length < 1){
                        
                    }
                } else {
                    orderId='-1'
                    trades.unshift(newTrade)
                }
                             
            console.log('TRDATA4', trades);
            
            setData({
                ...data,
                asset:trades
            })
           
        }
    } 
    } else {
            
    if(event.data === 'pong' || event.data === 'ping' ){
        //this.send("ping")
        return;
    }
    if(props.exchange.name === 'Binance'){
            let transformer = new _transform(props.exchange.name);
            try {
                let json = JSON.parse(event.data);
                if(json.e.length > 0 && json.e === 'executionReport'){
                    setData({
                        ...data,
                        asset:[]
                    })

                    console.log('TRDATA1',json,data);

                    let newTrade = transformer.getTradeStream(json,props.selectedTicker)
                    let orderId;
                    if(newTrade.state === 'CANCELED'){
                        orderId=newTrade.order_id
                        trades = trades.filter(trade => trade.order_id !== orderId)
                    } else {
                        orderId='-1'
                        trades.unshift(newTrade)
                    }
                        
                    console.log('TRDATA4', trades);
                    
                    setData({
                        ...data,
                        asset:trades
                    })

                }

            } catch(e){
                console.log(e);
            }

    }
            
            //console.log('Text Frame Binance',);
    }
    })

        this.client.addEventListener('close', function(event) {
            //prevPrices = [];
            
            if(event.data === undefined){
                return;
            }
            setData({

                asset: []
            });
        //console.log('we got: ' + event.data)
        })

        return ({client:this.client});
     }
    }   
