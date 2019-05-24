import React, { useReducer } from 'react';

import StateContext from '../context/state-context';

const StateProvider = ({ reducer, initialState, children }: any) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)

export default StateProvider;