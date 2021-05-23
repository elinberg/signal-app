import React, {Component} from 'react';
import Select, {components} from "react-select";
//import axios from 'axios';
//var opts = [{ value: 'SHIB_USDT', label: 'SHIB_USDT' }]
//props.options
 const TickerSelect = props => (
    <Select style={props.style} options={props.options} onFocus={props.onFocus} onChange={props.onChange} />
)

export default TickerSelect;