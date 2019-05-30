import React, { useState, useEffect } from 'react';
import classNames from 'classnames'
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.scss';
import { BRAND_TITLE } from '../../../constants/brand';
import { HOME_URI } from '../../../constants/navigation';
import NavigationItems from '../NavigationItems/NavigationItems';

const MainNavigation = () => {
    const [pinned, setPinned] = useState(true);

    useEffect(() => {
        let pxTrigger = 0; 
        const menuHeight = 100;

        document.addEventListener('scroll', () => {
            const pxFromTop = window.scrollY || window.pageYOffset;
            
            if(pxFromTop > menuHeight) {
                setPinned(pxFromTop < pxTrigger);
                pxTrigger = pxFromTop;
            } else {
                setPinned(true);
            }
        });
        // eslint-disable-next-line
    }, [])

    return (
        <div className={classNames(classes.MainNavigation, {
            [classes.Pinned]: pinned
        })}>
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