import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

export class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }
    
    //fetch data
    componentDidMount () {
        this.props.onInitIngredients();
    }

    //check whether we turn purchasable to true/false
    updatePurchaseState(ingredients) {
        //sum up all values - turn object into array of values (amount of ingredients)
        const sum = Object.keys(ingredients) //array of strings (ingredients)
            .map(igKey => { //map to ingredient values
                return ingredients[igKey] //get amount of ingredients
            })
            //reduce array to a number (sum)
            .reduce((sum, el) => { //(sum, new element number)
                return sum + el;
            }, 0);
        return sum > 0;
    }

    //when Checkout button is clicked
    purchaseHandler = () => {
        //if authenticated, then set state to purchasing
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true});
        }
        //else, redirect to auth page to sign up
        else {
            //go to checkout after auth
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    //when modal backdrop/or cancel button in order summary is clicked
    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    //when continue button in order summary is clicked
    purchaseContinueHandler = () => {
       this.props.onInitPurchase();
       this.props.history.push('/checkout');
    }

    render () {
        //copy ingredients in immutable way - new object with properties of old object
        const disabledInfo = {
            ...this.props.ings
        };
        //loop through all keys in disabledInfo
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0; //true if <= 0
            // {lettuce: true, meat: false, ...}
        }

        //no orderSummary if no ingredients loaded yet
        let orderSummary = null;

        //show error message if no ingredients loaded (null), otherwise show spinner
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        //show burger & controls and set orderSummary when ingredients loaded
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/> {/*graphical representation of burger*/}
                    <BuildControls
                        ingredientAdded={this.props.onAddIngredient}
                        ingredientRemoved={this.props.onRemoveIngredient}
                        disabled={disabledInfo}
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        checkedOut = {this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price}/>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}> {/*show only if purchasing is true*/}
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAddIngredient: (ingName) => dispatch(actions.addIngredient(ingName)),
        onRemoveIngredient: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));