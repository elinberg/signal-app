import React from 'react';
import { AuthContext } from '../App';
import { REMOVE_ALERT} from './types';
import logo from "../logo.svg";

const Alert = () => {
    const { state, dispatch } = React.useContext(AuthContext);  
    const alerts = state.alerts;
    const onClose = (e, id) => {
        console.log(id);
        //document.getElementById(id).a
        dispatch({ type: REMOVE_ALERT, payload: id})
        //e.target.parent.toast('hide');
    }
    if(typeof alerts !== 'undefined' && alerts !== null && alerts.length > 0){
        let alertsList, aid;
        
        alertsList = alerts.filter(alert => alert.message !== 'null').map((alert,i) => {
            aid = alert.id;
            setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: alert.id}), alert.timeout);
            // return (
            //     alert.id && <div className='alert' key={aid} className={als} role='alert'>{alert.message}</div>
            // )
            return (
                alert.id && <div key={alert.id} className='' aria-live='polite' aria-atomic='true' style={{position: 'absolute', top:'150px', right: '500px', minHeight:'200px', width:'200px',zIndex:1000}}>
                <div id={aid} className='toast fade show'>
                    <div className='toast-header'>
                    <img style={{width:30, height:30}} src={logo} className='rounded mr-2' alt='...' />
                    <strong className='mr-auto'>System</strong>
                    
                    <button type='button' onClick={ (e) => onClose(e,aid)} className='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                    </div>
                    <div className='toast-body'>
                    {alert.message}
                    
                </div>
                </div>
                </div>
            )


            
        });
        
        return alertsList;
    } else {
        return null;
    }
    
};


export default Alert;


