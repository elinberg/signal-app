import React, { Component } from 'react';
import axios from 'axios';
//import Spot from "./assets/ticker.select.component";
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container} from "react-bootstrap";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import zlib from "zlib"


export default class Spot extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.client = {readyState:3}; //closed
        //this.onChangeTicker = this.onChangeTicker.bind(this);
        this.leaving = false;
        this.ex = JSON.parse(localStorage.getItem('exchanges'))
        console.log('local',this.ex)
        this.thisExchange = this.ex.filter(exchange => 
            props.exchange.name === exchange.name
        )
        if(this.thisExchange){ 
        } else {
            this.thisExchange = [{ 
                name: props.exchange.name,
                apiKey: '',
                secret: '',}];        
        }

        this.state = {
            name: props.exchange.name,
            apiKey: this.thisExchange.length > 0 ? this.thisExchange[0].apiKey: '',
            secret: this.thisExchange.length > 0 ? this.thisExchange[0].secret: '',
            url: props.exchange.url,
            high24hr: '',
            low24hr: '',
            open24hr: '',
            volume24hr: '',
            lastPrice:'',
            priceStyle:'' ,
            prevPrice:'0.00' ,
            selectedTicker: this.props.selectedTicker.length > 0 ? this.props.selectedTicker : '',
            prevSelectedTicker: this.props.selectedTicker,
            tickerEndpoint: this.props.exchange.tickerEndpoint,
            secret: this.thisExchange.length > 0 ? this.thisExchange[0].secret: '',
        }
        console.log('exchange',props.exchange,props);
        
        
        
    }

 

componentWillUnmount() {
   this.props.onRef(undefined);
    this.leaving = true;
    let msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/ticker:"+localStorage.getItem('selectedTicker')]});
    localStorage.setItem('selectedTicker', undefined);
    this.ws_send(msg,true);
    //this.client.close();
    clearInterval(this.intervalId);
    console.log('Leaving', msg);
}  

componentDidMount() {

    this.client = new W3CWebSocket('wss://ws-manager.bitmart.com?protocol=1.1');
    this.client.binaryType='blob';
    //this.props.onRef(this);
    this.props.onRef(this)
    this.client.onopen = () => {
        console.log('WebSocket Client Connected');

        this.intervalId = setInterval(() => {
            this.client.send("ping")
        }, 10000);
        //this.client.send("ping");

        };
        this.client.onmessage =  (event) => {

        // if (compressed == "pong") {
        //     console.log('Pong');
        //        // return ;
        // }

        // var timerId = setTimeout(() => {
        //     this.client.send("ping");
        // }, 10000);

        // var intervalId = setInterval(() => {
            
        // }, 10000);

        //clearInterval(intervalId)

        if(this.client.readyState !== 1){
            return;
        }

        if(event.data instanceof Blob) {
            console.log(event.data)
            const stream = event.data.stream();
            const reader = stream.getReader();
            reader.read().then(({ done, value }) => {
                if(done){
                    console.log('DONE', value,  done);
                    
                } else {
                    var b = Buffer.from(value)
                    
                    zlib.inflateRaw(b,{flush: 3, info: true}, (err, buffer) => {
                    var json = JSON.parse(buffer.toString('UTF-8'))
                    this.setState({
                        lastPrice: json.data[0].last_price,
                        high24hr: json.data[0].high_24h,
                        low24hr: json.data[0].low_24h,
                        open24hr: json.data[0].open_24h,
                        volume24hr: json.data[0].base_volume_24h.split('.')[0],
                        priceStyle: this.state.prevPrice > json.data[0].last_price ? 'text-danger' : 'text-success',
                        prevPrice: json.data[0].last_price
                        });


                    console.log(err,json.data[0]);
                    }); 
                }  
            })
            } else {
                // text frame

                if(event.data == 'pong'){
                    //this.client.send("ping")
                }
                console.log('Text Frame',event.data);
            }
        
            
    }      
            

}

    ws_send(msg, leaving=false){
        console.log('ReadyState', this.client.readyState, msg);
        if(this.client.readyState === 3){ //closed
            

            this.client = new W3CWebSocket('wss://ws-manager.bitmart.com?protocol=1.1');
            this.client.binaryType='blob';


        }
        if(this.client.readyState == 0){ //connecting
            setTimeout(() => {
                this.client.send(msg)
            }, 10000, msg)
        }

        if(this.client.readyState == 1){ //connected
            this.client.send(msg);
            if(leaving){
                this.client.close();
            }
        }
        if(this.client.readyState == 2){ //closing
            //this.client.close();
             this.client = new W3CWebSocket('wss://ws-manager.bitmart.com?protocol=1.1');

            setTimeout(() => {
                this.client.send(msg)
            }, 3000, msg)

            
        }

        
    }

    tickerEvent(e) {
        //console.log('TickerTarget',`spot/ticker:${e.value}`)
        
        // this.setState({
        //     name: e.target.value
        // });
        this.setState({
            selectedTicker: e.value ? e.value : "",
            baseAsset: e.value !== undefined ? e.value.replace(/.*_/g,"") : ''
          });
       let msg;
        if(localStorage.getItem('selectedTicker') === undefined){ 
            localStorage.setItem('selectedTicker',e.value);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/ticker:"+e.value]});
            this.ws_send(msg);
        } else if(e.value === localStorage.getItem('selectedTicker')){

        } else if(e.value !== localStorage.getItem('selectedTicker')){
            msg = JSON.stringify({"op": "unsubscribe", "args": ["spot/ticker:"+localStorage.getItem('selectedTicker')]});
            this.ws_send(msg);
            localStorage.setItem('selectedTicker',e.value);
            msg = JSON.stringify({"op": "subscribe", "args":["spot/ticker:"+e.value]});
            this.ws_send(msg);
        }
          
        console.log('TickerEvent',e, msg)

    }


    
    render() {
        return (
            <div className="container" style={{marginTop: '2px', marginBottom: '2px'}}>
                
                 <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px'}} className="float-left"><h6 className={this.state.priceStyle}>{this.state.lastPrice}</h6></div>
                <div style={{width:'28%', paddingLeft:'1px',paddingTop:'1px'}} className="float-left"><small>{this.state.baseAsset}</small></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', marginTop:'0px' }} className="float-left"><small>{this.state.high24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="float-left"><small>High</small></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', marginTop:'0px'}} className="float-left"><small>{this.state.low24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="float-left"><small> Low</small></div>

                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', color:'', marginTop:'0px' }} className="float-left"><small>{this.state.open24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px' }}  className="float-left"><small>Open</small></div>


                <div style={{width:'72%', paddingLeft:'1px',paddingTop:'1px', color:'', marginTop:'0px'}} className="float-left"><small>{this.state.volume24hr}</small></div>
                <div style={{width:'28%',color:'',paddingTop:'1px', marginTop:'0px'}}  className="float-left"><small> Volume</small></div>




            </div>
        )
    }
}
