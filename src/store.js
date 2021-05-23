import { createStore, applyMiddleware } from "redux";
import loginReducer from "./reducers/loginReducer";
import {alertAction} from "./actions/alertAction";
import thunk from 'redux-thunk';
//import { composeWithDevTools } from 'redux-devtools-extension';
//import initialStore from './initialStore';


function configureStore() {
  var store =createStore(loginReducer,
        applyMiddleware(thunk)
        );
        store.dispatch(alertAction('hello','success',100000))
        return store;
}

export default configureStore;