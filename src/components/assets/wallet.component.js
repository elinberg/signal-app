import React from 'react';

 const Wallet = props => {
     let avail = '';
     //let opposite_avail = '';
     let currency = '';
     //let opposite_currency = '';
     let frozen = '';
     let asset, wallet, opposite, opposite_wallet, dollars;
     if( props.wallet === undefined ){
         return;
     }

     if(props.tab === 'buy'){
        
        asset = props.ticker !== undefined ? props.ticker.replace(/.*_/g,"") : '';
        opposite = props.ticker !== undefined ? props.ticker.replace(/_.*/g,""): '';
    } else {
        
        asset =  props.ticker !== undefined ? props.ticker.replace(/_.*/g,""): '';
        opposite = props.ticker !== undefined ? props.ticker.replace(/.*_/g,"") : '';
    }
     wallet = props.wallet.filter(account => 
        account.id === asset
    ) 
    opposite_wallet = props.wallet.filter(account => 
        account.id === opposite
    )
     console.log('WALLET TAG', wallet,asset)
     console.log('OPPOSITE WALLET TAG', opposite_wallet,opposite)
     if(wallet.length > 0 ){
        avail = parseFloat(wallet[0].available).toFixed(2);
        frozen = parseFloat(wallet[0].frozen).toFixed(2);
        currency = wallet[0].id
     }
     if(opposite_wallet.length > 0 && wallet.length > 0 && props.currentPrice !== undefined && props.currentPrice !== 0 ){
         if(props.tab == 'buy'){
            dollars = parseFloat(parseFloat(props.currentPrice) * parseFloat(opposite_wallet[0].available)).toFixed(2);
            //opposite_currency = currency;
         } else {
            dollars =  parseFloat(parseFloat(props.currentPrice) * parseFloat(avail)).toFixed(2) + ' ('+opposite_wallet[0].id+')'
    
         }
         console.log('CURRENT PRICE', props.currentPrice)
        
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
        
    <div className="" style={{paddingLeft:'0px', height:'65px'}}>
        <div className="row">    
        <div style={{whiteSpace:'nowrap'}} className="col-sm-12 pt-2 tiny"><small className="">Avail. {avail} {currency}</small></div> 
        { dollars !== undefined && ( <div style={{whiteSpace:'nowrap', paddingLeft:'44px'}} className="col-sm-12 tiny"><small className="">{dollars} </small></div> ) }
        <div style={{whiteSpace:'nowrap'}} className="col-sm-12  tiny"><small className="">In Orders {frozen} </small></div> 
       
    </div>
    <div className="row">
        <div onClick={percent25} className="col-sm-3 tiny"><small>25%</small></div>
        <div onClick={percent50} className="col-sm-3 tiny"><small className="">50%</small></div>
        <div onClick={percent75} className="col-sm-3 tiny"><small className="">75%</small></div>
        <div onClick={percent100} className="col-sm-3 tiny"><small className="">100%</small></div>
    </div>
     
    </div>
    )
     
 }

export default Wallet;