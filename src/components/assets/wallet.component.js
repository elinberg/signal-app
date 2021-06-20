import React, { useEffect } from 'react';
let avail = '';
//let opposite_avail = '';
let currency = '';
//let opposite_currency = '';
let frozen = '';
let asset 
let opposite = ''
let o, w
let wallet = []
let opposite_wallet = []


       
//let currency = '';
       

let dollars 
const Wallet = props => {

    
    //  asset = props.asset
    //  wallet = props.wallet
    //  opposite = props.opposite
    //  dollars = props.dollars
    //  currecntPrice = props.currecntPrice
    const percent25 = e => {
        console.log('PERCENT25')
        if (avail.length > 0) {

            props.setAmount({ target: { value: .25 * Math.round(avail) } })
        }
    }

    const percent50 = e => {
        console.log('PERCENT50')
        if (avail.length > 0) {

            props.setAmount({ target: { value: .50 * Math.round(avail) } })
        }
    }

    const percent75 = e => {
        console.log('PERCENT75')
        if (avail.length > 0) {

            props.setAmount({ target: { value: .75 * Math.round(avail) } })
        }
    }

    const percent100 = e => {
        console.log('PERCENT100', avail)
        if (avail.length > 0) {

            props.setAmount({ target: { value: Math.round(avail) } })
        }
    }


    useEffect(() => {
        //console.log('FUCK', props.ticker, props.tab, props.currentPrice,props.wallet)
        //console.log("ASSETLIST", props,  props.currentPrice )

        if (
            
            props.ticker === undefined  ||
            props.currentPrice === undefined 
            
            // props.clearAmount !== undefined ||
            // props.setAmount !== undefined ||
            // props.tab !== undefined
            //     props.wallet === undefined ||//
            //     props.dollars === undefined ||
            //     props.ticker === undefined||
            //     props.wallet === undefined||
            //     props.id === undefined||
            //    // props.currentPrice === undefined||
            //    // props.currency === undefined||
            //     props.clearAmount === undefined||
            //     props.setAmount === undefined||
            //     props.selectedTicker.length < 1||
            //     props.ticker.length < 1||
            //     props.opposite_wallet === undefined
        ) {
            return null;
        }
        console.log("LINE 78", props,  props.currentPrice)
        // let avail = '';
        // //let opposite_avail = '';
        // let currency = '';
        // //let opposite_currency = '';
        // let frozen = '';
        //let asset 
        //let dollars 
        //let opposite = ''
        let wallet = []
        let opposite_wallet = []



        if (props.tab === 'buy') {

            asset =  props.ticker.replace(/.*_/g, "") || '';
            opposite =  props.ticker.replace(/_.*/g, "") || '';
        } else {

            asset =  props.ticker.replace(/_.*/g, "") ;
            opposite =  props.ticker.replace(/.*_/g, "") ;
        }
        console.log('WALLET TAG', props.currentPrice, props.wallet, asset, opposite, props.ticker)
        wallet = props.wallet.filter(account =>
            account.id === asset
        )
        opposite_wallet = props.wallet.filter(account =>
            account.id === opposite
        )
        

        if (wallet.length > 0) {
            avail = parseFloat(wallet[0].available).toFixed(2);
            frozen = parseFloat(wallet[0].frozen).toFixed(2);
            currency = wallet[0].id
        }
        // if (props.tab === 'sell' && opposite_wallet.length > 0) {
        //     avail = parseFloat(opposite_wallet[0].available).toFixed(2);
        //     frozen = parseFloat(opposite_wallet[0].frozen).toFixed(2);
        //     currency = opposite_wallet[0].id
        // }

        console.log('DOLLAR', props.currentPrice, opposite_wallet, avail ,props.ticker)
        if (props.currentPrice !== undefined  && opposite_wallet.length > 0 ) {
            if (props.tab == 'buy' ) {
                //dollars = parseFloat(parseFloat(props.currentPrice) * parseFloat(opposite_wallet[0].available)).toFixed(2);
                dollars = parseFloat(parseFloat(props.currentPrice) * parseFloat(avail)).toFixed(2) + ' (' + opposite_wallet[0].id + ')'
                //console.log('BUY', o,w)
            } else  {
               // dollars = parseFloat(parseFloat(props.currentPrice) * parseFloat(opposite_wallet[0].available)).toFixed(2);
                dollars  = parseFloat(parseFloat(props.currentPrice) * parseFloat(avail)).toFixed(2) + ' (' + opposite_wallet[0].id + ')'
                //console.log('SELL', o,w)
            }
            //dollars = w;
           // dollars = props.tab === 'buy' ? o : w ;
            console.log('DOLLARS',  props.currentPrice,  dollars)

        } 
        //console.log('OPPOSITE WALLET TAG', props, dollars,o, w)
        return (() => {
            console.log('LEAVING WALLET')
        })
        

    }, [ props.ticker, props.tab, props.currentPrice, props.wallet])




   
    // if( 
    //     //dollars === undefined 
    // )
    // {
    //     return null;
    // }

    return (

        <div className="" style={{ paddingLeft: '0px', height: '65px' }}>
            <div className="row">
                <div style={{ whiteSpace: 'nowrap' }} className="col-sm-12 pt-2 tiny"><small className=""> Avail: { avail < 0 ?? ( <div>{avail}  {currency}</div> )}    </small></div>
                <div style={{ whiteSpace: 'nowrap', paddingLeft: '44px' }} className="col-sm-12 tiny"><small className="">{dollars} </small></div>
                <div style={{ whiteSpace: 'nowrap' }} className="col-sm-12  tiny"><small className="">In Orders {frozen || 0.00} </small></div>

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