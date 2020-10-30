import React, {Component} from 'react';
import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: { //configuration - attributes set up for the chosen HTML tag
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ],
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        //prevent default to send a request (which reloads the form)
        event.preventDefault();
        //this.setState({loading: true}); //show spinner when continued
        //extract input value
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        //create order object
        const order = {
            ingredients: this.props.ings,
            price: this.props.price, //on real application, should calculate price on server
            orderData: formData,
            userId: this.props.userId
        }
        /*removed because Redux implemented this action
        //POST request
        axios.post('/orders.json', order) //path gets appended to baseURL path
            .then(response => {
                this.setState({loading: false}); //stop spinner
                //redirect once submitted
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false}); //stop spinner
            });*/
        this.props.onOrderBurger(order, this.props.token);
    }

    //check if form is valid
    checkValidity(value, rules) {
        let isValid = true;

        /*alternative to checking if element has validation rules (dropdown doesn't)
        //element is valid if no validation rules
        if (!rules) {
            return true;
        }*/

        //if empty string, then isValid is false
        if (rules.required) {
            isValid = value.trim() !== '' && isValid; //trim white spaces
        }
        //check minimum length
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        //check max length
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    //handle form user input
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm //copy object distributing all properties
        };
        //also clone properties inside of selected order form element deeply
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier] //distribute properties
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        //check if overall form is valid
        let formIsValid = true;
        //loop through all element's valid state
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        //update states
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render() {
        //turn orderForm object into array of input element we can loop through
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        //if not loading, then set form to form element
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched = {formElement.config.touched}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        //if loading, then show spinner
        if (this.props.loading) {
            form = <Spinner/>;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));