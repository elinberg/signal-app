import React, {Component} from 'react';
import { findDOMNode } from "react-dom";
import Helmet from 'react-helmet';

 class  Technicals extends Component {

constructor(props){
    super(props)
    // this.data =       {
    //     "interval": "15m",
    //     "width": "100%",
    //     "isTransparent": false,
    //     "height": "100%",
    //     "symbol": "BINANCE:SHIBUSDT",
    //     "showIntervalTabs": true,
    //     "locale": "en",
    //     "colorTheme": "light"
    //   };
}
    componentDidMount() {
        // const script = document.createElement("script");
        // script.async = true;
        // script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
        // //const el =findDOMNode(this.domRef)
        // script.innerHTML=  JSON.stringify({
        //     "interval": "15m",
        //     "width": "100%",
        //     "isTransparent": false,
        //     "height": "50%",
        //     "symbol": "BINANCE:SHIBUSDT",
        //     "showIntervalTabs": false,
        //     "locale": "en",
        //     "colorTheme": "light"
        //   })
        
        // document.getElementById('tradingview').appendChild(script);
        // console.log('SCRIPTS',document.getElementById('tradingview'))
         
      }
render(){
    return(null)
return (


    <div class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
      <div id="tradingview" class="tradingview-widget-copyright"></div>
      
    </div>


)
}
}

export default Technicals;