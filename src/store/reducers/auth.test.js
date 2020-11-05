import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

describe('aith reducer', () => {
    //test if get the right initial state if pass an invalid action type to it
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });

    //test login
    it('should store the token upon login', () => {
        expect(reducer({
            //initial state
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        }, {
            //action with payload
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'some-token',
            userId: 'some-user-id'
        })).toEqual({
            //updated state
            token: 'some-token',
            userId: 'some-user-id',
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });
});