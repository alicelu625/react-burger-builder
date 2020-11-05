import React, {Component} from 'react';

//takes in a function reference
const asyncComponent = (importComponent) => {
    return class extends Component {
        state = {
            component: null
        }

        //executes function only when component mounts
        componentDidMount() {
            importComponent()
                .then(cmp => {
                    this.setState({component:cmp.default});
                });
        }

        render() {
            const C = this.state.component;

            //if component is set, set C passing in any properties the component may contain
            return C ? <C {...this.props} /> : null;
        }
    }
}

export default asyncComponent;