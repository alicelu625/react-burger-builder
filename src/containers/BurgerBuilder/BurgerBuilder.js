/*Burger Builder page containing graphical representation of burger,
build controls, etc.*/

import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = { //global variable
    lettuce: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: { //key: ingredient, value: amount
            lettuce: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4, //base price: $4 (no matter what ingredient)
        purchasable: false, //false until at least 1 ingredient added
        purchasing: false //false until Checkout button is clicked
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
        this.setState({purchasable: sum > 0}); //true if sum > 0
    }

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
    }

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
    }

    //when Checkout button is clicked
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    //when modal backdrop/or cancel button in order summary is clicked
    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    //when continue button in order summary is clicked
    purchaseContinueHandler = () => {
        alert('You continue!');
    }

    render () {
        //copy ingredients in immutable way - new object with properties of old object
        const disabledInfo = {
            ...this.state.ingredients
        };
        //loop through all keys in disabledInfo
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0; //true if <= 0
            // {lettuce: true, meat: false, ...}
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}> {/*show only if purchasing is true*/}
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        price={this.state.totalPrice}
                    />
                </Modal>
                <Burger ingredients={this.state.ingredients}/> {/*graphical representation of burger*/}
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    checkedOut = {this.purchaseHandler}
                /> 
            </Aux>
        );
    }
}

export default BurgerBuilder;