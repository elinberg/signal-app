import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
//import { REMOVE_ALERT, SET_ALERT } from "../components/types";


 const EditAsset = (props) => { 

  



        return (


<div className="container font-face-din fx-12" style={{width:'600px'}}>
<div id="carousel-example-generic"  className="carousel slide">

  <ol className="carousel-indicators carousel-indicators-numbers">
    <li data-target="#carousel-example-generic" data-slide-to="0" className="active">Market Trades</li>
    <li data-target="#carousel-example-generic" data-slide-to="1" className="">Order History</li>
    <li data-target="#carousel-example-generic" data-slide-to="2">Open Orders</li>
  </ol>


  <div className="carousel-inner" role="listbox">
    <div className="carousel-item active">
      <img src="http://placehold.it/600x400" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="http://placehold.it/6600x400" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="http://placehold.it/600x400" alt="..."/>
    </div>
  </div>

</div>
</div>

            
        )

}

export default EditAsset