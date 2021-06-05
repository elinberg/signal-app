const zlib = require("zlib");
const RobustWebSocket = require('robust-websocket');
//const prevPrice = '0.00';
export default  function DepthWebSocketConnection(props, setData, data, msg) {

const obj = Object.create(protoMethods);
 obj.client = {};
 //obj.msg = msg;
 return obj.getClient(props,setData,data, msg);

}
    //console.log('Previous Ticker', localStorage.getItem('selectedTicker'), this.props.selectedTicker);
 const protoMethods = {
    getClient: function(props, setData, data, msg){
        let url=''
        if(props.exchange.name === 'Binance'){
            url = 'wss://stream.binance.com:9443/ws/'+props.selectedTicker.replace(/_/g,"").toLowerCase()+'@depth5@100ms';
        } else {
            url = 'wss://ws-manager-compress.bitmart.com?protocol=1.1'
        }

    this.client = new RobustWebSocket(url, null, {
                // The number of milliseconds to wait before a connection is considered to have timed out. Defaults to 4 seconds.
                timeout: 4000,
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
         console.log('WebSocket Client Connected');
         if(msg.length > 0 && props.exchange.name === 'Bitmart'){
            this.send(msg);
        }
        // let iid2 = setInterval(() =>{
        //     //console.log('READYSTATE1',client['Bitmart'].readyState)
        //     if(props.exchange.name == 'Bitmart'){
        //         console.log('PINGING:','ping')
        //         this.send('ping');
        //         //client['Bitmart'].send(msg);
        //     } 
        // }, 15000);
        })
        //var prevPrices = [];
        this.client.addEventListener('message', function(event) {

        //console.log('we got: ' + event.data)
        if(msg.length > 0){
            //this.client.send(msg);
        }
        // var newState;
             if(event.data instanceof Blob) {
        //let transformer = new _transform(props.exchange.name);
        //console.log(event.data)
        const stream = event.data.stream();
        const reader = stream.getReader();
        reader.read().then(({ done, value }) => {
            if(done){
                
            } else {
                var b = Buffer.from(value)
                
                zlib.inflateRaw(b,{flush: 3, info: true}, (err, buffer) => {
                var json = JSON.parse(buffer.toString('UTF-8'))

                //let prevPrice = this.prevPrice;

                //let newState = transformer.getStream(json.data[0],props.selectedTicker,prevPrices);
                let newState = json.data[0];
                setData({
                    ...data,
                    ...newState
                })
                // prevPrices.push(newState.lastPrice );

                // if(prevPrices.length > 2){
                //     prevPrices.splice(0,1);
                // }
                //console.log('Text Frame Bitmart');
                //console.log(err,json.data[0]);
                }); 
            }  
        })
        
        } else {
            // text frame

            if(event.data === 'pong' || event.data === 'ping' ){
                //client.send("ping")
                return;
            }
            
            //let transformer = new _transform(props.exchange.name);
            try {
                let json = JSON.parse(event.data);
                
                //let newData = transformer.getStream(json, props.selectedTicker, prevPrices);
                let newData = json;
                setData({
                    ...data,
                    ...newData
                })
            //prevPrices.push(newData.lastPrice );

            // if(prevPrices.length > 2){
            //     prevPrices.splice(0,1);
            // }

            } catch(e){
                console.log(e);
            }

        
            
            //console.log('Text Frame Binance',);
        }
        })

        this.client.addEventListener('close', function(event) {
            //prevPrices = [];
            setData({
                asks: [],
                bids: []
            });
            if(event.data === undefined){
                return;
            }
        //console.log('we got: ' + event.data)
        })

        return (this.client);
     }
    }   
