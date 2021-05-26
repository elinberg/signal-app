import React, { Component , useRef, useState, useEffect} from 'react';
import axios from 'axios';
import TickerSelect from "./assets/ticker.select.component";
import Spot from "./assets/spot.component";
import Depth from "./assets/depth.component";
import Technicals from "./assets/technicals.component";
import Wallet from "./assets/wallet.component";
//import Kline from "./assets/kline.component";
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container} from "react-bootstrap";
import { w3cwebsocket as W3CWebSocket } from "websocket";
//const {unzip} = require("./zlib.min")
//const zlib = require("zlib")
import zlib from "zlib"
import { AuthContext } from '../App';




 const  ExchangeTradeFormBuy = (props) => {

        const { state, dispatch } = React.useContext(AuthContext);
        
        //const spotref=useRef();
        //onChangeTicker = onChangeTicker.bind(this);
        
        //onSubmit = onSubmit.bind(this);
        var ex = JSON.parse(localStorage.getItem('exchanges'))
        console.log('local',ex, props)
        console.log('TAB:',props.tab)
        
        var thisExchange = ex.filter(exchange => 
            props.exchange.name === exchange.name
        )
        if(thisExchange){ 
        } else {
            thisExchange = [{ 
                name: props.exchange.name,
                apiKey: '',
                secret: ''}];        
        }
        
        var initalState = {
            name: props.exchange.name,
            apiKey: thisExchange.length > 0 ? thisExchange[0].apiKey: '',
            url: props.exchange.url,
            tickers: [],
            amount: '',
            qty: '',
            lastPrice:'',
            selectedTicker: '',
            baseAsset:'',
            price:'',
            tickerEndpoint: props.exchange.tickerEndpoint,
            secret: thisExchange.length > 0 ? thisExchange[0].secret: ''
        }

        const [data, setData]= useState(initalState);
        const [wallet, setWallet]= useState({wallet:[]});
        console.log('exchange',props.exchange);
        
    console.log('B4UseEffect', data);    
useEffect(() => {
    //setData(data);
    onChangeTab = onChangeTab.bind(props.onTabSelect);
     console.log('DuringUseEffect', props, data)
console.log(props.exchange.url)
      axios.get(props.exchange.url+'/tickers').then(result => {
            
        result.data.tickers.map((ticker,i) => {

            result.data.tickers[i] = { value: ticker, label: ticker }
        })

        console.log('TICKERS:',props.exchange.url,result.data.tickers);
            
            setData({
            ...data,
            tickers:result.data.tickers
            })

        });
        //if(props.exchange.name == 'Bitmart'){
            console.log('URL',props.exchange.url)
            axios.get(props.exchange.url+'/accounts', {
                headers: {
                'xbmkey': data.apiKey,
                'xbmsecret': data.secret
                }
            }).then(result => {
            
            console.log('WALLET',result.data.wallet)
    
                setWallet({
                wallet:result.data.wallet
                })
                //console.log('ACCOUNTDATA:',data);
    
            })
        //}
      return () => {
          //setData({})
      };
}, []);  

  let onChangeTab = e => {
      console.log('Tab Event');
  }

 const onFocusTicker = e => {

     console.log("FOCUS", this);
     setData({
            ...data,
            prevSelectedTicker: data.selectedTicker ? data.selectedTicker : "",
            
          });
 }
 const clearTicker = e => {
    setData({
        ...data,
        selectedTicker:  "",
        baseAsset:  ''

      });
 }
const onChangeTicker = e => {
    //    
console.log('OnChangeTicker', e)
    
    let asset;
    //   setData({
        //       name: e.target.value
        //   });
        //console.log('MYWALLET',mywallet)
        if(props.tab == 'buy'){
            asset = e.value.replace(/.*_/g,"");
        } else {
            asset = e.value.replace(/_.*/g,"");
        }
        setData({
            ...data,
            selectedTicker: e.value ? e.value : "",
            baseAsset: e.value !== undefined ? asset : ''
          });
          //data.wallet.filter( account => account.id === e.value.replace(/.*_/g,"") )
       // console.log('FILTERED WALLET',data.wallet, e.value.replace(/.*_/g,""));
  
}


//const { Provider, Consumer } = React.createContext();

const onChangeName = e => {
        setData({
            ...data,
            name: e.target.value
        });
        
}
const onChangeAmount = e => {
    console.log(e.target.value,data.amount, parseFloat(e.target.value),parseFloat(data.amount))
    let qty = Math.round(parseFloat(e.target.value) / parseFloat(data.price));
    setData({
        ...data,
        amount: e.target.value,
        qty: qty
    });
    
}
const onChangePrice = e => {
    
    setData({
        ...data,
        price: e.target.value
    });  
}

const onChangeQty = e => {
    setData({
        ...data,
        qty: e.target.value
    });  
}

 

function onSubmit(e) {

    e.preventDefault();
    
    console.log(`Form submitted:`, data.name);;

    // const data = ex.filter(exchange => 
    //     data.name !== exchange.name
    // )

    // data.push({ name: data.name, secret: data.secret, apiKey:data.apiKey})
    // localStorage.setItem('exchanges', JSON.stringify(data));
    // props.hideModal();
    //console.log(props)
}
     
       
       console.log('RETURN FORM', data, props)
return (       
            <div className="container pl-0" style={{marginTop: '10px', marginLeft:'2px', marginRight:'2px'}}>
                
                <form className="form-row" style={{width:'100%'}} onSubmit={onSubmit}>
                    <div className="form-group col-sm-6"> 
                    <TickerSelect class={{width:'8rem'}} options={data.tickers} onFocus={onFocusTicker} onChange={onChangeTicker} />
                        <input  type="hidden"
                                className="form-control"
                                value={data.name}
                                onChange={onChangeName}
                                />
                    {/* <Spot onRef={ref => (spot = ref)} baseAsset={data.baseAsset}  exchange={props.exchange} clearTicker={clearTicker} selectedTicker={data.selectedTicker}  /> */}
                    <Technicals />
                    </div>
                    <div className="form-group col-sm-6"> 
                    
                    <Spot onChangePrice={onChangePrice} clearTicker={clearTicker}  baseAsset={data.baseAsset}  exchange={props.exchange} selectedTicker={data.selectedTicker} prevSelectedTicker={data.prevSelectedTicker}  />
                    
                    </div>

                    <Tabs defaultActiveKey="limit" id="controlled-tab-example" className="col-sm-12">
                <Tab eventKey="limit" title="Limit" className="col-sm-12">
                
                   <div className="row pt-2"> 
                   <div className="col-sm-6"> 
                    <div className="form-group"> 
                        <label>Price</label>
                        <input  type="text"
                                className="form-control"
                                value={data.price}
                                onChange={onChangePrice}
                                />
                    </div>
                    <div className="form-group"> 
                        <label>Qty</label>
                        <input  type="text"
                                className="form-control"
                                value={data.qty}
                                onChange={onChangeQty}
                                />
                    </div>
                    <Wallet tab={props.tab} wallet={wallet.wallet} ticker={data.selectedTicker} setAmount={onChangeAmount}/>
                    <div className="form-group"> 
                        <label>Total:<div onChange={onChangeAmount}>{data.amount}</div> </label>
                    </div>
                </div>
                <div className="col-sm-6">
                    Depth
                    <Depth onChangePrice={onChangePrice} clearTicker={clearTicker}  baseAsset={data.baseAsset}  exchange={props.exchange} selectedTicker={data.selectedTicker} prevSelectedTicker={data.prevSelectedTicker}  />
                </div>
                    
                </div>
                </Tab>
                <Tab eventKey="market" title="Market" className="">
                <div className="row pt-2">
                <div className="col-sm-6"> 
                <div className="form-group "> 
                        <label>Amount</label>
                        <input  type="text"
                                className="form-control"
                                value={data.name}
                                onChange={onChangeName}
                                />
                </div>
                <div><Wallet tab={props.tab} wallet={wallet.wallet} ticker={data.selectedTicker}  setAmount={onChangeAmount}/></div>
                    <div className="form-group"> 
                        <label>Total:<div onChange={onChangeAmount}>{data.amount}</div> </label>
                    </div>
                </div>
                <div className="col-sm-6">
                    Depth
                    <Depth onChangePrice={onChangePrice} clearTicker={clearTicker}  baseAsset={data.baseAsset}  exchange={props.exchange} selectedTicker={data.selectedTicker} prevSelectedTicker={data.prevSelectedTicker}  />
                </div>
                </div>
                
                </Tab>
                </Tabs>
                
                    <div className="form-group"> 
                        
                        <input  type="hidden"
                                className="form-control"
                                value={data.name}
                                onChange={onChangeName}
                                />
                    </div>
                    
                    <div className="form-group">
                       
                        <input 
                                type="hidden" 
                                className="form-control"
                                value={data.apiKey}
                                
                                />
                    </div>
                    <div className="form-group">
                        {/* <label>Secret: </label> */}
                        <input 
                                type="hidden" 
                                className="form-control"
                                value={data.secret}
                                
                                />
                    </div>
                    

                    <div className="form-group col-sm-12">
                        { props.tab ==='buy' ? <input type="submit" value="Place buy order" className="btn btn-success" /> :
                        <input type="submit" value="Place sell order" className="btn btn-danger" />
                    }
                    </div>
                </form>
            </div>
        )
    
}
export default ExchangeTradeFormBuy;
