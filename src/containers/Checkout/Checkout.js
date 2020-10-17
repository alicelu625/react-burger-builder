import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../Checkout/ContactData/ContactData';
import * as actions from '../../store/actions/index';

class Checkout extends Component {
    /*remove because states now managed in Redux
    state = {
        ingredients: null,
        price: 0
    }
    */

    /*remove because now get ingredients using Redux
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
    */

    //go back to burger builder when CANCEL clicked
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    //will load contactData component when CONTINUE clicked
    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');   
    }

    render() {
        let summary = <Redirect to="/"/>
        //if there are ingredients
        if (this.props.ings) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary 
                        ingredients={this.props.ings}
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler}
                    />
                    <Route 
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData}
                        /*remove because no longer need to use price (Redux)
                        //can pass props by rendering it manually
                        render={(props) => (<ContactData ingredients={this.state.ings} price={this.state.totalPrice} {...props}/>)}
                        */
                    /> 
                </div>
            );
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    };
};

export default connect(mapStateToProps)(Checkout);