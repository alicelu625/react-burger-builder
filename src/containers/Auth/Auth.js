import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/auth';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: { //configuration - attributes set up for the chosen HTML tag
                    type: 'email',
                    placeholder: 'Email Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: true
    }

    //reset path if reach auth page while not building burger
    componentDidMount() {
        //if redirect to checkout even if not building a burger
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath(); //resets path to '/'
        }
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
    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls, //copies all elements in state controls
            [controlName]: {  //overwrite the control
                ...this.state.controls[controlName], //copy all properties
                //set properties
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({controls: updatedControls});
    }

    //when submit button clicked
    submitHandler = (event) => {
        event.preventDefault(); //prevent reloading the page
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    //when switch to sign in/sign up button clicked
    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup};
        });
    }

    render () {
        //turn orderForm object into array of input element we can loop through
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement => (
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
        ));

        //check if loading
        if (this.props.loading) {
            form = <Spinner/>;
        }

        //display error message
        let errorMessage = null; //default
        //if error, use error message from Firebase
        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        //if authenticated, Redirect
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>;
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">
                    SWITCH TO {this.state.isSignup ? 'SIGN IN' : 'SIGN UP'}
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);