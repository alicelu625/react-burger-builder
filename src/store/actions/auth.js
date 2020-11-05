import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as constants from '../../const';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

//async action creator
export const logout = () => {
    //remove token, expiration time, user id from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

//log user out after 1 hr
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        //dispatch logout action after expirationTime
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000); //reads milliseconds --> times 1000 to turn 3.6sec to 1 hr
    };
};

//async action creator
export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        //default url is the signup url
        let url = constants.FIREBASE_SIGNUP_URL;
        //if not in signup mode, set url to sign in url endpoint
        if (!isSignup) {
            url = constants.FIREBASE_SIGNIN_URL;
        }
        axios.post(url, authData)
            .then(response => {
                //store token & expiration time in local storage
                localStorage.setItem('token', response.data.idToken);
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('expirationDate', expirationDate);
                //store user id to be fetched upon reload
                localStorage.setItem('userId', response.data.localId);

                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                //get Firebase error message
                dispatch(authFail(err.response.data.error));
            });
    };
};

//redirect
export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

//check if user was logged in
export const authCheckState = () => {
    return dispatch => {
        //get token
        const token = localStorage.getItem('token');
        //if token is null (invalid)
        if (!token) {
            dispatch(logout());
        }
        else { //get expiration time
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            //if expiration date is passed (expired), then log out
            if (expirationDate <= new Date()) {
                dispatch(logout());
            }
            else { //expiration date hasn't passed, log in
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                //amount of time before logout
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }
        }
    }
}