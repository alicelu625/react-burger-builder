/*The burger being rendered to the screen*/
import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    //turn ingredients object into array - extract keys of object & turn that into an array of keys
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => { //transform string value into array with as many elements as ingredients for an ingredient
                        //Ex. 2 cheese ingredients - transform cheese string into array with 2 elements
            //igKey = ingredient type, props.ingredients[igKey] = amount of ingredient
            return [...Array(props.ingredients[igKey])].map((_,i) => { //(type, index)
                return <BurgerIngredient key={igKey + i} type={igKey} />
            });
        })
        //flatten array - get array of inner array values
        //transform array into something else (takes in prev value & current value)
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []); 
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>;
    }
    
    return (
        <div className={classes.Burger}>
            {/*always have bread-top & bread-bottom*/}
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;