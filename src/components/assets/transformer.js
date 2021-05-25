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

class Transformer {
    constructor(exchangeName) {
      this.name = exchangeName;
    }

    getStream( json, symbol, prevPrices) {
    //console.log('GETSTREAM',this.name,json, symbol);
        if(this.name === 'Bitmart'){
          var transformed = {};
          var len = prevPrices.length;
          var priceStyle = '';
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



          return transformed;
        }
        if(this.name === 'Binance'){
          var transformed = {};
          var len = prevPrices.length
          var priceStyle = '';
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
  }
  module.exports = Transformer ;