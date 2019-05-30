import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';

import { HOME_URI, AUTH_URI, PROFILE_URI, USER_URI, POST_URI, INDIRECT_URI } from '../../constants/navigation';
import initialState from '../../global/state';
import StateProvider from '../../providers/StateContext';
import rootReducer from '../../reducers/root';
import Layout from '../../hoc/Layout/Layout';
import Home from '../Home/Home';
import Auth from '../Auth/Auth';
import Profile from '../Profile/Profile';
import User from '../Profile/User/User';
import Post from '../Post/Post';
import Indirect from '../Indirect/Indirect';

const App = () => {
    return (
        <Layout>
            <StateProvider initialState={initialState} reducer={rootReducer}>
                <Switch>
                    <Route exact path={HOME_URI} component={Home} />
                    <Route exact path={AUTH_URI} component={Auth} />
                    <Route exact path={PROFILE_URI} component={Profile} />
                    <Route exact path={`${USER_URI}:userId`} component={User} />
                    <Route exact path={`${POST_URI}:postId`} component={Post} />
                    <Route exact path={INDIRECT_URI} component={Indirect} />

                    <Redirect to="/" />
                </Switch>
            </StateProvider>
        </Layout>
    )
}

export default App;