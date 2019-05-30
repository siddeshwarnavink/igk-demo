import React from 'react';
import { translate } from 'react-switch-lang';

import classes from './NavigationItems.module.scss';
import { NavigationItemType } from './NavigationItems.model';
import { PROFILE_URI, INDIRECT_URI } from '../../../constants/navigation';
import { PROFILE_ICON, INDIRECT_ICON } from '../../../constants/icons';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = ({ t }: any) => {
    const navLinks: NavigationItemType[] = [
        {
            label: t('navigation.profile'),
            to: PROFILE_URI,
            icon: PROFILE_ICON
        },

        {
            label: t('navigation.indirect'),
            to: INDIRECT_URI,
            icon: INDIRECT_ICON
        },
    ];

    return (
        <ul className={classes.NavigationItems}>
            {navLinks.map((navLink: NavigationItemType, key: number) => (
                <NavigationItem to={navLink.to} key={key}>
                    <i className="material-icons">{navLink.icon}</i>
                    <span>{navLink.label}</span>
                </NavigationItem>
            ))}
        </ul>
    )
}

export default translate(NavigationItems);