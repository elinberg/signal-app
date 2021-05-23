import React, { Component } from 'react';
import axios from 'axios';
import TickerSelect from "./assets/ticker.select.component";
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container} from "react-bootstrap";

export default class ExchangeTradeFormSell extends Component {

    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeApiKey = this.onChangeApiKey.bind(this);
        this.onChangeSecret = this.onChangeSecret.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.ex = JSON.parse(localStorage.getItem('exchanges'))
        //console.log('local',this.ex)
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
            url: props.exchange.url,
            tickers: [],
            tickerEndpoint: props.exchange.tickerEndpoint,
            secret: this.thisExchange.length > 0 ? this.thisExchange[0].secret: '',
        }
        //console.log('exchange',props.exchange);
        
        
        
    }

    componentDidMount() {
        axios.get(this.state.url+'/tickers').then(result => {
            
            
            result.data.tickers.map((ticker,i) => {
                result.data.tickers[i] = { value: ticker, label: ticker }
            })

            //console.log('TICKERS:',result.data.tickers);

            this.setState({tickers:result.data.tickers})
        });
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeApiKey(e) {
        this.setState({
            apiKey: e.target.value
        });
    }

    onChangeUrl(e) {
        this.setState({
            url: e.target.value
        });
    }

    onChangeSecret(e) {
        this.setState({
            secret: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Form submitted:`, this.state.name);;

        const data = this.ex.filter(exchange => 
            this.state.name !== exchange.name
        )

        data.push({ name: this.state.name, secret: this.state.secret, apiKey:this.state.apiKey})
        localStorage.setItem('exchanges', JSON.stringify(data));
        this.props.hideModal();
        //console.log(this.props)
    }

    render() {
        return (
            <div className="container" style={{marginTop: 10}}>
                
                <form style={{width:'100%'}} onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                    <TickerSelect options={this.state.tickers} />
                        <input  type="hidden"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.onChangeName}
                                />
                    </div>
            <Tabs defaultActiveKey="limit" id="controlled-tab-example" className="nav nav-pills nav-fill">
                <Tab eventKey="limit" title="Limit" className="">
                <div style={{width:'50%', paddingLeft:'15px', }} className="float-left"><small>Lowest Ask</small></div><div style={{width:'50%',color:'red'}}  className="float-right"><small>0.00005 USDT</small></div>
                    <div className="form-group"> 
                        <label>Price</label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.onChangeName}
                                />
                    </div>

                    
 
                    <div className="form-group"> 
                        <label>Amount</label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.onChangeName}
                                />
                    </div>
                </Tab >
                <Tab eventKey="market" title="Market" className="">
                <div className="form-group"> 
                        <label>Amount</label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.onChangeName}
                                />
                </div>
                </Tab>
            </Tabs>
                    <div className="form-group">
                       
                        <input 
                                type="hidden" 
                                className="form-control"
                                value={this.state.apiKey}
                                onChange={this.onChangeApiKey}
                                />
                    </div>
                    <div className="form-group">
                        {/* <label>Secret: </label> */}
                        <input 
                                type="hidden" 
                                className="form-control"
                                value={this.state.secret}
                                onChange={this.onChangeSecret}
                                />
                    </div>
                    

                    <div className="form-group">
                        <input type="submit" value="Place Sell Order" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
