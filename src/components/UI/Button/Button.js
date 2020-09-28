import React from 'react';
import classes from './Button.module.css';

const button = (props) => (
    <button 
        //assign button class & conditionally add Success/Danger class
        className={[classes.Button, classes[props.btnType]].join(' ')}//array of strings to string
        onClick={props.clicked}
        disabled={props.disabled}>
        {props.children}
    </button>
);

export default button;