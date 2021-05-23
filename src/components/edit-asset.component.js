import React, {useEffect} from 'react';
import { REMOVE_ALERT, SET_ALERT } from "../components/types";
import { AuthContext } from "../App";

 const EditAsset = (props) => { 


    const { state, dispatch } = React.useContext(AuthContext);  
    //const msg = {  message:'Fuck Yeah', alertType: 'success', timeout:10000 } 
    useEffect(() => {
    // dispatch({
    //     type: SET_ALERT,
    //     payload: msg
    // })
    }, []);

        return (
            <div>
                <p>Welcome to Edit Asset Component!!</p>
                
            </div>
            
        )

}

export default EditAsset