import React from 'react'

import classes from './Spinner.module.scss';
import spinnerImg from '../../../static/images/fidget-spinner.gif';

const Spinner = () => {
    return (
        <div className={classes.Spinner}>
            <img src={spinnerImg} alt="Spinner" />
        </div>
    )
}

export default Spinner;