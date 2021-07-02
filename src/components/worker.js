import SocketFactory from './assets/socket.factory';


// let crossWindowState = {
//     counter: 0
// };
// // wait for a connection
// onconnect = (e) => {
//     // we take the caller port
//     const port = e.ports[0];

//     // on message we expect a json that will tell the worker what to do
//     port.onmessage = ({data}) => {
//         const {action, state} = data;

//         if (action === 'getState') {
//             port.postMessage(crossWindowState);
//         } else if (action === 'setState') {
//             crossWindowState = state;
//             port.postMessage(crossWindowState);
//         }
//     };
// };
let client = []
let unSubInt = 1000
let initialValue = 1000;
let id, iid
let lastSubscribe = '';
let msg;
let subscriptionId = 1000;
let subscriptions = new Map();


let i	= 0
onmessage = function (event) {
	//var workerResult = event.data;

	// (url) => {
	// 	console.log('WORKER SET URL', url);
	// return 'wss://stream.binance.us:9443/ws/'
	
	//  }
	

	console.log('WORKER GOT',  JSON.parse(event.data), i)
	
	let req = JSON.parse(event.data)
	
	if(req.cmd === 'open'){
		
			let endpoint =req.data.symbol.trim() + '@kline_' + req.data.interval.trim()
			
			if(!subscriptions.has(endpoint) ) {	
				subscriptions.set(endpoint,subscriptionId)
				subscriptionId++
			} 
			let symbol = req.data.symbol;
				msg='';
				//msg='dogeusdt@kline_1m';
				console.log('WORKER SENT OPEN ('+ subscriptionId +')', endpoint, {"props":{"selectedTicker":symbol}})
				//let props={props:{"selectedTicker":symbol}}
				
			var config = {
				Bitmart:{
					name:'BitmartWebSocket',
					component:'kline',
					login:false,
					subscribe:true,
					url: 'wss://ws-manager-compress.bitmart.com?protocol=1.1',
					transform: {
						symbol:['toUpperCase'],
						stream:'kline',
						interval:'',
						frequency:''
					}
				},
				Binance:{name:'BinanceWebSocket',
					component:'kline',
					login:false,
					subscribe:true,
					url:'wss://stream.binance.com:9443/ws/',
					transform: {
						symbol:[
							'toLowerCase',
							"replace|-|'']"
						],
						stream:'@kline_',
						interval:'1m',
						frequency:''
					}
				}
			}
			client['Binance'] =  SocketFactory.createInstance(config['Binance'], {props:{"selectedTicker":symbol}}, { key:'',apiName:'',secret:''}, [], endpoint , (market) => {
				//console.log("MARKET", market)
				
				postMessage(market);
			
			});

			var readyState
			 iid = setInterval(() =>{
				readyState=client['Binance'].client.readyState
				console.log('READYSTATE ', readyState, new Date())
				//postMessage(JSON.stringify({}))
			},600000, client['Binance'],);

	} else if(req.cmd === 'close'){
		clearInterval(iid)
			msg='';
		  console.log('WORKER SENT CLOSE ('+ i +')')
		  subscriptions.clear();
		if(client['Binance'] !== undefined)client['Binance'].close();


	} else {
		

		if(subscriptions.has(req.data) ) {	
			id =subscriptions.get(req.data);
		} else {
			id = subscriptionId;
			subscriptions.set(req.data ,id);
			subscriptionId++ ;
		}

		
		
		if(req.cmd === 'unsubscribe'){

			
				
				//id = subscriptions[req.data]
				if(id === 1000){
					//subscriptionId=1001
				}
				

				//msg = JSON.stringify({"method": "UNSUBSCRIBE","params":`[${req.data}]`,"id": id});// eric = {"method":"UNSUBSCRIBE","params":["req.data"],"id":1}
				
				//console.log('WORKER SENT UNSUBSCRIBE ('+ id  +')', msg)
			  
				try {
					
						msg = "{\"method\":\"UNSUBSCRIBE\",\"params\":[\"" + req.data + "\"],\"id\":" + id + "}"
						
						if(client['Binance'] !== undefined)client['Binance'].unsubscribe(msg);
						console.log('WORKER SENT UNSUBSCRIBE ('+id+')', msg)
					
		
					
			
				  } catch(e){
					console.log('WORKER TIMEOUT FAILED:', e)
				  }
				
				
		}else if(req.cmd === 'subscribe'){

			
				//id = subscriptions[req.data]
				
				//client['Binance'].setEndPpoint(req.data)
	
				lastSubscribe = req.data;
				 //msg = JSON.stringify(`{"method":"SUBSCRIBE","params":[${req.data}],"id":${id}}`);
				msg = "{\"method\":\"SUBSCRIBE\",\"params\":[\"" + req.data + "\"],\"id\":" + id + "}"
			  try {
				
					if(client['Binance'] !== undefined)client['Binance'].subscribe(msg);
					console.log('WORKER SENT SUBSCRIBE ('+id+')', msg)
			
	
				
		
			  } catch(e){
				console.log('WORKER TIMEOUT FAILED:', e)
			  }
	
		}
		
		
	}

	console.log('SUBSCRIPTION', subscriptions)
	
};