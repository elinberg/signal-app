import Worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax
import axios from 'axios';
import TickerDropdown from "./assets/ticker.dropdown"
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useHistory } from "react-router";
import { SET_ALERT } from './types';
import { AuthContext } from '../App';
import myconfig from "./config";
//import SharedWorker from 'workerize-loader!./sharedWorker'; // eslint-disable-line import/no-webpack-loader-syntax
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { filter } from 'rxjs/operators';
import { stat } from '@nodelib/fs.stat';
import { STATEMENT_OR_BLOCK_KEYS } from '@babel/types';
const lwc = require('lightweight-charts')
//const config = require("./config")
// eslint-disable-next-line import/no-webpack-loader-syntax
//import Worker from 'workerize-loader!./worker' 

//import Worker from './worker';
//import { REMOVE_ALERT, SET_ALERT } from "../components/types";

var chartCount = 0;
//const [data, dispatch] = React.useReducer(reducer, initialState);
export const ChartContext = React.createContext();
const reducer = (data, action) => {
  console.log('REDUCER', action)
  switch (action.type) {
    case 'GET_DATA':

      return {
        ...data,
        chartData: action.payload.chartData
      };
    default:
      return data;
  }
}
const EditAsset = props => {
  console.log('PROPS', props)
  var series = []
  var ticker = '';
  let interval = '1m';

  const [data, dispatch] = React.useReducer(reducer, { chartData: [] });
  // const [data, setData] = React.useState(initalData);
  let width, height, endpoint, msg, container, chartEl, work, worker
  let chartData = data;
  const exchangeName = 'Binance';
  //const { dispatch } = React.useContext(AuthContext);
  let history = useHistory();
  const [state, setState] = useState({ tickers: [], tick: '', tickerData: [], interval: interval, candles: {}, lwc: {}, series:[] ,container: {} });

  
  let chart, candles
  //let charts = [];

  //const handleChart = useCallback((id) => state.setData(id),[state.tickerData])
  // useEffect(() => {
  //   console.log('useEffect', chartCount, state)
  //   console.log('EDIT ASSET FROM TICKERS GOT', state, chartData)
  //   chartCount++






  // }, [state.tick])

  // React.useEffect(() => {
  //   chartCount++
  //   console.log('useLayoutEffect', chartCount, state, chartData)

  //   // container = document.getElementById('chart')
  //   // chart = lwc.createChart(container, { width: 400, height: 300 });
  //   // candles = chart.addCandlestickSeries();
  //   // candles.setData(data.chartData)

  // }, [state.tick])






  //work = new CustomEvent('work', { detail: {msg:'Hello World' } });




  if (state === undefined) {
    return null
  }
  return (
    <ChartContext.Provider
      value={{
        data,
        dispatch
      }}>
      <div className="container" id='container' style={{ height: '200px' }} >
        {<Tickers exchangeName={exchangeName} setState={setState} state={state} />}
      </div>
    </ChartContext.Provider>
  )

}

export default EditAsset



let worker;
let series = [];
const Tickers = (props) => {
  var [state, setState] = useState([]);
  var [interval, setInterval] = useState('1m');
  const { dispatch } = React.useContext(ChartContext);
  var msg;
  const [symbol, setSymbol] = useState({symbol:"",symbolOrig:"",symbolOrigLower:""})
  // psuedo constructor
  useEffect(() => {
    getTickerData(props.exchangeName)

  }, [])


  /// props.setState({...props.state,onChange:props.onChange,onFocus:props.onFocus})
  useEffect(() => {


    return () => {


    }
  }, [])

  //console('WORKER STATUS',status);

  useEffect(() => {

    if (worker === undefined || state.series === undefined) {
      return;
    }
    //setState({...state,tick:props.state.tick,symbol:props.state.symbol})
    console.log('STARTING LISTEN WORKER', state) //,props.tick, props.symbol
    //setState({...state,tick:props.tick,symbol:props.symbol})
    startWorker(props)
    // msg = JSON.stringify({ cmd: 'open', data: { symbol: 'btcusd', interval: interval } })
    // worker.postMessage(msg)

    // msg = props.state.tick+'@kline_'+interval
    // msg = JSON.stringify({ cmd: 'subscribe', data: [msg]  })

    // worker.postMessage(msg)
    let endpoint = props.state.tick + '@kline_' + interval
    msg = JSON.stringify({ cmd: 'unsubscribe', data: endpoint })

    //worker.postMessage(msg)

    //msg = JSON.stringify({ cmd: 'open', data: { symbol: props.state.tick, interval: interval } })
    //worker.postMessage(msg)

    msg = props.state.tick + '@kline_' + interval
    //msg = JSON.stringify({ cmd: 'subscribe', data: [msg]  })

    //worker.postMessage(msg)


    return () => {
      // let endpoint = props.state.tick+'@kline_'+interval
      // msg = JSON.stringify({ cmd: 'unsubscribe', data: endpoint })
      //state.worker.postMessage(JSON.stringify({ cmd: 'close', data: "" }))
      // worker.postMessage(msg)
      // console.log('WORKER EXITING', msg)

      //worker.terminate()
    }

  }, [symbol, state.candle]) //props.state.tick, state.candle





  const startWorker = () => {

    // window.addEventListener('work',(e) => {
    //if(chartCount === 0){
    // setState({...state,tick:e.detail.tick})
    console.log('LISTEN WORKER', state, props, symbol)
    //worker = Worker();
    // setState({...state, worker:worker})

    state.worker.addEventListener('message', event => {
      console.log('STUCK', event, state, symbol)
      if ((event === undefined || event.data === undefined ||
        event.data.k === undefined || state === undefined ||
        state.series === undefined || state.candle === undefined || symbol === undefined ||
        symbol.symbolOrig === undefined)) {
        //console.log('WORKER READY')
        console.log('STUCK 2', state.series, state.series.length, state.series[state.series.length - 1])
        return
      } else if (event.hasOwnProperty('data') && event.data.hasOwnProperty('result')) {
        console.log('GOT ID FROM REPLY',  event.data.id)
        //return
      } else {

      }



      let t = {};
      let time;
      let len = state.series.length;
      let open, close, high, low;
      console.log('STUCK AGAIN', state.series, state.series.length, state.series[state.series.length - 1])
      time = Number(parseFloat(Number(event.data.k.T) / 1000).toFixed(0))
      
      // here we are consolidating frames with same timestamp
      if (state.series[len - 1].time !== time) {
        open = event.data.k.o;
        close = open
        low = open
        high = open
      } else {
        open = event.data.k.o;
        close = event.data.k.c
        low = event.data.k.l
        high = event.data.k.h
      }
      let data
      console.log('WORKER MATCH?', event.data.k.s.toLowerCase(), symbol.symbolOrigLower) //todo
      if (state.series[len - 1].time > time || (event.data.k.s.toLowerCase() !== symbol.symbolOrigLower)) {
        console.log('We got negtive time or stagnant data')
        state.series = [];
        data = { time: time, open: open, high: high, low: low, close: close }
        console.log('SERIES PUSH', data)
        // i don't think we push bad data and del seems excessive
        state.series.push(data);



      } else {
        data = { time: time, open: open, high: high, low: low, close: close }
        //console.log('SERIES PUSH', data)
        state.series.push(data);
        //candles.update(data);
        state.candle.update(data)
        //candleCallback(data)
      }
      //console.log('SPLICE',state.series.splice(-2020));

      // setState(state.series.splice( 2002, state.series.length));
    });


  }


  const onChangeTicker = (e) => {
    //console.log('useCallback onChangeTicker', e.orig.toLowerCase(), props.state.tick, worker)
    //symbol:"",symbolOrig:"",symbolOrigLower
    console.log("CHANGE TICKER", e)
    setSymbol({symbol:e.value,symbolOrig:e.orig,symbolOrigLower:e.orig.toLowerCase()})
    let endpoint;
    if (e.orig.length > 0 && e.orig.toLowerCase() !== props.state.tick && worker !== undefined) {

      if (props.state.tick.length < 2) {
        endpoint = 'btcusd@kline_' + interval
        msg = JSON.stringify({ cmd: 'unsubscribe', data: endpoint })
        console.log('WORKER SENT 1', msg)
        state.worker.postMessage(msg)
      } else {
        endpoint = props.state.tick + '@kline_' + interval
        msg = JSON.stringify({ cmd: 'unsubscribe', data: endpoint })
        console.log('WORKER SENT 2', msg)
        state.worker.postMessage(msg)
      }

      endpoint = e.orig.toLowerCase() + '@kline_' + interval
      msg = JSON.stringify({ cmd: 'subscribe', data: endpoint })
      console.log('WORKER SENT 3', msg, worker)
      state.worker.postMessage(msg)

    } 

    

    // setState({
    //   ...state,
    //   tick: e.orig.toLowerCase(),
    //   symbol: e.value
    // })

    props.setState({
      ...props.state,
      tick: e.orig.toLowerCase(),
      symbol: e.value
    })



    console.log('GETTING OHLC', 'https://min-api.cryptocompare.com/data/v2/histominute?fsym=' + e.value.toLowerCase().split('_')[0] + '&tsym=' + e.value.toLowerCase().split('_')[1] + '&limit=2000');
    //let transformer = new _transform(props.exchange.name);
    axios.get('https://min-api.cryptocompare.com/data/v2/histominute?fsym=' + e.value.toLowerCase().split('_')[0] + '&tsym=' + e.value.toLowerCase().split('_')[1] + '&limit=2000', {
      headers: {
        'Authorization': 'Apikey 1c35565e7226ccec84e773a6d3b890a9dc17d99f82ea4151d074802c2ccec132'
      }
    })
      .then(res => {

        //let msg = JSON.stringify({ cmd: 'open', data: { symbol: e.orig.toLowerCase(), interval: interval } })


       
        res.data.Data.Data[0].symbol = e.orig;
        series = res.data.Data.Data
        console.log('SERIES INIT', series)
        setState({ ...state, chartData: res.data.Data.Data, series: series });




        //endpoint = symbol+'@kline_'+interval
        //work = new CustomEvent('work', { detail: {msg:msg,data:res.data.Data.Data,series:series, symbol:e.orig.toLowerCase(), tick:state.tick}  });
        //window.dispatchEvent(work )

        //worker.postMessage(msg);
      }).catch(e => {
        console.log(e)
      })
    // props.setState({
    //   ...props.state,
    //   tick: e.orig.toLowerCase(),
    //   symbol: e.value
    // })

  }

  const getTickerData = (exchangeName) => {

    var ex = JSON.parse(localStorage.getItem('exchanges'))

    var currentExchange = ex.filter(exchange =>
      exchangeName === exchange.name
    )
    if (currentExchange) {
    } else {
      currentExchange = [{
        name: exchangeName,
        apiKey: '',
        secret: ''
      }];
    }

    let get = async () => {
      const response = await fetch('/api/exchange/' + currentExchange[0].exchangeId)
      const exchange = await response.json()
      console.log('TICKS',Array(exchange.tickers))
      exchange.tickers.forEach((ticker, i) => {
        exchange.tickers[i] = { value: ticker, label: ticker, orig: ticker.replace('_', '') }
      })

      props.setState({ ...props.state, tickers: exchange.tickers });


    }
    get();


    console.log('STARTING WORKER', state, props.state, props)

    worker = Worker();
    setState({ ...state, worker: worker })
    msg = JSON.stringify({ cmd: 'open', data: { symbol: 'btcusd', interval: interval } })
    worker.postMessage(msg)
    // worker.addEventListener('message', event => {
    //     console.log('EVENT', event)
    // })


    if (currentExchange[0] === undefined) {
      //history.push('/exchanges')
      // dispatch({
      // type: SET_ALERT,
      // payload: {  message:'Configure your Exchanges by adding API Keys', alertType: 'success', timeout:3000}
      // })
    }



  }



  return (
    <div>
      <TickerDropdown style={{ zIndex: '100' }} tickers={props.state.tickers} onChangeTicker={onChangeTicker} />
      <Chart symbol={props.state.symbol} setState={setState} state={state} tick={props.state.tick} className="mt-5" data={state.chartData} />
    </div>




  )

}

///end tickers

const Chart = (props) => {
  var [prev, setPrev] = React.useState('')
  var [oldChart, setOldChart] = React.useState({})
  var [oldCandle, setOldCCandle] = React.useState({})
  var [flag, setFlag] = React.useState(false)
  var [oldToolTip, setToolTip] = React.useState(false)
  React.useEffect(() => {
    let data = props.data;
    let container;
    let chart;
    let candles;
    if (data === undefined) {
      // console.log('UNDEFINED')
      // container = document.getElementById('chart')
      // chart = lwc.createChart(container, { width: 400, height: 300 });
      // candles = chart.addCandlestickSeries();
      return null;
    }

    let callback = props.candleCallback

    // callback = props => {
    //   console.log('CALLBACK')
    // }

    container = document.getElementById('chart')

    //console.log('CHART OPTIONS', data, data[0].symbol.toLowerCase(), props.tick,prev)
    var opt = {
      upColor: '#28a745',
      downColor: '#dc3545',
      borderVisible: false,
      wickVisible: true,
      borderUpColor: '#4682B4',
      borderDownColor: '#A52A2A',
      wickUpColor: '#28a745',
      wickDownColor: '##dc3545',
    }
    if (data[0].symbol.toLowerCase() !== prev && prev.length > 0) {
      //console.log('CHART CHANGED',oldCandle)
      chart = oldChart;
      chart.removeSeries(oldCandle)
      candles = chart.addCandlestickSeries(opt);
      setOldCCandle(candles)
      //setFlag(true)
    } else {
      chart = lwc.createChart(container, { width: 600, height: 400, });
      chart.applyOptions(myconfig)
      //setFlag(false)
      candles = chart.addCandlestickSeries(opt);
      setOldChart(chart)
      setOldCCandle(candles)
    }
    setPrev(props.tick)

    candles.setData(data);

    console.log('CANDLES', data)
    props.setState({ ...props.state, candle: candles })
    //

    ////// update candles

    var toolTipWidth = 80;
    var toolTipHeight = 80;
    var toolTipMargin = 15;

    var toolTip;

    container = document.getElementById('container')
    if (flag) {
      // chart changed
      toolTip = document.getElementById('toolTip')
      container.removeChild(toolTip)
      toolTip = document.createElement('div');
      toolTip.className = 'floating-tooltip-2';
      toolTip.id = 'toolTip';
      container.appendChild(toolTip);
      //console.log('TOOLTIP CHANGED', container, toolTip, oldToolTip, document.getElementsByClassName('floating-tooltip-2'))

    } else {
      setFlag(true)
      //old Tooltip
      toolTip = document.createElement('div');
      toolTip.className = 'floating-tooltip-2';
      toolTip.id = 'toolTip'
      container.appendChild(toolTip);
      console.log('TOOLTIP ORIG', container, toolTip)
      setToolTip(toolTip)
    }


    chart.subscribeCrosshairMove(function (param) {
      let width = 600;
      let height = 400;
      //console.log("SERIES", param)
      if (!param.time || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height) {
        toolTip.style.display = 'none';
        return;
      }

      var dateStr = lwc.isBusinessDay(param.time)
        ? lwc.businessDayToString(param.time)
        : new Date(param.time * 1000).toLocaleDateString();

      toolTip.style.display = 'block';
      var price = param.seriesPrices.get(candles);
      //console.log("SYMBOL",props.symbol,price)
      if (price === undefined || price.close === undefined) { //|| param.time
        return
      }
      //console.log("SERIESTIP",toolTip)
      var pc = parseFloat(price.close) > 1 ? parseFloat(price.close) : parseFloat(price.close).toFixed(10)
      //console.log("SERIESDATE",pc)
      toolTip.innerHTML = '<div style="color: rgba(255, 70, 70, 1)">' + props.symbol + '</div>' +
        '<div style="font-size: 12px; margin: 4px 0px">' + pc + '</div>' +
        '<div>' + dateStr + '</div>';
      // console.log("TOOL", toolTip);
      var y = param.point.y;

      var left = param.point.x + toolTipMargin;
      if (left > width - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth;
      }

      var top = y + toolTipMargin;
      if (top > height - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin;
      }

      toolTip.style.left = left + 'px';
      toolTip.style.top = top + 'px';

    });
    chart.timeScale().fitContent();


    //console.log('SERIES OPTIONS', data, opt)

  }, [props.data])




  return (

    <div id="chart" />

  )

}
