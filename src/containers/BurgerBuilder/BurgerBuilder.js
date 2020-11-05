/*Burger Builder page containing graphical representation of burger,
build controls, etc.*/

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
        //ingredients: null,
        //totalPrice: 4, //base price: $4 (no matter what ingredient)
        //purchasable: false, //false until at least 1 ingredient added
        purchasing: false, //false until Checkout button is clicked
        //loading: false, //true show spinner, false show order summary
        //error: false
    }
    
    //fetch data
    componentDidMount () {
        /*remove because moved into action creator
        axios.get('https://react-burger-builder-c740a.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true});
            });*/
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
        //this.setState({purchasable: sum > 0}); //true if sum > 0
        return sum > 0;
    }

    /*removed because Redux implemented this action
    //adding an ingredient
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; //get count of ingredient
        const updatedCount = oldCount + 1; //add count for ingredient
        const updatedIngredients = { //create new JavaScript object
            ...this.state.ingredients //distribute properties of old ingredient state into new one
        };
        updatedIngredients[type] = updatedCount; //set value to updated count
        const priceAddition = INGREDIENT_PRICES[type] //fetch price of ingredient type
        const oldPrice = this.state.totalPrice; //get old price
        const newPrice = oldPrice + priceAddition; //add price to old price
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients}); //update states
        this.updatePurchaseState(updatedIngredients);
    }*/

    /*removed because Redux implemented this action
    //removing an ingredient
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; //get count of ingredient
        //check if ingredient count is 0
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1; //decrement count for ingredient
        const updatedIngredients = { //create new JavaScript object
            ...this.state.ingredients //distribute properties of old ingredient state into new one
        };
        updatedIngredients[type] = updatedCount; //set value to updated count
        const priceDeduction = INGREDIENT_PRICES[type] //fetch price of ingredient type
        const oldPrice = this.state.totalPrice; //get old price
        const newPrice = oldPrice - priceDeduction; //deduct price from old price
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients}); //update states
        this.updatePurchaseState(updatedIngredients);
    }*/

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
        /*remove because now get ingredients with Redux instead of query params
        //alert('You continue!');
        const queryParams = [];
        //loop through all the properties
        for (let i in this.state.ingredients) {
            //push each ingredients in queryParams
            //property name = property value
            //encode component so they can be used in URL - relevant for whitespace, etc.
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        //also encode price
        queryParams.push('price=' + this.state.totalPrice)
        //generate string of ingredients
        const queryString = queryParams.join('&');

        //push checkout page to the stack
        this.props.history.push({
            pathname:'/checkout',
            search: '?' + queryString //passes ingredients into URL
        });
        */
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

        /*removed because now not doing anything asynchronously when viewing modal (order summary)
        //if loading = true, then show spinner
        if(this.state.loading) {
            orderSummary = <Spinner />;
        }*/

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