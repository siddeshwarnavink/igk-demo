import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.scss';

const NavigationItem = (props: any) => {
    return (
        <NavLink className={classes.NavigationItem} to={props.to}>
            {props.children}
        </NavLink>
    )
}

export default NavigationItem;