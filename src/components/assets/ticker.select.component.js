import React from 'react';
import Select from "react-select";
//import axios from 'axios';
//var opts = [{ value: 'SHIB_USDT', label: 'SHIB_USDT' }]
//props.options
 const TickerSelect = props => (
    <Select classNamePrefix="react-select" className="react-select-container" options={props.options} onFocus={props.onFocus} onChange={props.onChange} />
)

export default TickerSelect;