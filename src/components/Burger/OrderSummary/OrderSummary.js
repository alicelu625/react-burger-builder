import React, {Component} from 'react';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    //optional, can change back to functional component if don't include this
    componentDidUpdate() {
        console.log('[OrderSummary] DidUpdate');
    }
    
    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}
                </li>
                //Ex. {Lettuce: 1}
            );
        });
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>Your customized burger with the following ingredients:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p><strong>Total Price: ${this.props.price.toFixed(2)}</strong></p>
                <p>Continue to Checkout?</p>
                <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
                <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
            </Aux>
        );
    }
}

export default OrderSummary;