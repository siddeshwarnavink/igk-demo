import React from 'react';
import { Link } from 'react-router-dom'

import classes from './ConversationItem.module.scss';
import { USER_URI } from "../../../constants/navigation"
import defaultAvatar from '../../../static/images/default-avatar.png';

const ConversationItem = (props: any) => {
    return (
        <li className={classes.ConversationItem}>
            <Link to={`${USER_URI}${props.otherUser.username}?openChat=true`} >
                <div className={classes.Profile}>
                    <img src={props.dp ? props.dp : defaultAvatar} alt="Loading..." />
                </div>

                <div className={classes.Desc}>
                    <h4>@{props.otherUser.username}</h4>
                    <span>Started at {new Date(props.createdAt).toDateString()}</span>
                </div>
            </Link>
        </li>
    )
}

export default ConversationItem;