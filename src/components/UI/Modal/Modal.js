import React, {Component} from 'react';
import classes from './Modal.module.css';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        //update if prop changes or its children changes
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    componentDidUpdate() {
        console.log('[Modal] DidUpdate');
    }
    
    render() {
        return (
            <Aux>
                <Backdrop show={this.props.show} backdropClicked={this.props.modalClosed}/>
                <div 
                    className={classes.Modal}
                    //use conditional to show/hide modal
                    style={{
                        //translateY(0) = position defined in CSS, -100vh (viewport height) slide outside screen
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default Modal;