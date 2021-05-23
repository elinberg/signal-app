import React, { Component } from 'react';
import axios from 'axios';

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        //this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            //amount: '',
            //todo_completed: false
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }


    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Registration submitted:`, this.state);
        console.log(`Pair: ${this.state.username}`);
        console.log(`Price: ${this.state.price}`);
        console.log(`Amount: ${this.state.amount}`);
        
        const newRegistration = {
            username: this.state.username,
            password: this.state.password,
            //amount: this.state.amount,
            //todo_completed: this.state.todo_completed
        };

        axios.post('http://localhost:8080/api/auth/signup', newRegistration)

            .then(res => {
                console.log(res.data);
                this.props.history.push("/login");
                // this.setState({
                //     redirectTo: '/login'
                // })
            
            });
            
        this.setState({
            username: '',
            password: '',
            //amount: '',
            //order_type: '',
            //order_status: 0,
            //status_message: ''
        })
    }

    render() {
        return (
            <div className="container" style={{marginTop: 10}}>
                <h3>Register</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>User Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.username}
                                onChange={this.onChangeUsername}
                                />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                                />
                    </div>
                    

                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
