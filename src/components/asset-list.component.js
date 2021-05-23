import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router";
import {SET_ALERT_OVERWRITE} from './types';
import { AuthContext } from "../App";

 const Asset  = props => (

    <tr>
        <td>{props.asset.pair}</td>
        <td>{props.asset.price}</td>
        <td>{props.asset.amount}</td>
        <td>
            <Link to={"/edit/"+props.asset._id}>Edit</Link>
            &nbsp;
            <Link id={props.asset._id} asset={props.asset} onClick={onDelete} to={"/asset/"}>Delete</Link>
        </td>
    </tr>
)

const onDelete = e => {
    
    console.log(e.target.asset)
    axios.delete( 'http://localhost:4000/asset/delete/'+e.target.id)
    .then(res => {
        console.log(res.data);
        
        // dispatch({
        //     type: SET_ALERT_OVERWRITE,
        //     payload: {  message:'Login Successful', alertType: 'success', timeout:10000}
        // })
        // dispatch({
        //     type: SET_ALERT_OVERWRITE,
        //     payload: {  message:'Login Successful', alertType: 'success', timeout:10000}
        // })
        //let history = useHistory();
       //history.push("/asset");
        
    });
} 


const AssetList = () => {
//export default className AssetList extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {asset: []};
    // }
    const { dispatch } = React.useContext(AuthContext);

    const initialState = {
        asset: []
      };

    const [data, setData] = React.useState(initialState);
      let history = useHistory();



    //useEffect(() => {
        useEffect(() => {
           
        axios.get('http://localhost:4000/asset/')
            .then(response => {
                //this.setState({ asset: response.data });
                setData({
                    ...data,
                    asset: response.data
                  });
            })
            .catch(function (error){
                console.log(error);
            })
        }, []);
    //});
    // componentDidMount() {
        // axios.get('http://localhost:4000/asset/')
        //     .then(response => {
        //         this.setState({ asset: response.data });
        //     })
        //     .catch(function (error){
        //         console.log(error);
        //     })
    // }
    const listAssets = () => {
    //assetList() {
        return data.asset.map(function(currentAsset, i){
            return <Asset asset={currentAsset} key={i} />;
        })
    }

          
        return (
            <div>
                <h3>Assets</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Pair</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { listAssets() }
                    </tbody>
                </table>
            </div>
        )

}
export default AssetList;