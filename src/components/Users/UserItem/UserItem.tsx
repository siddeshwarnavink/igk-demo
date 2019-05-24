import React from 'react';
import { Link } from 'react-router-dom';

import classes from './UserItem.module.scss';
import defaultAvatar from '../../../static/images/default-avatar.png';
import { USER_URI } from '../../../constants/navigation';

const UserItem = (props: any) => {
    return (
        <div className={classes.UserItem}>
            <Link to={`${USER_URI}${props.username}`}>
                <img src={props.photoURL ? props.photoURL : defaultAvatar} alt="Loading..." />
            </Link>
        </div>
    )
}

export default UserItem;