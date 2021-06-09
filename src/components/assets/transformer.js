// {
//   "e": "24hrTicker",  // Event type
//   "E": 123456789,     // Event time
//   "s": "BNBBTC",      // Symbol
//   "p": "0.0015",      // Price change
//   "P": "250.00",      // Price change percent
//   "w": "0.0018",      // Weighted average price
//   "x": "0.0009",      // First trade(F)-1 price (first trade before the 24hr rolling window)
//   "c": "0.0025",      // Last price
//   "Q": "10",          // Last quantity
//   "b": "0.0024",      // Best bid price
//   "B": "10",          // Best bid quantity
//   "a": "0.0026",      // Best ask price
//   "A": "100",         // Best ask quantity
//   "o": "0.0010",      // Open price
//   "h": "0.0025",      // High price
//   "l": "0.0010",      // Low price
//   "v": "10000",       // Total traded base asset volume
//   "q": "18",          // Total traded quote asset volume
//   "O": 0,             // Statistics open time
//   "C": 86400000,      // Statistics close time
//   "F": 0,             // First trade ID
//   "L": 18150,         // Last trade Id
//   "n": 18151          // Total number of trades
// }
// TradeStread
// "data":{
//   "current_page":1,
//   "orders":[
//       {
//           "order_id":2147601241,
//           "symbol":"BTC_USDT",
//           "create_time":1591099963000,
//           "side":"sell",
//           "type":"limit",
//           "price":"9000.00",
//           "price_avg":"0.00",
//           "size":"1.00000",
//           "notional":"9000.00000000",
//           "filled_notional":"0.00000000",
//           "filled_size":"0.00000",
//           "status":"4"
//       }

class Transformer {
    constructor(exchangeName) {
      this.name = exchangeName;
    }

    getTrades( json, ticker) {
      
      var records= [];
      var timestamp, date, formatted;
      if(json === undefined){
        return [];
      }
      //console.log('getTrades',json);

          if(this.name === 'Bitmart'){
            
            
            
            
            json.forEach( trade =>  {
              timestamp = Number.parseInt(trade.create_time) + 1000; //convert to milli's
                date = new Date(timestamp)
                formatted = date.toLocaleString("en-US", {month: "numeric"}) + '-' +
                date.toLocaleString("en-US", {day: "numeric"}) + ' ' +
                date.toLocaleTimeString('en-US')
              records.push(
                {
                  order_id: trade.order_id,
                  detail_id: trade.detail_id,
                  avg_price: trade.price_avg,
                  price: trade.price,
                  pair: trade.symbol,
                  side: trade.side,
                  qty: trade.size,
                  cost: parseFloat(trade.notional).toFixed(2),
                  base:trade.symbol.split('_')[1],
                  order_type:  trade.exec_type === 'M' ? 'Market': 'Limit' ,
                  transaction_date: formatted,
                  state: 'EXISTING',
                  status: 'WORKING'
                }
              )
              })
            
            return records;
          }
          if(this.name === 'Binance'){
 
            
            json.forEach( trade => {
              timestamp = Number.parseInt(trade.create_time) + 1000; //convert to milli's
                date = new Date(timestamp)
                formatted = date.toLocaleString("en-US", {month: "numeric"}) + '-' +
                date.toLocaleString("en-US", {day: "numeric"}) + ' ' +
                date.toLocaleTimeString('en-US')
              records.push(
                
                {
                  order_id: trade.order_id,
                  detail_id: trade.detail_id,
                  avg_price: trade.price_avg === undefined ? trade.price_avg: trade.price,
                  price: trade.price,
                  pair: ticker.replace('_','/'),
                  side: trade.side,
                  qty: parseFloat(trade.size).toFixed(2),
                  cost: parseFloat(trade.notional).toFixed(2),
                  base:ticker.split('_')[1],
                  order_type:  trade.exec_type === 'M' ? 'Market': 'Limit' ,
                  transaction_date: formatted,
                  state: 'EXISTING',
                  status: 'WORKING'
                }
              )
            })
            
            return records;
          }
      }

    getStream( json, symbol, prevPrices) {
    //console.log('GETSTREAM BEFORE',this.name,json, symbol, prevPrices);
      var transformed = {};
      var len = prevPrices.length;
      var priceStyle = '';
        if(this.name === 'Bitmart'){
          
          
          
          if(parseFloat(prevPrices[len-1]) > parseFloat(json.last_price)){
            priceStyle = 'text-danger';
          } else if(parseFloat(prevPrices[len-1]) < parseFloat(json.last_price)){
            priceStyle = 'text-success';
          } else {
            priceStyle = '';
          }

          transformed = {
            lastPrice: json.last_price,
            high24hr: json.high_24h,
            low24hr: json.low_24h,
            open24hr: json.open_24h,
            volume24hr: json.base_volume_24h.split('.')[0],
            priceStyle: priceStyle,
            prevPrice: prevPrices[len-1],
            baseAsset: symbol.replace(/.*_/g,"")
        };


      //  console.log('GETSTREAM AFTER',this.name,transformed, symbol, prevPrices);
          return transformed;
        }
        if(this.name === 'Binance'){
         
          len = prevPrices.length
          priceStyle = '';
          if(parseFloat(prevPrices[len-1]) > parseFloat(json.c)){
            priceStyle = 'text-danger';
          } else if(parseFloat(prevPrices[len-1]) < parseFloat(json.c)){
            priceStyle = 'text-success';
          } else {
            priceStyle = '';
          }
        //console.log('PREVIOUS', prevPrices[len - 1], json.c, Math.floor(parseFloat(prevPrices[len-1])*1000000)   > Math.floor(parseFloat(json.c)*1000000));
        transformed = {
            lastPrice: json.c,
            high24hr: json.h,
            low24hr: json.l,
            open24hr: json.o,
            volume24hr: json.v !== undefined ? json.v.split('.')[0]: '',
            priceStyle: priceStyle,
            prevPrice: prevPrices[len-1],
            baseAsset: symbol.replace(/.*_/g,"")
        };
          return transformed ;
        }
    }
    getTradeStream( trade,ticker) {
      //console.log('GETSTREAM',this.name,json, symbol);
      var transformed = {};
      var timestamp, date, formatted, time;
          if(this.name === 'Bitmart'){

           
           // console.log('Pre Transform', trade)
            // if(trade.cost !== undefined && trade.cost.length > 0){
            //   return trade;
            // }

            // if(trade.state == 8){
            //   transformed.order_id = trade.order_id ;
            //   transformed.state = 'CANCELED' ;
            //   return transformed;
            // }

            
            var  state, status;
            //console.log('MST1', trade.ms_t)
           if(trade.ms_t !== undefined){
             time = trade.ms_t;
             //console.log('MST2', time)
             timestamp = Number.parseInt(time)  ; //convert to milli's
             //console.log('MST3', timestamp)
           } else {
             time = trade.create_time;
             timestamp = Number.parseInt(time) + 1000; //convert to milli's
           }
            // date.toLocaleString("en-US", {year: "numeric"}) + '-' + 
            date = new Date(timestamp)
            //console.log('MST4', date)
            formatted = date.toLocaleString("en-US", {month: "numeric"}) + '-' +
            date.toLocaleString("en-US", {day: "numeric"}) + ' ' +
            date.toLocaleTimeString('en-US')
  //       {
//           "order_id":2147601241,
//           "symbol":"BTC_USDT",
//           "create_time":1591099963000,
//           "side":"sell",
//           "type":"limit",
//           "price":"9000.00",
//           "price_avg":"0.00",
//           "size":"1.00000",
//           "notional":"9000.00000000",
//           "filled_notional":"0.00000000",
//           "filled_size":"0.00000",
//           "status":"4"
// 1=Order failure
// 2=Placing order
// 3=Order failure, Freeze failure
// 4=Order success, Pending for fulfilment
// 5=Partially filled
// 6=Fully filled
// 7=Canceling
// 8=Canceled
//       }
// let statusEnum = ['Order failure', 'Placing order', 
// 'Order failure - Freeze failure','Order success-Pending for fulfilment',
// 'Partially filled', 'Fully filled', 'Canceling', 'Canceled']


          if(trade.state === "1" || trade.state === "3" ){
            state = 'REJECTED';
            status = 'REJECTED state:'+trade.state;
          }
          if(trade.state === "8" || trade.state === "7" ){
              state = 'CANCELED';
              status = 'CANCELED state:'+trade.state;
          }
          if(trade.state === "2" || trade.state === "4" || trade.state === "5" || trade.state === "6" ){
            state = 'NEW';
            status = 'NEW state:'+trade.state;
          }

            transformed = {
              order_id: parseInt(trade.order_id),
              avg_price: (trade.price !== undefined && trade.price !== null && trade.price.length > 0) ? trade.price.match(/.*[1-9]/gm)[0] : '', 
              price: (trade.price !== undefined && trade.price !== null && trade.price.length > 0) ? trade.price.match(/.*[1-9]/gm)[0] : '',
              pair: trade.symbol.replace('_', '/'),
              side: trade.side,
              qty: parseFloat(trade.size).toFixed(2),
              cost: (trade.notional !== undefined && trade.notional.length > 0) ? parseFloat(trade.notional).toFixed(2) : trade.filled_notional !== undefined ? parseFloat(trade.filled_notional).toFixed(2) : '' ,
              base:trade.symbol.split('_')[1],
              order_type:  trade.type === 'market' || trade.type === 'M'? 'Market': 'Limit' ,
              transaction_date: formatted,
              status: status,
              state: state
            }
  
           // console.log('Post Transform', transformed)
  
            return transformed;
          }
          if(this.name === 'Binance'){
           
          //   {
          //     "e": "executionReport",
          //     "E": 1622812265611,
          //     "s": "DOGEUSD",
          //     "c": "web_aa4d10978ef54eabb2326f7d32bc0570",
          //     "S": "SELL",
          //     "o": "LIMIT",
          //     "f": "GTC",
          //     "q": "26.00000000",
          //     "p": "0.9900",
          //     "P": "0.0000",
          //     "F": "0.00000000",
          //     "g": -1,
          //     "C": "web_2df29c1a353c4a18b538f4f2195e3328",
          //     "x": "CANCELED",
          //     "X": "CANCELED",
          //     "r": "NONE",
          //     "i": 85245149,
          //     "l": "0.00000000",
          //     "z": "0.00000000",
          //     "L": "0.0000",
          //     "n": "0",
          //     "N": null,
          //     "T": 1622812265610,
          //     "t": -1,
          //     "I": 182468972,
          //     "w": false,
          //     "m": false,
          //     "M": false,
          //     "O": 1622810861818,
          //     "Z": "0.0000",
          //     "Y": "0.0000",
          //     "Q": "0.0000"
          // }
            //console.log('Pre Transform Binance', trade)
            if(trade.create_time !== undefined && trade.create_time.length > 0){
              return trade;
            }

            if(trade.e !== undefined && trade.e !== 'executionReport'){
              return trade;
            }
            
           
             time = trade.T;
             timestamp = Number.parseInt(time) + 1000; //convert to milli's
           
            // date.toLocaleString("en-US", {year: "numeric"}) + '-' + 
            date = new Date(timestamp)
            formatted = date.toLocaleString("en-US", {month: "numeric"}) + '-' +
            date.toLocaleString("en-US", {day: "numeric"}) + ' ' +
            date.toLocaleTimeString('en-US')
            let cost =  parseFloat(trade.p) * parseFloat(trade.q)

            transformed = {
              order_id: trade.i,
              avg_price: trade.p ,//(trade.p !== undefined && trade.p.length > 0) ? trade.p : '', 
              price: trade.p, //(trade.p !== undefined && trade.p.length > 0) ? trade.p.match(/.*[1-9]/gm)[0] : '',
              pair: ticker.replace('_', '/'),
              side: trade.S,
              qty: parseFloat(trade.q).toFixed(2),
              cost: cost.toFixed(2)  ,
              base:ticker.split('_')[1],
              order_type:  trade.o === 'market' || trade.o === 'MARKET'? 'Market': 'Limit' ,
              transaction_date: formatted,
              status: (trade.X !== undefined) ? trade.X : '',
              state: (trade.x !== undefined) ? trade.x : ''
            }

            //console.log('POST Transform Binance', transformed)

            return transformed ;
          }
      }
  }
  module.exports = Transformer ;