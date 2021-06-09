import BitmartWebSocket  from './bitmart.websocket.driver';
import BinanceWebSocket  from './binance.websocket.driver';
const ELEMENTS = {
    BitmartWebSocket,
    BinanceWebSocket
};

export default class SocketFactory {
    static createInstance(config, props,credentials,trades, endpoint, callback) {
        console.log('createInstance',config, props,credentials,trades,endpoint)
        const socketCreator = ELEMENTS[config.name];
        const socket = socketCreator ? new socketCreator(config, props,credentials,trades,endpoint, callback) : null;

        return socket;
    }
}