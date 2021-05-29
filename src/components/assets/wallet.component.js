import React from 'react';

 const Wallet = props => {
     let avail = '';
     let currency = '';
     let frozen = '';
     let asset, wallet;
     if( props.wallet == undefined ){
         return;
     }

     if(props.tab == 'buy'){
        
        asset = props.ticker !== undefined ? props.ticker.replace(/.*_/g,"") : '';
    } else {
        
        asset =  props.ticker !== undefined ? props.ticker.replace(/_.*/g,""): '';
    }
     wallet = props.wallet.filter(account => 
        account.id === asset
    ) 
     console.log('WALLET TAG', wallet,asset)
     if(wallet.length > 0 ){
        avail = wallet[0].available;
        frozen = wallet[0].frozen;
        currency = wallet[0].id
     }

     const percent25 = e => {
         console.log('PERCENT25')
         if(avail.length>0){
        
        props.setAmount({target:{value:.25 * Math.round(avail)}})
         }
    }

    const percent50 = e => {
        console.log('PERCENT50')
        if(avail.length>0){
       
       props.setAmount({target:{value:.50 * Math.round(avail)}})
        }
   }

   const percent75 = e => {
    console.log('PERCENT75')
    if(avail.length>0){
   
   props.setAmount({target:{value:.75 * Math.round(avail)}})
    }
}

const percent100 = e => {
    console.log('PERCENT100', avail)
    if(avail.length>0){
   
        props.setAmount({target:{value:Math.round(avail)}})
    }
}

    return (
    <div className="" style={{paddingLeft:'0px'}}>
    <div className="row">
        <div onClick={percent25} className="col-sm-3 tiny"><small>25%</small></div>
        <div onClick={percent50} className="col-sm-3 tiny"><small className="">50%</small></div>
        <div onClick={percent75} className="col-sm-3 tiny"><small className="">75%</small></div>
        <div onClick={percent100} className="col-sm-3 tiny"><small className="">100%</small></div>
    </div>
     <div className="row">    
        <div style={{whiteSpace:'nowrap'}} className="col-sm-12 pt-2 tiny"><small className="">Avail. {avail} {currency}</small></div> 
        <div style={{whiteSpace:'nowrap'}} className="col-sm-12  tiny"><small className="">In Orders {frozen} </small></div> 
    </div>
    </div>
    )
     
 }

export default Wallet;