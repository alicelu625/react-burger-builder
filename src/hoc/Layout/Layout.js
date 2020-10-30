import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    sideDrawerToggleHandler = () => {
        //cleaner way of setting state based on old state
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    }

    render() {
        return (
            <Aux>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggleHandler}
                />
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}
                />
                <main className={classes.Content}>
                    {/*allows us to use layout component as a wrapper around core content component*/}
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        //true if token != null
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);