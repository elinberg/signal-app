import React, { Component } from 'react';

export default class ExchangeForm extends Component {

    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeApiKey = this.onChangeApiKey.bind(this);
        this.onChangeApiName = this.onChangeApiName.bind(this);
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
                id:props.exchange._id,
                apiKey: '',
                apiName: '',
                secret: '',}];        
        }

        this.state = {
            name: props.exchange.name,
            id: props.exchange._id ,
            apiKey: this.thisExchange.length > 0 ? this.thisExchange[0].apiKey: '',
            apiName: this.thisExchange.length > 0 ? this.thisExchange[0].apiName: '',
            url: props.exchange.url,
            secret: this.thisExchange.length > 0 ? this.thisExchange[0].secret: '',
        }
        console.log('exchange',props.exchange);
        
        
        
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
    onChangeApiName(e) {
        this.setState({
            apiName: e.target.value
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
        
        console.log(`Form submitted:`, this.state.name, e);;

        const data = this.ex.filter(exchange => 
            this.state.name !== exchange.name
        )

        data.push({ name: this.state.name, secret: this.state.secret, apiKey:this.state.apiKey, apiName:this.state.apiName, exchangeId:this.state.id})
        localStorage.setItem('exchanges', JSON.stringify(data));
        this.props.hideModal();
        //console.log(this.props)
    }
    

    render() {
        
        return (
            <div className="container" style={{marginTop: 10}}>
                
                <form style={{width:'100%'}} onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.onChangeName}
                                />
                        <input  type="hidden"
                                className="form-control"
                                value={this.state.is}
                                />
                    </div>
                    <div className="form-group">
                        <label>Url: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.url}
                                onChange={this.onChangeUrl}
                                
                                />
                    </div>
                    <div className="form-group">
                        <label>API Name: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.apiName}
                                onChange={this.onChangeApiName}
                                />
                    </div>
                    <div className="form-group">
                        <label>API Key: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.apiKey}
                                onChange={this.onChangeApiKey}
                                />
                    </div>
                    <div className="form-group">
                        <label>Secret: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.secret}
                                onChange={this.onChangeSecret}
                                />
                    </div>
                    

                    <div className="form-group">
                        <input type="submit" value="Save and Close" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
