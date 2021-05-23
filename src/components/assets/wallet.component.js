import React from 'react';
//import small from "./small.component";
 const Wallet = props => {
     let avail = '';
     let currency = '';

     console.log('WALLET TAG', props)
     if(props.wallet.length > 0 ){
        avail = props.wallet[0].available;
        currency = props.wallet[0].id
     }

     const percent25 = e => {
         console.log('PERCENT25')
         if(avail.length>0){
        
        props.setAmount({target:{value:.25 * Math.round(avail)}})
         }
    }

    const percent50 = e => {
        console.log('PERCENT25')
        if(avail.length>0){
       
       props.setAmount({target:{value:.50 * Math.round(avail)}})
        }
   }

   const percent75 = e => {
    console.log('PERCENT25')
    if(avail.length>0){
   
   props.setAmount({target:{value:.75 * Math.round(avail)}})
    }
}

const percent100 = e => {
    console.log('PERCENT25')
    if(avail.length>0){
   
   props.setAmount({target:{value:Math.round(avail)}})
    }
}

    return (
    <div className="container" style={{paddingLeft:'0px'}}>
    <div className="row">
        <div onClick={percent25} className="col-sm-3"><small className="tiny">25%</small></div>
        <div onClick={percent50} className="col-sm-3"><small className="tiny">50%</small></div>
        <div onClick={percent75} className="col-sm-3"><small className="tiny">75%</small></div>
        <div onClick={percent100} className="col-sm-3"><small className="tiny">100%</small></div>
    </div>
     <div className="row">    
        <div style={{whiteSpace:'nowrap'}} className="col-sm-12"><small className="tiny">Avail. {avail} {currency}</small></div> 
    </div>
    </div>
    )
     
 }

export default Wallet;