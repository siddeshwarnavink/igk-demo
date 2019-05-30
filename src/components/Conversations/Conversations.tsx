import React from 'react';

import classes from './Conversations.module.scss'

const Conversations = (props: any) => {
    return (
        <ul className={classes.Conversations}>
            {props.children}
        </ul>
    )
}

export default Conversations;