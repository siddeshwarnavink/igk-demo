import React, { useState, useContext } from 'react';
import { translate } from 'react-switch-lang';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.scss';
import firebase from '../../global/firebase';
import { LOGIN_SUCCESS } from '../../constants/actions';
import { HOME_URI } from '../../constants/navigation';
import { USERS } from '../../constants/fbCollections';
import useFormValidation from '../../hooks/useFormValidation';
import validateAuth from '../../validations/auth';
import StateContext from '../../context/state-context';
import Spinner from '../../components/UI/Spinner/Spinner';

const AUTH_FORM_STATE = {
    username: "",
    email: "",
    password: ""
};

const Auth = ({ t }: any) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [{ auth }, dispatch]: any = useContext(StateContext);

    const onAuthHandler = () => {
        setLoading(true);

        let authPromise;

        if (isSignUp) {
            authPromise = firebase.auth().createUserWithEmailAndPassword(values.email, values.password);
        } else {
            authPromise = firebase.auth().signInWithEmailAndPassword(values.email, values.password);
        }

        authPromise.then(async ({ user }: any) => {
            if (isSignUp) {
                await user.updateProfile({
                    displayName: values.username
                });
                await firebase.firestore().collection(USERS).doc(user.uid).set({
                    username: values.username,
                    profilePic: '',
                    followers: 0,
                    following: 0
                })
            }

            setLoading(false);

            dispatch({
                type: LOGIN_SUCCESS,
                user
            });
        }).catch(err => {
            alert(err.message);
            setLoading(false);
        })
    };

    const {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        isSubmitting
    }: any = useFormValidation(AUTH_FORM_STATE, validateAuth, onAuthHandler);

    const toggleAuthStateHandler = () => {
        setIsSignUp(!isSignUp);
    }

    let form = <form onSubmit={handleSubmit}>
        {isSignUp &&
            <React.Fragment>
                <input
                    type="text"
                    name="username"
                    placeholder={t('auth.usernamePlaceHolder')}
                    style={{ width: '96%' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    required
                />

                {errors.username && <span className="error-text">{errors.username}</span>}
            </React.Fragment>
        }

        <input
            type="email"
            name="email"
            placeholder={t('auth.emailPlaceHolder')}
            style={{ width: '96%' }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
        />

        {errors.email && <span className="error-text">{errors.email}</span>}

        <input
            type="password"
            name="password"
            placeholder={t('auth.pwdPlaceHolder')}
            style={{ width: '96%' }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
        />

        {errors.password && <span className="error-text">{errors.password}</span>}

        <button type="submit" style={{ width: '100%', marginTop: '12px' }} disabled={isSubmitting}>
            {t(isSignUp ? 'auth.signUpButton' : 'auth.signInButton')}
        </button>

        <button type="button" className="flat" style={{ width: '100%' }} onClick={toggleAuthStateHandler}>
            {t(isSignUp ? 'auth.switchToSignIn' : 'auth.switchToSignUp')}
        </button>
    </form>

    if (loading) {
        form = <Spinner />
    }

    return (
        <div className={classes.Auth}>

            {auth && <Redirect to={HOME_URI} />}

            <div className={classes.Container}>
                <h1>{t(isSignUp ? 'auth.signUptitle' : 'auth.signIntitle')}</h1>

                {form}
            </div>

        </div>
    )
}

export default translate(Auth);