import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TickerSelect from "./assets/ticker.select.component";
import Spot from "./assets/spot.component";
import Depth from "./assets/depth.component";
//import Technicals from "./assets/technicals.component";
import Wallet from "./assets/wallet.component";
import AssetList from "./asset-list.component";
import { Tabs, Tab } from "react-bootstrap";
import {SET_ALERT} from './types';
import { AuthContext } from '../App';
import { useHistory } from "react-router";

 const  ExchangeTradeForm = (props) => {
// onTabSelect={onSelect} prev={prev} setTab={setKey} tab={key} exchange={props.exchange}
    
    
    const [orderType, setOrderType] = useState('limit');
    const [mounted, setMounted] = useState(false);
    const [current_price, setCurrent] = useState(0);
    
    const onSelect = k => {
        console.log('onSelect',k)
        setOrderType(k)
    }
        const {  dispatch } = React.useContext(AuthContext);
        //const { state, dispatch, data, setData } = React.useContext(AuthContext);
        var ex = JSON.parse(localStorage.getItem('exchanges'))
        let history = useHistory();
        //console.log('TAB:',props.tab)
        //var prevTab = props.tab;
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
        if(thisExchange[0] === undefined){
            history.push('/exchanges')
            dispatch({
                type: SET_ALERT,
                payload: {  message:'Configure your Exchanges by adding API Keys', alertType: 'success', timeout:3000}
            })
        }
        var initalState = {
            name: props.exchange.name,
            apiKey: thisExchange.length > 0 ? thisExchange[0].apiKey: '',
            url: props.exchange.url,
            tickers: [],
            asset: [],
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
const [wallet, setWallet]= useState([]);
useEffect(() => {

    
    
    if(data.price.length > 0 || data.qty.length > 0 || data.amount.length > 0 ){
        setData(
            {...data,
            price:'',
            amount: '',
            qty: ''}
        )
    }

}, []); 

useEffect(() => {
    if(data.price.length > 0 || data.qty.length > 0 || data.amount.length > 0 ){
        setData(
            {...data,
            price:'',
            amount: '',
            qty: ''}
        )
    }

}, [orderType]);

useEffect(() => {
    ;
     setMounted(true)
      axios.get(props.exchange.url+'/tickers').then(result => {
            
        result.data.tickers.forEach((ticker,i) => {

            result.data.tickers[i] = { value: ticker, label: ticker , orig:ticker.replace('_','')}
        })

        console.log('TICKERS:',props.exchange.url,result.data.tickers);
            let tickers = [];
            tickers[props.exchange.name]=result.data.tickers;
            setData({
            ...data,
            tickers:tickers
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
    
                setWallet(
                    result.data.wallet
                )
                //console.log('ACCOUNTDATA:',data);
    
            })
            
      return () => {
          //setData({})
          console.log('LEAVING')
      };
}, []);  


 const onFocusTicker = e => {

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
    
    let asset, sellAsset;
    //   setData({
        //       name: e.target.value
        //   });
        //console.log('MYWALLET',mywallet)
        if(props.tab === 'buy'){
            asset = e.value.replace(/.*_/g,"");
            sellAsset = e.value.replace(/_.*/g,"");
        } else {
            asset = e.value.replace(/_.*/g,"");
            sellAsset = e.value.replace(/.*_/g,"");
            
        }
        setData({
            ...data,
            selectedTicker: e.value ? e.value : "",
            baseAsset: e.value !== undefined ? asset : '',
            sellAsset: sellAsset
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
// const tabEvent = e => {
//     console.log('TABEVENT',e)
// }
const clearAmount = e => {
    setData(
        {...data,
        price:'',
        amount: '',
        qty: ''}
    )
}
const onChangeAmount = e => {
    let qty, amount;
    if(data.price.length < 1 && orderType === 'limit'){
        dispatch({
            type: SET_ALERT,
            payload: {  message:'Please Choose a price before setting qty', alertType: 'success', timeout:3000}
        })
        return;
    }

    if(props.tab === 'buy' && orderType === 'limit'){
         qty = Math.round(parseFloat(e.target.value) / parseFloat(data.price));
         amount = parseFloat(e.target.value).toFixed(2);
    } else if(props.tab === 'sell' && orderType === 'limit') {
        qty = e.target.value ;
        amount = Math.round(parseFloat(e.target.value) * parseFloat(data.price));
        amount = amount.toFixed(2)
    } else if(props.tab === 'buy' && orderType === 'market') {
        amount = parseFloat(e.target.value).toFixed(2);
        qty = '';
    } else if(props.tab === 'sell' && orderType === 'market'){
        amount = parseFloat(e.target.value).toFixed(2);
        qty='';
    }

    setData({
        ...data,
        amount: amount,
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
    
    console.log(`Form submitted:`, data.name);

    


}


       //console.log('RETURN FORM', data, props)
return (       
    
            <div className="pl-0" style={{marginTop: '10px', marginLeft:'2px', marginRight:'2px'}}>
                
                <form className="form-row pb-0 mb-0" style={{width:'100%'}} onSubmit={onSubmit}>
                    <div className="form-group col-sm-6 mb-0"> 
                    <TickerSelect options={data.tickers[props.exchange.name]} onFocus={onFocusTicker} onChange={onChangeTicker} />
                        <input  type="hidden"
                                className="form-control"
                                value={data.name}
                                onChange={onChangeName}
                                />
                    <h5 className="mt-9x">{props.exchange.name} </h5>
                    
                    {/* <Technicals /> */}
                    </div>
                    <div className="form-group col-sm-6 mb-0"> 
                    
                    <Spot PriceCallback={setCurrent} isMounted={mounted} onChangePrice={onChangePrice}  exchange={props.exchange} selectedTicker={data.selectedTicker}  />
                    
                    </div>

                    <Tabs onSelect={onSelect} defaultActiveKey="limit" id="market-limit" className="col-sm-12">
                <Tab eventKey="limit" title="Limit" className="col-sm-12">
                
                   <div className="row pt-2"> 
                   <div className="col-sm-6"> 
                    <div className="form-group"> 
                    
                        <input  type="text"
                                placeholder="Price"
                                className="form-control"
                                value={data.price}
                                onChange={onChangePrice}
                                />
                    </div>
                    <div className=""> 
                        <input  type="text"
                                placeholder="Quantity"
                                className="form-control"
                                value={data.qty}
                                onChange={onChangeQty}
                                />
                    </div>
                    <Wallet tab={props.tab} currentPrice={current_price} clearAmount={clearAmount} wallet={wallet} ticker={data.selectedTicker} setAmount={onChangeAmount}/>
                    <div className="form-group mb-0 pb-0"> 
                        <label>Total:</label> <div style={{display:'inline-block'}} onChange={onChangeAmount}>{data.amount}</div> 
                    </div>
                </div>
                <div className="col-sm-6 form-group">
                
                    <Depth onChangePrice={onChangePrice} clearTicker={clearTicker}  baseAsset={data.baseAsset}  exchange={props.exchange} selectedTicker={data.selectedTicker} prevSelectedTicker={data.prevSelectedTicker}  />
                </div>
                    
                </div>
                </Tab>
                <Tab eventKey="market" title="Market" className="col-sm-12">
                <div className="row pt-2">
                <div className="col-sm-6"> 
                <div className="form-group "> 
                        <input  type="text"
                                disabled="disabled"
                                placeholder="Optimal Market Price"
                                className="form-control"
                                value="Optimal Market Price"
                                
                                />
                </div>
                <div className=""> 
                        <input  type="text"
                                placeholder={ props.tab === 'buy' ? 'Total '+data.baseAsset : 'Total '+data.sellAsset}
                                className="form-control"
                                value={data.amount}
                                onChange={onChangeQty}
                                />
                </div>
                <div><Wallet clearAmount={clearAmount}  tab={props.tab} wallet={wallet} ticker={data.selectedTicker}  setAmount={onChangeAmount}/></div>
                    <div className="form-group mb-0"> 
                        <label>Total:{data.selectedTicker}</label> <div style={{display:'inline-block'}} onChange={onChangeAmount}>{data.amount}</div> 
                    </div>
                </div>
                <div className="col-sm-6 form-group">
                    
                    <Depth onChangePrice={onChangePrice} clearTicker={clearTicker}  baseAsset={data.baseAsset}  exchange={props.exchange} selectedTicker={data.selectedTicker} prevSelectedTicker={data.prevSelectedTicker}  />
                </div>
                </div>
                
                </Tab>
                </Tabs>
                    
                    <div className="form-group col-sm-12 pb-2 mb-0">
                        { props.tab ==='buy' ? <input type="submit" value="Place buy order" className="btn btn-success" /> :
                        <input type="submit" value="Place sell order" className="btn btn-danger" />
                    }
                    </div>
                    <AssetList onChangePrice={onChangePrice}
                      tickers={data.tickers}
                      data={data} clearTicker={clearTicker}
                      setData={setData} 
                      selectedTicker={data.selectedTicker} 
                      exchange={props.exchange} 
                      prevSelectedTicker={data.prevSelectedTicker}
                    />
                </form>
            {/* <div className="d-flex justify-content-between flex-wrap  align-items-center pb-2 mb-3 border-bottom"> */}
                {/* <Trade exchange={props.exchange} selectedTicker={data.selectedTicker} prevSelectedTicker={data.prevSelectedTicker}  /> */}
               
            {/* </div> */}
            </div>
        
        )
    
}
export default ExchangeTradeForm;
