import React from 'react';
//import {SET_ALERT_OVERWRITE} from './types';
//import { AuthContext } from "../App";
import Modal from "react-bootstrap/Modal";
import ExchangeForm from "./exchange.component"
import "bootstrap/dist/css/bootstrap.min.css";
import ExchangeList from './exchanges.component';





const ModalExchange = props => {

    
    return(
        <Modal  show={props.isOpen}  tabIndex="-1">
        <div style={{width:'400px'}} className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">{props.title}</h5>
                <button type="button" className="close" onClick={props.hideModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <ExchangeForm hideModal={props.hideModal} exchange={props.exchange} />
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={props.hideModal}>Close</button>
            </div>
            </div>
        </div>
        </Modal>
        )

}
export default ModalExchange;