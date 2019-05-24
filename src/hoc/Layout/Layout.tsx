import React from 'react';
import { setTranslations, setDefaultLanguage, setLanguageCookie } from 'react-switch-lang';

import MainNavigation from '../../components/Navigation/MainNavigation/MainNavigation';
import classes from './Layout.module.scss';
import en from '../../translations/en.json';

const Layout = (props: any) => {
    setTranslations({en});
    setDefaultLanguage('en');
    setLanguageCookie();

    return (
        <div className={classes.Layout}>
            <MainNavigation />
            <div className={classes.MainContent}>
                {props.children}
            </div>
        </div>
    )
}

export default Layout;