import React from 'react';
import TickerSelect from './ticker.select.component';


const TickerDropdown = props => {
    //console.log(props)
    //let exchange = props.exchange;
   // let tickers = [];

    

// React.useEffect(() => {

 


// },[props.symbol]);

    return (

    <TickerSelect style={props.style} options={props.tickers} onFocus={props.onFocusTicker} onChange={props.onChangeTicker} />

    )
}

export default TickerDropdown

