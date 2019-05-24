import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom';

import { LOGIN_SUCCESS } from '../../constants/actions';
import { AUTH_URI } from '../../constants/navigation';
import firebase from '../../global/firebase';
import StateContext from '../../context/state-context';
import Spinner from '../../components/UI/Spinner/Spinner';

const authRequired = (WrapperComponent: any) => {
    return (props: any) => {
        const [loading, setLoading] = useState(true);
        const [{ auth }, dispatch]: any = useContext(StateContext); 

        firebase.auth().onAuthStateChanged(user => {
            if (user && !auth) {
                dispatch({
                    type: LOGIN_SUCCESS
                })
            }
            setLoading(false);
        })

        if (!loading &&  !auth) {
            return <Redirect to={AUTH_URI} />
        }

        return loading ? <Spinner /> : <WrapperComponent {...props} />;
    }
}

export default authRequired;