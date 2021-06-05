import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import {SET_ALERT_OVERWRITE} from './types';
import ModalExchange from "./modal-exchange.component"
import "bootstrap/dist/css/bootstrap.min.css";

//import { AuthContext } from "../App";
//App.use(cors());
 const Exchange  = props => (
    
    <div className="card" style={{float:'left', width: '14rem', marginRight:'10px', height:'204px'}}>
 
        <div className="card-body">
            <h5 className="card-title">{props.exchange.name} </h5>
            <p className="card-text"></p>
            
            <Link className="btn btn-primary" onClick={() => props.showModal(props)} to={"#"}>Configure</Link>
        </div>
    </div>
    
    
)


const ExchangeList = () => {

 //   const { dispatch } = React.useContext(AuthContext);

    const initialState = {
        exchange: []
      };

    const [data, setData] = React.useState(initialState);
    



    //useEffect(() => {
        useEffect(() => {
           
        axios.get('/api/exchange/')
            .then(response => {
                //this.setState({ asset: response.data });
                setData({
                    ...data,
                    exchange: response.data,
                    showModal: 'none'
                  });
            })
            .catch(function (error){
                console.log(error);
            })
        }, []);
    
    const [isOpen, setIsOpen] = React.useState(false);
    //const [hideModal, setHideModal] = React.useState({});
    const [exchange, setExchange] = React.useState({});
    const [title, setTitle] = React.useState("Transitioning...");
    const [url, setUrl] = React.useState("");
    //const [time, setTime] = React.useState("");
   
    const showModal = props => {
        //document.getElementById('exchangeModal').setAttribute('show', true);
        setIsOpen(true);
        setTitle(props.exchange.name);
        setExchange(props.exchange)
        //setUrl(props.exchange.url)
        //setHideModal(hideModal);
 
    };
    const hideModal = () => {
        //document.getElementById('exchangeModal').setAttribute('show', true);
        setIsOpen(false);
        setTitle('')
    };
    
    async function asyncAxios(currentExchange) {
        var config = {
            method: 'get',
            withCredentials: true,
            url: currentExchange.url+'/time', 
            data : {}
          };
        try {
        const response = await axios(config);
        return response.data;
        }
        catch (error) {
            console.log(error);
        }
        
    }


    const listExchange = () => {
        
        return data.exchange.map(function(currentExchange, i){
           
    
            
            // var config = {
            //     method: 'get',
            //     withCredentials: true,
            //     url: currentExchange.url+'/time', 
            //     data : {}
            //   };
            //   let {data} =  axios(config);
            //asyncAxios(currentExchange).then(function(response) {
                //console.log('Time',response.serverTime);
                //dispatch('SET_TIME',response.serverTime)
                //currentExchange.serverTime = response.serverTime;
                
              //});
              console.log('FFFF',data)
            
              return <Exchange title={currentExchange.name} hideModal={hideModal} setUrl={setUrl} setTitle={setTitle} showModal={showModal} setIsOpen={setIsOpen} exchange={currentExchange} key={i} />;
            
            
        })
    }


  return (
    <div style={{ marginLeft: '12px' }} className="float-left pt-2">
        <h5>Exchanges</h5>
        {listExchange()}

        <ModalExchange id="exchangeModal" setExchange={setExchange} exchange={exchange} title={title} url={url} setUrl={setUrl} setTitle={setTitle} isOpen={isOpen} show={true} hideModal={hideModal} showModal={showModal} tabindex="-1"></ModalExchange>   
    </div>
    
  );

}
export default ExchangeList;