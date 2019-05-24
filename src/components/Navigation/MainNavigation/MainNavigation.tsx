import React from 'react';
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.scss';
import { BRAND_TITLE } from '../../../constants/brand';
import { HOME_URI } from '../../../constants/navigation';
import NavigationItems from '../NavigationItems/NavigationItems';

const MainNavigation = () => {
    return (
        <div className={classes.MainNavigation}>
            <div className={classes.BrandLogo}>
                <Link to={HOME_URI}>
                    <h1>{BRAND_TITLE}</h1>
                </Link>
            </div>

            <div className={classes.Spacer} />

            <div className={classes.NavigationItems}>
                <NavigationItems />
            </div>
        </div>
    )
}

export default MainNavigation;