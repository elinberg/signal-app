import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
//import reportWebVitals from './reportWebVitals';
import './fonts/DIN/DINRegular/DINRegular.ttf';
//import ReactGA from 'react-ga';
//ReactGA.initialize('G-Z79058ESBL'); // add your tracking id here.
//ReactGA.pageview(window.location.pathname + window.location.search);
ReactDOM.render(<App />, document.getElementById('root'));

//console.log = () => {};
serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
function sendToAnalytics({ id, name, value }) {
    // ga('send', 'event', {
    //   eventCategory: 'Web Vitals',
    //   eventAction: name,
    //   eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    //   eventLabel: id, // id unique to current page load
    //   nonInteraction: true, // avoids affecting bounce rate
    // });
  }
//reportWebVitals(sendToAnalytics);
