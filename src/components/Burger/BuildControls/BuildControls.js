import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    {label: 'Lettuce', type: 'lettuce'},
    {label: 'Bacon', type: 'bacon'},
    {label: 'Cheese', type: 'cheese'},
    {label: 'Meat', type: 'meat'},
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>${props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => ( //map each control to a BuildControl object
            <BuildControl 
                key={ctrl.label}
                label={ctrl.label} 
                added={() => props.ingredientAdded(ctrl.type)}
                removed={() => props.ingredientRemoved(ctrl.type)}
                disabled={props.disabled[ctrl.type]}
            />
        ))}
        <button 
            className={classes.CheckoutButton}
            disabled={!props.purchasable}
            onClick={props.checkedOut}>
            CHECKOUT
        </button>
    </div>
);

export default buildControls;