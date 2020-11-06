import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.module.css';

const checkoutSummary = (props) => {
    //show burger
    let summary = <div className={classes.CheckoutSummary}>
        <h1>Press CONTINUE to confirm your order!</h1>
        <div style={{width: '100%', margin:'auto'}}>
            <Burger ingredients={props.ingredients}/>
        </div>
        <Button 
            btnType="Danger"
            clicked={props.checkoutCancelled}
        >CANCEL</Button>
        <Button 
            btnType="Success"
            clicked={props.checkoutContinued}
        >CONTINUE</Button>
    </div>;
    //don't show burger upon contact data
    if (props.showBurger === false) {
        summary = <div className={classes.CheckoutSummary}><Button 
            btnType="Danger"
            clicked={props.goBack}
        >BACK</Button></div>;
    }
    return summary;
}

export default checkoutSummary;