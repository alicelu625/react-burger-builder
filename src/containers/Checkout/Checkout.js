import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../Checkout/ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: null,
        price: 0
    }

    //extract URL
    UNSAFE_componentWillMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {}; //to store ingredients
        let price = 0;
        //format: ['salad', '1']
        for (let param of query.entries()) {
            //if it is price, don't add to ingredient object
            if (param[0] === 'price') {
                //extract price & store
                price = param[1];
            } else { 
                ingredients[param[0]] = +param[1]; //turns into number with a +
            }
        }
        this.setState({ingredients: ingredients, totalPrice: price});
    }

    //go back to burger builder when CANCEL clicked
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    //will load contactData component when CONTINUE clicked
    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');   
    }

    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
                <Route 
                    path={this.props.match.path + '/contact-data'}
                    //component={ContactData}
                    //can pass props by rendering it manually
                    render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>)}/>
            </div>
        );
    }
}

export default Checkout;