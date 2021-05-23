import React , {useEffect, useState} from 'react';
import axios from 'axios';
import { useHistory } from "react-router";
import {SET_ALERT_OVERWRITE, SET_ALERT, LOGIN} from './types';

import { AuthContext } from "../App";

export const Login = () => {
    const { dispatch } = React.useContext(AuthContext);
    const initialState = {
        username: "",
        password: "",
        isSubmitting: false,
        errorMessage: null
      };
      //localStorage.clear();
      const [data, setData] = React.useState(initialState);
      let history = useHistory();
      let [online, isOnline] = useState(navigator.onLine);
      const setOnline = () => {
          console.log('We are online!');
          let online=true;
          isOnline(true);
      };
      const setOffline = () => {
          console.log('We are offline!');
          //props.selectedTicker='';
          //props.clearTicker();
          let online=false;
          isOnline(false);
      };

    const onChangeUsername = e => {

        setData({
            ...data,
            username: e.target.value
          });
    }

    const onChangePassword = e => {
        setData({
            ...data,
            password: e.target.value
        });
    }

    useEffect(() => {
        window.addEventListener('offline', setOffline);
        window.addEventListener('online', setOnline);
        return () => {

            window.removeEventListener('offline', setOffline);
            window.removeEventListener('online', setOnline);
        }
    },[]);
    const onSubmit = e => {
        e.preventDefault();
        //const history = useHistory();
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
          });
        console.log(`Form submitted:`);
         
        const newLogin = {
            username: data.username,
            password: data.password
        };
        
        
        axios.post('http://localhost:8080/api/auth/signin', newLogin)
            .then(res => {
                console.log(res.data);
                
                localStorage.setItem('token', res.data.token);
                
                axios.defaults.headers.common['Authorization'] = res.data.token;
                axios.defaults.baseURL='';
                dispatch({
                    type: LOGIN,
                    payload: res.data
                })
                dispatch({
                    type: SET_ALERT,
                    payload: {  message:'Login Successful', alertType: 'success', timeout:5000}
                })
                
                history.push("/exchanges");
                
            });
            


        setData({
            ...data,
            username: '',
            password: '',
            isLoggedIn: true
        })
    }
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const offline = params.get('offline');
    if( offline === true ){
        online = false;
    } else{
        if(online === false){
            online = false;
        } else {
            online = true;
        }
    }
    
    return (
        <div className="container" style={{marginTop: 10}}>
            <h3>Login</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group"> 
                    <label>User Name: </label>
                    <input  type="text"
                            className="form-control"
                            value={data.username}
                            onChange={onChangeUsername}
                            />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input 
                            type="password" 
                            className="form-control"
                            value={data.password}
                            onChange={onChangePassword}
                            />
                </div>
                

                <div className="form-group">
                    <input type="submit" disabled={online ? false : true} value={online ? 'Login' : 'Offline'} className="btn btn-primary" />
                </div>
            </form>
        </div>
    )
    
}



  export default Login;