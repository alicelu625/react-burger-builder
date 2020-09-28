import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    //instance of withErrorHandler
    return class extends Component {
        state = {
            error: null
        }
        
        //executed when component is created
        UNSAFE_componentWillMount() { //or constructor()
            //when send request, clear any errors
            //store interceptor in properties for removal later
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            //set error upon response
            this.resInterceptor = axios.interceptors.response.use(res => res, error => { //return response
                this.setState({error: error});
            });
        }

        //executed when component no longer required
        componentWillUnmount () {
            //remove interceptors
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }
        
        //clear error when backdrop clicked
        errorConfirmedHandler = () => {
            this.setState({error: null})
        }

        render() {
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {/*only output error message if error isn't null*/}
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    {/*distribute any props the component might receive*/}
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}

export default withErrorHandler;