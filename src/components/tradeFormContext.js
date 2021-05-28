import React from 'react';
const  state = {
    onTabSelect: {},
    prev: '',
    setTab:{},
    tab: '',
    selectedTicker:'',
    exchange: [],
  } ;
const TradeFormContext = React.createContext(state);
  
export default TradeFormContext