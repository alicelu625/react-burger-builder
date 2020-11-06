import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../Checkout/ContactData/ContactData';

class Checkout extends Component {
    state = {
        showBurger: true
    }
    //go back to burger builder when CANCEL clicked
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    //will load contactData component when CONTINUE clicked
    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
        this.setState({showBurger: false});
    }

    //show burger again & no contact data when pressed back from contact data
    goBackHandler = () => {
        this.setState({showBurger: true});
        this.props.history.replace('/checkout');
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
                        showBurger={this.state.showBurger}
                        ingredients={this.props.ings}
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler}
                        goBack={this.goBackHandler}
                    />
                    <Route 
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData}
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