import React from 'react';

import classes from './UsersList.module.scss';

const UsersList = (props: any) => {
    return (
        <div className={classes.Users}>
            {props.children}
        </div>
    )
}

export default UsersList;