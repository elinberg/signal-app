import React, { Component } from 'react';
import axios from 'axios';

export default class CreateAsset extends Component {

    constructor(props) {
        super(props);

        this.onChangePair = this.onChangePair.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            pair: '',
            price: '',
            amount: '',
            //todo_completed: false
        }
    }

    onChangePair(e) {
        this.setState({
            pair: e.target.value
        });
    }

    onChangePrice(e) {
        this.setState({
            price: e.target.value
        });
    }

    onChangeAmount(e) {
        this.setState({
            amount: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Form submitted:`, this.state);
        console.log(`Pair: ${this.state.pair}`);
        console.log(`Price: ${this.state.price}`);
        console.log(`Amount: ${this.state.amount}`);
        

        const newAsset = {
            pair: this.state.pair,
            price: this.state.price,
            amount: this.state.amount,
            //todo_completed: this.state.todo_completed
        };

        axios.post('/api/asset/add', newAsset)

            .then(res => {
                console.log(res.data);
                this.setState({
                    redirectTo: '/'
                })
            
            });
            


        this.setState({
            pair: '',
            price: '',
            amount: '',
            //order_type: '',
            //order_status: 0,
            //status_message: ''
        })
    }

    render() {
        return (
            <div style={{ marginLeft: '12px', minWidth:'400px' }} className="float-left pt-2">
                <h5>Create New Asset</h5>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Pair: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.pair}
                                onChange={this.onChangePair}
                                />
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.price}
                                onChange={this.onChangePrice}
                                />
                    </div>
                    <div className="form-group">
                        <label>Amount: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.amount}
                                onChange={this.onChangeAmount}
                                />
                    </div>
                    

                    <div className="form-group">
                        <input type="submit" value="Create Asset" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
